import fs from 'fs';
import { format, diffDays, diffMonths, diffYears } from '@formkit/tempo';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import cssnano from 'cssnano';
import discardComments from 'postcss-discard-comments';
import defaultTheme from 'tailwindcss/defaultTheme.js';

export const configFilters = {
  dateFormat(dateString, formatString) {
    return format(dateString, formatString);
  },
  durationShort(start, end) {
    // Spec: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-duration-string
    return `PD${diffDays((start, end))}`;
  },
  durationLong(start, end) {
    const months = diffMonths(end, start);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    let result = '';
    if (years > 0) {
      result += years + (years > 1 ? ' years' : ' year');
    }
    if (years > 0 && remainingMonths > 0) {
      result += ', ';
    }
    if (remainingMonths > 0) {
      result += remainingMonths + (remainingMonths > 1 ? ' months' : ' month');
    }
    return result;
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
        plugins: [
          function ({ addVariant, e }) {
            addVariant('terminal', ({ modifySelectors, separator }) => {
              modifySelectors(({ className }) => {
                return `.terminal .${e(`terminal${separator}${className}`)}`;
              });
            });
          },
        ],
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
  filteredTags(tags) {
    const tagsSet = new Set();
    tags
      .filter((tag) => !['about', 'blog', 'snippets'].includes(tag))
      .forEach((tag) => tagsSet.add(tag));
    return Array.from(tagsSet).sort();
  },
};
