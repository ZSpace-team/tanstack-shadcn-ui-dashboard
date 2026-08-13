import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable, type SortState } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { FilterBar } from "@/components/admin/filter-bar";
import PageHeader from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Tabs } from "@/components/admin/tabs";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS, type MockProduct } from "@/data/mock";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/products")({ component: ProductsPage });

const CATEGORY_FILTER = [
  {
    key: "category",
    label: "Danh mục",
    options: ["Điện tử", "Thời trang", "Gia dụng", "Sách", "Thể thao"].map((item) => ({
      value: item,
      label: item,
    })),
  },
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { value: "published", label: "Đã đăng" },
      { value: "draft", label: "Bản nháp" },
      { value: "archived", label: "Lưu trữ" },
    ],
  },
];

/** Trang danh sách thứ hai — minh hoạ chuyển đổi giữa chế độ bảng và lưới thẻ. */
function ProductsPage() {
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState>({ key: "updatedAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const rows = MOCK_PRODUCTS.filter((product) => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.status && product.status !== filters.status) return false;
      if (
        keyword &&
        !product.name.toLowerCase().includes(keyword) &&
        !product.sku.toLowerCase().includes(keyword)
      ) {
        return false;
      }
      return true;
    });

    return [...rows].sort((a, b) => {
      const left = a[sort.key as keyof MockProduct];
      const right = b[sort.key as keyof MockProduct];
      if (typeof left === "number" && typeof right === "number") {
        return sort.direction === "asc" ? left - right : right - left;
      }
      const compared = String(left).localeCompare(String(right), "vi", { numeric: true });
      return sort.direction === "asc" ? compared : -compared;
    });
  }, [search, filters, sort]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý danh mục hàng hoá và tồn kho."
        actions={
          <Button>
            <Plus className="size-4" />
            Thêm sản phẩm
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          variant="pill"
          items={[
            { value: "table", label: "Bảng", icon: List },
            { value: "grid", label: "Lưới", icon: LayoutGrid },
          ]}
          value={view}
          onValueChange={setView}
        />
        <span className="text-sm text-muted-foreground">
          {formatNumber(filtered.length)} sản phẩm
        </span>
      </div>

      <FilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Tìm theo tên hoặc SKU..."
        filters={CATEGORY_FILTER}
        values={filters}
        onValuesChange={(values) => {
          setFilters(values);
          setPage(1);
        }}
      />

      {view === "table" ? (
        <DataTable<MockProduct>
          rows={pageRows}
          getRowId={(row) => row.id}
          sort={sort}
          onSortChange={setSort}
          emptyTitle="Không có sản phẩm nào khớp"
          emptyDescription="Thử đổi bộ lọc hoặc thêm sản phẩm mới."
          columns={[
            { key: "name", label: "Tên sản phẩm", sortable: true },
            { key: "sku", label: "SKU", className: "hidden sm:table-cell" },
            { key: "category", label: "Danh mục", className: "hidden md:table-cell" },
            {
              key: "price",
              label: "Giá",
              sortable: true,
              align: "end",
              render: (row) => formatCurrency(row.price),
            },
            {
              key: "stock",
              label: "Tồn kho",
              sortable: true,
              align: "end",
              render: (row) => (
                <span className={row.stock < 20 ? "font-medium text-amber-500" : undefined}>
                  {formatNumber(row.stock)}
                </span>
              ),
            },
            {
              key: "status",
              label: "Trạng thái",
              align: "center",
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: "updatedAt",
              label: "Cập nhật",
              sortable: true,
              align: "end",
              className: "hidden lg:table-cell",
              render: (row) => formatDate(row.updatedAt),
            },
          ]}
        />
      ) : pageRows.length === 0 ? (
        <SectionCard padded={false}>
          <EmptyState
            title="Không có sản phẩm nào khớp"
            description="Thử đổi bộ lọc hoặc thêm sản phẩm mới."
          />
        </SectionCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pageRows.map((product) => (
            <article
              key={product.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{product.sku}</p>
                </div>
                <StatusBadge status={product.status} />
              </div>
              <div className="mt-auto flex items-end justify-between gap-3">
                <span className="text-lg font-bold tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Tồn: {formatNumber(product.stock)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
