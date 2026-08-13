import { createFileRoute } from "@tanstack/react-router";
import { Bell, Copy, Download, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Callout } from "@/components/admin/callout";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Drawer } from "@/components/admin/drawer";
import { EmptyState } from "@/components/admin/empty-state";
import { fieldInputClass } from "@/components/admin/field";
import Modal from "@/components/admin/modal";
import PageHeader from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Tabs } from "@/components/admin/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/components")({ component: ComponentsPage });

const BUTTON_VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const BADGE_VARIANTS = ["default", "neutral", "success", "warning", "destructive", "outline"] as const;

/** Thư viện component — nơi xem nhanh mọi biến thể trước khi dùng. */
function ComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(true);
  const [pillTab, setPillTab] = useState("day");

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <PageHeader
          title="Thư viện component"
          description="Mọi thành phần có sẵn trong template và các biến thể của chúng."
        />

        <SectionCard title="Button" description="6 biến thể × 4 kích thước, kèm dạng chỉ icon.">
          <div className="space-y-4">
            {BUTTON_VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-2">
                <span className="w-24 shrink-0 text-xs text-muted-foreground">{variant}</span>
                {BUTTON_SIZES.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {size}
                  </Button>
                ))}
              </div>
            ))}

            <Separator />

            <div className="flex flex-wrap items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">có icon</span>
              <Button>
                <Plus className="size-4" />
                Thêm mới
              </Button>
              <Button variant="outline">
                <Download className="size-4" />
                Tải xuống
              </Button>
              <Button variant="destructive">
                <Trash2 className="size-4" />
                Xoá
              </Button>
              <Button size="icon" variant="outline" aria-label="Sao chép">
                <Copy />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="Yêu thích">
                <Star />
              </Button>
              <Button disabled>Vô hiệu hoá</Button>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Badge & trạng thái">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {BADGE_VARIANTS.map((variant) => (
                  <Badge key={variant} variant={variant}>
                    {variant}
                  </Badge>
                ))}
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {["active", "pending", "processing", "failed", "draft", "archived"].map((status) => (
                  <StatusBadge key={status} status={status} />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Trường nhập">
            <div className="space-y-3">
              <Input placeholder="Ô nhập thường" className={fieldInputClass} />
              <Input placeholder="Đang lỗi" aria-invalid className={fieldInputClass} />
              <Input placeholder="Vô hiệu hoá" disabled className={fieldInputClass} />
              <Textarea placeholder="Ô nhập nhiều dòng" className="min-h-20 rounded-lg px-3 py-2 text-sm" />
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
                  Checkbox
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={switched} onCheckedChange={setSwitched} aria-label="Công tắc" />
                  Switch
                </label>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Thông báo tại chỗ">
          <div className="space-y-3">
            <Callout tone="info" title="Thông tin">
              Dùng cho ghi chú, hướng dẫn hoặc trạng thái trung tính.
            </Callout>
            <Callout tone="success" title="Thành công">
              Thao tác đã hoàn tất.
            </Callout>
            <Callout tone="warning" title="Cần chú ý">
              Có điều kiện chưa thoả mãn nhưng chưa chặn thao tác.
            </Callout>
            <Callout
              tone="danger"
              title="Lỗi"
              actions={
                <Button variant="outline" size="sm">
                  Thử lại
                </Button>
              }
            >
              Không kết nối được máy chủ.
            </Callout>
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Lớp phủ" description="Modal, drawer và hộp xác nhận.">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                Mở Modal
              </Button>
              <Button variant="outline" onClick={() => setDrawerOpen(true)}>
                Mở Drawer
              </Button>
              <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                Hộp xác nhận
              </Button>
              <Button variant="outline" onClick={() => toast.success("Đây là toast thành công.")}>
                <Bell className="size-4" />
                Toast
              </Button>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline">Tooltip</Button>} />
                <TooltipContent>Chú thích ngắn cho nút này</TooltipContent>
              </Tooltip>
            </div>
          </SectionCard>

          <SectionCard title="Tabs & tải dữ liệu">
            <div className="space-y-4">
              <Tabs
                variant="pill"
                items={[
                  { value: "day", label: "Ngày" },
                  { value: "week", label: "Tuần" },
                  { value: "month", label: "Tháng" },
                ]}
                value={pillTab}
                onValueChange={setPillTab}
              />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Trạng thái rỗng" padded={false}>
          <EmptyState
            title="Chưa có dữ liệu"
            description="Hiển thị khi danh sách trống hoặc bộ lọc không khớp bản ghi nào."
            action={
              <Button>
                <Plus className="size-4" />
                Tạo bản ghi đầu tiên
              </Button>
            }
          />
        </SectionCard>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Tiêu đề modal"
          description="Mô tả ngắn giải thích mục đích của hộp thoại."
          footer={
            <>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Huỷ
              </Button>
              <Button onClick={() => setModalOpen(false)}>Đồng ý</Button>
            </>
          }
        >
          <p className="text-sm text-muted-foreground">
            Nội dung modal đặt ở đây — thường là form ngắn hoặc thông tin cần xác nhận.
          </p>
        </Modal>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Panel chi tiết"
          description="Trượt từ phải, phù hợp xem nhanh mà không rời danh sách."
          footer={<Button onClick={() => setDrawerOpen(false)}>Đóng</Button>}
        >
          <p className="text-sm text-muted-foreground">
            Đặt thông tin chi tiết hoặc form phụ ở đây.
          </p>
        </Drawer>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Xoá bản ghi này?"
          description="Hành động không thể hoàn tác."
          onConfirm={() => {
            setConfirmOpen(false);
            toast.success("Đã xoá (giả lập).");
          }}
        />
      </div>
    </TooltipProvider>
  );
}
