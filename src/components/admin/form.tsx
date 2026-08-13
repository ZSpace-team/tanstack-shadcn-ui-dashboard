import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { fieldErrorClass, fieldHintClass, fieldInputClass, fieldLabelClass } from "./field";

/**
 * Khối form có tiêu đề — dùng để chia biểu mẫu dài thành từng nhóm.
 * Trên màn rộng: mô tả nằm cột trái, các trường nằm cột phải.
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-6 border-b border-border py-6 first:pt-0 last:border-0 last:pb-0 lg:grid-cols-[16rem_1fr] lg:gap-10",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="min-w-0 space-y-5">{children}</div>
    </section>
  );
}

/** Xếp các trường thành lưới; mặc định 2 cột trên màn vừa trở lên. */
export function FormRow({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Bọc một trường nhập: nhãn, mô tả, thông báo lỗi và dấu bắt buộc.
 * Nhận bất kỳ input nào làm children — Input, Textarea, select thô...
 */
export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className={cn(fieldLabelClass, "block")}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {error ? (
        <p className={fieldErrorClass}>{error}</p>
      ) : hint ? (
        <p className={fieldHintClass}>{hint}</p>
      ) : null}
    </div>
  );
}

/** Select thô dùng chung style với input. */
export function FormSelect({
  className,
  ...props
}: React.ComponentProps<"select"> & { className?: string }) {
  return <select className={cn(fieldInputClass, className)} {...props} />;
}

/** Thanh nút ở cuối form, dính đáy khi form dài. */
export function FormActions({
  children,
  align = "end",
  sticky = false,
  className,
}: {
  children: ReactNode;
  align?: "start" | "end" | "between";
  sticky?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-border pt-5",
        align === "end" && "justify-end",
        align === "between" && "justify-between",
        sticky && "sticky bottom-0 -mx-4 bg-card/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
