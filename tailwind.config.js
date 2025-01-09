/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        bgPurple:  "rgb(167,174,249)",
        purple:"#8359E3",
        red:"#D83E36"
      }
    },
  },
  plugins: [],
}

