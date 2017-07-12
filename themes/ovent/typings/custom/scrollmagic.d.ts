declare module 'scrollmagic' {
  export namespace ScrollMagic {

    export class Controller{
      globalSceneOptions:Object
      constructor(options:any)
    }

    export class Scene{
      triggerElement:any
      constructor(options:any)
      setPin(pin:any):Scene
      addIndicators():Scene
      addTo(controller:Controller):Scene
    }
}
}
