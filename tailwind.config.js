/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        jazzy: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        primary: "#2e2e38",
        "background-light": "#f6f7f8",
        "background-dark": "#101c22",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
}
