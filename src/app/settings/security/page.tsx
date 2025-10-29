'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaArrowLeft,
  FaKey,
  FaShieldAlt,
  FaMobile,
  FaClock,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaLock,
  FaUnlock,
  FaDesktop,
  FaTabletAlt,
  FaBell
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface SecurityDevice {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  location: string
  lastActive: string
  current: boolean
  trusted: boolean
}

interface SecuritySession {
  id: string
  browser: string
  location: string
  ipAddress: string
  loginTime: string
  lastActive: string
  current: boolean
}

// Mock data
const mockDevices: SecurityDevice[] = [
  {
    id: '1',
    name: 'MacBook Pro',
    type: 'desktop',
    location: 'New York, NY',
    lastActive: '2024-10-29T15:30:00Z',
    current: true,
    trusted: true
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    location: 'New York, NY',
    lastActive: '2024-10-29T14:20:00Z',
    current: false,
    trusted: true
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    location: 'Boston, MA',
    lastActive: '2024-10-28T09:15:00Z',
    current: false,
    trusted: false
  }
]

const mockSessions: SecuritySession[] = [
  {
    id: '1',
    browser: 'Chrome 119.0',
    location: 'New York, NY',
    ipAddress: '192.168.1.100',
    loginTime: '2024-10-29T08:00:00Z',
    lastActive: '2024-10-29T15:30:00Z',
    current: true
  },
  {
    id: '2',
    browser: 'Safari 17.0',
    location: 'Boston, MA',
    ipAddress: '10.0.0.50',
    loginTime: '2024-10-28T09:00:00Z',
    lastActive: '2024-10-28T17:30:00Z',
    current: false
  }
]

export default function SecuritySettingsPage() {
  const [activeTab, setActiveTab] = useState<'password' | 'two-factor' | 'devices' | 'sessions'>('password')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [devices] = useState<SecurityDevice[]>(mockDevices)
  const [sessions] = useState<SecuritySession[]>(mockSessions)
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <FaDesktop className="w-5 h-5" />
      case 'mobile':
        return <FaMobile className="w-5 h-5" />
      case 'tablet':
        return <FaTabletAlt className="w-5 h-5" />
      default:
        return <FaDesktop className="w-5 h-5" />
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation would handle password change
    console.log('Password change submitted')
  }

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    // Implementation would handle 2FA setup
  }

  const handleDeviceAction = (deviceId: string, action: 'trust' | 'revoke') => {
    // Implementation would handle device actions
    console.log(`Device ${deviceId} ${action}`)
  }

  const handleSessionTerminate = (sessionId: string) => {
    // Implementation would handle session termination
    console.log(`Session ${sessionId} terminated`)
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
              <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
              <p className="text-gray-600">Manage your account security and privacy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className={componentStyles.card.elevated}>
              <div className="p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'password'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaKey className="w-4 h-4" />
                    <span>Password</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('two-factor')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'two-factor'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaShieldAlt className="w-4 h-4" />
                    <span>Two-Factor Auth</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('devices')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'devices'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaMobile className="w-4 h-4" />
                    <span>Trusted Devices</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'sessions'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaClock className="w-4 h-4" />
                    <span>Active Sessions</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                  <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800">Password Requirements</h3>
                        <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                          <li>• At least 12 characters long</li>
                          <li>• Must include uppercase and lowercase letters</li>
                          <li>• Must include at least one number</li>
                          <li>• Must include at least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className={componentStyles.input.base}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className={componentStyles.input.base}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className={componentStyles.input.base}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className={componentStyles.button.primary}
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Two-Factor Authentication Tab */}
            {activeTab === 'two-factor' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                  <p className="text-gray-600 mt-1">Add an extra layer of security to your account</p>
                </div>
                
                <div className="p-6">
                  <div className={`p-4 rounded-lg border ${twoFactorEnabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {twoFactorEnabled ? (
                          <FaShieldAlt className="w-5 h-5 text-green-600" />
                        ) : (
                          <FaExclamationTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <h3 className={`font-medium ${twoFactorEnabled ? 'text-green-800' : 'text-red-800'}`}>
                            Two-Factor Authentication {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </h3>
                          <p className={`text-sm ${twoFactorEnabled ? 'text-green-700' : 'text-red-700'}`}>
                            {twoFactorEnabled 
                              ? 'Your account is protected with 2FA'
                              : 'Enable 2FA to secure your account'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleTwoFactorToggle}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          twoFactorEnabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                      </button>
                    </div>
                  </div>

                  {twoFactorEnabled && (
                    <div className="mt-6 space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Recovery Codes</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
                        </p>
                        <button className={componentStyles.button.secondary}>
                          View Recovery Codes
                        </button>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Authenticator App</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Currently using: Google Authenticator
                        </p>
                        <button className={componentStyles.button.secondary}>
                          Reconfigure App
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trusted Devices Tab */}
            {activeTab === 'devices' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Trusted Devices</h2>
                  <p className="text-gray-600 mt-1">Manage devices that can access your account</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {devices.map((device) => (
                      <div key={device.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              {getDeviceIcon(device.type)}
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">{device.name}</h3>
                                {device.current && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    Current Device
                                  </span>
                                )}
                                {device.trusted ? (
                                  <FaLock className="w-4 h-4 text-green-600" />
                                ) : (
                                  <FaUnlock className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{device.location}</p>
                              <p className="text-xs text-gray-500">
                                Last active: {new Date(device.lastActive).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!device.current && (
                              <>
                                {device.trusted ? (
                                  <button
                                    onClick={() => handleDeviceAction(device.id, 'revoke')}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                  >
                                    Revoke Trust
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDeviceAction(device.id, 'trust')}
                                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                  >
                                    Trust Device
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Active Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
                  <p className="text-gray-600 mt-1">Monitor and manage your active login sessions</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">{session.browser}</h3>
                              {session.current && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Current Session
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Location: {session.location}</p>
                              <p>IP Address: {session.ipAddress}</p>
                              <p>Login: {new Date(session.loginTime).toLocaleString()}</p>
                              <p>Last Active: {new Date(session.lastActive).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {!session.current && (
                            <button
                              onClick={() => handleSessionTerminate(session.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              Terminate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Terminate All Other Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}