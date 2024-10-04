/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      italic: ["Inter Italic", "sans-serif"],
    },
    extend: {
      fontWeight: {
        200: "200",
        300: "300",
        DEFAULT: "300",
        400: "400",
        500: "500",
        600: "600",
      },
    },
  },
  plugins: [],
};
