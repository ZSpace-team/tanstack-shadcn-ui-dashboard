import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 border font-medium whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        neutral: "border-border bg-muted text-muted-foreground",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        warning: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
        destructive: "border-transparent bg-destructive/15 text-destructive",
        outline: "border-border text-foreground",
      },
      size: {
        /** Cao 22px — dùng trong bảng, danh sách. */
        default: "px-1.5 py-0.5 text-[11px] leading-4 [&_svg]:size-3",
        /** Cao 16px — nhãn phụ đi kèm tiêu đề, chip trong ô hẹp. */
        sm: "px-1.5 py-0 text-[10px] leading-[0.875rem] [&_svg]:size-2.5",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default", rounded: "md" },
  },
);

function Badge({
  className,
  variant,
  size,
  rounded,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, rounded, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
