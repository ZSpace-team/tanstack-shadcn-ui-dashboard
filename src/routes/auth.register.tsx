import { Link, createFileRoute } from "@tanstack/react-router";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
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
  AuthCenteredLayout,
  AuthVariantSwitch,
  authVariantItemClass,
} from "@/components/admin/auth-layout";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/auth/register")({ component: RegisterPage });

/**
 * Đăng ký — mẫu căn giữa.
 * Ít trường nhất có thể: tên, email, mật khẩu. Mọi thứ khác để lại cho bước
 * hoàn thiện hồ sơ sau khi vào hệ thống.
 */
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameValid = name.trim().length >= 2;
  const emailValid = email.includes("@");
  const passwordValid = password.length >= 8 && getPasswordScore(password) >= 2;

  const nameError = touched && !nameValid ? "Tên phải có ít nhất 2 ký tự." : undefined;
  const emailError = touched && !emailValid ? "Email không hợp lệ." : undefined;
  const passwordError =
    touched && !passwordValid ? "Mật khẩu cần từ 8 ký tự và nên có chữ hoa hoặc chữ số." : undefined;
  const termsError = touched && !terms;

  const submit = () => {
    setTouched(true);
    if (!nameValid || !emailValid || !passwordValid || !terms) {
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
    <AuthCenteredLayout
      title="Tạo tài khoản"
      description="Mất chưa tới một phút để bắt đầu."
      variantSwitch={
        <AuthVariantSwitch>
          <Link to="/auth/register" className={authVariantItemClass(true)}>
            Căn giữa
          </Link>
          <Link to="/auth/register-split" className={authVariantItemClass(false)}>
            Chia đôi
          </Link>
        </AuthVariantSwitch>
      }
      footer={
        <span className="text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
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
        <AuthSocialButtons
          disabled={loading}
          onSelect={(provider) => toast.info(`Đăng ký bằng ${provider} (giả lập).`)}
        />

        <AuthDivider>hoặc dùng email</AuthDivider>

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
      </form>
    </AuthCenteredLayout>
  );
}
