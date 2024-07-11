import { Store } from "@/inkit/pubsub"

export type Todo = {
  description: string
  status: "DONE" | "PENDING"
}


export const todoStore = new Store<Todo[]>([])
export type TodoStore = typeof todoStore
