/**
 * App
 *
 * @author nico <hello@nusson.ninja>
 */

/**
 * Our entry point
 * act as a preloader and ensure main app's loaded
 *
 * @author nico <hello@nusson.ninja>
 */

// import 'babel-polyfill';
// import objectFitImages from 'object-fit-images';
require('./styles');
// require('./test');

// // Accept hot module reloading
// declare const module: any;
// console.log('module', module)
// if (module.hot) {
//   module.hot.accept()
// }

// declare const Detectizr: any;
// if (Detectizr) {
//   Detectizr.detect();
// }

/**
 * Wait for document/device ready then start our app
 */
const ready = function(cb){
  // if (typeof(window.cordova) !== "undefined") {
  //   document.addEventListener("deviceready", cb);
  // }else{
    if (document.readyState != 'loading') cb();
    else document.addEventListener('DOMContentLoaded', cb);
  // }
}(function(){
  document.createElement('main'); //ie fix

  require.ensure([
    // 'intl',
    // 'intl/locale-data/jsonp/en.js',
    'components/Interface',
  ], function (require) {
    let Interface = require('components/Interface') as {Interface:any}
    new Interface.Interface()
    // // objectFitImages();

  });
})

