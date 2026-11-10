"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type AnimationPlaybackControls } from "motion/react";
import { CornersOutIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";
import catalogJson from "@/content/catalog.json";
import { cn } from "@/lib/utils";
import { DEMOS, DEMO_ORDER } from "./demos/index";
import { DemoActive } from "./demos/active";
import { bounds, layoutNodes, type Placed } from "./layout-nodes";

const catalog = catalogJson as { slug: string; title: string; group: string; description: string }[];
const titleOf = Object.fromEntries(catalog.map((c) => [c.slug, c.title]));
const docOf = (key: string) => DEMOS[key].doc ?? key;

const NODES: Placed[] = layoutNodes(DEMO_ORDER.map((slug) => ({ slug, w: DEMOS[slug].w, h: DEMOS[slug].h })));
const BOX = bounds(NODES);
const DOT_GAP = 22;
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.5;
const SPRING = { type: "spring", stiffness: 140, damping: 24, mass: 0.9 } as const;
const CULL_MARGIN = 360;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// The canvas outline with a soft notch cut from its top-right corner for the X link.
export const NOTCH = 52;
const BORDER = 1;
function notchedInner(w: number, h: number) {
  const R = 16;
  const r = 14;
  const n = NOTCH;
  const b = BORDER;
  return `path("M ${R} ${b} H ${w - n - r} A ${r - b} ${r - b} 0 0 1 ${w - n - b} ${r} V ${n - r} A ${r + b} ${r + b} 0 0 0 ${w - n + r} ${n + b} H ${w - r} A ${r - b} ${r - b} 0 0 1 ${w - b} ${n + r} V ${h - R} A ${R - b} ${R - b} 0 0 1 ${w - R} ${h - b} H ${R} A ${R - b} ${R - b} 0 0 1 ${b} ${h - R} V ${R} A ${R - b} ${R - b} 0 0 1 ${R} ${b} Z")`;
}
function notchedOutline(w: number, h: number) {
  const R = 16; // outer corners
  const r = 14; // every curve of the notch
  const n = NOTCH;
  return `path("M ${R} 0 H ${w - n - r} A ${r} ${r} 0 0 1 ${w - n} ${r} V ${n - r} A ${r} ${r} 0 0 0 ${w - n + r} ${n} H ${w - r} A ${r} ${r} 0 0 1 ${w} ${n + r} V ${h - R} A ${R} ${R} 0 0 1 ${w - R} ${h} H ${R} A ${R} ${R} 0 0 1 0 ${h - R} V ${R} A ${R} ${R} 0 0 1 ${R} 0 Z")`;
}

// The selection box: a design-tool bounding box hugging what actually rendered, with its
// measured size in a pill below. --z (set from the zoom) keeps its weight constant at any zoom.
function SelectionBox({ surface, bare }: { surface: React.RefObject<HTMLDivElement | null>; bare?: boolean }) {
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    const host = surface.current;
    if (!host) return;
    let ro: ResizeObserver | null = null;
    let raf = 0;
    const measure = (el: HTMLElement) => {
      // offset* are layout px, so neither the canvas zoom nor the float affects the reading.
      if (el === host) return setBox({ x: 0, y: 0, w: host.offsetWidth, h: host.offsetHeight });
      const a = el.getBoundingClientRect();
      const b = host.getBoundingClientRect();
      const scale = b.width / host.offsetWidth || 1;
      setBox({ x: (a.left - b.left) / scale, y: (a.top - b.top) / scale, w: a.width / scale, h: a.height / scale });
    };
    const attach = () => {
      const el = bare ? (host.querySelector("[data-demo]")?.firstElementChild as HTMLElement | null) : host;
      if (!el) {
        raf = requestAnimationFrame(attach);
        return;
      }
      measure(el);
      ro = new ResizeObserver(() => measure(el));
      ro.observe(el);
    };
    attach();
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [surface, bare]);

  if (!box) return null;
  return (
    <div
      aria-hidden
      className="canvas-selection pointer-events-none absolute z-20"
      style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
    >
      <span className="canvas-selection-line" />
      <span className="canvas-handle" data-corner="tl" />
      <span className="canvas-handle" data-corner="tr" />
      <span className="canvas-handle" data-corner="bl" />
      <span className="canvas-handle" data-corner="br" />
      <span className="canvas-size">
        {Math.round(box.w)} x {Math.round(box.h)}
      </span>
    </div>
  );
}

const Node = memo(function Node({
  node,
  live,
  selected,
  sibling,
  entered,
  delay,
  onActivate,
  onFocusNode,
}: {
  node: Placed;
  live: boolean;
  selected: boolean;
  sibling: boolean;
  entered: boolean;
  delay: number;
  onActivate: (e: React.MouseEvent, slug: string) => void;
  onFocusNode: (node: Placed) => void;
}) {
  const demo = DEMOS[node.slug];
  const Demo = demo.render;
  const title = demo.title ?? titleOf[node.slug] ?? node.slug;
  const surface = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  // The viewport attribute fades the others from CSS, so a hover re-renders one node, not 78.
  const setHovering = (el: Element, on: boolean) => {
    setHover(on);
    el.closest(".canvas-viewport")?.toggleAttribute("data-hovering", on);
  };
  return (
    <div
      className="canvas-node absolute"
      data-selected={selected || undefined}
      data-sibling={sibling || undefined}
      data-hovered={hover || undefined}
      data-awake={live || undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(e.currentTarget, true)}
      onPointerLeave={(e) => setHovering(e.currentTarget, false)}
      style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
    >
      <div
        className="canvas-float size-full"
        style={
          {
            "--fx": `${node.floatX}px`,
            "--fy": `${node.floatY}px`,
            "--ft": `${node.floatT}s`,
            "--fd": `${node.floatD}s`,
          } as React.CSSProperties
        }
      >
        <span className="canvas-caption pointer-events-none absolute -top-[22px] left-0 whitespace-nowrap text-[11px] leading-4 text-text-2">{title}</span>
        {(selected || hover) && live && <SelectionBox surface={surface} bare={demo.bare} />}
        <div
          ref={surface}
          data-live={selected || undefined}
          className={cn("canvas-surface relative size-full", demo.bare ? "flex items-center justify-center" : "overflow-hidden rounded-xl bg-page", entered && !selected && "canvas-enter")}
          style={{ animationDelay: `${delay}ms` }}
        >
          {live && (
            <div
              data-demo
              // Asleep until selected: no tab stops, no hover, no stray clicks inside a resting node.
              inert={!selected}
              className={cn("size-full", demo.bare ? "flex items-center justify-center" : "overflow-hidden", demo.zoom && "origin-top-left")}
              style={demo.zoom ? { zoom: demo.zoom } : undefined}
            >
              <DemoActive.Provider value={selected}>
                <Demo />
              </DemoActive.Provider>
            </div>
          )}
        </div>
        {!selected && (
          <Link
            href={`/components/${docOf(node.slug)}`}
            aria-label={`Open ${title}`}
            draggable={false}
            onClick={(e) => onActivate(e, node.slug)}
            onFocus={(e) => {
              if (e.target.matches(":focus-visible")) onFocusNode(node);
            }}
            className="canvas-hit absolute inset-0 z-10 rounded-xl"
          />
        )}
      </div>
    </div>
  );
});

// `onSelect` keeps selection local instead of routing (the /embed page, framed elsewhere);
// `embed` also drops the notch and lets a plain wheel scroll the page that frames it.
export function Canvas({
  selected,
  dimAll,
  onSelect,
  embed = false,
}: {
  selected: string | null;
  dimAll: boolean;
  onSelect?: (doc: string | null) => void;
  embed?: boolean;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const shadowShape = useRef<HTMLDivElement>(null);
  const size = useRef({ w: 1100, h: 800 });

  const x = useMotionValue(550);
  const y = useMotionValue(400);
  const zoom = useMotionValue(1);
  const [zoomPct, setZoomPct] = useState(100);
  const anims = useRef<AnimationPlaybackControls[]>([]);
  // Which node of a shared page was picked. A direct link lands on the first one.
  const [picked, setPicked] = useState<string | null>(null);
  const selectedKey = !selected ? null : picked && docOf(picked) === selected ? picked : (NODES.find((n) => docOf(n.slug) === selected)?.slug ?? null);
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [liveSet, setLiveSet] = useState<Set<string>>(new Set());
  const [enteredDone, setEnteredDone] = useState(false);

  const dotX = useTransform(x, (v) => v % (DOT_GAP * zoom.get()) - DOT_GAP * zoom.get());
  const dotY = useTransform(y, (v) => v % (DOT_GAP * zoom.get()) - DOT_GAP * zoom.get());
  const dotSize = useTransform(zoom, (z) => `${DOT_GAP * z}px ${DOT_GAP * z}px`);

  const stop = () => {
    anims.current.forEach((a) => a.stop());
    anims.current = [];
  };

  const limits = useCallback((z: number) => {
    const pad = 160;
    return {
      minX: size.current.w - (BOX.maxX * z + pad),
      maxX: -BOX.minX * z + pad,
      minY: size.current.h - (BOX.maxY * z + pad),
      maxY: -BOX.minY * z + pad,
    };
  }, []);

  const moveTo = useCallback(
    (tx: number, ty: number, tz: number, instant = false) => {
      stop();
      if (instant || reduce) {
        x.set(tx);
        y.set(ty);
        zoom.set(tz);
        return;
      }
      anims.current = [animate(x, tx, SPRING), animate(y, ty, SPRING), animate(zoom, tz, SPRING)];
    },
    [reduce, x, y, zoom],
  );

  const centerOn = useCallback(
    (node: Placed, instant = false) => {
      const { w, h } = size.current;
      const fit = Math.min((w - 96) / node.w, (h - 120) / node.h, 1);
      const z = clamp(fit, MIN_ZOOM, 1);
      moveTo(w / 2 - (node.x + node.w / 2) * z, h / 2 - (node.y + node.h / 2) * z, z, instant);
    },
    [moveTo],
  );

  const refreshLive = useCallback(() => {
    const z = zoom.get();
    const left = (-x.get() - CULL_MARGIN) / z;
    const top = (-y.get() - CULL_MARGIN) / z;
    const right = left + (size.current.w + CULL_MARGIN * 2) / z;
    const bottom = top + (size.current.h + CULL_MARGIN * 2) / z;
    setLiveSet((prev) => {
      const next = new Set<string>();
      for (const n of NODES) if (n.x < right && n.x + n.w > left && n.y < bottom && n.y + n.h > top) next.add(n.slug);
      if (next.size === prev.size && [...next].every((s) => prev.has(s))) return prev;
      return next;
    });
  }, [x, y, zoom]);

  const throttle = useRef(0);
  const onMove = useCallback(() => {
    if (throttle.current) return;
    throttle.current = window.setTimeout(() => {
      throttle.current = 0;
      refreshLive();
    }, 120);
  }, [refreshLive]);
  useMotionValueEvent(x, "change", onMove);
  useMotionValueEvent(y, "change", onMove);
  useMotionValueEvent(zoom, "change", (z) => {
    onMove();
    setZoomPct(Math.round(z * 100));
    viewport.current?.style.setProperty("--z", String(z));
  });

  // First paint: measure, centre the map (or the deep-linked node), then wake nodes.
  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    size.current = { w: el.clientWidth, h: el.clientHeight };
    if (!embed) {
      el.style.clipPath = notchedInner(el.clientWidth, el.clientHeight);
      if (shadowShape.current) shadowShape.current.style.clipPath = notchedOutline(el.clientWidth, el.clientHeight);
    }
    const node = selectedKey ? NODES.find((n) => n.slug === selectedKey) : null;
    if (node) centerOn(node, true);
    else moveTo(el.clientWidth / 2, el.clientHeight / 2, 1, true);
    el.style.setProperty("--z", String(zoom.get()));
    refreshLive();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- demos only render in the browser
    setMounted(true);
    const t = setTimeout(() => setEnteredDone(true), 1400);
    const ro = new ResizeObserver(() => {
      size.current = { w: el.clientWidth, h: el.clientHeight };
      if (!embed) {
        el.style.clipPath = notchedInner(el.clientWidth, el.clientHeight);
        if (shadowShape.current) shadowShape.current.style.clipPath = notchedOutline(el.clientWidth, el.clientHeight);
      }
      refreshLive();
    });
    ro.observe(el);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selection moves the camera so what is actually selected lands dead centre: the rendered
  // element, not its layout slot, because the float pauses wherever it happens to be.
  const centerSelected = useCallback(
    (node: Placed, instant: boolean) => {
      const el = viewport.current;
      const host = el?.querySelector<HTMLElement>(".canvas-node[data-selected]");
      const demo = DEMOS[node.slug];
      const target = (demo.bare ? (host?.querySelector("[data-demo]")?.firstElementChild as HTMLElement | null) : host?.querySelector<HTMLElement>(".canvas-surface")) ?? null;
      if (!el || !target) return centerOn(node, instant);
      const { w, h } = size.current;
      const vp = el.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const z0 = zoom.get();
      const worldX = (r.left + r.width / 2 - vp.left - x.get()) / z0;
      const worldY = (r.top + r.height / 2 - vp.top - y.get()) / z0;
      const z = clamp(Math.min((w - 96) / node.w, (h - 120) / node.h, 1), MIN_ZOOM, 1);
      moveTo(w / 2 - worldX * z, h / 2 - worldY * z, z, instant);
    },
    [centerOn, moveTo, x, y, zoom],
  );

  const lastSelected = useRef(selectedKey);
  useEffect(() => {
    const first = lastSelected.current === selectedKey;
    lastSelected.current = selectedKey;
    const node = selectedKey ? NODES.find((n) => n.slug === selectedKey) : null;
    if (!node) return;
    // Wait a frame for the demo to mount. A deep link settles without travelling.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => centerSelected(node, first)));
    return () => cancelAnimationFrame(raf);
  }, [selectedKey, mounted, centerSelected]);

  // Drag anywhere to pan; a press under 4px stays a click.
  const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number; moved: boolean; samples: { t: number; x: number; y: number }[] } | null>(null);
  const justDragged = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    // React bubbles events out of portals, so a menu or dialog item arrives here too.
    if (!viewport.current?.contains(e.target as Node)) return;
    if (e.button !== 0 || (e.target as HTMLElement).closest("[data-live],[data-canvas-ui]")) return;
    stop();
    justDragged.current = false;
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: x.get(), oy: y.get(), moved: false, samples: [] };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      d.moved = true;
      justDragged.current = true;
      viewport.current?.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    const l = limits(zoom.get());
    const damp = (v: number, lo: number, hi: number) => (v < lo ? lo - (lo - v) * 0.35 : v > hi ? hi + (v - hi) * 0.35 : v);
    x.set(damp(d.ox + dx, Math.min(l.minX, l.maxX), Math.max(l.minX, l.maxX)));
    y.set(damp(d.oy + dy, Math.min(l.minY, l.maxY), Math.max(l.minY, l.maxY)));
    d.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
    if (d.samples.length > 5) d.samples.shift();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    setDragging(false);
    if (!d.moved) {
      // A plain click on empty canvas goes home.
      const target = e.target as HTMLElement;
      if (!target.closest(".canvas-node") && (selected || dimAll)) {
        if (onSelect) onSelect(null);
        else router.push("/");
      }
      return;
    }
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const dt = first && last ? last.t - first.t : 0;
    const vx = dt > 0 ? ((last.x - first.x) / dt) * 1000 : 0;
    const vy = dt > 0 ? ((last.y - first.y) / dt) * 1000 : 0;
    const l = limits(zoom.get());
    const carry = (mv: typeof x, v: number, lo: number, hi: number) =>
      animate(mv, mv.get(), { type: "inertia", velocity: reduce ? 0 : v, power: 0.22, timeConstant: 260, min: Math.min(lo, hi), max: Math.max(lo, hi), bounceStiffness: 160, bounceDamping: 26 });
    anims.current = [carry(x, vx, l.minX, l.maxX), carry(y, vy, l.minY, l.maxY)];
  };

  const zoomAt = useCallback(
    (next: number, cx: number, cy: number, instant = true) => {
      const z0 = zoom.get();
      const z1 = clamp(next, MIN_ZOOM, MAX_ZOOM);
      const wx = (cx - x.get()) / z0;
      const wy = (cy - y.get()) / z0;
      moveTo(cx - wx * z1, cy - wy * z1, z1, instant);
    },
    [moveTo, x, y, zoom],
  );

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-live]") && !(e.ctrlKey || e.metaKey)) return;
      // Framed in another page, a plain wheel scrolls that page; drag pans, ctrl+wheel zooms.
      if (embed && !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      stop();
      const r = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        zoomAt(zoom.get() * Math.exp(-e.deltaY * 0.004), e.clientX - r.left, e.clientY - r.top);
        return;
      }
      const l = limits(zoom.get());
      x.set(clamp(x.get() - e.deltaX, Math.min(l.minX, l.maxX), Math.max(l.minX, l.maxX)));
      y.set(clamp(y.get() - e.deltaY, Math.min(l.minY, l.maxY), Math.max(l.minY, l.maxY)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [limits, x, y, zoom, zoomAt, embed]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!viewport.current?.contains(e.target as Node) || (e.target as HTMLElement).closest("[data-live]")) return;
    const step = e.shiftKey ? 240 : 80;
    const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    moveTo(x.get() + m[0], y.get() + m[1], zoom.get());
  };

  const onActivate = useCallback(
    (e: React.MouseEvent, slug: string) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      if (justDragged.current) {
        justDragged.current = false;
        return;
      }
      setPicked(slug);
      if (onSelect) onSelect(docOf(slug));
      else router.push(`/components/${docOf(slug)}`);
    },
    [router, onSelect],
  );

  const onFocusNode = useCallback((node: Placed) => centerOn(node), [centerOn]);

  const fit = () => {
    const { w, h } = size.current;
    const z = clamp(Math.min((w - 80) / (BOX.maxX - BOX.minX), (h - 80) / (BOX.maxY - BOX.minY)), MIN_ZOOM, 1);
    moveTo(w / 2 - ((BOX.minX + BOX.maxX) / 2) * z, h / 2 - ((BOX.minY + BOX.maxY) / 2) * z, z);
  };

  const delays = useMemo(() => {
    const out: Record<string, number> = {};
    NODES.forEach((n, i) => (out[n.slug] = Math.min(i * 45, 900)));
    return out;
  }, []);

  return (
    <>
    {/* A clip path would cut off a box-shadow or border, so a still copy of the shape carries both:
        its fill is the border, and its drop-shadow never repaints as the canvas moves. */}
    <div aria-hidden className="canvas-shadow pointer-events-none absolute inset-0">
      <div ref={shadowShape} className="size-full rounded-2xl bg-(--canvas-line)" />
    </div>
    <div
      ref={viewport}
      role="application"
      aria-label="Component canvas. Drag or use arrow keys to move, select a component to read about it."
      tabIndex={0}
      data-dragging={dragging || undefined}
      data-focused={selected || undefined}
      data-dim-all={dimAll || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className="canvas-viewport relative h-full w-full touch-none overflow-clip rounded-2xl bg-(--canvas-bg) outline-none select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          width: `calc(100% + ${DOT_GAP * 3}px)`,
          height: `calc(100% + ${DOT_GAP * 3}px)`,
          backgroundImage: "radial-gradient(circle at center, var(--canvas-dot) 1px, transparent 1.25px)",
          backgroundSize: dotSize,
        }}
      />
      <motion.div className="absolute top-0 left-0 origin-top-left" style={{ x, y, scale: zoom }}>
        {NODES.map((n) => (
          <Node
            key={n.slug}
            node={n}
            live={mounted && (liveSet.has(n.slug) || n.slug === selectedKey)}
            selected={n.slug === selectedKey}
            sibling={!!selected && n.slug !== selectedKey && docOf(n.slug) === selected}
            entered={!enteredDone}
            delay={delays[n.slug]}
            onActivate={onActivate}
            onFocusNode={onFocusNode}
          />
        ))}
      </motion.div>
      <div data-canvas-ui className="absolute right-3 bottom-3 flex items-center gap-0.5 rounded-lg bg-page p-0.5 shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
        <button type="button" aria-label="Zoom out" onClick={() => zoomAt(zoom.get() / 1.25, size.current.w / 2, size.current.h / 2, false)} className="canvas-tool">
          <MinusIcon size={12} />
        </button>
        <span className="w-9 text-center text-[11px] text-text-2 tabular-nums">{zoomPct}%</span>
        <button type="button" aria-label="Zoom in" onClick={() => zoomAt(zoom.get() * 1.25, size.current.w / 2, size.current.h / 2, false)} className="canvas-tool">
          <PlusIcon size={12} />
        </button>
        <button type="button" aria-label="Fit everything" onClick={fit} className="canvas-tool">
          <CornersOutIcon size={12} />
        </button>
      </div>
    </div>
    </>
  );
}
