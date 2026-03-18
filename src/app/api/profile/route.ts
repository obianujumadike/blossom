import { createClient } from '@/lib/supabase/server'
import { api, log } from '@/lib/api/response'

// GET /api/profile — get current user's profile
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return api.unauthorized()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return api.serverError('Failed to fetch profile', error, { userId: user.id, dbCode: error.code })
    }

    if (!data) {
      // Return basic profile from auth metadata if DB profile doesn't exist yet
      log.warn('Profile not found in DB, falling back to auth metadata', { userId: user.id })
      return api.ok({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        medical_license_number: user.user_metadata?.medical_license_number || '',
        specialization: user.user_metadata?.specialization || 'Radiology',
        hospital_affiliation: user.user_metadata?.hospital_affiliation || '',
        role: user.user_metadata?.role || 'radiologist',
        is_verified: false,
        created_at: user.created_at,
      })
    }

    return api.ok(data)
  } catch (err) {
    return api.serverError('Unexpected error in GET /api/profile', err)
  }
}

// PUT /api/profile — update current user's profile
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return api.unauthorized()

    const body = await request.json().catch(() => null)
    if (!body) return api.badRequest('Invalid request body')

    const allowedFields = ['full_name', 'specialization', 'hospital_affiliation', 'phone_number']
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field]
    }

    if (Object.keys(updates).length === 0) {
      return api.badRequest('No valid fields to update')
    }

    log.info('PUT /api/profile', { userId: user.id, fields: Object.keys(updates) })

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return api.serverError('Failed to update profile', error, { userId: user.id, dbCode: error.code, dbDetail: error.details })
    }

    return api.ok(data)
  } catch (err) {
    return api.serverError('Unexpected error in PUT /api/profile', err)
  }
}
