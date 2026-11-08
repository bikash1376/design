"use client";

import type { ReactNode } from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// iOTA's one-prop tooltip on top of shadcn Tooltip: pass a label and wrap the trigger.
export function Tooltip({
  label,
  children,
  className = "",
  position = "top",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom";
}) {
  return (
    <TooltipProvider delay={250}>
      <ShadcnTooltip>
        <TooltipTrigger render={<span className={`inline-flex ${className}`} />}>{children}</TooltipTrigger>
        <TooltipContent
          side={position}
          sideOffset={8}
          className="max-w-[260px] rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-[12px] leading-snug font-normal text-text-muted shadow-md [&>svg]:hidden"
        >
          {label}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
