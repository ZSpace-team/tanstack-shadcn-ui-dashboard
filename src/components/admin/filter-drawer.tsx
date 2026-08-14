import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { Drawer } from "./drawer";

/**
 * Panel lọc nâng cao trượt từ phải — vỏ dùng chung cho mọi trang danh sách.
 * Trang tự dựng các trường bên trong (`FormField` + input tuỳ ý) và giữ
 * state nháp; chỉ khi bấm "Áp dụng" mới đẩy giá trị ra bảng.
 */
export function FilterDrawer({
  open,
  onClose,
  onApply,
  onReset,
  activeCount = 0,
  title = "Bộ lọc nâng cao",
  description = "Kết hợp nhiều điều kiện rồi bấm Áp dụng.",
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  /** Số điều kiện đang áp dụng — hiện cạnh nút "Đặt lại". */
  activeCount?: number;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          <Button variant="ghost" className="mr-auto" onClick={onReset} disabled={activeCount === 0}>
            <RotateCcw className="size-4" />
            Đặt lại{activeCount > 0 && ` (${activeCount})`}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={onApply}>Áp dụng</Button>
        </>
      }
    >
      {/* Bọc form để nhấn Enter trong ô nhập cũng áp dụng bộ lọc. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
        className="space-y-5"
      >
        {children}
      </form>
    </Drawer>
  );
}
