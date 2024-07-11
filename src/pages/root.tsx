import { inkit } from "@/inkit"
import { Todo, TodoStore, todoStore } from "@/stores/todo-store"
import { selfRemoving } from "@/inkit/listener"

export function Root() {
  const todosId = inkit.getId()

  const storeCallback = (value: Todo[]) => {
    const div = document.getElementById(todosId)!
    div.innerHTML = ""

    for (let i = 0; i < value.length; i++) {
      div.innerHTML += TodoDisplay({ store: todoStore, index: i })
    }
  }

  inkit.subscribe(todosId, selfRemoving(todosId, {
    added: () => {
      todoStore.subscribe(storeCallback)
    },
    removed: () => {
      todoStore.unsubscribe(storeCallback)
    }
  }))

  return (
    <div>
      <h1>Welcome to my app!</h1>
      <TodoAdder store={todoStore} />
      <div id={todosId}></div>
    </div>
  )
}


function TodoAdder({ store }: { store: TodoStore }) {
  const inputId = inkit.getId()
  const buttonId = inkit.getId()


  const onClick = () => {
    const input = document.getElementById(inputId)! as HTMLInputElement
    const todo = input.value
    const current = store.snapshot()
    current.push({
      description: todo,
      status: "PENDING",
    })

    store.set(current)
  }

  inkit.subscribe(buttonId, selfRemoving(buttonId, {
    added: (button) => {
      button.onclick = onClick
    },
  }))


  return (
    <div>
      <input id={buttonId} type="text" />
      <button id={inputId}>Add</button>
    </div>
  )
}


function TodoDisplay({ store, index }: { store: TodoStore, index: number }) {
  const id = inkit.getId()

  const storeCallback = (value: Todo[]) => {
    const div = document.getElementById(id)!
    const todo = value[index]
    div.innerHTML = todo.description
  }


  inkit.subscribe(id, selfRemoving(id, {
    added: () => {
      store.subscribe(storeCallback)
    },
    removed: () => {
      store.unsubscribe(storeCallback)
    }
  }))

  return (
    <div id={id}>

    </div>
  )
}
