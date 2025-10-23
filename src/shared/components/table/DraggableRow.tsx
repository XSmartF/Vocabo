import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Row, Table as RTTable } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { DragHandle } from "@/shared/components/table/DragHandle"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { GripVertical } from 'lucide-react'

type Props<T> = {
  row: Row<T>
  table: RTTable<T>
  selectionEnabled?: boolean
  dragHandleColumnId?: string | undefined
}

function DraggableRowInner<T>({ row, table, selectionEnabled, dragHandleColumnId }: Props<T>) {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({ id: row.id })
  const wrapperStyle = { transform: CSS.Transform.toString(transform), transition }

  return (
    <tr
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef as unknown as React.Ref<HTMLTableRowElement>}
      className="relative z-0"
    >
      {selectionEnabled ? (
        <td className="w-10">
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={() => {
                const prev = table.getState().rowSelection as Record<string, boolean>
                const nextSel = { ...prev }
                if (nextSel[row.id]) delete nextSel[row.id]
                else nextSel[row.id] = true
                table.setRowSelection(nextSel)
              }}
            />
          </div>
        </td>
      ) : null}

      {!dragHandleColumnId ? (
        <td className="w-12">
          <div style={isDragging ? (wrapperStyle as React.CSSProperties) : undefined} className={isDragging ? "block w-full" : undefined}>
            <DragHandle {...(attributes as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)} {...(listeners as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)} aria-hidden={false}>
              <GripVertical size={14} className="opacity-70" />
            </DragHandle>
          </div>
        </td>
      ) : null}

      {row.getVisibleCells().map((cell) => {
        const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext())
        const contentToRender = (cell.column.id === (dragHandleColumnId as string) && React.isValidElement(cellContent))
          ? React.cloneElement(cellContent as React.ReactElement, { ...attributes, ...listeners })
          : cellContent

        return (
          <td key={cell.id}>
            <div style={isDragging ? (wrapperStyle as React.CSSProperties) : undefined} className={isDragging ? "block w-full" : undefined}>
              {contentToRender}
            </div>
          </td>
        )
      })}
    </tr>
  )
}

export const DraggableRow = React.memo(DraggableRowInner) as typeof DraggableRowInner

export default DraggableRow
