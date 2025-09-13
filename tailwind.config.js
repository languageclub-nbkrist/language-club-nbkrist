/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated color palette based on the reference site
        'primary': '#a855f7',    // Purple
        'secondary': '#6366f1',  // Indigo
        'accent': '#f43f5e',      // Rose for highlights
        'background': '#030014', // Very dark blue/black
        'surface': 'rgba(29, 25, 62, 0.3)', // Semi-transparent dark purple for cards
        'text-main': '#e5e7eb',   // Light gray for main text
        'text-muted': '#9ca3af',  // Muted gray for subtitles
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        // Keyframe for the floating blob animation
        'blob': {
          '0%, 100%': {
            transform: 'translateY(0) scale(1)',
          },
          '50%': {
            transform: 'translateY(-20px) scale(1.1)',
          },
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
        // Defining the blob animation with different durations
        'blob-normal': 'blob 8s ease-in-out infinite',
        'blob-slow': 'blob 10s ease-in-out infinite',
        'blob-fast': 'blob 6s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
