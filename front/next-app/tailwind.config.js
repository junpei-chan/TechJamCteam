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
        main: 'var(--main-color)',
        accent: 'var(--accent-color)',
        base: 'var(--base-color)',
        'black-30': 'rgba(0, 0, 0, 0.3)',
        'black-60': 'rgba(0, 0, 0, 0.6)',
      },
      fontSize: {
        large: '20px',
        normal: '16px',
        small: '14px',
      },
      boxShadow: {
        'top': '0px -2px 5px -2px rgba(0,0,0,0.5)',
        'bottom': '0px 2px 5px -2px rgba(0,0,0,0.5)',
      },
      spacing: {
        '7': '1.75rem',
        '8': '2rem',
        '14': '3.5rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '24': '6rem',
        '48': '12rem',
      },
      borderWidth: {
        '1': '1px',
      },
    },
  },
  plugins: [],
}
