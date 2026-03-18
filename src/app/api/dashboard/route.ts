import { createClient } from '@/lib/supabase/server'
import { api, log } from '@/lib/api/response'

// GET /api/dashboard — get dashboard stats for authenticated user
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return api.unauthorized()

    log.info('GET /api/dashboard', { userId: user.id })

    // Try the DB view first
    const { data: summary, error: summaryErr } = await supabase
      .from('dashboard_summary')
      .select('*')
      .eq('radiologist_id', user.id)
      .single()

    if (summaryErr && summaryErr.code !== 'PGRST116') {
      log.warn('dashboard_summary view error, falling back to manual query', {
        userId: user.id,
        dbCode: summaryErr.code,
        dbMessage: summaryErr.message,
      })
    }

    if (summary) {
      return api.ok(summary)
    }

    log.info('Dashboard summary view miss, computing manually', { userId: user.id })

    const [
      { count: totalCases, error: e1 },
      { count: pendingCases, error: e2 },
      { count: inProgressCases, error: e3 },
      { count: completedCases, error: e4 },
      { data: recentCases, error: e5 },
    ] = await Promise.all([
      supabase.from('cases').select('id', { count: 'exact', head: true }).eq('radiologist_id', user.id),
      supabase.from('cases').select('id', { count: 'exact', head: true }).eq('radiologist_id', user.id).eq('status', 'pending'),
      supabase.from('cases').select('id', { count: 'exact', head: true }).eq('radiologist_id', user.id).eq('status', 'in_progress'),
      supabase.from('cases').select('id', { count: 'exact', head: true }).eq('radiologist_id', user.id).eq('status', 'completed'),
      supabase
        .from('cases')
        .select(`*, patients ( patient_id, age, gender ), analyses ( birads_category, confidence_score, analysis_status )`)
        .eq('radiologist_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    for (const [label, err] of [
      ['total_cases', e1], ['pending_cases', e2], ['in_progress_cases', e3],
      ['completed_cases', e4], ['recent_cases', e5],
    ] as const) {
      if (err) {
        log.warn(`Dashboard fallback query failed for ${label}`, {
          userId: user.id,
          dbCode: (err as { code?: string }).code,
        })
      }
    }

    return api.ok({
      radiologist_id: user.id,
      total_cases: totalCases || 0,
      pending_cases: pendingCases || 0,
      in_progress_cases: inProgressCases || 0,
      completed_cases: completedCases || 0,
      recent_cases: recentCases || [],
    })
  } catch (err) {
    return api.serverError('Unexpected error in GET /api/dashboard', err)
  }
}
