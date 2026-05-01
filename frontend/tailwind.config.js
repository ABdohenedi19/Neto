import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#0E8A68',
        'primary-dark': '#02213D',
        'surface-bg': '#F3F7F5',
        'panel-border': '#DCE5E1',
        muted: '#61737F',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15, 23, 42, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [flowbitePlugin],
}

