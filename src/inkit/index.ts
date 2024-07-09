import { Pubsub } from "./pubsub"

export class Inkit {
  render = new Pubsub<number>()
  mutationObserver: MutationObserver
  listeners: Map<string, InkitListener[]> = new Map()

  constructor() {
    this.mutationObserver = new MutationObserver((records) => {
      // clean up this mess
      for (const record of records) {
        this.processRecord(record)

      }
    })
  }

  private processRecord(record: MutationRecord) {
    // see mdn docs on MutationRecords for more info
    this.processAddedNodes(record.addedNodes)
    this.processRemovedNodes(record.removedNodes)

    // TODO: do the same thing as above but for removed nodes
    const target = record.target as HTMLElement

    if (!(target instanceof HTMLElement)) {
      return
    }
    const listeners = this.listeners.get(target.id)
    if (!listeners) {
      return
    }

    switch (record.type) {
      case "attributes":
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
        for (const listener of listeners) {
          if (!listener.childrenModified) {
            continue
          }

          listener.childrenModified(target, {
            added: record.addedNodes,
            removed: record.removedNodes,
          })
        }

        break
    }
  }

  private processAddedNodes(nodes: NodeList) {
    for (const node of nodes) {
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

  }

  private processRemovedNodes(nodes: NodeList) {
    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) {
        continue
      }

      const listeners = this.listeners.get(node.id)
      if (!listeners) {
        continue
      }

      for (const listener of listeners) {
        if (listener.removed) {
          listener.removed(node)
        }
      }
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
  // Note: this method only looks one layer deep. If "grandchildren" are added or removed, this method will not be called
  // If you find that you're trying to do that, you're probably wrong
  childrenModified?: (element: HTMLElement, event: ChildrenEvent) => void
  attributesModified?: (element: HTMLElement, event: AttributeEvent) => void
}

type ChildrenEvent = {
  added: NodeList
  removed: NodeList
}
type AttributeEvent = {
  value: string
  oldValue: string
  name: string
}


// this is a singleton that's used throughout your entire app. You could create more than one of these if you know what you're doing
export const inkit = new Inkit()
