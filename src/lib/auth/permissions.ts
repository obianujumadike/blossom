import { redirect } from 'next/navigation'

export type ForbiddenReason = 
  | 'not_authenticated'
  | 'insufficient_permissions'
  | 'license_expired'
  | 'account_suspended'
  | 'role_restricted'
  | 'ip_restricted'
  | 'session_expired'

export function redirectToForbidden(reason: ForbiddenReason = 'insufficient_permissions', returnUrl?: string) {
  const params = new URLSearchParams()
  params.set('reason', reason)
  
  if (returnUrl) {
    params.set('return', returnUrl)
  }
  
  redirect(`/forbidden?${params.toString()}`)
}

export function redirectToUnauthorized() {
  redirect('/unauthorized')
}

export function redirectTo404() {
  redirect('/not-found')
}

export type UserRole = 'admin' | 'radiologist'

const roleHierarchy: Record<UserRole, number> = {
  admin: 2,
  radiologist: 1,
}

// Helper function to check if user has required permissions
export function checkMedicalAccess(userRole: string, requiredRoles: string[]): boolean {
  const userLevel = roleHierarchy[userRole as UserRole] || 0
  const requiredLevel = Math.min(...requiredRoles.map(role =>
    roleHierarchy[role as UserRole] || 10
  ))
  return userLevel >= requiredLevel
}

// Helper to get user-friendly role names
export function getRoleName(role: string): string {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    radiologist: 'Radiologist',
  }
  return roleNames[role as UserRole] || 'Unknown Role'
}

// Helper to format error messages for logging
export function createAccessLog(
  userId: string, 
  attemptedResource: string, 
  reason: ForbiddenReason,
  userRole?: string,
  ip?: string
) {
  return {
    timestamp: new Date().toISOString(),
    userId,
    attemptedResource,
    reason,
    userRole,
    ip,
    level: 'security',
    message: `Access denied: User ${userId} (role: ${userRole}) attempted to access ${attemptedResource}. Reason: ${reason}`
  }
}