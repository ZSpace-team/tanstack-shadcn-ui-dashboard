import { Eye, EyeOff, LoaderCircle, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { fieldErrorClass, fieldHintClass, fieldInputClass, fieldLabelClass } from "./field";

/* ---------------------------------------------------------------------------
 * Các mảnh dùng chung của form đăng nhập / đăng ký.
 * Dùng lại `fieldInputClass` của CMS, chỉ nâng chiều cao lên 40px cho thoáng.
 * ------------------------------------------------------------------------- */

/** Ô nhập của trang xác thực: cao hơn ô trong CMS, chừa chỗ cho icon bên trái. */
const authInputClass = cn(fieldInputClass, "h-10 rounded-lg");

/** Nhãn kèm link phụ bên phải (vd: "Mật khẩu" — "Quên mật khẩu?"). */
function AuthLabelRow({
  label,
  htmlFor,
  required,
  action,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className={fieldLabelClass}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {action}
    </div>
  );
}

/** Trường nhập một dòng, có icon bên trái và chỗ hiện lỗi. */
export function AuthField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  required,
  action,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  id: string;
  label: string;
  /** Icon mờ nằm trong ô, giúp quét nhanh loại dữ liệu cần nhập. */
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  /** Link phụ đặt cạnh nhãn. */
  action?: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <AuthLabelRow label={label} htmlFor={id} required={required} action={action} />
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={id}
          className={cn(authInputClass, Icon && "pl-9")}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </div>
      {error ? <p className={fieldErrorClass}>{error}</p> : hint ? <p className={fieldHintClass}>{hint}</p> : null}
    </div>
  );
}

/** Trường mật khẩu — có nút hiện/ẩn ký tự. */
export function AuthPasswordField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  required,
  action,
  className,
  children,
  ...props
}: React.ComponentProps<"input"> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  action?: ReactNode;
  /** Nội dung phụ dưới ô — thường là thanh đo độ mạnh. */
  children?: ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("space-y-1.5", className)}>
      <AuthLabelRow label={label} htmlFor={id} required={required} action={action} />
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(authInputClass, Icon && "pl-9", "pr-10")}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {children}
      {error ? <p className={fieldErrorClass}>{error}</p> : hint ? <p className={fieldHintClass}>{hint}</p> : null}
    </div>
  );
}

const STRENGTH_LEVELS = [
  { label: "Quá ngắn", bar: "bg-destructive", text: "text-destructive" },
  { label: "Yếu", bar: "bg-destructive", text: "text-destructive" },
  { label: "Trung bình", bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  { label: "Khá", bar: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
  { label: "Mạnh", bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
] as const;

/** Chấm điểm mật khẩu 0–4: độ dài, hoa/thường, chữ số, ký tự đặc biệt. */
export function getPasswordScore(value: string) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^\p{L}\p{N}]/u.test(value)) score += 1;
  return score;
}

/** Thanh đo độ mạnh mật khẩu — 4 đoạn, tô dần theo điểm. */
export function PasswordStrength({ value, className }: { value: string; className?: string }) {
  const score = getPasswordScore(value);
  const level = STRENGTH_LEVELS[score] ?? STRENGTH_LEVELS[0];

  return (
    <div className={cn("space-y-1.5 pt-0.5", className)}>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              value && index < score ? level.bar : "bg-border",
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs", value ? level.text : "text-muted-foreground")}>
        {value ? `Độ mạnh: ${level.label}` : "Tối thiểu 8 ký tự, nên có chữ hoa và chữ số."}
      </p>
    </div>
  );
}

/** Đường kẻ ngang có chữ ở giữa. */
export function AuthDivider({ children = "hoặc" }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Logo Google — lucide không có icon thương hiệu nên vẽ thẳng bằng SVG. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.27 6.61l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

/** Logo GitHub — vẽ bằng SVG, tự đổi màu theo chữ. */
function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/** Hàng nút đăng nhập bằng tài khoản bên thứ ba. */
export function AuthSocialButtons({
  onSelect,
  disabled,
}: {
  onSelect?: (provider: "google" | "github") => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-lg text-sm"
        disabled={disabled}
        onClick={() => onSelect?.("google")}
      >
        <GoogleMark />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-lg text-sm"
        disabled={disabled}
        onClick={() => onSelect?.("github")}
      >
        <GithubMark />
        GitHub
      </Button>
    </div>
  );
}

/** Nút gửi form: rộng hết dòng, có trạng thái đang xử lý. */
export function AuthSubmitButton({
  loading,
  loadingLabel = "Đang xử lý...",
  children,
  className,
}: {
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn("h-10 w-full rounded-lg text-sm font-semibold", className)}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" />}
      {loading ? loadingLabel : children}
    </Button>
  );
}
