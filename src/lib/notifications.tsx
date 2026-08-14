import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NotificationTone = "info" | "success" | "warning" | "danger";

export interface NotificationItem {
  id: string;
  /** Quyết định màu và icon của dòng thông báo. */
  tone: NotificationTone;
  title: string;
  description?: string;
  /** Thời điểm dạng ISO — hiển thị bằng `formatRelative`. */
  at: string;
  read: boolean;
  /** Đường dẫn mở khi bấm vào thông báo. */
  href?: string;
}

interface NotificationsValue {
  items: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
  /** Thêm thông báo mới lên đầu danh sách (demo hoặc realtime). */
  push: (item: Omit<NotificationItem, "id" | "read" | "at"> & { at?: string }) => void;
}

const NotificationsContext = createContext<NotificationsValue | undefined>(undefined);

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

/** Dữ liệu giả — thay bằng dữ liệu từ API khi nối backend. */
const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    tone: "warning",
    title: "5 đơn hàng đang chờ duyệt",
    description: "Hàng đợi duyệt vượt ngưỡng cảnh báo trong 30 phút qua.",
    at: minutesAgo(4),
    read: false,
    href: "/products",
  },
  {
    id: "n2",
    tone: "success",
    title: "Đã xuất báo cáo tháng 7",
    description: "File CSV 2.418 dòng đã sẵn sàng tải xuống.",
    at: minutesAgo(38),
    read: false,
  },
  {
    id: "n3",
    tone: "danger",
    title: "Đồng bộ kho thất bại",
    description: "Không kết nối được máy chủ kho lúc 09:12. Hệ thống sẽ thử lại sau 15 phút.",
    at: minutesAgo(96),
    read: false,
    href: "/activity",
  },
  {
    id: "n4",
    tone: "info",
    title: "Trần Thu Hà đã cập nhật sản phẩm SKU-0012",
    description: "Giá bán đổi từ 850.000 ₫ sang 790.000 ₫.",
    at: minutesAgo(240),
    read: true,
    href: "/products",
  },
  {
    id: "n5",
    tone: "info",
    title: "Có 3 người dùng mới chờ cấp quyền",
    description: "Tài khoản đăng ký qua biểu mẫu nội bộ, chưa gán vai trò.",
    at: minutesAgo(1500),
    read: true,
    href: "/users",
  },
  {
    id: "n6",
    tone: "success",
    title: "Sao lưu dữ liệu hoàn tất",
    description: "Bản sao lưu hằng ngày lưu thành công lúc 02:00.",
    at: minutesAgo(2160),
    read: true,
  },
];

/**
 * Nguồn thông báo của template — hiện dùng dữ liệu giả trong bộ nhớ.
 *
 * Khi nối backend thật: thay `useState` bên dưới bằng lời gọi API (hoặc socket/SSE)
 * và giữ nguyên các trường trả về. Chuông trên topbar không cần sửa.
 */
export function NotificationsProvider({
  children,
  items: initialItems = DEMO_NOTIFICATIONS,
}: {
  children: ReactNode;
  items?: NotificationItem[];
}) {
  const [items, setItems] = useState<NotificationItem[]>(initialItems);
  const nextId = useRef(1);

  const markRead = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const push = useCallback<NotificationsValue["push"]>((item) => {
    const id = `local-${nextId.current++}`;
    setItems((current) => [
      { ...item, id, read: false, at: item.at ?? new Date().toISOString() },
      ...current,
    ]);
  }, []);

  const value = useMemo<NotificationsValue>(
    () => ({
      items,
      unreadCount: items.filter((item) => !item.read).length,
      markRead,
      markAllRead,
      remove,
      clearAll,
      push,
    }),
    [items, markRead, markAllRead, remove, clearAll, push],
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotifications phải nằm trong <NotificationsProvider>");
  return context;
}
