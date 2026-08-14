import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface ChoiceOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

const COLUMNS = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

/** Nhóm checkbox — chọn nhiều giá trị, hiển thị hết lựa chọn (khác `MultiSelect` dạng thu gọn). */
export function CheckboxGroup({
  options,
  value,
  onValueChange,
  columns = 2,
  className,
}: {
  options: ChoiceOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  const toggle = (optionValue: string, checked: boolean) => {
    onValueChange(
      checked ? [...value, optionValue] : value.filter((item) => item !== optionValue),
    );
  };

  return (
    <div className={cn("grid gap-x-4 gap-y-2.5", COLUMNS[columns], className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-start gap-2.5 text-sm",
            option.disabled ? "opacity-50" : "cursor-pointer",
          )}
        >
          <Checkbox
            checked={value.includes(option.value)}
            disabled={option.disabled}
            onCheckedChange={(checked) => toggle(option.value, checked === true)}
            className="mt-0.5"
          />
          <span className="min-w-0">
            <span className="block">{option.label}</span>
            {option.hint && (
              <span className="block text-xs text-muted-foreground">{option.hint}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}

/** Nhóm radio — chọn đúng một giá trị. `name` phải là duy nhất trong trang. */
export function RadioGroup({
  name,
  options,
  value,
  onValueChange,
  columns = 1,
  className,
}: {
  name: string;
  options: ChoiceOption[];
  value: string;
  onValueChange: (value: string) => void;
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      className={cn("grid gap-x-4 gap-y-2.5", COLUMNS[columns], className)}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-start gap-2.5 text-sm",
            option.disabled ? "opacity-50" : "cursor-pointer",
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onValueChange(option.value)}
            className="mt-0.5 size-4 shrink-0 accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <span className="min-w-0">
            <span className="block">{option.label}</span>
            {option.hint && (
              <span className="block text-xs text-muted-foreground">{option.hint}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
