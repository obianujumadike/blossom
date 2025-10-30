'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import { 
  FaArrowLeft,
  FaCloudUploadAlt,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaTrash,
  FaUpload,
  FaCertificate,
  FaIdCard,
  FaGraduationCap,
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface Document {
  id: string
  type: 'medical_license' | 'board_certification' | 'diploma' | 'continuing_education' | 'malpractice_insurance'
  name: string
  fileName: string
  uploadDate: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired'
  expiryDate?: string
  notes?: string
  size: number
}

interface VerificationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  requiredDocuments: string[]
  completedDate?: string
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'medical_license',
    name: 'Medical License - New York',
    fileName: 'ny_medical_license.pdf',
    uploadDate: '2024-10-25T10:00:00Z',
    status: 'approved',
    expiryDate: '2025-12-31',
    size: 2048000
  },
  {
    id: '2',
    type: 'board_certification',
    name: 'American Board of Radiology Certificate',
    fileName: 'radiology_board_cert.pdf',
    uploadDate: '2024-10-26T14:30:00Z',
    status: 'under_review',
    expiryDate: '2026-06-30',
    size: 1536000
  },
  {
    id: '3',
    type: 'continuing_education',
    name: 'CME Credits 2024',
    fileName: 'cme_2024.pdf',
    uploadDate: '2024-10-28T09:15:00Z',
    status: 'pending',
    size: 512000
  }
]

const mockVerificationSteps: VerificationStep[] = [
  {
    id: '1',
    title: 'Document Upload',
    description: 'Upload required medical credentials and documentation',
    status: 'completed',
    requiredDocuments: ['Medical License', 'Board Certification'],
    completedDate: '2024-10-26T14:30:00Z'
  },
  {
    id: '2',
    title: 'Primary Verification',
    description: 'Initial review and validation of submitted documents',
    status: 'in_progress',
    requiredDocuments: ['Medical License', 'Board Certification']
  },
  {
    id: '3',
    title: 'Credential Verification',
    description: 'Third-party verification with issuing authorities',
    status: 'pending',
    requiredDocuments: ['Medical License', 'Board Certification', 'Diploma']
  },
  {
    id: '4',
    title: 'Final Approval',
    description: 'Administrative approval and account activation',
    status: 'pending',
    requiredDocuments: ['All documents verified']
  }
]

const documentTypes = [
  { value: 'medical_license', label: 'Medical License', icon: FaIdCard, required: true },
  { value: 'board_certification', label: 'Board Certification', icon: FaCertificate, required: true },
  { value: 'diploma', label: 'Medical Diploma', icon: FaGraduationCap, required: true },
  { value: 'continuing_education', label: 'Continuing Education', icon: FaStethoscope, required: false },
  { value: 'malpractice_insurance', label: 'Malpractice Insurance', icon: FaFileAlt, required: false }
]

export default function LicenseVerificationPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [verificationSteps] = useState<VerificationStep[]>(mockVerificationSteps)
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('medical_license')
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9)
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const progress = (prev[fileId] || 0) + 10
          if (progress >= 100) {
            clearInterval(interval)
            
            // Add document to list
            const newDocument: Document = {
              id: fileId,
              type: selectedDocumentType as any,
              name: documentTypes.find(t => t.value === selectedDocumentType)?.label || 'Document',
              fileName: file.name,
              uploadDate: new Date().toISOString(),
              status: 'pending',
              size: file.size
            }
            
            setDocuments(prev => [...prev, newDocument])
            
            // Remove from progress tracking
            setTimeout(() => {
              setUploadProgress(prev => {
                const { [fileId]: removed, ...rest } = prev
                return rest
              })
            }, 1000)
            
            return { ...prev, [fileId]: 100 }
          }
          return { ...prev, [fileId]: progress }
        })
      }, 200)
    })
  }, [selectedDocumentType])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'under_review':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      case 'expired':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <FaCheckCircle className="w-4 h-4 text-green-600" />
      case 'under_review':
      case 'in_progress':
        return <FaClock className="w-4 h-4 text-blue-600" />
      case 'pending':
        return <FaClock className="w-4 h-4 text-yellow-600" />
      case 'rejected':
      case 'failed':
        return <FaTimesCircle className="w-4 h-4 text-red-600" />
      case 'expired':
        return <FaExclamationTriangle className="w-4 h-4 text-gray-600" />
      default:
        return <FaClock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  const getRequiredDocumentsStatus = () => {
    const requiredTypes = documentTypes.filter(type => type.required).map(type => type.value)
    const uploadedRequiredTypes = documents
      .filter(doc => requiredTypes.includes(doc.type) && doc.status !== 'rejected')
      .map(doc => doc.type)
    
    return {
      total: requiredTypes.length,
      completed: new Set(uploadedRequiredTypes).size
    }
  }

  const requiredStatus = getRequiredDocumentsStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            
            <BossomLogo size="sm" />
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">License Verification</h1>
              <p className="text-gray-600">Upload and manage your medical credentials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
                <p className="text-gray-600 mt-1">Upload your medical credentials for verification</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className={componentStyles.input.base}
                  >
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} {type.required && '(Required)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragActive 
                      ? 'border-bossom-pink-400 bg-bossom-pink-50' 
                      : 'border-gray-300 hover:border-bossom-pink-400 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop files here...' : 'Upload Documents'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, JPG, PNG (Max 10MB each)
                  </p>
                </div>

                {/* Upload Progress */}
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div key={fileId} className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Uploading...</span>
                      <span className="text-sm text-blue-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Uploaded Documents</h2>
                <p className="text-gray-600 mt-1">Review and manage your submitted credentials</p>
              </div>
              
              <div className="p-6">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((document) => {
                      const docType = documentTypes.find(t => t.value === document.type)
                      return (
                        <div key={document.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-gray-100 rounded-lg">
                                {docType?.icon ? <docType.icon className="w-5 h-5 text-gray-600" /> : <FaFileAlt className="w-5 h-5 text-gray-600" />}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900">{document.name}</h3>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                                    {document.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{document.fileName}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                  <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                                  <span>Size: {formatFileSize(document.size)}</span>
                                  {document.expiryDate && (
                                    <span>Expires: {new Date(document.expiryDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                                {document.notes && (
                                  <p className="text-sm text-red-600 mt-2">{document.notes}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <FaEye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <FaDownload className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDocument(document.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Verification Progress</h3>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Required Documents</span>
                    <span className="text-sm text-gray-600">{requiredStatus.completed}/{requiredStatus.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-bossom-pink-600 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${(requiredStatus.completed / requiredStatus.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {verificationSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        {step.completedDate && (
                          <p className="text-xs text-green-600 mt-1">
                            Completed: {new Date(step.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {documentTypes.filter(type => type.required).map((type) => {
                    const hasDocument = documents.some(doc => doc.type === type.value && doc.status !== 'rejected')
                    return (
                      <div key={type.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <type.icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{type.label}</span>
                        </div>
                        {hasDocument ? (
                          <FaCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <FaTimes className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Document Requirements</h4>
                    <p className="text-sm text-blue-700">
                      All documents must be current, legible, and issued by recognized authorities.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-1">Verification Timeline</h4>
                    <p className="text-sm text-yellow-700">
                      Document verification typically takes 3-5 business days.
                    </p>
                  </div>
                  
                  <button className={componentStyles.button.secondary}>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}