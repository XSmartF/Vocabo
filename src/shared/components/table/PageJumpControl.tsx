import * as React from "react"
import type { Table as RTTable } from "@tanstack/react-table"
import { Button } from "@/shared/components/ui/button"
import { Input } from "../ui/input";

export function PageJumpControl<T>({ table, totalServer }: { table: RTTable<T>; totalServer: number }) {
  const pageIndex = table.getState().pagination.pageIndex
  const [val, setVal] = React.useState<string>(String(pageIndex + 1))

  React.useEffect(() => {
    setVal(String(table.getState().pagination.pageIndex + 1))
  }, [table, pageIndex])

  const go = React.useCallback(() => {
    const parsed = Number(val)
    if (!Number.isFinite(parsed)) return
    const clamped = Math.max(1, Math.min(totalServer, Math.floor(parsed)))
    table.setPageIndex(clamped - 1)
    setVal(String(clamped))
  }, [val, table, totalServer])

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={go}>Go to</Button>
      <Input
        type="number"
        min={1}
        max={totalServer}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        aria-label="Page number"
      />
    </div>
  )
}

export default PageJumpControl
