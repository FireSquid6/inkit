import { inkit } from "./inkit"
import { Root } from "./pages/root"

const app = document.querySelector<HTMLDivElement>('#app')


if (!app) {
  // something has gone horribly wrong
  throw new Error("Could not find #app. You screwed up big time.")
}


inkit.start(app)
app.innerHTML = Root().toString()
