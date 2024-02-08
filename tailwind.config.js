/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    colors: {
      black: "#000000",
      white: "#F2F2F2",
      red: "#dc2626",
      gray: "#808080",
      "dark-gray": "#0A0A0A",

      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },

  plugins: [],
};
