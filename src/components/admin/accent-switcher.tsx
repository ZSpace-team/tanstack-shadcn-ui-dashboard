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
import { SwatchBook } from "lucide-react";
import { useEffect, useState } from "react";

import {
  ACCENT_PREFERENCES,
  isAccentPreference,
  useAccentPreference,
} from "./accent-preference-provider";

export default function AccentSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { accent, setAccent } = useAccentPreference();

  useEffect(() => setMounted(true), []);

  const activeOption =
    ACCENT_PREFERENCES.find((option) => option.value === accent) ?? ACCENT_PREFERENCES[0];

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="text-sm" disabled={!mounted}>
        <SwatchBook className="size-4" />
        <span>Tông màu</span>
        {mounted && (
          <span className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{activeOption.label}</span>
            <span
              className="size-3 rounded-full border border-border"
              style={{ background: activeOption.swatch }}
            />
          </span>
        )}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-72">
        <DropdownMenuLabel>Tông màu chủ đạo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={accent}
          onValueChange={(value) => {
            if (isAccentPreference(value)) setAccent(value);
          }}
        >
          {ACCENT_PREFERENCES.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="items-start text-sm"
            >
              <span
                className="size-7 shrink-0 rounded-md border border-border"
                style={{ background: option.swatch }}
              />
              <span className="min-w-0">
                <span className="block font-medium">{option.label}</span>
                <span className="block text-xs text-muted-foreground">{option.description}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
