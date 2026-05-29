/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#000000',
        secondary: '#fffaf9',
        accent:    '#c0435a',
        shade1:    '#6e6966',
        shade2:    '#2f2e2d',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        serif:   ['Cormorant Garamond', 'serif'],
        sans:    ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
