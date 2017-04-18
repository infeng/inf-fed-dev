const webpack = require('atool-build/lib/webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

let production = process.env.ENV === 'production';

let pkg = require('./package.json');
let theme = {};
if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
}

var conf = {
  filename: 'index.html',
  template: './src/index.html',
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: false
  },
  hash: true,
}

module.exports = function (webpackConfig) {
  webpackConfig.entry = {
    index: './src/index.tsx',
  };

  webpackConfig.output.publicPath = '/';

  webpackConfig.module.loaders.forEach(function (loader, index) {
    if (loader.test.toString().indexOf('html') > 0) {
      loader.loader = 'html';
    }
    if (!production) {
      // In dev, use style in js witch can hot reload after modify css.
      if (loader.loader && loader.loader.indexOf('extract-text-webpack-plugin') >= 0) {
        let restLoader = loader.loader.split('{"remove":true}!')[1];
        loader.loader = `style-loader!${restLoader}`;
      }
    }
  });

  webpackConfig.plugins.push(
    new HtmlWebpackPlugin(conf)
  );

  webpackConfig.plugins.some(function (plugin, i) {
    if (plugin instanceof webpack.optimize.CommonsChunkPlugin) {
      webpackConfig.plugins.splice(i, 1);

      return true;
    }
    if (!production && plugin instanceof ExtractTextPlugin) {
      webpackConfig.plugins.splice(i, 1);

      return true;
    }
  });

  return webpackConfig;
};
