import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import { Callout } from "@/components/admin/callout";
import PageHeader from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import StatCard from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import { MOCK_ACTIVITIES, MOCK_REVENUE } from "@/data/mock";
import { formatCurrency, formatNumber, formatRelative } from "@/lib/format";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const { user } = useSession();
  const maxRevenue = Math.max(...MOCK_REVENUE.map((item) => item.value));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Xin chào, ${user?.name ?? "Admin"}`}
        description="Số liệu tổng quan trong 30 ngày gần nhất."
        actions={
          <Button variant="outline">
            Xuất báo cáo
            <ArrowUpRight className="size-4" />
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Doanh thu"
          value={formatCurrency(486_500_000)}
          icon={DollarSign}
          tone="brand"
          trend={12.4}
        />
        <StatCard
          label="Đơn hàng"
          value={formatNumber(1_284)}
          icon={ShoppingCart}
          tone="sky"
          trend={5.1}
        />
        <StatCard
          label="Người dùng mới"
          value={formatNumber(312)}
          icon={Users}
          tone="emerald"
          trend={-2.8}
        />
        <StatCard
          label="Sản phẩm"
          value={formatNumber(32)}
          icon={Package}
          tone="amber"
          hint="4 sản phẩm sắp hết hàng"
        />
      </div>

      <Callout tone="info" title="Đây là template giao diện">
        Toàn bộ số liệu trên trang này là dữ liệu giả trong <code>src/data/mock.ts</code>. Thay bằng
        API thật của bạn mà không cần sửa component.
      </Callout>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Doanh thu theo tháng"
          description="Đơn vị: triệu đồng"
          actions={
            <Button variant="ghost" size="sm" render={<Link to="/users" />}>
              Chi tiết
            </Button>
          }
        >
          {/* Biểu đồ cột thuần CSS — không kéo thêm thư viện chart nào. */}
          <div className="flex h-56 items-end gap-2">
            {MOCK_REVENUE.map((item) => (
              <div key={item.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-brand/80 transition-all hover:bg-brand"
                    style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                    title={`${item.month}: ${item.value} triệu`}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Hoạt động gần đây" padded={false}>
          <ul className="divide-y divide-border">
            {MOCK_ACTIVITIES.map((item) => (
              <li key={item.id} className="flex gap-3 px-5 py-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.actor}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    <span className="font-medium">{item.target}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(item.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
