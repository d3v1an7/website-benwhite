/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'consistent',
  bracketSpacing: true,
  bracketSameLine: true,
  singleAttributePerLine: true,
  plugins: ['prettier-plugin-tailwindcss'],
};
export default config;
