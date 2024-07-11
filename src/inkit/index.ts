
export class Inkit {
  mutationObserver: MutationObserver
  listeners: Map<string, InkitListener[]> = new Map()
  knownIds: Map<string, boolean> = new Map() // maps whether an id exists or not

  constructor() {
    this.mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        this.processRecord(record)
      }
    })
  }

  private processRecord(record: MutationRecord) {
    const target = record.target as HTMLElement

    if (!(target instanceof HTMLElement)) {
      return
    }


    switch (record.type) {
      case "attributes":
        const listeners = this.listeners.get(target.id)
        if (!listeners) {
          return
        }
        const newValue = target.getAttribute(record.attributeName!)
        const oldVlaue = record.oldValue

        for (const listener of listeners) {
          if (!listener.attributesModified) {
            continue
          }

          listener.attributesModified(target, {
            name: record.attributeName!,
            value: newValue!,
            oldValue: oldVlaue!,
          })
        }

        break
      case "childList":
        // iterate through list of existingIds.
        for (const id of this.knownIds.keys()) {
          const element = document.getElementById(id)
          console.log(element)
          const exists = element !== null
          const previousExists = this.knownIds.get(id)!

          if (exists === previousExists) {
            continue
          }

          this.knownIds.set(id, exists)

          const listeners = this.listeners.get(id)!
          if (!listeners) {
            continue
          }

          for (const listener of listeners) {
            const func = exists ? listener.added : listener.removed

            if (!func) {
              continue
            }
            func(element!)
          }
        }
        break
    }
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

    const element = document.getElementById(id)

    this.knownIds.set(id, element !== null)
    console.log(this.knownIds)
    if (listener.instantly) {
      listener.instantly(element)
    }
  }

  unsubscribe(id: string, listener: InkitListener) {
    const listeners = this.listeners.get(id)
    if (!listeners) {
      return
    }
    
    const index = listeners.indexOf(listener)
    if (index === -1) {
      return
    }

    listeners.splice(index, 1)
    this.listeners.set(id, listeners)
  }

  // this element should have no children when you first start it
  start(element: HTMLElement) {
    this.mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
}

export type InkitListener = {
  instantly?: (element: HTMLElement | null, inkit: Inkit) => InkitListenerRespone  // called instantly when the listener is added
  added?: (element: HTMLElement, inkit: Inkit) => InkitListenerRespone  // called whenever the element is added or re-added
  removed?: (inkit: Inkit) => InkitListenerRespone // called whenever the element is removed
  attributesModified?: (element: HTMLElement, event: AttributeEvent, inkit: Inkit) => InkitListenerRespone // called whenever the attributes of the element are modified
}

type InkitListenerRespone = void | Promise<void>

type AttributeEvent = {
  value: string
  oldValue: string
  name: string
}


// this is a singleton that's used throughout your entire app. You could create more than one of these if you know what you're doing
export const inkit = new Inkit()
