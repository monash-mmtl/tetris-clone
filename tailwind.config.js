/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['monospace'],
      },
      colors: {
        'retro': {
          'bg': '#0f0f23',
          'border': '#10aded',
          'text': '#cccccc',
        }
      }
    },
  },
  plugins: [],
}

