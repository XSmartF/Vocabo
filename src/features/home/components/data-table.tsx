import React from "react"
import { CommonTable, type ColumnDef } from "@/shared/components/table"
import type { FilterDef } from "@/shared/lib/tableFilters"
import { Button } from "@/shared/components/ui/button"

type WordEntry = {
  id: string
  word: string
  meaning: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  createdAt: string 
  favorite: boolean
  progress: number 
}

function generateMockData(n = 57): WordEntry[] {
  const words = ["abate", "benevolent", "candid", "daunt", "eclectic", "fervent", "galvanize", "harbinger", "idyllic", "jubilant", "keen", "lucid", "meticulous", "novice", "opaque", "prudent", "quaint", "ravenous", "serene", "tenacious", "ubiquitous", "venerate", "wistful", "xenial", "yonder", "zealous"]
  const tags = ["vocab", "verb", "adjective", "noun", "phrasal", "formal", "slang"]
  const difficulties: WordEntry["difficulty"][] = ["easy", "medium", "hard"]
  const res: WordEntry[] = []
  for (let i = 0; i < n; i++) {
    const w = words[i % words.length] + (i > words.length ? `-${i}` : "")
    res.push({
      id: String(i + 1),
      word: w,
      meaning: `Meaning of ${w} - a short description to demo the table row.`,
      difficulty: difficulties[i % difficulties.length],
      tags: [tags[i % tags.length], tags[(i + 2) % tags.length]].filter(Boolean),
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
      favorite: i % 7 === 0,
      progress: Math.floor(Math.abs(Math.sin(i + 1) * 100)),
    })
  }
  return res
}

const MOCK = generateMockData(73)

const DataTable: React.FC = () => {
  const [localData, setLocalData] = React.useState<WordEntry[]>(MOCK)

  const columns: ColumnDef<WordEntry, unknown>[] = [
    {
      accessorKey: "word",
      header: "Word",
      cell: (ctx) => <div className="font-medium">{ctx.getValue<string>()}</div>,
      meta: { isSortEnable: true, width: 160 },
    },
    {
      accessorKey: "meaning",
      header: "Meaning",
      cell: (ctx) => <div className="text-sm text-muted-foreground truncate max-w-xl">{ctx.getValue<string>()}</div>,
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: (ctx) => <span className="capitalize">{ctx.getValue<string>()}</span>,
    },
    {
      accessorFn: (row) => row.tags.join(", "),
      id: "tags",
      header: "Tags",
      cell: (ctx) => <div className="flex gap-1 items-center">{String(ctx.getValue()).split(",").map((t, i) => <span key={i} className="px-2 py-1 bg-muted rounded text-xs">{t.trim()}</span>)}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Added",
      cell: (ctx) => <span className="text-xs text-muted-foreground">{ctx.getValue<string>()}</span>,
    },
    {
      accessorKey: "favorite",
      header: "Fav",
      cell: (ctx) => <span>{ctx.getValue<boolean>() ? "★" : "☆"}</span>,
      meta: { width: 60 },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: (ctx) => <div className="w-28 bg-muted rounded-full h-2"><div style={{ width: `${ctx.getValue<number>()}%` }} className="h-2 bg-primary rounded-full" /></div>,
    },
  ]

  const filters: FilterDef[] = [
    { id: "difficulty", label: "Difficulty", type: "select", options: [{ value: "", label: "All" }, { value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }] },
    { id: "tags", label: "Tags", type: "multiselect", options: [{ value: "vocab" }, { value: "verb" }, { value: "adjective" }, { value: "noun" }, { value: "phrasal" }] },
    { id: "createdAt", label: "Added On", type: "date" },
  ]

  const onExport = () => console.log("toolbar: export clicked")
  const onAdd = () => console.log("toolbar: add clicked")

  return (
    <div>
      <CommonTable
        columns={columns}
        data={localData}
        initialPageSize={10}
        renderEmpty={<div className="p-6 text-center">No demo rows</div>}
        toolbarButtons={[
          <Button key="export" size="sm" onClick={onExport}>Export</Button>,
          <Button key="add" size="sm" onClick={onAdd}>Add</Button>,
        ]}
        filters={filters}
        enableRowArrange={true}
        onRowArrange={(newOrder) => {
          setLocalData(newOrder as WordEntry[])
        }}
        onRowSelect={(ids) => console.log("onRowSelect: selected ids", ids)}
      />
    </div>
  )
}

export default DataTable