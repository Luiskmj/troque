/* eslint-disable */
const colors = require('tailwindcss/colors');

const withOpacity =
  (variable) =>
  ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variable}), ${opacityValue})`;
    }

    if (opacityVariable !== undefined) {
      return `rgba(var(${variable}), var(${opacityVariable}, 1))`;
    }

    return `rgb(var(${variable}))`;
  };

const withVariant = (pattern, variants = ['hover', 'focus']) => [
  pattern,
  ...variants.map((variant) => `${variant}:${pattern}`),
];

module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,js,jsx,ts,tsx}', './safelist.txt'],
  },
  prefix: '_',
  theme: {
    zIndex: {
      alert: 1000,
      select: 99999,
    },
    opacity: {
      0: '0',
      5: '0.05',
      10: '0.10',
      25: '0.25',
      50: '0.5',
      75: '0.75',
      100: '1',

      overlay: '0.1',
      'overlay-disabled': '0.05',
      outline: '0.15',

      primary: '1',
      secondary: '0.65',
      tertiary: '0.3',

      hovered: '0.075',
      dragged: '0.15',
      selected: '0.15',
      activated: '0.225',
      focused: '0.225',
      pressed: '0.3',
    },
    screens: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '1xl': '1280px',
      '2xl': '1400px',
    },
    spacing: {
      0: '0px',
      1: '1px',
      ...Object.fromEntries(
        Array(128)
          .fill()
          .map((_, i) => [(i + 1) * 4, `${((i + 1) * 4) / 16}rem`])
      ),
    },
    typography: {
      'display-lg': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '57px',
        lineHeight: '64px',
        letterSpacing: '0',
      },
      'display-md': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '45px',
        lineHeight: '52px',
        letterSpacing: '0',
      },
      'display-sm': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '36px',
        lineHeight: '44px',
        letterSpacing: '0',
      },
      'headline-lg': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '32px',
        lineHeight: '40px',
        letterSpacing: '0',
      },
      'headline-md': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '28px',
        lineHeight: '36px',
        letterSpacing: '0',
      },
      'headline-sm': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: '0',
      },
      'title-lg': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '22px',
        lineHeight: '28px',
        letterSpacing: '0',
      },
      'title-md': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
      },
      'title-sm': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
      },
      'label-lg': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
      },
      'label-md': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.5px',
      },
      'label-sm': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '11px',
        lineHeight: '16px',
        letterSpacing: '0.5px',
      },
      'body-lg': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
      },
      'body-md': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
      },
      'body-sm': {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
      },
    },
    colors: {
      white: '#fff',
      black: '#000',
      kangu: '#FB6B12',
      gray: {
        500: '#565758',
        100: '#f1f1f1',
      },
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      maxWidth: (theme) => theme('width'),
      maxHeight: (theme) => theme('height'),
      minWidth: (theme) => theme('width'),
      minHeight: (theme) => theme('height'),
      padding: {
        full: '100%',
      },
      backgroundImage: {
        tr: 'linear-gradient(245.18deg, rgb(29, 46, 66) 0%, rgb(56, 141, 211) 100%)',
        chart:
          'linear-gradient(180deg, rgba(26, 111, 205, 0.15) 0%, rgba(26, 111, 205, 0) 50.52%)',
        cards: 'linear-gradient(143.7deg, #1A6FCD 0%, #092646 100%)',
        'tr-secondary-gradient':
          'linear-gradient(-264.81deg, rgb(53, 255, 158) 0%, rgb(0, 178, 217) 100%)',
      },
      colors: {
        warning: withOpacity('--tw-warning'),
        error: withOpacity('--tw-error'),
        info: withOpacity('--tw-info'),
        success: withOpacity('--tw-success'),
        primary: {
          DEFAULT: withOpacity('--primary'),
          light: withOpacity('--primary-light'),
          dark: withOpacity('--primary-dark'),
        },
        'tr-primary': {
          DEFAULT: withOpacity('--tr-primary'),
          light: withOpacity('--tr-primary-light'),
          dark: withOpacity('--tr-primary-dark'),
        },
        star: 'rgb(240, 230, 100)',
        check: 'rgb(50, 250, 163)',
        gradient: {
          blue: colors.blue['400'],
          purple: colors.purple['600'],
        },
        on: {
          primary: withOpacity('--on-primary'),
        },
      },
      boxShadow: {
        light: '0 10px 10px -10px rgba(0, 0, 0, 0.075)',
      },
    },
    corePlugins: {
      preflight: false,
    },
  },
  plugins: [
    ({ addComponents, theme }) => {
      const stylePrefix = 'typography';

      addComponents(
        Object.entries(theme(stylePrefix)).map(([key, value]) => ({
          [`.${stylePrefix}-${key}`]: value,
        }))
      );
    },
    require('tailwind-safelist-generator')({
      path: 'safelist.txt',
      patterns: [
        ...withVariant('_border-{colors}'),
        ...withVariant('_bg-{colors}'),
        ...withVariant('_text-{colors}'),
        ...withVariant('_ring-{colors}'),
      ],
    }),
  ],
};
