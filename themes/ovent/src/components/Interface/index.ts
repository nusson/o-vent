/**
 * Interface
 * manage interface (scroll, header, footer ...)
 *
 * @author nico <hello@nusson.ninja>
 */

// import 'babel-polyfill';
// import objectFitImages from 'object-fit-images';
import {  IUI, AbstractUI }     from 'app/helpers/AbstractUI'
import { Header }               from 'app/components/Header/index'
import { Logguer }              from "app/helpers/logguer"
const log  = Logguer('interface')
require('./styles')

// alert('fff')

interface IInterface extends IUI{
}

export class Interface extends AbstractUI implements IInterface{
  // el
  constructor(elementSelector = '[data-cpt="Interface"]'){
    super(elementSelector)
  }
  init(){
    new Header();
  }
}