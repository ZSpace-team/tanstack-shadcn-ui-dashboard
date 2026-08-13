import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "@/components/admin/breadcrumb";
import { Callout } from "@/components/admin/callout";
import { FormActions, FormField, FormRow, FormSection, FormSelect } from "@/components/admin/form";
import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fieldInputClass } from "@/components/admin/field";

export const Route = createFileRoute("/form")({ component: FormPage });

/** Trang biểu mẫu mẫu — bố cục 2 cột, kiểm tra dữ liệu và trạng thái đang lưu. */
function FormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [bio, setBio] = useState("");
  const [notify, setNotify] = useState(true);
  const [terms, setTerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

  const nameError = touched && name.trim().length < 2 ? "Tên phải có ít nhất 2 ký tự." : undefined;
  const emailError = touched && !email.includes("@") ? "Email không hợp lệ." : undefined;
  const canSubmit = name.trim().length >= 2 && email.includes("@") && terms;

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

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Thêm người dùng"
        description="Biểu mẫu mẫu với đầy đủ kiểu trường thường gặp."
        breadcrumb={
          <Breadcrumb
            items={[{ label: "Người dùng", to: "/users" }, { label: "Thêm mới" }]}
          />
        }
      />

      <div className="rounded-xl border border-border bg-card px-4 py-2 sm:px-6">
        <FormSection
          title="Thông tin cơ bản"
          description="Những thông tin bắt buộc để tạo tài khoản."
        >
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
            <FormField label="Vai trò" htmlFor="role" hint="Quyết định quyền truy cập trong CMS.">
              <FormSelect
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="admin">Quản trị viên</option>
                <option value="editor">Biên tập</option>
                <option value="accountant">Kế toán</option>
                <option value="support">Hỗ trợ</option>
              </FormSelect>
            </FormField>

            <FormField label="Số điện thoại" htmlFor="phone" hint="Không bắt buộc.">
              <Input id="phone" placeholder="09xx xxx xxx" className={fieldInputClass} />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Hồ sơ" description="Thông tin hiển thị với thành viên khác.">
          <FormField
            label="Giới thiệu"
            htmlFor="bio"
            hint={`${bio.length}/280 ký tự`}
          >
            <Textarea
              id="bio"
              value={bio}
              maxLength={280}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Vài dòng về người dùng này..."
              className="min-h-24 rounded-lg px-3 py-2 text-sm"
            />
          </FormField>
        </FormSection>

        <FormSection title="Tuỳ chọn" description="Có thể đổi lại bất cứ lúc nào.">
          <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
            <span className="min-w-0">
              <span className="block text-sm font-medium">Nhận email thông báo</span>
              <span className="block text-xs text-muted-foreground">
                Gửi thông báo khi có hoạt động liên quan tới tài khoản.
              </span>
            </span>
            <Switch checked={notify} onCheckedChange={setNotify} aria-label="Nhận email thông báo" />
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
        </FormSection>

        <FormActions>
          <Button variant="outline" disabled={saving}>
            Huỷ
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu người dùng"}
          </Button>
        </FormActions>
      </div>
    </div>
  );
}
