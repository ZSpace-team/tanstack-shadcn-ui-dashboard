"use client";

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Type } from "lucide-react";
import { useEffect, useState } from "react";

import {
  FONT_PREFERENCES,
  isFontPreference,
  useFontPreference,
} from "./font-preference-provider";

export default function FontSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { font, setFont } = useFontPreference();

  useEffect(() => setMounted(true), []);

  const activeOption =
    FONT_PREFERENCES.find((option) => option.value === font) ?? FONT_PREFERENCES[0];

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="text-sm" disabled={!mounted}>
        <Type className="size-4" />
        <span>Phông chữ</span>
        {mounted && (
          <span className="ml-auto max-w-24 truncate text-xs text-muted-foreground">
            {activeOption.label}
          </span>
        )}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-72">
        <DropdownMenuLabel>Phông chữ giao diện</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={font}
          onValueChange={(value) => {
            if (isFontPreference(value)) setFont(value);
          }}
        >
          {FONT_PREFERENCES.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="items-start text-sm"
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-xs font-semibold"
                style={{ fontFamily: option.stack }}
              >
                Aa
              </span>
              <span className="min-w-0">
                <span className="block font-medium" style={{ fontFamily: option.stack }}>
                  {option.label}
                </span>
                <span className="block text-xs text-muted-foreground">{option.description}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
