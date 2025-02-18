/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d8dfe8',
          300: '#b9c5d4',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e6e3',
          200: '#c6cdc6',
          300: '#a3aea3',
          400: '#7d8c7d',
          500: '#5f6b5f',
          600: '#4a534a',
          700: '#3b423b',
          800: '#2c312c',
          900: '#1a1d1a',
        },
        sand: {
          50: '#faf8f6',
          100: '#f2ede7',
          200: '#e5dbd1',
          300: '#d3c3b3',
          400: '#bda48f',
          500: '#a68569',
          600: '#8b6b52',
          700: '#6f5441',
          800: '#523e31',
          900: '#352821',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}