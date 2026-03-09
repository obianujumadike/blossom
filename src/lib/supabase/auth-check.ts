import { createClient } from './server'

/**
 * Validates the current user session for API routes.
 * Returns the authenticated user or null.
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}
