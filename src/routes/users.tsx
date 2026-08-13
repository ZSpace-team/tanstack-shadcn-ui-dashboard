import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable, type SortState } from "@/components/admin/data-table";
import { Drawer } from "@/components/admin/drawer";
import { FilterBar } from "@/components/admin/filter-bar";
import PageHeader from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { StatusBadge } from "@/components/admin/status-badge";
import { Tabs } from "@/components/admin/tabs";
import { Button } from "@/components/ui/button";
import { MOCK_USERS, type MockUser } from "@/data/mock";
import { formatDate, formatRelative } from "@/lib/format";
import { getInitials } from "@/lib/session";

export const Route = createFileRoute("/users")({ component: UsersPage });

const TABS = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "pending", label: "Chờ kích hoạt" },
  { value: "disabled", label: "Đã khoá" },
];

const FILTERS = [
  {
    key: "role",
    label: "Vai trò",
    options: [
      { value: "Quản trị viên", label: "Quản trị viên" },
      { value: "Biên tập", label: "Biên tập" },
      { value: "Kế toán", label: "Kế toán" },
      { value: "Hỗ trợ", label: "Hỗ trợ" },
    ],
  },
  {
    key: "department",
    label: "Phòng ban",
    options: [
      { value: "Vận hành", label: "Vận hành" },
      { value: "Kinh doanh", label: "Kinh doanh" },
      { value: "Kỹ thuật", label: "Kỹ thuật" },
      { value: "Chăm sóc khách hàng", label: "Chăm sóc khách hàng" },
    ],
  },
];

/**
 * Trang danh sách mẫu — gồm đủ tab, thanh lọc, bảng có sắp xếp và chọn dòng,
 * phân trang, panel chi tiết và hộp xác nhận xoá.
 * Lọc/sắp xếp/phân trang chạy phía client cho gọn; đổi sang gọi API đều được.
 */
function UsersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState>({ key: "lastActiveAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detail, setDetail] = useState<MockUser | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const rows = MOCK_USERS.filter((user) => {
      if (tab !== "all" && user.status !== tab) return false;
      if (filters.role && user.role !== filters.role) return false;
      if (filters.department && user.department !== filters.department) return false;
      if (
        keyword &&
        !user.name.toLowerCase().includes(keyword) &&
        !user.email.toLowerCase().includes(keyword)
      ) {
        return false;
      }
      return true;
    });

    return [...rows].sort((a, b) => {
      const left = a[sort.key as keyof MockUser];
      const right = b[sort.key as keyof MockUser];
      const compared = String(left).localeCompare(String(right), "vi", { numeric: true });
      return sort.direction === "asc" ? compared : -compared;
    });
  }, [tab, search, filters, sort]);

  const total = filtered.length;
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Đổi bộ lọc thì quay lại trang 1, tránh rơi vào trang trống.
  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Người dùng"
        description="Danh sách tài khoản trong hệ thống."
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" />
              Xuất CSV
            </Button>
            <Button onClick={() => toast.info("Đây là template — chưa gắn form tạo mới.")}>
              <Plus className="size-4" />
              Thêm người dùng
            </Button>
          </>
        }
      />

      <Tabs
        items={TABS.map((item) => ({
          ...item,
          count:
            item.value === "all"
              ? MOCK_USERS.length
              : MOCK_USERS.filter((user) => user.status === item.value).length,
        }))}
        value={tab}
        onValueChange={(value) => {
          setTab(value);
          resetPage();
        }}
      />

      <FilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPage();
        }}
        searchPlaceholder="Tìm theo tên hoặc email..."
        filters={FILTERS}
        values={filters}
        onValuesChange={(values) => {
          setFilters(values);
          resetPage();
        }}
      />

      <DataTable<MockUser>
        rows={pageRows}
        getRowId={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        selectable
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onRowClick={setDetail}
        emptyTitle="Không tìm thấy người dùng"
        emptyDescription="Thử bỏ bớt bộ lọc hoặc đổi từ khoá tìm kiếm."
        bulkActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
              Bỏ chọn
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="size-4" />
              Xoá
            </Button>
          </>
        }
        columns={[
          {
            key: "name",
            label: "Người dùng",
            sortable: true,
            render: (row) => (
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {getInitials(row.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{row.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{row.email}</span>
                </span>
              </div>
            ),
          },
          { key: "role", label: "Vai trò", sortable: true },
          { key: "department", label: "Phòng ban", className: "hidden md:table-cell" },
          {
            key: "status",
            label: "Trạng thái",
            align: "center",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "lastActiveAt",
            label: "Hoạt động cuối",
            sortable: true,
            align: "end",
            render: (row) => formatRelative(row.lastActiveAt),
          },
        ]}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          resetPage();
        }}
      />

      <Drawer
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
        description={detail?.email}
        footer={
          <>
            <Button variant="outline" onClick={() => setDetail(null)}>
              Đóng
            </Button>
            <Button onClick={() => toast.success("Đã lưu (giả lập).")}>Lưu thay đổi</Button>
          </>
        }
      >
        {detail && (
          <dl className="space-y-4 text-sm">
            {[
              { label: "Vai trò", value: detail.role },
              { label: "Phòng ban", value: detail.department },
              { label: "Ngày tạo", value: formatDate(detail.createdAt) },
              { label: "Hoạt động cuối", value: formatRelative(detail.lastActiveAt) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-4 border-b border-border pb-3">
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="text-right font-medium">{item.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Trạng thái</dt>
              <dd>
                <StatusBadge status={detail.status} />
              </dd>
            </div>
          </dl>
        )}
      </Drawer>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Xoá ${selectedIds.length} người dùng?`}
        description="Hành động này không thể hoàn tác. Toàn bộ dữ liệu liên quan sẽ bị gỡ khỏi hệ thống."
        confirmLabel="Xoá vĩnh viễn"
        onConfirm={() => {
          setConfirmOpen(false);
          setSelectedIds([]);
          toast.success("Đã xoá (giả lập).");
        }}
      />
    </div>
  );
}
