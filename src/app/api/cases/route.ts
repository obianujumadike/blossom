import { createClient } from '@/lib/supabase/server'
import { api, log } from '@/lib/api/response'

// GET /api/cases — list cases for authenticated radiologist
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return api.unauthorized()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    log.info('GET /api/cases', { userId: user.id, status, priority, search })

    let query = supabase
      .from('cases')
      .select(`
        *,
        patients ( id, patient_id, age, gender ),
        images ( id ),
        analyses ( id, birads_category, confidence_score, analysis_status )
      `)
      .eq('radiologist_id', user.id)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') query = query.eq('status', status)
    if (priority && priority !== 'all') query = query.eq('priority', priority)
    if (search) {
      // Also search by patient MRN (patient_id on the patients table)
      const { data: matchingPatients } = await supabase
        .from('patients')
        .select('id')
        .ilike('patient_id', `%${search}%`)

      const patientIds = (matchingPatients ?? []).map((p: { id: string }) => p.id)

      const baseFilter = `case_number.ilike.%${search}%,clinical_indication.ilike.%${search}%`
      query = patientIds.length > 0
        ? query.or(`${baseFilter},patient_id.in.(${patientIds.join(',')})`)
        : query.or(baseFilter)
    }

    const { data, error } = await query

    if (error) {
      return api.serverError('Failed to fetch cases', error, { userId: user.id, dbCode: error.code })
    }

    return api.ok(data)
  } catch (err) {
    return api.serverError('Unexpected error in GET /api/cases', err)
  }
}

// POST /api/cases — create a new case with patient
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return api.unauthorized()

    const body = await request.json().catch(() => null)
    if (!body) return api.badRequest('Invalid request body')

    const {
      patientId,
      patientAge,
      patientGender,
      clinicalIndication,
      referringPhysician,
      priority,
      studyType,
      breastDensity,
      caseNotes,
      clinicalHistory,
      familyHistory,
      medications,
      priorMammograms,
    } = body

    if (!patientId || !patientAge) {
      return api.badRequest('Patient ID and age are required')
    }

    log.info('POST /api/cases', { userId: user.id, patientId, patientAge, patientGender })

    // Look up existing patient — PGRST116 = "no rows" (expected), any other error = real failure
    const { data: existingPatient, error: lookupErr } = await supabase
      .from('patients')
      .select('id')
      .eq('patient_id', patientId)
      .single()

    if (lookupErr && lookupErr.code !== 'PGRST116') {
      return api.serverError('Failed to look up patient record', lookupErr, {
        userId: user.id,
        patientId,
        dbCode: lookupErr.code,
        dbDetail: lookupErr.details,
      })
    }

    let dbPatientId: string

    if (existingPatient) {
      dbPatientId = existingPatient.id
      log.info('Found existing patient', { userId: user.id, patientId, dbPatientId })
    } else {
      const { data: newPatient, error: patientErr } = await supabase
        .from('patients')
        .insert({
          patient_id: patientId,
          age: Number(patientAge),
          gender: patientGender || 'Female',
          created_by: user.id,
        })
        .select('id')
        .single()

      if (patientErr || !newPatient) {
        return api.serverError('Failed to create patient record', patientErr, {
          userId: user.id,
          patientId,
          patientAge,
          patientGender,
          dbCode: patientErr?.code,
          dbDetail: patientErr?.details,
        })
      }
      dbPatientId = newPatient.id
      log.info('Created new patient', { userId: user.id, patientId, dbPatientId })
    }

    const caseNumber = `BLS-${Date.now().toString(36).toUpperCase()}`

    log.info('Inserting case', { userId: user.id, caseNumber, dbPatientId })

    const { data: newCase, error: caseErr } = await supabase
      .from('cases')
      .insert({
        case_number: caseNumber,
        patient_id: dbPatientId,
        radiologist_id: user.id,
        status: 'pending',
        priority: priority || 'normal',
        clinical_indication: clinicalIndication || null,
        referring_physician: referringPhysician || null,
        study_date: new Date().toISOString().split('T')[0],
        study_type: studyType || 'Screening Mammogram',
        breast_density: breastDensity || null,
        case_notes: caseNotes || null,
      })
      .select()
      .single()

    if (caseErr || !newCase) {
      return api.serverError('Failed to create case', caseErr, {
        userId: user.id,
        caseNumber,
        dbPatientId,
        dbCode: caseErr?.code,
        dbDetail: caseErr?.details,
        dbHint: caseErr?.hint,
      })
    }

    log.info('Case created', { userId: user.id, caseId: newCase.id, caseNumber })

    // Save clinical history if provided
    if (clinicalHistory || familyHistory || medications || priorMammograms) {
      const { error: historyErr } = await supabase.from('patient_clinical_history').insert({
        patient_id: dbPatientId,
        clinical_notes: clinicalHistory || null,
        current_medications: medications || null,
        previous_mammograms_results: priorMammograms !== 'unknown' ? priorMammograms : null,
        risk_factors: familyHistory ? { family_history: familyHistory } : null,
      })
      if (historyErr) {
        log.warn('Failed to save clinical history (case was still created)', {
          userId: user.id,
          caseId: newCase.id,
          dbCode: historyErr.code,
          dbMessage: historyErr.message,
        })
      }
    }

    return api.created(newCase, 'Case created successfully')
  } catch (err) {
    return api.serverError('Unexpected error in POST /api/cases', err)
  }
}
