
// pubsub is the recommended way to contain state in inkchat
type PubsubListener<T> = (data: T) => void
export class Pubsub<T> {
  private listeners: PubsubListener<T>[] = []

  subscribe(listener: PubsubListener<T>) {
    this.listeners.push(listener)
  }

  unsubscribe(listener: PubsubListener<T>) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  // listens once and then removes itself
  trigger(listener: PubsubListener<T>) {
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

export class PubsubStore<T> {
  private pubsub = new Pubsub<T>()
  private state: T

  constructor(initialState: T) {
    this.state = initialState
  }

  subscribe(listener: PubsubListener<T>) {
    this.pubsub.subscribe(listener)
    listener(this.state)
  }

  unsubscribe(listener: PubsubListener<T>) {
    this.pubsub.unsubscribe(listener)
  }

  set(newState: T) {
    this.state = newState
    this.pubsub.publish(newState)
  }

  snapshot(): T {
    return this.state
  }
}


// TODO: immer inspired PubsubMutator
