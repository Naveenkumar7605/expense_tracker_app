/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      screens:{
        'xs':{
          'min':'200px',
          'max':'639px'
        }
      }
    },
  },
  plugins: [],
}
