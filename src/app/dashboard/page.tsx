'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaPlus, 
  FaEye, 
  FaChartBar, 
  FaClock, 
  FaUsers, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaBell,
  FaDownload
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface DashboardStats {
  totalCases: number
  pendingReview: number
  completedToday: number
  averageAnalysisTime: string
  accuracyRate: number
}

interface RecentCase {
  id: string
  patientName: string
  age: number
  studyDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'review-needed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  biradsScore?: string
  findings?: string
}

interface Activity {
  id: string
  type: 'case_created' | 'analysis_completed' | 'review_submitted' | 'report_generated'
  message: string
  timestamp: string
  caseId?: string
}

// Mock data
const mockStats: DashboardStats = {
  totalCases: 1247,
  pendingReview: 23,
  completedToday: 18,
  averageAnalysisTime: '2.3s',
  accuracyRate: 94.2
}

const mockRecentCases: RecentCase[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    age: 45,
    studyDate: '2024-10-29',
    status: 'review-needed',
    priority: 'urgent',
    biradsScore: 'BI-RADS 4',
    findings: 'Suspicious mass detected'
  },
  {
    id: '2',
    patientName: 'Maria Garcia',
    age: 52,
    studyDate: '2024-10-29',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: '3',
    patientName: 'Jennifer Davis',
    age: 38,
    studyDate: '2024-10-28',
    status: 'completed',
    priority: 'low',
    biradsScore: 'BI-RADS 1',
    findings: 'No abnormalities detected'
  }
]

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'analysis_completed',
    message: 'AI analysis completed for Sarah Johnson',
    timestamp: '2024-10-29T14:30:00Z',
    caseId: '1'
  },
  {
    id: '2',
    type: 'case_created',
    message: 'New case created for Maria Garcia',
    timestamp: '2024-10-29T13:15:00Z',
    caseId: '2'
  },
  {
    id: '3',
    type: 'report_generated',
    message: 'Report generated for Jennifer Davis',
    timestamp: '2024-10-29T12:45:00Z',
    caseId: '3'
  }
]

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>(mockStats)
  const [recentCases] = useState<RecentCase[]>(mockRecentCases)
  const [activities] = useState<Activity[]>(mockActivities)

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'case_created':
        return <FaPlus className="w-4 h-4" />
      case 'analysis_completed':
        return <FaCheckCircle className="w-4 h-4" />
      case 'review_submitted':
        return <FaEye className="w-4 h-4" />
      case 'report_generated':
        return <FaDownload className="w-4 h-4" />
      default:
        return <FaBell className="w-4 h-4" />
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
                <h1 className="text-2xl font-bold text-gray-900">Clinical Dashboard</h1>
                <p className="text-gray-600">Welcome back, Dr. Smith</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${componentStyles.card.elevated} p-6`}>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCases.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">↗ 12% from last month</span>
            </div>
          </div>

          <div className={`${componentStyles.card.elevated} p-6`}>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingReview}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-red-600 font-medium">↑ 3 from yesterday</span>
            </div>
          </div>

          <div className={`${componentStyles.card.elevated} p-6`}>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">↗ 25% above average</span>
            </div>
          </div>

          <div className={`${componentStyles.card.elevated} p-6`}>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                <p className="text-3xl font-bold text-gray-900">{stats.accuracyRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">↗ 0.3% improvement</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Cases</h2>
                  <Link
                    href="/cases"
                    className="text-sm text-bossom-pink-600 hover:text-bossom-pink-500 font-medium"
                  >
                    View All Cases
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentCases.map((case_) => (
                    <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{case_.patientName}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                            {case_.priority}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                            {case_.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Age: {case_.age}</span>
                          <span>Date: {new Date(case_.studyDate).toLocaleDateString()}</span>
                          {case_.biradsScore && (
                            <span className="font-medium text-gray-900">{case_.biradsScore}</span>
                          )}
                        </div>
                        {case_.findings && (
                          <p className="mt-1 text-sm text-gray-700">{case_.findings}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/cases/${case_.id}`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="text-blue-600">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className="text-sm text-bossom-pink-600 hover:text-bossom-pink-500 font-medium">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${componentStyles.card.elevated} mt-6`}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    href="/cases/new"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FaPlus className="w-4 h-4 text-gray-400" />
                    <span>Create New Case</span>
                  </Link>
                  
                  <Link
                    href="/cases?status=review-needed"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FaExclamationTriangle className="w-4 h-4 text-gray-400" />
                    <span>Cases Requiring Review</span>
                  </Link>
                  
                  <Link
                    href="/reports"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FaChartBar className="w-4 h-4 text-gray-400" />
                    <span>Generate Reports</span>
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FaBell className="w-4 h-4 text-gray-400" />
                    <span>Notification Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}