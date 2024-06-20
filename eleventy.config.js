import bundlerPlugin from '@11ty/eleventy-plugin-bundle';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import webc from '@11ty/eleventy-plugin-webc';
import { configCollections } from './config/collections.js';
import { configFeeds } from './config/feeds.js';
import { configFilters } from './config/filters.js';
import { configPlugins } from './config/plugins.js';
import { configTransforms } from './config/transforms.js';

export default async function (eleventyConfig) {
  eleventyConfig.addCollection('everything', configCollections.everything);
  eleventyConfig.addCollection(
    'aboutReversed',
    configCollections.aboutReversed,
  );
  eleventyConfig.addCollection('blogReversed', configCollections.blogReversed);
  eleventyConfig.addCollection(
    'snippetsReversed',
    configCollections.snippetsReversed,
  );
  eleventyConfig.addPlugin(feedPlugin, configFeeds.everything);
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
  eleventyConfig.addTransform(
    'addTargetToLinks',
    configTransforms.addTargetToLinks,
  );
  eleventyConfig.addTransform('curlyQuotes', configTransforms.curlyQuotes);
  eleventyConfig.addTransform('minifyHtml', configTransforms.minifyHtml);
  eleventyConfig.addTransform('formatXml', configTransforms.formatXml);
  // BUG?: @html and @raw will convert entities when used in `<style>`.
  // https://github.com/11ty/webc/issues/208
  eleventyConfig.addTransform('fixInlineStyle', async function (content) {
    return this.outputPath.split('.').pop() === 'html'
      ? content.replace(/&gt;/g, '>')
      : content;
  });
  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
}
