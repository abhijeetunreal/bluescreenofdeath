/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.js"
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
        bgUi: 'var(--color-surface)',
        borderUi: 'var(--color-border)',
        text: 'var(--color-text)',
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

