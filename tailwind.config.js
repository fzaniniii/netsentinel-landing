/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      colors: {
        // Semaphoric Colors
        cvss: {
          critical: {
            DEFAULT: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.1)',
            border: 'rgba(239, 68, 68, 0.2)',
          },
          alert: {
            DEFAULT: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)',
            border: 'rgba(245, 158, 11, 0.2)',
          },
          secure: {
            DEFAULT: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)',
            border: 'rgba(16, 185, 129, 0.2)',
          },
          offline: {
            DEFAULT: '#6b7280',
            bg: 'rgba(107, 114, 128, 0.1)',
            border: 'rgba(107, 114, 128, 0.2)',
          },
          live: {
            DEFAULT: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.1)',
            border: 'rgba(59, 130, 246, 0.2)',
          }
        },
        brand: {
          dark: '#0a0a0c',
          navy: '#0f4c81',
          accent: '#14b8a6',
        }
      },
    },
  },
  plugins: [],
};
