const webpack = require('atool-build/lib/webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var conf = {
  filename: 'index.html',
  template: './src/entries/index.html',
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: false
  },
  hash: true,
}

module.exports = function (webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');
  webpackConfig.entry = {
    index: './src/entries/index.tsx',
  };

  webpackConfig.output.publicPath = '/';

  webpackConfig.module.loaders.forEach(function (loader, index) {
    if (loader.test.toString().indexOf('html') > 0) {
      loader.loader = 'html';
    }
    if (loader.test.toString().indexOf('tsx') >= 0) {
      loader.loaders = ['react-hot'].concat(loader.loaders);
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
  });

  return webpackConfig;
};
