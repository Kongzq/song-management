



window.eventHub = {
  events: {
 
  }, 
  emit(eventName, data){ //触发订阅的事件
    for(let key in this.events){
      if(key === eventName){
        let fnList = this.events[key]
        fnList.map((fn)=>{
          fn.call(undefined, data)
        })
      }
    }
  },
  on(eventName, fn){ //订阅事件
    if(this.events[eventName] === undefined){
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  },
}
