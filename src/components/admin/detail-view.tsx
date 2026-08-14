import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface DetailItem {
  label: string;
  /** Chuỗi, số, hoặc bất kỳ node nào — badge, link, nút nhỏ... */
  value: ReactNode;
  hint?: string;
}

export interface DetailGroup {
  /** Tiêu đề nhóm; bỏ trống nếu chỉ có một nhóm duy nhất. */
  title?: string;
  items: DetailItem[];
}

/**
 * Tên mã của từng kiểu hiển thị chi tiết — gọi thẳng khi cần:
 *
 * - `grid`   Bảng thuộc tính: khung viền, cột nhãn nền nhạt. Dễ đọc khi nhiều trường.
 * - `rows`   Nhãn trái / giá trị phải, chỉ ngăn bằng đường kẻ. Hợp panel hẹp, drawer.
 * - `cards`  Mỗi trường một ô nhỏ, nhãn trên giá trị dưới. Hợp phần tóm tắt đầu trang.
 * - `inline` Nhãn và giá trị xếp dọc trong lưới, không viền. Hợp khối gọn trong card.
 */
export type DetailVariant = "grid" | "rows" | "cards" | "inline";

const GROUP_TITLE_CLASS = "mb-2 text-sm font-semibold";
const EMPTY = "—";

/**
 * Hiển thị thông tin chi tiết của một bản ghi theo bốn kiểu dựng sẵn.
 * Đổi kiểu chỉ bằng prop `variant`, dữ liệu giữ nguyên.
 */
export function DetailView({
  groups,
  variant = "grid",
  columns = 2,
  className,
}: {
  groups: DetailGroup[];
  variant?: DetailVariant;
  /** Số cột cho kiểu `cards` và `inline`. */
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group, index) => (
        <section key={group.title ?? index}>
          {group.title && <h3 className={GROUP_TITLE_CLASS}>{group.title}</h3>}
          <DetailGroupBody group={group} variant={variant} columns={columns} />
        </section>
      ))}
    </div>
  );
}

function DetailGroupBody({
  group,
  variant,
  columns,
}: {
  group: DetailGroup;
  variant: DetailVariant;
  columns: 1 | 2 | 3;
}) {
  const gridColumns = cn(
    "grid gap-3",
    columns === 2 && "sm:grid-cols-2",
    columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
  );

  if (variant === "rows") {
    return (
      <dl className="divide-y divide-border text-sm">
        {group.items.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-4 py-2.5">
            <dt className="text-muted-foreground">
              {item.label}
              {item.hint && (
                <span className="block text-xs text-muted-foreground/80">{item.hint}</span>
              )}
            </dt>
            <dd className="text-right font-medium">{item.value ?? EMPTY}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (variant === "cards") {
    return (
      <dl className={gridColumns}>
        {group.items.map((item) => (
          <div key={item.label} className="rounded-lg border border-border px-3 py-2.5">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium">{item.value ?? EMPTY}</dd>
            {item.hint && <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>}
          </div>
        ))}
      </dl>
    );
  }

  if (variant === "inline") {
    return (
      <dl className={gridColumns}>
        {group.items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="mt-0.5 text-sm font-medium">{item.value ?? EMPTY}</dd>
            {item.hint && <p className="mt-0.5 text-xs text-muted-foreground">{item.hint}</p>}
          </div>
        ))}
      </dl>
    );
  }

  // grid — bảng thuộc tính: cột nhãn nền nhạt, mỗi trường một dòng có viền.
  return (
    <dl className="overflow-hidden rounded-lg border border-border text-sm">
      {group.items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-[minmax(9rem,34%)_1fr]",
            index > 0 && "border-t border-border",
          )}
        >
          <dt className="bg-muted/40 px-4 py-2.5 text-muted-foreground">
            {item.label}
            {item.hint && (
              <span className="block text-xs text-muted-foreground/80">{item.hint}</span>
            )}
          </dt>
          <dd className="px-4 py-2.5 font-medium">{item.value ?? EMPTY}</dd>
        </div>
      ))}
    </dl>
  );
}
