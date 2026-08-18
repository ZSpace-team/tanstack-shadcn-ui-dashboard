import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "neutral" | "success" | "warning" | "destructive" | "outline";

/**
 * Bảng quy đổi trạng thái sang màu. Thêm trạng thái của nghiệp vụ bạn vào đây
 * để mọi bảng trong CMS hiển thị nhất quán.
 */
const STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  active: { label: "Hoạt động", variant: "success" },
  completed: { label: "Hoàn tất", variant: "success" },
  approved: { label: "Đã duyệt", variant: "success" },
  published: { label: "Đã đăng", variant: "success" },

  pending: { label: "Chờ xử lý", variant: "warning" },
  processing: { label: "Đang chạy", variant: "warning" },
  draft: { label: "Bản nháp", variant: "neutral" },
  queued: { label: "Trong hàng đợi", variant: "warning" },

  failed: { label: "Thất bại", variant: "destructive" },
  rejected: { label: "Từ chối", variant: "destructive" },
  disabled: { label: "Vô hiệu hoá", variant: "destructive" },
  banned: { label: "Bị khoá", variant: "destructive" },

  inactive: { label: "Tạm ẩn", variant: "neutral" },
  archived: { label: "Lưu trữ", variant: "neutral" },
};

export function StatusBadge({
  status,
  label,
  size,
  rounded,
}: {
  status: string;
  label?: string;
  /** Chuyển sang cỡ nhỏ khi đứng cạnh chữ nhỏ. */
  size?: "default" | "sm";
  rounded?: "sm" | "md" | "lg" | "full";
}) {
  const config = STATUS_MAP[status];
  return (
    <Badge variant={config?.variant ?? "neutral"} size={size} rounded={rounded}>
      {label ?? config?.label ?? status}
    </Badge>
  );
}

export { STATUS_MAP };
