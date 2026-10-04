/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#07090e',
          850: '#0b0f17',
          800: '#111726',
          700: '#1a2236',
          600: '#263352',
          cyan: '#00f0ff',
          neon: '#00d2ff',
          blue: '#0066ff',
          purple: '#9d00ff',
          surface: 'rgba(17, 23, 38, 0.75)',
          glass: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(0, 240, 255, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'cyan-glow-lg': '0 0 50px -10px rgba(0, 240, 255, 0.4)',
        'cyan-sm': '0 0 10px rgba(0, 240, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
