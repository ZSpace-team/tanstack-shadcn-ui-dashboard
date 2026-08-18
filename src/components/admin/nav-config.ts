import {
  Activity,
  Gauge,
  LayoutGrid,
  ListChecks,
  LockKeyhole,
  LogIn,
  Package,
  Settings,
  SlidersHorizontal,
  SquarePen,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Mã quyền; bỏ trống nghĩa là ai cũng thấy. */
  permission?: string;
  /** Số hiển thị bên phải (thông báo, hàng chờ...). */
  badge?: string | number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Cấu trúc menu bên trái. Thêm/bớt nhóm và mục ngay tại đây —
 * sidebar tự lọc theo quyền và tự ẩn nhóm rỗng.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [{ to: "/", label: "Bảng điều khiển", icon: Gauge, permission: "dashboard.read" }],
  },
  {
    label: "Dữ liệu",
    items: [
      { to: "/users", label: "Người dùng", icon: Users, permission: "users.read", badge: 12 },
      { to: "/products", label: "Sản phẩm", icon: Package, permission: "products.read" },
      { to: "/form", label: "Biểu mẫu", icon: SquarePen, permission: "products.read" },
      { to: "/tabs", label: "Tabs & chi tiết", icon: ListChecks, permission: "products.read" },
    ],
  },
  {
    label: "Thư viện giao diện",
    items: [
      { to: "/components", label: "Component", icon: LayoutGrid },
      { to: "/theme", label: "Tông màu", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Xác thực",
    items: [
      { to: "/auth/login", label: "Đăng nhập", icon: LogIn },
      { to: "/auth/register", label: "Đăng ký", icon: UserPlus },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { to: "/activity", label: "Nhật ký", icon: Activity, permission: "audit.read" },
      { to: "/settings", label: "Cấu hình", icon: Settings, permission: "config.manage" },
      { to: "/profile", label: "Tài khoản", icon: LockKeyhole },
    ],
  },
];
