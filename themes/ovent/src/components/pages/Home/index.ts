/**
 * Homepage
 *
 * @author nico <hello@nusson.ninja>
 */
import { IUI, AbstractUI }      from 'app/helpers/AbstractUI'
import { Shops }                from 'app/components/Shops'
import { Logguer }              from "app/helpers/logguer"
import { Slideshow }            from "app/components/UI/Slideshow"
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
  }

  initialize(){

    this.dom.slideshows.forEach((el:HTMLElement)=>{
      new Slideshow(el)
    });
  }
}
