import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/dashboard — get dashboard stats for authenticated user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Try the DB view first
  const { data: summary } = await supabase
    .from('dashboard_summary')
    .select('*')
    .eq('radiologist_id', user.id)
    .single()

  if (summary) {
    return NextResponse.json(summary)
  }

  // Fallback: compute manually
  const { count: totalCases } = await supabase
    .from('cases')
    .select('id', { count: 'exact', head: true })
    .eq('radiologist_id', user.id)

  const { count: pendingCases } = await supabase
    .from('cases')
    .select('id', { count: 'exact', head: true })
    .eq('radiologist_id', user.id)
    .eq('status', 'pending')

  const { count: inProgressCases } = await supabase
    .from('cases')
    .select('id', { count: 'exact', head: true })
    .eq('radiologist_id', user.id)
    .eq('status', 'in_progress')

  const { count: completedCases } = await supabase
    .from('cases')
    .select('id', { count: 'exact', head: true })
    .eq('radiologist_id', user.id)
    .eq('status', 'completed')

  const { data: recentCases } = await supabase
    .from('cases')
    .select(`
      *,
      patients ( patient_id, age, gender ),
      analyses ( birads_category, confidence_score, analysis_status )
    `)
    .eq('radiologist_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    radiologist_id: user.id,
    total_cases: totalCases || 0,
    pending_cases: pendingCases || 0,
    in_progress_cases: inProgressCases || 0,
    completed_cases: completedCases || 0,
    recent_cases: recentCases || [],
  })
}
