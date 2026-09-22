/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safarmidnight: {
          950: '#050811',
          900: '#070c18',
          850: '#0a1224',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        safarslate: {
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        safarsafety: {
          low: '#10b981',      // lower-risk (emerald)
          lowGlow: 'rgba(16, 185, 129, 0.25)',
          mod: '#f59e0b',      // moderate (amber)
          modGlow: 'rgba(245, 158, 11, 0.25)',
          high: '#ef4444',     // elevated risk (crimson/red)
          highGlow: 'rgba(239, 68, 68, 0.25)',
          accent: '#0ea5e9',   // nav/info cyan
          accentGlow: 'rgba(14, 165, 233, 0.25)',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'ripple': 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
