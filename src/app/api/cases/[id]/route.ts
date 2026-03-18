import { createClient } from '@/lib/supabase/server'
import { api, log } from '@/lib/api/response'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/cases/[id] — single case with related data
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return api.unauthorized()

    log.info('GET /api/cases/[id]', { userId: user.id, caseId: id })

    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        patients ( * ),
        images ( * ),
        analyses (
          *,
          regions_of_interest ( * )
        )
      `)
      .eq('id', id)
      .eq('radiologist_id', user.id)
      .single()

    if (error || !data) {
      // PGRST116 = not found, anything else is a real DB error
      if (error && error.code !== 'PGRST116') {
        return api.serverError('Failed to fetch case', error, { userId: user.id, caseId: id, dbCode: error.code })
      }
      log.warn('Case not found or access denied', { userId: user.id, caseId: id, dbCode: error?.code })
      return api.notFound('Case not found')
    }

    return api.ok(data)
  } catch (err) {
    return api.serverError('Unexpected error in GET /api/cases/[id]', err)
  }
}

// PUT /api/cases/[id] — update case
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return api.unauthorized()

    const body = await request.json().catch(() => null)
    if (!body) return api.badRequest('Invalid request body')

    const allowedFields = ['status', 'priority', 'clinical_indication', 'case_notes', 'breast_density', 'is_urgent']
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field]
    }

    if (Object.keys(updates).length === 0) {
      return api.badRequest('No valid fields to update')
    }

    if (updates.status === 'completed') {
      updates.completed_at = new Date().toISOString()
    }

    log.info('PUT /api/cases/[id]', { userId: user.id, caseId: id, updates })

    const { data, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', id)
      .eq('radiologist_id', user.id)
      .select()
      .single()

    if (error || !data) {
      if (error && error.code === 'PGRST116') {
        return api.notFound('Case not found')
      }
      return api.serverError('Failed to update case', error, {
        userId: user.id,
        caseId: id,
        dbCode: error?.code,
        dbDetail: error?.details,
      })
    }

    return api.ok(data)
  } catch (err) {
    return api.serverError('Unexpected error in PUT /api/cases/[id]', err)
  }
}
