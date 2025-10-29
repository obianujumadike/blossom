// =============================================================================
// BOSSOM DESIGN SYSTEM
// =============================================================================
// Based on the provided mockups, this design system defines all the visual
// elements, components, and patterns used throughout the Bossom application.
// =============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',  // Main brand pink
    600: '#db2777',  // Primary action color
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // Bossom Brand Pink (from mockups)
  bossom: {
    50: '#fef7f0',
    100: '#feecdc',
    200: '#fcd9bd',
    300: '#fdba8c',
    400: '#ff8a4c',
    500: '#ED205A',  // Main Bossom pink
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Neutral/Gray Scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Success States
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning States
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error States
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Medical/Clinical Colors
  medical: {
    benign: '#22c55e',      // Green for benign findings
    malignant: '#ef4444',   // Red for malignant findings
    suspicious: '#f59e0b',  // Orange for suspicious findings
    normal: '#6b7280',      // Gray for normal findings
  }
} as const

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const

export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',     // 2px
  base: '0.25rem',    // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

// Component Variants based on mockups
export const componentStyles = {
  // Form Input Styles (from mockups)
  input: {
    base: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bossom-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500',
    error: 'border-error-300 focus:ring-error-500',
    success: 'border-success-300 focus:ring-success-500',
    disabled: 'bg-gray-50 text-gray-500 cursor-not-allowed',
  },
  
  // Button Styles (from mockups) - Updated to reduce gradient intensity
  button: {
    primary: 'bg-bossom-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-bossom-600 transition-all duration-200 shadow-lg hover:shadow-xl',
    secondary: 'bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:border-bossom-300 hover:bg-bossom-50 transition-all duration-200',
    outline: 'border-2 border-bossom-500 text-bossom-600 font-semibold py-3 px-6 rounded-xl hover:bg-bossom-50 transition-all duration-200',
    ghost: 'text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200',
    danger: 'bg-error-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-error-600 transition-all duration-200',
  },
  
  // Card Styles (from mockups)
  card: {
    base: 'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
    elevated: 'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden',
    interactive: 'bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer',
  },
  
  // Medical Status Indicators
  status: {
    pending: 'bg-warning-50 text-warning-700 border border-warning-200',
    inProgress: 'bg-primary-50 text-primary-700 border border-primary-200',
    completed: 'bg-success-50 text-success-700 border border-success-200',
    cancelled: 'bg-gray-50 text-gray-700 border border-gray-200',
    urgent: 'bg-error-50 text-error-700 border border-error-200',
  },
  
  // Medical Findings
  findings: {
    benign: 'bg-success-50 text-success-700 border border-success-200',
    malignant: 'bg-error-50 text-error-700 border border-error-200',
    suspicious: 'bg-warning-50 text-warning-700 border border-warning-200',
    normal: 'bg-gray-50 text-gray-700 border border-gray-200',
  }
} as const

// Layout patterns from mockups
export const layouts = {
  // Main app container
  app: 'min-h-screen bg-gradient-to-br from-gray-50 via-white to-bossom-50',
  
  // Form containers
  formContainer: 'w-full max-w-md mx-auto',
  formCard: 'bg-white rounded-2xl shadow-xl p-8 border border-gray-100',
  
  // Dashboard layouts
  dashboard: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  
  // Navigation
  nav: 'bg-white shadow-sm border-b border-gray-200',
  navContent: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Medical viewer (for mammogram display)
  medicalViewer: 'bg-gray-900 rounded-xl overflow-hidden',
} as const

// Animation presets
export const animations = {
  fadeIn: 'animate-in fade-in duration-500',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
  slideDown: 'animate-in slide-in-from-top-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
} as const