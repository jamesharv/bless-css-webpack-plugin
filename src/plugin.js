const bless = require('bless');
const {RawSource} = require('webpack-sources');

const CSS_REGEXP = /\.css$/;

class BlessCSSWebpackPlugin {

  apply(compiler) {

    compiler.plugin('compilation', (compilation) => {

      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {

        chunks.forEach(chunk => {
          chunk.files
            .filter(filename => filename.match(CSS_REGEXP))
            .forEach(cssFileName => {

              const parsedData = bless.chunk(compilation.assets[cssFileName].source(), {source: cssFileName});

              if (parsedData.data.length > 1) {
                const filenameWithoutExtension = cssFileName.replace(CSS_REGEXP, '');

                parsedData.data.forEach((file, index) => {

                  const filename = index === 0 ? cssFileName : `${filenameWithoutExtension}-blessed${index}.css`;

                  compilation.assets[filename] = new RawSource(file);

                  if (index > 0) {
                    chunk.files.push(filename);
                  }

                });

              }

            });
        });

        callback();

      });

    });

  }

}

module.exports = BlessCSSWebpackPlugin;