const path = require('path');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

// Generate at: https://uicolors.app
const themes = {
  primary: {
    '50': '#f7f7f7',
    '100': '#e3e3e3',
    '200': '#c8c8c8',
    '300': '#474747',
    '400': '#333333',
    '500': '#242424',
    '600': '#171717',
    '700': '#121212',
    '800': '#0d0d0d',
    '900': '#080808',
    DEFAULT: '#242424',
  },
  'on-primary': {
    500: '#ffffff',
    DEFAULT: '#ffffff',
  },
  accent: {
    ...colors.slate,
    DEFAULT: colors.slate[800],
  },
  warn: {
    ...colors.red,
    DEFAULT: colors.red[600],
  },
};


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      scale: {
        '97': '0.97',
        '98': '0.98',
        '99': '0.99'
      },
      opacity: {
        '12': '0.12',
        '38': '0.38',
        '87': '0.87'
      },
      zIndex: {
        '-1': -1,
        '1': 1,
        '49': 49,
        '60': 60,
        '70': 70,
        '80': 80,
        '90': 90,
        '99': 99,
        '999': 999,
        '9999': 9999,
        '99999': 99999
      },
      spacing   : {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '50': '12.5rem',
        '90': '22.5rem'
      },
      fontFamily: {
        sans: `"Mulish", ${defaultTheme.fontFamily.sans.join(',')}`,
        mono: `"IBM Plex Mono", ${defaultTheme.fontFamily.mono.join(',')}`
      },
      extendedSpacing: {
        // Fractional values
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',

        // Bigger values
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
        '140': '35rem',
        '160': '40rem',
        '180': '45rem',
        '192': '48rem',
        '200': '50rem',
        '240': '60rem',
        '256': '64rem',
        '280': '70rem',
        '320': '80rem',
        '360': '90rem',
        '400': '100rem',
        '480': '120rem'
      },
      maxWidth: theme => ({
        'container': '1440px',
        ...theme('spacing'),
        ...theme('extendedSpacing'),
      }),
      minWidth: theme => ({
        ...theme('spacing'),
        ...theme('extendedSpacing'),
        screen: '100vw'
      }),
      minHeight: theme => ({
        ...theme('spacing'),
        ...theme('extendedSpacing')
      }),
      scrollMargin: {
        '45': '11.5rem'
      }
    }
  },
  plugins: [
    require(path.resolve(__dirname, 'tailwind/icon-size')),
    require(path.resolve(__dirname, 'tailwind/theming')),
    require(path.resolve(__dirname, 'tailwind/safe-area')),
    require(path.resolve(__dirname, 'tailwind/colors'))({themes}),

    // DaisyUI
    require('daisyui'),

    // Other third party and/or custom plugins
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],

  // DaisyUI Config
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "daisy-",
    darkTheme: "dark",
    themes: [
      {
        default: {
          primary: '#242424',
          'primary-content': '#ffffff',
          secondary: '#1e293b',
          'secondary-content': '#ffffff',
          accent: '#1e293b',
          'accent-content': '#ffffff',
          neutral: '#242424',
          'neutral-content': '#ffffff',
          info: '#52d9ff',
          'info-content': '#ffffff',
          success: '#6ddf54',
          'success-content': '#ffffff',
          warning: '#dd5679',
          'warning-content': '#ffffff',
          error: '#dc2626',
          'error-content': '#ffffff',
          'base-100': '#ffffff',
        }
      }
    ]
  },
}
