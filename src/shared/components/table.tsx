import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// drag-and-drop reorder removed
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  Table as RTTable,
  TableState,
} from "@tanstack/react-table";

import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  // AlertDialogCancel removed - Cancel will be handled via Button to run undo
} from "@/shared/components/ui/alert-dialog";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Combobox } from "@/shared/components/ui/combobox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

// DraggableRow (reorder) removed
import FiltersSheet from "@/shared/components/table/FiltersSheet";

import type { FilterDef } from "@/shared/lib/tableFilters";
import {
  buildInitialFilterValues,
  seedFilterValuesFromTable,
  PAGE_SIZE_OPTIONS,
  formatColumnFiltersForServer,
} from "@/shared/lib/tableFilters";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

import { PageJumpControl } from "@/shared/components/table/PageJumpControl";

export type ServerFetchParams = {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  filters: ColumnFiltersState;
  globalFilter?: string;
};
export type ServerFetchResult<T> = { rows: T[]; total: number };

export type CommonTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data?: T[];
  fetcher?: (p: ServerFetchParams) => Promise<ServerFetchResult<T>>;
  initialPageSize?: number;
  renderEmpty?: React.ReactNode;
  renderRow?: (row: Row<T>, table: RTTable<T>) => React.ReactNode;
  renderBody?: (rows: Row<T>[], table: RTTable<T>) => React.ReactNode;
  toolbarButtons?: React.ReactNode[];
  filters?: FilterDef[];
  onRowSelect?: (selectedRowIds: string[]) => void;
};

export function CommonTable<T extends object>({
  columns,
  data: initialData,
  fetcher,
  initialPageSize = 10,
  renderEmpty,
  renderRow,
  renderBody,
  toolbarButtons,
  filters,
  onRowSelect,
}: CommonTableProps<T>) {
  const isServer = typeof fetcher === "function";
  const [data, setData] = React.useState<T[]>(() => initialData ?? []);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debouncedGlobal = useDebouncedValue(globalFilter, 300);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [serverTotal, setServerTotal] = React.useState<number | null>(null);
  const [internalLoading, setInternalLoading] = React.useState(false);

  const table = useReactTable<T>({
    data,
    columns: columns as ColumnDef<T, unknown>[],
    getRowId: (row, i) =>
      String((row as unknown as { id?: string | number }).id ?? i),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter: debouncedGlobal,
    } as TableState,
    manualPagination: isServer,
    manualFiltering: isServer,
    manualSorting: isServer,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  }) as unknown as RTTable<T>;

  function SelectAllCheckbox() {
    const visible = table.getFilteredRowModel().rows;
    const all = visible.length > 0 && visible.every((r) => r.getIsSelected());
    const some = visible.some((r) => r.getIsSelected()) && !all;
    const rootRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
      const input = rootRef.current?.querySelector(
        "input"
      ) as HTMLInputElement | null;
      if (input) input.indeterminate = some;
    }, [some, visible.length]);

    return (
      <Checkbox
        ref={rootRef as unknown as React.Ref<HTMLButtonElement>}
        checked={all}
        onCheckedChange={(v) => {
          const next: Record<string, boolean> = {};
          if (v) {
            for (const r of visible) next[r.id] = true;
          }
          table.setRowSelection(next);
        }}
      />
    );
  }

  // reorder / drag-and-drop logic removed

  const rowSelectionState = table.getState().rowSelection;
  React.useEffect(() => {
    if (typeof onRowSelect !== "function") return;
    const selected = table.getFilteredSelectedRowModel().rows.map((r) => r.id);
    onRowSelect(selected);
  }, [rowSelectionState, table, onRowSelect]);

  const sortingKey = React.useMemo(() => JSON.stringify(sorting), [sorting]);
  const filtersKey = React.useMemo(
    () => JSON.stringify(columnFilters),
    [columnFilters]
  );

  React.useEffect(() => {
    if (!isServer || !fetcher) return;
    let mounted = true;
    setInternalLoading(true);
    const serverFilters = formatColumnFiltersForServer(columnFilters);
    fetcher({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      filters: serverFilters,
      globalFilter: debouncedGlobal,
    })
      .then((res) => {
        if (!mounted) return;
        setData(res.rows ?? []);
        setServerTotal(res.total ?? res.rows.length);
      })
      .catch(() => {
        if (!mounted) return;
        setData([]);
        setServerTotal(0);
      })
      .finally(() => {
        if (!mounted) return;
        setInternalLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [
    isServer,
    fetcher,
    pagination.pageIndex,
    pagination.pageSize,
    sortingKey,
    filtersKey,
    debouncedGlobal,
    sorting,
    columnFilters,
  ]);

  React.useEffect(() => {
    if (!isServer && Array.isArray(initialData)) setData(initialData);
  }, [initialData, isServer]);

  const effectiveLoading = internalLoading;

  const baseColumnsCount = table.getAllLeafColumns().length;
  const _columnsCount =
    baseColumnsCount +
    (onRowSelect ? 1 : 0) +
    0;
  const _skeletonRows = table.getState().pagination.pageSize ?? 5;

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [filterValues, setFilterValues] = React.useState<
    Record<string, unknown>
  >(() => buildInitialFilterValues(filters));

  React.useEffect(() => {
    if (!sheetOpen) return;
    setFilterValues(seedFilterValuesFromTable<T>(filters, table));
  }, [sheetOpen, filters, table]);

  const applyFilters = React.useCallback(() => {
    if (!filters) return;
    for (const f of filters) {
      const col = table.getColumn(f.id as string);
      if (!col) continue;
      col.setFilterValue(
        (filterValues as Record<string, unknown>)[f.id] ?? undefined
      );
    }
    setSheetOpen(false);
  }, [filters, filterValues, table]);

  const clearFilters = React.useCallback(() => {
    if (!filters) return;
    for (const f of filters) {
      const col = table.getColumn(f.id as string);
      if (!col) continue;
      col.setFilterValue(undefined);
    }
    setFilterValues(buildInitialFilterValues(filters));
  }, [filters, table]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {toolbarButtons?.map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              try {
                // reset to first page when search changes
                table.setPageIndex(0);
              } catch (err) {
                // guard: if table isn't ready for some reason, also reset local pagination
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }
            }}
            className="max-w-sm"
          />

          {filters ? (
            <FiltersSheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              filters={filters}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          ) : null}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="rounded-lg">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {onRowSelect ? (
                    <TableHead key={`${hg.id}-select`} className="w-10">
                      <div className="flex items-center justify-center">
                        <SelectAllCheckbox />
                      </div>
                    </TableHead>
                  ) : null}

                  {hg.headers.map((header) => {
                    const _metaUnknown =
                      (
                        header.column.columnDef as unknown as {
                          meta?: unknown;
                        }
                      ).meta ?? {};
                    const meta = _metaUnknown as {
                      width?: string | number;
                      isSortEnable?: boolean;
                    };
                    const width = meta.width ?? undefined;
                    const isSortEnable = meta.isSortEnable ?? true;
                    const canSort = header.column.getCanSort() && isSortEnable;
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={
                          width
                            ? {
                                width:
                                  typeof width === "number"
                                    ? `${width}px`
                                    : width,
                              }
                            : undefined
                        }
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </div>
                            {canSort ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const s = header.column.getIsSorted();
                                  if (s === "asc") header.column.toggleSorting(true);
                                  else if (s === "desc") header.column.clearSorting();
                                  else header.column.toggleSorting(false);
                                }}
                                className="ml-2 text-sm select-none"
                                aria-label={`Toggle sort for ${String(header.id)}`}
                                title={`Toggle sort for ${String(header.id)}`}
                              >
                                {header.column.getIsSorted() === "asc" ? (
                                  <ArrowUp size={16} className="inline" />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <ArrowDown size={16} className="inline" />
                                ) : (
                                  <ArrowUpDown size={16} className="text-muted-foreground inline" />
                                )}
                              </Button>
                            ) : null}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            {effectiveLoading ? (
              <TableBody>
                {Array.from({ length: _skeletonRows }).map((_, rIndex) => (
                  <TableRow key={`skeleton-${rIndex}`}>
                    {Array.from({ length: _columnsCount }).map((__, cIndex) => (
                      <TableCell key={`s-${rIndex}-${cIndex}`} className="p-3">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : renderBody ? (
              renderBody(table.getRowModel().rows, table as RTTable<T>)
            ) : (
              <TableBody>
                {table.getRowModel().rows.length ? (
                  renderRow ? (
                    table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.id}>{renderRow(row, table as RTTable<T>)}</React.Fragment>
                    ))
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {onRowSelect ? (
                          <TableCell className="w-10">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={() => {
                                  const prev = table.getState().rowSelection as Record<string, boolean>;
                                  const nextSel = { ...prev };
                                  if (nextSel[row.id]) delete nextSel[row.id];
                                  else nextSel[row.id] = true;
                                  table.setRowSelection(nextSel);
                                }}
                              />
                            </div>
                          </TableCell>
                        ) : null}
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + (onRowSelect ? 1 : 0)} className="h-24 text-center">
                      {renderEmpty ?? "No results."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      {/* Footer: selection + page size on left, pagination right */}
      <div className="flex items-center justify-between gap-2 mt-4">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {isServer
              ? serverTotal ?? data.length
              : table.getFilteredRowModel().rows.length}{" "}
            row(s) selected.
          </div>
          {/* reorder feature removed */}
          <div className="flex items-center gap-2">
            <Label className="text-sm">Rows</Label>
            <Combobox
              items={PAGE_SIZE_OPTIONS.map((n: number) => ({
                value: String(n),
                label: String(n),
              }))}
              value={String(table.getState().pagination.pageSize)}
              onChange={(v) => table.setPageSize(Number(v))}
              placeholder="Page size"
              className="w-24"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Pagination className="flex-1">
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() =>
                    table.getCanPreviousPage() && table.previousPage()
                  }
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </Button>
              </PaginationItem>

              {(() => {
                const current = table.getState().pagination.pageIndex;
                const total = isServer
                  ? Math.max(
                      1,
                      Math.ceil(
                        (serverTotal ?? 0) /
                          table.getState().pagination.pageSize
                      )
                    )
                  : table.getPageCount();
                const windowSize = 5;
                const half = Math.floor(windowSize / 2);
                let start = Math.max(0, current - half);
                const end = Math.min(total - 1, start + windowSize - 1);
                if (end - start + 1 < windowSize)
                  start = Math.max(0, end - (windowSize - 1));
                const pages: number[] = [];
                for (let p = start; p <= end; p++) pages.push(p);
                return pages.map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === current}
                      onClick={() => table.setPageIndex(p)}
                    >
                      {p + 1}
                    </PaginationLink>
                  </PaginationItem>
                ));
              })()}

              <PaginationItem>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.getCanNextPage() && table.nextPage()}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Page jump input */}
          <div className="flex items-center gap-2">
            <PageJumpControl
              table={table}
              totalServer={
                isServer
                  ? Math.max(
                      1,
                      Math.ceil(
                        (serverTotal ?? 0) /
                          table.getState().pagination.pageSize
                      )
                    )
                  : table.getPageCount()
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ColumnDef };
