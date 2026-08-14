import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CheckboxGroup, RadioGroup } from "@/components/admin/choice-group";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable, type SortState } from "@/components/admin/data-table";
import { DateField, DateRangeField, type DateRange } from "@/components/admin/date-field";
import { DetailView } from "@/components/admin/detail-view";
import { Drawer } from "@/components/admin/drawer";
import { fieldInputClass } from "@/components/admin/field";
import { FilterBar, type FilterChip } from "@/components/admin/filter-bar";
import { FilterDrawer } from "@/components/admin/filter-drawer";
import { FormField, FormSelect } from "@/components/admin/form";
import { MultiSelect } from "@/components/admin/multi-select";
import PageHeader from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { StatusBadge, STATUS_MAP } from "@/components/admin/status-badge";
import { Tabs } from "@/components/admin/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_USERS, type MockUser } from "@/data/mock";
import { formatDate, formatDateTime, formatRelative } from "@/lib/format";
import { getInitials } from "@/lib/session";

export const Route = createFileRoute("/users")({ component: UsersPage });

const TABS = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "pending", label: "Chờ kích hoạt" },
  { value: "disabled", label: "Đã khoá" },
];

const DEPARTMENTS = ["Vận hành", "Kinh doanh", "Kỹ thuật", "Chăm sóc khách hàng"];

const ROLE_OPTIONS = ["Quản trị viên", "Biên tập", "Kế toán", "Hỗ trợ"].map((item) => ({
  value: item,
  label: item,
}));

const STATUS_OPTIONS = (["active", "pending", "disabled"] as const).map((status) => ({
  value: status,
  label: STATUS_MAP[status]!.label,
}));

const ACTIVITY_OPTIONS = [
  { value: "all", label: "Không giới hạn" },
  { value: "7d", label: "Hoạt động trong 7 ngày qua" },
  { value: "30d", label: "Không hoạt động quá 30 ngày", hint: "Dùng để rà soát tài khoản bỏ quên" },
];

/** Điều kiện của panel lọc nâng cao — mỗi trường là một kiểu nhập khác nhau. */
interface AdvancedFilters {
  department: string;
  roles: string[];
  statuses: string[];
  activity: string;
  email: string;
  createdRange: DateRange;
  lastActiveAfter: string;
}

const EMPTY_FILTERS: AdvancedFilters = {
  department: "",
  roles: [],
  statuses: [],
  activity: "all",
  email: "",
  createdRange: { from: "", to: "" },
  lastActiveAfter: "",
};

const DAY = 86400000;

/** Đếm số điều kiện đang bật — hiện lên badge của nút "Bộ lọc". */
function countActive(filters: AdvancedFilters) {
  return [
    filters.department !== "",
    filters.roles.length > 0,
    filters.statuses.length > 0,
    filters.activity !== "all",
    filters.email.trim() !== "",
    filters.createdRange.from !== "" || filters.createdRange.to !== "",
    filters.lastActiveAfter !== "",
  ].filter(Boolean).length;
}

/**
 * Trang danh sách mẫu — gồm đủ tab, thanh lọc, bảng có sắp xếp và chọn dòng,
 * phân trang, panel chi tiết và hộp xác nhận xoá.
 * Lọc/sắp xếp/phân trang chạy phía client cho gọn; đổi sang gọi API đều được.
 */
function UsersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AdvancedFilters>(EMPTY_FILTERS);
  /** Giá trị đang sửa trong panel — chỉ đổ vào `filters` khi bấm Áp dụng. */
  const [draft, setDraft] = useState<AdvancedFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: "lastActiveAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detail, setDetail] = useState<MockUser | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const email = filters.email.trim().toLowerCase();
    const createdFrom = filters.createdRange.from ? new Date(filters.createdRange.from) : null;
    // Ngày "đến" tính hết ngày, tránh bỏ sót bản ghi tạo lúc 23:xx.
    const createdTo = filters.createdRange.to
      ? new Date(new Date(filters.createdRange.to).getTime() + DAY - 1)
      : null;
    const lastActiveAfter = filters.lastActiveAfter ? new Date(filters.lastActiveAfter) : null;
    const now = Date.now();

    const rows = MOCK_USERS.filter((user) => {
      if (tab !== "all" && user.status !== tab) return false;
      if (filters.department && user.department !== filters.department) return false;
      if (filters.roles.length > 0 && !filters.roles.includes(user.role)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(user.status)) return false;
      if (email && !user.email.toLowerCase().includes(email)) return false;

      const lastActive = new Date(user.lastActiveAt).getTime();
      if (filters.activity === "7d" && now - lastActive > 7 * DAY) return false;
      if (filters.activity === "30d" && now - lastActive <= 30 * DAY) return false;
      if (lastActiveAfter && lastActive < lastActiveAfter.getTime()) return false;

      const created = new Date(user.createdAt).getTime();
      if (createdFrom && created < createdFrom.getTime()) return false;
      if (createdTo && created > createdTo.getTime()) return false;

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

  const patchFilters = (next: Partial<AdvancedFilters>) => {
    setFilters((current) => ({ ...current, ...next }));
    resetPage();
  };

  const chips: FilterChip[] = [];
  if (filters.department) {
    chips.push({
      key: "department",
      label: `Phòng ban: ${filters.department}`,
      onRemove: () => patchFilters({ department: "" }),
    });
  }
  if (filters.roles.length > 0) {
    chips.push({
      key: "roles",
      label: `Vai trò: ${filters.roles.join(", ")}`,
      onRemove: () => patchFilters({ roles: [] }),
    });
  }
  if (filters.statuses.length > 0) {
    chips.push({
      key: "statuses",
      label: `Trạng thái: ${filters.statuses
        .map((status) => STATUS_MAP[status]?.label ?? status)
        .join(", ")}`,
      onRemove: () => patchFilters({ statuses: [] }),
    });
  }
  if (filters.activity !== "all") {
    chips.push({
      key: "activity",
      label:
        ACTIVITY_OPTIONS.find((option) => option.value === filters.activity)?.label ??
        filters.activity,
      onRemove: () => patchFilters({ activity: "all" }),
    });
  }
  if (filters.email.trim()) {
    chips.push({
      key: "email",
      label: `Email chứa: ${filters.email.trim()}`,
      onRemove: () => patchFilters({ email: "" }),
    });
  }
  if (filters.createdRange.from || filters.createdRange.to) {
    chips.push({
      key: "createdRange",
      label: `Ngày tạo: ${formatDate(filters.createdRange.from)} → ${formatDate(filters.createdRange.to)}`,
      onRemove: () => patchFilters({ createdRange: { from: "", to: "" } }),
    });
  }
  if (filters.lastActiveAfter) {
    chips.push({
      key: "lastActiveAfter",
      label: `Hoạt động sau: ${formatDateTime(filters.lastActiveAfter)}`,
      onRemove: () => patchFilters({ lastActiveAfter: "" }),
    });
  }

  const openFilterDrawer = () => {
    setDraft(filters);
    setFilterOpen(true);
  };

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
        onOpenAdvanced={openFilterDrawer}
        advancedCount={countActive(filters)}
        chips={chips}
        onClearAll={() => {
          setFilters(EMPTY_FILTERS);
          setDraft(EMPTY_FILTERS);
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
          <DetailView
            variant="rows"
            groups={[
              {
                items: [
                  { label: "Vai trò", value: detail.role },
                  { label: "Phòng ban", value: detail.department },
                  { label: "Ngày tạo", value: formatDate(detail.createdAt) },
                  { label: "Hoạt động cuối", value: formatRelative(detail.lastActiveAt) },
                  { label: "Trạng thái", value: <StatusBadge status={detail.status} /> },
                ],
              },
            ]}
          />
        )}
      </Drawer>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        activeCount={countActive(draft)}
        onApply={() => {
          setFilters(draft);
          setFilterOpen(false);
          resetPage();
        }}
        onReset={() => {
          setDraft(EMPTY_FILTERS);
          setFilters(EMPTY_FILTERS);
          resetPage();
        }}
      >
        <FormField label="Phòng ban" htmlFor="filter-department" hint="Chọn một giá trị.">
          <FormSelect
            id="filter-department"
            value={draft.department}
            onChange={(event) => setDraft({ ...draft, department: event.target.value })}
          >
            <option value="">Tất cả phòng ban</option>
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Vai trò" htmlFor="filter-roles" hint="Chọn nhiều vai trò cùng lúc.">
          <MultiSelect
            id="filter-roles"
            options={ROLE_OPTIONS}
            value={draft.roles}
            onValueChange={(roles) => setDraft({ ...draft, roles })}
            placeholder="Tất cả vai trò"
          />
        </FormField>

        <FormField label="Trạng thái tài khoản">
          <CheckboxGroup
            options={STATUS_OPTIONS}
            value={draft.statuses}
            onValueChange={(statuses) => setDraft({ ...draft, statuses })}
          />
        </FormField>

        <FormField label="Mức độ hoạt động">
          <RadioGroup
            name="filter-activity"
            options={ACTIVITY_OPTIONS}
            value={draft.activity}
            onValueChange={(activity) => setDraft({ ...draft, activity })}
          />
        </FormField>

        <FormField label="Email chứa" htmlFor="filter-email">
          <Input
            id="filter-email"
            value={draft.email}
            placeholder="vd: @example.com"
            onChange={(event) => setDraft({ ...draft, email: event.target.value })}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Ngày tạo" htmlFor="filter-created-from" hint="Khoảng ngày từ — đến.">
          <DateRangeField
            id="filter-created-from"
            value={draft.createdRange}
            onChange={(createdRange) => setDraft({ ...draft, createdRange })}
          />
        </FormField>

        <FormField
          label="Hoạt động cuối sau"
          htmlFor="filter-last-active"
          hint="Chọn cả ngày và giờ."
        >
          <DateField
            id="filter-last-active"
            withTime
            value={draft.lastActiveAfter}
            onChange={(lastActiveAfter) => setDraft({ ...draft, lastActiveAfter })}
          />
        </FormField>
      </FilterDrawer>

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
