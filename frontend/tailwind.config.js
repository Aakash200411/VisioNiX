/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#212121',
        dark: '#1a1a1a',
        light: '#ffffff',
        border: '#404040',
        surface: '#212121',
        accent: '#10a37f',
        'text-primary': '#ffffff',
        'text-secondary': '#999999',
        hover: '#2a2a2a',
        error: '#ef4444',
        success: '#10a37f',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
}
