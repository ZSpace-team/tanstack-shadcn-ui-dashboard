import { Menu } from "lucide-react";
import type { ReactNode } from "react";

import AdminAccountMenu from "./admin-account-menu";
import AdminBrand from "./admin-brand";

export default function AdminTopbar({
  onMenuClick,
  children,
}: {
  onMenuClick: () => void;
  /** Chỗ cắm breadcrumb, ô tìm kiếm toàn cục hoặc nút hành động. */
  children?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Mở menu"
        >
          <Menu className="size-5" />
        </button>
        <AdminBrand showSubtitle={false} />
      </div>

      <div className="hidden min-w-0 flex-1 lg:block">{children}</div>

      <div className="ml-auto flex items-center gap-2">
        <AdminAccountMenu />
      </div>
    </header>
  );
}
