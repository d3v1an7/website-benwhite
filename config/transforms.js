import { minify } from 'html-minifier-terser';
import * as prettier from 'prettier';
import xmlFormat from 'xml-formatter';
import * as cheerio from 'cheerio';

export const configTransforms = {
  addTargetToLinks(content) {
    if (!this.outputPath.endsWith('.html')) return content;
    const $ = cheerio.load(content);
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href.startsWith('/') || href.startsWith('#')) {
        $(element).attr('target', '_self');
      } else {
        $(element).attr('target', '_blank');
      }
      console.log(
        'Modified link',
        `${$(element).attr('href')} => ${$(element).attr('target')}`,
      );
    });
    return $.html();
  },
  curlyQuotes(content) {
    if (!this.outputPath.endsWith('.html')) return content;
    const $ = cheerio.load(content);
    function convertToCurlyQuotes(text) {
      const openingSingleQuote = /(^|[\s(\[{<])'/g;
      const openingDoubleQuote = /(^|[\s(\[{<])"/g;
      const closingSingleQuote = /'/g;
      const closingDoubleQuote = /"/g;
      const emDash = /--/g;
      return text
        .replace(openingSingleQuote, '$1\u2018') // Opening single quote ‘ (U+2018)
        .replace(closingSingleQuote, '\u2019') // Closing single quote ’ (U+2019)
        .replace(openingDoubleQuote, '$1\u201C') // Opening double quote “ (U+201C)
        .replace(closingDoubleQuote, '\u201D') // Closing double quote ” (U+201D)
        .replace(emDash, '\u2014'); // Em dash — (U+2014)
    }
    function processNodes(node) {
      node.contents().each((_index, element) => {
        if (element.type === 'text') {
          element.data = convertToCurlyQuotes(element.data);
        } else if (
          element.type === 'tag' &&
          element.name !== 'code' &&
          element.name !== 'pre'
        ) {
          processNodes($(element));
        }
      });
    }
    $('main#content').each((_index, element) => {
      processNodes($(element));
    });
    return $.html();
  },
  async minifyHtml(content) {
    if (!this.outputPath.endsWith('.html')) return content;
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
    console.log('Minified', this.outputPath);
    // Prettier slows down the build a bit, but we're still in the seconds range, and the output is lovely, so why not.
    return prettier.format(minifiedContent, prettierOptions);
  },
  async formatXml(content) {
    if (!this.outputPath.endsWith('.xml')) return content;
    console.log('Formatted', this.outputPath);
    const formatOptions = { collapseContent: true };
    return xmlFormat(content, formatOptions);
  },
};
