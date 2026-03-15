/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          800:     '#1E293B',
          700:     '#334155',
          600:     '#475569',
        },
        red: {
          DEFAULT: '#EF4444',
          600:     '#DC2626',
          100:     '#FEE2E2',
        },
        gold: {
          DEFAULT: '#FACC15',
          500:     '#EAB308',
        },
        white:   '#F8FAFC',
        muted:   '#94A3B8',
        success: '#22C55E',
        warning: '#F97316',
        error:   '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
