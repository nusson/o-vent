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
require('./index.styl')

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
      console.log('state', state)
      this.state = state
    })

    this.subject.debounce(this.state.autoDelay)
    .flatMap(this.doNext.bind(this))
    .subscribe()
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
    .flatMap(this.go.bind(this))
  }
  doPrevious(){
    return this.$getIndex()
    .map(x=>{
      return x-1
    })
    .flatMap(this.$loop.bind(this))
    .flatMap(this.go.bind(this))
  }
  go(index:number){
    return this.$getDirection(index)
    .map((direction:'left'|'right')=>{
      return {
        index: index,
        direction: direction
      }
    })
    .doOnNext(this.updateSubject.bind(this))
  }
}


export class Slideshow extends AbstractUI {
  controler:SlideshowController
  $subscribscrions: [Rx.IDisposable]
  constructor(el:HTMLElement){
    super(el, false)

    this.dom = Object.assign({}, this.dom, {
      slides: this.el.querySelectorAll('.slide'),
      nav: this.el.querySelectorAll('.nav'),
      nextBtn: this.el.querySelector('.next'),
      prevBtn: this.el.querySelector('.previous'),
      bullets: this.el.querySelector('.bullets'),
      bulletsBtns: this.el.querySelectorAll('.bullet'),
    })

    this.controler  = new SlideshowController({
      length:this.dom.slides.length
    })

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
    this.$subscribscrions = [
      this.controler.subject.subscribe(this.update.bind(this)),
      this.$observeNext(),
      this.$observePrevious(),
      this.$observeBullets()
    ]

    this.el.classList.remove('-loading');
  }

  update(state:State){
    console.log('xxx update', state)
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
    .doOnNext( (x)=>{
      console.log('xxx', x)
    })
    .map( event=> event.currentTarget )
    .map( el=> 0 )
    .subscribe(x=>{
      this.controler.go(x)
      .subscribe()
    })
  }
}
