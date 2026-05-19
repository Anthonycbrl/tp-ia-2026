import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#FDF6DC',
          200: '#FAE9A0',
          300: '#F5D864',
          400: '#EDD37A',
          500: '#D4AF37',
          600: '#B8962E',
          700: '#9C7D25',
          800: '#7F641C',
          900: '#634C13',
        },
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'serif'],
        body: ['var(--font-raleway)', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #F5D864, #D4AF37)',
        'radial-gold': 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 25s linear infinite',
        'spin-reverse': 'spin-reverse 18s linear infinite',
        'particle-drift': 'particle-drift 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)' },
          '50%': { boxShadow: '0 0 60px rgba(212, 175, 55, 0.35)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'particle-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)', opacity: '0.7' },
          '66%': { transform: 'translate(-20px, -20px) scale(0.9)', opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}

export default config
