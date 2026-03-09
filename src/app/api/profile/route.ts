import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/profile — get current user's profile
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !data) {
    // Return basic profile from auth metadata if DB profile doesn't exist yet
    return NextResponse.json({
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

  return NextResponse.json(data)
}

// PUT /api/profile — update current user's profile
export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const allowedFields = [
    'full_name',
    'specialization',
    'hospital_affiliation',
    'phone_number',
  ]

  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) updates[field] = body[field]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json(data)
}
