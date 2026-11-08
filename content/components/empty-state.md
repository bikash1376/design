---
name: Empty state
system: iota
source: quartz
kind: component
import: "import {Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, EmptyStatus, EmptyCode, EmptyQuery, EmptyRetry, emptyVariants} from '@/components/iota/ui/empty-state'"
install: "npx shadcn@latest add {{SITE}}/r/empty-state.json"
registryDependencies: [badge, button, icon, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/empty-state
---

# Empty state

Says why a space is empty and gives the one action that fills it.

## Use when
- A list, table or panel has no items and the person needs to learn how to add the first one.
- A search or filter matched nothing.
- A region could not load and has nothing else to show while it waits for a retry.

## Don't use when
- The content is on its way. Use [Skeleton](/components/skeleton.md).
- The page has a problem but its content still shows. Use [Alert](/components/alert.md).
- An action failed but the region keeps its content. Use [Toast](/components/toast.md).

## Minimal example
```tsx
<Empty>
  <EmptyHeader>
    <EmptyTitle>No agents yet</EmptyTitle>
    <EmptyDescription>Agents answer tickets and run evals.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button size="sm">Create agent</Button></EmptyContent>
</Empty>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. empty-state-error-not-empty MUST Render reason="error" with the cause when a request fails, never reason="empty" or "no-results". Because "No tickets yet" tells an operator the list is empty when the request failed, and only reason="error" sets role="alert".
   - Correct: `{error ? <Empty reason="error"><EmptyTitle>Tickets didn't load</EmptyTitle></Empty> : rows}`
   - Wrong: `{error ? <Empty><EmptyTitle>No tickets yet</EmptyTitle></Empty> : rows}`
2. empty-state-retry-promise MUST Use EmptyRetry with an onRetry that rejects on failure, not a plain Retry button. Because a plain button shows no pending state and no "Retry 2 failed at 14:03:12", so a dead endpoint looks like the button did nothing.
   - Correct: `<EmptyRetry onRetry={() => refetch()}/>`
   - Wrong: `<Button onClick={() => refetch()}>Retry</Button>`
3. empty-state-retry-focus MUST Move focus to the loaded region heading or first row when a retry succeeds and the Empty unmounts. Because the focused Retry unmounts with the Empty and focus falls to the body.
   - Correct: `useEffect(() => { if (loaded) heading.current?.focus(); }, [loaded])`
4. empty-state-one-action SHOULD Give one action and at most one ghost; it is primary only in an empty view with no other primary (button-one-primary), else secondary. Because a page header already holding Create plus a primary in the empty state gives the view two brand fills.
   - Correct: `<Button>Create agent</Button><Button variant="ghost">Read the guide</Button>`
   - Wrong: `<Button>Create</Button><Button>Import</Button><Button>Docs</Button>`
5. empty-state-title-names-thing SHOULD Name the thing and the reason in the title.
   - Correct: `<EmptyTitle>No agents yet</EmptyTitle>`
   - Wrong: `<EmptyTitle>Nothing here</EmptyTitle>`
6. empty-state-error-code SHOULD Put a reference ID or status code in EmptyCode, not in the description.
   - Correct:
     ```tsx
     <EmptyDescription>The server returned 503.</EmptyDescription>
     <EmptyCode>ref_7c2e91f4a0b3</EmptyCode>
     ```
   - Wrong: `<EmptyDescription>Error: ref_7c2e91f4a0b3 503</EmptyDescription>`
7. empty-state-error-status-word MUST Add EmptyStatus or say "failed" in the title for reason="error". Because the fail hue alone vanishes in forced colors and for readers who cannot tell red.
   - Correct: `<Empty reason="error"><EmptyStatus>Failed</EmptyStatus><EmptyTitle>Tickets didn't load</EmptyTitle></Empty>`
8. empty-state-top-left MUST Put the empty state where the first row would be: top-left of the body, under the toolbar, as variant="plain". Because a centred block in a big box reads as a template and moves the action away from where the eye already is.
   - Correct: `<TableBody><Empty variant="plain">…</Empty></TableBody>`
   - Wrong: `<Card><Empty align="center" className="min-h-60">…</Empty></Card>`
9. empty-state-no-illustration NEVER Add an illustration or big icon; write a title, one muted line and the action. Because a 240px picture pushes the cause and the action out of a small panel.
   - Wrong: `<EmptyMedia><img src="/empty-robot.svg" width={240}/></EmptyMedia>`
10. empty-state-no-cheer NEVER Write "Oops!" or "Looks like" copy; state the cause. Because "Oops" carries no cause, so the person cannot tell a retry from a support ticket.
   - Correct: `<EmptyTitle>Tickets didn't load</EmptyTitle>`
   - Wrong: `<EmptyTitle>Oops! Something went wrong</EmptyTitle>`
11. empty-state-show-query SHOULD Write the query or filter that emptied the list in an EmptyQuery inside the title.
   - Correct: `<EmptyTitle>No tickets match <EmptyQuery>chargeback</EmptyQuery></EmptyTitle>`
   - Wrong: `<EmptyTitle>No results</EmptyTitle>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `reason` | `'empty' \| 'no-results' \| 'no-access' \| 'error'` | `'empty'` | error sets role="alert" and the reserved hue. |
| `status` | `'fail' \| 'warn'` | `'fail'` | error only; warn for a partial result. |
| `variant` | `'framed' \| 'plain'` | `'framed'` | framed draws its own frame; plain shares the frame of the list it empties. |
| `size` | `'default' \| 'sm'` | `'default'` | sm for a table body, card or panel under 320px. |
| `align` | `'center' \| 'start'` | `'start'` | Deprecated: both sit top-left; center warns in development. |
| `EmptyRetry onRetry` | `() => Promise<unknown>` | `required` | Reject on failure; the retry line appears. |
Other props pass through to the root element.

## Variants and states
- reason: empty, no-results, no-access, error
- size: default, sm
- variant: framed, plain
- states: empty, no-results, no-access, error, retrying, retry-failed, action-hover, action-focus-visible

## Accessibility
- [ ] reason="error" sets role="alert" and announces the whole text once on mount.
- [ ] EmptyTitle renders an h3; the retry line is a polite status.
- [ ] EmptyStatus or the title says "failed"; the hue is not the only iota.
- [ ] Tab moves to the first action; the region takes no focus. Enter or Space on Retry runs onRetry and blocks repeats.
- [ ] EmptyMedia is aria-hidden.

## Edge cases
- Long title and reference ID -> The title wraps; the ID breaks anywhere inside the column.
- Right to left -> Sits top-right, where the first row starts.
- Inside a card or table -> Use variant="plain"; it shares that frame and never brings its own.
- 120px wide -> Actions wrap one per line; no sideways scroll.
- Retry never returns -> Stays pending with its box held; the caller adds a timeout that rejects.
- Retry fails again -> The retry line updates with the count and time in a status region.
- Ten fast clicks on Retry -> One attempt starts; pending blocks the rest.
- No children -> Renders an empty frame; always include EmptyTitle.
- Forced colors -> The frame line survives; the status word still says "Failed".
- Reduced motion -> The Retry spinner stops.

## Tokens
--surface-page, --line-frame, --line-control, --fail-line, --warn-line, --accent-mark, --radius-inner, --radius-frame, --text-3, --fail-text, --type-state-word, --type-heading-xs, --type-label, --type-body-sm, --text-1, --text-2, --type-tag, --measure-short, --type-label-sm

## Related
- [Alert](/components/alert.md): A message about the current view, inline or across the page.
- [Skeleton](/components/skeleton.md): Holds the shape of loading content.
- [Toast](/components/toast.md): Confirms an action or reports a background event, then leaves.
- [Progress](/components/progress.md): Bar, ring, steps or meter.
