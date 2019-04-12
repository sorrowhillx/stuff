console.clear();

/*************************
 *        Observer       *
 *************************/
 
class Observer {
  constructor(handlers) {
    this.handlers = handlers; // next, error and complete logic
    this.isUnsubscribed = false;
  }
  
  next(value) {
    if (this.handlers.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }
  
  error(error) {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        this.handlers.error(error);
      }
        
      this.unsubscribe();
    }
  }
  
  complete() {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }
        
      this.unsubscribe();
    }
  }
  
  unsubscribe() {
    this.isUnsubscribed = true;
    
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

/*************************
 *       Observable      *
 *************************/

class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  
  subscribe(obs) {
    const observer = new Observer(obs);
    
    observer._unsubscribe = this._subscribe(observer);
    
    return ({
      unsubscribe() {
        observer.unsubscribe();
      }
    });
  }
}

/*************************
 *       fromArray       *
 *************************/

Observable.from = (values) => {
  return new Observable((observer) => {
    values.forEach((value) => observer.next(value));
    
    observer.complete();
      
    return () => {
      console.log('Observable.from: unsubscribed');
    };
  });
}


/*************************
 *        interval       *
 *************************/

Observable.interval = (interval) => {
  return new Observable((observer) => {
    let i = 0;
    const id = setInterval(() => {
      observer.next(i++);
    }, interval);
  
    return () => {
      clearInterval(id);
      console.log('Observable.interval: unsubscribbed');
    };
  });
}

/*************************
 *       fromEvent       *
 *************************/

Observable.fromEvent = (element, eventName) => {
  return new Observable((observer) => {
    const eventHandler = (event) => observer.next(event);
    
    element.addEventListener(eventName, eventHandler, false);
    
    return () => {
      element.removeEventListener(eventName, eventHandler, false);
      console.log('Observable.fromEvent: unsubscribbed');
    };
  });
};

/*************************
 *          map          *
 *************************/

Observable.prototype.map = function (transformation) {
  const stream = this;
  
  return new Observable((observer) => {
    const subscription = stream.subscribe({
      next: (value) => observer.next(transformation(value)),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
    
    return subscription.unsubscribe;
  });
};

/*************************
 *        Examples       *
 *************************/

// ---------------------
// Numbers from array
// ---------------------
const numbers$ = Observable.from([0, 1, 2, 3, 4]);
const numbersSubscription = numbers$.subscribe({
  next(value) { console.log(value); },
  error(err) { console.error(err); },
  complete() { console.info('done'); }
});

setTimeout(numbersSubscription.unsubscribe, 500);

// ---------------------
// Intervals
// ---------------------
const interval$ = Observable.interval(100);
const intervalSubscription = interval$.subscribe({
  next(value) { console.log(value); },
  error(err) { console.error(err); },
  complete() { console.info('done'); }
});

setTimeout(intervalSubscription.unsubscribe, 1000);

// ---------------------
// Click events
// ---------------------
const button = document.querySelector('button');
const clicks$ = Observable.fromEvent(button, 'click');
const clicksSubscription = clicks$.subscribe({
  next(value) { console.log('clicked'); },
  error(err) { console.error(err); },
  complete() { console.info('done'); }
});

setTimeout(clicksSubscription.unsubscribe, 1500);

// ---------------------
// Map
// ---------------------
const mappedInterval$ = Observable
  .interval(100)
  .map((value) => 2 * value);

const mappedIntervalSubscription = interval$
  .subscribe({
    next(value) { console.log(value); },
    error(err) { console.error(err); },
    complete() { console.info('done'); }
  });

setTimeout(mappedIntervalSubscription.unsubscribe, 1500);
