const path              = require("path");
const webpack           = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer      = require("autoprefixer");
const jeet              = require("jeet");
const rupture           = require("rupture");
const koutoSwiss        = require("kouto-swiss");
// const appConfig = require("./config/webpack");
// console.log("App Config:\n" + JSON.stringify(appConfig, null, 2));

// path to builded js
const PATH_PUBLIC = '/wp-content/themes/ovent/public/';

const PATH_ROOT         = path.resolve(__dirname);
const PATH_SRC          = path.resolve(PATH_ROOT, 'src');
const PATH_BUILD        = path.resolve(PATH_ROOT, 'public');
const PATH_BUILD_JS     = path.resolve(PATH_BUILD, 'js');
const PATH_BUILD_CSS    = path.resolve(PATH_BUILD, 'css');
const PATH_NODE_MODULES = path.resolve(PATH_ROOT, 'node_modules');
const PATH_STYLES       = path.resolve(PATH_SRC, 'styles')
const PATH_ASSETS       = path.resolve(PATH_ROOT, 'assets');

module.exports = function(env){

  const disableStyleExtract = env === 'dev';
  const cssExtract = new ExtractTextPlugin({
    filename: "styles.css",
    disable: disableStyleExtract
  });

  return {
    entry: {
      // styles: [
      //   path.resolve(PATH_SRC, "styles/main.styl")
      // ],
      index: [
        path.resolve(PATH_SRC, "components/App/index.ts"),
      ],
    },

    output: {
      path:       PATH_BUILD,
      publicPath: PATH_PUBLIC,
      filename: "[name].js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
      alias: {
        app:      PATH_SRC,
      },
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".webpack.js", ".web.js",".js", ".json",
        ".ts", ".tsx", ".styl", ".scss", ".css"],
      modules: [
        PATH_SRC,
        PATH_NODE_MODULES
      ],
    },

    module: {
      rules: [
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        // Exclude intl-* since they have source map problems
        {
          test: /\.js$/,
          loader: "source-map-loader",
          exclude: [/node_modules.intl-/],
          enforce: 'pre'
        },
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        { test: /\.tsx?$/, loader: "ts-loader" },
        { test: /\.json$/, loader: "json-loader" },
        { test: /\.svg$/, loader: 'svg-sprite-loader' },
        { test: /\.(jpe?g|png|ttf|eot|otf)$/, loader: "file-loader" },
        {
          test: /\.styl$/,
          exclude: [
            path.resolve(__dirname, "node_modules"),
          ],
          use: cssExtract.extract({
            fallback: [{
              loader: 'style-loader',
            }],
            use:
            [
              'css-loader?importLoaders=1',
              {
                loader: 'stylus-loader',
                options: {
                  compress: false,
                  use:[
                    koutoSwiss,
                    jeet,
                    rupture,
                  ],
                  import:[
                    PATH_NODE_MODULES+"/kouto-swiss/index.styl",
                    PATH_NODE_MODULES+"/jeet/jeet.styl",
                    PATH_NODE_MODULES+"/rupture/rupture/index.styl",
                    PATH_STYLES+"/utils/index.styl",
                    PATH_STYLES+"/main.styl",
                  ],
                  // include: [
                  //   PATH_SRC,
                  //   PATH_NODE_MODULES,
                  //   PATH_STYLES,
                  //   // PATH_BUILD,
                  //   PATH_ASSETS
                  // ],
                  // stylus: {
                  //   preferPathResolver: 'webpack',
                  // }
                }
              },
            ]
          })
        },
        {
          test: /\.s?css$/,
          exclude: [
            path.resolve(__dirname, "node_modules"),
          ],
          use: cssExtract.extract({
            fallback: [{
              loader: 'style-loader',
            }],
            use:
            [
              'css-loader?importLoaders=1',
              {
                loader: 'stylus-loader',
                options: {
                  includePaths: [
                    path.resolve(PATH_SRC, 'styles')
                  ],
                  stylus: {
                    preferPathResolver: 'webpack',
                  }
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [
                      autoprefixer({
                        browsers: ['iOS >= 9', 'ChromeAndroid >= 50']
                      })
                    ];
                  }
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  includePaths: [PATH_SRC]
                }
              }
            ]
          })
        }
      ],

      noParse: [new RegExp('node_modules/localforage/dist/localforage.js')],
    },

    plugins: [
      cssExtract,
      new webpack.optimize.CommonsChunkPlugin({
          name:       'index',
          minChunks:  0,
          async:      true
        }
      ),
    ],
  };
}
