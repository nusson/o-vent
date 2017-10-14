/**
 * Homepage
 *
 * @author nico <hello@nusson.ninja>
 */

var ScrollMagic = require('ScrollMagic') //import * as ScrollMagic         from 'ScrollMagic'
require('AnimationPlugin')
const TweenMax:any = require('TweenMax')
const EasePack:any = require('EasePack')
require('ScrollToPlugin')
require('swiper/dist/css/swiper.css')
import * as Swiper       from 'swiper'
import { IUI, AbstractUI }      from 'app/helpers/AbstractUI'
import { Shops }                from 'app/components/Shops'
import { Logguer }              from "app/helpers/logguer"
// import { Slideshow }            from "app/components/UI/Slideshow"
// console.log(Linear);
const log  = Logguer('page')
require('./styles')

interface IHome extends IUI{
}

export class Homepage extends AbstractUI implements IHome{
  constructor(elementSelector = '[data-cpt="Home"]'){
    super(elementSelector)

    this.dom = Object.assign({}, this.dom, {
      slideshows: this.el.querySelectorAll('[data-cpt="Slideshow"]'),
      scrollers: this.el.querySelectorAll('[data-scrollto]'),
    })

    this.initialize()

  }

  initialize(){

    new Swiper ('.swiper-container', {
      loop: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
    })

    this.initScrollMagic()

    this.dom.scrollers.forEach((el:HTMLElement)=>{
      el.addEventListener('click', (event:MouseEvent)=>{
        const target:HTMLElement = this.el.querySelector(el.dataset.scrollto) as HTMLElement
        TweenMax.to(window, 1, {
          scrollTo: {
            y: target.offsetTop
          },
          ease: (EasePack.Power3 as any).easeInOut
        })
      })
    })
  }

  initScrollMagic(){

    var controller = new (ScrollMagic as any).Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "200%"}});

    // build scenes
    new (ScrollMagic as any).Scene({triggerElement: ".section-main"})
      .setTween('.section-main > div', {y: "80%"})
      // .addIndicators()
      .addTo(controller);

    new (ScrollMagic as any).Scene({triggerElement: '.--0'})
      .setTween('.--0 > div', {y: "80%"})
      // .addIndicators()
      .addTo(controller);

    new (ScrollMagic as any).Scene({triggerElement: '.--1'})
      .setTween('.--1 > div', {y: "80%"})
      // .addIndicators()
      .addTo(controller);

      console.log(controller);

  }
}
