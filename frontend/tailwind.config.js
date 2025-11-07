/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0A0908',
          DEFAULT: '#49111c',
          light: '#a9927d',
        },
        background: {
          light: '#f2f4f3',
        },
        secondary: {
          DEFAULT: '#5e503f',
        },
      },
    },
  },
  plugins: [],
}

