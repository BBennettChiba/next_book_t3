/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shake: "shake .3s",
      },
      keyframes: {
        shake: {
          "25%, 75%": {
            transform: "translateX(-5%)",
            "color": "red",
          },
          "50%": { transform: "translateX(5%)", "color": "red" },
        },
      },
    },
  },
  plugins: [],
};
