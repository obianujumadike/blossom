'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaArrowLeft,
  FaUser,
  FaIdCard,
  FaHospital,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCamera,
  FaCertificate,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaCheck
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface ClinicianProfile {
  personalInfo: {
    firstName: string
    lastName: string
    title: string
    email: string
    phone: string
    profileImage?: string
  }
  professionalInfo: {
    specialization: string[]
    licenseNumber: string
    licenseState: string
    yearsOfExperience: number
    boardCertifications: string[]
  }
  clinicInfo: {
    clinicName: string
    clinicAddress: string
    clinicPhone: string
    position: string
    department: string
  }
  education: {
    medicalSchool: string
    graduationYear: number
    residency: string
    fellowship?: string
  }
}

// Mock data
const mockProfile: ClinicianProfile = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Smith',
    title: 'Dr.',
    email: 'sarah.smith@bossom.com',
    phone: '+1 (555) 123-4567',
    profileImage: '/api/placeholder/150/150'
  },
  professionalInfo: {
    specialization: ['Radiology', 'Breast Imaging'],
    licenseNumber: 'MD123456789',
    licenseState: 'New York',
    yearsOfExperience: 12,
    boardCertifications: ['American Board of Radiology', 'Breast Imaging Subspecialty']
  },
  clinicInfo: {
    clinicName: 'Manhattan Medical Center',
    clinicAddress: '123 Medical Plaza, New York, NY 10001',
    clinicPhone: '+1 (555) 987-6543',
    position: 'Senior Radiologist',
    department: 'Diagnostic Imaging'
  },
  education: {
    medicalSchool: 'Harvard Medical School',
    graduationYear: 2012,
    residency: 'Mass General Brigham - Radiology',
    fellowship: 'Memorial Sloan Kettering - Breast Imaging'
  }
}

const specializationOptions = [
  'Radiology',
  'Breast Imaging',
  'Mammography',  
  'Oncology',
  'Pathology',
  'Surgery',
  'Internal Medicine'
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<ClinicianProfile>(mockProfile)
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'clinic' | 'education'>('personal')
  const [editMode, setEditMode] = useState<{[key: string]: boolean}>({})
  const [newSpecialization, setNewSpecialization] = useState('')
  const [newCertification, setNewCertification] = useState('')

  const handleInputChange = (section: keyof ClinicianProfile, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayAdd = (section: keyof ClinicianProfile, field: string, value: string) => {
    if (value.trim()) {
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...(prev[section] as any)[field], value.trim()]
        }
      }))
    }
  }

  const handleArrayRemove = (section: keyof ClinicianProfile, field: string, index: number) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index)
      }
    }))
  }

  const toggleEditMode = (section: string) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleSave = (section: string) => {
    // Implementation would save to backend
    console.log(`Saving ${section} section`)
    toggleEditMode(section)
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
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your professional information and credentials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card & Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="w-8 h-8 text-gray-400" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-bossom-pink-600 text-white rounded-full flex items-center justify-center hover:bg-bossom-pink-700 transition-colors">
                    <FaCamera className="w-3 h-3" />
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.personalInfo.title} {profile.personalInfo.firstName} {profile.personalInfo.lastName}
                </h2>
                <p className="text-gray-600">{profile.clinicInfo.position}</p>
                <p className="text-sm text-gray-500">{profile.clinicInfo.clinicName}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <FaCertificate className="w-4 h-4" />
                    <span>{profile.professionalInfo.yearsOfExperience} years experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'personal'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaUser className="w-4 h-4" />
                    <span>Personal Info</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('professional')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'professional'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaIdCard className="w-4 h-4" />
                    <span>Professional</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('clinic')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'clinic'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaHospital className="w-4 h-4" />
                    <span>Clinic Info</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('education')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === 'education'
                        ? 'bg-bossom-pink-50 text-bossom-pink-700 border border-bossom-pink-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaGraduationCap className="w-4 h-4" />
                    <span>Education</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <button
                      onClick={() => editMode.personal ? handleSave('personal') : toggleEditMode('personal')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        editMode.personal 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {editMode.personal ? <FaSave className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
                      {editMode.personal ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      {editMode.personal ? (
                        <select
                          value={profile.personalInfo.title}
                          onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                          className={componentStyles.input.base}
                        >
                          <option value="Dr.">Dr.</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Mrs.">Mrs.</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profile.personalInfo.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      {editMode.personal ? (
                        <input
                          type="text"
                          value={profile.personalInfo.firstName}
                          onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.personalInfo.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      {editMode.personal ? (
                        <input
                          type="text"
                          value={profile.personalInfo.lastName}
                          onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.personalInfo.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {editMode.personal ? (
                        <input
                          type="email"
                          value={profile.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <FaEnvelope className="w-4 h-4 text-gray-400" />
                          {profile.personalInfo.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      {editMode.personal ? (
                        <input
                          type="tel"
                          value={profile.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <FaPhone className="w-4 h-4 text-gray-400" />
                          {profile.personalInfo.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
                    <button
                      onClick={() => editMode.professional ? handleSave('professional') : toggleEditMode('professional')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        editMode.professional 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {editMode.professional ? <FaSave className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
                      {editMode.professional ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Specializations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.professionalInfo.specialization.map((spec, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-bossom-pink-100 text-bossom-pink-800 rounded-full text-sm">
                          {spec}
                          {editMode.professional && (
                            <button
                              onClick={() => handleArrayRemove('professionalInfo', 'specialization', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    
                    {editMode.professional && (
                      <div className="flex gap-2">
                        <select
                          value={newSpecialization}
                          onChange={(e) => setNewSpecialization(e.target.value)}
                          className={componentStyles.input.base}
                        >
                          <option value="">Select specialization...</option>
                          {specializationOptions.filter(opt => !profile.professionalInfo.specialization.includes(opt)).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            handleArrayAdd('professionalInfo', 'specialization', newSpecialization)
                            setNewSpecialization('')
                          }}
                          disabled={!newSpecialization}
                          className="px-4 py-2 bg-bossom-pink-600 text-white rounded-lg hover:bg-bossom-pink-700 disabled:bg-gray-300 transition-colors"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                      {editMode.professional ? (
                        <input
                          type="text"
                          value={profile.professionalInfo.licenseNumber}
                          onChange={(e) => handleInputChange('professionalInfo', 'licenseNumber', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.professionalInfo.licenseNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License State</label>
                      {editMode.professional ? (
                        <input
                          type="text"
                          value={profile.professionalInfo.licenseState}
                          onChange={(e) => handleInputChange('professionalInfo', 'licenseState', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.professionalInfo.licenseState}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      {editMode.professional ? (
                        <input
                          type="number"
                          value={profile.professionalInfo.yearsOfExperience}
                          onChange={(e) => handleInputChange('professionalInfo', 'yearsOfExperience', parseInt(e.target.value))}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.professionalInfo.yearsOfExperience} years</p>
                      )}
                    </div>
                  </div>

                  {/* Board Certifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Board Certifications</label>
                    <div className="space-y-2 mb-3">
                      {profile.professionalInfo.boardCertifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FaCertificate className="w-4 h-4 text-green-600" />
                            <span className="text-gray-900">{cert}</span>
                          </div>
                          {editMode.professional && (
                            <button
                              onClick={() => handleArrayRemove('professionalInfo', 'boardCertifications', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {editMode.professional && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                          placeholder="Add new certification..."
                          className={componentStyles.input.base}
                        />
                        <button
                          onClick={() => {
                            handleArrayAdd('professionalInfo', 'boardCertifications', newCertification)
                            setNewCertification('')
                          }}
                          disabled={!newCertification}
                          className="px-4 py-2 bg-bossom-pink-600 text-white rounded-lg hover:bg-bossom-pink-700 disabled:bg-gray-300 transition-colors"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Clinic Information Tab */}
            {activeTab === 'clinic' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Clinic Information</h2>
                    <button
                      onClick={() => editMode.clinic ? handleSave('clinic') : toggleEditMode('clinic')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        editMode.clinic 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {editMode.clinic ? <FaSave className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
                      {editMode.clinic ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                      {editMode.clinic ? (
                        <input
                          type="text"
                          value={profile.clinicInfo.clinicName}
                          onChange={(e) => handleInputChange('clinicInfo', 'clinicName', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <FaHospital className="w-4 h-4 text-gray-400" />
                          {profile.clinicInfo.clinicName}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      {editMode.clinic ? (
                        <input
                          type="text"
                          value={profile.clinicInfo.clinicAddress}
                          onChange={(e) => handleInputChange('clinicInfo', 'clinicAddress', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                          {profile.clinicInfo.clinicAddress}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Phone</label>
                      {editMode.clinic ? (
                        <input
                          type="tel"
                          value={profile.clinicInfo.clinicPhone}
                          onChange={(e) => handleInputChange('clinicInfo', 'clinicPhone', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <FaPhone className="w-4 h-4 text-gray-400" />
                          {profile.clinicInfo.clinicPhone}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      {editMode.clinic ? (
                        <input
                          type="text"
                          value={profile.clinicInfo.position}
                          onChange={(e) => handleInputChange('clinicInfo', 'position', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.clinicInfo.position}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      {editMode.clinic ? (
                        <input
                          type="text"
                          value={profile.clinicInfo.department}
                          onChange={(e) => handleInputChange('clinicInfo', 'department', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.clinicInfo.department}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Education & Training</h2>
                    <button
                      onClick={() => editMode.education ? handleSave('education') : toggleEditMode('education')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        editMode.education 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {editMode.education ? <FaSave className="w-4 h-4" /> : <FaEdit className="w-4 h-4" />}
                      {editMode.education ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical School</label>
                      {editMode.education ? (
                        <input
                          type="text"
                          value={profile.education.medicalSchool}
                          onChange={(e) => handleInputChange('education', 'medicalSchool', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.education.medicalSchool}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                      {editMode.education ? (
                        <input
                          type="number"
                          value={profile.education.graduationYear}
                          onChange={(e) => handleInputChange('education', 'graduationYear', parseInt(e.target.value))}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.education.graduationYear}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Residency</label>
                      {editMode.education ? (
                        <input
                          type="text"
                          value={profile.education.residency}
                          onChange={(e) => handleInputChange('education', 'residency', e.target.value)}
                          className={componentStyles.input.base}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.education.residency}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fellowship (Optional)</label>
                      {editMode.education ? (
                        <input
                          type="text"
                          value={profile.education.fellowship || ''}
                          onChange={(e) => handleInputChange('education', 'fellowship', e.target.value)}
                          className={componentStyles.input.base}
                          placeholder="Enter fellowship details..."
                        />
                      ) : (
                        <p className="text-gray-900">{profile.education.fellowship || 'Not specified'}</p>
                      )}
                    </div>
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