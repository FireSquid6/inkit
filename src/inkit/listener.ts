import { InkitListener } from ".";

export function selfRemoving(id: string, listener: InkitListener): InkitListener {
  const wrapperListener: InkitListener = {
    ...listener,
    removed: (inkit) => {
      if (listener.removed) {
        listener.removed(inkit)
      }
      inkit.unsubscribe(id, wrapperListener)
    }
  }
  return wrapperListener
}
