/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#003049',
          DEFAULT: '#669bbc',
          light: '#8eb4d4',
        },
      },
    },
  },
  plugins: [],
}

