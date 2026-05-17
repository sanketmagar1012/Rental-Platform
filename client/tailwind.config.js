/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mb-red': '#d8232a', // Magicbricks red
        'mb-gray': '#f5f5f5',
        'mb-text': '#303030',
        'mb-light-text': '#666666'
      }
    },
  },
  plugins: [],
}
