"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Every /work animation honours the visitor's reduced-motion setting.
export function WorkMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// Fades a block up into place, either once it scrolls into view or, with
// `onMount`, as soon as the page loads.
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  onMount = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  onMount?: boolean;
}) {
  const to = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(onMount
        ? { animate: to }
        : { whileInView: to, viewport: { once: true, amount: 0.2 } })}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Text that arrives word by word, each word lifting out of a slight blur.
// `lines` are rendered as block spans (the hero's two lines); each segment
// can carry its own class, so emphasis survives the split.
type Segment = { text: string; className?: string };

export function WordReveal({
  lines,
  delay = 0,
  stagger = 0.05,
  onMount = false,
  lineClassName,
}: {
  lines: Segment[][];
  delay?: number;
  stagger?: number;
  onMount?: boolean;
  lineClassName?: string;
}) {
  let i = 0;
  return (
    <motion.span
      initial="hidden"
      {...(onMount
        ? { animate: "shown" }
        : {
            whileInView: "shown",
            viewport: { once: true, amount: 0.3 },
          })}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {lines.map((line, li) => (
        <span key={li} className={lineClassName}>
          {line.map((seg, si) =>
            seg.text.split(/(\s+)/).map((word, wi) =>
              /^\s+$/.test(word) || word === "" ? (
                word
              ) : (
                <motion.span
                  key={`${si}-${wi}-${i++}`}
                  className={`inline-block ${seg.className ?? ""}`}
                  variants={{
                    hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
                    shown: { opacity: 1, y: 0, filter: "blur(0px)" },
                  }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  {word}
                </motion.span>
              ),
            ),
          )}
        </span>
      ))}
    </motion.span>
  );
}

// A soft disc that drifts back and forth: the closing banner's background.
export function Drift({
  className,
  x,
  y,
  duration,
}: {
  className: string;
  x: number;
  y: number;
  duration: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{ x: [0, x], y: [0, y], scale: [1, 1.05] }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
    />
  );
}
