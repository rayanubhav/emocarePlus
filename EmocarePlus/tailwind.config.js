/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- VERY IMPORTANT: Tells Tailwind to use the .dark class
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-light': 'var(--surface-light)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        secondary: 'var(--secondary)',
        'secondary-light': 'var(--secondary-light)',
        border: 'var(--border)',
        error: 'var(--error)',
        'error-bg': 'var(--error-bg)',
      },
    },
  },
  plugins: [],
}