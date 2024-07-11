import { inkit } from "@/inkit"
import type { InkitListener } from "@/inkit"

export function MyCoolComponent() {
  const divId = inkit.getNewUuid()

  const listener: InkitListener = {
    added: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const div = document.getElementById(divId)!
      div.innerText = "This component is cool"
    },
    instantly: () => {
      console.log("subscribed!")
    },
    removed: () => {
      inkit.unsubscribe(divId, listener)
    }
  }
  inkit.subscribe(divId, listener)


  return (
    <div id={divId}>
      This component is supposed to be cool
    </div>
  )
}
