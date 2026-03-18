'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaUpload,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowLeft
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { Select } from '@/components/ui/Select'
import { componentStyles } from '@/lib/design-system'

interface CaseRecord {
  id: string
  case_number: string
  status: string
  priority: string
  study_date: string
  clinical_indication: string | null
  referring_physician: string | null
  created_at: string
  patients: { patient_id: string; age: number; gender: string } | null
  images: Array<{ id: string }> | null
  analyses: Array<{ id: string; birads_category: number | null; confidence_score: number | null; analysis_status: string }> | null
}

export default function CasesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bossom-pink-600"></div></div>}>
      <CasesContent />
    </Suspense>
  )
}

function CasesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (priorityFilter !== 'all') params.set('priority', priorityFilter)
    if (searchTerm) params.set('search', searchTerm)

    setLoading(true)
    fetch(`/api/cases?${params}`)
      .then(r => r.json())
      .then(d => setCases(Array.isArray(d.data) ? d.data : []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false))
  }, [statusFilter, priorityFilter, searchTerm])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />
      case 'in_progress':
        return <FaClock className="w-4 h-4" />
      default:
        return <FaClock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600 bg-gray-100'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'normal':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'urgent':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to dashboard"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <BossomLogo size="sm" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Cases</h1>
                <p className="text-gray-600">Manage mammogram analysis cases</p>
              </div>
            </div>
            
            <Link
              href="/cases/new"
              className={`${componentStyles.button.primary} flex items-center gap-2`}
            >
              <FaPlus className="w-4 h-4" />
              New Case
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patients or MRN..."
                className={`${componentStyles.input.base} pl-10`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <Select
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>

            {/* Priority Filter */}
            <div className="sm:w-48">
              <Select
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'urgent', label: 'Urgent' },
                  { value: 'high', label: 'High' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'low', label: 'Low' },
                ]}
                value={priorityFilter}
                onChange={setPriorityFilter}
              />
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bossom-pink-600"></div>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Get started by creating a new patient case.'
                }
              </p>
              <div className="mt-6">
                <Link
                  href="/cases/new"
                  className={componentStyles.button.primary}
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  New Case
                </Link>
              </div>
            </div>
          ) : (
            cases.map((c) => {
              const birads = c.analyses?.find(a => a.birads_category !== null)
              const imageCount = c.images?.length ?? 0
              return (
                <div key={c.id} className={`${componentStyles.card.interactive} p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {c.case_number}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(c.priority)}`}>
                              {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Patient:</span> {c.patients?.patient_id ?? 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Age:</span> {c.patients?.age ?? 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Physician:</span> {c.referring_physician ?? 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {new Date(c.study_date).toLocaleDateString()}
                            </div>
                          </div>

                          {birads && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">BI-RADS {birads.birads_category}</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  AI Analysis Complete
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(c.status)}`}>
                            {getStatusIcon(c.status)}
                            {c.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/cases/${c.id}/upload`)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title={imageCount > 0 ? 'View Images' : 'Upload Images'}
                            >
                              <FaUpload className="w-4 h-4" />
                            </button>
                            
                            {imageCount > 0 && (
                              <button
                                onClick={() => router.push(`/cases/${c.id}/analysis`)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Analysis"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}