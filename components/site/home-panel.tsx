"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { TextMorph } from "torph/react";
import { Button } from "@/components/iota/ui/button";
import { WordReveal } from "@/components/iota-app/work/motion";
import { SwapIcon, useCopy } from "./doc-parts";

export function HomePanel({ counts, foundation, skill }: { counts: { components: number; foundations: number; skills: number }; foundation: string; skill: string }) {
  const { copied, copy } = useCopy(1800);
  const reduce = useReducedMotion();

  const prompt = () => {
    const site = "https://design.useiota.space";
    return `Install the iOTA design system in this project, then follow it for all UI work.

1. Run: npx skills@latest add ${site}
2. Run: npx shadcn@latest add ${site}/r/theme.json
3. Add @import "@/components/iota/styles.css"; to the global CSS after Tailwind, and put className="iota" on <body> with IotaPortalProvider inside it.
4. Read ${site}/skills/iota/SKILL.md and treat its rules as binding.
5. Before using a component, fetch ${site}/components/<name>.md. Install it with: npx shadcn@latest add ${site}/r/<name>.json

The index of everything is at ${site}/llms.txt`;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center px-4 pb-14">
      <h1 className="flex flex-col items-end text-right text-[26px] leading-[32px] font-medium tracking-[-0.03em] text-foreground">
        <WordReveal
          onMount
          delay={reduce ? 0 : 0.15}
          lines={[[{ text: "give your" }], [{ text: "agent" }], [{ text: "taste", className: "text-brand" }]]}
          lineClassName="block"
        />
      </h1>
      <motion.div
        className="mt-5 flex flex-col items-end gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: reduce ? 0 : 0.55, ease: [0.23, 1, 0.32, 1] }}
      >
        <Button size="sm" onClick={() => copy(prompt())} aria-live="polite">
          <SwapIcon copied={copied} />
          <TextMorph duration={300} ease="cubic-bezier(0.23, 1, 0.32, 1)">{copied ? "Copied" : "Copy prompt"}</TextMorph>
        </Button>
        <p className="max-w-[240px] text-right text-[12px] leading-[17px] text-text-2">
          Paste it into your coding agent. It installs {counts.components} components and the rules that go with them.
        </p>
        <nav aria-label="Browse" className="flex items-center gap-3 text-[12px] text-text-2">
          <Link href={`/foundations/${foundation}`} className="transition-colors hover:text-brand">
            {counts.foundations} foundations
          </Link>
          <Link href={`/skills/${skill}`} className="transition-colors hover:text-brand">
            {counts.skills} skills
          </Link>
        </nav>
      </motion.div>
    </div>
  );
}
