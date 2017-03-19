/**
 * Shops
 * @author nico <hello@nusson.ninja>
 */
import { IUI, AbstractUI }     from 'app/helpers/AbstractUI'
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

export class Shops extends AbstractUI{
  constructor(shops:Shop[], elementSelector = '[data-cpt="Shops"]'){
    super(elementSelector)

    if(shops.length){

    }
  }
}
