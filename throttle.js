function throttle(fn, limit) {  
  let waiting = false
  return (...args) => {
    if (!waiting) {
      fn.apply(this, args)
      waiting = true
      setTimeout(() => {
        waiting = false
      }, limit)
    }
  }
}

// usage
let log = () => console.log('throttled')  
window.addEventListener('keyup', throttle(log, 100)) 
