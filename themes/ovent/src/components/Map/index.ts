/**
 * Google Map
 * @author nico <hello@nusson.ninja>
 */
import { IUI, AbstractUI }      from 'app/helpers/AbstractUI'
import { Logguer }              from "app/helpers/logguer"

import * as GoogleMapsLoader    from "google-maps"

require('./styles')


const log  = Logguer('map')
let google:GoogleMapsLoader.google = null;


interface IMapComponent extends IUI{
}

interface Options{

}
interface Marker{

}

export class Map extends AbstractUI implements IMapComponent{
  geocoder: google.maps.Geocoder
  infowindow: any
  map:        google.maps.Map
  coords:{
    lat:  number,
    lng:  number
  }
  markers:    Marker[]
  options:    Options

  constructor(options:Options, elementSelector = '[data-cpt="Map"]'){
    super(elementSelector)

    this.coords = {
      lat:  45.5005036,
      lng:  -73.5993084
    }

    let GoogleMapsLoaderConfig = GoogleMapsLoader as any
    GoogleMapsLoaderConfig.KEY = 'AIzaSyDrs2N3oSmTP5aLAl827de_Inv8ZpMx-bU';

    GoogleMapsLoader.load((googleReference)=>{
      google  = googleReference
      this.markers  = []
      this.geocoder = new google.maps.Geocoder()
      this.options  = Object.assign({
        mapTypeId:          google.maps.MapTypeId.ROADMAP,
        scrollwheel:        false,
        disableDefaultUI:   false,
        zoom:               8,
        center:             this.coords,
        resize:             false
      }, options)

      this.create()
      this.setAutoGeolocation()
    });
  }

  create(){
    this.map = new google.maps.Map(this.el, this.options)
    google.maps.event.addListenerOnce(this.map, 'idle', this._onready.bind(this))
  }

  setAutoGeolocation(){
    if((window as any).jsvars
      && (window as any).jsvars.geoloc
      && (window as any).jsvars.geoloc.latitude){
      this.coords = {
        lat:  (window as any).jsvars.geoloc.latitude,
        lng:  (window as any).jsvars.geoloc.longitude
      }
      this.map.setCenter(this.coords)
    }else if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (datas)=>{
          this.coords = {
            lat:  datas.coords.latitude,
            lng:  datas.coords.longitude
          }
          this.map.setCenter(this.coords)
        },
        (error)=>{
          log('google', google)
          const ClientLocation:any	= (google as any).loader.ClientLocation
          if(ClientLocation){
            this.coords = {
              lat:  ClientLocation.latitude,
              lng:  ClientLocation.longitude
            }
            this.map.setCenter(this.coords)
          }
        }
      )
    }
  }

  addMarker(lat:number, lng:number, options={}){
    if(! this.map || isNaN(lat) || isNaN(lng)){
      return
    }

    const latLng      = new google.maps.LatLng(lat, lng)
    let markerOptions = Object.assign({
      map:      this.map,
      position: latLng
    }, options)
    const marker = new google.maps.Marker(markerOptions)

    return marker;
  }

  _onready(){
    this.map.setCenter(this.coords)
    // show us and 1st pin
    let bounds = new google.maps.LatLngBounds()
    bounds.extend(new google.maps.LatLng(this.coords.lat, this.coords.lng))

    const shops:any[] = (window as any).shops
    shops.forEach((shop)=>{
      const marker = this.addMarker(shop.map.lat, shop.map.lng, {
        title: shop.title
      });

      bounds.extend(marker.getPosition())

      marker.addListener('click', this._onMarkerClick.bind(this, marker, shop))
      this.markers.push(marker)
    })
    this.map.fitBounds(bounds)
  }

  _onMarkerClick(marker:any, shop:any, event:any){
    // @todo find marker / shop from event

    if(this.infowindow){
      this.infowindow.close()
    }
    this.infowindow = new google.maps.InfoWindow({
      content: this.getShopInfoHTML(shop)
    });
    this.infowindow.open(this.map, marker)
  }

  /**
   * return HTML content of a shop card
   * (infowindow when click marker)
   *
   * @param data - shop data
   */
  getShopInfoHTML(data:any){
    log('getShopInfoHTML', data)
    let links = ''
    if(data.phone){
      links += `<p class="item -phone">
          <i class="fa fa-phone"></i>
          <span class="text">${data.phone}</span>
        </p>`
    }
    if(data.web){
      links += `<a class="item -web link"
          target="_blank"
          href="${data.web}">
          <i class="fa fa-link"></i>
          <span class="text">${data.web}</span>
        </a>`;
    }
    links += `<a class="item -direction link"
        target="_blank"
        href="https://www.google.com/maps/dir/Current+Location/${data.map.lat},${data.map.lng}">
        <i class="fa fa-location-arrow"></i>
        <span class="tesxt">Directions</span>
      </a>`;

    return `
      <article class="infowindow">
        <header class="header">
          ${data.post_title}
        </header>
        <div class="content">
          <p class="item -address">
            ${data.address}
            <br>${data.address_bis}
          </p>
        </div>
        <footer class="footer">
          ${links}
        </footer>
      </article>
    `
  }
}

