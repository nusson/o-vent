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
      this.hide()
      setTimeout(()=>{
        this.el.classList.add('-sidenav')
      }, 0)
    }else{
      this.show()
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
      this.dom.menuButton.classList.add('is-active')
    }else{
      this.dom.panel.setAttribute('aria-hidden', 'true')
      this.dom.menuButton.classList.remove('is-active')
    }
    this._shown  = shown;
  }

  constructor(elementSelector = '[data-cpt="Header"]'){
    super(elementSelector, false)

    this.dom.menuButton = this.el.querySelector('.menu-button')
    this.dom.panel      = this.el.querySelector('.pannel')
    this.dom.overlay    = this.el.querySelector('.overlay')
    this.init();
  }

  init(){
    DOM.click(this.dom.menuButton)
    .subscribe(this.toggle.bind(this))

    DOM.click(this.dom.overlay)
    .subscribe(this.hide.bind(this))
  }

  toggle(){
    this.shown = !this.shown
  }

  show(){
    this.shown = true
  }

  hide(){
    this.shown = false
  }
}
