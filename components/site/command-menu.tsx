"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type NavIndex = {
  components: { slug: string; title: string; group: string }[];
  foundations: { slug: string; title: string }[];
  skills: { name: string; title: string }[];
};

type Row = { href: string; title: string; group: string };

// Search everything from one small card, after the search modal in the iOTA apps. Mod+K anywhere.
export function CommandMenu({ index }: { index: NavIndex }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const list = useRef<HTMLDivElement>(null);

  const rows = useMemo<Row[]>(
    () => [
      ...index.components.map((c) => ({ href: `/components/${c.slug}`, title: c.title, group: c.group })),
      ...index.foundations.map((f) => ({ href: `/foundations/${f.slug}`, title: f.title, group: "Foundation" })),
      ...index.skills.map((s) => ({ href: `/skills/${s.name}`, title: s.name, group: "Skill" })),
    ],
    [index],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    const rank = (r: Row) => {
      const t = r.title.toLowerCase();
      return t.startsWith(q) ? 0 : t.includes(q) ? 1 : r.group.toLowerCase().includes(q) ? 2 : 3;
    };
    return rows
      .map((r) => ({ r, n: rank(r) }))
      .filter((x) => x.n < 3)
      .sort((a, b) => a.n - b.n)
      .map((x) => x.r);
  }, [query, rows]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (r?: Row) => {
    if (!r) return;
    setOpen(false);
    router.push(r.href);
  };

  const onChangeOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setActive(0);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onChangeOpen}>
      <Dialog.Trigger
        aria-label="Search components"
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] text-text-2 transition-[background-color,color,scale] duration-150 hover:bg-panel hover:text-foreground active:scale-[0.97]"
      >
        <MagnifyingGlassIcon size={13} />
        Search
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-(--ease-step) data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24">
          <Dialog.Popup className="w-full max-w-sm rounded-2xl border border-border bg-page p-3 shadow-xl transition-[opacity,scale] duration-200 ease-(--ease-step) outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-[0.96] data-starting-style:opacity-0 motion-reduce:transition-none">
            <Dialog.Title className="sr-only">Search iOTA</Dialog.Title>
            <div className="relative">
              <MagnifyingGlassIcon size={15} aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-faint" />
              <input
                data-control
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded
                aria-controls="iota-search-list"
                aria-activedescendant={results[active] ? `iota-search-${active}` : undefined}
                aria-label="Search components, foundations and skills"
                placeholder="Search components, foundations, skills"
                className="h-9 w-full rounded-lg border border-border bg-panel pr-3 pl-8 text-[13px] outline-none transition-colors duration-150 placeholder:text-text-faint focus:border-text-faint"
              />
            </div>
            <div ref={list} id="iota-search-list" role="listbox" aria-label="Results" className="thin-scrollbar mt-2 max-h-72 overflow-y-auto">
              {results.map((r, i) => (
                <button
                  key={r.href}
                  id={`iota-search-${i}`}
                  data-index={i}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  tabIndex={-1}
                  onPointerMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className={cn("flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-[13px]", i === active && "bg-panel")}
                >
                  <span className="min-w-0 truncate">{r.title}</span>
                  <span className="shrink-0 text-[11px] text-text-faint">{r.group}</span>
                </button>
              ))}
              {results.length === 0 && <p className="px-2 py-1.5 text-[12px] text-text-2">No matches.</p>}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
