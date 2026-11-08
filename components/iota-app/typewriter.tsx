"use client";

import { useEffect, useState } from "react";

// Types the text out once, with a blinking caret.
export function Typewriter({
  text,
  className = "",
  speed = 200,
  paused = false,
}: {
  text: string;
  className?: string;
  speed?: number;
  paused?: boolean;
}) {
  const [raw, setN] = useState(0);
  const n = paused ? text.length : raw;
  const done = n >= text.length;

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setN((v) => v + 1), speed);
    return () => clearTimeout(id);
  }, [n, done, speed]);

  return (
    <span className={`inline-block leading-none ${className}`} aria-label={text}>
      {text.slice(0, n)}
      <span className="caret" aria-hidden>
        _
      </span>
    </span>
  );
}
