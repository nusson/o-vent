<?php
/**
 *  Scripts (js/css) to import
 *
 *  @author  nico <hello@nusson.ninja>
 *  ---------------------
 *  [_REM_] remove scripts
 *  [_SCR_] load scripts
 *  [_CON_] load conditional scripts
 *  [_STY_] load styles
 *  [_FUN_] usefull functions
 */

/* [_REM_] remove scripts */

// REMOVE WP EMOJI
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
// remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
// remove_action( 'admin_print_styles', 'print_emoji_styles' );

/**
 * Move jQuery to the footer.
 */
function jquery_in_footer() {
    wp_scripts()->add_data( 'jquery', 'group', 1 );
    wp_scripts()->add_data( 'jquery-core', 'group', 1 );
    wp_scripts()->add_data( 'jquery-migrate', 'group', 1 );
}
add_action( 'wp_enqueue_scripts', 'jquery_in_footer' );

/*
 *  [_SCR_] load scripts
 *  !!! here will load scripts EVERYWHERE, event admin
 *  use ovent_conditional_scripts for conditional page
 */
function ovent_header_scripts() {

  // pass Ajax Url to script.js
  wp_localize_script('script', 'ajaxurl', admin_url( 'admin-ajax.php' ) );
}
add_action('init', 'ovent_header_scripts');


/*
 *  [_CON_] load conditional scripts
 *  mainly only on front)
 */
function ovent_conditional_scripts() {
	if(! is_admin()){

    // wp_register_script('modernizr',
    //   get_template_directory_uri() . '/public/js/libs/modernizr-detectizr.min.js',
    //   array(), '3.3.1', true); // Modernizr
    // wp_enqueue_script('modernizr');

    // wp_register_script('api',
    //   get_template_directory_uri() . '/public/js/libs/api.js',
    //   array(), SCRIPTS_VERSION, true);
    // wp_enqueue_script('api');

    // wp_register_script('vendors',
    //   get_template_directory_uri() . '/public/js/bundle.vendors.js',
    //   array(), SCRIPTS_VERSION, true);
    // wp_enqueue_script('vendors');

    if(!(WP_ENV === 'production'
      || WP_ENV === 'staging'
      || WP_ENV === 'development'
      // || WP_ENV === 'nhusson'
      || WP_ENV === 'dev')){
      wp_register_script('vendors',
        get_template_directory_uri() . '/public/vendors.js',
        array(), SCRIPTS_VERSION, true);
      wp_enqueue_script('vendors');

      // wp_register_script('styles',
      //   get_template_directory_uri() . '/public/styles.js',
      //   array(), SCRIPTS_VERSION, true);
      // wp_enqueue_script('styles');
    }

    wp_register_script('app',
      get_template_directory_uri() . '/public/index.js',
      array(), SCRIPTS_VERSION, true);
    wp_enqueue_script('app');

	}
}
add_action('wp_print_scripts', 'ovent_conditional_scripts');


/* [_STY_] load styles */
function ovent_styles() {
  if(WP_ENV === 'production'
    || WP_ENV === 'staging'
    || WP_ENV === 'development'
    // || WP_ENV === 'nhusson'
    || WP_ENV === 'dev'){
    wp_register_style('styles',
      get_template_directory_uri() . '/public/styles.css',
      array(), '1.0', 'all');
    wp_enqueue_style('styles');
  }else{
    // styles are embeded within js ;)
  }
}
add_action('wp_enqueue_scripts', 'ovent_styles');


/*------------------------------------*\
  [_FUN_] usefull functions
  (about scripts like GA etc)
\*------------------------------------*/
/*
 * output footer styles (app.css)
 * main.css will be injected inline
 */
function output_footer_styles(){
  echo "
  <!-- styles -->
  <!-- end styles -->";
};
/*
 * output basics datas through jsvars
 */
function output_jsvars(){
  echo "
  <!-- jsvars - basics -->
  <script type='text/javascript'>
    window.jsvars   = window.jsvars || {};
    Object.assign(window.jsvars, {
      ".get_jsvars_basics().",
      ".get_jsvars_routes().",
    });";
  echo "
  </script>
  <!-- end jsvars basics -->";
};
/*
 * output basics datas through jsvars
 */
function get_jsvars_basics(){
  return "path: {
        images: '".get_template_directory_uri()."',
        ajax:   '/wp-admin/admin-ajax.php'
      },
      env:      '".WP_ENV."'";
};
/*
 * output (translated) routes for frontend router through jsvars
 */
function get_jsvars_routes(){
  $routes = get_routes();
  return "routes:   ".json_encode($routes);
};
