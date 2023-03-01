const lodash = require('lodash');
const chroma = require('chroma-js');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

const custom = {
  background: {
    light: {
      'bg-app': '#f5f5f5',
      'bg-card': '#ffffff',
      'bg-default': colors.slate[100],
      'bg-dialog': '#FFFFFF',
      'bg-scroll-bar': '#0000003d',
      'bg-hover': chroma(colors.slate[400]).alpha(0.12).css(),
    },
    dark: {
      'bg-app': '#111827',
      'bg-card': '#1f2937',
      'bg-default': colors.slate[900],
      'bg-dialog': colors.slate[800],
      'bg-scroll-bar': '#ffffff3d',
      'bg-hover': 'rgba(255, 255, 255, 0.05)',
    },
  },
  foreground: {
    light: {
      'text-default': colors.slate[800],
      'text-secondary': colors.slate[500],
      'text-hint': colors.slate[400],
      'text-disabled': colors.slate[400],
      'border': colors.slate[200],
      'divider': colors.slate[200],
      'icon': colors.slate[500],
      'mat-icon': colors.slate[500],
    },
    dark: {
      'text-default': '#FFFFFF',
      'text-secondary': colors.slate[400],
      'text-hint': colors.slate[500],
      'text-disabled': colors.slate[600],
      'border': chroma(colors.slate[100]).alpha(0.12).css(),
      'divider': chroma(colors.slate[100]).alpha(0.12).css(),
      'icon': colors.slate[400],
      'mat-icon': colors.slate[400],
    },
  },
};

module.exports = plugin(({ addComponents }) => {
  const schemes = lodash.map(['light', 'dark'], (colorScheme) => {
    const isDark = colorScheme === 'dark';
    const background = custom.background[colorScheme];
    const foreground = custom.foreground[colorScheme];
    const lightSchemeSelectors = 'body.light, .light, .dark .light';
    const darkSchemeSelectors = 'body.dark, .dark, .light .dark';

    return {
      [isDark ? darkSchemeSelectors : lightSchemeSelectors]: {
        ...(!isDark ? { '--is-dark': 'false' } : {}),
        ...lodash.fromPairs(
          lodash.flatten(
            lodash.map(background, (value, key) => [
              [`--${key}`, value],
              [`--${key}-rgb`, chroma(value).rgb().join(',')],
            ])
          )
        ),
        ...lodash.fromPairs(
          lodash.flatten(
            lodash.map(foreground, (value, key) => [
              [`--${key}`, value],
              [`--${key}-rgb`, chroma(value).rgb().join(',')],
            ])
          )
        ),
      },
    };
  });

  addComponents(schemes);

  addComponents({
    '.bg-app': {
      '--tw-bg-opacity': '1',
      backgroundColor: 'rgba(var(--bg-app-rgb), var(--tw-bg-opacity))'
    },
    '.bg-card': {
      '--tw-bg-opacity': '1',
      backgroundColor: 'rgba(var(--bg-card-rgb), var(--tw-bg-opacity))'
    },
    '.bg-default': {
      '--tw-bg-opacity': '1',
      backgroundColor: 'rgba(var(--bg-default-rgb), var(--tw-bg-opacity))'
    },
    '.bg-hover': {
      '--tw-bg-opacity': '0.12',
      backgroundColor: 'rgba(var(--bg-hover-rgb), var(--tw-bg-opacity))'
    },
    '.text-default': {
      '--tw-text-opacity': '1',
      color: 'rgba(var(--text-default-rgb), var(--tw-text-opacity))'
    },
    '.text-secondary': {
      '--tw-text-opacity': '1',
      color: 'rgba(var(--text-secondary-rgb), var(--tw-text-opacity))'
    },
    '.text-hint': {
      '--tw-text-opacity': '1',
      color: 'rgba(var(--text-hint-rgb), var(--tw-text-opacity))'
    },
    '.text-disabled': {
      '--tw-text-opacity': '1',
      color: 'rgba(var(--text-disabled-rgb), var(--tw-text-opacity))'
    },
    '.material-scroll': {
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
        backgroundColor: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        backgroundColor: 'var(--bg-scroll-bar)',
      }
    }
  });
});
