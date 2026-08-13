import { createFileRoute } from "@tanstack/react-router";
import { Activity, FileText, Settings2, ShieldCheck } from "lucide-react";
import { useState } from "react";

import Breadcrumb from "@/components/admin/breadcrumb";
import { Callout } from "@/components/admin/callout";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import PageHeader from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { TabPanel, Tabs } from "@/components/admin/tabs";
import { Button } from "@/components/ui/button";
import { MOCK_ACTIVITIES } from "@/data/mock";
import { formatDateTime, formatRelative } from "@/lib/format";

export const Route = createFileRoute("/tabs")({ component: TabsPage });

const TAB_ITEMS = [
  { value: "overview", label: "Tổng quan", icon: FileText },
  { value: "activity", label: "Hoạt động", icon: Activity, count: MOCK_ACTIVITIES.length },
  { value: "security", label: "Bảo mật", icon: ShieldCheck },
  { value: "settings", label: "Tuỳ chọn", icon: Settings2 },
];

/** Trang chi tiết mẫu: tab dạng gạch chân + nội dung riêng cho từng tab. */
function TabsPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="space-y-4">
      <PageHeader
        title="Chi tiết bản ghi"
        description="Bố cục chuẩn cho trang xem một đối tượng cụ thể."
        breadcrumb={
          <Breadcrumb items={[{ label: "Người dùng", to: "/users" }, { label: "Nguyễn Minh Anh" }]} />
        }
        actions={<Button variant="outline">Chỉnh sửa</Button>}
      />

      <Tabs items={TAB_ITEMS} value={tab} onValueChange={setTab} />

      <TabPanel value="overview" activeValue={tab}>
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Thông tin chung">
            <dl className="space-y-3 text-sm">
              {[
                { label: "Họ tên", value: "Nguyễn Minh Anh" },
                { label: "Email", value: "minhanh@example.com" },
                { label: "Vai trò", value: "Quản trị viên" },
                { label: "Phòng ban", value: "Vận hành" },
                { label: "Ngày tạo", value: formatDateTime("2026-01-14T03:20:00Z") },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="text-right font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard title="Trạng thái">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tài khoản</span>
                <StatusBadge status="active" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Xác thực 2 lớp</span>
                <StatusBadge status="pending" label="Chưa bật" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hoạt động cuối</span>
                <span className="font-medium">{formatRelative("2026-08-09T10:00:00Z")}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </TabPanel>

      <TabPanel value="activity" activeValue={tab}>
        <DataTable
          rows={MOCK_ACTIVITIES}
          getRowId={(row) => row.id}
          columns={[
            { key: "actor", label: "Người thực hiện" },
            { key: "action", label: "Hành động" },
            { key: "target", label: "Đối tượng" },
            {
              key: "at",
              label: "Thời điểm",
              align: "end",
              render: (row) => formatDateTime(row.at as string),
            },
          ]}
        />
      </TabPanel>

      <TabPanel value="security" activeValue={tab}>
        <div className="space-y-4">
          <Callout tone="warning" title="Chưa bật xác thực hai lớp">
            Bật 2FA để bảo vệ tài khoản khỏi truy cập trái phép.
          </Callout>
          <SectionCard title="Phiên đăng nhập" padded={false}>
            <EmptyState
              icon={ShieldCheck}
              title="Không có phiên nào khác"
              description="Tài khoản này chỉ đang đăng nhập trên thiết bị hiện tại."
              action={<Button variant="outline">Đăng xuất tất cả thiết bị</Button>}
            />
          </SectionCard>
        </div>
      </TabPanel>

      <TabPanel value="settings" activeValue={tab}>
        <SectionCard title="Tuỳ chọn cá nhân" description="Áp dụng riêng cho tài khoản này.">
          <p className="text-sm text-muted-foreground">
            Đây là chỗ đặt các công tắc cấu hình. Xem trang{" "}
            <span className="font-medium text-foreground">Biểu mẫu</span> để lấy mẫu các loại trường.
          </p>
        </SectionCard>
      </TabPanel>
    </div>
  );
}
