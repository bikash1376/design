"use client";

/**
 * OriginWave — a standalone port of the "Origin Wave" loader from dotmatrix
 * (https://dotmatrix.zzzzshawn.cloud, loader id `dotm-square-12`).
 *
 * A 5x5 dot matrix where a ripple starts at cell (2,2) and expands outward in
 * concentric rings.
 *
 * Zero dependencies beyond React. No shadcn, no tailwind, no global CSS import,
 * no config changes — the stylesheet ships inside the component and every knob
 * is a prop. Drop this file anywhere in your project and import it.
 *
 * Everything is CSS-driven, so animation costs nothing on the JS main thread.
 */

import { useMemo, useState, type CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Public types                                                        */
/* ------------------------------------------------------------------ */

export type OriginWavePattern =
  "full" | "diamond" | "outline" | "cross" | "rings" | "rose" | "grid3";

export type OriginWaveDotShape = "circle" | "square" | "diamond" | "hearts";

export type OriginWaveColorPreset =
  | "solid-mint"
  | "grad-sunset"
  | "grad-ocean"
  | "grad-neon"
  | "grad-aurora"
  | "grad-fire"
  | "grad-prism";

export interface OriginWaveProps {
  /* ---- size ---- */
  /** Outer width/height of the 5x5 matrix in px. Default `24`. */
  size?: number;
  /** Diameter of a single dot in px. Default `3`. */
  dotSize?: number;
  /** Fixed px gap between grid tracks. When set, `size` is ignored for layout
   *  and the matrix measures `dotSize * 5 + cellPadding * 4`. */
  cellPadding?: number;
  /** Exact outer slot size in px — the matrix is uniformly scaled to fit it,
   *  like an SVG viewBox. Useful for pinning a loader into a fixed layout box. */
  boxSize?: number;
  /** Minimum width/height of the outer slot in px. */
  minSize?: number;

  /* ---- color ---- */
  /** Any CSS color. Default `"currentColor"` (inherits your text color). */
  color?: string;
  /** Built-in solid/gradient palette. Overrides `color`. */
  colorPreset?: OriginWaveColorPreset;
  /** Custom CSS background for the dots — e.g.
   *  `"linear-gradient(135deg,#f0f,#0ff)"`. Overrides `color` and `colorPreset`. */
  gradient?: string;
  /** Color used for the glow when `gradient` is set (glows can't use a
   *  gradient). Defaults to `color`. */
  glowColor?: string;

  /* ---- motion ---- */
  /** Speed multiplier. `2` = twice as fast, `0.5` = half speed. Default `1`. */
  speed?: number;
  /** Base loop duration in ms before `speed` is applied. Default `1500`. */
  cycleMs?: number;
  /** Per-ring animation delay as a fraction of one cycle — how far the wave
   *  stretches out across the grid. Default `0.16`. */
  ringStagger?: number;
  /** Run the loop continuously. Default `true`. */
  animated?: boolean;
  /** Animate only while hovered. When `true`, the continuous loop is off. */
  hoverAnimated?: boolean;

  /* ---- appearance ---- */
  /** Which cells are lit. Default `"full"`. */
  pattern?: OriginWavePattern;
  /** Dot geometry. Default `"circle"`. */
  dotShape?: OriginWaveDotShape;
  /** Dim, low-contrast rendering for secondary/disabled states. */
  muted?: boolean;
  /** Glow on the brightest dots, scaling with each dot's opacity. */
  bloom?: boolean;
  /** Uniform glow on every lit dot, `0` (off) to `1` (strongest). */
  halo?: number;
  /** Resting opacity, `0`–`1`. Default `0.16`. */
  opacityBase?: number;
  /** Mid-brightness opacity, `0`–`1`. Default `0.32`. */
  opacityMid?: number;
  /** Peak opacity at the crest of the wave, `0`–`1`. Default `1`. */
  opacityPeak?: number;

  /* ---- wave origin ---- */
  /** Row the wave radiates from, `0`–`4`. Default `1` (cell 2,2). */
  originRow?: number;
  /** Column the wave radiates from, `0`–`4`. Default `1` (cell 2,2). */
  originCol?: number;

  /* ---- escape hatches ---- */
  className?: string;
  style?: CSSProperties;
  dotClassName?: string;
  /** Screen-reader label. Default `"Loading"`. */
  ariaLabel?: string;
}

/* ------------------------------------------------------------------ */
/* Grid math                                                           */
/* ------------------------------------------------------------------ */

const MATRIX_SIZE = 5;
const CENTER = Math.floor(MATRIX_SIZE / 2);
const CELL_COUNT = MATRIX_SIZE * MATRIX_SIZE;

const RANGE = [...Array(MATRIX_SIZE).keys()];
const FULL_INDEXES = RANGE.flatMap((row) =>
  RANGE.map((col) => row * MATRIX_SIZE + col),
);

function indexToCoord(index: number) {
  return { row: Math.floor(index / MATRIX_SIZE), col: index % MATRIX_SIZE };
}

const PATTERN_INDEXES: Record<OriginWavePattern, number[]> = {
  full: FULL_INDEXES,
  diamond: FULL_INDEXES.filter((i) => {
    const { row, col } = indexToCoord(i);
    return Math.abs(row - CENTER) + Math.abs(col - CENTER) <= 2;
  }),
  outline: FULL_INDEXES.filter((i) => {
    const { row, col } = indexToCoord(i);
    return (
      row === 0 ||
      row === MATRIX_SIZE - 1 ||
      col === 0 ||
      col === MATRIX_SIZE - 1
    );
  }),
  cross: FULL_INDEXES.filter((i) => {
    const { row, col } = indexToCoord(i);
    return row === CENTER || col === CENTER;
  }),
  rings: FULL_INDEXES.filter((i) => {
    const { row, col } = indexToCoord(i);
    const radius = Math.round(Math.hypot(row - CENTER, col - CENTER));
    return radius === 1 || radius === 2;
  }),
  rose: FULL_INDEXES.filter((i) => {
    const { row, col } = indexToCoord(i);
    const dx = col - CENTER;
    const dy = row - CENTER;
    return (
      Math.abs(Math.sin(3 * Math.atan2(dy, dx))) > 0.6 &&
      Math.hypot(dx, dy) >= 1
    );
  }),
  grid3: FULL_INDEXES.filter((i) => {
    const { row, col } = indexToCoord(i);
    return row >= 1 && row <= 3 && col >= 1 && col <= 3;
  }),
};

/** Auto gap so `dotSize * 5 + gap * 4` lands close to `size`. */
function resolveLayout(size: number, dotSize: number, cellPadding?: number) {
  if (cellPadding != null) {
    const gap = Math.max(0, cellPadding);
    return { gap, matrixSpan: dotSize * MATRIX_SIZE + gap * (MATRIX_SIZE - 1) };
  }
  const gap = Math.max(
    1,
    Math.floor((size - dotSize * MATRIX_SIZE) / (MATRIX_SIZE - 1)),
  );
  return { gap, matrixSpan: size };
}

/* ------------------------------------------------------------------ */
/* Color                                                               */
/* ------------------------------------------------------------------ */

const COLOR_PRESETS: Record<
  OriginWaveColorPreset,
  { fill: string; glow: string }
> = {
  "solid-mint": { fill: "#34d399", glow: "#34d399" },
  "grad-sunset": {
    fill: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 52%, #ffe29a 100%)",
    glow: "#ff8b73",
  },
  "grad-ocean": {
    fill: "linear-gradient(140deg, #00c6ff 0%, #0072ff 48%, #4facfe 100%)",
    glow: "#2f8fff",
  },
  "grad-neon": {
    fill: "linear-gradient(145deg, #b4ff39 0%, #39ffb6 46%, #00d4ff 100%)",
    glow: "#59ffc8",
  },
  "grad-aurora": {
    fill: "linear-gradient(145deg, #ff3cac 0%, #784ba0 45%, #2b86c5 100%)",
    glow: "#9c64bf",
  },
  "grad-fire": {
    fill: "linear-gradient(145deg, #ff512f 0%, #dd2476 45%, #ffb347 100%)",
    glow: "#f96a5f",
  },
  "grad-prism": {
    fill: "linear-gradient(145deg, #12c2e9 0%, #c471ed 45%, #f64f59 100%)",
    glow: "#9e7de8",
  },
};

/* ------------------------------------------------------------------ */
/* Opacity remapping                                                   */
/* ------------------------------------------------------------------ */

/* The keyframes are authored against these three stops. When the caller
 * overrides any of them, per-dot opacities are re-interpolated onto the new
 * triplet so the wave keeps its shape at a different contrast. */
const SOURCE_BASE = 0.08;
const SOURCE_MID = 0.34;
const SOURCE_PEAK = 0.94;

function clamp01(value: number | undefined) {
  if (value == null || !Number.isFinite(value)) return undefined;
  return Math.min(1, Math.max(0, value));
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function progress(value: number, start: number, end: number) {
  const span = end - start;
  if (Math.abs(span) < Number.EPSILON) return 0;
  return Math.min(1, Math.max(0, (value - start) / span));
}

function remapOpacity(
  opacity: number,
  base: number | undefined,
  mid: number | undefined,
  peak: number | undefined,
) {
  if (!Number.isFinite(opacity)) return opacity;
  if (base === undefined && mid === undefined && peak === undefined) {
    return Math.min(1, Math.max(0, opacity));
  }

  const targetBase = base ?? SOURCE_BASE;
  const targetMid = mid ?? SOURCE_MID;
  const targetPeak = peak ?? SOURCE_PEAK;
  const safe = Math.min(1, Math.max(0, opacity));

  if (safe <= SOURCE_BASE)
    return lerp(0, targetBase, progress(safe, 0, SOURCE_BASE));
  if (safe <= SOURCE_MID) {
    return lerp(targetBase, targetMid, progress(safe, SOURCE_BASE, SOURCE_MID));
  }
  if (safe <= SOURCE_PEAK) {
    return lerp(targetMid, targetPeak, progress(safe, SOURCE_MID, SOURCE_PEAK));
  }
  return lerp(targetPeak, 1, progress(safe, SOURCE_PEAK, 1));
}

/** Remapped opacity where bloom starts; scales linearly to full bloom at 1. */
const BLOOM_OPACITY_MIN = 0.6;

function bloomLevel(remappedOpacity: number) {
  return Math.min(
    1,
    Math.max(
      0,
      (remappedOpacity - BLOOM_OPACITY_MIN) / (1 - BLOOM_OPACITY_MIN),
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const HEART_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='black' d='m8.593.827c-1.008.012-1.953.464-2.593,1.227-.641-.762-1.586-1.214-2.598-1.227C1.519.839-.007,2.378,0,4.257,0,8.362,4.201,10.875,5.488,11.547h0c.16.084.336.125.511.125s.352-.042.511-.125c1.287-.672,5.489-3.184,5.489-7.289.007-1.88-1.519-3.42-3.407-3.431Z'/%3E%3C/svg%3E\")";

/* Class names are namespaced with `owv-` so nothing here can collide with
 * styles already in your app. */
const STYLES = `
.owv-root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  --owv-cycle: 1500ms;
  --owv-speed: 1;
  --owv-stagger: 0.16;
  --owv-opacity-base: 0.16;
  --owv-opacity-mid: 0.32;
  --owv-opacity-peak: 1;
  --owv-halo-level: 0;
}
.owv-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
}
.owv-dot {
  display: block;
  border-radius: 999px;
  background: var(--owv-dot-fill, currentColor);
  opacity: calc(0.5 * (var(--owv-opacity-base) + var(--owv-opacity-mid)));
  transform-origin: center;
  transform: none;
  will-change: opacity;
  --owv-bloom-level: 0;
}
.owv-root.owv-shape-circle .owv-dot { border-radius: 999px; }
.owv-root.owv-shape-square .owv-dot { border-radius: 0; }
.owv-root.owv-shape-diamond .owv-dot {
  border-radius: 0;
  transform: rotate(45deg) scale(0.7071067812);
}
.owv-root.owv-shape-hearts .owv-dot {
  position: relative;
  border-radius: 0;
  transform: none;
  background: none;
}
.owv-root.owv-shape-hearts .owv-dot::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--owv-dot-fill, currentColor);
  -webkit-mask-image: ${HEART_MASK};
  mask-image: ${HEART_MASK};
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
.owv-bloom .owv-dot {
  filter:
    drop-shadow(0 0 calc(var(--owv-dot-size, 3px) * 0.75 * max(var(--owv-bloom-level, 0), var(--owv-halo-level, 0))) currentColor)
    drop-shadow(0 0 calc(var(--owv-dot-size, 3px) * 1.35 * max(var(--owv-bloom-level, 0), var(--owv-halo-level, 0))) currentColor);
  will-change: opacity, filter;
}
.owv-root.owv-halo-spread.owv-bloom .owv-dot {
  filter:
    drop-shadow(0 0 calc(var(--owv-dot-size, 3px) * 0.92 * max(var(--owv-bloom-level, 0), var(--owv-halo-level, 0))) currentColor)
    drop-shadow(0 0 calc(var(--owv-dot-size, 3px) * 1.62 * max(var(--owv-bloom-level, 0), var(--owv-halo-level, 0))) currentColor)
    drop-shadow(0 0 calc(var(--owv-dot-size, 3px) * 2.55 * max(var(--owv-bloom-level, 0), var(--owv-halo-level, 0))) currentColor);
}
.owv-muted .owv-dot {
  opacity: calc(0.44 * var(--owv-opacity-mid));
  --owv-bloom-level: 0;
}
.owv-dot.owv-inactive {
  opacity: 0 !important;
  animation: none !important;
  visibility: hidden;
  pointer-events: none;
  will-change: auto;
  filter: none;
  --owv-bloom-level: 0;
}
.owv-wave {
  animation: owv-wave calc(var(--owv-cycle) * var(--owv-speed, 1)) ease-in-out infinite;
  animation-delay: calc(var(--owv-ring, 0) * var(--owv-stagger, 0.16) * var(--owv-cycle) * var(--owv-speed, 1));
  will-change: opacity;
}
@keyframes owv-wave {
  0%, 100% {
    opacity: calc(0.625 * var(--owv-opacity-base));
    --owv-bloom-level: 0;
  }
  34% {
    opacity: var(--owv-opacity-peak);
    --owv-bloom-level: 1;
  }
  60% {
    opacity: calc(0.5 * (var(--owv-opacity-base) + var(--owv-opacity-mid)));
    --owv-bloom-level: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .owv-dot,
  .owv-wave {
    animation: none !important;
    transition: none !important;
  }
}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function OriginWave({
  size = 24,
  dotSize = 3,
  cellPadding,
  boxSize,
  minSize,
  color = "currentColor",
  colorPreset,
  gradient,
  glowColor,
  speed = 1,
  cycleMs = 1500,
  ringStagger = 0.16,
  animated = true,
  hoverAnimated = false,
  pattern = "full",
  dotShape = "circle",
  muted = false,
  bloom = false,
  halo = 0,
  opacityBase,
  opacityMid,
  opacityPeak,
  originRow = 1,
  originCol = 1,
  className,
  style,
  dotClassName,
  ariaLabel = "Loading",
}: OriginWaveProps) {
  /* When `hoverAnimated` is on, the continuous loop is off and pointer hover
   * drives the wave instead. Both are the same CSS animation. */
  const [hovered, setHovered] = useState(false);
  const autoRun = animated && !hoverAnimated;
  const playing = autoRun || (hoverAnimated && hovered);

  const safeSpeed = speed > 0 ? speed : 1;
  const safeCycle = cycleMs > 0 ? cycleMs : 1500;
  const haloLevel = Math.min(1, Math.max(0, Number.isFinite(halo) ? halo : 0));

  const { gap, matrixSpan } = resolveLayout(size, dotSize, cellPadding);

  /* `boxSize` scales the whole matrix to fit an exact outer slot, viewBox-style. */
  const hasBox = boxSize != null && boxSize > 0 && Number.isFinite(boxSize);
  const hasMin = minSize != null && minSize > 0 && Number.isFinite(minSize);
  const outerDim = hasBox ? (hasMin ? Math.max(boxSize, minSize) : boxSize) : 0;
  const useWrapper = hasBox;
  const scale = useWrapper && matrixSpan > 0 ? outerDim / matrixSpan : 1;

  const ob = clamp01(opacityBase);
  const om = clamp01(opacityMid);
  const op = clamp01(opacityPeak);

  const { dotFill, glow } = useMemo(() => {
    if (gradient) return { dotFill: gradient, glow: glowColor ?? color };
    const preset = colorPreset ? COLOR_PRESETS[colorPreset] : undefined;
    if (preset) return { dotFill: preset.fill, glow: glowColor ?? preset.glow };
    return { dotFill: color, glow: glowColor ?? color };
  }, [gradient, glowColor, colorPreset, color]);

  const rootStyle = useMemo(
    () =>
      ({
        width: matrixSpan,
        height: matrixSpan,
        color: glow,
        "--owv-speed": 1 / safeSpeed,
        "--owv-cycle": `${safeCycle}ms`,
        "--owv-stagger": ringStagger,
        "--owv-dot-size": `${dotSize}px`,
        "--owv-dot-fill": dotFill,
        "--owv-halo-level": haloLevel,
        ...(ob !== undefined && { "--owv-opacity-base": ob }),
        ...(om !== undefined && { "--owv-opacity-mid": om }),
        ...(op !== undefined && { "--owv-opacity-peak": op }),
        ...(useWrapper
          ? { transform: `scale(${scale})`, transformOrigin: "center center" }
          : { minWidth: minSize, minHeight: minSize, ...style }),
      }) as unknown as CSSProperties,
    [
      matrixSpan,
      glow,
      safeSpeed,
      safeCycle,
      ringStagger,
      dotSize,
      dotFill,
      haloLevel,
      ob,
      om,
      op,
      useWrapper,
      scale,
      minSize,
      style,
    ],
  );

  const activeMask = useMemo(() => {
    const mask = new Array<boolean>(CELL_COUNT).fill(false);
    for (const index of PATTERN_INDEXES[pattern] ?? PATTERN_INDEXES.full) {
      mask[index] = true;
    }
    return mask;
  }, [pattern]);

  /* Manhattan distance from the origin cell, so each ring fires one stagger
   * step after the ring inside it. */
  const rings = useMemo(() => {
    const maxRing =
      Math.max(originRow, MATRIX_SIZE - 1 - originRow) +
      Math.max(originCol, MATRIX_SIZE - 1 - originCol);
    return Array.from({ length: CELL_COUNT }, (_, index) => {
      const { row, col } = indexToCoord(index);
      const ring = Math.abs(row - originRow) + Math.abs(col - originCol);
      return {
        ring: Math.max(0, Math.min(maxRing, ring)),
        maxRing: Math.max(1, maxRing),
      };
    });
  }, [originRow, originCol]);

  const dots = Array.from({ length: CELL_COUNT }, (_, index) => {
    const isActive = activeMask[index];
    const { ring, maxRing } = rings[index];

    if (!isActive) {
      return (
        <span
          key={index}
          aria-hidden="true"
          className={joinClasses("owv-dot", "owv-inactive", dotClassName)}
          style={{ width: dotSize, height: dotSize }}
        />
      );
    }

    const dotStyle = {
      width: dotSize,
      height: dotSize,
      "--owv-ring": ring,
    } as unknown as CSSProperties;

    /* Frozen frame: a static falloff from the origin, no animation. */
    if (!playing) {
      const curve = 0.2 + (1 - ring / maxRing) * 0.75;
      const remapped = remapOpacity(curve, ob, om, op);
      dotStyle.opacity = remapped;
      if (bloom) {
        (dotStyle as Record<string, unknown>)["--owv-bloom-level"] =
          bloomLevel(remapped);
      }
    }

    return (
      <span
        key={index}
        aria-hidden="true"
        className={joinClasses("owv-dot", playing && "owv-wave", dotClassName)}
        style={dotStyle}
      />
    );
  });

  const matrixClasses = joinClasses(
    "owv-root",
    `owv-shape-${dotShape}`,
    muted && "owv-muted",
    (bloom || haloLevel > 0) && "owv-bloom",
    haloLevel > 0 && "owv-halo-spread",
    !useWrapper && className,
  );

  const grid = (
    <div className="owv-grid" style={{ gap }}>
      {dots}
    </div>
  );

  const hoverHandlers = hoverAnimated
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      }
    : undefined;

  /* React 19+ hoists and de-dupes this by `href`; on React 18 it renders inline
   * and still applies. Either way there is nothing for you to import. */
  const styleTag = (
    <style href="origin-wave-loader" precedence="default">
      {STYLES}
    </style>
  );

  /* With `boxSize` the matrix keeps its natural size and is scaled inside a
   * fixed outer slot, so it needs an extra wrapper to clip and center it. */
  if (useWrapper) {
    return (
      <>
        {styleTag}
        <div
          role="status"
          aria-live="polite"
          aria-label={ariaLabel}
          className={className}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: outerDim,
            height: outerDim,
            minWidth: minSize,
            minHeight: minSize,
            overflow: "hidden",
            ...style,
          }}
          {...hoverHandlers}
        >
          <div className={matrixClasses} style={rootStyle}>
            {grid}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {styleTag}
      <div
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        className={matrixClasses}
        style={rootStyle}
        {...hoverHandlers}
      >
        {grid}
      </div>
    </>
  );
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default OriginWave;
