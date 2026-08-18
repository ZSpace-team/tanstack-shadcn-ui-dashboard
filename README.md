# Admin Template

Bộ giao diện quản trị dùng lại được: shell (sidebar + topbar), bảng dữ liệu, biểu mẫu, tabs,
bộ lọc, phân trang và hệ màu sáng/tối. **Thuần UI** — không có API, không có database,
không phụ thuộc thư viện auth nào.

## Chạy thử

```bash
bun install
bun run dev      # http://localhost:4300
```

Lệnh khác: `bun run build`, `bun run preview`, `bun run check-types`.

Stack: React 19 · TanStack Router · Vite · Tailwind CSS v4 · Base UI · lucide-react · sonner.

## Cấu trúc

```
src/
├─ components/
│  ├─ ui/            Primitive: button, input, badge, table, checkbox, dropdown-menu...
│  └─ admin/         Thành phần CMS: shell, data-table, form, tabs, filter, modal...
├─ routes/           Trang demo (file-based routing của TanStack Router)
├─ lib/              cn(), format số/ngày, context phiên đăng nhập & thông báo
├─ data/mock.ts      Dữ liệu giả — xoá khi nối API thật
└─ styles/globals.css  Toàn bộ tông màu, phông chữ, bo góc
```

## Thành phần có sẵn

**Bố cục** — `AdminSidebar` (thu gọn được, lọc theo quyền, badge số), `AdminTopbar`,
`AdminBrand`, `AdminAccountMenu`, `AdminNotifications` (chuông + badge chưa đọc + dropdown),
`PageHeader`, `Breadcrumb`, `SectionCard` (icon + tiêu đề, thân, footer cho thanh hành động).

**Dữ liệu** — `DataTable` (sắp xếp, chọn nhiều dòng, thanh hành động hàng loạt, skeleton,
trạng thái rỗng), `Pagination`, `FilterBar` (tìm kiếm + select lọc nhanh không nhãn + nút mở
bộ lọc nâng cao + chip xoá nhanh), `ColumnToggle` (chọn cột hiển thị, khoá cột định danh),
`StatCard` (có % tăng giảm), `StatusBadge`, `EmptyState`. `Badge` có 6 biến thể màu,
2 cỡ (`default` cao 22px, `sm` cao 16px) và 4 mức bo góc (`sm`, `md`, `lg`, `full`);
`StatusBadge` nhận luôn `size` và `rounded`.

**Nhập liệu** — `FormSection`, `FormRow`, `FormField` (nhãn, bắt buộc, gợi ý, lỗi),
`FormSelect`, `FormActions` (dính đáy), `MultiSelect` (chọn nhiều), `CheckboxGroup`,
`RadioGroup`, `DateField` (ngày hoặc ngày giờ), `DateRangeField` (khoảng từ — đến),
cùng `Input`, `Textarea`, `Checkbox`, `Switch`.

**Lớp phủ & phản hồi** — `Modal`, `Drawer` (trượt từ phải), `FilterDrawer` (panel lọc nâng cao
với Đặt lại / Áp dụng), `ConfirmDialog`, `Callout`, toast qua `sonner`, `Tooltip`.

**Chuyển tab** — `Tabs` hai kiểu (`line` cho tab chính, `pill` cho bộ lọc phụ) + `TabPanel`.

**Xem chi tiết** — `DetailView` nhận cùng một mảng `groups`, đổi cách hiển thị bằng `variant`:

| Mã view | Hình dạng | Dùng khi |
|---|---|---|
| `grid` | Bảng thuộc tính có viền, cột nhãn nền nhạt | Bản ghi nhiều trường, trang chi tiết |
| `rows` | Nhãn trái / giá trị phải, ngăn bằng đường kẻ | Panel hẹp, drawer, cột phụ |
| `cards` | Mỗi trường một ô rời | Khối tóm tắt đầu trang |
| `inline` | Lưới gọn, không viền | Khối phụ bên trong card |

Xem đủ bốn kiểu ở tab **Kiểu hiển thị** của trang `/tabs`.

**Tiến trình** — `Pipeline` nhận mảng bước (`status`: `done` / `current` / `todo` / `error`),
đổi hình dạng bằng `variant`:

| Mã view | Hình dạng | Dùng khi |
|---|---|---|
| `steps` | Vòng tròn đánh số nối bằng gạch ngang | Quy trình nhiều bước có tên |
| `chevron` | Chip nối bằng mũi tên | Luồng trạng thái ngắn, đặt trong header |
| `bar` | Thanh chia đoạn + đếm bước | Chỗ hẹp, cột phụ |
| `timeline` | Mốc dọc kèm mô tả và thời gian | Nhật ký xử lý một bản ghi |

Xem cả bốn kiểu ở trang `/components`.

**Cá nhân hoá** — `ThemeSwitcher` (sáng/tối/theo hệ thống), `FontSwitcher` (Be Vietnam Pro /
Inter / phông hệ thống), trạng thái thu gọn sidebar — đều lưu vào `localStorage`.

## Trang demo

| Đường dẫn | Minh hoạ |
|---|---|
| `/` | Dashboard: thẻ số liệu, biểu đồ cột thuần CSS, danh sách hoạt động |
| `/users` | Bảng đầy đủ: tab, tìm kiếm nhanh, bộ lọc nâng cao dạng slideover, chọn cột hiển thị, sắp xếp, chọn dòng, phân trang, drawer, xác nhận xoá |
| `/products` | Chuyển đổi bảng ↔ lưới thẻ |
| `/form` | Biểu mẫu chia thành card có header/footer, cột tóm tắt, kiểm tra dữ liệu, trạng thái đang lưu |
| `/tabs` | Trang chi tiết với tab, breadcrumb và 4 kiểu view chi tiết |
| `/components` | Thư viện toàn bộ component và biến thể |
| `/theme` | Bảng tra token màu, bo góc, cỡ chữ |
| `/activity`, `/settings`, `/profile` | Nhật ký, cấu hình, tài khoản cá nhân |

## Tuỳ biến

**Đổi màu thương hiệu** — sửa `--brand` trong `:root` và `.dark` của `src/styles/globals.css`.
Ví dụ xanh dương: `oklch(0.55 0.2 255)`. `--primary` và `--sidebar-primary` trỏ thẳng vào
`--brand`, nên logo, avatar, nút chính, tab đang chọn, checkbox/switch và viền focus đều
đổi theo — kể cả khi người dùng tự chọn tông khác trong menu tài khoản.

**Đổi bo góc** — sửa `--radius` (mặc định `0.625rem`); các cỡ `sm/md/lg/xl` tự suy ra.

**Đổi menu** — sửa `src/components/admin/nav-config.ts`. Mục nào có `permission` sẽ tự ẩn
nếu người dùng thiếu quyền; nhóm rỗng tự biến mất.

**Đổi tên & logo** — sửa giá trị mặc định trong `src/components/admin/admin-brand.tsx`.

**Đổi favicon / icon ứng dụng** — thay 6 file trong `public/` (`favicon.ico`, `favicon-16x16.png`,
`favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`,
`android-chrome-512x512.png`) và sửa tên, `theme_color` trong `public/site.webmanifest`.
Các thẻ `<link>` đã khai báo sẵn trong `index.html`.

**Thêm trạng thái mới** — thêm vào `STATUS_MAP` trong
`src/components/admin/status-badge.tsx` để mọi bảng hiển thị nhất quán.

## Nối backend thật

1. **Phiên đăng nhập** — `src/lib/session.tsx` đang trả dữ liệu giả. Thay phần `useState`
   bằng hook của thư viện auth bạn dùng, giữ nguyên ba trường `user`, `permissions`, `signOut`.
   Không component nào khác cần sửa.
2. **Thông báo** — `src/lib/notifications.tsx` giữ danh sách giả trong bộ nhớ. Thay `useState`
   bằng API (hoặc socket/SSE) và giữ nguyên `items`, `unreadCount`, `markRead`, `markAllRead`,
   `remove`, `clearAll`, `push`; chuông trên topbar không cần sửa.
3. **Dữ liệu** — xoá `src/data/mock.ts`, thay bằng lời gọi API. `DataTable` không tự lọc hay
   sắp xếp: nó nhận `rows`, `sort`, `page` từ bên ngoài nên chuyển sang xử lý phía server
   chỉ là đổi chỗ lấy dữ liệu.
4. **Router** — thay bằng React Router hoặc Next.js được, chỉ cần sửa `Link`/`useNavigate`
   trong `admin-sidebar.tsx`, `admin-account-menu.tsx` và `breadcrumb.tsx`.
