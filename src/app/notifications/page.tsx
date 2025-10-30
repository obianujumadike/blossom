'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaArrowLeft,
  FaBell,
  FaCheck,
  FaTimes,
  FaEye,
  FaTrash,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaFileAlt,
  FaStethoscope,
  FaCog,
  FaEnvelope,
  FaMobile,
  FaDesktop,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaSpinner
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface Notification {
  id: string
  type: 'case_alert' | 'system' | 'review_reminder' | 'report_ready' | 'verification' | 'appointment'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  caseId?: string
  metadata?: {
    patientName?: string
    biradsScore?: string
    reportType?: string
  }
}

interface NotificationSettings {
  email: {
    caseAlerts: boolean
    systemNotifications: boolean
    reviewReminders: boolean
    reportReady: boolean
    weeklyDigest: boolean
  }
  push: {
    caseAlerts: boolean
    systemNotifications: boolean
    reviewReminders: boolean
    reportReady: boolean
  }
  frequency: {
    immediateAlerts: boolean
    dailyDigest: boolean
    weeklyDigest: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'case_alert',
    title: 'High Priority Case Requires Review',
    message: 'BI-RADS 4 case for Sarah Johnson needs immediate attention',
    timestamp: '2024-10-29T15:30:00Z',
    read: false,
    priority: 'urgent',
    actionUrl: '/cases/1',
    caseId: '1',
    metadata: {
      patientName: 'Sarah Johnson',
      biradsScore: 'BI-RADS 4'
    }
  },
  {
    id: '2',
    type: 'report_ready',
    title: 'Monthly Report Generated',
    message: 'October 2024 monthly analysis report is ready for download',
    timestamp: '2024-10-29T14:20:00Z',
    read: false,
    priority: 'medium',
    actionUrl: '/reports',
    metadata: {
      reportType: 'Monthly Analysis'
    }
  },
  {
    id: '3',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance on November 1st from 2:00-4:00 AM EST',
    timestamp: '2024-10-29T12:00:00Z',
    read: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'verification',
    title: 'License Verification Approved',
    message: 'Your medical license has been successfully verified',
    timestamp: '2024-10-29T10:15:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'review_reminder',
    title: 'Pending Reviews',
    message: 'You have 3 cases pending review for more than 24 hours',
    timestamp: '2024-10-29T09:00:00Z',
    read: false,
    priority: 'high',
    actionUrl: '/cases?status=review-needed'
  }
]

const mockSettings: NotificationSettings = {
  email: {
    caseAlerts: true,
    systemNotifications: true,
    reviewReminders: true,
    reportReady: false,
    weeklyDigest: true
  },
  push: {
    caseAlerts: true,
    systemNotifications: false,
    reviewReminders: true,
    reportReady: true
  },
  frequency: {
    immediateAlerts: true,
    dailyDigest: false,
    weeklyDigest: true
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00'
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings)
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications')
  const [filter, setFilter] = useState({
    type: '',
    priority: '',
    read: ''
  })
  const [searchQuery, setSearchQuery] = useState('')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'case_alert':
        return <FaExclamationTriangle className="w-5 h-5 text-red-600" />
      case 'system':
        return <FaInfoCircle className="w-5 h-5 text-blue-600" />
      case 'review_reminder':
        return <FaClock className="w-5 h-5 text-yellow-600" />
      case 'report_ready':
        return <FaFileAlt className="w-5 h-5 text-green-600" />
      case 'verification':
        return <FaCheckCircle className="w-5 h-5 text-green-600" />
      case 'appointment':
        return <FaCalendarAlt className="w-5 h-5 text-purple-600" />
      default:
        return <FaBell className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50'
      case 'high':
        return 'border-l-orange-500 bg-orange-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const updateSettings = (section: keyof NotificationSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter.type && notif.type !== filter.type) return false
    if (filter.priority && notif.priority !== filter.priority) return false
    if (filter.read === 'read' && !notif.read) return false
    if (filter.read === 'unread' && notif.read) return false
    if (searchQuery && !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notif.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const unreadCount = notifications.filter(notif => !notif.read).length

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
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Manage your alerts and notification preferences</p>
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
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* <FaBell className="w-4 h-4" /> */}
                  Notifications
                  {/* {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )} */}
                </div>
              </button>
              
              {/* <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaCog className="w-4 h-4" />
                  Settings
                </div>
              </button> */}
            </nav>
          </div>
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Filters & Actions */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${componentStyles.input.base} pl-10`}
                      />
                    </div>

                    <select
                      value={filter.type}
                      onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                      className={componentStyles.input.base}
                    >
                      <option value="">All Types</option>
                      <option value="case_alert">Case Alerts</option>
                      <option value="system">System</option>
                      <option value="review_reminder">Review Reminders</option>
                      <option value="report_ready">Reports</option>
                      <option value="verification">Verification</option>
                    </select>

                    <select
                      value={filter.priority}
                      onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
                      className={componentStyles.input.base}
                    >
                      <option value="">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <select
                      value={filter.read}
                      onChange={(e) => setFilter(prev => ({ ...prev, read: e.target.value }))}
                      className={componentStyles.input.base}
                    >
                      <option value="">All</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={markAllAsRead}
                      className={componentStyles.button.secondary}
                      disabled={unreadCount === 0}
                    >
                      Mark All Read
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
                  <span className="text-sm text-gray-500">
                    {filteredNotifications.length} of {notifications.length} notifications
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-l-4 rounded-lg transition-all ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'border-opacity-100' : 'border-opacity-50 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-bossom-pink-600 rounded-full"></span>
                                )}
                              </div>
                              
                              <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-600'} mb-2`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{new Date(notification.timestamp).toLocaleString()}</span>
                                <span className="capitalize">{notification.priority} priority</span>
                                {notification.metadata?.patientName && (
                                  <span>Patient: {notification.metadata.patientName}</span>
                                )}
                                {notification.metadata?.biradsScore && (
                                  <span>{notification.metadata.biradsScore}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FaEye className="w-4 h-4" />
                              </Link>
                            )}
                            
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <FaCheck className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab - Commented Out */}
        {/* 
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {Object.entries(settings.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {key === 'caseAlerts' && 'Receive emails for urgent case alerts and high-priority findings'}
                        {key === 'systemNotifications' && 'System updates, maintenance notices, and platform announcements'}
                        {key === 'reviewReminders' && 'Reminders for pending case reviews and overdue tasks'}
                        {key === 'reportReady' && 'Notifications when reports are generated and ready for download'}
                        {key === 'weeklyDigest' && 'Weekly summary of activity and statistics'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateSettings('email', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bossom-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bossom-pink-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaMobile className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Push Notifications</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {Object.entries(settings.push).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {key === 'caseAlerts' && 'Instant notifications for urgent cases requiring immediate attention'}
                        {key === 'systemNotifications' && 'Important system updates and security alerts'}
                        {key === 'reviewReminders' && 'Push reminders for pending reviews and deadlines'}
                        {key === 'reportReady' && 'Instant notification when reports are generated'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateSettings('push', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bossom-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bossom-pink-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Frequency */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaClock className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Frequency & Timing</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Notification Frequency</h3>
                  <div className="space-y-3">
                    {Object.entries(settings.frequency).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSettings('frequency', key, e.target.checked)}
                          className="h-4 w-4 text-bossom-pink-600 focus:ring-bossom-pink-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {key === 'immediateAlerts' && 'Immediate alerts for urgent items'}
                          {key === 'dailyDigest' && 'Daily summary digest'}
                          {key === 'weeklyDigest' && 'Weekly summary digest'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Quiet Hours</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.quietHours.enabled}
                        onChange={(e) => updateSettings('quietHours', 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-bossom-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bossom-pink-600"></div>
                    </label>
                  </div>
                  
                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) => updateSettings('quietHours', 'start', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) => updateSettings('quietHours', 'end', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end">
              <button className={componentStyles.button.primary}>
                Save Settings
              </button>
            </div>
          </div>
        )}
        */
      </div>
    </div>
  )
}