type Listener<T> = (data: T) => void

export class Signal<T> {
  private listeners: Listener<T>[] = []

  subscribe(listener: Listener<T>) {
    this.listeners.push(listener)
  }

  unsubscribe(listener: Listener<T>) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  // listens once and then removes itself
  trigger(listener: Listener<T>) {
    const onceListener = (data: T) => {
      listener(data)
      this.unsubscribe(onceListener)
    }
    this.subscribe(onceListener)
  }

  publish(data: T) {
    this.listeners.forEach(listener => listener(data))
  }
}

export class Store<T> {
  private signal = new Signal<T>()
  private state: T

  constructor(initialState: T) {
    this.state = initialState
  }
  
  // subscribes to and immediately triggers the listener with the current state
  subscribe(listener: Listener<T>) {
    this.signal.subscribe(listener)
    listener(this.state)
  }

  unsubscribe(listener: Listener<T>) {
    this.signal.unsubscribe(listener)
  }

  set(newState: T) {
    this.state = newState
    this.signal.publish(newState)
  }

  snapshot(): T {
    return this.state
  }
}


// TODO: immer inspired PubsubMutator
