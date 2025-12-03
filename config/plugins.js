import esbuild from 'esbuild';

export const configPlugins = {
  webc: {
    components: './src/_components/**/*.webc',
  },
  eleventyImage: {
    formats: ['webp', 'gif'],
    widths: ['auto'],
    outputDir: './_site/img/',
    urlPath: '/img/',
    sharpOptions: {
      animated: true,
    },
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async',
      },
      pictureAttributes: {},
    },
  },
  // Add esbuild transform to WebC bundler.
  // This allows us to write nice, sane code within inline <script> tags that can use imports.
  // The transform also ensures JS code will also be minified and made compatible for older browsers.
  bundler: {
    transforms: [
      async function (code) {
        if (this.type === 'js') {
          const bundledCode = await esbuild.build({
            stdin: {
              contents: code,
              resolveDir: './src',
            },
            bundle: true,
            minify: true,
            target: 'es2017',
            write: false,
          });
          return bundledCode.outputFiles[0].text;
        }
        return code;
      },
    ],
  },
};
