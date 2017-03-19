/**
 * Header
 * Sidebar on desktop
 * SideNav on mobile (+ burger button)
 *
 * @author nico <hello@nusson.ninja>
 */
import { BehaviorSubject }  from 'vendors/rxjs'
import { AbstractUI, IUI }  from 'app/helpers/AbstractUI'
import { Logguer }          from "app/helpers/logguer"
const log  = Logguer('header')
require('./styles')

export class Header extends AbstractUI {
  state:  State
  constructor(elementSelector = '[data-cpt="Header"]'){
    super(elementSelector, false)
    this.state = new State({
      shown: true
    })

    this.init();
  }

  init(){
    this.state.subject.subscribe(this.onStateUpdate.bind(this))
  }

  onStateUpdate(state:IState){
    log('onStateUpdate', state)
  }
}

export interface IState {
  shown:  boolean
}
export class State {
  subject: BehaviorSubject<IState>
  constructor(props:IState){

    this.subject  = new BehaviorSubject(
      Object.assign({
        shown:  true
      }, props) as IState
    )
    return this;
  }

  get(key:'shown'){
    if(key){
      return this.subject.getValue()[key]
    }
    return this.subject.getValue();
  }

  set(data:IState, merge:boolean=false){
    let next:IState = Object.assign({}, ...[
      merge ? this.subject.getValue() : null,
      data
    ])
    return this.subject.next(next)
  }
}
