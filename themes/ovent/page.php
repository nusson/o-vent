<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /mytheme/views/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /mytheme/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$post               = new TimberPost();
$context            = Timber::get_context();
$context['posts']   = Timber::get_posts();
$context['post']    = $post;
$context['env']     = WP_ENV;

$templates = array(
  'components/pages/'.ucfirst($post->post_name).'/template.twig',
  'components/Page/template.twig'
);

// if($post->post_name === 'points-de-vente'){
//   array_unshift($templates, 'components/Page/template.twig');
//   // array_unshift($templates, 'components/pages/Shops/template.twig');
// }

Timber::render($templates, $context);
