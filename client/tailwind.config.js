/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      "primary": "rgb(119,94,241)",
      "done": "rgb(107,211,163)",
      "pending": "rgb(240,149,54)",
      "delete": "rgb(219,97,92)",
      "sidebar": "#383B51",
      
      "draft": "rgb(12,14,21)",
      "bg": "rgb(242,242,242)",
      "underlay": "rgba(0,0,0,0.1)",
      "text": "black",
      "text-sec": "rgb(137, 142, 173)",

      "draft-dark": "rgb(255,255,255)",
      "bg-dark": "rgb(20,22,36)",
      "underlay-dark": "rgba(255,255,255,0.1)",
      "text-dark": "white",
      "text-sec-dark": "rgb(224, 227, 248)",

    }
  },
  plugins: [],
}
