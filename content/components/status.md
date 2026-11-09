---
name: Status
system: iota
kind: component
import: "import {Status, StatusArc, InkSlot, inkSlotVariants, statuses, statusLabels, statusRank, statusWordVariants} from '@/components/iota/ui/status'"
install: "npx shadcn@latest add {{SITE}}/r/status.json"
registryDependencies: [theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/status
---

# Status

Says where a piece of work stands, in one word.

## Use when
- A row, header or field shows work that moves through queued, running and an outcome.
- Work stops until a person acts: status="waiting" with the word that names the wait.
- A table column holds outcomes; sort it by statusRank, fail first.

## Don't use when
- The label is a category that never changes. Use [Badge](/components/badge.md).
- The person needs to know how far the work got. Use [Progress](/components/progress.md).
- The outcome needs a sentence and an action. Use [Alert](/components/alert.md).
- The change confirms something the person just did. Use [Toast](/components/toast.md).

## Minimal example
```tsx
<Status status={run.status} live/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. status-live-once MUST Set live on the one status the person is watching, and on no other in the view. Because each live Status holds its own status region, so a page of rows reads every run that settles, one over another.
   - Correct: `<Status status={run.status} live/>`
   - Wrong: `{runs.map(r => <Status key={r.id} status={r.status} live/>)}`
2. status-word-not-color NEVER Color a status good or bad; only warn and fail take a text color. Because a green ok makes every healthy row compete with the amber and red ones the operator needs to find.
   - Correct: `<Status status="ok"/>`
   - Wrong: `<span className="text-green-600">OK</span>`
3. status-no-dot NEVER Draw status as a green, amber or red dot or square; use Status. Because a dot has no word, so it vanishes in grayscale and forced colors and a screen reader reads nothing.
   - Correct: `<Status status="ok"/>`
   - Wrong: `<span className="size-2 bg-green-500"/>`
4. status-no-spinner NEVER Add a spinner beside a running row; the running arc is the spinner. Because Status already draws the arc for running, so a second spinner doubles the motion on every running row.
   - Correct: `<Status status="running"/>`
   - Wrong: `<Spinner/> Running`
5. status-sort-rank MUST Sort a status column by statusRank (fail 6, waiting 5, warn 4, running 3, queued 2, ok 1, idle 0), not by the word. Because sorting by the word puts Failed between Idle and OK, so the failed runs never reach the top.
   - Correct: `rows.sort((a, b) => statusRank[b.status] - statusRank[a.status])`
   - Wrong: `rows.sort((a, b) => a.status.localeCompare(b.status))`
6. status-waiting-not-warm NEVER Show work paused on a person as warn; use status="waiting", whose word is "Waiting on you". Because an approval is a normal step, and a warm row sends the operator looking for a failure that is not there.
   - Correct: `<Status status="waiting">Waiting on you</Status>`
   - Wrong: `<Status status="warn">Waiting on you</Status>`
7. status-one-waiting-label MUST Show at most one InkSlot (the paper waiting label) per card or panel; the rest of the queue is a count. Because the label says what waits on a person, and two in one card or panel leave no single thing to do first.
   - Correct: `<InkSlot>{approvals.length} waiting on you</InkSlot>`
   - Wrong: `{approvals.map(a => <Status key={a.id} status="waiting">Waiting on you</Status>)}`
8. status-word-short SHOULD Override the word with one to three that keep the outcome: Refund failed, never a sentence.
   - Correct: `<Status status="fail">Refund failed</Status>`
   - Wrong: `<Status status="fail">The refund could not finish because</Status>`
9. status-word-text SHOULD Name the outcome in sentence case (Connected, Expires in 3d) instead of a glyph.
   - Correct: `<Status status="ok">Connected</Status>`
   - Wrong: `<Status status="ok">✓</Status>`
10. status-arc-name MUST Give a bare StatusArc name="Running". Because without name the arc is aria-hidden, so a screen reader skips that the work is running.
   - Correct: `<StatusArc name="Running"/>`
   - Wrong: `<StatusArc/>`
11. status-running-count SHOULD Show one running count in the header instead of more than 12 turning arcs.
   - Correct: `<Status status="running">12 running</Status>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `status` | `'idle' \| 'queued' \| 'running' \| 'ok' \| 'warn' \| 'fail' \| 'waiting'` | `'idle'` | Picks the word and its color; waiting renders the InkSlot, a paper label with a light edge, or the plain brand word inside a DataTable or data grid row. |
| `variant` | `'plain' \| 'field'` | `'plain'` | field is kept for old call sites and renders as plain. |
| `label` | `string \| true` |  | Replaces the default word, like children. |
| `live` | `boolean` |  | Speaks once when the status settles on ok, warn, fail or waiting. |
| `InkSlot size` | `'default' \| 'sm'` | `'default'` | The waiting label alone, 24px or 20px, for a header or a dense row: brand text on paper with a light edge. |
| `children` | `ReactNode` |  | Replaces the default word. |
Other props pass through to the root element.

## Variants and states
- status: idle, queued, running, ok, warn, fail, waiting
- states: idle, queued, running, ok, warn, fail, waiting, live settled

## Accessibility
- [ ] The word is the status for screen readers; color is never the only signal.
- [ ] Warn and fail use --warn-text and --fail-text, 4.5:1 or better on paper and the well in both themes; the InkSlot is brand text on paper, 4.5:1 or better in both themes.
- [ ] A live status speaks once through a polite status region when it settles; the visible word is aria-hidden meanwhile.
- [ ] The running arc is aria-hidden beside the word; a bare StatusArc is role="img" named by name.
- [ ] Status is not focusable.
- [ ] Forced colors drop warn and fail to plain words; the arc draws CanvasText and the InkSlot keeps a transparent 1px border so its box survives.

## Edge cases
- Long word -> Wraps under itself; the arc stays on the first line.
- 18 statuses in 120px -> They wrap; show a running count instead of many arcs.
- Right to left -> The arc sits at the start and the word follows.
- Zoom 200% -> The word and the rem-sized arc double together.
- Pressed through six states ten times a second -> The live region updates only on ok, warn and fail.
- Inside a kind row -> data-status beats the inherited data-kind; fail stays red.
- No status prop -> Renders Idle; no children renders the default word.
- Run never returns -> Stays running and live stays silent; the caller sets warn after its deadline.
- Reduced motion -> The arc stops, stays drawn, and the word says Running.
- Two waits in one card or panel -> Show one InkSlot with the count; in a DataTable the wait is the plain brand word and each row keeps its own action.

## Tokens
--type-state-word, --features-data, --text-1, --text-2, --text-3, --warn-text, --fail-text, --dur-spin, --ease-spin, --surface-page, --line-control, --radius-inner

## Related
- [Badge](/components/badge.md): A static label for a count, category or kind, shown as a tinted word.
- [Progress](/components/progress.md): Bar, ring, steps or meter.
- [Alert](/components/alert.md): A message about the current view, inline or across the page.
- [Toast](/components/toast.md): Confirms an action or reports a background event, then leaves.
- [Item](/components/item.md): The list row: media, title, meta, status and actions.
