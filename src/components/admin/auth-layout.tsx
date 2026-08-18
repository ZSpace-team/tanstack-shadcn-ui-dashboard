import { Link } from "@tanstack/react-router";
import { ArrowLeft, Moon, Quote, Sun, Tags, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import AdminBrand from "./admin-brand";

/* ---------------------------------------------------------------------------
 * Khung cho trang đăng nhập / đăng ký.
 *
 * Hai bố cục dùng chung một API: `title`, `description`, phần thân là form,
 * `footer` là dòng chuyển trang bên dưới. Đổi bố cục = đổi component bao ngoài,
 * không phải viết lại form.
 *
 * Trang xác thực nằm ngoài shell admin (không sidebar, không topbar) — xem
 * nhánh `/auth` trong `src/routes/__root.tsx`.
 * ------------------------------------------------------------------------- */

/** Nút bật/tắt nền tối — bản gọn cho trang không có topbar. */
export function AuthThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      aria-label={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50",
        className,
      )}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}

/** Link quay lại khu vực quản trị — trang xác thực không có sidebar để điều hướng. */
export function AuthBackLink({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="size-3.5" />
      Về trang quản trị
    </Link>
  );
}

/**
 * Hộp chuyển qua lại giữa hai mẫu bố cục — chỉ phục vụ việc xem demo,
 * xoá đi khi dựng sản phẩm thật.
 */
export function AuthVariantSwitch({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Class cho từng nút bên trong `AuthVariantSwitch`. */
export function authVariantItemClass(active: boolean) {
  return cn(
    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
    active
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

/** Vệt màu mờ phía sau nội dung — giữ nền không bị phẳng mà vẫn nhẹ. */
function AuthBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-brand/12 blur-3xl" />
      <div className="absolute -right-32 -bottom-40 size-[26rem] rounded-full bg-brand/8 blur-3xl" />
    </div>
  );
}

/** Dòng chân trang pháp lý, dùng chung cho cả hai bố cục. */
function AuthLegalNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      <a href="#" className="transition-colors hover:text-foreground">
        Điều khoản sử dụng
      </a>
      <span className="px-1.5 text-border">·</span>
      <a href="#" className="transition-colors hover:text-foreground">
        Chính sách bảo mật
      </a>
      <span className="px-1.5 text-border">·</span>
      <a href="#" className="transition-colors hover:text-foreground">
        Hỗ trợ
      </a>
    </p>
  );
}

/**
 * MẪU 1 — CĂN GIỮA.
 * Logo trên đỉnh, một thẻ duy nhất ở giữa màn hình. Hợp với hệ thống nội bộ,
 * ít nội dung tiếp thị, và là mẫu nhẹ nhất để nhúng vào dự án có sẵn.
 */
export function AuthCenteredLayout({
  title,
  description,
  children,
  footer,
  variantSwitch,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  /** Dòng chuyển trang bên dưới thẻ (vd: "Chưa có tài khoản? Đăng ký"). */
  footer?: ReactNode;
  variantSwitch?: ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto bg-muted/40">
      <div className="relative flex min-h-full flex-col">
        <AuthBackdrop />

        <header className="relative flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <AuthBackLink />
          <div className="flex items-center gap-2">
            {variantSwitch}
            <AuthThemeToggle />
          </div>
        </header>

        <main className="relative flex flex-1 items-center justify-center px-4 py-6">
          <div className="w-full max-w-[26rem]">
            <div className="mb-6 flex justify-center">
              <AdminBrand />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-7 dark:shadow-black/30">
              <div className="mb-6 text-center">
                <h1 className="text-lg font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              {children}
            </div>

            {footer && <div className="mt-5 text-center text-sm">{footer}</div>}
          </div>
        </main>

        <footer className="relative flex justify-center px-4 py-5">
          <AuthLegalNote />
        </footer>
      </div>
    </div>
  );
}

export interface AuthPanelPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * MẪU 2 — CHIA ĐÔI MÀN HÌNH.
 * Nửa trái là bảng giới thiệu nền màu thương hiệu, nửa phải là form.
 * Dưới `lg` bảng trái tự ẩn, form chiếm trọn màn hình.
 */
export function AuthSplitLayout({
  title,
  description,
  children,
  footer,
  variantSwitch,
  panelEyebrow,
  panelHeadline,
  panelDescription,
  panelPoints = [],
  panelQuote,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variantSwitch?: ReactNode;
  panelEyebrow?: string;
  panelHeadline: string;
  panelDescription?: string;
  /** Danh sách điểm mạnh hiện ở cột trái. */
  panelPoints?: AuthPanelPoint[];
  panelQuote?: { text: string; author: string; role: string };
}) {
  return (
    <div className="flex h-full">
      <aside className="relative hidden w-[46%] max-w-2xl shrink-0 flex-col justify-between overflow-hidden bg-brand p-10 text-brand-foreground lg:flex">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-24 size-[26rem] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-32 -bottom-40 size-[30rem] rounded-full bg-black/15 blur-3xl" />
          <div className="absolute top-1/3 -right-20 size-72 rounded-full border border-white/15" />
          <div className="absolute top-1/3 -right-36 size-96 rounded-full border border-white/10" />
        </div>

        <div className="relative flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-brand-foreground">
            <Tags className="size-[1.125rem]" strokeWidth={2.2} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight">Admin Template</span>
            <span className="block truncate text-xs leading-4 text-brand-foreground/70">
              Trung tâm quản trị
            </span>
          </span>
        </div>

        <div className="relative max-w-md">
          {panelEyebrow && (
            <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
              {panelEyebrow}
            </span>
          )}
          <h2 className="mt-4 text-2xl leading-snug font-bold tracking-tight text-balance">
            {panelHeadline}
          </h2>
          {panelDescription && (
            <p className="mt-3 text-sm text-brand-foreground/80">{panelDescription}</p>
          )}

          {panelPoints.length > 0 && (
            <ul className="mt-7 space-y-4">
              {panelPoints.map((point) => (
                <li key={point.title} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <point.icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{point.title}</span>
                    <span className="block text-xs text-brand-foreground/75">
                      {point.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          {panelQuote ? (
            <figure className="max-w-md rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <Quote className="size-4 opacity-70" />
              <blockquote className="mt-2 text-sm leading-relaxed">{panelQuote.text}</blockquote>
              <figcaption className="mt-3 text-xs text-brand-foreground/75">
                <span className="font-semibold text-brand-foreground">{panelQuote.author}</span>
                {" — "}
                {panelQuote.role}
              </figcaption>
            </figure>
          ) : (
            <p className="text-xs text-brand-foreground/70">
              © {new Date().getFullYear()} Admin Template
            </p>
          )}
        </div>
      </aside>

      <div className="h-full min-w-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <AuthBackLink />
            <div className="flex items-center gap-2">
              {variantSwitch}
              <AuthThemeToggle />
            </div>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6">
            <div className="w-full max-w-[24rem]">
              <div className="mb-7 lg:hidden">
                <AdminBrand />
              </div>

              <div className="mb-6">
                <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
                )}
              </div>

              {children}

              {footer && <div className="mt-6 text-sm">{footer}</div>}
            </div>
          </main>

          <footer className="px-4 py-5 sm:px-6">
            <AuthLegalNote />
          </footer>
        </div>
      </div>
    </div>
  );
}
