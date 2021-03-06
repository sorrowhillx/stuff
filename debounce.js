function debounce(fn, wait, immediate) {  
  let timeout
  return (...args) => {
    if (immediate && !timeout) {
      fn.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) {
        fn.apply(this, args)
      }
    }, wait)
  }
}

// usage
let checkPositionFromBottom = debounce(() => {  
  // do your thing!
}, 250)

window.addEventListener('scroll', checkPositionFromBottom)  
