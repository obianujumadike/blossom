'use client'

import { useAuth } from './context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: string
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requiredRole,
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Check authentication
      if (requireAuth && !user) {
        router.push(redirectTo)
        return
      }

      // Check role requirements
      if (requiredRole && profile?.role !== requiredRole) {
        const roleHierarchy: Record<string, number> = {
          admin: 2,
          radiologist: 1,
        }

        const userLevel = roleHierarchy[profile?.role ?? ''] || 0
        const requiredLevel = roleHierarchy[requiredRole] || 0

        if (userLevel < requiredLevel) {
          router.push('/forbidden?reason=insufficient_permissions')
          return
        }
      }
    }
  }, [user, profile, loading, requireAuth, requiredRole, router, redirectTo])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bossom-pink-600"></div>
      </div>
    )
  }

  // Don't render children until auth check is complete
  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
}