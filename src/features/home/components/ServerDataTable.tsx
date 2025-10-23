import { CommonTable, type ColumnDef, type ServerFetchParams, type ServerFetchResult } from "@/shared/components/table"
import type { FilterDef } from "@/shared/lib/tableFilters"

type WordEntry = {
  id: number
  word: string
  meaning: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  createdAt: string
  favorite: boolean
  progress: number
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001"

function buildQuery(params: { pageIndex: number; pageSize: number; sorting: unknown; filters: unknown; globalFilter?: string }) {
  const { pageIndex, pageSize, sorting, filters, globalFilter } = params as { pageIndex: number; pageSize: number; sorting: unknown; filters: unknown; globalFilter?: string }
  const qp: Record<string, string> = {}
  // json-server uses _page and _limit for pagination
  qp['_page'] = String(pageIndex + 1)
  qp['_limit'] = String(pageSize)

  // sorting: use _sort and _order (only single sort supported by json-server)
  if (Array.isArray(sorting) && sorting.length > 0) {
    const s = sorting[0]
    qp['_sort'] = s.id ?? ''
    qp['_order'] = s.desc ? 'desc' : 'asc'
  }

  // simple global q search using json-server q
  if (globalFilter) qp['q'] = globalFilter

  // filters: expect array of {id, value}
  if (Array.isArray(filters)) {
    for (const f of filters) {
      if (f.value == null || f.value === "") continue
      // if it's an array (multiselect) send multiple params
      if (Array.isArray(f.value)) {
        // json-server supports repeated query params like tags_like
        qp[`${f.id}_like`] = f.value.join('|')
      } else {
        // for date equality or exact values
        qp[f.id] = String(f.value)
      }
    }
  }

  return new URLSearchParams(qp).toString()
}

export default function ServerDataTable() {
  const columns: ColumnDef<WordEntry, unknown>[] = [
    { accessorKey: 'word', header: 'Word', cell: (ctx) => <div className="font-medium">{ctx.getValue<string>()}</div>, meta: { isSortEnable: true, width: 160 } },
    { accessorKey: 'meaning', header: 'Meaning', cell: (ctx) => <div className="text-sm text-muted-foreground truncate max-w-xl">{ctx.getValue<string>()}</div> },
    { accessorKey: 'difficulty', header: 'Difficulty', cell: (ctx) => <span className="capitalize">{ctx.getValue<string>()}</span> },
    { accessorFn: (r) => (Array.isArray(r.tags) ? r.tags.join(', ') : ''), id: 'tags', header: 'Tags', cell: (ctx) => <div className="flex gap-1 items-center">{String(ctx.getValue()).split(',').map((t, i) => <span key={i} className="px-2 py-1 bg-muted rounded text-xs">{t.trim()}</span>)}</div> },
    { accessorKey: 'createdAt', header: 'Added', cell: (ctx) => <span className="text-xs text-muted-foreground">{ctx.getValue<string>()}</span> },
    { accessorKey: 'favorite', header: 'Fav', cell: (ctx) => <span>{ctx.getValue<boolean>() ? '★' : '☆'}</span>, meta: { width: 60 } },
    { accessorKey: 'progress', header: 'Progress', cell: (ctx) => <div className="w-28 bg-muted rounded-full h-2"><div style={{ width: `${ctx.getValue<number>()}%` }} className="h-2 bg-primary rounded-full" /></div> },
  ]

  const filters: FilterDef[] = [
    { id: 'difficulty', label: 'Difficulty', type: 'select', options: [{ value: '', label: 'All' }, { value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }] },
    { id: 'tags', label: 'Tags', type: 'multiselect', options: [{ value: 'vocab' }, { value: 'verb' }, { value: 'adjective' }, { value: 'noun' }] },
    { id: 'createdAt', label: 'Added On', type: 'date' },
  ]

  const fetcher = async (p: ServerFetchParams): Promise<ServerFetchResult<WordEntry>> => {
    const { pageIndex, pageSize, sorting, filters, globalFilter } = p
    const qs = buildQuery({ pageIndex, pageSize, sorting, filters, globalFilter })
    const url = `${API_BASE}/words?${qs}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch')
    const rows: WordEntry[] = await res.json()
    // json-server provides x-total-count header
    const total = Number(res.headers.get('x-total-count') ?? rows.length)
    return { rows, total }
  }

  return (
    <div>
      <CommonTable
        columns={columns}
        fetcher={fetcher}
        initialPageSize={10}
        filters={filters}
        toolbarButtons={[]}
        renderEmpty={<div className="p-6 text-center">No results from server</div>}
      />
    </div>
  )
}
