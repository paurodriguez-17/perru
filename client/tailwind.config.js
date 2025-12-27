/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        perru: {
          pink: '#FFA2CE',
          orange: '#FFB88C',
          mint: '#A9D3D1',
          purple: '#D5B7DD',
          hotpink: '#F977B5',
          text: '#6B6B6B',
          bg: '#FFF5F9',
        }
      },
      fontFamily: {
        sans: ['Fredoka', 'Quicksand', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // 👇 AQUÍ DEFINIMOS LAS ANIMACIONES PARA QUE NO DEN ERROR EN CSS
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        scaleUp: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeIn: 'fadeIn 0.2s ease-out forwards',
      }
    },
  },
  plugins: [],
}