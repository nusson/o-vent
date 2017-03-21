/**
 * Page (abstract)
 *
 * @author nico <hello@nusson.ninja>
 */
import { IUI, AbstractUI }      from 'app/helpers/AbstractUI'
import { Shops }                from 'app/components/Shops'
import { Logguer }              from "app/helpers/logguer"
const log  = Logguer('page')
require('./styles')

interface IPage extends IUI{
}

export class Page extends AbstractUI implements IPage{
  constructor(elementSelector = '[data-cpt="Page"]'){
    super(elementSelector)

    const shops = (window as any).shops;
    if(shops){
      new Shops(shops)
    }
    log('page construct', this)
  }
}
