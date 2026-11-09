"use client";

import { motion, useReducedMotion } from "motion/react";
import { TextMorph } from "torph/react";
import { ListBulletsIcon } from "@phosphor-icons/react";
import { Button } from "@/components/iota/ui/button";
import { WordReveal } from "@/components/iota-app/work/motion";
import { OPEN_SEARCH } from "./command-menu";
import { SwapIcon, useCopy } from "./doc-parts";

const BUTTON = "h-10 px-4 text-[14px]!";

export function HomePanel({ components }: { components: number }) {
  const { copied, copy } = useCopy(1800);
  const reduce = useReducedMotion();

  const prompt = () => {
    const site = "https://design.useiota.space";
    return `Install the iOTA design system in this Next.js project, then follow it for all UI work.

1. Run: npx skills@latest add ${site}
2. If components.json does not exist, run: npx shadcn@latest init --base base --preset nova --yes
3. Run: npx shadcn@latest add ${site}/r/theme.json
4. In app/globals.css, directly after the Tailwind import, add: @import "../components/iota/styles.css";
5. In the root layout, load Geist and Geist Mono as the CSS variables --font-geist-sans and --font-geist-mono, put className="iota" on <body>, and wrap children in IotaPortalProvider from @/components/iota/lib/portal.
6. Read ${site}/skills/iota/SKILL.md and treat its rules as binding.
7. Before using a component, fetch ${site}/components/<name>.md. Install it with: npx shadcn@latest add ${site}/r/<name>.json

The index of everything is at ${site}/llms.txt`;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center px-4 pb-14 md:justify-end md:pb-6">
      <h1 className="flex flex-col items-end text-right text-[32px] leading-[38px] font-medium tracking-[-0.03em] text-foreground md:items-start md:text-left md:text-[52px] md:leading-[56px]">
        <WordReveal
          onMount
          delay={reduce ? 0 : 0.15}
          lines={[[{ text: "give your" }], [{ text: "agent" }], [{ text: "taste", className: "text-brand" }]]}
          lineClassName="block"
        />
      </h1>
      <motion.div
        className="mt-5 flex flex-col items-end gap-4 md:items-start"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: reduce ? 0 : 0.55, ease: [0.23, 1, 0.32, 1] }}
      >
        <p className="max-w-[240px] text-right text-[12px] leading-[17px] text-text-2 md:text-left">
          Paste it into your coding agent. It installs {components} components and the rules that go with them.
        </p>
        <div className="flex items-center gap-2">
          <Button className={BUTTON} onClick={() => copy(prompt())} aria-live="polite">
            <SwapIcon copied={copied} size={15} />
            <TextMorph duration={300} ease="cubic-bezier(0.23, 1, 0.32, 1)">{copied ? "Copied" : "Copy prompt"}</TextMorph>
          </Button>
          <Button variant="secondary" className={BUTTON} onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH))}>
            <ListBulletsIcon size={15} aria-hidden />
            Index
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
