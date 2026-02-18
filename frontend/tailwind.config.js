/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'var(--font-cormorant)', 'serif'],
        handwritten: ['var(--font-dancing-script)', 'cursive'],
      },
      scale: {
        '103': '1.03',
      },
      colors: {
        primary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        accent: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#ebe7e0',
          300: '#ddd6ca',
          400: '#c9b896',
          500: '#b8a685',
          600: '#9d8a6b',
          700: '#8a7759',
          800: '#71614a',
          900: '#5d503d',
        },
        'testimonial-background': 'rgb(var(--testimonial-background) / <alpha-value>)',
        'testimonial-foreground': 'rgb(var(--testimonial-foreground) / <alpha-value>)',
        'testimonial-muted': 'rgb(var(--testimonial-muted) / <alpha-value>)',
        'testimonial-accent': 'rgb(var(--testimonial-accent) / <alpha-value>)',
        'testimonial-border': 'rgb(var(--testimonial-border) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
