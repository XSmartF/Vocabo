"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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

export type ComboboxItem = { value: string; label?: string }

type ComboboxProps = {
  items: ComboboxItem[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  noSearch?: boolean
  popWidth?: "auto" | "match" | "full"
}

export function Combobox({ items, value, onChange, placeholder = "Select...", className, noSearch = false, popWidth = "match" }: ComboboxProps) {
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button ref={triggerRef} variant="outline" role="combobox" aria-expanded={open} className={cn("w-[200px] justify-between", className)}>
          {value ? items.find((i) => i.value === value)?.label ?? value : placeholder}
          <ChevronsUpDown className="opacity-50" />
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
          {!noSearch && <CommandInput placeholder={`Search ${placeholder.toLowerCase()}`} className="h-9" />}
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
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const newVal = currentValue === value ? "" : currentValue
                    onChange?.(newVal)
                    setOpen(false)
                  }}
                >
                  {item.label ?? item.value}
                  <Check className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox
