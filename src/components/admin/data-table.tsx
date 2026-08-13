import { ArrowDown, ArrowUp, ChevronsUpDown, Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  key: string;
  label: string;
  /** Tự vẽ ô; mặc định lấy `row[key]`. */
  render?: (row: T, index: number) => ReactNode;
  /** Bật sắp xếp cho cột này. */
  sortable?: boolean;
  /** Căn phải cho số liệu, căn giữa cho trạng thái. */
  align?: "start" | "center" | "end";
  /** Class thêm cho cả cột (vd "w-40", "hidden md:table-cell"). */
  className?: string;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  /** Khoá duy nhất mỗi dòng — bắt buộc khi bật chọn dòng. */
  getRowId?: (row: T, index: number) => string;
  loading?: boolean;
  /** Số dòng skeleton khi đang tải. */
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  /** Sắp xếp do component cha giữ (server-side hoặc client-side đều được). */
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  /** Bật cột checkbox chọn dòng. */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  /** Thanh công cụ hiện lên khi có dòng được chọn. */
  bulkActions?: ReactNode;
  className?: string;
}

const ALIGN_CLASS = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
} as const;

export function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  getRowId = (_row, index) => String(index),
  loading = false,
  skeletonRows = 5,
  emptyTitle = "Chưa có dữ liệu",
  emptyDescription = "Dữ liệu sẽ hiện ở đây khi có bản ghi đầu tiên.",
  emptyAction,
  sort,
  onSortChange,
  selectable = false,
  selectedIds = [],
  onSelectedIdsChange,
  onRowClick,
  bulkActions,
  className,
}: DataTableProps<T>) {
  const ids = rows.map((row, index) => getRowId(row, index));
  const selected = new Set(selectedIds);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const someSelected = ids.some((id) => selected.has(id)) && !allSelected;

  const toggleAll = () => {
    if (!onSelectedIdsChange) return;
    onSelectedIdsChange(allSelected ? [] : ids);
  };

  const toggleOne = (id: string) => {
    if (!onSelectedIdsChange) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedIdsChange([...next]);
  };

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    const direction: SortDirection =
      sort?.key === key && sort.direction === "desc" ? "asc" : "desc";
    onSortChange({ key, direction });
  };

  const columnCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      {selectable && selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          <span className="text-sm font-medium">Đã chọn {selectedIds.length} dòng</span>
          <div className="ml-auto flex items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {loading ? (
        <div className="divide-y divide-border/60">
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-5" />
          </span>
          <p className="text-sm font-semibold">{emptyTitle}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="text-sm tabular-nums">
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="h-11 w-10 px-4">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Chọn tất cả"
                    />
                  </TableHead>
                )}
                {columns.map((column) => {
                  const active = sort?.key === column.key;
                  return (
                    <TableHead
                      key={column.key}
                      className={cn(
                        "h-11 px-4 text-sm font-semibold",
                        ALIGN_CLASS[column.align ?? "start"],
                        column.className,
                      )}
                    >
                      {column.sortable && onSortChange ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className={cn(
                            "inline-flex items-center gap-1 transition-colors hover:text-foreground",
                            active ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {column.label}
                          {active ? (
                            sort.direction === "asc" ? (
                              <ArrowUp className="size-3.5" />
                            ) : (
                              <ArrowDown className="size-3.5" />
                            )
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row, index) => {
                const id = getRowId(row, index);
                return (
                  <TableRow
                    key={id}
                    data-state={selected.has(id) ? "selected" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? "cursor-pointer" : undefined}
                  >
                    {selectable && (
                      <TableCell className="w-10 px-4" onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                          checked={selected.has(id)}
                          onCheckedChange={() => toggleOne(id)}
                          aria-label={`Chọn dòng ${index + 1}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          "px-4 py-3",
                          ALIGN_CLASS[column.align ?? "start"],
                          column.className,
                        )}
                      >
                        {column.render
                          ? column.render(row, index)
                          : ((row[column.key] as ReactNode) ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Giữ số cột ổn định cho công cụ đọc màn hình khi bảng rỗng. */}
      <span className="sr-only">{columnCount} cột</span>
    </div>
  );
}
