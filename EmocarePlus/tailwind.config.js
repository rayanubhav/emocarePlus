/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- VERY IMPORTANT: Tells Tailwind to use the .dark class
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
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
        'stress-low': 'var(--stress-low)',
        'stress-low-bg': 'var(--stress-low-bg)',
        'stress-mid': 'var(--stress-mid)',
        'stress-mid-bg': 'var(--stress-mid-bg)',
        'stress-high': 'var(--stress-high)',
        'stress-high-bg': 'var(--stress-high-bg)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
}