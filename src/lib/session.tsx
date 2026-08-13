import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface SessionUser {
  name: string;
  email: string;
  /** Chữ cái tắt hiển thị trên avatar; tự sinh từ `name` nếu bỏ trống. */
  initials?: string;
}

interface SessionValue {
  user: SessionUser | null;
  /** Mã quyền dùng để lọc menu và ẩn/hiện nút. */
  permissions: string[];
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | undefined>(undefined);

/**
 * Nguồn phiên đăng nhập của template — hiện dùng dữ liệu giả.
 *
 * Khi nối backend thật: thay phần `useState` bên dưới bằng hook của thư viện auth
 * (Better Auth, NextAuth...) và trả về đúng ba trường `user`, `permissions`, `signOut`.
 * Toàn bộ component khác không cần sửa.
 */
export function SessionProvider({
  children,
  user: initialUser = { name: "Nguyễn Quản Trị", email: "admin@example.com" },
  permissions = [
    "dashboard.read",
    "users.read",
    "users.manage",
    "products.read",
    "products.manage",
    "audit.read",
    "config.manage",
  ],
}: {
  children: ReactNode;
  user?: SessionUser | null;
  permissions?: string[];
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);

  const value = useMemo<SessionValue>(
    () => ({
      user,
      permissions: user ? permissions : [],
      signOut: () => setUser(null),
    }),
    [user, permissions],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession phải nằm trong <SessionProvider>");
  return context;
}

export function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(-2)
      .join("")
      .toUpperCase() || "?"
  );
}
