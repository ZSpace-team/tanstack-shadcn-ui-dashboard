import { Link, createFileRoute } from "@tanstack/react-router";
import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AuthDivider,
  AuthField,
  AuthPasswordField,
  AuthSocialButtons,
  AuthSubmitButton,
} from "@/components/admin/auth-form";
import {
  AuthCenteredLayout,
  AuthVariantSwitch,
  authVariantItemClass,
} from "@/components/admin/auth-layout";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/auth/login")({ component: LoginPage });

/**
 * Đăng nhập — mẫu căn giữa.
 * Một thẻ duy nhất giữa màn hình: nhanh, gọn, hợp hệ thống nội bộ.
 */
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = email.includes("@");
  const passwordValid = password.length >= 6;
  const emailError = touched && !emailValid ? "Email không hợp lệ." : undefined;
  const passwordError = touched && !passwordValid ? "Mật khẩu tối thiểu 6 ký tự." : undefined;

  const submit = () => {
    setTouched(true);
    if (!emailValid || !passwordValid) {
      toast.error("Vui lòng kiểm tra lại email và mật khẩu.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đăng nhập thành công (giả lập).");
    }, 800);
  };

  return (
    <AuthCenteredLayout
      title="Đăng nhập"
      description="Dùng tài khoản nội bộ để vào trung tâm quản trị."
      variantSwitch={
        <AuthVariantSwitch>
          <Link to="/auth/login" className={authVariantItemClass(true)}>
            Căn giữa
          </Link>
          <Link to="/auth/login-split" className={authVariantItemClass(false)}>
            Chia đôi
          </Link>
        </AuthVariantSwitch>
      }
      footer={
        <span className="text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/auth/register" className="font-medium text-primary hover:underline">
            Đăng ký ngay
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
          onSelect={(provider) => toast.info(`Đăng nhập bằng ${provider} (giả lập).`)}
        />

        <AuthDivider>hoặc dùng email</AuthDivider>

        <AuthField
          id="email"
          label="Email"
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError}
          action={
            <a href="#" className="text-xs font-medium text-primary hover:underline">
              Quên mật khẩu?
            </a>
          }
        />

        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          Ghi nhớ đăng nhập trên thiết bị này
        </label>

        <AuthSubmitButton loading={loading} loadingLabel="Đang đăng nhập...">
          Đăng nhập
        </AuthSubmitButton>
      </form>
    </AuthCenteredLayout>
  );
}
