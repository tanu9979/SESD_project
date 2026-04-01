/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        folio: {
          green:  '#2D4A3E',
          cream:  '#F5F0E8',
          gold:   '#C9A84C',
          dark:   '#1C1C1C',
          light:  '#EAE4D8',
          muted:  '#7A8C82',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
