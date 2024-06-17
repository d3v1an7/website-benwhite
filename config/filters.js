import fs from 'fs';
import { format, diffYears } from '@formkit/tempo';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import cssnano from 'cssnano';
import discardComments from 'postcss-discard-comments';
import defaultTheme from 'tailwindcss/defaultTheme.js';

export const configFilters = {
  dateShort(dateString) {
    return format(dateString, 'YYYY-MM-DD');
  },
  dateLong(dateString) {
    return format(dateString, 'D MMMM YYYY');
  },
  yearsSince(dateString) {
    return diffYears(new Date(), new Date(dateString));
  },
  makeBreadcrumbs(pathString) {
    const pathArray = pathString
      .split('/')
      .filter((segment) => segment && segment !== 'index');
    return pathArray.map((segment, index, array) => ({
      title: segment,
      path: `/${array.slice(0, index + 1).join('/')}`,
    }));
  },
  async buildCss(file) {
    const css = fs.readFileSync(file, 'utf8');
    const plugins = [
      /** @type {import('tailwindcss').Config} */
      tailwindcss({
        content: ['./src/style.css', './src/**/*.webc'],
        darkMode: 'selector',
        theme: {
          extend: {
            fontFamily: {
              mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
              sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
          },
        },
      }),
      autoprefixer,
      cssnano,
      discardComments({ removeAll: true }),
    ];
    const result = await postcss(plugins).process(css, {
      from: file,
      to: null,
    });
    return result.css;
  },
};
