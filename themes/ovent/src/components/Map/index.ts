/**
 * Google Map
 * @author nico <hello@nusson.ninja>
 */
import { IUI, AbstractUI }      from 'app/helpers/AbstractUI'
import { Logguer }              from "app/helpers/logguer"

import * as GoogleMapsLoader    from "google-maps"


const log  = Logguer('map')
interface IMapComponent extends IUI{
}

interface Options{

}

export class Map extends AbstractUI implements IMapComponent{
  geocoder:any

  constructor(options:Options, elementSelector = '[data-cpt="Map"]'){
    super(elementSelector)

    GoogleMapsLoader.load((google)=>{
      new google.maps.Map(this.el, options);
    });

  }
}

