<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */
$context  = Timber::get_context();
$post     = Timber::get_post();
$context['post'] = $post;


Timber::render( array( 'components/pages/Home/template.twig' ), $context );
