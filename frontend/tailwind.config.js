/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        dark: '#1a1a1a',
        light: '#f7f7f7',
        border: '#d1d5db',
        surface: '#ffffff',
        'surface-dark': '#2a2a2a',
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
}
