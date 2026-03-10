import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/cases/[id]/images — upload an image for a case
export async function POST(request: Request, { params }: RouteParams) {
  const { id: caseId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify case ownership
  const { data: caseData } = await supabase
    .from('cases')
    .select('id')
    .eq('id', caseId)
    .eq('radiologist_id', user.id)
    .single()

  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const laterality = formData.get('laterality') as string | null
  const viewPosition = formData.get('viewPosition') as string | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/dicom', 'application/dicom']
  if (!allowedTypes.includes(file.type) && !file.name.endsWith('.dcm')) {
    return NextResponse.json({ error: 'Invalid file type. Accepted: JPEG, PNG, DICOM' }, { status: 400 })
  }

  // Max 50 MB
  const MAX_SIZE = 50 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 400 })
  }

  // Upload to Supabase Storage
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `cases/${caseId}/${Date.now()}-${safeName}`

  const { error: uploadErr } = await supabase.storage
    .from('mammograms')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadErr) {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('mammograms')
    .getPublicUrl(filePath)

  // Create image record
  const { data: image, error: dbErr } = await supabase
    .from('images')
    .insert({
      case_id: caseId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      laterality: (laterality as 'Left' | 'Right' | 'Bilateral') || null,
      view_position: viewPosition || null,
      upload_status: 'completed',
      is_primary: false,
    })
    .select()
    .single()

  if (dbErr || !image) {
    return NextResponse.json({ error: 'Failed to save image record' }, { status: 500 })
  }

  // Mark first image as primary
  const { count } = await supabase
    .from('images')
    .select('id', { count: 'exact', head: true })
    .eq('case_id', caseId)

  if (count === 1) {
    await supabase.from('images').update({ is_primary: true }).eq('id', image.id)
  }

  // Update case status to in_progress
  await supabase
    .from('cases')
    .update({ status: 'in_progress' })
    .eq('id', caseId)
    .eq('status', 'pending')

  return NextResponse.json({
    ...image,
    publicUrl: urlData.publicUrl,
  }, { status: 201 })
}

// GET /api/cases/[id]/images — list images for a case
export async function GET(_request: Request, { params }: RouteParams) {
  const { id: caseId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify case ownership
  const { data: caseData } = await supabase
    .from('cases')
    .select('id')
    .eq('id', caseId)
    .eq('radiologist_id', user.id)
    .single()

  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Append public URLs
  const imagesWithUrls = (data || []).map(img => {
    const { data: urlData } = supabase.storage
      .from('mammograms')
      .getPublicUrl(img.file_path)
    return { ...img, publicUrl: urlData.publicUrl }
  })

  return NextResponse.json(imagesWithUrls)
}
