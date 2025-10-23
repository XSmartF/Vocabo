import type { ServerFetchParams, ServerFetchResult } from "@/shared/components/table"
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"

// A typed mock fetcher helper. Place dataset in the caller and call createMockFetcher(rows).
export function createMockFetcher<T extends Record<string, unknown>>(rows: T[]) {
  return async function fetcher(params: ServerFetchParams & { filters?: ColumnFiltersState; sorting?: SortingState }): Promise<ServerFetchResult<T>> {
    const { pageIndex, pageSize, sorting, filters, globalFilter } = params

    let items = [...rows]

    // global filter: check stringified values
    if (globalFilter) {
      const q = String(globalFilter).toLowerCase()
      items = items.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(q))
    }

    // column filters
    if (Array.isArray(filters) && filters.length) {
      for (const f of filters) {
        const id = f.id as string | number | undefined
        const value = f.value
        if (id && value != null && value !== "") {
          items = items.filter((r) => {
            const v = (r as Record<string, unknown>)[String(id)]
            return String(v ?? "").toLowerCase().includes(String(value).toLowerCase())
          })
        }
      }
    }

    // simple sorting (first entry)
    if (Array.isArray(sorting) && sorting.length) {
      const s = sorting[0] as SortingState[number]
      const id = s?.id as string | number | undefined
      const desc = !!s?.desc
      if (id) {
        items.sort((a: T, b: T) => {
          const va = (a as Record<string, unknown>)[String(id)]
          const vb = (b as Record<string, unknown>)[String(id)]
          if (va == null && vb == null) return 0
          if (va == null) return desc ? 1 : -1
          if (vb == null) return desc ? -1 : 1
          if (va < vb) return desc ? 1 : -1
          if (va > vb) return desc ? -1 : 1
          return 0
        })
      }
    }

    const total = items.length
    const start = pageIndex * pageSize
    const end = start + pageSize
    const pageItems = items.slice(start, end)

    // simulate latency
    await new Promise((r) => setTimeout(r, 200))

    return { rows: pageItems, total }
  }
}
