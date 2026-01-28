/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          500: '#f59e0b',
        },
        stone: {
          100: '#f5f5f4',
        },
        zinc: {
          800: '#27272a',
        },
      },
    },
  },
  plugins: [],
}
