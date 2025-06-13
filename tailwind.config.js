/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        secondary: '#E67E22',
        accent: '#3498DB',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
        surface: {
          50: '#FAFAFA',
          100: '#F5F3F0',
          200: '#E8E4E0',
          300: '#D6D0CC',
          400: '#B8B0A8',
          500: '#9A8F84',
          600: '#7C6E60',
          700: '#5E4D3C',
          800: '#403C28',
          900: '#221E14'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Merriweather', 'serif'],
        display: ['Merriweather', 'serif']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
  },
  plugins: [],
}