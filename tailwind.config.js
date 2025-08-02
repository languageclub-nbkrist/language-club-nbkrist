/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00f6ff',
        'secondary': '#5d45f9',
        'accent': '#ff00c1',
        'background': '#0a0a1f',
        'surface': '#151531',
        'text-main': '#e8f0f8',
        'text-muted': '#a8a29e',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'aurora': {
          'from': {
            'background-position': '50% 50%, 50% 50%',
          },
          'to': {
            'background-position': '350% 50%, 350% 50%',
          },
        },
        'glow': {
          '0%, 100%': { 'text-shadow': '0 0 5px #00f6ff, 0 0 10px #00f6ff, 0 0 15px #00f6ff' },
          '50%': { 'text-shadow': '0 0 10px #00f6ff, 0 0 20px #00f6ff, 0 0 30px #00f6ff' },
        },
        'fadeInUp': {
            '0%': {
                opacity: '0',
                transform: 'translateY(20px)'
            },
            '100%': {
                opacity: '1',
                transform: 'translateY(0)'
            },
        },
      },
      animation: {
        'aurora': 'aurora 60s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
