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
        // Tom and Jerry classic colors
        bgUi: 'rgba(245, 222, 179, 0.95)', // Cream/beige background
        borderUi: 'rgba(139, 69, 19, 0.6)', // Brown borders
        accent: '#FF6B35', // Tom's red-orange
        text: '#8B4513', // Brown text
        tomYellow: '#FFD700', // Classic yellow
        tomBrown: '#8B4513', // Brown
        jerryBlue: '#4682B4', // Sky blue
        cream: '#FFF8DC', // Cream
        warmYellow: '#FFA500', // Warm orange-yellow
      },
      fontSize: {
        'base': '16px',
      },
      fontFamily: {
        sans: ['Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', 'cursive', 'sans-serif'],
        cartoon: ['Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', 'cursive'],
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

