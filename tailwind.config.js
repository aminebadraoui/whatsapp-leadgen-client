
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');


module.exports = {

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f3',
          100: '#ccefe7',
          200: '#99dfcf',
          300: '#66cfb7',
          400: '#33bf9f',
          500: '#09a784',
          600: '#07866a',
          700: '#05644f',
          800: '#044335',
          900: '#02211a',
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      let allColors = theme('colors');
      let newVars = Object.fromEntries(
        Object.entries(allColors).flatMap(([color, value]) => {
          if (typeof value === 'object') {
            return Object.entries(value).map(([shade, hex]) => [`--${color}-${shade}`, hex]);
          }
          return [[`--${color}`, value]];
        })
      );

      addBase({
        ':root': newVars,
      });
    }),
  ],
}