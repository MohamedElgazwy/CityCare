module.exports = {
  content: [
    './app/**/*.{ts,tsx,jsx,js,html}',
    './components/**/*.{ts,tsx,jsx,js,html}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2.5rem',
      },
    },
    extend: {
      colors: {
        azure: { 200: '#b9eaff', 400: '#60cff6', 500: '#25a1e4', 600: '#1486d4', 700: '#0f6db7' },
        teal: { 200: '#e0f2f5', 500: '#7cd2da', 700: '#4190ab' },
        typography: { header: '#2d3748', body: '#5a636d' }
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(0,0,0,0.1)',
        medium: '0 4px 12px 0 rgba(0,0,0,0.15)',
        strong: '0 6px 16px 0 rgba(0,0,0,0.2)'
      },
      screens: {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}