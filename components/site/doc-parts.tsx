"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TextMorph } from "torph/react";
import { CaretRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button } from "@/components/iota/ui/button";
import { cn } from "@/lib/utils";

export function useCopy(ms = 1500) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return false;
    }
    setCopied(true);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), ms);
    return true;
  };
  return { copied, copy };
}

export function SwapIcon({ copied, size = 13 }: { copied: boolean; size?: number }) {
  const cls = "col-start-1 row-start-1 transition-[opacity,scale] duration-200 ease-(--ease-step)";
  return (
    <span className="grid place-items-center" aria-hidden style={{ width: size, height: size }}>
      <CopyIcon size={size} className={cn(cls, copied ? "scale-75 opacity-0" : "opacity-100")} />
      <CheckIcon size={size} weight="bold" className={cn(cls, copied ? "opacity-100" : "scale-75 opacity-0")} />
    </span>
  );
}

// A one-line command with copy in place.
export function CopyLine({ value }: { value: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className="group flex w-full items-center justify-between gap-3 rounded-lg bg-panel py-2 pr-2.5 pl-3 text-left transition-[background-color,scale] duration-150 hover:bg-fill active:scale-[0.99]"
    >
      <code className="min-w-0 font-mono text-[11px] leading-[15px] [overflow-wrap:anywhere] text-foreground/85">{value}</code>
      <span className="shrink-0 text-text-2 transition-colors group-hover:text-foreground">
        <SwapIcon copied={copied} />
      </span>
    </button>
  );
}

// Copies a ready-to-paste prompt that installs one component and points at its rules.
export function InstallPrompt({ title, install, docs }: { title: string; install: string; docs: string }) {
  const { copied, copy } = useCopy(1800);
  const prompt = `Install the iOTA ${title} component in this project.

1. Run: ${install}
2. Read ${docs} and follow its rules when you use it.`;
  return (
    <Button size="sm" className="self-start" onClick={() => copy(prompt)} aria-live="polite">
      <SwapIcon copied={copied} />
      <TextMorph duration={300} ease="cubic-bezier(0.23, 1, 0.32, 1)">{copied ? "Copied" : "Copy install prompt"}</TextMorph>
    </Button>
  );
}

export function Fold({ title, count, children }: { title: string; count: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-y border-border">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-1.5 py-2.5 text-left text-[13px] text-foreground">
        <CaretRightIcon size={11} weight="bold" className={cn("text-text-faint transition-transform duration-200 ease-(--ease-step)", open && "rotate-90")} />
        <span className="font-medium">{title}</span>
        <span className="ml-auto text-[12px] text-text-2">{count}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
