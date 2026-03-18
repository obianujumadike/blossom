import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cases — list cases for authenticated radiologist
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const search = searchParams.get('search')

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

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (priority && priority !== 'all') {
    query = query.eq('priority', priority)
  }
  if (search) {
    query = query.or(`case_number.ilike.%${search}%,clinical_indication.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/cases — create a new case with patient
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

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
    return NextResponse.json({ error: 'Patient ID and age are required' }, { status: 400 })
  }

  // Create or find patient
  const { data: existingPatient } = await supabase
    .from('patients')
    .select('id')
    .eq('patient_id', patientId)
    .single()

  let dbPatientId: string

  if (existingPatient) {
    dbPatientId = existingPatient.id
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
      return NextResponse.json({ error: 'Failed to create patient record' }, { status: 500 })
    }
    dbPatientId = newPatient.id
  }

  // Generate case number
  const caseNumber = `BLS-${Date.now().toString(36).toUpperCase()}`

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
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 })
  }

  // Save clinical history if provided
  if (clinicalHistory || familyHistory || medications || priorMammograms) {
    await supabase.from('patient_clinical_history').insert({
      patient_id: dbPatientId,
      clinical_notes: clinicalHistory || null,
      current_medications: medications || null,
      previous_mammograms_results: priorMammograms !== 'unknown' ? priorMammograms : null,
      risk_factors: familyHistory ? { family_history: familyHistory } : null,
    })
  }

  return NextResponse.json(newCase, { status: 201 })
}
