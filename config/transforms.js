import { minify } from 'html-minifier-terser';
import * as prettier from 'prettier';
import xmlFormat from 'xml-formatter';
import ConsoleLogger from '@11ty/eleventy/src/Util/ConsoleLogger.js';
import * as cheerio from 'cheerio';

const cl = new ConsoleLogger();

export const configTransforms = {
  addTargetToLinks(content) {
    const $ = cheerio.load(content);
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href.startsWith('/') || href.startsWith('#')) {
        $(element).attr('target', '_self');
      } else {
        $(element).attr('target', '_blank');
      }
      cl.info(
        `Modified link: ${$(element).attr('href')} => ${$(element).attr('target')}`,
      );
    });
    return $.html();
  },
  async minifyHtml(content) {
    if (this.outputPath.split('.').pop() === 'html') {
      const minifyOptions = {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeComments: true,
      };
      const minifiedContent = await minify(content, minifyOptions);
      const prettierOptions = {
        printWidth: 1000,
        bracketSameLine: true,
        htmlWhitespaceSensitivity: 'css',
        parser: this.page.outputFileExtension,
      };
      cl.info(`Minified: ${this.outputPath}`);
      // Prettier slows down the build a bit, but we're still in the seconds range, and the output is lovely, so why not.
      return prettier.format(minifiedContent, prettierOptions);
    } else {
      return content;
    }
  },
  async formatXml(content) {
    if (this.outputPath.split('.').pop() === 'xml') {
      cl.info(`Formatted: ${this.outputPath}`);
      const formatOptions = {
        collapseContent: true,
      };
      return xmlFormat(content, formatOptions);
    } else {
      return content;
    }
  },
};
