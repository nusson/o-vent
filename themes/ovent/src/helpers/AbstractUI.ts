/**
 * AbstractUI
 * Link this class to a dom element
 * (throw an error if not existing el)
 *
 * use it to safely use init() if cpt ok
 * and ou can override some entr points
 * + destoy
 * + handlers
 * + dom
 *
 * @author nico <hello@nusson.ninja>
 */

export interface IUI{
  el:          HTMLElement
  handlers:    {
    ondestroy:  ()=>void
  }
  dom:         any
  init:        ()=>void
  destroy:     ()=>void
}

export class AbstractUI implements IUI{
  el:HTMLElement
  dom:any = {}
  handlers = {
    ondestroy(){
      this.destroy()
    }
  }
  constructor(elementSelector:string, autoInit=true){
    const el:HTMLElement  = document.querySelector(elementSelector) as HTMLElement
    // console.log(el);

    if(el){
      this.el  = el
      // add listener on destroy
      if(autoInit)
        this.init()
    }
    else{
      throw('missing el element '+elementSelector)
    }
  }
  /**
   * init our class
   * only if el found on dom
   */
  init(){

  }
  /**
   * clean destro of our class
   * needs to be overrided to clean custom events etc
   */
  destroy(){
    this.el         = null;
    this.dom        = null;
    this.handlers   = null;
    // remove listener on destroy
  }
}

// export const AbstractUI = Abstract
