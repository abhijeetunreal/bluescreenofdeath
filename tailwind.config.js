/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html"
  ],
  safelist: [
    'active',
    'show',
    'hide-ui',
    'mobile-menu-open',
    'show-ui-on-hover'
  ],
  theme: {
    extend: {
      colors: {
        bgUi: 'rgba(15, 15, 15, 0.95)',
        borderUi: 'rgba(255, 255, 255, 0.15)',
        accent: '#007aff',
        text: '#eee',
      },
      fontSize: {
        'base': '16px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      screens: {
        'xs': '360px',
        'sm': '481px',
        'md': '769px',
        'lg': '1200px',
      },
    },
  },
  plugins: [],
}

