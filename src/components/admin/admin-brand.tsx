import { Tags } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Logo + tên hệ thống. Đổi `name`, `subtitle`, `icon` là xong phần nhận diện.
 */
export default function AdminBrand({
  name = "Admin Template",
  subtitle = "Trung tâm quản trị",
  icon: Icon = Tags,
  compact = false,
  showSubtitle = true,
  className,
}: {
  name?: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Ẩn phần chữ trên desktop khi sidebar thu gọn. */
  compact?: boolean;
  showSubtitle?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand text-brand-foreground shadow-sm">
        <Icon className="size-[1.125rem]" strokeWidth={2.2} />
      </span>
      <span className={cn("min-w-0", compact && "lg:hidden")}>
        <span className="block truncate text-sm font-bold tracking-tight">{name}</span>
        {showSubtitle && (
          <span className="block truncate text-xs leading-4 text-muted-foreground">{subtitle}</span>
        )}
      </span>
    </div>
  );
}
