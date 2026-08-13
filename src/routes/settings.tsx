import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { fieldInputClass } from "@/components/admin/field";
import { FormActions, FormField, FormRow, FormSection, FormSelect } from "@/components/admin/form";
import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const TOGGLES = [
  {
    key: "maintenance",
    label: "Chế độ bảo trì",
    description: "Chặn người dùng cuối truy cập trong lúc nâng cấp.",
    defaultValue: false,
  },
  {
    key: "registration",
    label: "Cho phép đăng ký",
    description: "Người dùng mới có thể tự tạo tài khoản.",
    defaultValue: true,
  },
  {
    key: "audit",
    label: "Ghi nhật ký chi tiết",
    description: "Lưu cả dữ liệu trước và sau mỗi thay đổi.",
    defaultValue: true,
  },
];

/** Trang cấu hình — form dài chia nhóm, có thanh nút dính đáy. */
function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map((item) => [item.key, item.defaultValue])),
  );

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Cấu hình hệ thống" description="Thiết lập áp dụng cho toàn bộ CMS." />

      <div className="rounded-xl border border-border bg-card px-4 py-2 sm:px-6">
        <FormSection title="Thông tin chung" description="Hiển thị trên giao diện và email gửi đi.">
          <FormRow>
            <FormField label="Tên hệ thống" htmlFor="site-name">
              <Input id="site-name" defaultValue="Admin Template" className={fieldInputClass} />
            </FormField>
            <FormField label="Email liên hệ" htmlFor="site-email">
              <Input
                id="site-email"
                type="email"
                defaultValue="support@example.com"
                className={fieldInputClass}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Múi giờ" htmlFor="timezone">
              <FormSelect id="timezone" defaultValue="Asia/Ho_Chi_Minh">
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                <option value="UTC">UTC</option>
              </FormSelect>
            </FormField>
            <FormField label="Ngôn ngữ mặc định" htmlFor="locale">
              <FormSelect id="locale" defaultValue="vi">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </FormSelect>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Vận hành" description="Bật/tắt các hành vi của hệ thống.">
          <div className="space-y-3">
            {TOGGLES.map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 rounded-lg border border-border p-3"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.description}</span>
                </span>
                <Switch
                  checked={toggles[item.key] ?? false}
                  onCheckedChange={(value) =>
                    setToggles((current) => ({ ...current, [item.key]: value }))
                  }
                  aria-label={item.label}
                />
              </label>
            ))}
          </div>
        </FormSection>

        <FormActions align="between" sticky>
          <span className="text-xs text-muted-foreground">
            Thay đổi áp dụng ngay sau khi lưu.
          </span>
          <div className="flex gap-2">
            <Button variant="outline">Khôi phục mặc định</Button>
            <Button onClick={() => toast.success("Đã lưu cấu hình (giả lập).")}>Lưu thay đổi</Button>
          </div>
        </FormActions>
      </div>
    </div>
  );
}
