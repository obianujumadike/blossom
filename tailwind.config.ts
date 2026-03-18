import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bossom Brand Colors (Main pink from mockups)
        bossom: {
          25: '#fff5f8',
          50: '#ffeef4',
          100: '#ffd6e5',
          200: '#ffadc9',
          300: '#ff85ae',
          400: '#ff5c92',
          500: '#ED205A',  // Main Bossom pink from designs
          600: '#c91a4d',
          700: '#a51440',
          800: '#810e33',
          900: '#5d0826',
        },
        // Alias so both bossom-* and bossom-pink-* work identically
        'bossom-pink': {
          25: '#fff5f8',
          50: '#ffeef4',
          100: '#ffd6e5',
          200: '#ffadc9',
          300: '#ff85ae',
          400: '#ff5c92',
          500: '#ED205A',
          600: '#c91a4d',
          700: '#a51440',
          800: '#810e33',
          900: '#5d0826',
        },
        // Updated pink palette to match mockups
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',  // Primary action color
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // Medical status colors
        medical: {
          benign: '#22c55e',      // Green for benign findings
          malignant: '#ef4444',   // Red for malignant findings  
          suspicious: '#f59e0b',  // Orange for suspicious findings
          normal: '#6b7280',      // Gray for normal findings
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
