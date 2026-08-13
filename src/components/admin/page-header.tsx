import type { ReactNode } from "react";

export default function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  /** Nút hành động chính, đặt bên phải. */
  actions?: ReactNode;
  /** Đặt <Breadcrumb /> ở đây nếu trang nằm sâu trong cây điều hướng. */
  breadcrumb?: ReactNode;
}) {
  return (
    <div className="mb-6 space-y-3">
      {breadcrumb}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
