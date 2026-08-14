import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Khối nội dung có viền — đơn vị bố cục chính của mọi trang trong CMS.
 * Dùng cho biểu đồ, danh sách ngắn, form, thông tin chi tiết.
 *
 * Ba tầng: header (icon + tiêu đề + nút), thân, và footer cho thanh hành động.
 */
export function SectionCard({
  icon: Icon,
  title,
  description,
  actions,
  footer,
  children,
  padded = true,
  className,
}: {
  /** Icon tròn bên trái tiêu đề — giúp phân biệt nhanh các khối trong trang dài. */
  icon?: LucideIcon;
  title?: string;
  description?: string;
  /** Nút ở góc phải tiêu đề. */
  actions?: ReactNode;
  /** Thanh dưới cùng, nền nhạt — thường chứa nút lưu/huỷ. */
  footer?: ReactNode;
  children: ReactNode;
  /** Tắt padding khi bên trong là bảng tràn viền. */
  padded?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-4.5" />
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-sm font-semibold">{title}</h2>}
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={cn(padded && "px-5 py-4")}>{children}</div>

      {footer && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/40 px-5 py-3">
          {footer}
        </div>
      )}
    </section>
  );
}
