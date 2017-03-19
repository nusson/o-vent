<?php
/**
 *	Define some shortcodes
 *
 *  @author  nico <hello@nusson.ninja>
 */


/**
 * google map + list of shops
 */
function ovent_shops_shortcode( $atts ) {
  global $post;

  // get shops
  $shops = array();
  foreach($post->shops as $item){
    $shop = new TimberPost($item);
    array_push($shops, $shop);
  }

  // render
  return Timber::compile('components/Shops/template.twig', array(
    'post'  => $post,
    'shops' => $shops
  ));
}
add_shortcode('shops', 'ovent_shops_shortcode');
