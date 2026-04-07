'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { 
  FaArrowLeft,
  FaUser,
  FaHospital,
  FaPhone,
  FaEnvelope,
  FaSave,
  FaEdit,
  FaSpinner
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { Select } from '@/components/ui/Select'
import { componentStyles } from '@/lib/design-system'

interface Profile {
  id: string
  email: string
  full_name: string
  medical_license_number: string
  specialization: string
  hospital_affiliation: string
  phone_number: string
  role: string
  is_verified: boolean
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: '', specialization: '', hospital_affiliation: '', phone_number: '' })

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(({ data }) => {
        setProfile(data)
        setForm({
          full_name: data.full_name || '',
          specialization: data.specialization || '',
          hospital_affiliation: data.hospital_affiliation || '',
          phone_number: data.phone_number || '',
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (form.phone_number) {
      const phonePattern = /^\+?[1-9]\d{6,14}$/
      const cleaned = form.phone_number.replace(/[\s\-().]/g, '')
      if (!phonePattern.test(cleaned)) {
        toast.error('Please enter a valid phone number (e.g. +2348012345678)')
        return
      }
    }
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      const { data: updated } = await res.json()
      setProfile(prev => prev ? { ...prev, ...updated } : updated)
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bossom-pink-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Unable to load profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <BossomLogo size="sm" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={componentStyles.card.elevated}>
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-bossom-pink-100 rounded-full flex items-center justify-center">
                <FaUser className="w-6 h-6 text-bossom-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.full_name || 'No name set'}</h2>
                <p className="text-gray-600 text-sm">{profile.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-bossom-pink-100 text-bossom-pink-700 rounded-full capitalize">
                  {profile.role}
                </span>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaEdit className="w-4 h-4" /> Edit
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  className={componentStyles.input.base}
                />
              ) : (
                <p className="text-gray-900">{profile.full_name || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="flex items-center gap-2 text-gray-900">
                <FaEnvelope className="w-4 h-4 text-gray-400" />
                {profile.email}
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              {editing ? (
                <Select
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'Radiology', label: 'Radiology' },
                    { value: 'Breast Imaging', label: 'Breast Imaging' },
                    { value: 'Mammography', label: 'Mammography' },
                    { value: 'Oncology', label: 'Oncology' },
                    { value: 'Pathology', label: 'Pathology' },
                    { value: 'Surgery', label: 'Surgery' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={form.specialization}
                  onChange={v => setForm(f => ({ ...f, specialization: v }))}
                />
              ) : (
                <p className="text-gray-900">{profile.specialization || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Affiliation</label>
              {editing ? (
                <div className="flex items-center gap-2">
                  <FaHospital className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={form.hospital_affiliation}
                    onChange={e => setForm(f => ({ ...f, hospital_affiliation: e.target.value }))}
                    className={componentStyles.input.base}
                    placeholder="e.g. City General Hospital"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <FaHospital className="w-4 h-4 text-gray-400" />
                  {profile.hospital_affiliation || '—'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {editing ? (
                <div className="flex items-center gap-2">
                  <FaPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="tel"
                    value={form.phone_number}
                    onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
                    className={componentStyles.input.base}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <FaPhone className="w-4 h-4 text-gray-400" />
                  {profile.phone_number || '—'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical License</label>
              <p className="text-gray-900">{profile.medical_license_number || '—'}</p>
              <p className="text-xs text-gray-500 mt-1">Contact support to update your license number</p>
            </div>
          </div>

          {/* Save / Cancel */}
          {editing && (
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setEditing(false)
                  setForm({
                    full_name: profile.full_name || '',
                    specialization: profile.specialization || '',
                    hospital_affiliation: profile.hospital_affiliation || '',
                    phone_number: profile.phone_number || '',
                  })
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`${componentStyles.button.primary} flex items-center gap-2`}
              >
                {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Account created {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}