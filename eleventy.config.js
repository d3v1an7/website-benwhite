import { minify } from 'html-minifier-terser';
import markdownIt from 'markdown-it';
import webc from '@11ty/eleventy-plugin-webc';
import { format } from '@formkit/tempo';

export default async function (eleventyConfig) {
  eleventyConfig.addFilter('dateShort', function (date) {
    return format(date, 'YYYY-MM-DD');
  });
  eleventyConfig.addFilter('dateLong', function (date) {
    return format(date, 'D MMMM YYYY');
  });
  eleventyConfig.addFilter('filterBreadcrumbs', function (path) {
    const pathArray = path
      .split('/')
      .filter((segment) => segment && segment !== 'index');
    return pathArray.map((segment, index, array) => ({
      title: segment,
      path: `/${array.slice(0, index + 1).join('/')}`,
    }));
  });
  eleventyConfig.addLayoutAlias('base', 'base.webc');
  eleventyConfig.addLayoutAlias('home', 'index.webc');
  eleventyConfig.addLayoutAlias('page', 'page.webc');
  eleventyConfig.setServerOptions({
    watch: ['_site/**/*.css'],
  });
  eleventyConfig.addPassthroughCopy({
    './public/': '/',
  });
  eleventyConfig.addPlugin(webc, {
    components: './src/_components/**/*.webc',
  });
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });
  eleventyConfig.setLibrary('md', markdownLibrary);
  eleventyConfig.addTransform('minify', async function (content) {
    if (
      (this.outputPath && this.outputPath.split('.').pop() === 'html') ||
      (!this.outputPath && this.page.outputFileExtension === 'html')
    ) {
      const minifyOptions = {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeComments: true,
      };
      return minify(content, minifyOptions);
    } else {
      return content;
    }
  });
  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
}
