/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
      extend: {
        boxShadow: {
          '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        },
      },
    },
    plugins: [],
  }