import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Callout } from "@/components/admin/callout";
import { fieldInputClass } from "@/components/admin/field";
import { FormActions, FormField, FormRow } from "@/components/admin/form";
import PageHeader from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { Tabs, TabPanel } from "@/components/admin/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials, useSession } from "@/lib/session";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

/** Trang tài khoản cá nhân — hồ sơ, đổi mật khẩu và bảo mật hai lớp. */
function ProfilePage() {
  const { user } = useSession();
  const [tab, setTab] = useState("profile");

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Tài khoản" description="Thông tin cá nhân và thiết lập bảo mật." />

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-semibold text-brand-foreground">
          {user ? getInitials(user.name) : "?"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{user?.name ?? "Khách"}</p>
          <p className="truncate text-sm text-muted-foreground">{user?.email ?? "—"}</p>
        </div>
        <Button variant="outline" className="ml-auto">
          Đổi ảnh
        </Button>
      </div>

      <Tabs
        items={[
          { value: "profile", label: "Hồ sơ" },
          { value: "password", label: "Mật khẩu", icon: KeyRound },
          { value: "2fa", label: "Bảo mật 2 lớp", icon: ShieldCheck },
        ]}
        value={tab}
        onValueChange={setTab}
      />

      <TabPanel value="profile" activeValue={tab}>
        <SectionCard title="Thông tin cá nhân">
          <div className="space-y-5">
            <FormRow>
              <FormField label="Họ và tên" htmlFor="profile-name">
                <Input id="profile-name" defaultValue={user?.name} className={fieldInputClass} />
              </FormField>
              <FormField label="Email" htmlFor="profile-email" hint="Dùng để đăng nhập.">
                <Input
                  id="profile-email"
                  type="email"
                  defaultValue={user?.email}
                  className={fieldInputClass}
                />
              </FormField>
            </FormRow>

            <FormActions>
              <Button onClick={() => toast.success("Đã cập nhật hồ sơ (giả lập).")}>Lưu</Button>
            </FormActions>
          </div>
        </SectionCard>
      </TabPanel>

      <TabPanel value="password" activeValue={tab}>
        <SectionCard title="Đổi mật khẩu" description="Mật khẩu mới cần tối thiểu 12 ký tự.">
          <div className="space-y-5">
            <FormField label="Mật khẩu hiện tại" htmlFor="current-password" required>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                className={fieldInputClass}
              />
            </FormField>

            <FormRow>
              <FormField label="Mật khẩu mới" htmlFor="new-password" required>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  className={fieldInputClass}
                />
              </FormField>
              <FormField label="Nhập lại mật khẩu mới" htmlFor="confirm-password" required>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  className={fieldInputClass}
                />
              </FormField>
            </FormRow>

            <FormActions>
              <Button onClick={() => toast.success("Đã đổi mật khẩu (giả lập).")}>
                Đổi mật khẩu
              </Button>
            </FormActions>
          </div>
        </SectionCard>
      </TabPanel>

      <TabPanel value="2fa" activeValue={tab}>
        <div className="space-y-4">
          <Callout tone="warning" title="Chưa bật xác thực hai lớp">
            Bật 2FA để yêu cầu thêm mã từ ứng dụng xác thực mỗi lần đăng nhập.
          </Callout>

          <SectionCard title="Ứng dụng xác thực">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Smartphone className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  Dùng Google Authenticator, 1Password hoặc ứng dụng TOTP bất kỳ để quét mã QR và
                  sinh mã 6 số.
                </p>
                <Button className="mt-3" onClick={() => toast.info("Đây là template — chưa gắn 2FA thật.")}>
                  Bật xác thực hai lớp
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </TabPanel>
    </div>
  );
}
