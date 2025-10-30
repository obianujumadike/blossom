'use client'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import Link from 'next/link'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { signUpWithGoogle, signUpWithEmail } from '@/app/auth/actions'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await signUpWithGoogle()
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with Google')
      setIsLoading(false)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUpWithEmail(formData)
      
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      } else if (result?.success) {
        setSuccess(result.message || 'Account created successfully!')
        setIsLoading(false)
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign up')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <BossomLogo size="xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Join Bossom</h1>
          <p className="text-gray-600 text-lg">Create your professional account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 max-h-[90vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
          
          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-200 rounded-2xl py-4 px-6 text-gray-700 font-semibold hover:border-bossom-300 hover:bg-bossom-50 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 bg-white text-gray-500 font-medium">Or create account with email</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="Dr. Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="doctor@hospital.com"
              />
            </div>

            <div>
              <label htmlFor="medicalLicense" className="block text-sm font-semibold text-gray-700 mb-2">
                Medical License Number
              </label>
              <input
                id="medicalLicense"
                name="medicalLicense"
                type="text"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="MD123456"
              />
            </div>

            <div>
              <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization
              </label>
              <select
                id="specialization"
                name="specialization"
                defaultValue="Radiology"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
              >
                <option value="Radiology">Radiology</option>
                <option value="Oncology">Oncology</option>
                <option value="Surgery">Surgery</option>
                <option value="General Practice">General Practice</option>
              </select>
            </div>

            <div>
              <label htmlFor="hospitalAffiliation" className="block text-sm font-semibold text-gray-700 mb-2">
                Hospital Affiliation
              </label>
              <input
                id="hospitalAffiliation"
                name="hospitalAffiliation"
                type="text"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="General Hospital"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 pr-12 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 pr-12 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-bossom-500 text-white font-bold py-4 px-6 rounded-2xl hover:bg-bossom-600 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-bossom-600 hover:text-bossom-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-bossom-600 hover:text-bossom-700">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-bossom-600 hover:text-bossom-700">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}