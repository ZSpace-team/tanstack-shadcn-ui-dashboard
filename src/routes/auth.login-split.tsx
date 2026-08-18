import { Link, createFileRoute } from "@tanstack/react-router";
import { Gauge, LockKeyhole, Mail, ShieldCheck, Smartphone, Zap } from "lucide-react";
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
  AuthSplitLayout,
  AuthVariantSwitch,
  authVariantItemClass,
  type AuthPanelPoint,
} from "@/components/admin/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/auth/login-split")({ component: LoginSplitPage });

const PANEL_POINTS: AuthPanelPoint[] = [
  {
    icon: Gauge,
    title: "Một nơi cho mọi số liệu",
    description: "Doanh thu, đơn hàng và hoạt động cập nhật liên tục trên cùng bảng điều khiển.",
  },
  {
    icon: ShieldCheck,
    title: "Phân quyền tới từng thao tác",
    description: "Menu và nút bấm tự ẩn theo quyền của người đang đăng nhập.",
  },
  {
    icon: Zap,
    title: "Thao tác hàng loạt",
    description: "Lọc, chọn nhiều dòng và xử lý cả nhóm bản ghi chỉ trong một lượt.",
  },
];

/**
 * Đăng nhập — mẫu chia đôi màn hình.
 * Nửa trái giới thiệu sản phẩm, nửa phải là form. Hợp với sản phẩm bán ra ngoài,
 * nơi trang đăng nhập cũng là trang tiếp thị.
 */
function LoginSplitPage() {
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
    <AuthSplitLayout
      title="Chào mừng trở lại"
      description="Đăng nhập để tiếp tục quản lý hệ thống."
      panelEyebrow="Admin Template"
      panelHeadline="Toàn bộ hoạt động của doanh nghiệp, gọn trong một màn hình."
      panelDescription="Bộ giao diện quản trị dựng sẵn: bảng dữ liệu, biểu mẫu, bộ lọc và phân quyền."
      panelPoints={PANEL_POINTS}
      panelQuote={{
        text: "Đội vận hành chuyển sang bảng điều khiển mới trong một buổi chiều, không ai cần hướng dẫn thêm.",
        author: "Trần Minh Khoa",
        role: "Trưởng phòng vận hành",
      }}
      variantSwitch={
        <AuthVariantSwitch>
          <Link to="/auth/login" className={authVariantItemClass(false)}>
            Căn giữa
          </Link>
          <Link to="/auth/login-split" className={authVariantItemClass(true)}>
            Chia đôi
          </Link>
        </AuthVariantSwitch>
      }
      footer={
        <span className="text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/auth/register-split" className="font-medium text-primary hover:underline">
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

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-lg text-sm"
          disabled={loading}
          onClick={() => toast.info("Đã gửi mã đăng nhập một lần (giả lập).")}
        >
          <Smartphone className="size-4" />
          Gửi mã đăng nhập một lần
        </Button>

        <AuthDivider>hoặc tiếp tục với</AuthDivider>

        <AuthSocialButtons
          disabled={loading}
          onSelect={(provider) => toast.info(`Đăng nhập bằng ${provider} (giả lập).`)}
        />
      </form>
    </AuthSplitLayout>
  );
}
