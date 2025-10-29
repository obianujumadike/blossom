'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaArrowLeft,
  FaFileSignature,
  FaCheck,
  FaTimes,
  FaEye,
  FaClock,
  FaExclamationTriangle,
  FaShieldAlt,
  FaDownload,
  FaEdit,
  FaPrint,
  FaUsers,
  FaCalendarAlt,
  FaHistory,
  FaLock,
  FaUnlock,
  FaComment,
  FaStethoscope,
  FaSearch,
  FaFilter,
  FaUserMd,
  FaHospital
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface ConsentRecord {
  id: string
  patientId: string
  patientName: string
  type: 'imaging_consent' | 'ai_analysis_consent' | 'data_sharing_consent' | 'research_consent'
  status: 'pending' | 'signed' | 'revoked' | 'expired'
  dateCreated: string
  dateSigned?: string
  dateExpiry?: string
  version: string
  signedBy?: string
  witnessedBy?: string
  caseId?: string
}

interface ReviewItem {
  id: string
  type: 'peer_review' | 'quality_assurance' | 'second_opinion' | 'audit_review'
  caseId: string
  patientName: string
  requestedBy: string
  assignedTo?: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dateRequested: string
  dateCompleted?: string
  comments?: string
  findings?: string
}

interface AuditEntry {
  id: string
  action: string
  performedBy: string
  timestamp: string
  details: string
  resourceType: 'case' | 'patient' | 'consent' | 'report'
  resourceId: string
  ipAddress: string
}

// Mock data
const mockConsents: ConsentRecord[] = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'Sarah Johnson',
    type: 'ai_analysis_consent',
    status: 'signed',
    dateCreated: '2024-10-25T10:00:00Z',
    dateSigned: '2024-10-25T14:30:00Z',
    dateExpiry: '2025-10-25T14:30:00Z',
    version: '2.1',
    signedBy: 'Sarah Johnson',
    witnessedBy: 'Dr. Sarah Smith',
    caseId: 'C001'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Maria Garcia',
    type: 'imaging_consent',
    status: 'pending',
    dateCreated: '2024-10-29T09:15:00Z',
    version: '2.1',
    caseId: 'C002'
  },
  {
    id: '3',
    patientId: 'P003',
    patientName: 'Jennifer Davis',
    type: 'research_consent',
    status: 'revoked',
    dateCreated: '2024-10-20T16:20:00Z',
    dateSigned: '2024-10-20T16:45:00Z',
    version: '2.0',
    signedBy: 'Jennifer Davis'
  }
]

const mockReviews: ReviewItem[] = [
  {
    id: '1',
    type: 'peer_review',
    caseId: 'C001',
    patientName: 'Sarah Johnson',
    requestedBy: 'Dr. Sarah Smith',
    assignedTo: 'Dr. Michael Chen',
    status: 'in_progress',
    priority: 'high',
    dateRequested: '2024-10-29T10:00:00Z',
    comments: 'Complex case requiring second opinion on BI-RADS 4 finding'
  },
  {
    id: '2',
    type: 'quality_assurance',
    caseId: 'C015',
    patientName: 'Lisa Williams',
    requestedBy: 'System',
    status: 'pending',
    priority: 'medium',
    dateRequested: '2024-10-29T08:30:00Z',
    comments: 'Random QA review for compliance monitoring'
  },
  {
    id: '3',
    type: 'second_opinion',
    caseId: 'C008',
    patientName: 'Emma Thompson',
    requestedBy: 'Dr. Sarah Smith',
    assignedTo: 'Dr. Lisa Rodriguez',
    status: 'completed',
    priority: 'urgent',
    dateRequested: '2024-10-28T14:20:00Z',
    dateCompleted: '2024-10-29T11:45:00Z',
    findings: 'Confirmed initial assessment. BI-RADS 2 - Benign finding.',
    comments: 'Concur with initial assessment. Well-defined fibroadenoma.'
  }
]

const mockAuditLog: AuditEntry[] = [
  {
    id: '1',
    action: 'Case Accessed',
    performedBy: 'Dr. Sarah Smith',
    timestamp: '2024-10-29T15:30:00Z',
    details: 'Viewed patient case C001 - Sarah Johnson',
    resourceType: 'case',
    resourceId: 'C001',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    action: 'Consent Signed',
    performedBy: 'Sarah Johnson',
    timestamp: '2024-10-29T14:20:00Z',
    details: 'AI Analysis Consent signed electronically',
    resourceType: 'consent',
    resourceId: 'CON001',
    ipAddress: '10.0.0.50'
  },
  {
    id: '3',
    action: 'Report Generated',
    performedBy: 'Dr. Sarah Smith',
    timestamp: '2024-10-29T12:15:00Z',
    details: 'Monthly report generated for October 2024',
    resourceType: 'report',
    resourceId: 'R001',
    ipAddress: '192.168.1.100'
  }
]

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'consents' | 'reviews' | 'audit'>('consents')
  const [consents] = useState<ConsentRecord[]>(mockConsents)
  const [reviews] = useState<ReviewItem[]>(mockReviews)
  const [auditLog] = useState<AuditEntry[]>(mockAuditLog)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    dateRange: { start: '', end: '' }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100'
      case 'revoked':
      case 'rejected':
        return 'text-red-600 bg-red-100'
      case 'expired':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getConsentTypeLabel = (type: string) => {
    switch (type) {
      case 'imaging_consent':
        return 'Imaging Consent'
      case 'ai_analysis_consent':
        return 'AI Analysis Consent'
      case 'data_sharing_consent':
        return 'Data Sharing Consent'
      case 'research_consent':
        return 'Research Participation'
      default:
        return type
    }
  }

  const getReviewTypeLabel = (type: string) => {
    switch (type) {
      case 'peer_review':
        return 'Peer Review'
      case 'quality_assurance':
        return 'Quality Assurance'
      case 'second_opinion':
        return 'Second Opinion'
      case 'audit_review':
        return 'Audit Review'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            
            <BossomLogo size="sm" />
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compliance & Review</h1>
              <p className="text-gray-600">Manage patient consent, peer reviews, and audit compliance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('consents')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'consents'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaFileSignature className="w-4 h-4" />
                  Patient Consent
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaUsers className="w-4 h-4" />
                  Peer Reviews
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'audit'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaHistory className="w-4 h-4" />
                  Audit Trail
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Patient Consent Tab */}
        {activeTab === 'consents' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consent Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className={componentStyles.input.base}
                    >
                      <option value="">All Types</option>
                      <option value="imaging_consent">Imaging Consent</option>
                      <option value="ai_analysis_consent">AI Analysis</option>
                      <option value="data_sharing_consent">Data Sharing</option>
                      <option value="research_consent">Research</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className={componentStyles.input.base}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="signed">Signed</option>
                      <option value="revoked">Revoked</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className={componentStyles.input.base}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className={componentStyles.input.base}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Records */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Consent Records</h2>
                  <span className="text-sm text-gray-500">{consents.length} records</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {consents.map((consent) => (
                    <div key={consent.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">{consent.patientName}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consent.status)}`}>
                              {consent.status}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {getConsentTypeLabel(consent.type)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Created:</span> {new Date(consent.dateCreated).toLocaleDateString()}
                            </div>
                            {consent.dateSigned && (
                              <div>
                                <span className="font-medium">Signed:</span> {new Date(consent.dateSigned).toLocaleDateString()}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Version:</span> {consent.version}
                            </div>
                            {consent.dateExpiry && (
                              <div>
                                <span className="font-medium">Expires:</span> {new Date(consent.dateExpiry).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {consent.signedBy && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Signed by:</span> {consent.signedBy}
                              {consent.witnessedBy && (
                                <span className="ml-4"><span className="font-medium">Witnessed by:</span> {consent.witnessedBy}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <FaDownload className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <FaPrint className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Peer Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Requests */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Review Requests</h2>
                  <button className={componentStyles.button.primary}>
                    Request Review
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">{review.patientName}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                              {review.status.replace('_', ' ')}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(review.priority)}`}>
                              {review.priority}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {getReviewTypeLabel(review.type)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                            <div>
                              <span className="font-medium">Case ID:</span> {review.caseId}
                            </div>
                            <div>
                              <span className="font-medium">Requested by:</span> {review.requestedBy}
                            </div>
                            {review.assignedTo && (
                              <div>
                                <span className="font-medium">Assigned to:</span> {review.assignedTo}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Requested:</span> {new Date(review.dateRequested).toLocaleDateString()}
                            </div>
                            {review.dateCompleted && (
                              <div>
                                <span className="font-medium">Completed:</span> {new Date(review.dateCompleted).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {review.comments && (
                            <div className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Comments:</span> {review.comments}
                            </div>
                          )}
                          
                          {review.findings && (
                            <div className="text-sm text-gray-700 p-3 bg-green-50 rounded-lg">
                              <span className="font-medium">Findings:</span> {review.findings}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FaEye className="w-4 h-4" />
                          </button>
                          {review.status === 'pending' && (
                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <FaUserMd className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <FaComment className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* Audit Log */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">System Audit Trail</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaShieldAlt className="w-4 h-4" />
                    <span>HIPAA Compliant Logging</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {auditLog.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{entry.action}</h3>
                          <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{entry.details}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            <span className="font-medium">User:</span> {entry.performedBy}
                          </span>
                          <span>
                            <span className="font-medium">Resource:</span> {entry.resourceType} ({entry.resourceId})
                          </span>
                          <span>
                            <span className="font-medium">IP:</span> {entry.ipAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className={componentStyles.button.secondary}>
                    Load More Entries
                  </button>
                </div>
              </div>
            </div>

            {/* Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={componentStyles.card.elevated}>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FaShieldAlt className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">HIPAA Compliance</h3>
                  <p className="text-sm text-gray-600">All activities logged and secured</p>
                </div>
              </div>

              <div className={componentStyles.card.elevated}>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FaLock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Data Encryption</h3>
                  <p className="text-sm text-gray-600">End-to-end encryption active</p>
                </div>
              </div>

              <div className={componentStyles.card.elevated}>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FaHistory className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Audit Retention</h3>
                  <p className="text-sm text-gray-600">7-year log retention policy</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}