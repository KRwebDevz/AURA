/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aura: {
          root: '#090C10',
          surface1: '#0F141C',
          surface2: '#161B26',
          elevated: '#1E2433',
          borderSubtle: '#1E2638',
          borderActive: '#334155',
          textPrimary: '#F8FAFC',
          textSecondary: '#94A3B8',
          textMuted: '#64748B',
          accentSky: '#38BDF8',
          accentStone: '#A8A29E',
          accentPurple: '#A855F7',
          accentEmerald: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
