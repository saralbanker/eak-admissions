/** @type {import('tailwindcss').Config} */
module.exports = {
  // Class names live in index.html *and* in the JS templates (src/js/render.js, ui.js).
  content: ['./index.html', './src/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          500: '#3b82f6',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#0b1a45',
          950: '#071233',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      keyframes: {
        dialogIn: {
          from: { opacity: '0', transform: 'translateY(12px) scale(.98)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'dialog-in': 'dialogIn .2s ease-out',
      },
    },
  },
  plugins: [],
};
