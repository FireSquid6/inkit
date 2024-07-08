import { Pubsub } from "./pubsub"

export class Inkit {
  render = new Pubsub<number>()
  mutationObserver: MutationObserver 
  listeners: Map<string, InkitListener[]> = new Map()

  constructor() {
    this.mutationObserver = new MutationObserver((records) => {
      // clean up this mess
      for (const record of records) {
        // see mdn docs on MutationRecords for more info
        // TODO: add ability to listen for mutations on specific elements
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) {
            continue
          }

          const listeners = this.listeners.get(node.id)
          if (!listeners) {
            continue
          }
          for (const listener of listeners) {
            if (listener.added) {
              listener.added(node)
            }
          }

        }

        // TODO: do the same thing as above but for removed nodes
        const target = record.target as HTMLElement

        // TODO: do stuff on the target
        // TODO: will this dupliacte events? Maybe we should only iterate through the first record
        // or just do some tests to see how this even works
        if (target instanceof HTMLElement) {
          const listeners = this.listeners.get(target.id)
          if (listeners) {
            for (const listener of listeners) {
              if (listener.added) {
                listener.added(target)
              }
            }
          }
        }
      }
    })

  }

  private uuid = 0
  getNewUuid(): string {
    this.uuid += 1
    return `inkit-${this.uuid}`
  }
  
  subscribe(id: string, listener: InkitListener) {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, [])
    }

    const listeners = this.listeners.get(id)!
    listeners.push(listener)
    this.listeners.set("id", listeners)

  }

  unsubscribe(id: string, listener: InkitListener) {
    const listeners = this.listeners.get(id)
    if (!listeners) {
      return
    }

    const newListeners = listeners.filter(l => l !== listener)
    this.listeners.set(id, newListeners)
  }

  start(element: HTMLElement) {
    this.mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
}

type InkitListener = {
  added?: (element: HTMLElement) => void
  removed?: (element: HTMLElement) => void
}


// this is a singleton that's used throughout your entire app. You could create more than one of these if you know what you're doing
export const inkit = new Inkit()
