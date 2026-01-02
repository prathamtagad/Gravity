/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gravity: {
          primary: '#7c3aed', // Electric Violet
          secondary: '#2563eb', // Neon Blue
          accent: '#db2777', // Hot Pink
          dark: '#0f172a', // Deep Space
          light: '#f8fafc', // Stardust
          success: '#10b981', // Emerald
          warning: '#f59e0b', // Amber
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

