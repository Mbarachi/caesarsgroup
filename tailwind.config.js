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
        // The palette the site already runs on, named so it can be reused
        // instead of re-typed as hexes. Every value here was already in use:
        // coral/orange from the package cards and flyer, purple from the
        // Pay-As-You-Go panel, green from the Residential Premium card.
        brand: {
          coral: "#F63D2F",
          "coral-soft": "#FF715D",
          "coral-tint": "#FFEEE9",
          orange: "#FB923C",
          "orange-soft": "#FDBA74",
          "orange-tint": "#FFF3E6",
          gold: "#FFA500",
          "gold-tint": "#FFF8E1",
          teal: "#1ABC9C",
          green: "#0E9F6E",
          "green-tint": "#E6FFF7",
          plum: "#6B2B92",
          purple: "#4F166F",
          ink: "#3C0D5E",
          "purple-tint": "#F1EFFE",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
}
