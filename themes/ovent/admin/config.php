<?php
/**
 * Create some options pages in wp admin panel
 * + define vars based on those options
 */
if( function_exists('acf_add_options_page') ) {

  create_ovent_option_page();
  define_ovent_options();

}

/**
 * default option page
 * will use acf plugin to feed form inputs
 * https://www.advancedcustomfields.com/resources/acf_add_options_page/
 * https://codex.wordpress.org/Creating_Options_Pages
 *
 * @return {void}
 */
function create_ovent_option_page(){

  acf_add_options_page(
    array(
      'page_title'  => 'Options',
      'menu_title'  => 'Options',
      'menu_slug'   => 'ovent_options',
      'capability'  => 'manage_options',
      'redirect'  => false
    )
  );
}

/**
 * set some constants based on ovent option page
 * @return {void}
 */
function define_ovent_options(){

  // define('OVENT_TEST_SOMETHING',
  //   get_option_field('OVENT_TEST_SOMETHING', 'default value'));

}

/**
 * get an option value
 * @param  {string} $field - fieldname
 * @param  {any} $default=null - default value
 * @return {any} field value
 */
function get_option_field($field, $default=null){
  $data = get_field($field, 'option');
  return $data? $data : $default;
}


function my_acf_google_map_api( $api ){

	$api['key'] = 'AIzaSyDrs2N3oSmTP5aLAl827de_Inv8ZpMx-bU';

	return $api;

}
add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');
