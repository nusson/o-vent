/**
 * Homepage
 *
 * @author nico <hello@nusson.ninja>
 */
import { IUI, AbstractUI }      from 'app/helpers/AbstractUI'
import { Shops }                from 'app/components/Shops'
import { Logguer }              from "app/helpers/logguer"
const log  = Logguer('page')
require('./styles')

interface IHome extends IUI{
}

export class Homepage extends AbstractUI implements IHome{
  constructor(elementSelector = '[data-cpt="Home"]'){
    super(elementSelector)
    log('home construct', this)

    Object.assign(this.dom, {
      slideshows: this.el.querySelectorAll('[data-cpt="Slideshow"]'),
      actions: this.el.querySelectorAll('[data-cpt="Slideshow"]')
    })
  }
}
