"use client";

import { createContext, useContext, useState } from "react";

/**
 * Tông màu chủ đạo — ghi đè `--brand` trong globals.css.
 * `swatch` chỉ dùng để vẽ ô màu xem trước trong menu chọn.
 */
export const ACCENT_PREFERENCES = [
  {
    value: "coral",
    label: "Đỏ san hô",
    description: "Tông mặc định của template",
    swatch: "oklch(0.59 0.22 18)",
  },
  {
    value: "amber",
    label: "Cam hổ phách",
    description: "Ấm, hợp trang bán hàng",
    swatch: "oklch(0.59 0.15 55)",
  },
  {
    value: "emerald",
    label: "Xanh lá",
    description: "Gợi tăng trưởng, tài chính",
    swatch: "oklch(0.59 0.14 155)",
  },
  {
    value: "teal",
    label: "Xanh ngọc",
    description: "Dịu mắt, hợp bảng số liệu",
    swatch: "oklch(0.59 0.11 200)",
  },
  {
    value: "blue",
    label: "Xanh dương",
    description: "Trung tính, thiên hướng doanh nghiệp",
    swatch: "oklch(0.59 0.19 258)",
  },
  {
    value: "violet",
    label: "Tím",
    description: "Nổi bật, thiên hướng sản phẩm",
    swatch: "oklch(0.59 0.21 300)",
  },
] as const;

export type AccentPreference = (typeof ACCENT_PREFERENCES)[number]["value"];

const DEFAULT_ACCENT: AccentPreference = "coral";
const STORAGE_KEY = "admin-template-accent";

function isAccentPreference(value: string | undefined | null): value is AccentPreference {
  return ACCENT_PREFERENCES.some((option) => option.value === value);
}

function getInitialAccent(): AccentPreference {
  if (typeof document === "undefined") return DEFAULT_ACCENT;
  const value = document.documentElement.dataset.accent;
  return isAccentPreference(value) ? value : DEFAULT_ACCENT;
}

function applyAccent(accent: AccentPreference) {
  document.documentElement.dataset.accent = accent;
}

const AccentPreferenceContext = createContext<
  | {
      accent: AccentPreference;
      setAccent: (accent: AccentPreference) => void;
    }
  | undefined
>(undefined);

export function AccentPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentPreference>(getInitialAccent);

  const setAccent = (nextAccent: AccentPreference) => {
    setAccentState(nextAccent);
    applyAccent(nextAccent);
    try {
      localStorage.setItem(STORAGE_KEY, nextAccent);
    } catch {
      // Tông màu vẫn được áp dụng cho phiên hiện tại khi storage không khả dụng.
    }
  };

  return (
    <AccentPreferenceContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentPreferenceContext.Provider>
  );
}

export function useAccentPreference() {
  const context = useContext(AccentPreferenceContext);
  if (!context) {
    throw new Error("useAccentPreference must be used inside AccentPreferenceProvider");
  }
  return context;
}

export { isAccentPreference };
