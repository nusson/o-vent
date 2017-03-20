const webpack                 = require("webpack");
const path                    = require("path");
const ExtractTextPlugin       = require('extract-text-webpack-plugin');
const config                  = require("./webpack.base.config.js")('build');

config.plugins.push(
  // Extract to styles.css (optim by postcss-csso)
  new ExtractTextPlugin({
    filename: "[name].css",
    allChunks: true
  }),
  // min js
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    warnings: false,
  }),
  // This disables some diagnostics and warnings in React
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
);

module.exports = config;
