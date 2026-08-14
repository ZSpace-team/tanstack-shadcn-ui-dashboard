import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

import { AccentPreferenceProvider } from "@/components/admin/accent-preference-provider";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";
import { FontPreferenceProvider } from "@/components/admin/font-preference-provider";
import { Toaster } from "@/components/ui/sonner";
import { NotificationsProvider } from "@/lib/notifications";
import { SessionProvider, useSession } from "@/lib/session";

export const Route = createRootRoute({ component: RootLayout });

const SIDEBAR_STORAGE_KEY = "admin-template-sidebar-collapsed";

function RootLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="admin-template-theme"
      disableTransitionOnChange
    >
      <FontPreferenceProvider>
        <AccentPreferenceProvider>
          <SessionProvider>
            <NotificationsProvider>
              <AdminShell />
              <Toaster position="top-right" />
            </NotificationsProvider>
          </SessionProvider>
        </AccentPreferenceProvider>
      </FontPreferenceProvider>
    </ThemeProvider>
  );
}

/**
 * Bố cục chính: sidebar cố định bên trái, topbar dính trên, nội dung cuộn riêng.
 * Đây là khung mà mọi trang trong `routes/` được render vào.
 */
function AdminShell() {
  const { permissions } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1");
  }, []);

  const toggleCollapse = () =>
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      return next;
    });

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        permissions={permissions}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
