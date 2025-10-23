import * as React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export function DragHandle(props: Props) {
  const { className, children, ...rest } = props
  return (
    <button
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      aria-label="Drag"
      className={"p-2 rounded hover:bg-muted/50 cursor-grab " + (className ?? "")}
      style={{ touchAction: "none" }}
    >
      {children ?? <span className="sr-only">Drag</span>}
    </button>
  )
}

export default DragHandle
