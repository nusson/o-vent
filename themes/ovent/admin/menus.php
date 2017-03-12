<?php
/**
 *	Register some menus
 *
 *  @author  nico <hello@nusson.ninja>
 */

function register_menus() {
  register_nav_menu( 'primary', __( 'Primary Menu' ) );
}
add_action( 'after_setup_theme', 'register_menus' );
?>
