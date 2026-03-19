'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// --- Validation helpers ---

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  if (!EMAIL_RE.test(email)) return 'Invalid email address'
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  return null
}

// --- Auth actions ---

export async function signInWithEmail(formData: FormData) {
  const email = (formData.get('email') as string ?? '').trim()
  const password = formData.get('password') as string ?? ''

  const emailErr = validateEmail(email)
  if (emailErr) return { error: emailErr }
  const pwErr = validatePassword(password)
  if (pwErr) return { error: pwErr }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signUpWithEmail(formData: FormData) {
  const email = (formData.get('email') as string ?? '').trim()
  const password = formData.get('password') as string ?? ''
  const fullName = (formData.get('fullName') as string ?? '').trim()
  const medicalLicense = (formData.get('medicalLicense') as string ?? '').trim()
  const specialization = (formData.get('specialization') as string ?? '').trim()
  const hospitalAffiliation = (formData.get('hospitalAffiliation') as string ?? '').trim()

  const emailErr = validateEmail(email)
  if (emailErr) return { error: emailErr }
  const pwErr = validatePassword(password)
  if (pwErr) return { error: pwErr }
  if (!fullName) return { error: 'Full name is required' }
  if (!medicalLicense) return { error: 'Medical license number is required' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        full_name: fullName,
        medical_license_number: medicalLicense,
        specialization: specialization || 'Radiology',
        hospital_affiliation: hospitalAffiliation,
        role: 'radiologist',
      },
    },
  })

  if (error) return { error: error.message }

  return { success: true, message: 'Check your email to verify your account' }
}

export async function resetPassword(formData: FormData) {
  const email = (formData.get('email') as string ?? '').trim()
  const emailErr = validateEmail(email)
  if (emailErr) return { error: emailErr }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/auth/reset-password`,
  })

  if (error) return { error: error.message }
  return { success: true, message: 'Check your email for a password reset link' }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string ?? ''
  const confirm = formData.get('confirm') as string ?? ''

  const pwErr = validatePassword(password)
  if (pwErr) return { error: pwErr }
  if (password !== confirm) return { error: 'Passwords do not match' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/login')
}
