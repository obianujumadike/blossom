// =============================================================================
// BOSSOM DATABASE TYPES
// =============================================================================
// Auto-generated TypeScript types for the Bossom database schema
// This file defines all database entities and their relationships
// =============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      patients: {
        Row: Patient
        Insert: PatientInsert
        Update: PatientUpdate
      }
      patient_clinical_history: {
        Row: PatientClinicalHistory
        Insert: PatientClinicalHistoryInsert
        Update: PatientClinicalHistoryUpdate
      }
      cases: {
        Row: Case
        Insert: CaseInsert
        Update: CaseUpdate
      }
      images: {
        Row: Image
        Insert: ImageInsert
        Update: ImageUpdate
      }
      analyses: {
        Row: Analysis
        Insert: AnalysisInsert
        Update: AnalysisUpdate
      }
      regions_of_interest: {
        Row: RegionOfInterest
        Insert: RegionOfInterestInsert
        Update: RegionOfInterestUpdate
      }
      reports: {
        Row: Report
        Insert: ReportInsert
        Update: ReportUpdate
      }
      audit_logs: {
        Row: AuditLog
        Insert: AuditLogInsert
        Update: AuditLogUpdate
      }
      system_settings: {
        Row: SystemSetting
        Insert: SystemSettingInsert
        Update: SystemSettingUpdate
      }
    }
    Views: {
      dashboard_summary: {
        Row: DashboardSummary
      }
      case_details: {
        Row: CaseDetails
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
      case_priority: 'low' | 'normal' | 'high' | 'urgent'
      analysis_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
      upload_status: 'uploading' | 'completed' | 'failed'
      image_quality: 'poor' | 'fair' | 'good' | 'excellent'
      laterality: 'Left' | 'Right' | 'Bilateral'
      gender: 'Female' | 'Male' | 'Other'
      breast_density: 'A' | 'B' | 'C' | 'D'
      report_type: 'AI_analysis' | 'radiologist_review' | 'final_report'
      audit_action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'UPLOAD' | 'ANALYZE' | 'GENERATE_REPORT' | 'SHARE_REPORT'
    }
  }
}

// =============================================================================
// USER TYPES
// =============================================================================
export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string
  medical_license_number: string
  specialization: string
  hospital_affiliation: string | null
  phone_number: string | null
  is_active: boolean
  is_verified: boolean
  last_password_change: string
  password_change_required: boolean
  failed_login_attempts: number
  locked_until: string | null
  created_at: string
  updated_at: string
}

export interface UserInsert {
  id?: string
  email: string
  password_hash: string
  full_name: string
  medical_license_number: string
  specialization?: string
  hospital_affiliation?: string | null
  phone_number?: string | null
  is_active?: boolean
  is_verified?: boolean
  last_password_change?: string
  password_change_required?: boolean
  failed_login_attempts?: number
  locked_until?: string | null
  created_at?: string
  updated_at?: string
}

export interface UserUpdate {
  email?: string
  password_hash?: string
  full_name?: string
  medical_license_number?: string
  specialization?: string
  hospital_affiliation?: string | null
  phone_number?: string | null
  is_active?: boolean
  is_verified?: boolean
  last_password_change?: string
  password_change_required?: boolean
  failed_login_attempts?: number
  locked_until?: string | null
  updated_at?: string
}

// =============================================================================
// PATIENT TYPES
// =============================================================================
export interface Patient {
  id: string
  patient_id: string
  age: number
  date_of_birth: string | null
  gender: Database['public']['Enums']['gender']
  medical_record_number: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface PatientInsert {
  id?: string
  patient_id: string
  age: number
  date_of_birth?: string | null
  gender?: Database['public']['Enums']['gender']
  medical_record_number?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

export interface PatientUpdate {
  patient_id?: string
  age?: number
  date_of_birth?: string | null
  gender?: Database['public']['Enums']['gender']
  medical_record_number?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  updated_at?: string
}

// =============================================================================
// PATIENT CLINICAL HISTORY TYPES
// =============================================================================
export interface PatientClinicalHistory {
  id: string
  patient_id: string
  family_history_breast_cancer: boolean
  family_history_ovarian_cancer: boolean
  personal_history_breast_cancer: boolean
  previous_biopsies: boolean
  hormone_replacement_therapy: boolean
  current_medications: string | null
  allergies: string | null
  previous_mammograms_date: string | null
  previous_mammograms_results: string | null
  clinical_notes: string | null
  risk_factors: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface PatientClinicalHistoryInsert {
  id?: string
  patient_id: string
  family_history_breast_cancer?: boolean
  family_history_ovarian_cancer?: boolean
  personal_history_breast_cancer?: boolean
  previous_biopsies?: boolean
  hormone_replacement_therapy?: boolean
  current_medications?: string | null
  allergies?: string | null
  previous_mammograms_date?: string | null
  previous_mammograms_results?: string | null
  clinical_notes?: string | null
  risk_factors?: Record<string, any> | null
  created_at?: string
  updated_at?: string
}

export interface PatientClinicalHistoryUpdate {
  family_history_breast_cancer?: boolean
  family_history_ovarian_cancer?: boolean
  personal_history_breast_cancer?: boolean
  previous_biopsies?: boolean
  hormone_replacement_therapy?: boolean
  current_medications?: string | null
  allergies?: string | null
  previous_mammograms_date?: string | null
  previous_mammograms_results?: string | null
  clinical_notes?: string | null
  risk_factors?: Record<string, any> | null
  updated_at?: string
}

// =============================================================================
// CASE TYPES
// =============================================================================
export interface Case {
  id: string
  case_number: string
  patient_id: string
  radiologist_id: string | null
  status: Database['public']['Enums']['case_status']
  priority: Database['public']['Enums']['case_priority']
  clinical_indication: string | null
  referring_physician: string | null
  study_date: string
  study_type: string
  breast_density: Database['public']['Enums']['breast_density'] | null
  case_notes: string | null
  is_urgent: boolean
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface CaseInsert {
  id?: string
  case_number: string
  patient_id: string
  radiologist_id?: string | null
  status?: Database['public']['Enums']['case_status']
  priority?: Database['public']['Enums']['case_priority']
  clinical_indication?: string | null
  referring_physician?: string | null
  study_date: string
  study_type?: string
  breast_density?: Database['public']['Enums']['breast_density'] | null
  case_notes?: string | null
  is_urgent?: boolean
  created_at?: string
  updated_at?: string
  completed_at?: string | null
}

export interface CaseUpdate {
  case_number?: string
  radiologist_id?: string | null
  status?: Database['public']['Enums']['case_status']
  priority?: Database['public']['Enums']['case_priority']
  clinical_indication?: string | null
  referring_physician?: string | null
  study_date?: string
  study_type?: string
  breast_density?: Database['public']['Enums']['breast_density'] | null
  case_notes?: string | null
  is_urgent?: boolean
  updated_at?: string
  completed_at?: string | null
}

// =============================================================================
// IMAGE TYPES
// =============================================================================
export interface Image {
  id: string
  case_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  view_position: string | null
  laterality: Database['public']['Enums']['laterality'] | null
  image_quality: Database['public']['Enums']['image_quality']
  dicom_metadata: Record<string, any> | null
  preprocessing_status: string
  is_primary: boolean
  upload_status: Database['public']['Enums']['upload_status']
  created_at: string
  updated_at: string
}

export interface ImageInsert {
  id?: string
  case_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type?: string
  view_position?: string | null
  laterality?: Database['public']['Enums']['laterality'] | null
  image_quality?: Database['public']['Enums']['image_quality']
  dicom_metadata?: Record<string, any> | null
  preprocessing_status?: string
  is_primary?: boolean
  upload_status?: Database['public']['Enums']['upload_status']
  created_at?: string
  updated_at?: string
}

export interface ImageUpdate {
  file_name?: string
  file_path?: string
  file_size?: number
  file_type?: string
  view_position?: string | null
  laterality?: Database['public']['Enums']['laterality'] | null
  image_quality?: Database['public']['Enums']['image_quality']
  dicom_metadata?: Record<string, any> | null
  preprocessing_status?: string
  is_primary?: boolean
  upload_status?: Database['public']['Enums']['upload_status']
  updated_at?: string
}

// =============================================================================
// ANALYSIS TYPES
// =============================================================================
export interface Analysis {
  id: string
  case_id: string
  image_id: string
  model_version: string
  analysis_status: Database['public']['Enums']['analysis_status']
  overall_assessment: string | null
  confidence_score: number | null
  birads_category: number | null
  malignancy_probability: number | null
  processing_time_seconds: number | null
  analysis_metadata: Record<string, any> | null
  quality_score: number | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface AnalysisInsert {
  id?: string
  case_id: string
  image_id: string
  model_version: string
  analysis_status?: Database['public']['Enums']['analysis_status']
  overall_assessment?: string | null
  confidence_score?: number | null
  birads_category?: number | null
  malignancy_probability?: number | null
  processing_time_seconds?: number | null
  analysis_metadata?: Record<string, any> | null
  quality_score?: number | null
  started_at?: string | null
  completed_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface AnalysisUpdate {
  model_version?: string
  analysis_status?: Database['public']['Enums']['analysis_status']
  overall_assessment?: string | null
  confidence_score?: number | null
  birads_category?: number | null
  malignancy_probability?: number | null
  processing_time_seconds?: number | null
  analysis_metadata?: Record<string, any> | null
  quality_score?: number | null
  started_at?: string | null
  completed_at?: string | null
  updated_at?: string
}

// =============================================================================
// REGION OF INTEREST TYPES
// =============================================================================
export interface RegionOfInterest {
  id: string
  analysis_id: string
  roi_type: string
  coordinates: Record<string, any>
  confidence_score: number
  malignancy_probability: number | null
  size_mm: number | null
  characteristics: Record<string, any> | null
  clinical_significance: string | null
  created_at: string
}

export interface RegionOfInterestInsert {
  id?: string
  analysis_id: string
  roi_type: string
  coordinates: Record<string, any>
  confidence_score: number
  malignancy_probability?: number | null
  size_mm?: number | null
  characteristics?: Record<string, any> | null
  clinical_significance?: string | null
  created_at?: string
}

export interface RegionOfInterestUpdate {
  roi_type?: string
  coordinates?: Record<string, any>
  confidence_score?: number
  malignancy_probability?: number | null
  size_mm?: number | null
  characteristics?: Record<string, any> | null
  clinical_significance?: string | null
}

// =============================================================================
// REPORT TYPES
// =============================================================================
export interface Report {
  id: string
  case_id: string
  generated_by: string | null
  report_type: Database['public']['Enums']['report_type']
  report_content: Record<string, any>
  pdf_file_path: string | null
  html_content: string | null
  is_final: boolean
  reviewed_by: string | null
  reviewed_at: string | null
  shared_with: Record<string, any> | null
  version_number: number
  created_at: string
  updated_at: string
}

export interface ReportInsert {
  id?: string
  case_id: string
  generated_by?: string | null
  report_type?: Database['public']['Enums']['report_type']
  report_content: Record<string, any>
  pdf_file_path?: string | null
  html_content?: string | null
  is_final?: boolean
  reviewed_by?: string | null
  reviewed_at?: string | null
  shared_with?: Record<string, any> | null
  version_number?: number
  created_at?: string
  updated_at?: string
}

export interface ReportUpdate {
  generated_by?: string | null
  report_type?: Database['public']['Enums']['report_type']
  report_content?: Record<string, any>
  pdf_file_path?: string | null
  html_content?: string | null
  is_final?: boolean
  reviewed_by?: string | null
  reviewed_at?: string | null
  shared_with?: Record<string, any> | null
  version_number?: number
  updated_at?: string
}

// =============================================================================
// AUDIT LOG TYPES
// =============================================================================
export interface AuditLog {
  id: string
  user_id: string | null
  action: Database['public']['Enums']['audit_action']
  resource_type: string
  resource_id: string | null
  old_values: Record<string, any> | null
  new_values: Record<string, any> | null
  ip_address: string | null
  user_agent: string | null
  session_id: string | null
  created_at: string
}

export interface AuditLogInsert {
  id?: string
  user_id?: string | null
  action: Database['public']['Enums']['audit_action']
  resource_type: string
  resource_id?: string | null
  old_values?: Record<string, any> | null
  new_values?: Record<string, any> | null
  ip_address?: string | null
  user_agent?: string | null
  session_id?: string | null
  created_at?: string
}

export interface AuditLogUpdate {
  // Audit logs are typically immutable
  [key: string]: never
}

// =============================================================================
// SYSTEM SETTING TYPES
// =============================================================================
export interface SystemSetting {
  id: string
  setting_key: string
  setting_value: Record<string, any>
  description: string | null
  is_encrypted: boolean
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface SystemSettingInsert {
  id?: string
  setting_key: string
  setting_value: Record<string, any>
  description?: string | null
  is_encrypted?: boolean
  updated_by?: string | null
  created_at?: string
  updated_at?: string
}

export interface SystemSettingUpdate {
  setting_key?: string
  setting_value?: Record<string, any>
  description?: string | null
  is_encrypted?: boolean
  updated_by?: string | null
  updated_at?: string
}

// =============================================================================
// VIEW TYPES
// =============================================================================
export interface DashboardSummary {
  radiologist_id: string
  radiologist_name: string
  total_cases: number
  pending_cases: number
  in_progress_cases: number
  completed_cases: number
  total_analyses: number
  avg_confidence_score: number | null
  suspicious_analyses: number
}

export interface CaseDetails {
  case_id: string
  case_number: string
  status: Database['public']['Enums']['case_status']
  priority: Database['public']['Enums']['case_priority']
  study_date: string
  clinical_indication: string | null
  patient_id: string
  patient_age: number
  patient_gender: Database['public']['Enums']['gender']
  radiologist_name: string | null
  image_count: number
  analysis_count: number
  highest_confidence: number | null
  highest_birads: number | null
}

// =============================================================================
// UTILITY TYPES
// =============================================================================
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]