"use client";

import type { ReactNode } from "react";

// The color swatch now opens a full popover picker; re-exported here so every
// existing `@/components/playground/control-row` import upgrades automatically.
export { ColorSwatch } from "@/components/iota-app/ui/color-picker";

// A labeled row matching the slider rows, for non-slider controls
// (color swatch, toggle, select).
export function ControlRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-9 items-center justify-between rounded-lg bg-panel px-3 text-[13px] [--switch-off:var(--fill)]">
      <span className="text-foreground/80">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
