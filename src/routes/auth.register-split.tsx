import { Link, createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Building2, LockKeyhole, Mail, Rocket, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AuthDivider,
  AuthField,
  AuthPasswordField,
  AuthSocialButtons,
  AuthSubmitButton,
  PasswordStrength,
  getPasswordScore,
} from "@/components/admin/auth-form";
import {
  AuthSplitLayout,
  AuthVariantSwitch,
  authVariantItemClass,
  type AuthPanelPoint,
} from "@/components/admin/auth-layout";
import { FormField, FormRow, FormSelect } from "@/components/admin/form";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/auth/register-split")({ component: RegisterSplitPage });

const PANEL_POINTS: AuthPanelPoint[] = [
  {
    icon: Rocket,
    title: "Dùng thử 14 ngày",
    description: "Đầy đủ tính năng, không cần thẻ thanh toán.",
  },
  {
    icon: Building2,
    title: "Nhiều chi nhánh, một tài khoản",
    description: "Mời đồng nghiệp và phân quyền theo từng phòng ban.",
  },
  {
    icon: BadgeCheck,
    title: "Chuyển dữ liệu miễn phí",
    description: "Đội hỗ trợ nhập giúp dữ liệu cũ trong ngày đầu tiên.",
  },
];

const ROLES = [
  { value: "owner", label: "Chủ doanh nghiệp" },
  { value: "manager", label: "Quản lý vận hành" },
  { value: "accountant", label: "Kế toán" },
  { value: "staff", label: "Nhân viên" },
];

/**
 * Đăng ký — mẫu chia đôi màn hình.
 * Nhiều trường hơn bản căn giữa (công ty, vai trò, xác nhận mật khẩu) vì cột form
 * đứng riêng nên form dài vẫn dễ đọc.
 */
function RegisterSplitPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameValid = name.trim().length >= 2;
  const emailValid = email.includes("@");
  const passwordValid = password.length >= 8 && getPasswordScore(password) >= 2;
  const confirmValid = confirm.length > 0 && confirm === password;

  const nameError = touched && !nameValid ? "Tên phải có ít nhất 2 ký tự." : undefined;
  const emailError = touched && !emailValid ? "Email không hợp lệ." : undefined;
  const passwordError =
    touched && !passwordValid ? "Mật khẩu cần từ 8 ký tự và nên có chữ hoa hoặc chữ số." : undefined;
  const confirmError =
    (touched || confirm.length > 0) && !confirmValid ? "Hai mật khẩu chưa khớp nhau." : undefined;
  const termsError = touched && !terms;

  const submit = () => {
    setTouched(true);
    if (!nameValid || !emailValid || !passwordValid || !confirmValid || !terms) {
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đã tạo tài khoản (giả lập).");
    }, 800);
  };

  return (
    <AuthSplitLayout
      title="Tạo tài khoản"
      description="Điền thông tin bên dưới để mở không gian làm việc cho đội của bạn."
      panelEyebrow="Dùng thử miễn phí"
      panelHeadline="Mở không gian quản trị cho cả đội trong vài phút."
      panelDescription="Không cần cài đặt máy chủ, không cần lập trình viên — tạo tài khoản là dùng được ngay."
      panelPoints={PANEL_POINTS}
      panelQuote={{
        text: "Chúng tôi tạo tài khoản buổi sáng và chốt đơn trên hệ thống mới ngay chiều hôm đó.",
        author: "Lê Thu Hà",
        role: "Giám đốc chuỗi bán lẻ",
      }}
      variantSwitch={
        <AuthVariantSwitch>
          <Link to="/auth/register" className={authVariantItemClass(false)}>
            Căn giữa
          </Link>
          <Link to="/auth/register-split" className={authVariantItemClass(true)}>
            Chia đôi
          </Link>
        </AuthVariantSwitch>
      }
      footer={
        <span className="text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/auth/login-split" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </span>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="space-y-5"
      >
        <AuthField
          id="name"
          label="Họ và tên"
          icon={UserRound}
          required
          autoComplete="name"
          placeholder="Nguyễn Văn A"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={nameError}
        />

        <FormRow>
          <AuthField
            id="company"
            label="Công ty"
            icon={Building2}
            autoComplete="organization"
            placeholder="Công ty ABC"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />

          <FormField label="Vai trò" htmlFor="role">
            <FormSelect
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-10 rounded-lg"
            >
              {ROLES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </FormRow>

        <AuthField
          id="email"
          label="Email công việc"
          type="email"
          icon={Mail}
          required
          autoComplete="email"
          placeholder="ten@congty.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
        />

        <AuthPasswordField
          id="password"
          label="Mật khẩu"
          icon={LockKeyhole}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError}
        >
          <PasswordStrength value={password} />
        </AuthPasswordField>

        <AuthPasswordField
          id="confirm"
          label="Nhập lại mật khẩu"
          icon={LockKeyhole}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={confirmError}
        />

        <label className="flex items-start gap-2.5 text-sm">
          <Checkbox
            checked={terms}
            onCheckedChange={(checked) => setTerms(checked === true)}
            className="mt-0.5"
            aria-invalid={termsError}
          />
          <span>
            Tôi đồng ý với{" "}
            <a href="#" className="text-primary hover:underline">
              điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="#" className="text-primary hover:underline">
              chính sách bảo mật
            </a>
            . <span className="text-destructive">*</span>
          </span>
        </label>
        {termsError && (
          <p className="-mt-3 text-xs font-medium text-destructive">
            Bạn cần đồng ý với điều khoản trước khi tạo tài khoản.
          </p>
        )}

        <AuthSubmitButton loading={loading} loadingLabel="Đang tạo tài khoản...">
          Tạo tài khoản
        </AuthSubmitButton>

        <AuthDivider>hoặc đăng ký nhanh với</AuthDivider>

        <AuthSocialButtons
          disabled={loading}
          onSelect={(provider) => toast.info(`Đăng ký bằng ${provider} (giả lập).`)}
        />
      </form>
    </AuthSplitLayout>
  );
}
