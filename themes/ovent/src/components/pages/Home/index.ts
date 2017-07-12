/**
 * Homepage
 *
 * @author nico <hello@nusson.ninja>
 */

var ScrollMagic = require('ScrollMagic') //import * as ScrollMagic         from 'ScrollMagic'
require('AnimationPlugin')
require('swiper/dist/css/swiper.css')
import {TweenMax}       from 'gsap'
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
      actions: this.el.querySelectorAll('[data-cpt="Slideshow"]')
    })

    this.initialize()

		// var controller = new (ScrollMagic as any).Controller({
		// 	globalSceneOptions: {
		// 		triggerHook: 'onLeave'
		// 	}
		// });

		// // get all slides
		// var slides = document.querySelectorAll(".section-second");

		// // create scene for every slide
		// for (var i=0; i<slides.length; i++) {
		// 	new (ScrollMagic as any).Scene({
		// 			triggerElement: slides[i]
		// 		})
		// 		.setPin(slides[i])
		// 		// .addIndicators() // add indicators (requires plugin)
		// 		.addTo(controller);
		// }
  }

  initialize(){

    new Swiper ('.swiper-container', {
      loop: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
    })
    // this.dom.slideshows.forEach((el:Element)=>{
    //   // new Slideshow(el)
    //   new (Swiper as any)(el as any)
    // });



    this.initScrollMagic()
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
