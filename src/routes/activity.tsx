import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DataTable } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import PageHeader from "@/components/admin/page-header";
import { MOCK_ACTIVITIES } from "@/data/mock";
import { formatDateTime, formatRelative } from "@/lib/format";

export const Route = createFileRoute("/activity")({ component: ActivityPage });

/** Trang nhật ký — bảng đơn giản nhất, chỉ có tìm kiếm. */
function ActivityPage() {
  const [search, setSearch] = useState("");

  const keyword = search.trim().toLowerCase();
  const rows = MOCK_ACTIVITIES.filter(
    (item) =>
      !keyword ||
      item.actor.toLowerCase().includes(keyword) ||
      item.target.toLowerCase().includes(keyword),
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nhật ký hoạt động"
        description="Ghi lại thao tác của quản trị viên trên hệ thống."
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo người thực hiện hoặc đối tượng..."
      />

      <DataTable
        rows={rows}
        getRowId={(row) => row.id}
        emptyTitle="Không có bản ghi nào khớp"
        emptyDescription="Thử đổi từ khoá tìm kiếm."
        columns={[
          { key: "actor", label: "Người thực hiện" },
          { key: "action", label: "Hành động" },
          { key: "target", label: "Đối tượng" },
          {
            key: "at",
            label: "Thời điểm",
            align: "end",
            render: (row) => (
              <span title={formatDateTime(row.at as string)}>
                {formatRelative(row.at as string)}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
