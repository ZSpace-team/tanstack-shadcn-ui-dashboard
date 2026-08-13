import { Link } from "@tanstack/react-router";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

import AdminBrand from "./admin-brand";
import { NAV_GROUPS } from "./nav-config";

export default function AdminSidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
  permissions,
}: {
  /** Trạng thái mở trên mobile (overlay). */
  open: boolean;
  onClose: () => void;
  /** Thu gọn còn icon trên desktop. */
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Danh sách mã quyền của người đang đăng nhập. */
  permissions: string[];
}) {
  const allowed = new Set(permissions);

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || allowed.has(item.permission)),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 lg:static lg:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-60",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "relative flex h-14 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-3",
            collapsed && "lg:justify-center lg:px-2",
          )}
        >
          <AdminBrand compact={collapsed} className="min-w-0 flex-1 lg:flex-none" />

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="size-4" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            className={cn(
              "hidden shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground lg:flex",
              collapsed &&
                "absolute top-1/2 -right-3 z-10 -translate-y-1/2 rounded-full border border-sidebar-border bg-sidebar shadow-sm",
            )}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        </div>

        <nav className="admin-sidebar-nav flex-1 overflow-y-auto px-2 py-4">
          {groups.map((group) => (
            <div key={group.label} className="mb-5">
              {collapsed ? (
                <div className="mx-1 mb-2 border-t border-sidebar-border/60" />
              ) : (
                <p className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{
                      className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    }}
                    inactiveProps={{
                      className:
                        "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                    }}
                    className={cn(
                      "flex items-center rounded-md text-sm transition-colors",
                      collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-2.5 py-2",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto rounded-full bg-brand/15 px-1.5 py-0.5 text-[11px] font-semibold text-brand">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
