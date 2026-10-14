/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hydrangea: {
          50: '#F0F5FE',
          100: '#E3EDFC',   // Swatch 1: Ice blue tint
          200: '#C4DAFA',   // Swatch 2: Powder periwinkle
          300: '#9EBEF6',   // Swatch 3: Soft hydrangea
          400: '#7AA5F2',   // Swatch 4: Primary hydrangea blue
          500: '#578CE6',   // Swatch 5: Vibrant cornflower
          600: '#3D72D1',
          700: '#2C57A8',
          bg: '#090E17',    // Deep luxury midnight navy
          card: '#111B2D',  // Deep periwinkle navy card
          cardAlt: '#16233B',
          muted: '#9BB1D3', // Muted periwinkle text
          lightMuted: '#CBD8ED',
          border: 'rgba(158, 190, 246, 0.2)',
          borderSubtle: 'rgba(158, 190, 246, 0.1)',
          ink: '#070D1A',   // Deepest text for buttons
          cream: '#F4F8FF',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(122, 165, 242, 0.35)',
        'pin-glow': '0 15px 55px rgba(87, 140, 230, 0.32)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.06)', opacity: '1' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
      }
    },
  },
  plugins: [],
}
