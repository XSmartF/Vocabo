import type { Table as RTTable } from "@tanstack/react-table"

export type FilterType =
  | "text"
  | "select"
  | "multiselect"
  | "date"
  | "number"
  | "numberrange"
  | "daterange"

export type FilterOption = { value: string; label?: string }
export type FilterDef = {
  id: string
  label?: string
  type: FilterType
  options?: FilterOption[]
}

export type FilterValue = unknown

/** Page size options used in table toolbar */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

/**
 * Return a sensible initial filter value for a given FilterType.
 */
export function initFilterValueForType(t: FilterType): FilterValue {
  if (t === "multiselect") return []
  if (t === "text") return { op: "include", value: "" }
  if (t === "number") return { op: "=", value: "" }
  if (t === "numberrange") return { min: "", max: "" }
  if (t === "daterange") return { from: undefined as Date | undefined, to: undefined as Date | undefined }
  if (t === "date") return undefined
  return ""
}

/**
 * Build an initial map of filter values (used for clearing or default state)
 */
export function buildInitialFilterValues(filters?: FilterDef[]): Record<string, FilterValue> {
  const init: Record<string, FilterValue> = {}
  if (!filters) return init
  for (const f of filters) init[f.id] = initFilterValueForType(f.type)
  return init
}

/**
 * Seed filter values from a table's current column filter state.
 * Generic over the table row shape so callers keep strong typing.
 */
export function seedFilterValuesFromTable<T>(filters: FilterDef[] | undefined, table?: RTTable<T>): Record<string, FilterValue> {
  const seed: Record<string, FilterValue> = {}
  if (!filters) return seed
  for (const f of filters) {
    const col = table?.getColumn(f.id as string)
    const val = col?.getFilterValue()
    if (val === undefined) seed[f.id] = initFilterValueForType(f.type)
    else {
      // convert string dates to Date objects for date/daterange filters
      if (f.type === "date") {
        if (typeof val === "string" && val) seed[f.id] = new Date(val)
        else seed[f.id] = val
      } else if (f.type === "daterange") {
        // expect { from?: string|Date, to?: string|Date }
        const v = val as Record<string, unknown>
        const from = v?.from
        const to = v?.to
        seed[f.id] = {
          from: typeof from === "string" && from ? new Date(from) : (from as Date | undefined),
          to: typeof to === "string" && to ? new Date(to) : (to as Date | undefined),
        }
      } else {
        seed[f.id] = val
      }
    }
  }
  return seed
}

/**
 * Convert a single filter value to a server-friendly representation.
 * Dates are converted to 'YYYY-MM-DD' strings.
 */
export function formatFilterValueForServer(val: unknown): unknown {
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  if (Array.isArray(val)) return val
  if (val && typeof val === "object") {
    const v = val as Record<string, unknown>
    // handle range-like objects
    if ("from" in v || "to" in v) {
      return {
        from: v.from instanceof Date ? (v.from as Date).toISOString().slice(0, 10) : typeof v.from === "string" ? v.from : undefined,
        to: v.to instanceof Date ? (v.to as Date).toISOString().slice(0, 10) : typeof v.to === "string" ? v.to : undefined,
      }
    }
    return val
  }
  return val
}

/**
 * Convert an entire ColumnFiltersState into a server-friendly shape.
 */
import type { ColumnFiltersState } from "@tanstack/react-table"
export function formatColumnFiltersForServer(filters: ColumnFiltersState): ColumnFiltersState {
  return filters.map((f) => ({ id: f.id, value: formatFilterValueForServer(f.value) }))
}
