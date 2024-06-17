import bundlerPlugin from '@11ty/eleventy-plugin-bundle';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import webc from '@11ty/eleventy-plugin-webc';
import { configFeeds } from './config/feeds.js';
import { configFilters } from './config/filters.js';
import { configPlugins } from './config/plugins.js';
import { configTransforms } from './config/transforms.js';

export default async function (eleventyConfig) {
  // BUG: https://github.com/11ty/eleventy-plugin-rss/issues/50
  eleventyConfig.addFilter('head', (arr, num) => {
    return num ? arr.slice(0, num) : arr;
  });
  eleventyConfig.addPlugin(feedPlugin, configFeeds.about);
  eleventyConfig.addPlugin(feedPlugin, configFeeds.blog);
  eleventyConfig.addPlugin(feedPlugin, configFeeds.snippets);
  eleventyConfig.addFilter('dateShort', configFilters.dateShort);
  eleventyConfig.addFilter('dateLong', configFilters.dateLong);
  eleventyConfig.addFilter('yearsSince', configFilters.yearsSince);
  eleventyConfig.addFilter('makeBreadcrumbs', configFilters.makeBreadcrumbs);
  eleventyConfig.addFilter('compileCss', configFilters.buildCss);
  eleventyConfig.addWatchTarget('./src/style.css');
  eleventyConfig.addLayoutAlias('base', 'base.webc');
  eleventyConfig.addLayoutAlias('home', 'index.webc');
  eleventyConfig.addLayoutAlias('page', 'page.webc');
  eleventyConfig.addPassthroughCopy({ './public/': '/' });
  eleventyConfig.addPlugin(webc, configPlugins.webc);
  eleventyConfig.addPlugin(bundlerPlugin, configPlugins.bundler);
  eleventyConfig.addTransform('minifyHtml', configTransforms.minifyHtml);
  // BUG?: @html and @raw will convert entities when used in `<style>`.
  eleventyConfig.addTransform('fixInlineStyle', async function (content) {
    return content.replace(/&gt;/g, '>');
  });
  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
}
