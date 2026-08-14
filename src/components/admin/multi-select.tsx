import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { fieldInputClass } from "./field";

export interface MultiSelectOption {
  value: string;
  label: string;
}

/**
 * Select chọn nhiều — trigger rộng bằng ô nhập, danh sách là các checkbox.
 * Không tự giữ state: trang truyền `value` và nhận lại qua `onValueChange`.
 */
export function MultiSelect({
  id,
  options,
  value,
  onValueChange,
  placeholder = "Chọn...",
  className,
}: {
  id?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const selected = options.filter((option) => value.includes(option.value));

  const toggle = (optionValue: string, checked: boolean) => {
    onValueChange(
      checked ? [...value, optionValue] : value.filter((item) => item !== optionValue),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            id={id}
            className={cn(fieldInputClass, "flex items-center gap-2 text-left", className)}
          />
        }
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            selected.length === 0 && "text-muted-foreground",
          )}
        >
          {selected.length === 0 ? placeholder : selected.map((item) => item.label).join(", ")}
        </span>
        {selected.length > 0 && (
          <span className="shrink-0 rounded-full bg-muted px-1.5 text-xs font-semibold tabular-nums">
            {selected.length}
          </span>
        )}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="max-h-72 bg-card p-1">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => toggle(option.value, checked)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}

        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onValueChange([])}>Bỏ chọn tất cả</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
