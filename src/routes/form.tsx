import { createFileRoute } from "@tanstack/react-router";
import { Circle, CircleCheck, IdCard, Settings2, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "@/components/admin/breadcrumb";
import { Callout } from "@/components/admin/callout";
import { fieldInputClass } from "@/components/admin/field";
import { FormField, FormRow, FormSelect } from "@/components/admin/form";
import PageHeader from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/form")({ component: FormPage });

const ROLES = [
  { value: "admin", label: "Quản trị viên" },
  { value: "editor", label: "Biên tập" },
  { value: "accountant", label: "Kế toán" },
  { value: "support", label: "Hỗ trợ" },
];

/**
 * Trang biểu mẫu mẫu — mỗi nhóm trường là một card có header (icon + tiêu đề),
 * thân form và footer chứa thanh hành động. Cột phải tóm tắt dữ liệu đang nhập.
 */
function FormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [bio, setBio] = useState("");
  const [notify, setNotify] = useState(true);
  const [terms, setTerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

  const nameValid = name.trim().length >= 2;
  const emailValid = email.includes("@");
  const nameError = touched && !nameValid ? "Tên phải có ít nhất 2 ký tự." : undefined;
  const emailError = touched && !emailValid ? "Email không hợp lệ." : undefined;
  const canSubmit = nameValid && emailValid && terms;

  const submit = () => {
    setTouched(true);
    if (!canSubmit) {
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Đã lưu thông tin (giả lập).");
    }, 700);
  };

  const roleLabel = ROLES.find((item) => item.value === role)?.label ?? role;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader
        title="Thêm người dùng"
        description="Biểu mẫu mẫu với đầy đủ kiểu trường thường gặp."
        breadcrumb={
          <Breadcrumb items={[{ label: "Người dùng", to: "/users" }, { label: "Thêm mới" }]} />
        }
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]"
      >
        <div className="space-y-4">
          <SectionCard
            icon={UserRound}
            title="Thông tin cơ bản"
            description="Những thông tin bắt buộc để tạo tài khoản."
          >
            <div className="space-y-5">
              <FormRow>
                <FormField label="Họ và tên" htmlFor="name" required error={nameError}>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={fieldInputClass}
                    aria-invalid={Boolean(nameError)}
                  />
                </FormField>

                <FormField label="Email" htmlFor="email" required error={emailError}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ten@congty.com"
                    className={fieldInputClass}
                    aria-invalid={Boolean(emailError)}
                  />
                </FormField>
              </FormRow>

              <FormRow>
                <FormField
                  label="Vai trò"
                  htmlFor="role"
                  hint="Quyết định quyền truy cập trong CMS."
                >
                  <FormSelect id="role" value={role} onChange={(event) => setRole(event.target.value)}>
                    {ROLES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>

                <FormField label="Số điện thoại" htmlFor="phone" hint="Không bắt buộc.">
                  <Input id="phone" placeholder="09xx xxx xxx" className={fieldInputClass} />
                </FormField>
              </FormRow>
            </div>
          </SectionCard>

          <SectionCard
            icon={IdCard}
            title="Hồ sơ"
            description="Thông tin hiển thị với thành viên khác."
          >
            <FormField label="Giới thiệu" htmlFor="bio" hint={`${bio.length}/280 ký tự`}>
              <Textarea
                id="bio"
                value={bio}
                maxLength={280}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Vài dòng về người dùng này..."
                className="min-h-24 rounded-lg px-3 py-2 text-sm"
              />
            </FormField>
          </SectionCard>

          <SectionCard
            icon={Settings2}
            title="Tuỳ chọn"
            description="Có thể đổi lại bất cứ lúc nào."
            footer={
              <>
                <Button type="button" variant="outline" size="lg" disabled={saving}>
                  Huỷ
                </Button>
                <Button type="submit" size="lg" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu người dùng"}
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                <span className="min-w-0">
                  <span className="block text-sm font-medium">Nhận email thông báo</span>
                  <span className="block text-xs text-muted-foreground">
                    Gửi thông báo khi có hoạt động liên quan tới tài khoản.
                  </span>
                </span>
                <Switch
                  checked={notify}
                  onCheckedChange={setNotify}
                  aria-label="Nhận email thông báo"
                />
              </label>

              <label className="flex items-start gap-3">
                <Checkbox
                  checked={terms}
                  onCheckedChange={(checked) => setTerms(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm">
                  Tôi xác nhận đã đọc và đồng ý với{" "}
                  <a href="#" className="text-primary hover:underline">
                    điều khoản sử dụng
                  </a>
                  . <span className="text-destructive">*</span>
                </span>
              </label>

              {touched && !terms && (
                <Callout tone="warning">Bạn cần đồng ý với điều khoản trước khi lưu.</Callout>
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          icon={CircleCheck}
          title="Tóm tắt"
          description="Cập nhật theo nội dung đang nhập."
          className="lg:sticky lg:top-4"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
                {nameValid ? getInitials(name) : "?"}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {name.trim() || "Chưa đặt tên"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {email.trim() || "chưa có email"}
                </span>
              </span>
            </div>

            <Badge variant="neutral">{roleLabel}</Badge>

            <ul className="space-y-2 border-t border-border pt-4 text-sm">
              {[
                { label: "Tên hợp lệ", done: nameValid },
                { label: "Email hợp lệ", done: emailValid },
                { label: "Đã đồng ý điều khoản", done: terms },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  {item.done ? (
                    <CircleCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={cn(!item.done && "text-muted-foreground")}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}
