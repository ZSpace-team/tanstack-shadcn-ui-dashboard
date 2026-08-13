import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, UserCog } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials, useSession } from "@/lib/session";

import AccentSwitcher from "./accent-switcher";
import FontSwitcher from "./font-switcher";
import ThemeSwitcher from "./theme-switcher";

export default function AdminAccountMenu() {
  const navigate = useNavigate();
  const { user, signOut } = useSession();

  if (!user) {
    return (
      <Link
        to="/"
        className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Mở menu tài khoản"
            className="flex h-9 items-center gap-2 rounded-lg bg-background px-1.5 pr-2 transition-colors hover:bg-muted"
          />
        }
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
          {user.initials ?? getInitials(user.name)}
        </span>
        <span className="hidden max-w-36 truncate text-sm font-medium md:block">{user.name}</span>
        <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end" className="w-64 bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
            <UserCog className="size-4" />
            Thông tin cá nhân
          </DropdownMenuItem>

          <ThemeSwitcher />
          <AccentSwitcher />
          <FontSwitcher />

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={signOut}>
            <LogOut className="size-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
