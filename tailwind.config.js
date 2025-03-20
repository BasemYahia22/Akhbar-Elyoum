/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add your custom color here
        primary: "#003256",
        secondary: "#A9DBFF",
        third: "#005FA5",
      },
      fontFamily: {
        "crimson-text-bold": ["CrimsonText-Bold", "serif"],
        "crimson-text-semibold": ["CrimsonText-SemiBold", "serif"],
        "crimson-text-regular": ["CrimsonText-Regular", "serif"],
      },
      animation: {
        bounceIn: "bounceIn 0.6s ease-out", // Bounce-in animation
        bounceOut: "bounceOut 0.6s ease-in", // Bounce-out animation
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "60%": { transform: "translateY(10px)", opacity: 1 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        bounceOut: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "50%": { transform: "translateY(-10px)", opacity: 1 },
          "100%": { transform: "translateY(20px)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};

