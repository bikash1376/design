---
name: Collapsible
system: iota
source: quartz
kind: component
import: "import {Collapsible, CollapsibleGroup, CollapsibleTrigger, CollapsibleCaret, CollapsibleContent} from '@/components/iota/ui/collapsible'"
install: "npx shadcn@latest add {{SITE}}/r/collapsible.json"
registryDependencies: [icon, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/collapsible
---

# Collapsible

Keeps detail one click away under a heading.

## Use when
- Detail most people skip: raw input, tool call history, advanced settings.
- A list of questions or sections people scan by heading and open one at a time (CollapsibleGroup).

## Don't use when
- The sections are views of one object people switch between. Use [Tabs](/components/tabs.md).
- The detail is needed to act on the page; show it.
- A card whose body folds. Use [Card](/components/card.md).

## Minimal example
```tsx
<Collapsible>
  <CollapsibleTrigger summary="2 lines">Raw input</CollapsibleTrigger>
  <CollapsibleContent>run.start</CollapsibleContent>
</Collapsible>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. collapsible-summary SHOULD Pass summary with the count and the one fact that matters, such as '1 of 6 failed'. Because a closed section otherwise gives no reason to open it, and a failure inside stays hidden.
   - Correct: `<CollapsibleTrigger summary="1 of 6 failed" summaryStatus="fail">Tool calls</CollapsibleTrigger>`
   - Wrong: `<CollapsibleTrigger>Tool calls</CollapsibleTrigger>`
2. collapsible-disabled-empty MUST Disable the trigger of an empty region and say 0 in the summary. Because a trigger that opens to nothing costs a press and reads as content that failed to load.
   - Correct: `` <CollapsibleTrigger disabled={n === 0} summary={`${n} calls`}>Tool calls</CollapsibleTrigger> ``
   - Wrong: `<CollapsibleTrigger>Tool calls</CollapsibleTrigger> // opens to nothing`
3. collapsible-find SHOULD Pass hiddenUntilFound to CollapsibleContent when people search the page with the browser's find. Because a standalone panel unmounts when closed, so find-in-page never reaches what is inside.
   - Correct: `<CollapsibleContent hiddenUntilFound>…</CollapsibleContent>`
4. collapsible-trigger-noun MUST Name what is inside the trigger, such as 'Raw input', never 'Show more'. Because the label is the button's accessible name, and a list of "Show more" buttons says nothing about any of them.
   - Correct: `<CollapsibleTrigger>Raw input</CollapsibleTrigger>`
   - Wrong: `<CollapsibleTrigger>Show more</CollapsibleTrigger>`
5. collapsible-summary-short SHOULD Keep the summary under 32 characters and add nothing that is missing from the open content. Because the summary truncates on the trigger row and disappears on open, so anything only it says is lost.
   - Correct: `<CollapsibleTrigger summary="6 calls">Tool calls</CollapsibleTrigger>`
6. collapsible-one-caret NEVER Add a plus or second chevron to CollapsibleTrigger. Because the trigger already draws one caret at the start that turns when open, so a second glyph gives two cues that can disagree.
   - Correct: `<CollapsibleTrigger>Raw input</CollapsibleTrigger>`
   - Wrong: `<CollapsibleTrigger><Icon icon={Add}/>Raw input<Icon icon={ChevronDown}/></CollapsibleTrigger>`
7. collapsible-group-size SHOULD Split a group past 10 sections by topic under headings, or add search.
   - Correct: `<h2>Billing</h2><CollapsibleGroup>…</CollapsibleGroup>`
8. collapsible-content-scroll MUST Let wide content own its scrolling with overflow-x-auto. Because the panel is overflow-hidden, so a long line is clipped with no way to scroll to it.
   - Correct: `<CollapsibleContent><pre className="overflow-x-auto">{longLine}</pre></CollapsibleContent>`
   - Wrong: `<CollapsibleContent><pre>{longLine}</pre></CollapsibleContent>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Collapsible open, defaultOpen, onOpenChange, disabled` | `Base UI Collapsible.Root` | `closed` | Inside a group it is an item and takes value. |
| `CollapsibleGroup value, defaultValue, onValueChange` | `Base UI Accordion.Root` |  | The open items. |
| `CollapsibleGroup multiple` | `boolean` | `false` | More than one open at once. |
| `CollapsibleGroup variant` | `'framed' \| 'plain'` | `'framed'` | framed is one frame of rows; plain is rows only, for a group inside a frame. |
| `CollapsibleGroup size` | `'default' \| 'lg'` | `'default'` | lg is the one spacious exception, for a marketing FAQ: px-6 py-5 triggers and content indented 48px. Every other size keeps text 16px from the edge. |
| `CollapsibleTrigger size` | `'default' \| 'sm' \| 'row'` | `'default'` | row is a full-width 40px row in text-3, for the last row of a list in a frame. |
| `CollapsibleTrigger summary` | `ReactNode` |  | What the closed region holds; hidden while open. |
| `CollapsibleTrigger summaryStatus` | `'warn' \| 'fail'` |  | Warn or fail text for the summary. |
| `CollapsibleContent keepMounted, hiddenUntilFound` | `Base UI` | `group: hiddenUntilFound on` | Lets find open a closed section. |
Other props pass through to the root element.

## Variants and states
- form: single, group
- size: default, lg
- variant: framed, plain
- states: closed, open, hover, focus-visible, disabled

## Accessibility
- [ ] The trigger is a button with aria-expanded and aria-controls, named by label and summary.
- [ ] Enter or Space toggles; Up, Down, Home and End move between group triggers.
- [ ] A group trigger sits in an h3; the content is a region named by the trigger.
- [ ] The caret is aria-hidden.
- [ ] Group triggers are 40px tall; the standalone trigger is 32px.

## Edge cases
- Long trigger label -> Wraps; the summary stays one line and truncates.
- One-word label -> Keeps the 40px row in a group, 32px alone, and the caret.
- Wide content -> Scrolls in its own box; the panel clips nothing else.
- Right to left -> The caret points left when closed; content indents from the right.
- Zoom 200% -> The trigger grows with min-h; the summary truncates.
- Text spacing -> Trigger and content grow with the text.
- Empty region -> Opens to nothing; disable the trigger.
- Content loading -> Show a Skeleton inside; the panel grows when data arrives.
- Ten clicks in a second -> Each cuts open or shut; it ends in the last state.
- Collapsible inside a group item -> Renders as an item; wrap nested stacks in their own group.
- Forced colors -> Field sections get a 1px outline; the caret stays visible.
- Reduced motion -> Nothing changes: the panel and the caret always cut.

## Tokens
--type-label, --surface-hover, --text-disabled, --row, --control, --radius-soft, --radius-frame, --type-label-sm, --text-3, --surface-page, --line-frame, --line-row, --dur-fast, --ease-step

## Related
- [Tabs](/components/tabs.md): Panels of one view, with closable and reorderable document tabs.
- [Card](/components/card.md): A white working surface for one topic, optionally collapsible.
