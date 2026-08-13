import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  /** Số hiển thị bên cạnh nhãn. */
  count?: number | string;
  disabled?: boolean;
}

/**
 * Tabs điều khiển từ ngoài (controlled) — không tự giữ state, để trang quyết định
 * (đọc từ URL search param, từ props hay từ useState đều được).
 *
 * `variant="line"` cho tab chính của trang, `variant="pill"` cho bộ lọc phụ.
 */
export function Tabs({
  items,
  value,
  onValueChange,
  variant = "line",
  className,
}: {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  variant?: "line" | "pill";
  className?: string;
}) {
  if (variant === "pill") {
    return (
      <div
        role="tablist"
        className={cn(
          "inline-flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/50 p-1",
          className,
        )}
      >
        {items.map((item) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={item.disabled}
              onClick={() => onValueChange(item.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon && <item.icon className="size-4" />}
              {item.label}
              {item.count !== undefined && (
                <span className="text-xs text-muted-foreground tabular-nums">({item.count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="tablist" className={cn("flex gap-1 overflow-x-auto border-b border-border", className)}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {item.icon && <item.icon className="size-4" />}
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                  active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Vùng nội dung của một tab; chỉ render khi tab đang được chọn. */
export function TabPanel({
  value,
  activeValue,
  children,
  className,
}: {
  value: string;
  activeValue: string;
  children: ReactNode;
  className?: string;
}) {
  if (value !== activeValue) return null;
  return (
    <div role="tabpanel" className={cn("pt-5", className)}>
      {children}
    </div>
  );
}
