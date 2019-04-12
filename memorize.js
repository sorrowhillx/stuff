const memoize = (callback) => {
  let memo = {}
  return (...args) => {
    if memo[args] { return memo[args] }
    else { 
      memo[args] = callback(args) 
      return memo[args] 
    } 
  }
}
