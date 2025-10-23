"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Checkbox } from "./checkbox"

export type MultiSelectItem = { value: string; label?: string }

type MultiSelectProps = {
  items: MultiSelectItem[]
  values?: string[]
  onChange?: (values: string[]) => void
  placeholder?: string
  className?: string
  searchable?: boolean
  popWidth?: "auto" | "match" | "full"
}

export function MultiSelect({ items, values = [], onChange, placeholder = "Select...", className, searchable = true, popWidth = "match" }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null)

  React.useLayoutEffect(() => {
    function measure() {
      const el = triggerRef.current
      if (!el) return setTriggerWidth(null)
      const w = Math.ceil(el.getBoundingClientRect().width)
      setTriggerWidth(w)
    }
    if (open) measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [open])

  const toggle = React.useCallback((value: string) => {
    const exists = values.includes(value)
    const next = exists ? values.filter((v) => v !== value) : [...values, value]
    onChange?.(next)
  }, [values, onChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button ref={triggerRef} variant="outline" role="combobox" aria-expanded={open} className={cn("w-[220px] justify-between", className)}>
          {values.length ? (
            <div className="flex items-center gap-1 overflow-hidden">
              {items
                .filter((i) => values.includes(i.value))
                .slice(0, 3)
                .map((i) => (
                  <span key={i.value} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                    {i.label ?? i.value}
                  </span>
                ))}
              {values.length > 3 && <span className="text-xs text-muted-foreground">+{values.length - 3}</span>}
            </div>
          ) : (
            placeholder
          )}
          <span className="opacity-50">▾</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={"w-auto max-w-[90vw] p-0"}
        style={
          popWidth === "match" && triggerWidth
            ? { minWidth: `${triggerWidth}px` }
            : popWidth === "full" && triggerWidth
            ? { width: `${triggerWidth}px` }
            : undefined
        }
      >
        <Command>
          {searchable && <CommandInput placeholder={`Search ${placeholder.toLowerCase()}`} className="h-9" />}
          <CommandList
            onWheel={(e) => {
              const el = e.currentTarget as HTMLElement
              const prev = el.scrollTop
              el.scrollTop += e.deltaY
              if (el.scrollTop !== prev) {
                e.stopPropagation()
              }
            }}
          >
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {/* Select all */}
              {items.length > 0 && (
                <CommandItem key="__select_all__" value="__select_all__" onSelect={() => {
                  const allValues = items.map((i) => i.value)
                  const allSelected = allValues.every((v) => values.includes(v))
                  onChange?.(allSelected ? [] : allValues)
                }}>
                  <Checkbox checked={items.length > 0 && items.every((i) => values.includes(i.value))} onCheckedChange={() => {
                    const allValues = items.map((i) => i.value)
                    const allSelected = allValues.every((v) => values.includes(v))
                    onChange?.(allSelected ? [] : allValues)
                  }} className="mr-2" />
                  <span className="flex-1">Select all</span>
                </CommandItem>
              )}
              {items.map((item) => (
                <CommandItem key={item.value} value={item.value} onSelect={() => toggle(item.value)}>
                  <Checkbox checked={values.includes(item.value)} onCheckedChange={() => toggle(item.value)} className="mr-2" />
                  <span className="flex-1">{item.label ?? item.value}</span>
                  <Check className={cn(values.includes(item.value) ? "opacity-100" : "opacity-0", "ml-2 size-4")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default MultiSelect
