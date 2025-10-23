import * as React from "react"
import { Button } from "@/shared/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet"
import { Filter } from 'lucide-react'
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Combobox } from "@/shared/components/ui/combobox"
import { MultiSelect } from "@/shared/components/ui/multiselect"
import { DatePicker } from "@/shared/components/ui/datepicker"
import type { FilterDef } from "@/shared/lib/tableFilters"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  filters?: FilterDef[]
  filterValues: Record<string, unknown>
  setFilterValues: (updater: React.SetStateAction<Record<string, unknown>>) => void
  applyFilters: () => void
  clearFilters: () => void
}
export function FiltersSheet({ open, onOpenChange, filters, filterValues, setFilterValues, applyFilters, clearFilters }: Props) {
  return (
    <>{filters ? (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" aria-label="Filters">
            <Filter size={16} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Apply filters to columns</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
            {filters.map((f) => (
              <div key={f.id} className="flex flex-col gap-1">
                <Label className="text-sm">{f.label ?? f.id}</Label>
                {f.type === "text" && (
                  <div className="flex items-center gap-2">
                    <div className="w-36">
                      <Combobox
                        items={[{ value: "include", label: "Include" }, { value: "exclude", label: "Exclude" }, { value: "equal", label: "Equal" }]}
                        value={String(((filterValues[f.id] as Record<string, unknown>)?.op) ?? "include")}
                        onChange={(v) => setFilterValues((s) => ({ ...s, [f.id]: { ...((s[f.id] as Record<string, unknown>) ?? {}), op: v } }))}
                        placeholder="Op"
                        className="w-full"
                      />
                    </div>
                    <Input
                      value={String(((filterValues[f.id] as Record<string, unknown>)?.value) ?? "")}
                      onChange={(e) => setFilterValues((s) => ({ ...s, [f.id]: { ...((s[f.id] as Record<string, unknown>) ?? {}), value: e.target.value } }))}
                    />
                  </div>
                )}
                {f.type === "select" && (
                  <Combobox
                    // Do not prepend an extra "All" option automatically; use provided options only.
                    items={(f.options ?? []).map((o) => ({ value: o.value, label: o.label ?? o.value }))}
                    value={String(filterValues[f.id] ?? "")}
                    onChange={(v) => setFilterValues((s) => ({ ...s, [f.id]: v }))}
                    placeholder="All"
                    className="w-full"
                  />
                )}
                {f.type === "multiselect" && (
                  <MultiSelect
                    items={(f.options ?? []).map((o) => ({ value: o.value, label: o.label ?? o.value }))}
                    values={(filterValues[f.id] as string[] | undefined) ?? []}
                    onChange={(vals) => setFilterValues((s) => ({ ...s, [f.id]: vals }))}
                    placeholder="All"
                    className="w-full"
                  />
                )}
                {f.type === "date" && (
                  <DatePicker
                    variant="input-time"
                    id={`${f.id}-picker`}
                    // Default to today when no value is present
                    value={
                      filterValues[f.id]
                        ? (typeof filterValues[f.id] === "string" && (filterValues[f.id] as string)
                            ? new Date(filterValues[f.id] as string)
                            : (filterValues[f.id] as Date))
                        : new Date()
                    }
                    onChange={(d) => setFilterValues((s) => ({ ...s, [f.id]: d ? d.toISOString().slice(0, 10) : "" }))}
                  />
                )}
                {f.type === "daterange" && (
                  <div className="flex gap-2">
                    <DatePicker
                      variant="input-time"
                      id={`${f.id}-from`}
                      // Default 'from' to today when missing
                      value={
                        (filterValues[f.id] as Record<string, unknown>)?.from
                          ? (typeof (filterValues[f.id] as Record<string, unknown>)?.from === "string"
                              ? new Date(((filterValues[f.id] as Record<string, unknown>)?.from) as string)
                              : ((filterValues[f.id] as Record<string, unknown>)?.from as Date))
                          : new Date()
                      }
                      onChange={(d) => setFilterValues((s) => ({ ...s, [f.id]: { ...((s[f.id] as Record<string, unknown>) ?? {}), from: d ? d.toISOString().slice(0, 10) : "" } }))}
                    />
                    <DatePicker
                      variant="input-time"
                      id={`${f.id}-to`}
                      // Default 'to' to today when missing
                      value={
                        (filterValues[f.id] as Record<string, unknown>)?.to
                          ? (typeof (filterValues[f.id] as Record<string, unknown>)?.to === "string"
                              ? new Date(((filterValues[f.id] as Record<string, unknown>)?.to) as string)
                              : ((filterValues[f.id] as Record<string, unknown>)?.to as Date))
                          : new Date()
                      }
                      onChange={(d) => setFilterValues((s) => ({ ...s, [f.id]: { ...((s[f.id] as Record<string, unknown>) ?? {}), to: d ? d.toISOString().slice(0, 10) : "" } }))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <SheetFooter>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={clearFilters}>Clear</Button>
              <Button onClick={applyFilters}>Apply</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ) : null}</>
  )
}

export default FiltersSheet
