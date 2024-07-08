Everything I'm about to say is my "plan" for inkit. It isn't really built yet.

# oh god not another javascript framework
erm... it's actually a library

Inkit is another "tool that does frontend stuff" - regardless of whether you call it a "library" or "framework". The javascript ecosystem is particularly known for constantly making new frameworks and perpetuating [standard hell](https://xkcd.com/927/). So why is some random teenager making a new one?

# i'm not like other girls
Inkit isn't another framework that you have to "learn." In fact, it isn't even an packge. All it really is a small template on top of vanilla vite that provides you with a decent system out of the box for doing components and state management. All of the code is in the `src/inkit` directory of *your project*. If you don't like parts of it, change it. If it confuses you, read the probably only like 500 lines of code.

Inkit also goes out of its way to reduce "magic" - which is in my opinion the biggest sin of these 

Here's a basic counter in react:
```tsx
function Counter() {
    const [count, setCount] = useState(0)
    // I know this could be a useCallback but I don't care
    const onClick = () => {
        setCount(count + 1)
    }

    return (
        <div>
            <p>{count}</p>
            <button onClick={onClick}>Click Me!</button>
        </div>
    )
}
```


In react, your component is called once, then re-rendered sometimes when something changes?. Additionally, there's this whole `useState` thing? Most people using react don't really understand what the hell is actually going on with `useState` or where the state is actually stored. This isn't even getting into the awesome ways to shoot yourself in the foot with `useEffect`.

None of this is to say that react is bad- react is just hard. It sacrifices ease of understanding for a lack of verboseness. Once you learn react, it can become pretty great.

Inkit tries to be simpler. It builds off of your prexisting javascript knowledge without the need for learning what's essentially an entirely new language. MDN is the only documentation you should need

```tsx
function Counter() {
    const counter = new PubsubStore<number>(0)

    // thinking about ids is hard so inkit makes it easy to make them all unique
    // under the hood, this is just a counter
    const id = inkit.getNewUuid() // wanna know how this works? Your lsp can take you to the definition
    const buttonId = inkit.getNewUuid()
    const textId = inkit.getNewUuid()

    coutner.subscribe((count) => {
        const text = document.getElementById(textId)
        if (!text) {
            // TODO: add easy way to handle these erros
        }
        text.innerHtml = `count: ${count}`
    })

    const onClick = () => {
        counter.set(counter.snapshot() + 1)
    }
    coutner.subscribe
    inkit.subscribe(id, {
        added: (element) => {
            // setup has to be done here
            // element is the element with the special id
            const button = document.getElementById(buttonId)

            if (!button) {
                // something has gone very wrong
                // TODO: proper error handling
                return
            }

            button.onClick = onClick
        }
    })

    return (
        <div id={id}>
            <button id={buttonId}></button>
            <p id={textId}>0</p>
        </div>
    )
}

```

TODO: more examples when doing form stuff

# Inkit
Inkit is under heavy construction. I'll make a better readme once it gets to a more reasonable place.
