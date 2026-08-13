import { AlertTriangle, Info, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Modal from "./modal";

const TONE = {
  danger: {
    icon: Trash2,
    iconClass: "bg-destructive/15 text-destructive",
    confirmVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-amber-500/15 text-amber-500",
    confirmVariant: "default" as const,
  },
  info: {
    icon: Info,
    iconClass: "bg-sky-500/15 text-sky-500",
    confirmVariant: "default" as const,
  },
};

/**
 * Hộp xác nhận cho hành động khó hoàn tác. Thay cho `window.confirm`
 * để giữ đúng tông giao diện và cho phép hiện trạng thái đang xử lý.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
  tone = "danger",
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: keyof typeof TONE;
  loading?: boolean;
}) {
  const config = TONE[tone];
  const Icon = config.icon;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={config.confirmVariant} onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xử lý..." : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            config.iconClass,
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <p className="pt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </Modal>
  );
}
