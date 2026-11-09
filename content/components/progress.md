---
name: Progress
system: iota
kind: component
import: "import {Progress, ProgressLabel, ProgressValue, ProgressRing, ProgressSteps, ProgressStep, ProgressStepTrigger, ProgressStepIndicator, ProgressStepTitle, ProgressStepDescription, ProgressStepText, ProgressStepSeparator, ProgressItem, ProgressList, meterStatus} from '@/components/iota/ui/progress'"
install: "npx shadcn@latest add {{SITE}}/r/progress.json"
registryDependencies: [button, icon, kind, status, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/progress
---

# Progress

Shows how far a task has got, or how full something is.

## Use when
- A task runs for more than a second and has a known or unknown amount (progress).
- A level sits inside a range that can go down: usage, seats, storage (meter).
- A small wait sits in a row, cell, toast or line of text (ProgressRing).
- A flow has ordered steps with the current one marked (ProgressSteps).

## Don't use when
- Content is loading and its shape is known. Use [Skeleton](/components/skeleton.md).
- A one-time result to report. Use [Toast](/components/toast.md).
- A single number with a label and no range. Use [Stat](/components/stat.md).

## Minimal example
```tsx
<Progress value={62} aria-label="Nightly eval">
  <ProgressLabel>Nightly eval</ProgressLabel>
  <ProgressValue/>
</Progress>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. progress-null-until-known MUST Pass value={null} while the amount is unknown and switch to the number when it arrives. Because value={0} looks stalled and a screen reader announces 0 percent, while null shows the sliding segment and reads as busy.
   - Correct: `<Progress value={total ? done / total * 100 : null}/>`
   - Wrong: `<Progress value={0}/> // while the server counts documents`
2. progress-no-fake NEVER Animate a bar toward 90% on a timer. Use value={null} until the real amount is known. Because the bar stops at 90% whether the job takes a second or an hour, so the person stops trusting every bar.
   - Correct: `<Progress value={server.done / server.total * 100}/>`
   - Wrong: `setInterval(() => setValue(v => Math.min(90, v + 1)), 100)`
3. progress-meter-mode MUST Use mode="meter" for a level that can go down (usage, seats, storage). Because mode="progress" is a progressbar for a task moving to done, so usage that drops reads as a job going backward and gets no warnAt notch.
   - Correct: `<Progress mode="meter" value={seats} aria-label="Seats used"/>`
   - Wrong: `<Progress value={seats} aria-label="Seats used"/>`
4. progress-ring-small MUST Use ProgressRing at 12 or 16px inside a row, cell, toast or line; label={null} when a nearby word says what waits. Because the bar needs a full-width row and pushes the line apart, while a 12px ring sits in the text height.
   - Correct: `<span>Saving <ProgressRing size={12} label={null}/></span>`
   - Wrong: `<span>Saving <Progress value={null}/></span>`
5. progress-name MUST Pass aria-label when a Progress has no ProgressLabel. Because Base UI renders an unnamed progressbar, so a screen reader reads "62 percent" with no task.
   - Correct: `<Progress value={62} aria-label="Upload"/>`
   - Wrong: `<Progress value={62}/>`
6. progress-label-noun SHOULD Name the task or measure with its object: "Indexing docs-v3", "Tokens this hour".
   - Correct: `<ProgressLabel>Indexing docs-v3</ProgressLabel>`
   - Wrong: `<ProgressLabel>Progress</ProgressLabel>`
7. progress-value-unit SHOULD Say the amount in the thing's unit when it has one, and pass the same text to getAriaValueText; use a percent only without a unit.
   - Correct:
     ```tsx
     <Progress getAriaValueText={(_, v) => `${v} of 24 files`}><ProgressValue>{(_, v) => `${v} of 24 files`}</ProgressValue></Progress>
     ```
   - Wrong: `<ProgressValue/> // for 8 of 24 files`
8. progress-state-words MUST Keep the sr-only word the step and item parts render ('done', 'failed', 'waiting on you'); never replace it with only a glyph. Because a check or cross alone is silent to a screen reader, so a failed step sounds like any other.
   - Correct: `<ProgressStepIndicator/>`
   - Wrong: `<span className="grid size-6 place-items-center bg-ink"><Icon icon={Checkmark} size={12}/></span>`
9. progress-no-dots NEVER Use three bouncing dots. Use ProgressRing. Because dots carry no role or name and keep bouncing under reduced motion; ProgressRing does both.
   - Correct: `<ProgressRing size={16}/>`
   - Wrong: `<span className="animate-[bounce_1s_infinite]">...</span>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `mode` | `'progress' \| 'meter'` | `'progress'` | progress is role="progressbar"; meter is role="meter". |
| `value` | `number \| null` | `null` | null is indeterminate; a meter needs a number. |
| `shape` | `'bar' \| 'ring'` | `'bar'` | The bar is always 4px. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Ring 12, 16 or 24px. |
| `min, max` | `number` | `0, 100` | The range value runs over. |
| `kind` | `Kind` |  | Fills with the kind's mark. |
| `status` | `'warn' \| 'fail'` |  | Keeps the amount and takes the reserved hue. |
| `warnAt, failAt` | `number \| null` | `0.8, 1` | meter: fractions where it turns warn (with a notch) and fail. |
| `ProgressRing size, label, fraction` | `12 \| 16 \| 20 \| 24, string \| null, number` | `16, "Loading", null` | label={null} hides it from assistive tech. |
| `ProgressSteps value, onValueChange, orientation, linear` | `number, fn, h \| v, boolean` | `horizontal, true` | Ordered steps. |
| `ProgressStep state` | `'done' \| 'current' \| 'upcoming' \| 'error' \| 'pending' \| 'waiting'` | `from value` | waiting puts the InkSlot label after the title. |
| `ProgressItem title, status, value, detail, onCancel, onRetry` | `ReactNode, 'queued' \| 'running' \| 'done' \| 'warn' \| 'failed' \| 'canceled', number \| null, ReactNode, () => void, () => void` |  | One task in a list; title and status are required. |
Other props pass through to the root element.

## Variants and states
- mode: progress, meter
- shape: bar, ring
- size: sm, default, lg
- status: warn, fail
- states: indeterminate, determinate, warn, fail, step-done, step-current, step-upcoming, step-error, step-waiting, item-queued, item-running, item-failed

## Accessibility
- [ ] progress is role="progressbar" and meter is role="meter", named by ProgressLabel or aria-label.
- [ ] An indeterminate bar has no aria-valuenow; a third of the track slides across it, and it rests at the start under reduced motion.
- [ ] Step triggers and item Cancel or Retry are buttons named with their item; later steps are disabled when linear.
- [ ] Step and item status render an sr-only word, so status is not conveyed by shape or hue alone.
- [ ] ProgressRing with label={null} is hidden from assistive tech.

## Edge cases
- Value over max or under min -> Clamps to full or empty.
- max of 0 -> Divides by 1 and shows 0, never NaN.
- Value 1 of 100 -> A 1% sliver, at least 1px.
- Long label -> Truncates with an ellipsis; the value keeps its place.
- Failed upload item -> Keeps its last amount, swaps Cancel for Retry and shows Failed in fail text.
- Indeterminate for a long time -> Runs without changing the layout.
- Updates every 50ms -> The fill eases over --dur-base and restarts from where it is; no jitter.
- Right to left -> The fill starts at the inline start.
- Zoom 200% -> The bar stays 4px; labels grow and wrap.
- Inside a Button -> Use ProgressRing.

## Tokens
--cell-quiet, --accent-line, --warn-line, --fail-line, --accent-mark, --accent-wash, --text-3, --ink, --line-frame, --line-control, --line-row, --surface-inverse, --text-inverse, --radius-inner, --radius-soft, --radius-frame, --warn-text, --fail-text, --type-label-sm, --type-tag, --dur-base, --dur-spin, --ease-spin

## Related
- [Skeleton](/components/skeleton.md): Holds the shape of loading content.
- [Toast](/components/toast.md): Confirms an action or reports a background event, then leaves.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
- [Stat](/components/stat.md): A plain numeral with its label, delta and trend.
