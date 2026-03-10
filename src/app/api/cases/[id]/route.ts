import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/cases/[id] — single case with related data
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/cases/[id] — update case
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  // Only allow updating specific fields
  const allowedFields = ['status', 'priority', 'clinical_indication', 'case_notes', 'breast_density', 'is_urgent']
  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) updates[field] = body[field]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  if (updates.status === 'completed') {
    updates.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', id)
    .eq('radiologist_id', user.id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 })
  }

  return NextResponse.json(data)
}
