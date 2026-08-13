"use client";

import { createContext, useContext, useState } from "react";

export const FONT_PREFERENCES = [
  {
    value: "be-vietnam-pro",
    label: "Be Vietnam Pro",
    description: "Tối ưu cho tiếng Việt",
    stack: '"Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif',
  },
  {
    value: "inter",
    label: "Inter",
    description: "Gọn và trung tính",
    stack: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  },
  {
    value: "system",
    label: "System UI",
    description: "Phông chữ mặc định của thiết bị",
    stack:
      '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
] as const;

export type FontPreference = (typeof FONT_PREFERENCES)[number]["value"];

const DEFAULT_FONT: FontPreference = "be-vietnam-pro";
const STORAGE_KEY = "admin-template-font";

function isFontPreference(value: string | undefined | null): value is FontPreference {
  return FONT_PREFERENCES.some((option) => option.value === value);
}

function getInitialFont(): FontPreference {
  if (typeof document === "undefined") return DEFAULT_FONT;
  const value = document.documentElement.dataset.font;
  return isFontPreference(value) ? value : DEFAULT_FONT;
}

function applyFont(font: FontPreference) {
  document.documentElement.dataset.font = font;
}

const FontPreferenceContext = createContext<
  | {
      font: FontPreference;
      setFont: (font: FontPreference) => void;
    }
  | undefined
>(undefined);

export const fontPreferenceInitializer = `
  (function () {
    try {
      var value = localStorage.getItem("${STORAGE_KEY}");
      if (value === "be-vietnam-pro" || value === "inter" || value === "system") {
        document.documentElement.dataset.font = value;
      }
    } catch (_) {}
  })();
`;

export function FontPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontPreference>(getInitialFont);

  const setFont = (nextFont: FontPreference) => {
    setFontState(nextFont);
    applyFont(nextFont);
    try {
      localStorage.setItem(STORAGE_KEY, nextFont);
    } catch {
      // Font vẫn được áp dụng cho phiên hiện tại khi storage không khả dụng.
    }
  };

  return (
    <FontPreferenceContext.Provider value={{ font, setFont }}>
      {children}
    </FontPreferenceContext.Provider>
  );
}

export function useFontPreference() {
  const context = useContext(FontPreferenceContext);
  if (!context) {
    throw new Error("useFontPreference must be used inside FontPreferenceProvider");
  }
  return context;
}

export { isFontPreference };
