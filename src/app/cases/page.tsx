'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface PatientCase {
  id: string
  patientName: string
  medicalRecordNumber: string
  dateCreated: string
  lastUpdated: string
  status: 'pending' | 'in-progress' | 'completed' | 'review-needed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  referringPhysician: string
  age: number
  hasImages: boolean
  aiAnalysisComplete: boolean
  biradsScore?: string
  findings?: string
}

// Mock data - in a real app, this would come from your database
const mockCases: PatientCase[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    medicalRecordNumber: 'MRN-2024-001',
    dateCreated: '2024-10-29',
    lastUpdated: '2024-10-29',
    status: 'review-needed',
    priority: 'urgent',
    referringPhysician: 'Dr. Smith',
    age: 45,
    hasImages: true,
    aiAnalysisComplete: true,
    biradsScore: 'BI-RADS 4',
    findings: 'Suspicious mass detected in upper outer quadrant'
  },
  {
    id: '2',
    patientName: 'Maria Garcia',
    medicalRecordNumber: 'MRN-2024-002',
    dateCreated: '2024-10-28',
    lastUpdated: '2024-10-29',
    status: 'in-progress',
    priority: 'medium',
    referringPhysician: 'Dr. Johnson',
    age: 52,
    hasImages: true,
    aiAnalysisComplete: false
  },
  {
    id: '3',
    patientName: 'Jennifer Davis',
    medicalRecordNumber: 'MRN-2024-003',
    dateCreated: '2024-10-27',
    lastUpdated: '2024-10-27',
    status: 'completed',
    priority: 'low',
    referringPhysician: 'Dr. Wilson',
    age: 38,
    hasImages: true,
    aiAnalysisComplete: true,
    biradsScore: 'BI-RADS 1',
    findings: 'No abnormalities detected'
  }
]

export default function CasesPage() {
  const router = useRouter()
  const [cases, setCases] = useState<PatientCase[]>(mockCases)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || case_.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="w-4 h-4" />
      case 'in-progress':
        return <FaClock className="w-4 h-4" />
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />
      case 'review-needed':
        return <FaExclamationTriangle className="w-4 h-4" />
      default:
        return <FaClock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600 bg-gray-100'
      case 'in-progress':
        return 'text-blue-600 bg-blue-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'review-needed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
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
              <select
                className={componentStyles.input.base}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="review-needed">Review Needed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="sm:w-48">
              <select
                className={componentStyles.input.base}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid gap-6">
          {filteredCases.length === 0 ? (
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
            filteredCases.map((case_) => (
              <div key={case_.id} className={`${componentStyles.card.interactive} p-6`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {case_.patientName}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                            {case_.priority.charAt(0).toUpperCase() + case_.priority.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">MRN:</span> {case_.medicalRecordNumber}
                          </div>
                          <div>
                            <span className="font-medium">Age:</span> {case_.age}
                          </div>
                          <div>
                            <span className="font-medium">Physician:</span> {case_.referringPhysician}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {new Date(case_.dateCreated).toLocaleDateString()}
                          </div>
                        </div>

                        {case_.biradsScore && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{case_.biradsScore}</span>
                              {case_.aiAnalysisComplete && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  AI Analysis Complete
                                </span>
                              )}
                            </div>
                            {case_.findings && (
                              <p className="text-sm text-gray-600">{case_.findings}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(case_.status)}`}>
                          {getStatusIcon(case_.status)}
                          {case_.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/cases/${case_.id}`)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Case"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => router.push(`/cases/${case_.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Case"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {/* Handle download */}}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download Report"
                          >
                            <FaDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}