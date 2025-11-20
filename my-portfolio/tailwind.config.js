/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        baroqueBody: ['"Source Sans 3"', "system-ui", "sans-serif"],
        baroqueHeading: ['"Cormorant Garamond"', "serif"],
        renBody: ['"Source Sans 3"', "system-ui", "sans-serif"],
        renHeading: ['"Playfair Display"', "serif"],
        ngHeading: ['Montserrat', 'sans-serif'],
        ngBody: ['"Source Sans 3"', 'sans-serif'],
      },
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
