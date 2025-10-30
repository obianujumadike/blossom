'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { FaHome, FaArrowLeft, FaArrowRight, FaStethoscope, FaHeartbeat } from 'react-icons/fa'
import { MdLocalHospital, MdHealthAndSafety } from 'react-icons/md'

export default function NotFound() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-bossom-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Medical Icons */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 animate-float">
          <FaStethoscope className="w-12 h-12 text-bossom-500" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <MdLocalHospital className="w-16 h-16 text-bossom-500" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float">
          <FaHeartbeat className="w-10 h-10 text-bossom-500" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delayed">
          <MdHealthAndSafety className="w-14 h-14 text-bossom-500" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
          <div className="w-32 h-32 rounded-full border-2 border-bossom-200"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-bounce">
          <BossomLogo size="xl" />
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-bossom-400 via-bossom-500 to-pink-500 bg-clip-text leading-none animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            It looks like this medical record has gone missing. Don't worry, 
            our medical team is on the case to help you find what you're looking for.
          </p>
        </div>

        {/* Medical-themed suggestions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-pink-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <FaStethoscope className="text-bossom-500" />
            Let's diagnose the issue
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bossom-500 rounded-full"></div>
              Check the URL for typos
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bossom-500 rounded-full"></div>
              The page may have been moved
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bossom-500 rounded-full"></div>
              Clear your browser cache
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bossom-500 rounded-full"></div>
              Contact our support team
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <button
            onClick={() => router.back()}
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white border-2 border-bossom-300 text-bossom-600 font-semibold py-4 px-8 rounded-xl hover:bg-bossom-50 hover:border-bossom-400 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Go Back
          </button>
          
                    <Link
            href="/dashboard"
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-bossom-500 text-white font-semibold py-4 px-8 rounded-xl hover:bg-bossom-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
          >
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Go to Dashboard
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          Need immediate assistance? Contact our{' '}
          <Link 
            href="/support" 
            className="text-bossom-600 hover:text-bossom-700 font-medium underline"
          >
            24/7 Medical Support Team
          </Link>
        </div>

        {/* Pulse Animation */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-bossom-500 rounded-full animate-ping"></div>
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