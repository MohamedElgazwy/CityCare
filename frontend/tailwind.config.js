module.exports = {
  content: [
    './app/**/*.{ts,tsx,jsx,js,html}',
    './components/**/*.{ts,tsx,jsx,js,html}',
  ],
  theme: {
    extend: {
      colors: {
        azure: { 200: '#b9eaff', 400: '#60cff6', 500: '#25a1e4', 600: '#1486d4', 700: '#0f6db7' },
        teal: { 200: '#e0f2f5', 500: '#7cd2da', 700: '#4190ab' },
        gradient: { primary: 'bg-gradient-to-br from-white-80 to-blue-50', secondary: 'bg-gradient-to-r from-blue-80 to-purple-50' },
        typography: { header: '#2d3748', body: '#5a636d' }
      },
      spacings: [0, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64],
      shadows: [
        '0 2px 8px 0 rgba(0,0,0,0.1)',
        '0 4px 12px 0 rgba(0,0,0,0.15)',
        '0 6px 16px 0 rgba(0,0,0,0.2)
      ],
      screens: [
        'min-width: 320px',
        'min-width: 480px',
        'min-width: 768px',
        'min-width: 1024px',
        'min-width: 1280px'
      ]
    },
    darkMode: 'class',
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}