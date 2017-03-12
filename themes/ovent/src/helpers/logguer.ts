/**
 *  curried console to improve logs messages
 *  @todo test and doc
 *
 *  @author: nico <hello@nusson.ninja>


 */

const METHODS = ['assert','clear','count','debug','dir','dirxml','group','groupCollapsed',
'groupEnd','info','log','markTimeline','profile','profileEnd','table','time','timeEnd','timeStamp','timeline','timelineEnd','trace','error','warn']

declare var window: any;

export const Logguer = (name:string)=>{
  return function(logMethod:any, ...args:any[]) {
    let method = 'log';
    if(METHODS.indexOf(logMethod)>=0){
      method = logMethod;
    }else{
      args.unshift(logMethod)
    }

    if(typeof(window.console[method]) === 'undefined'){
      return function(){}
    }
    return window.console[method]('['+name+']', ...args);
  };
};
