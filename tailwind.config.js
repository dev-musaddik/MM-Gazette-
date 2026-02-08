/** @type {import('tailwindcss').Config} */
// Updated config to fix color naming conflict
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tech/Dark Theme Palette
        primary: {
          DEFAULT: '#00F0FF', // Neon Cyan
          50: '#E0FDFF',
          100: '#B3FAFF',
          200: '#80F6FF',
          300: '#4DF2FF',
          400: '#26EFFF',
          500: '#00F0FF',
          600: '#00C0CC',
          700: '#009099',
          800: '#006066',
          900: '#003033',
        },
        secondary: {
          DEFAULT: '#7000FF', // Neon Purple
          50: '#F1E6FF',
          100: '#DCC0FF',
          200: '#C499FF',
          300: '#AC73FF',
          400: '#944DFF',
          500: '#7000FF',
          600: '#5A00CC',
          700: '#430099',
          800: '#2D0066',
          900: '#160033',
        },
        background: {
          DEFAULT: '#050505', // Almost Black
          paper: '#111111',   // Dark Gray for cards
          light: '#1A1A1A',   // Lighter Gray
        },
        text: {
          main: '#FFFFFF',
          muted: '#A3A3A3',
          accent: '#00F0FF',
        },
        accent: {
          green: '#00FF94',
          pink: '#FF0055',
          yellow: '#FAFF00',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'], // Tech/Futuristic font
        body: ['Inter', 'sans-serif'],       // Clean readable font
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(112, 0, 255, 0.5), 0 0 20px rgba(112, 0, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #00F0FF, 0 0 20px #00F0FF' },
          'to': { boxShadow: '0 0 20px #00F0FF, 0 0 30px #00F0FF' },
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
