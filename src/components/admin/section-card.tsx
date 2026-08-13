import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Khối nội dung có viền — đơn vị bố cục chính của mọi trang trong CMS.
 * Dùng cho biểu đồ, danh sách ngắn, form nhỏ, thông tin chi tiết.
 */
export function SectionCard({
  title,
  description,
  actions,
  footer,
  children,
  padded = true,
  className,
}: {
  title?: string;
  description?: string;
  /** Nút ở góc phải tiêu đề. */
  actions?: ReactNode;
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
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={cn(padded && "px-5 py-4")}>{children}</div>

      {footer && <div className="border-t border-border px-5 py-3">{footer}</div>}
    </section>
  );
}
