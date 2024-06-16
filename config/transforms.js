import { minify } from 'html-minifier-terser';

export const configTransforms = {
  async minifyHtml(content) {
    if (this.outputPath.split('.').pop() !== 'html') return content;
    const minifyOptions = {
      collapseWhitespace: true,
      conservativeCollapse: true,
      preserveLineBreaks: true,
      removeComments: true,
    };
    return minify(content, minifyOptions);
  },
};
