import { Check, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type PipelineStatus = "done" | "current" | "todo" | "error";

export interface PipelineStep {
  key: string;
  label: string;
  description?: string;
  /** Mặc định `todo`. */
  status?: PipelineStatus;
  /** Mốc thời gian hiển thị ở kiểu `timeline`. */
  at?: string;
}

/**
 * Tên mã của từng kiểu hiển thị tiến trình:
 *
 * - `steps`    Vòng tròn đánh số nối bằng gạch ngang — quy trình nhiều bước có tên.
 * - `chevron`  Chip nối bằng mũi tên — luồng trạng thái ngắn, đặt trong header.
 * - `bar`      Thanh chia đoạn + đếm bước — hợp chỗ hẹp, cột phụ.
 * - `timeline` Mốc dọc kèm mô tả và thời gian — nhật ký xử lý một bản ghi.
 */
export type PipelineVariant = "steps" | "chevron" | "bar" | "timeline";

const DOT = {
  done: "border-transparent bg-brand text-brand-foreground",
  current: "border-brand bg-brand/10 text-brand",
  todo: "border-border bg-muted text-muted-foreground",
  error: "border-transparent bg-destructive text-white",
} satisfies Record<PipelineStatus, string>;

const LABEL = {
  done: "text-foreground",
  current: "text-foreground font-semibold",
  todo: "text-muted-foreground",
  error: "text-destructive font-semibold",
} satisfies Record<PipelineStatus, string>;

const CHIP = {
  done: "border-transparent bg-brand/10 text-brand",
  current: "border-brand/40 bg-brand text-brand-foreground",
  todo: "border-border bg-muted text-muted-foreground",
  error: "border-transparent bg-destructive/10 text-destructive",
} satisfies Record<PipelineStatus, string>;

const SEGMENT = {
  done: "bg-brand",
  current: "bg-brand/50",
  todo: "bg-muted",
  error: "bg-destructive",
} satisfies Record<PipelineStatus, string>;

/** Tiến trình xử lý theo bước — cùng dữ liệu, đổi hình dạng bằng `variant`. */
export function Pipeline({
  steps,
  variant = "steps",
  className,
}: {
  steps: PipelineStep[];
  variant?: PipelineVariant;
  className?: string;
}) {
  if (variant === "chevron") {
    return (
      <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
        {steps.map((step, index) => (
          <span key={step.key} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap",
                CHIP[step.status ?? "todo"],
              )}
            >
              {step.status === "done" && <Check className="size-3" />}
              {step.status === "error" && <X className="size-3" />}
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
            )}
          </span>
        ))}
      </div>
    );
  }

  if (variant === "bar") {
    const doneCount = steps.filter((step) => step.status === "done").length;
    const current = steps.find((step) => step.status === "current") ?? steps[doneCount];

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-medium">{current?.label ?? "Hoàn tất"}</span>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {Math.min(doneCount + (current ? 1 : 0), steps.length)}/{steps.length}
          </span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <span
              key={step.key}
              title={step.label}
              className={cn("h-1.5 flex-1 rounded-full", SEGMENT[step.status ?? "todo"])}
            />
          ))}
        </div>
        {current?.description && (
          <p className="text-xs text-muted-foreground">{current.description}</p>
        )}
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <ol className={cn("space-y-0", className)}>
        {steps.map((step, index) => {
          const status = step.status ?? "todo";
          return (
            <li key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                    DOT[status],
                  )}
                >
                  {status === "done" ? (
                    <Check className="size-3.5" />
                  ) : status === "error" ? (
                    <X className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                {index < steps.length - 1 && (
                  <span
                    className={cn(
                      "w-px flex-1",
                      status === "done" ? "bg-brand/40" : "bg-border",
                    )}
                  />
                )}
              </div>

              <div className={cn("min-w-0 pb-5", index === steps.length - 1 && "pb-0")}>
                <p className={cn("text-sm", LABEL[status])}>{step.label}</p>
                {step.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
                )}
                {step.at && <p className="mt-1 text-xs text-muted-foreground">{step.at}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  // steps — vòng tròn đánh số nối bằng gạch ngang.
  return (
    <ol className={cn("flex min-w-0 items-start gap-2 overflow-x-auto", className)}>
      {steps.map((step, index) => {
        const status = step.status ?? "todo";
        return (
          <li key={step.key} className="flex min-w-0 flex-1 items-start gap-2">
            <div className="flex min-w-24 flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  DOT[status],
                )}
              >
                {status === "done" ? (
                  <Check className="size-4" />
                ) : status === "error" ? (
                  <X className="size-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span className={cn("text-xs leading-4", LABEL[status])}>{step.label}</span>
              {step.description && (
                <span className="text-[11px] leading-4 text-muted-foreground">
                  {step.description}
                </span>
              )}
            </div>

            {index < steps.length - 1 && (
              <span
                className={cn(
                  "mt-4 h-px min-w-6 flex-1",
                  status === "done" ? "bg-brand/40" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
