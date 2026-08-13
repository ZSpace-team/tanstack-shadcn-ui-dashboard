/**
 * Class dùng chung cho input/select/textarea thô (không qua component primitive).
 * Giữ mọi ô nhập trong CMS cùng chiều cao và cùng kiểu focus.
 */
export const fieldInputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 md:text-sm";

export const fieldLabelClass = "text-sm font-medium text-foreground/80";

export const fieldHintClass = "text-xs text-muted-foreground";

export const fieldErrorClass = "text-xs font-medium text-destructive";
