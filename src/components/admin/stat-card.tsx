import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const VALUE_TONE = {
  default: "text-foreground",
  brand: "text-brand",
  rose: "text-rose-500",
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  sky: "text-sky-500",
} as const;

const ICON_TONE = {
  default: "bg-muted text-muted-foreground",
  brand: "bg-brand/15 text-brand",
  rose: "bg-rose-500/15 text-rose-500",
  emerald: "bg-emerald-500/15 text-emerald-500",
  amber: "bg-amber-500/15 text-amber-500",
  sky: "bg-sky-500/15 text-sky-500",
} as const;

export type StatTone = keyof typeof VALUE_TONE;

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
  /** Phần trăm thay đổi so với kỳ trước; số âm hiển thị mũi tên xuống. */
  trend,
  trendLabel = "so với kỳ trước",
  className,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: StatTone;
  hint?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
}) {
  const up = (trend ?? 0) >= 0;

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className={cn("mt-1.5 text-2xl font-bold tabular-nums", VALUE_TONE[tone])}>{value}</p>

          {trend !== undefined && (
            <p className="mt-1.5 flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  up ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {up ? "+" : ""}
                {trend}%
              </span>
              <span className="truncate text-muted-foreground">{trendLabel}</span>
            </p>
          )}

          {hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>

        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", ICON_TONE[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
