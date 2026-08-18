import { Columns3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ToggleableColumn {
  key: string;
  label: string;
  /** Cột định danh — luôn hiển thị, không cho tắt. */
  locked?: boolean;
}

/**
 * Chọn cột hiển thị cho bảng. Component không tự lọc cột: nó báo danh sách
 * khoá đang bật ra ngoài, trang tự lọc mảng `columns` trước khi đưa vào `DataTable`.
 */
export function ColumnToggle({
  columns,
  visible,
  onVisibleChange,
  label = "Cột",
}: {
  columns: ToggleableColumn[];
  /** Khoá của các cột đang hiện. */
  visible: string[];
  onVisibleChange: (visible: string[]) => void;
  label?: string;
}) {
  const toggleable = columns.filter((column) => !column.locked);
  const hiddenCount = toggleable.filter((column) => !visible.includes(column.key)).length;

  const toggle = (key: string, checked: boolean) => {
    onVisibleChange(checked ? [...visible, key] : visible.filter((item) => item !== key));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="lg" />}>
        <Columns3 className="size-4" />
        {label}
        {hiddenCount > 0 && (
          <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] leading-none font-semibold tabular-nums">
            {toggleable.length - hiddenCount}/{toggleable.length}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-card">
        {/* GroupLabel của Base UI bắt buộc nằm trong Menu.Group. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Cột hiển thị</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.key}
              checked={column.locked || visible.includes(column.key)}
              disabled={column.locked}
              onCheckedChange={(checked) => toggle(column.key, checked)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}

          {hiddenCount > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onVisibleChange(columns.map((column) => column.key))}>
                Hiện tất cả
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
