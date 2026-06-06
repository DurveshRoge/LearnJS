/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FCD34D",
        dark: "#0F172A",
        darkCard: "#1E293B",
      },
    },
  },
  plugins: [],
}
