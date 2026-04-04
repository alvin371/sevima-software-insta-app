/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.ts", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#E1306C",   // Instagram-like pink/red
          secondary: "#833AB4", // Purple gradient
          accent: "#FCAF45",    // Orange/yellow
          dark: "#262626",
          light: "#FAFAFA",
        },
      },
      fontFamily: {
        sans: ["Inter_400Regular", "System"],
        medium: ["Inter_500Medium", "System"],
        semibold: ["Inter_600SemiBold", "System"],
        bold: ["Inter_700Bold", "System"],
      },
    },
  },
  plugins: [],
};
