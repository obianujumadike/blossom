import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff5f7',
          100: '#ffe4e8',
          200: '#ffc7d3',
          300: '#ff9bb5',
          400: '#ff6796',
          500: '#ff3879',
          600: '#e03369',
          700: '#ba2856',
          800: '#921f44',
          900: '#6c1734',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
