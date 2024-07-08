export function MyComponent() {
  return (
    <>
      <div>Hello world</div>
      <OtherComponent a={5} />
    </>
  )
}


type OtherProps = {
  a: number
}

export function OtherComponent(props: OtherProps) {
  return (
    <p>Some other stuff {props.a}</p>
  )
}
