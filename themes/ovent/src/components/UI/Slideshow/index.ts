/**
 * Header
 * Sidebar on desktop
 * SideNav on mobile (+ burger button)
 *
 * @author nico <hello@nusson.ninja>
 */
import { BehaviorSubject }  from 'vendors/rxjs'
import { DOM }              from 'rx-dom'
import * as gsap            from 'gsap'
import { AbstractUI, IUI }  from 'app/helpers/AbstractUI'
import { Device }           from 'app/components/Interface'

import { Logguer }          from "app/helpers/logguer"
const log  = Logguer('header')
require('./index.styl')

const SLIDESHOW_SPEED = .9
const Z_INDEX_TOP           = '105'
const Z_INDEX_BOTTOM        = '50'
const Z_INDEX_OTHERS        = '1'
const DELAY_TICK            = 17

let zIndex = 1

interface State{
  index?:     number,
  direction?: 'left'|'right',
  length?:    number,
  autoDelay?: number
}

class SlideshowController{
  subject:Rx.BehaviorSubject<State>
  autoNext:Rx.ReplaySubject<State>
  state:State
  constructor(opts:State){
    this.state = Object.assign({
      index:      0,
      direction:  null,
      autoDelay:  6000
    }, opts)
    this.subject  = new Rx.BehaviorSubject(this.state);
    this.subject.subscribe(state=>{
      this.state = state
    })

    // this.subject.debounce(this.state.autoDelay)
    // .flatMap(this.doNext.bind(this))
    // .subscribe()
  }
  dispose(){
    this.subject.dispose()
  }
  updateSubject(data:State){
    let state = Object.assign(this.subject.getValue(), data)
    this.subject.onNext(state);
  }
  $getIndex(){
    return Rx.Observable.just(this.subject.getValue())
    .map( (state:State)=>{
      return state.index
    })
  }
  $getDirection(index:number){
    return this.$getIndex()
    .filter(x=>{
      return x < index
    })
    .map(x=>{
      return 'left'
    })
    .defaultIfEmpty('right')
  }
  $loop(index:number){
    return Rx.Observable.just(index)
    .filter(x=>{
      return x >= 0
    })
    .defaultIfEmpty(this.state.length)
    .filter(x=>{
      return this.state.length && x <= this.state.length
    })
    .defaultIfEmpty(0)
  }
  doNext(){
    return this.$getIndex()
    .map(x=>{
      return x+1
    })
    .flatMap(this.$loop.bind(this))
    .map(index=>{
      return {
        index: index,
        direction: 'left'
      }
    })
    .flatMap(this.go.bind(this))
  }
  doPrevious(){
    return this.$getIndex()
    .map(x=>{
      return x-1
    })
    .flatMap(this.$loop.bind(this))
    .map(index=>{
      return {
        index: index,
        direction: 'right'
      }
    })
    .flatMap(this.go.bind(this))
  }
  go(state:State|number){
    let data:State = Object.assign({
      index: typeof(state) === 'number' ? state : 0,
      direction: 'right'
    }, typeof(state) === 'object' ? state : {})

    return Rx.Observable.just(data)
    .doOnNext(this.updateSubject.bind(this))
  }
}


export class Slideshow extends AbstractUI {
  controler:SlideshowController
  $subscribscrions: [Rx.IDisposable]
  current:number
  constructor(el:HTMLElement){
    super(el, false)

    this.dom = Object.assign({}, this.dom, {
      wrapper: this.el.querySelector('.slides'),
      slides: this.el.querySelectorAll('.slide'),
      nav: this.el.querySelectorAll('.nav'),
      nextBtn: this.el.querySelector('.next'),
      prevBtn: this.el.querySelector('.previous'),
      bullets: this.el.querySelector('.bullets'),
      bulletsBtns: this.el.querySelectorAll('.bullet'),
    })

    this.controler  = new SlideshowController({
      length:this.dom.slides.length-1
    })

    this.current = 0;
    this.init();
  }

  destroy(){
    this.$subscribscrions.forEach(sub=>{
      sub.dispose()
    })
    this.$subscribscrions = null

    this.controler.dispose()

    super.destroy()
  }

  init(){

    // let widthWrapper  = (this.dom.slides.length * 105) + '%'
    // let widthSlide    = Math.floor((105 / this.dom.slides.length)) + '%'
    // this.dom.wrapper.style.width = widthWrapper
    // this.dom.slides.forEach( (slide:HTMLElement)=>{
    //   slide.style.width = widthSlide
    // })
    // log('init', width)

    this.$subscribscrions = [
      this.controler.subject.subscribe(this.updateNew.bind(this)),
      this.$observeNext(),
      this.$observePrevious(),
      this.$observeBullets()
    ]

    this.el.classList.remove('-loading');
  }

  update(state:State){
    this.dom.slides.forEach((slide:HTMLElement, index:number)=>{
      if(state.direction === 'left' ){ // || state.index === 0

        if(index === this.current){
          gsap.TweenMax.set(slide, {
            x:      '0%',
            zIndex: Z_INDEX_TOP
          })
          return setTimeout(()=>{
            gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
              x:      '-105%',
              ease:gsap.Power3.easeInOut
            }as any)
          }, .17)
        }

        if(index === state.index){
          gsap.TweenMax.set(slide, {
            x:      '10%',
            zIndex: Z_INDEX_BOTTOM
          })
          return setTimeout(()=>{
            gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
              x:      '0%',
              ease:gsap.Power3.easeInOut
            }as any)
          }, .17)
        }
        return slide.style.zIndex = Z_INDEX_OTHERS
      }else{
        if(index === this.current){
          gsap.TweenMax.set(slide, {
            x:      '0%',
            zIndex: Z_INDEX_TOP
          })
          return setTimeout(()=>{
            gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
              x:      '105%',
              ease:gsap.Power3.easeInOut
            }as any)
          }, .17)
        }
        if(index === state.index){
          gsap.TweenMax.set(slide, {
            x:      '-10%',
            zIndex: Z_INDEX_BOTTOM
          })
          return setTimeout(()=>{
            gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
              x:      '0%',
              ease:gsap.Power3.easeInOut
            }as any)
          }, .17)
        }


        return slide.style.zIndex = Z_INDEX_OTHERS
      }
    })
    this.current = state.index;
  }
  updatetest(state:State){
    this.dom.slides.forEach((slide:HTMLElement, index:number)=>{
      if(state.direction === 'left' ){ // || state.index === 0
        if(index === state.index){
          gsap.TweenMax.set(slide, {
            x:      '10%',
            zIndex: Z_INDEX_BOTTOM
          })
          return setTimeout(()=>{
            gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
              x:      '0%',
              ease:gsap.Power3.easeInOut
            }as any)
          }, .17)
        }
        if(state.index === 0){
          if(index===state.length){
            gsap.TweenMax.set(slide, {
              x:      '0%',
              zIndex: Z_INDEX_TOP
            })
            return setTimeout(()=>{
              gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
                x:      '-105%',
                ease:gsap.Power3.easeInOut
              }as any)
            }, .17)
          }
        }else{
          if(index === state.index - 1){
            gsap.TweenMax.set(slide, {
              x:      '0%',
              zIndex: Z_INDEX_TOP
            })
            return setTimeout(()=>{
              gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
                x:      '-105%',
                ease:gsap.Power3.easeInOut
              }as any)
            }, .17)
          }
        }
        return slide.style.zIndex = Z_INDEX_OTHERS
      }else{
        if(index === state.index){
          gsap.TweenMax.set(slide, {
            x:      '-10%',
            zIndex: Z_INDEX_BOTTOM
          })
          return setTimeout(()=>{
            gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
              x:      '0%',
              ease:gsap.Power3.easeInOut
            }as any)
          }, .17)
        }
        if(state.index === state.length){
          if(index===0){
            gsap.TweenMax.set(slide, {
              x:      '0%',
              zIndex: Z_INDEX_TOP
            })
            return setTimeout(()=>{
              gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
                x:      '105%',
                ease:gsap.Power3.easeInOut
              }as any)
            }, .17)
          }
        }else{
          if(index === state.index + 1){
            gsap.TweenMax.set(slide, {
              x:      '0%',
              zIndex: Z_INDEX_TOP
            })
            return setTimeout(()=>{
              gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
                x:      '105%',
                ease:gsap.Power3.easeInOut
              }as any)
            }, .17)
          }
        }


        return slide.style.zIndex = Z_INDEX_OTHERS
      }
    })
    this.current = state.index;
  }
  updateOld(state:State){
    this.dom.slides.forEach((slide:HTMLElement, index:number)=>{
      if(state.direction === 'left' ){ // || state.index === 0
        if(index === state.index){
          return this.translateFromLeft(slide)
        }
        if(index === state.index - 1){
          return gsap.TweenMax.set(slide, {
            x:      '0%',
            zIndex: Z_INDEX_BOTTOM
          })
        }
        return slide.style.zIndex = Z_INDEX_OTHERS
      }else{
        if(index === state.index){
          return this.translateFromRight(slide)
        }
        if(state.index === state.length){
          if(index === 0){
            return gsap.TweenMax.set(slide, {
              x:      0,
              zIndex: Z_INDEX_BOTTOM
            })
          }
        }else if(index === state.index + 1){
          return gsap.TweenMax.set(slide, {
            x:      0,
            zIndex: Z_INDEX_BOTTOM
          })
        }


        return slide.style.zIndex = Z_INDEX_OTHERS
      }
    })
  }
  updateNew(state:State){
    zIndex ++;
    this.dom.slides.forEach((slide:HTMLElement, index:number)=>{
      if(state.direction === 'left' ){ // || state.index === 0
        if(index === state.index){
          return this.translateFromLeft(slide)
        }
        // return slide.style.zIndex = Z_INDEX_OTHERS
      }else{
        if(index === state.index){
          return this.translateFromRight(slide)
        }
        // if(state.index === state.length){
        //   if(index === 0){
        //     return gsap.TweenMax.set(slide, {
        //       x:      0,
        //       zIndex: Z_INDEX_BOTTOM
        //     })
        //   }
        // }else if(index === state.index + 1){
        //   return gsap.TweenMax.set(slide, {
        //     x:      0,
        //     zIndex: Z_INDEX_BOTTOM
        //   })
        // }


        // return slide.style.zIndex = Z_INDEX_OTHERS
      }
    })
  }

  translateFromLeft(slide:HTMLElement){
    gsap.TweenMax.set(slide, {
      x:'105%',
      zIndex:zIndex+1
    })
    this.translateToCenter(slide)
  }

  translateFromRight(slide:HTMLElement){
    gsap.TweenMax.set(slide, {
      x:'-105%',
      zIndex:zIndex+1
    })
    this.translateToCenter(slide)
  }

  translateToCenter(slide:HTMLElement){
    return gsap.TweenMax.to(slide, SLIDESHOW_SPEED, {
      x:'0%',
      ease:gsap.Power3.easeOut
    }as any)
  }

  $observeNext(){
    return DOM.click(this.dom.nextBtn)
    .subscribe(x=>{
      this.controler.doNext()
      .subscribe()
    })
  }

  $observePrevious(){
    return DOM.click(this.dom.prevBtn)
    .subscribe(x=>{
      this.controler.doPrevious()
      .subscribe()
    })
  }
  $observeBullets(){
    return DOM.click(this.dom.bulletsBtns)
    .map( event=> event.currentTarget )
    .map( el=> 0 )
    .subscribe(x=>{
      this.controler.go(x)
      .subscribe()
    })
  }
}
