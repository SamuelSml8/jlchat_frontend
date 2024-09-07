module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B3F72', // Morado
        secondary: '#FFFFFF', // Blanco
        accent: '#000000', // Negro
        accentLight: '#F5F5F5' // Gris claro para fondo
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
