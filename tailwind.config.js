/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add your custom color here
        primary: "#003256",
        secondary: "#A9DBFF",
      },
      fontFamily: {
        "crimson-text-bold": ["CrimsonText-Bold", "serif"],
        "crimson-text-semibold": ["CrimsonText-SemiBold", "serif"],
        "crimson-text-regular": ["CrimsonText-Regular", "serif"],
      },
    },
  },
  plugins: [],
};

