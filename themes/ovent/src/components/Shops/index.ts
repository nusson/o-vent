/**
 * Shops
 * @author nico <hello@nusson.ninja>
 */
import { IUI, AbstractUI }     from 'app/helpers/AbstractUI'
import { Map }                from 'app/components/Map'
import { Logguer }             from "app/helpers/logguer"
const log  = Logguer('shops')
require('./styles')

interface IShopComponent extends IUI{
}

interface Shop{
  title:          String,
  address?:       String,
  address_bis?:   String,
  email?:         String,
  web?:           String,
  map: {
    lat:Number,
    lng:Number
  }
}

export class Shops extends AbstractUI implements IShopComponent{
  constructor(shops:Shop[], elementSelector = '[data-cpt="Shops"]'){
    super(elementSelector)

    if(shops.length){
      new Map({})
    }
  }
}

