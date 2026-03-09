'use client'

import Link from 'next/link'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-bossom-pink-50 to-bossom-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <BossomLogo className="h-12" />
          </div>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Authentication Error
          </h1>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            There was a problem with the authentication process. This could be due to:
          </p>

          <ul className="text-sm text-gray-600 mb-6 space-y-2">
            <li>• Expired or invalid authentication code</li>
            <li>• Email verification link used more than once</li>
            <li>• Network connectivity issues</li>
          </ul>

          {/* Actions */}
          <div className="space-y-3">
            <Link 
              href="/login" 
              className="w-full bg-bossom-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-bossom-pink-700 transition-colors text-center block"
            >
              Try Signing In Again
            </Link>
            <Link 
              href="/signup" 
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
            >
              Create New Account
            </Link>
          </div>

          {/* Support */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Still having trouble? Contact support at{' '}
            <a href="mailto:support@blossom-ai.com" className="text-bossom-pink-600 hover:underline">
              support@blossom-ai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}