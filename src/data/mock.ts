/**
 * Dữ liệu giả cho các trang demo. Xoá cả file này khi nối API thật —
 * không component nào trong `components/` phụ thuộc vào nó.
 */

export interface MockUser extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "disabled";
  department: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface MockProduct extends Record<string, unknown> {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "published" | "draft" | "archived";
  updatedAt: string;
}

export interface MockActivity extends Record<string, unknown> {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

const ROLES = ["Quản trị viên", "Biên tập", "Kế toán", "Hỗ trợ"];
const DEPARTMENTS = ["Vận hành", "Kinh doanh", "Kỹ thuật", "Chăm sóc khách hàng"];
const FIRST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi"];
const LAST_NAMES = [
  "Minh Anh",
  "Thu Hà",
  "Quốc Bảo",
  "Hải Yến",
  "Tuấn Kiệt",
  "Ngọc Mai",
  "Đức Thắng",
  "Khánh Linh",
];
const STATUSES: MockUser["status"][] = ["active", "active", "active", "pending", "disabled"];

/** Sinh cố định theo index để danh sách không đổi giữa các lần render. */
function daysAgo(days: number) {
  return new Date(Date.UTC(2026, 7, 10) - days * 86400000).toISOString();
}

export const MOCK_USERS: MockUser[] = Array.from({ length: 47 }, (_, index) => ({
  id: `user-${index + 1}`,
  name: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[index % LAST_NAMES.length]}`,
  email: `nguoidung${index + 1}@example.com`,
  role: ROLES[index % ROLES.length]!,
  status: STATUSES[index % STATUSES.length]!,
  department: DEPARTMENTS[index % DEPARTMENTS.length]!,
  lastActiveAt: daysAgo(index % 30),
  createdAt: daysAgo(30 + (index % 200)),
}));

const CATEGORIES = ["Điện tử", "Thời trang", "Gia dụng", "Sách", "Thể thao"];
const PRODUCT_STATUSES: MockProduct["status"][] = ["published", "published", "draft", "archived"];

export const MOCK_PRODUCTS: MockProduct[] = Array.from({ length: 32 }, (_, index) => ({
  id: `product-${index + 1}`,
  name: `Sản phẩm mẫu ${index + 1}`,
  sku: `SKU-${String(index + 1).padStart(4, "0")}`,
  category: CATEGORIES[index % CATEGORIES.length]!,
  price: 150000 + (index % 12) * 85000,
  stock: (index * 7) % 120,
  status: PRODUCT_STATUSES[index % PRODUCT_STATUSES.length]!,
  updatedAt: daysAgo(index % 14),
}));

export const MOCK_ACTIVITIES: MockActivity[] = [
  { id: "a1", actor: "Nguyễn Minh Anh", action: "đã tạo", target: "người dùng #128", at: daysAgo(0) },
  { id: "a2", actor: "Trần Thu Hà", action: "đã cập nhật", target: "sản phẩm SKU-0012", at: daysAgo(0) },
  { id: "a3", actor: "Lê Quốc Bảo", action: "đã vô hiệu hoá", target: "tài khoản #77", at: daysAgo(1) },
  { id: "a4", actor: "Phạm Hải Yến", action: "đã xuất", target: "báo cáo tháng 7", at: daysAgo(2) },
  { id: "a5", actor: "Hoàng Tuấn Kiệt", action: "đã đổi", target: "cấu hình thanh toán", at: daysAgo(3) },
  { id: "a6", actor: "Vũ Ngọc Mai", action: "đã duyệt", target: "yêu cầu hoàn tiền #45", at: daysAgo(4) },
];

/** Doanh thu 12 tháng — dùng cho biểu đồ cột thuần CSS trên dashboard. */
export const MOCK_REVENUE = [
  { month: "T1", value: 42 },
  { month: "T2", value: 51 },
  { month: "T3", value: 47 },
  { month: "T4", value: 63 },
  { month: "T5", value: 58 },
  { month: "T6", value: 72 },
  { month: "T7", value: 69 },
  { month: "T8", value: 84 },
  { month: "T9", value: 78 },
  { month: "T10", value: 91 },
  { month: "T11", value: 87 },
  { month: "T12", value: 100 },
];
