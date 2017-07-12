/*
 * Start.js
 * Allow to run browsersync within webpack
 * that's allow us to proxy a wordpress website
 * and enjoy HMR
 *
 * @author nico <hello@nusson.ninja>
 */

const PROXY_TARGET          = 'ovent.int';
const HOST                  = 'localhost';
const PORT                  = '4000';
const OPEN                  = false; // false | 'external' | 'local'

let browserSync:any             = require('browser-sync');
browserSync                     = browserSync.create();
const webpack:any               = require('webpack');
const webpackDevMiddleware:any  = require('webpack-dev-middleware');
const webpackHotMiddleware:any  = require('webpack-hot-middleware');
const htmlInjector:any          = require('bs-html-injector');
const webpackConfig:any         = require('../webpack.dev-web.config');
const bundler                   = webpack(webpackConfig);

declare var ScrollMagic:{
  Controller:any,
  Scene:any
};
// recommended: clean your build folder

// setup html injector, only compare differences within outer most div (#page)
// otherwise, it will replace the webpack HMR scripts
browserSync.use(htmlInjector, { restrictions: [ '#page' ] });

browserSync.init({
  files: [{
    // scss|js managed by webpack
    // optionally exclude other managed assets: images, fonts, etc
    match: [ '**/*.!(scss|js)' ],

    // manually sync everything else
    fn: synchronize,
  }],

  proxy: {
    // proxy local WP install
    target: PROXY_TARGET,

    middleware: [
      // converts browsersync into a webpack-dev-server
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
      }),
      // hot update js &amp;&amp; css
      webpackHotMiddleware(bundler),
    ],
  },
  host: HOST,
  port: PORT,
  open: OPEN,
  ghostMode: false,

  // ..."browserSync-config"
});

function synchronize(event:Event, file:any) {
  // copy/remove file
  // if you keep assets in your src/sass folder, that might need flattened, depending on your build

  // ...

  // activate html injector
  if (file.endsWith('php')) {htmlInjector();}
}
