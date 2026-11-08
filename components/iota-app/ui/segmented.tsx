"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Segmented tabs with a sliding thumb, on top of shadcn Tabs. The thumb is one shared-layout
// element, so switching springs it across instead of the highlight blinking between buttons.
export function Segmented({
  value,
  options,
  onChange,
  size = "md",
  className = "",
}: {
  value: number; // selected index
  options: readonly string[];
  onChange: (index: number) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const id = useId();
  return (
    <Tabs
      value={String(value)}
      onValueChange={(v) => onChange(Number(v))}
      className={cn("w-full gap-0", className)}
    >
      <TabsList
        className={cn(
          "flex w-full items-center gap-0.5 rounded-lg bg-panel p-0.5 select-none",
          size === "sm" ? "group-data-horizontal/tabs:h-6" : "group-data-horizontal/tabs:h-9",
        )}
      >
        {options.map((o, i) => {
          const active = i === value;
          return (
            <TabsTrigger
              key={o}
              value={String(i)}
              className={cn(
                "relative h-full flex-1 rounded-md border-0 bg-transparent font-normal shadow-none transition-colors duration-150 after:hidden data-active:bg-transparent data-active:shadow-none",
                size === "sm" ? "px-1.5 text-[11px]" : "px-2 text-[12px]",
                active ? "text-foreground" : "text-text-muted hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`seg-thumb-${id}`}
                  className="absolute inset-0 rounded-md bg-fill"
                  transition={{ type: "spring", stiffness: 520, damping: 42 }}
                />
              )}
              <span className="relative">{o}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
