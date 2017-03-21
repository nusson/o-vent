/**
 * Interface
 * manage interface (scroll, header, footer ...)
 *
 * @author nico <hello@nusson.ninja>
 */

// import 'babel-polyfill';
// import objectFitImages from 'object-fit-images';
import {  IUI, AbstractUI }     from 'app/helpers/AbstractUI'
import { Header }               from 'app/components/Header'
import { Page }                 from 'app/components/Page'
import { Homepage }             from 'app/components/pages/Home'
import debounce                 from 'app/helpers/debounce'
import { Logguer }              from "app/helpers/logguer"
const log  = Logguer('interface')
require('./styles')
require('app/components/Page/styles')
require('app/components/Footer/styles')

const WIDTH_DESKTOP   = 1024
const WIDTH_MOBILE    = 600
export type Device           = 'desktop'|'tablet'|'mobile'

export class Interface extends AbstractUI{
  header:   Header
  page:     Page
  device:   Device
  // el
  constructor(elementSelector = '[data-cpt="Interface"]'){
    super(elementSelector)
  }
  init(){
    this.header = new Header();

    const homeSelector  = '[data-cpt="Home"]';
    if(this.el.querySelector(homeSelector)){
      this.page = new Homepage();
    }else{
      this.page   = new Page();
    }

    // watch resize
    const onresizehandler = debounce(this.setDeviceFromViewport.bind(this), 250)
    window.addEventListener('resize', onresizehandler)
    this.setDeviceFromViewport(null);
  }

  setDeviceFromViewport(event:Event){
    const bodyWidth = document.body.offsetWidth;

    let device:Device = 'desktop';
    if(bodyWidth < WIDTH_MOBILE){
      device = 'mobile'
    }else if(bodyWidth < WIDTH_DESKTOP){
      device = 'tablet'
    }
    if(device !== this.device){
      this.el.classList.remove('-device-'+this.device)
      this.el.classList.add('-device-'+device)
      this.device = device
      this.header.device  = this.device
    }
  }
}
