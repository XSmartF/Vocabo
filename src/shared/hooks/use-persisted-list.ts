import * as React from "react"
import { lsGet, lsSet } from "../lib/localStorage"


export function usePersistedList<T extends { title: string }>(
  key: string,
  initialItems: T[]
) {
  const [state, setState] = React.useState<T[]>(() => {
    try {
      const parsed = lsGet<Partial<T>[]>(key) ?? []
      if (parsed.length) {
        return initialItems.map((it) => {
          const stored = parsed.find((p) => p.title === it.title) as Partial<T> | undefined
          if (!stored) return it as T
          const filtered: Partial<T> = {}
          Object.entries(stored).forEach(([k, v]) => {
            const t = typeof v
            if (v === null || t === "string" || t === "number" || t === "boolean") {
              ;(filtered as Record<string, unknown>)[k] = v as unknown
            }
          })
          return { ...(it as T), ...(filtered as Partial<T>) }
        })
      }
    } catch {
      // ignore
    }
    return initialItems
  })

  React.useEffect(() => {
    const serializable = (state as unknown as Record<string, unknown>[]).map((it) => {
      const out: Record<string, unknown> = {}
      Object.entries(it).forEach(([k, v]) => {
        if (v === null) return (out[k] = null)
        const t = typeof v
        if (t === "string" || t === "number" || t === "boolean") {
          out[k] = v
        }
      })
      return out
    })

    lsSet(key, serializable)
  }, [key, state])

  React.useEffect(() => {
    try {
      const parsed = lsGet<Partial<T>[]>(key) ?? []
      const merged = initialItems.map((it) => {
        const stored = parsed.find((p) => p.title === it.title) as Partial<T> | undefined
        if (!stored) return it as T
        const filtered: Partial<T> = {}
        Object.entries(stored).forEach(([k, v]) => {
          const t = typeof v
          if (v === null || t === "string" || t === "number" || t === "boolean") {
            ;(filtered as Record<string, unknown>)[k] = v as unknown
          }
        })
        return { ...(it as T), ...(filtered as Partial<T>) }
      })
      setState(merged)
    } catch {
      setState(initialItems)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(initialItems)])

  return [state, setState] as const
}
