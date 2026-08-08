/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: '#10B981',
        teal: '#14B8A6',
        accent: '#3B82F6',
        canvas: '#F8FAFC',
        ink: '#111827',
      },
    },
  },
  plugins: [],
};
