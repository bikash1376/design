"use client";

import { useEffect, useState } from "react";

// The Geist Pixel shape variants. Index 0 (Square) is the default look.
const VARIANTS = [
  "var(--font-geist-pixel)",
  "var(--font-pixel-circle)",
  "var(--font-pixel-grid)",
  "var(--font-pixel-line)",
  "var(--font-pixel-triangle)",
];

// Hero wordmark: types itself out, then the letters keep morphing on their own,
// each cycling to a random Geist Pixel variant. Hovering a letter also morphs it.
export function PixelTitle({
  text = "iOTA",
  className = "",
  speed = 200,
  interval = 600,
  caret = "typing",
  paused = false,
}: {
  text?: string;
  className?: string;
  speed?: number;
  interval?: number;
  // "typing" hides the caret once the word is out (hero use); "always" keeps it
  // blinking after the last letter, terminal-prompt style (navbar wordmark).
  caret?: "typing" | "always";
  /** Shows the whole word and stops morphing. */
  paused?: boolean;
}) {
  const chars = [...text];
  const [typedRaw, setTyped] = useState(0);
  const typed = paused ? chars.length : typedRaw;
  const [variants, setVariants] = useState<number[]>(() => chars.map(() => 0));
  const done = typed >= chars.length;

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setTyped((v) => v + 1), speed);
    return () => clearTimeout(id);
  }, [typed, done, speed]);

  const morph = (i: number) =>
    setVariants((prev) => {
      const next = [...prev];
      let r = next[i];
      while (r === next[i]) r = Math.floor(Math.random() * VARIANTS.length);
      next[i] = r;
      return next;
    });

  // Once typed, keep shuffling a random letter to a new variant, forever.
  useEffect(() => {
    if (!done || paused) return;
    const id = setInterval(
      () => morph(Math.floor(Math.random() * chars.length)),
      interval,
    );
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, interval, chars.length, paused]);

  return (
    <span className={`inline-block leading-none ${className}`} aria-label={text}>
      {chars.map((ch, i) =>
        i < typed ? (
          <span
            key={i}
            onMouseEnter={() => morph(i)}
            style={{ fontFamily: VARIANTS[variants[i]] }}
            className="pixel-letter inline-block transition-transform duration-150 will-change-transform hover:-translate-y-1.5"
          >
            {ch}
          </span>
        ) : null,
      )}
      {(!done || caret === "always") && (
        <span className="caret" aria-hidden>
          _
        </span>
      )}
    </span>
  );
}
