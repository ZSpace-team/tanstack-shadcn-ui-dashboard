import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const TONE = {
  info: { icon: Info, className: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  success: {
    icon: CircleCheck,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  danger: {
    icon: CircleAlert,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
} as const;

/** Thông báo tại chỗ trong trang (khác toast — không tự biến mất). */
export function Callout({
  tone = "info",
  title,
  children,
  actions,
  className,
}: {
  tone?: keyof typeof TONE;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const config = TONE[tone];
  const Icon = config.icon;

  return (
    <div className={cn("flex gap-3 rounded-xl border px-4 py-3 text-sm", config.className, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-1", "text-foreground/80")}>{children}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-start gap-2">{actions}</div>}
    </div>
  );
}
