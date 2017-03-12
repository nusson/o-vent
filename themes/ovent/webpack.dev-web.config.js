var config  = require("./webpack.base.config.js")('dev');
var webpack = require("webpack");

const HOST        = 'localhost';
const PORT        = '4000';

// Create a fake node server
config.devServer = {
  inline: true,
  hot: true,
  contentBase:       '/wp-content/themes/ovent/public/',
  // contentBase:    'public/',
  colors: true,
  progress: true
};

// HMR - live reload stuff
// https://webpack.github.io/docs/hot-module-replacement.html
config.entry.vendors = [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?http://${HOST}:${PORT}&inline=true&hot=true&reload=true',//&reload=true',
];
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    filename: 'vendors.js'
  })
)
config.devtool = 'eval'; // sourcemap
module.exports = config;
