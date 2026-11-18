/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--bb-${name}) / <alpha-value>)`

module.exports = {
  content: ['./{src,mdx}/**/*.{js,mjs,jsx,mdx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['"Cal Sans UI"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
    fontSize: {
      '2xs': ['0.75rem', { lineHeight: '1.25rem' }],
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    typography: require('./typography'),
    extend: {
      // Builderbot design tokens (see src/styles/tailwind.css for values per theme)
      colors: {
        bb: {
          bg: v('bg'),
          bg2: v('bg2'),
          frame: v('frame'),
          line: v('line'),
          line2: v('line2'),
          ink: v('ink'),
          ink2: v('ink2'),
          mute: v('mute'),
          soft: v('soft'),
          head: v('head'),
          chip: v('chip'),
          btn: v('btn'),
          btnfg: v('btnfg'),
          code: '#0e0f11',
          l1: v('l1'),
          l2: v('l2'),
          l3: v('l3'),
          pink: '#db2777',
        },
      },
      fontWeight: {
        book: '380',
      },
      boxShadow: {
        glow: '0 0 4px rgb(0 0 0 / 0.1)',
      },
      maxWidth: {
        lg: '33rem',
        '2xl': '40rem',
        '3xl': '50rem',
        '5xl': '66rem',
      },
      opacity: {
        1: '0.01',
        2.5: '0.025',
        7.5: '0.075',
        15: '0.15',
      },
      keyframes: {
        'bb-in': {
          from: { opacity: '0', transform: 'translateY(16px)', filter: 'blur(4px)' },
          to: { opacity: '1', transform: 'none', filter: 'none' },
        },
        'bb-run': { from: { left: '0' }, to: { left: 'calc(100% - 10px)' } },
      },
      animation: {
        'bb-in': 'bb-in .9s cubic-bezier(.2,.8,.2,1) both',
        'bb-run': 'bb-run 2s cubic-bezier(.65,0,.35,1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwind-scrollbar'), require("tailwindcss-animate")],
}
