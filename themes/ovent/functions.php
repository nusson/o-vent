<?php
/**
 *  Theme functions
 *  mainly require some files from /admin dir
 *
 *  @author: nico <hello@nusson.ninja>

 *
 *  Summary
 *  ---------------------
 *  [_VEN_]  Vendors
 *  [_SCR_]  Scripts
 *  [_AJA_]  Ajax Functions
 *  [_ROU_]  Routes
 *  [_i18_]  i18n
 *  [_MEN_]  Menus
 *  [_SHO_]  ShortCode Functions
 *  [_CHE_]  Check (plugins etc)
 *  [_TIM_]  Timber
 *  [_CPT_]  Custom Post Types
 *  [_CTA_]  Custom Taxonomies
 *  [_CTX_]  Timber context
 *  [_EXT_]  Timber extras
 */
/*------------------------------------*\
  [_VEN_]  Vendors
\*------------------------------------*/
// require 'vendor/autoload.php';
// require 'admin/config.php';
if(session_id() == '')
   session_start();

// setlocale(LC_ALL, 'fr_FR');

/*------------------------------------*\
  [_AJA_] Ajax Functions
\*------------------------------------*/
// @include 'admin/ajax.php';

/*------------------------------------*\
  [_SCR_]  Scripts
\*------------------------------------*/
@include 'admin/scripts.php';

/*------------------------------------*\
  [_ROU_]  Routes
\*------------------------------------*/
@include 'admin/routes.php';

/*------------------------------------*\
  [_i18_]  i18n
\*------------------------------------*/
@include 'admin/i18n.php';

/*------------------------------------*\
  [_MEN_]  Menus
\*------------------------------------*/
@include 'admin/menus.php';

/*------------------------------------*\
  [_SHO_] ShortCode Functions
\*------------------------------------*/
// @include 'admin/shortcodes.php';

/*------------------------------------*\
  [_IMG_]  Image sizes
\*------------------------------------*/
add_action( 'after_setup_theme', 'bayam_images_sizes' );
function bayam_images_sizes() {
  add_image_size( 'mobile', 640 );
  add_image_size( 'tablet', 1440 );
  add_image_size( 'desktop', 1920 );
}

/*------------------------------------*\
  [_CHE_]  Check (plugins etc)
\*------------------------------------*/
if ( ! class_exists( 'Timber' ) ) {
  add_action( 'admin_notices', function() {
      echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
    } );
  return;
}


/*------------------------------------*\
  [_DEA_] Extend deal taxonomy term datas
  + on save
  + get pim datas
  + save them in "extra" field
\*------------------------------------*/

function safe_ponctuation($str){
  $str = str_replace(' ?', '&nbsp;?', $str);
  $str = str_replace(' !', '&nbsp;!', $str);
  $str = str_replace('« ', '«&nbsp;', $str);
  $str = str_replace(' »', '&nbsp;»', $str);
  return $str;
}

function where($list, $props){
  $result = array_filter(
    $list,
    function ($e) use ($props){
      $count = 0;
      foreach ($props as $key => $value){
        if ($value == $e[$key]){
          $count += 1;
        }
        return $count == count($props);
      }
    }
  );
  return $result;
}

function findWhere($list, $props){
  $result = $this->where($list, $props);
  return array_values($result)[0];
}

/*------------------------------------*\
  [_TIM_]  Timber
\*------------------------------------*/
Timber::$dirname = array('src');

class StarterSite extends TimberSite {

  function __construct() {
    add_theme_support( 'post-formats' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'menus' );
    add_theme_support( 'custom-logo' );
    add_filter( 'timber_context', array( $this, 'add_to_context' ) );
    add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
    add_action( 'init', array( $this, 'register_post_types' ) );
    add_action( 'init', array( $this, 'register_taxonomies' ) );
    parent::__construct();
  }

  /*------------------------------------*\
    [_CPT_]  Custom Post Types
  \*------------------------------------*/
  function register_post_types() {
    //this is where you can register custom post types
    //@include 'admin/register_post_types.php';
  }

  /*------------------------------------*\
    [_CTA_] Custom Taxonomies
  \*------------------------------------*/
  function register_taxonomies() {
    //this is where you can register custom taxonomies
    //@include 'admin/register_taxonomies';
  }

  /*------------------------------------*\
    [_CTA_] Custom Icons
  \*------------------------------------*/
  function register_icons() {
    //this is where you can register icons
    //@include 'admin/register_taxonomies';
    $path = get_template_directory_uri();
    $path .= (WP_ENV === 'development')? '/assets' : '/public';
    $path .= '/images/icons/';

    return array(
      'placeholder' => $this->getContent($path.'placeholder.svg'),
      'scroll'      => $this->getContent($path.'scroll.svg'),
      'profil'      => $this->getContent($path.'profil.svg'),
      'checkbox'    => $this->getContent($path.'checkbox_checked.svg'),
      'enfants'     => $this->getContent($path.'enfants.svg'),
      'arrow'     => $this->getContent($path.'fleche.svg'),
    );
  }

  /*------------------------------------*\
    [_CTX_]  Timber context
  \*------------------------------------*/
  function add_to_context( $context ) {

    $context['env']   = WP_ENV;
    $context['lang']  = 'fr';

    $context['menu']  = new TimberMenu();
    $context['menus'] = array(
      'primary'        => new TimberMenu('primary'),
    );
    $context['site']          = $this;
    $context['site']->lang    = substr($context['site']->language, 0, 2);

    $context['paths']         = array(
      'theme' => get_stylesheet_directory_uri(),
      'images' => get_stylesheet_directory_uri().'/assets/images/',
    );

    // $context['icons'] = $this->register_icons();
    return $context;
  }


  /*------------------------------------*\
    [_EXT_]  Timber extras
  \*------------------------------------*/

  /**
   * include a file content (usefull to include svg for exemple)
   * @param  {string} $filePath
   * @return {string} file content
   */
  function getContent( $filePath ) {
    $info = pathinfo($filePath);
    switch($info['extension']){
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '<img src="'.$filePath.'"></img>';
      break;
      default:
        return file_get_contents($filePath);
      break;
    }
  }

  /**
   * translate some string
   * @param  {string} $str
   * @return {string} translated
   */
  function trans( $str ) {
    return pll__($str);
  }

  /**
   * extract src="EXTRACT_THIS" form some string
   * @param  {string} $str - our string to parse
   * @return {string} only (1st) src attribute
   */
  function src( $str ) {
    $result = substr($str, strpos($str,'src="')+5);
    $result = substr($result, 0, strpos($result,'"'));
    return $result;
  }

  /**
   * return a boolean string (because php...)
   * @param  {boolean} $test
   * @return {string} true|false
   */
  function boolean( $test ) {
    if($test) return 'true';
    else      return 'false';
  }

  /**
   * sort a collection by item's id
   * @param  [array] $arr
   * @return [array] sorted array
   */
  function orderby( $arr, $field ){
    usort($arr,  function ($a, $b) use ($field) {
      if ($a->{$field} == $b->{$field}) {
        return 0;
      }
      return ($a->{$field} < $b->{$field}) ? -1 : 1;
    });
    return $arr;
  }

  /**
   * get img src depending on a size
   * @param  [object] $image
   * @param  [string] ($size=auto) - if auto, determine within mobiledetect
   * @return [string]
   */
  function getSizedSrc($image, $size="auto"){
    $src  = $image->src;
    if($size === 'auto'){
      if(wpmd_is_phone()){          $size = 'mobile';  }
      elseif(wpmd_is_tablet()){     $size = 'tablet';  }
      else{                         $size = 'desktop'; }
    }
    if(isset($image->sizes[$size])){
      if(isset($image->sizes[$size]['file'])){
        $path = substr($src, 0, (strrpos($src, '/')+1));
        // var_dump($image->sizes[$size]);
        // $file = $image->sizes[$size]['_wp_attached_file'];
        $file = $image->sizes[$size]['file'];
        return $path.$file;
      }else{
        return $image->sizes[$size];
      }
    }
    return $image->src;
  }

  function add_to_twig( $twig ) {
    /* this is where you can add your own fuctions to twig */
    $twig->addExtension( new Twig_Extension_StringLoader() );

    $twig->addFunction(new Twig_SimpleFunction('pll__', function($str) {
       return pll__($str);
    }));

    $twig->addFilter('src',
      new Twig_SimpleFilter('src', array($this, 'src')));

    $twig->addFilter('boolean',
      new Twig_SimpleFilter('boolean', array($this, 'boolean')));

    $twig->addFilter('orderby',
      new Twig_SimpleFilter('orderby', array($this, 'orderby')));

    $twig->addFunction(new Twig_SimpleFunction('getContent', array($this, 'getContent')));
    $twig->addFunction(new Twig_SimpleFunction('getSizedSrc', array($this, 'getSizedSrc')));

    return $twig;
  }
}

new StarterSite();
