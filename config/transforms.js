import { minify } from 'html-minifier-terser';
import * as prettier from 'prettier';
import xmlFormat from 'xml-formatter';
import ConsoleLogger from '@11ty/eleventy/src/Util/ConsoleLogger.js';

const cl = new ConsoleLogger();

export const configTransforms = {
  async minifyHtml(content) {
    if (this.outputPath.split('.').pop() === 'html') {
      cl.info(`Minifying ${this.outputPath}`);
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
      // Prettier slows down the build a bit, but we're still in the seconds range, and the output is lovely, so why not.
      return prettier.format(minifiedContent, prettierOptions);
    } else {
      return content;
    }
  },
  async formatXml(content) {
    if (this.outputPath.split('.').pop() === 'xml') {
      cl.info(`Formatting ${this.outputPath}`);
      const formatOptions = {
        collapseContent: true,
      };
      return xmlFormat(content, formatOptions);
    } else {
      return content;
    }
  },
};
