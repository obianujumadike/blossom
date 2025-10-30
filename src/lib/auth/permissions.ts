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

// Helper function to check if user has required permissions
export function checkMedicalAccess(userRole: string, requiredRoles: string[]): boolean {
  const roleHierarchy = {
    'super_admin': 10,
    'admin': 9,
    'medical_director': 8,
    'senior_radiologist': 7,
    'radiologist': 6,
    'resident': 5,
    'nurse_practitioner': 4,
    'nurse': 3,
    'technician': 2,
    'viewer': 1,
    'guest': 0
  }
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = Math.min(...requiredRoles.map(role => 
    roleHierarchy[role as keyof typeof roleHierarchy] || 10
  ))
  
  return userLevel >= requiredLevel
}

// Helper to get user-friendly role names
export function getRoleName(role: string): string {
  const roleNames = {
    'super_admin': 'Super Administrator',
    'admin': 'Administrator',
    'medical_director': 'Medical Director',
    'senior_radiologist': 'Senior Radiologist',
    'radiologist': 'Radiologist',
    'resident': 'Medical Resident',
    'nurse_practitioner': 'Nurse Practitioner',
    'nurse': 'Registered Nurse',
    'technician': 'Medical Technician',
    'viewer': 'Viewer',
    'guest': 'Guest'
  }
  
  return roleNames[role as keyof typeof roleNames] || 'Unknown Role'
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