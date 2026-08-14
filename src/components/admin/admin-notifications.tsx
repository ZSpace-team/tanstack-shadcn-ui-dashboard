import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BellOff,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelative } from "@/lib/format";
import { useNotifications, type NotificationItem, type NotificationTone } from "@/lib/notifications";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const TONE: Record<NotificationTone, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  success: {
    icon: CircleCheck,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  warning: { icon: TriangleAlert, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  danger: { icon: CircleAlert, className: "bg-destructive/10 text-destructive" },
};

const TABS = [
  { value: "all", label: "Tất cả" },
  { value: "unread", label: "Chưa đọc" },
] as const;

/**
 * Chuông thông báo trên topbar: badge số chưa đọc + dropdown danh sách.
 * Dữ liệu lấy từ `useNotifications()` nên đổi sang API thật không cần sửa component này.
 */
export default function AdminNotifications() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const [tab, setTab] = useState<"all" | "unread">("all");

  if (!user) return null;

  const visible = tab === "unread" ? items.filter((item) => !item.read) : items;

  const openItem = (item: NotificationItem) => {
    markRead(item.id);
    if (item.href) navigate({ to: item.href });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={unreadCount > 0 ? `Thông báo, ${unreadCount} chưa đọc` : "Thông báo"}
            className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
          />
        }
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] leading-none font-semibold text-brand-foreground ring-2 ring-background tabular-nums">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-[min(22rem,calc(100vw-1.5rem))] bg-card p-0"
      >
        {/* Popup tự cuộn khi danh sách dài — header/footer dính lại để không mất chỗ điều khiển. */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-card px-3 py-2.5">
          <div className="flex items-center gap-1">
            {TABS.map((item) => {
              const active = item.value === tab;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTab(item.value)}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  {item.value === "unread" && unreadCount > 0 && (
                    <span className="ml-1 tabular-nums">({unreadCount})</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <CheckCheck className="size-3.5" />
            Đọc hết
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <BellOff className="size-4" />
            </span>
            <p className="text-sm font-medium">
              {tab === "unread" ? "Không còn thông báo chưa đọc" : "Chưa có thông báo"}
            </p>
            <p className="text-xs text-muted-foreground">
              Thông báo hệ thống và hoạt động của đồng đội sẽ hiện ở đây.
            </p>
          </div>
        ) : (
          <div className="p-1">
            {visible.map((item) => {
              const tone = TONE[item.tone];
              const Icon = tone.icon;
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => openItem(item)}
                  className={cn(
                    "items-start gap-3 px-2 py-2.5",
                    !item.read && "bg-brand/5 focus:bg-brand/10",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                      tone.className,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn("block text-xs", item.read ? "font-medium" : "font-semibold")}
                    >
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {formatRelative(item.at)}
                    </span>
                  </span>

                  {!item.read && (
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                      aria-label="Chưa đọc"
                    />
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}

        <div className="sticky bottom-0 border-t border-border bg-card p-1">
          <DropdownMenuItem
            onClick={() => navigate({ to: "/activity" })}
            className="justify-center text-xs font-medium"
          >
            Xem toàn bộ nhật ký
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
