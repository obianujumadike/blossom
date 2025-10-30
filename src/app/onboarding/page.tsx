'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaStethoscope,
  FaEye,
  FaUpload,
  FaChartBar,
  FaShieldAlt,
  FaUsers,
  FaGraduationCap,
  FaHospital,
  FaIdCard,
  FaCertificate,
  FaEnvelope,
  FaPhone,
  FaBell,
  FaFileAlt,
  FaPlay,
  FaPause,
  FaLightbulb,
  FaBookOpen,
  FaHandsHelping,
  FaRocket
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: any
  completed: boolean
}

interface FeatureTour {
  id: string
  title: string
  description: string
  icon: any
  demoUrl?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Bossom',
    description: 'Get started with AI-powered mammogram analysis',
    icon: FaRocket,
    completed: true
  },
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your professional information and credentials',
    icon: FaIdCard,
    completed: false
  },
  {
    id: 'verification',
    title: 'License Verification',
    description: 'Upload your medical license and certifications',
    icon: FaCertificate,
    completed: false
  },
  {
    id: 'clinic-setup',
    title: 'Clinic Setup',
    description: 'Configure your clinic information and preferences',
    icon: FaHospital,
    completed: false
  },
  {
    id: 'tour',
    title: 'Platform Tour',
    description: 'Learn how to use the key features',
    icon: FaBookOpen,
    completed: false
  },
  {
    id: 'first-case',
    title: 'Create Your First Case',
    description: 'Try uploading and analyzing your first mammogram',
    icon: FaStethoscope,
    completed: false
  }
]

const featureTours: FeatureTour[] = [
  {
    id: 'dashboard',
    title: 'Clinical Dashboard',
    description: 'Monitor your cases, view analytics, and track performance metrics',
    icon: FaChartBar,
    demoUrl: '/dashboard'
  },
  {
    id: 'cases',
    title: 'Case Management',
    description: 'Create, organize, and manage patient cases efficiently',
    icon: FaFileAlt,
    demoUrl: '/cases'
  },
  {
    id: 'analysis',
    title: 'AI Analysis Viewer',
    description: 'Review AI-powered analysis results with confidence scores',
    icon: FaEye,
    demoUrl: '/cases/demo/analysis'
  },
  {
    id: 'upload',
    title: 'Image Upload System',
    description: 'Drag and drop mammogram images for instant analysis',
    icon: FaUpload,
    demoUrl: '/cases/demo/upload'
  },
  {
    id: 'reports',
    title: 'Report Generation',
    description: 'Generate comprehensive reports and analytics',
    icon: FaFileAlt,
    demoUrl: '/reports'
  },
  {
    id: 'compliance',
    title: 'Compliance & Audit',
    description: 'Manage patient consent and maintain audit trails',
    icon: FaShieldAlt,
    demoUrl: '/compliance'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps] = useState<OnboardingStep[]>(onboardingSteps)
  const [activeTab, setActiveTab] = useState<'progress' | 'tour' | 'resources'>('progress')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set(['welcome']))

  const currentStepData = steps[currentStep]
  const progress = (completedSteps.size / steps.length) * 100

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkipToEnd = () => {
    router.push('/dashboard')
  }

  const getStepStatus = (stepId: string, index: number) => {
    if (completedSteps.has(stepId)) return 'completed'
    if (index === currentStep) return 'current'
    if (index < currentStep) return 'completed'
    return 'upcoming'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bossom-pink-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BossomLogo size="sm" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome to Bossom</h1>
                <p className="text-gray-600">Let's get you set up for success</p>
              </div>
            </div>
            
            <button
              onClick={handleSkipToEnd}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip to Dashboard →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Setup Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-bossom-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('progress')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'progress'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaRocket className="w-4 h-4" />
                  Getting Started
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('tour')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'tour'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaBookOpen className="w-4 h-4" />
                  Feature Tour
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('resources')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'resources'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaHandsHelping className="w-4 h-4" />
                  Help & Resources
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Getting Started Tab */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Step */}
            <div className="lg:col-span-2">
              <div className={componentStyles.card.elevated}>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-bossom-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <currentStepData.icon className="w-10 h-10 text-bossom-pink-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                    <p className="text-gray-600">{currentStepData.description}</p>
                  </div>

                  {/* Step Content */}
                  {currentStepData.id === 'welcome' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Revolutionize Your Mammogram Analysis Workflow
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Bossom combines cutting-edge AI technology with clinical expertise to provide 
                          fast, accurate mammogram analysis. Join thousands of healthcare professionals 
                          who trust our platform for early breast cancer detection.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <FaEye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">AI-Powered Analysis</h4>
                          <p className="text-sm text-gray-600">Advanced algorithms detect abnormalities</p>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <FaShieldAlt className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">HIPAA Compliant</h4>
                          <p className="text-sm text-gray-600">Enterprise-grade security and privacy</p>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <FaChartBar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">Detailed Reports</h4>
                          <p className="text-sm text-gray-600">Comprehensive analysis and insights</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => handleStepComplete(currentStepData.id)}
                          className={componentStyles.button.primary}
                        >
                          Get Started <FaArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStepData.id === 'profile' && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600">
                          Complete your professional profile to personalize your experience and ensure 
                          accurate credentialing.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaIdCard className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">Personal Information</span>
                          </div>
                          <span className="text-sm text-yellow-600">Required</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaGraduationCap className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">Education & Training</span>
                          </div>
                          <span className="text-sm text-gray-500">Optional</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaHospital className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">Clinic Information</span>
                          </div>
                          <span className="text-sm text-yellow-600">Required</span>
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Link href="/profile" className={componentStyles.button.primary}>
                          Complete Profile
                        </Link>
                        <button
                          onClick={() => handleStepComplete(currentStepData.id)}
                          className={componentStyles.button.secondary}
                        >
                          Skip for Now
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStepData.id === 'verification' && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600">
                          Upload your medical credentials for verification. This ensures platform security 
                          and enables full access to all features.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <FaCertificate className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">Medical License</span>
                          </div>
                          <p className="text-sm text-gray-600">Current state medical license</p>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <FaCertificate className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Board Certification</span>
                          </div>
                          <p className="text-sm text-gray-600">Radiology board certification</p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <FaLightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Quick Tip</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Verification typically takes 2-3 business days. You can start using the platform 
                              with limited features while we process your documents.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Link href="/verification" className={componentStyles.button.primary}>
                          Upload Documents
                        </Link>
                        <button
                          onClick={() => handleStepComplete(currentStepData.id)}
                          className={componentStyles.button.secondary}
                        >
                          Skip for Now
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStepData.id === 'clinic-setup' && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600">
                          Configure your notification preferences and clinic settings to customize 
                          your workflow.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaBell className="w-5 h-5 text-blue-600" />
                              <div>
                                <span className="font-medium text-gray-900">Notification Preferences</span>
                                <p className="text-sm text-gray-500">Configure alerts and reminders</p>
                              </div>
                            </div>
                            <Link href="/notifications" className="text-bossom-pink-600 hover:text-bossom-pink-700">
                              Configure →
                            </Link>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FaShieldAlt className="w-5 h-5 text-green-600" />
                              <div>
                                <span className="font-medium text-gray-900">Security Settings</span>
                                <p className="text-sm text-gray-500">Two-factor auth and access controls</p>
                              </div>
                            </div>
                            <Link href="/settings/security" className="text-bossom-pink-600 hover:text-bossom-pink-700">
                              Setup →
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleStepComplete(currentStepData.id)}
                          className={componentStyles.button.primary}
                        >
                          Complete Setup
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStepData.id === 'tour' && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600">
                          Take a guided tour of the platform to learn about key features and workflows.
                        </p>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => setActiveTab('tour')}
                          className={componentStyles.button.primary}
                        >
                          Start Platform Tour
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStepData.id === 'first-case' && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600">
                          Ready to analyze your first mammogram? Create a case and upload an image 
                          to see the AI analysis in action.
                        </p>
                      </div>

                      <div className="text-center">
                        <Link href="/cases/new" className={componentStyles.button.primary}>
                          Create First Case
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Sidebar */}
            <div>
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Setup Steps</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {steps.map((step, index) => {
                      const status = getStepStatus(step.id, index)
                      return (
                        <div
                          key={step.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            status === 'current' ? 'bg-bossom-pink-50 border border-bossom-pink-200' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            status === 'completed' 
                              ? 'bg-green-100 text-green-600' 
                              : status === 'current'
                              ? 'bg-bossom-pink-100 text-bossom-pink-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {status === 'completed' ? (
                              <FaCheck className="w-4 h-4" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              status === 'current' ? 'text-bossom-pink-900' : 'text-gray-900'
                            }`}>
                              {step.title}
                            </h4>
                            <p className={`text-sm ${
                              status === 'current' ? 'text-bossom-pink-700' : 'text-gray-700'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Tour Tab */}
        {activeTab === 'tour' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Platform Features</h2>
              <p className="text-gray-600">
                Discover the powerful tools available in Bossom to streamline your workflow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureTours.map((tour) => (
                <div key={tour.id} className={componentStyles.card.elevated}>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <tour.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{tour.title}</h3>
                    <p className="text-gray-600 mb-4">{tour.description}</p>
                    
                    <div className="flex gap-2">
                      {tour.demoUrl && (
                        <Link 
                          href={tour.demoUrl}
                          className="flex-1 text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Try It
                        </Link>
                      )}
                      <button className="flex-1 text-center py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Help & Resources</h2>
              <p className="text-gray-600">
                Everything you need to get the most out of Bossom
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={componentStyles.card.elevated}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaBookOpen className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Quick Start Guide
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → User Manual
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Best Practices
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → FAQ
                    </a>
                  </div>
                </div>
              </div>

              <div className={componentStyles.card.elevated}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaHandsHelping className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Support</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Contact Support
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Schedule Training
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Report an Issue
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Feature Requests
                    </a>
                  </div>
                </div>
              </div>

              <div className={componentStyles.card.elevated}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaUsers className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → User Forum
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Webinars
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Success Stories
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-bossom-pink-600 transition-colors">
                      → Newsletter
                    </a>
                  </div>
                </div>
              </div>

              <div className={componentStyles.card.elevated}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaPhone className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPhone className="w-4 h-4" />
                      <span>1-800-BOSSOM-1</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaEnvelope className="w-4 h-4" />
                      <span>support@bossom.com</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Available 24/7 for urgent clinical support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        {activeTab === 'progress' && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={handleSkipToEnd}
              className="px-6 py-2 bg-bossom-pink-500 text-white rounded-lg hover:bg-bossom-pink-600 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}