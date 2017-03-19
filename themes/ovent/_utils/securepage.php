<?php
if ( post_password_required( $post->ID ) ) {
  Timber::render( 'single-password.twig', $context );
} else {

  // ensure you have access. If not, redirect to login
  // @todo because here is for no access
  $page_parent   = $post;
  $page_parentID = 0;
  while($page_parent->post_parent > 0){
    $page_parentID  = $page_parent->post_parent;
    $page_parent   = get_post($page_parentID);
    // var_dump($page_parent->post_name);
  }
  if($page_parent->post_name == 'SLUG_SOME_PROTECTED_PAGE'){
    if(!isset($context['user'])){
      wp_redirect( '/'.pll__('SLUG_SOME_UNPROTECTED_PAGE') );
    }else{
      // error message
    }
  }


  // render page here
}
