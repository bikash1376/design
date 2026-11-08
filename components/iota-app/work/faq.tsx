"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Single-open questions on top of shadcn Accordion, no rules between rows: the open one sits on a soft panel.
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion defaultValue={[items[0]?.q]} className="gap-1">
      {items.map((f) => (
        <AccordionItem
          key={f.q}
          value={f.q}
          className="rounded-2xl border-0 transition-colors duration-300 not-last:border-0 hover:bg-foreground/[0.02] data-open:bg-foreground/[0.04]"
        >
          <AccordionTrigger className="px-4 py-3 text-[13px] font-medium text-foreground/85 hover:no-underline data-[panel-open]:pb-1">{f.q}</AccordionTrigger>
          <AccordionContent className="px-4 pb-1 text-[13px] leading-snug text-text-muted">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
