/**
 * Header
 * Sidebar on desktop
 * SideNav on mobile (+ burger button)
 *
 * @author nico <hello@nusson.ninja>
 */
import { BehaviorSubject }  from 'vendors/rxjs'
import { DOM }              from 'rx-dom'
import { AbstractUI, IUI }  from 'app/helpers/AbstractUI'
import { Device }           from 'app/components/Interface'

import { Logguer }          from "app/helpers/logguer"
const log  = Logguer('header')
require('./styles')


export class Header extends AbstractUI {
  private _shown:boolean
  private _device:Device = 'desktop';

  get device():Device {
    return this._device;
  }
  set device(device:Device) {
    if(device === 'mobile'){
      this.shown  = false
      setTimeout(()=>{
        this.el.classList.add('-sidenav')
      }, 500)
    }else{
      this.shown  = true
      setTimeout(()=>{
        this.el.classList.remove('-sidenav')
      }, 0)
    }
    this._device  = device;
  }

  get shown():boolean {
    return this._shown;
  }
  set shown(shown:boolean) {
    if(shown){
      this.dom.panel.removeAttribute('aria-hidden')
    }else{
      this.dom.panel.setAttribute('aria-hidden', 'true')
    }
    this._shown  = shown;
  }

  constructor(elementSelector = '[data-cpt="Header"]'){
    super(elementSelector, false)

    this.dom.menuButton = this.el.querySelector('.menu-button')
    this.dom.panel      = this.el.querySelector('.pannel')
    this.init();
  }

  init(){
    DOM.click(this.dom.menuButton)
    .subscribe(this.toggle.bind(this))
  }

  toggle(){
    this.shown = !this.shown
  }
}
