"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { motion } from "motion/react";
import { TextMorph } from "torph/react";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { SegmentedControl, SegmentedControlItem } from "@/components/iota/ui/segmented-control";
import { useDocView } from "./shell";
import { SwapIcon, useCopy } from "./doc-parts";

const EASE = [0.23, 1, 0.32, 1] as const;

// Scrolls long docs with Lenis. Nested code boxes opt out with data-lenis-prevent.
export function SmoothScroll({ children, resetKey, className }: { children: ReactNode; resetKey: string; className?: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!wrapper.current || !content.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ wrapper: wrapper.current, content: content.current, lerp: 0.14, wheelMultiplier: 0.9 });
    lenis.current = l;
    let raf = requestAnimationFrame(function loop(t) {
      l.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
    if (wrapper.current) wrapper.current.scrollTop = 0;
  }, [resetKey]);

  return (
    <div ref={wrapper} className={`no-scrollbar scroll-fade-y min-h-0 flex-1 overflow-y-auto ${className ?? ""}`}>
      <div ref={content}>{children}</div>
    </div>
  );
}

// Quiet colors for raw Markdown: frontmatter and fences recede, headings lead.
function tintLines(raw: string) {
  const out: { line: string; cls: string }[] = [];
  let inFront = false;
  let fenceOpen = false;
  raw.split("\n").forEach((line, i) => {
    if (i === 0 && line === "---") {
      inFront = true;
      out.push({ line, cls: "text-text-2" });
    } else if (inFront && line === "---") {
      inFront = false;
      out.push({ line, cls: "text-text-faint" });
    } else if (inFront || line === "---") out.push({ line, cls: "text-text-2" });
    else if (line.trim().startsWith("```")) {
      fenceOpen = !fenceOpen;
      out.push({ line, cls: "text-text-faint" });
    } else if (fenceOpen) out.push({ line, cls: "text-text-2" });
    else if (/^#{1,6} /.test(line)) out.push({ line, cls: "font-medium text-foreground" });
    else out.push({ line, cls: "text-foreground/75" });
  });
  return out;
}

function AgentView({ raw, file, href }: { raw: string; file: string; href: string }) {
  const { copied, copy } = useCopy();
  const lines = tintLines(raw);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 font-mono text-[11px] text-text-2 transition-colors hover:text-brand"
        >
          {file}
          <ArrowSquareOutIcon size={11} />
        </a>
        <button
          type="button"
          onClick={() => copy(raw)}
          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-text-2 transition-[background-color,color,scale] duration-150 hover:bg-panel hover:text-foreground active:scale-[0.97]"
        >
          <SwapIcon copied={copied} size={12} />
          <TextMorph duration={260} ease="cubic-bezier(0.23, 1, 0.32, 1)">{copied ? "Copied" : "Copy"}</TextMorph>
        </button>
      </div>
      <pre className="font-mono text-[11px] leading-[17px] break-words whitespace-pre-wrap">
        {lines.map(({ line, cls }, i) => (
          <span key={i} className={`block min-h-[17px] ${cls}`}>
            {line}
          </span>
        ))}
      </pre>
    </div>
  );
}

// Left column of a doc: me reads it, agent reads the Markdown.
export function DocPanel({ human, raw, file, href, id }: { human: ReactNode; raw: string; file: string; href: string; id: string }) {
  const { view, setView } = useDocView();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the saved view only exists in the browser
  useEffect(() => setMounted(true), []);
  const shown = mounted ? view : "me";
  return (
    <>
      <SmoothScroll resetKey={`${id}-${shown}`} className="px-4 pt-3 pb-16">
        <motion.div
          key={`${id}-${shown}`}
          initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          {shown === "me" ? human : <AgentView raw={raw} file={file} href={href} />}
        </motion.div>
      </SmoothScroll>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex p-3">
        <div className="pointer-events-auto rounded-lg bg-page">
          <SegmentedControl size="xs" aria-label="View" value={shown} onValueChange={(v) => setView(v as "me" | "agent")}>
            <SegmentedControlItem value="me">me</SegmentedControlItem>
            <SegmentedControlItem value="agent">agent</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </div>
    </>
  );
}
