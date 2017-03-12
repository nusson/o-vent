<?php
/**
 *	Add some custom routes
 *	without creating pages (no need because only front-end rendering)
 *
 *  @author  nico <hello@nusson.ninja>
 */

function add_routes() {
}
add_action('init', 'add_routes');


/**
 * list our routes for front router
 * @return [array] - routes
 */
function get_routes(){
  $lang = '/:lang';

  // $lang = '';
  return array(
    'home' => array(
      '/',
      $lang.'/',
    ),
  );
}


/**
 * return post slug of the translated post
 * @param  {string} $key - translated string key (like SLUG_LOGIN)
 * @return {string} $slug
 */
function getTranslatedPostSlug($key){
  $slug       = pll_translate_string($key, 'fr');
  $pid        = get_page_by_path($slug)->ID;
  $trans_pid  = pll_get_post($pid);
  $trans_post = get_post($trans_pid);
  return $trans_post->post_name;
}
