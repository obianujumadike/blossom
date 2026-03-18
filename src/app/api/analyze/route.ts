import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/analyze
 * Accepts { imageId, caseId } and runs AI analysis.
 * If GCLOUD_MODEL_ENDPOINT is not set, returns a mock BI-RADS result.
 */
export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || !body.imageId || !body.caseId) {
    return NextResponse.json({ error: 'imageId and caseId are required' }, { status: 400 })
  }

  const { imageId, caseId } = body

  // Verify the case belongs to this user
  const { data: caseData, error: caseErr } = await supabase
    .from('cases')
    .select('id')
    .eq('id', caseId)
    .eq('radiologist_id', user.id)
    .single()

  if (caseErr || !caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Create pending analysis record
  const { data: analysis, error: insertErr } = await supabase
    .from('analyses')
    .insert({
      case_id: caseId,
      image_id: imageId,
      model_version: 'blossom-v1',
      analysis_status: 'processing',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (insertErr || !analysis) {
    return NextResponse.json({ error: 'Failed to create analysis record' }, { status: 500 })
  }

  try {
    let result: {
      birads_category: number
      confidence_score: number
      malignancy_probability: number
      overall_assessment: string
      regions: Array<{
        roi_type: string
        coordinates: Record<string, number>
        confidence_score: number
        malignancy_probability: number
        size_mm: number | null
        characteristics: Record<string, string> | null
        clinical_significance: string
      }>
    }

    if (process.env.GCLOUD_MODEL_ENDPOINT && process.env.GCLOUD_API_KEY) {
      // Real AI endpoint
      const resp = await fetch(process.env.GCLOUD_MODEL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GCLOUD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      })
      if (!resp.ok) throw new Error(`AI service returned ${resp.status}`)
      result = await resp.json()
    } else if (process.env.NODE_ENV === 'production') {
      await supabase.from('analyses').update({ analysis_status: 'failed' }).eq('id', analysis.id)
      return NextResponse.json(
        { error: 'AI model endpoint is not configured. Contact your administrator.' },
        { status: 503 }
      )
    } else {
      // Mock result for development only
      const categories = [1, 2, 3, 4]
      const birads = categories[Math.floor(Math.random() * categories.length)]
      const confidence = 0.75 + Math.random() * 0.2
      const malignancy = birads >= 4 ? 0.4 + Math.random() * 0.4 : Math.random() * 0.15
      const assessments: Record<number, string> = {
        1: 'Negative - No significant findings',
        2: 'Benign finding',
        3: 'Probably benign - Short interval follow-up suggested',
        4: 'Suspicious abnormality - Biopsy should be considered',
      }
      result = {
        birads_category: birads,
        confidence_score: Math.round(confidence * 100) / 100,
        malignancy_probability: Math.round(malignancy * 100) / 100,
        overall_assessment: assessments[birads],
        regions: birads >= 3
          ? [{
              roi_type: 'mass',
              coordinates: { x: 230, y: 180, width: 45, height: 40 },
              confidence_score: Math.round(confidence * 100) / 100,
              malignancy_probability: Math.round(malignancy * 100) / 100,
              size_mm: 8 + Math.round(Math.random() * 15),
              characteristics: { shape: 'irregular', margin: 'spiculated', density: 'high' },
              clinical_significance: birads >= 4 ? 'Requires biopsy' : 'Follow-up recommended',
            }]
          : [],
      }
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    // Update analysis record with results
    await supabase
      .from('analyses')
      .update({
        analysis_status: 'completed',
        birads_category: result.birads_category,
        confidence_score: result.confidence_score,
        malignancy_probability: result.malignancy_probability,
        overall_assessment: result.overall_assessment,
        completed_at: new Date().toISOString(),
      })
      .eq('id', analysis.id)

    // Insert regions of interest
    if (result.regions?.length) {
      await supabase.from('regions_of_interest').insert(
        result.regions.map(r => ({
          analysis_id: analysis.id,
          roi_type: r.roi_type,
          coordinates: r.coordinates,
          confidence_score: r.confidence_score,
          malignancy_probability: r.malignancy_probability,
          size_mm: r.size_mm,
          characteristics: r.characteristics,
          clinical_significance: r.clinical_significance,
        }))
      )
    }

    return NextResponse.json({
      analysisId: analysis.id,
      ...result,
    })
  } catch (err) {
    // Mark analysis as failed
    await supabase
      .from('analyses')
      .update({ analysis_status: 'failed' })
      .eq('id', analysis.id)

    console.error('Analysis failed:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
