import { CommonTable, type ColumnDef, type ServerFetchParams, type ServerFetchResult } from "@/shared/components/table"
// GripVertical removed (reorder UI removed)
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

// Server-backed table; no local mock storage needed

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

  // Server fetcher that calls real backend endpoints
  const fetcher = async (p: ServerFetchParams): Promise<ServerFetchResult<WordEntry>> => {
    const body = {
      pageIndex: p.pageIndex,
      pageSize: p.pageSize,
      sorting: p.sorting,
      filters: p.filters,
      globalFilter: p.globalFilter,
    }
    const res = await fetch('/api/words/table/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json() as { rows: unknown[]; total: number }
    const rows: WordEntry[] = data.rows.map((rUnknown, i: number) => {
      const r = rUnknown as Record<string, unknown>;
      return {
        id: typeof r.id === 'number' ? (r.id as number) : i + 1,
        word: (r.text as string) ?? (r.word as string) ?? '',
        meaning: (r.definition as string) ?? (r.meaning as string) ?? '',
    difficulty: ((r.difficulty as string) === 'medium' || (r.difficulty as string) === 'hard') ? (r.difficulty as string as "easy" | "medium" | "hard") : 'easy',
        tags: Array.isArray(r.tags) ? (r.tags as string[]) : (typeof r.tags === 'string' ? (r.tags as string).split(',').map((s) => s.trim()) : []),
        createdAt: (r.createdAt as string) ?? new Date().toISOString(),
        favorite: !!r.favorite,
        progress: typeof r.progress === 'number' ? (r.progress as number) : 0,
      }
    })
    return { rows, total: data.total }
  }

  // server reorder handler removed

  const handleRowSelect = (selectedIds: string[]) => {
    console.debug('Selected rows:', selectedIds)
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
        onRowSelect={handleRowSelect}
      />
    </div>
  )
}
