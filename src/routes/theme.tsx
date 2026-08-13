import { createFileRoute } from "@tanstack/react-router";

import { Callout } from "@/components/admin/callout";
import PageHeader from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";

export const Route = createFileRoute("/theme")({ component: ThemePage });

const SEMANTIC_TOKENS = [
  { token: "background", usage: "Nền trang" },
  { token: "foreground", usage: "Chữ chính" },
  { token: "card", usage: "Nền khối nội dung" },
  { token: "muted", usage: "Nền phụ, vùng chờ" },
  { token: "muted-foreground", usage: "Chữ phụ, mô tả" },
  { token: "primary", usage: "Nút chính, điểm nhấn" },
  { token: "secondary", usage: "Nút phụ" },
  { token: "accent", usage: "Nền khi hover/chọn" },
  { token: "destructive", usage: "Xoá, cảnh báo nặng" },
  { token: "border", usage: "Đường viền" },
  { token: "ring", usage: "Viền focus" },
  { token: "brand", usage: "Màu thương hiệu" },
];

const SIDEBAR_TOKENS = [
  { token: "sidebar", usage: "Nền sidebar" },
  { token: "sidebar-foreground", usage: "Chữ sidebar" },
  { token: "sidebar-accent", usage: "Mục đang chọn" },
  { token: "sidebar-border", usage: "Viền sidebar" },
];

// Class viết đủ chuỗi để Tailwind quét được — không ghép chuỗi động.
const STATE_COLORS = [
  {
    label: "Thành công",
    shades: ["bg-emerald-100", "bg-emerald-300", "bg-emerald-500", "bg-emerald-700"],
  },
  { label: "Cảnh báo", shades: ["bg-amber-100", "bg-amber-300", "bg-amber-500", "bg-amber-700"] },
  { label: "Nguy hiểm", shades: ["bg-rose-100", "bg-rose-300", "bg-rose-500", "bg-rose-700"] },
  { label: "Thông tin", shades: ["bg-sky-100", "bg-sky-300", "bg-sky-500", "bg-sky-700"] },
];

const RADIUS = [
  { name: "rounded-sm", label: "sm" },
  { name: "rounded-md", label: "md" },
  { name: "rounded-lg", label: "lg" },
  { name: "rounded-xl", label: "xl" },
  { name: "rounded-2xl", label: "2xl" },
  { name: "rounded-full", label: "full" },
];

/** Bảng tra cứu tông màu — đổi giá trị trong src/styles/globals.css là đổi toàn bộ. */
function ThemePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Tông màu & token"
        description="Mọi màu đều là biến CSS. Đổi ở src/styles/globals.css, không cần sửa component."
      />

      <Callout tone="info" title="Cách đổi màu thương hiệu">
        Chọn nhanh 6 tông dựng sẵn ở menu tài khoản → <strong>Tông màu</strong>; lựa chọn được lưu
        vào localStorage. Muốn đổi màu mặc định thì sửa <code>--brand</code> trong{" "}
        <code>:root</code> và <code>.dark</code> — ví dụ <code>oklch(0.55 0.2 255)</code>. Toàn bộ
        logo, avatar và điểm nhấn sẽ đổi theo.
      </Callout>

      <SectionCard title="Token ngữ nghĩa" description="Dùng qua class Tailwind: bg-card, text-muted-foreground...">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEMANTIC_TOKENS.map((item) => (
            <div
              key={item.token}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <span
                className="size-10 shrink-0 rounded-md border border-border"
                style={{ background: `var(--${item.token})` }}
              />
              <span className="min-w-0">
                <span className="block truncate font-mono text-xs font-medium">--{item.token}</span>
                <span className="block truncate text-xs text-muted-foreground">{item.usage}</span>
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Token sidebar">
          <div className="space-y-3">
            {SIDEBAR_TOKENS.map((item) => (
              <div key={item.token} className="flex items-center gap-3">
                <span
                  className="size-8 shrink-0 rounded-md border border-border"
                  style={{ background: `var(--${item.token})` }}
                />
                <span className="min-w-0">
                  <span className="block font-mono text-xs font-medium">--{item.token}</span>
                  <span className="block text-xs text-muted-foreground">{item.usage}</span>
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Màu trạng thái" description="Dùng trực tiếp thang màu Tailwind.">
          <div className="space-y-3">
            {STATE_COLORS.map((color) => (
              <div key={color.label} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-xs text-muted-foreground">{color.label}</span>
                {color.shades.map((shade) => (
                  <span key={shade} className={`h-8 flex-1 rounded-md ${shade}`} title={shade} />
                ))}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Bo góc" description="Điều khiển bởi --radius (mặc định 0.625rem).">
          <div className="flex flex-wrap gap-3">
            {RADIUS.map((item) => (
              <div key={item.name} className="text-center">
                <div className={`size-16 border border-border bg-muted ${item.name}`} />
                <span className="mt-1.5 block font-mono text-[11px] text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Cỡ chữ" description="Đổi trong khối :root của globals.css.">
          <div className="space-y-3">
            <p className="text-2xl font-bold">Tiêu đề lớn — 2xl bold</p>
            <p className="text-xl font-bold">Tiêu đề trang — xl bold</p>
            <p className="text-base">Chữ nội dung — base</p>
            <p className="text-sm">Chữ trong bảng và form — sm</p>
            <p className="text-xs text-muted-foreground">Chú thích — xs muted</p>
            <p className="font-mono text-sm tabular-nums">1.234.567 — số căn cột (tabular-nums)</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
