"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { TextMorph } from "torph/react";
import {
  CaretDown,
  CaretRight,
  Check,
  Cube,
  DownloadSimple,
  FileJpg,
  FilePng,
  FileSvg,
  FilmStrip,
  Gif,
  ImageSquare,
  Printer,
} from "@phosphor-icons/react";
import { Segmented } from "@/components/iota-app/ui/segmented";
import { Switch } from "@/components/iota-app/ui/switch";
import {
  chooseSaveLocation,
  clearSaveLocation,
} from "@/lib/iota-app/export/download";

// One export control for every playground: a split button (main half re-runs
// the last format, the caret opens the menu) whose label morphs through the
// export — "Export" → live percentage → "Saved" → back — while the button
// itself fills like a progress bar.
//
// The menu is a compact dropdown in the shadcn mould: tight rows, small type,
// hairline separators between sections, no secondary text. A format with its
// own settings (video size, transparency…) shows a caret instead of an icon;
// the caret folds those settings open under the row, so they're only on screen
// for the format they belong to.
//
// Colours come from CSS variables flipped by the editor's `.dark` class
// (Tailwind's `dark:` variant follows the OS here, not the editor toggle).
//
// It renders into <body> through a portal at a z-index above the editor. The
// old per-app menus were `absolute z-20` inside the header row, so any later
// sibling that also used z-20 — the sliders' invisible <input>, the copy
// button — painted over the menu and swallowed its clicks.

export type ExportItem = {
  id: string;
  label: string;
  /** Not displayed; kept so callers can still describe a format. */
  hint?: string;
  icon?: ReactNode;
  /** Items sharing a group render as one section between separators. */
  group?: string;
  disabled?: boolean;
  /** Tooltip, e.g. why an item is disabled. */
  title?: string;
  /** Full suggested file name; defaults to `${fileName}.<ext from id>`. */
  fileName?: string;
  /** Format-specific settings, folded under the row behind a caret. */
  settings?: ReactNode;
  /** Return `false` when the export didn't produce a file (skips "Saved"). */
  onSelect: () => unknown | Promise<unknown>;
};

// Icon + section inferred from the format id, so every app gets the same
// menu without restating it. An item can still override either.
const SECTION_ORDER = ["Vector", "Image", "Motion", "3D"];
function metaFor(id: string): { group: string; icon: ReactNode } {
  const ic = { size: 15, weight: "regular" as const };
  if (id.startsWith("svg")) return { group: "Vector", icon: <FileSvg {...ic} /> };
  if (id.startsWith("png")) return { group: "Image", icon: <FilePng {...ic} /> };
  if (id === "jpg") return { group: "Image", icon: <FileJpg {...ic} /> };
  if (id === "webp") return { group: "Image", icon: <ImageSquare {...ic} /> };
  if (id === "mp4") return { group: "Motion", icon: <FilmStrip {...ic} /> };
  if (id === "gif") return { group: "Motion", icon: <Gif {...ic} /> };
  if (id === "apng") return { group: "Motion", icon: <ImageSquare {...ic} /> };
  if (id === "glb") return { group: "3D", icon: <Cube {...ic} /> };
  if (id === "stl") return { group: "3D", icon: <Printer {...ic} /> };
  return { group: "", icon: <DownloadSimple {...ic} /> };
}

// File extension each format id saves as.
function extFor(id: string): string {
  if (id.startsWith("svg")) return "svg";
  if (id.startsWith("png") || id === "apng") return "png";
  return id;
}

const MORPH = { duration: 340, ease: "cubic-bezier(0.19, 1, 0.22, 1)" };

export function ExportMenu({
  items,
  progress = null,
  disabled = false,
  fileName,
}: {
  items: ExportItem[];
  /**
   * Base name for the Save dialog. When set (and the browser supports it),
   * clicking a format first asks where to save, then renders, then writes the
   * file there — instead of silently dropping it into Downloads.
   */
  fileName?: string;
  /** 0..1 while a long export renders; drives the fill + percentage. */
  progress?: number | null;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
  const [lastId, setLastId] = useState(items[0]?.id);
  const btnRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const last = items.find((i) => i.id === lastId) ?? items[0];
  const busy = phase === "busy" || progress !== null;

  // Sections in a fixed order; ungrouped items lead.
  const groups: [string, ExportItem[]][] = [];
  for (const it of items) {
    const m = metaFor(it.id);
    const d = { ...it, group: it.group ?? m.group, icon: it.icon ?? m.icon };
    const found = groups.find(([k]) => k === d.group);
    if (found) found[1].push(d);
    else groups.push([d.group, [d]]);
  }
  groups.sort(
    ([a], [b]) =>
      (SECTION_ORDER.indexOf(a) + 1 || 99) - (SECTION_ORDER.indexOf(b) + 1 || 99),
  );

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(
    () => () => {
      if (doneTimer.current) clearTimeout(doneTimer.current);
    },
    [],
  );

  async function run(item: ExportItem | undefined) {
    if (!item || item.disabled || busy) return;
    setOpen(false);
    setLastId(item.id);
    if (doneTimer.current) clearTimeout(doneTimer.current);
    // Must be the first await: the Save dialog only opens during the click.
    if (fileName || item.fileName) {
      const go = await chooseSaveLocation(
        item.fileName ?? `${fileName}.${extFor(item.id)}`,
      );
      if (!go) return; // dialog cancelled: skip the export entirely
    }
    setPhase("busy");
    let ok = true;
    try {
      ok = (await item.onSelect()) !== false;
    } catch (e) {
      console.error(e);
      ok = false;
    }
    if (!ok) {
      clearSaveLocation();
      setPhase("idle");
      return;
    }
    setPhase("done");
    doneTimer.current = setTimeout(() => setPhase("idle"), 1600);
  }

  const pct = progress !== null ? Math.round(progress * 100) : null;
  const label =
    phase === "done"
      ? "Saved"
      : pct !== null
        ? `${pct}%`
        : busy
          ? "Exporting"
          : "Export";

  return (
    <div ref={btnRef} className="relative">
      <div
        className={`relative inline-flex h-9 overflow-hidden rounded-[7.5px] border-[0.67px] border-[#1d4ed8] bg-brand text-brand-foreground shadow-[inset_0_2px_0_rgba(255,255,255,0.3)] transition-opacity ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {/* Progress fill: sweeps across the whole split button while a clip
            renders, then flashes full on "Saved". */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 bg-white/20"
          initial={false}
          animate={{
            width: phase === "done" ? "100%" : pct !== null ? `${pct}%` : "0%",
            opacity: phase === "done" ? [0.9, 0] : 1,
          }}
          transition={
            phase === "done"
              ? { duration: 0.9, ease: "easeOut" }
              : { duration: 0.18, ease: "linear" }
          }
        />
        <button
          onClick={() => run(last)}
          disabled={disabled || busy}
          title={last ? `Export ${last.label}` : "Export"}
          className="relative inline-flex cursor-pointer items-center gap-1.5 pr-3.5 pl-3 text-[13px] font-medium tracking-[-0.15px] transition-colors hover:bg-white/10 disabled:cursor-not-allowed"
        >
          <span className="grid h-[18px] w-[18px] place-items-center">
            <AnimatePresence initial={false} mode="popLayout">
              {phase === "done" ? (
                <motion.span
                  key="check"
                  className="col-start-1 row-start-1"
                  initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 520, damping: 30 }}
                >
                  <Check size={17} weight="bold" />
                </motion.span>
              ) : (
                <motion.span
                  key="dl"
                  className="col-start-1 row-start-1"
                  initial={{ opacity: 0, y: -6 }}
                  animate={
                    busy ? { opacity: 1, y: [0, 2.5, 0] } : { opacity: 1, y: 0 }
                  }
                  exit={{ opacity: 0, scale: 0.6, rotate: 14 }}
                  transition={
                    busy
                      ? { y: { duration: 0.9, repeat: Infinity, ease: "easeInOut" } }
                      : { duration: 0.2 }
                  }
                >
                  <DownloadSimple size={18} weight="regular" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <TextMorph {...MORPH} className="tabular-nums whitespace-nowrap">
            {label}
          </TextMorph>
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          disabled={disabled || busy}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Export options"
          className="relative inline-flex cursor-pointer items-center border-l border-white/30 px-[9px] transition-colors hover:bg-white/10 disabled:cursor-not-allowed"
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 34 }}
            className="flex"
          >
            <CaretDown size={13} weight="bold" />
          </motion.span>
        </button>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                ref={panelRef}
                role="menu"
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  top: pos.top,
                  right: pos.right,
                  transformOrigin: "top right",
                }}
                className={`export-panel fixed z-[100] overflow-hidden rounded-[12px] ${
                  // Only as wide as the labels need; menus with foldable
                  // settings get room for the segmented controls inside.
                  items.some((i) => i.settings) ? "w-[196px]" : "w-max min-w-[148px]"
                }`}
              >
                {groups.map(([group, list], gi) => (
                  <div key={group || gi} role="group">
                    {gi > 0 && <Separator />}
                    {list.map((it) => (
                      <MenuRow
                        key={it.id}
                        item={it}
                        current={it.id === last?.id}
                        expanded={expanded === it.id}
                        onToggle={() =>
                          setExpanded((e) => (e === it.id ? null : it.id))
                        }
                        onRun={() => run(it)}
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

function MenuRow({
  item,
  current,
  expanded,
  onToggle,
  onRun,
}: {
  item: ExportItem;
  current: boolean;
  expanded: boolean;
  onToggle: () => void;
  onRun: () => void;
}) {
  const hasSettings = !!item.settings;
  return (
    <div>
      {/* The whole row takes the hover fill (#E6E6E9 light / #2A2A31 dark). */}
      <div
        className={`menu-row flex h-8 w-full items-center pl-1 text-[13px] ${
          item.disabled ? "opacity-40" : ""
        } ${expanded ? "is-open" : ""}`}
        data-disabled={item.disabled || undefined}
        title={item.title}
      >
        {hasSettings ? (
          // Caret takes the icon's place: it folds this format's settings open.
          <button
            type="button"
            onClick={onToggle}
            disabled={item.disabled}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Hide" : "Show"} ${item.label} settings`}
            className="menu-muted flex h-full w-7 shrink-0 cursor-pointer items-center justify-center disabled:cursor-not-allowed"
          >
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 36 }}
              className="flex"
            >
              <CaretRight size={12} weight="bold" />
            </motion.span>
          </button>
        ) : (
          <span className="menu-muted flex w-7 shrink-0 justify-center">
            {item.icon}
          </span>
        )}
        <button
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={onRun}
          className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2 pr-3 text-left whitespace-nowrap disabled:cursor-not-allowed"
        >
          <span className="truncate">{item.label}</span>
          {current && (
            <Check size={11} weight="bold" className="ml-auto shrink-0 text-brand" />
          )}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {hasSettings && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="py-0.5 pr-2 pl-8">{item.settings}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Full-width hairline between sections. Rows are full width too, so a hovered
// row fills its whole band instead of sitting in it as an inset box.
function Separator() {
  return <div role="separator" className="menu-sep h-px" />;
}

/** Nested setting: label left, compact segmented tabs right. */
export function ExportTabs<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="menu-muted flex h-7 items-center justify-between gap-2 pr-1 text-[12px]">
      <span className="shrink-0">{label}</span>
      <Segmented
        size="sm"
        value={Math.max(0, options.indexOf(value))}
        options={options}
        onChange={(i) => onChange(options[i])}
        className="max-w-[118px] flex-1"
      />
    </div>
  );
}

/** Nested setting with a switch. */
export function ExportCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="menu-muted flex h-7 items-center justify-between gap-2 pr-1 text-[12px]">
      <span>{label}</span>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
