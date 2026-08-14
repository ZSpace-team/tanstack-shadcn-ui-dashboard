import { cn } from "@/lib/utils";

import { fieldInputClass } from "./field";

/** Input ngày/giờ dùng bộ chọn sẵn có của trình duyệt — không cần thư viện ngoài. */
const dateInputClass = cn(
  fieldInputClass,
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 dark:[&::-webkit-calendar-picker-indicator]:invert",
);

export function DateField({
  id,
  value,
  onChange,
  withTime = false,
  min,
  max,
  className,
}: {
  id?: string;
  /** `yyyy-MM-dd`, hoặc `yyyy-MM-ddTHH:mm` khi bật `withTime`. */
  value: string;
  onChange: (value: string) => void;
  withTime?: boolean;
  min?: string;
  max?: string;
  className?: string;
}) {
  return (
    <input
      id={id}
      type={withTime ? "datetime-local" : "date"}
      value={value}
      min={min}
      max={max}
      onChange={(event) => onChange(event.target.value)}
      className={cn(dateInputClass, className)}
    />
  );
}

export interface DateRange {
  from: string;
  to: string;
}

/**
 * Khoảng thời gian "từ — đến". Mỗi ô tự giới hạn theo ô còn lại nên
 * không chọn được khoảng ngược.
 */
export function DateRangeField({
  id,
  value,
  onChange,
  withTime = false,
  className,
}: {
  id?: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
  withTime?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DateField
        id={id}
        value={value.from}
        max={value.to || undefined}
        withTime={withTime}
        onChange={(from) => onChange({ ...value, from })}
      />
      <span className="shrink-0 text-sm text-muted-foreground">—</span>
      <DateField
        value={value.to}
        min={value.from || undefined}
        withTime={withTime}
        onChange={(to) => onChange({ ...value, to })}
      />
    </div>
  );
}
