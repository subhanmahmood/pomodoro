module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
    },
    extend: {
      padding: ['hover', 'focus'],
      borderWidth: ['hover', 'focus'],
      translate: ['active', 'group-hover'],
    },
  },
  plugins: [],
}