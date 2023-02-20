const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[700],
        primaryBg: colors.blue[200],
        secondary: colors.orange[800],
        secondaryBg: colors.orange[200],
        success: colors.green[800],
        successBg: colors.green[200],
        info: colors.sky[800],
        infoBg: colors.sky[200],
        warning: colors.amber[500],
        warningBg: colors.amber[100],
        danger: colors.red[700],
        dangerBg: colors.red[200],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
