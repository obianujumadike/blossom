'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { 
  FaShieldAlt, 
  FaLock, 
  FaUserMd, 
  FaHome, 
  FaArrowLeft, 
  FaExclamationTriangle,
  FaStethoscope,
  FaIdBadge,
  FaSignInAlt
} from 'react-icons/fa'
import { MdSecurity, MdVerifiedUser, MdHealthAndSafety } from 'react-icons/md'

function ForbiddenContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const reason = searchParams.get('reason') || 'insufficient_permissions'
  const returnUrl = searchParams.get('return') || '/dashboard'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getReasonMessage = () => {
    switch (reason) {
      case 'not_authenticated':
        return {
          title: 'Authentication Required',
          description: 'Please sign in with your medical credentials to access this area.',
          color: 'blue'
        }
      case 'insufficient_permissions':
        return {
          title: 'Access Restricted',
          description: 'Your current role does not have permission to access this medical area.',
          color: 'red'
        }
      case 'license_expired':
        return {
          title: 'License Verification Required',
          description: 'Your medical license appears to be expired or requires verification.',
          color: 'amber'
        }
      case 'account_suspended':
        return {
          title: 'Account Suspended',
          description: 'Your account has been temporarily suspended. Contact administration.',
          color: 'red'
        }
      default:
        return {
          title: 'Access Denied',
          description: 'You do not have permission to access this resource.',
          color: 'red'
        }
    }
  }

  const { title, description, color } = getReasonMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Security Icons */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 animate-float">
          <FaShieldAlt className="w-12 h-12 text-red-500" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <MdSecurity className="w-16 h-16 text-red-500" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float">
          <FaLock className="w-10 h-10 text-red-500" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delayed">
          <MdVerifiedUser className="w-14 h-14 text-red-500" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BossomLogo size="xl" />
        </div>

        {/* Security Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className={`w-24 h-24 bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-full flex items-center justify-center shadow-xl animate-pulse`}>
              <FaShieldAlt className={`w-12 h-12 text-${color}-600`} />
            </div>
            <div className="absolute -top-2 -right-2">
              <FaExclamationTriangle className="w-6 h-6 text-amber-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* 403 Number */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text leading-none">
            403
          </h1>
        </div>

        {/* Dynamic Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Conditional Authentication Required */}
        {reason === 'not_authenticated' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <FaSignInAlt className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-800 mb-2">Authentication Required</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  This medical area requires you to be signed in with verified healthcare credentials. 
                  Please authenticate to continue.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* HIPAA Compliance Notice for other reasons */}
        {reason !== 'not_authenticated' && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-r-xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <MdHealthAndSafety className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-red-800 mb-2">HIPAA Compliance Notice</h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  Patient data and medical records are protected under federal law. 
                  Access is restricted to authorized healthcare professionals only.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          {reason === 'not_authenticated' ? (
            <>
              <Link
                href="/login"
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <FaSignInAlt className="group-hover:scale-110 transition-transform duration-200" />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white border-2 border-blue-300 text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <FaUserMd className="group-hover:scale-110 transition-transform duration-200" />
                Register as Healthcare Professional
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => router.back()}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                Go Back
              </button>
              
              <Link
                href={returnUrl}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-bossom-500 text-white font-semibold py-4 px-8 rounded-xl hover:bg-bossom-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <FaHome className="group-hover:scale-110 transition-transform duration-200" />
                Safe Area
              </Link>
              
              <Link
                href="/support"
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-amber-500 text-white font-semibold py-4 px-8 rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <FaUserMd className="group-hover:scale-110 transition-transform duration-200" />
                Request Access
              </Link>
            </>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Emergency Access:</strong> If this is a medical emergency requiring immediate access, 
            contact{' '}
            <Link 
              href="tel:+1-800-MEDICAL" 
              className="text-amber-700 hover:text-amber-900 font-medium underline"
            >
              Emergency Medical Access: 1-800-MEDICAL
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full shadow-lg">
            <FaLock className="w-3 h-3 text-red-600" />
            <span className="text-xs font-medium text-red-700">SECURED MEDICAL AREA</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  )
}

export default function ForbiddenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ForbiddenContent />
    </Suspense>
  )
}