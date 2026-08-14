import { createFileRoute } from "@tanstack/react-router";
import { Activity, FileText, LayoutList, Settings2, ShieldCheck } from "lucide-react";
import { useState } from "react";

import Breadcrumb from "@/components/admin/breadcrumb";
import { Callout } from "@/components/admin/callout";
import { DataTable } from "@/components/admin/data-table";
import { DetailView, type DetailGroup, type DetailVariant } from "@/components/admin/detail-view";
import { EmptyState } from "@/components/admin/empty-state";
import PageHeader from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { TabPanel, Tabs } from "@/components/admin/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_ACTIVITIES } from "@/data/mock";
import { formatDateTime, formatRelative } from "@/lib/format";

export const Route = createFileRoute("/tabs")({ component: TabsPage });

const TAB_ITEMS = [
  { value: "overview", label: "Tổng quan", icon: FileText },
  { value: "views", label: "Kiểu hiển thị", icon: LayoutList },
  { value: "activity", label: "Hoạt động", icon: Activity, count: MOCK_ACTIVITIES.length },
  { value: "security", label: "Bảo mật", icon: ShieldCheck },
  { value: "settings", label: "Tuỳ chọn", icon: Settings2 },
];

/** Dữ liệu chi tiết mẫu, dùng lại cho mọi kiểu hiển thị bên dưới. */
const DETAIL_GROUPS: DetailGroup[] = [
  {
    title: "Thông tin cơ bản",
    items: [
      { label: "Họ tên", value: "Nguyễn Minh Anh" },
      { label: "Email", value: "minhanh@example.com" },
      { label: "Vai trò", value: "Quản trị viên" },
      { label: "Phòng ban", value: "Vận hành" },
    ],
  },
  {
    title: "Cấu hình",
    items: [
      { label: "Phân quyền", value: <Badge variant="neutral">Toàn quyền</Badge> },
      { label: "Xác thực 2 lớp", value: <StatusBadge status="pending" label="Chưa bật" /> },
      { label: "Thời gian giữ phiên", value: "30 phút" },
      { label: "Nhận email hệ thống", value: <Badge variant="success">Có</Badge> },
    ],
  },
  {
    title: "Thông tin hệ thống",
    items: [
      { label: "Ngày tạo", value: formatDateTime("2026-01-14T03:20:00Z") },
      { label: "Cập nhật", value: formatDateTime("2026-08-09T10:00:00Z") },
      { label: "Người tạo", value: "Trần Thu Hà" },
      { label: "Người cập nhật", value: "—" },
      { label: "Ngày xoá", value: "—" },
    ],
  },
];

/** Bốn kiểu dựng sẵn của `DetailView` — gọi bằng đúng tên mã trong cột trái. */
const DETAIL_VARIANTS: Array<{ code: DetailVariant; title: string; description: string }> = [
  {
    code: "grid",
    title: "Bảng thuộc tính",
    description: "Khung viền, cột nhãn nền nhạt — dễ đọc khi bản ghi có nhiều trường.",
  },
  {
    code: "rows",
    title: "Nhãn trái / giá trị phải",
    description: "Chỉ ngăn bằng đường kẻ — hợp panel hẹp, drawer chi tiết.",
  },
  {
    code: "cards",
    title: "Ô rời",
    description: "Mỗi trường một ô nhỏ — hợp phần tóm tắt ở đầu trang.",
  },
  {
    code: "inline",
    title: "Lưới gọn",
    description: "Không viền, nhãn trên giá trị dưới — hợp khối phụ trong card.",
  },
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
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SectionCard
            icon={FileText}
            title="Thông tin bản ghi"
            description="Kiểu bảng thuộc tính — mã view: grid."
          >
            <DetailView groups={DETAIL_GROUPS} variant="grid" />
          </SectionCard>

          <SectionCard icon={ShieldCheck} title="Trạng thái">
            <DetailView
              variant="rows"
              groups={[
                {
                  items: [
                    { label: "Tài khoản", value: <StatusBadge status="active" /> },
                    {
                      label: "Xác thực 2 lớp",
                      value: <StatusBadge status="pending" label="Chưa bật" />,
                    },
                    {
                      label: "Hoạt động cuối",
                      value: formatRelative("2026-08-09T10:00:00Z"),
                    },
                  ],
                },
              ]}
            />
          </SectionCard>
        </div>
      </TabPanel>

      <TabPanel value="views" activeValue={tab}>
        <div className="space-y-4">
          <Callout tone="info" title="Bốn kiểu hiển thị chi tiết">
            Cùng một dữ liệu, đổi kiểu chỉ bằng prop <code className="font-mono">variant</code> của{" "}
            <span className="font-medium text-foreground">DetailView</span>. Gọi theo tên mã ghi ở
            mỗi khối bên dưới.
          </Callout>

          {DETAIL_VARIANTS.map((item) => (
            <SectionCard
              key={item.code}
              title={item.title}
              description={item.description}
              actions={
                <Badge variant="outline" className="font-mono">
                  variant=&quot;{item.code}&quot;
                </Badge>
              }
            >
              <DetailView groups={DETAIL_GROUPS} variant={item.code} />
            </SectionCard>
          ))}
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
