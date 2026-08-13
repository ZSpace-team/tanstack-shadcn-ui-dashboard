import { Search, X } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { fieldInputClass, fieldLabelClass } from "./field";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  options: FilterOption[];
  /** Nhãn cho lựa chọn "không lọc". */
  allLabel?: string;
}

export interface FilterBarProps {
  /** Ô tìm kiếm; bỏ `onSearchChange` để ẩn. */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Danh sách bộ lọc dạng select. */
  filters?: FilterDefinition[];
  values?: Record<string, string>;
  onValuesChange?: (values: Record<string, string>) => void;
  /** Nút bên phải: xuất file, thêm mới... */
  actions?: ReactNode;
  className?: string;
}

/**
 * Thanh lọc chuẩn cho trang danh sách: tìm kiếm + các select + chip xoá nhanh.
 * Component không tự lọc dữ liệu — nó chỉ báo giá trị ra ngoài cho trang xử lý.
 */
export function FilterBar({
  search = "",
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  values = {},
  onValuesChange,
  actions,
  className,
}: FilterBarProps) {
  const setValue = (key: string, value: string) => {
    if (!onValuesChange) return;
    const next = { ...values };
    if (value) next[key] = value;
    else delete next[key];
    onValuesChange(next);
  };

  const activeChips = filters
    .map((filter) => {
      const value = values[filter.key];
      if (!value) return null;
      const option = filter.options.find((item) => item.value === value);
      return option ? { key: filter.key, label: `${filter.label}: ${option.label}` } : null;
    })
    .filter((chip): chip is { key: string; label: string } => chip !== null);

  const hasActive = activeChips.length > 0 || search.length > 0;

  return (
    <div className={cn("space-y-3 rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex flex-wrap items-end gap-3">
        {onSearchChange && (
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className={cn(fieldInputClass, "pl-9")}
            />
          </div>
        )}

        {filters.map((filter) => (
          <label key={filter.key} className="space-y-1.5">
            <span className={fieldLabelClass}>{filter.label}</span>
            <select
              value={values[filter.key] ?? ""}
              onChange={(event) => setValue(filter.key, event.target.value)}
              className={cn(fieldInputClass, "w-44")}
            >
              <option value="">{filter.allLabel ?? "Tất cả"}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>

      {hasActive && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Đang lọc:</span>

          {search && (
            <Badge variant="neutral" className="gap-1 py-1">
              Từ khoá: {search}
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                aria-label="Xoá từ khoá"
                className="transition-colors hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {activeChips.map((chip) => (
            <Badge key={chip.key} variant="neutral" className="gap-1 py-1">
              {chip.label}
              <button
                type="button"
                onClick={() => setValue(chip.key, "")}
                aria-label={`Bỏ lọc ${chip.label}`}
                className="transition-colors hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="xs"
            className="ml-1"
            onClick={() => {
              onSearchChange?.("");
              onValuesChange?.({});
            }}
          >
            Xoá tất cả
          </Button>
        </div>
      )}
    </div>
  );
}
