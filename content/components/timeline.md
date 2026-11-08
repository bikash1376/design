---
name: Timeline
system: iota
source: quartz
kind: component
import: "import {Timeline} from '@/components/iota/ui/timeline'"
install: "npx shadcn@latest add {{SITE}}/r/timeline.json"
registryDependencies: [chart, format, kind, status, theme, use-offscreen, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/timeline
---

# Timeline

Shows when each step of a run started and how long it took, with the slow and failed ones marked.

## Use when
- A person asks where the time in a run went: steps, tool calls and model calls laid out on one clock.
- A run failed and the person needs the step that broke, in its place among the others.
- A prompt release or an eval that ran, or is running, as stages in order.

## Don't use when
- Records to compare across columns. Use [Table](/components/table.md).
- Planning work that has not happened yet.

## Minimal example
```tsx
<Timeline label="Run run_8f2a91" kind="run" spans={spans} now={elapsed}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. timeline-white-surface NEVER Put a Timeline in a Panel or beside Panels; it is a working surface, white with one grey edge and a rule under its header. Because a surface that scrolls, streams or is read closely needs the white frame's edge to show where it ends, and a white frame in a grey Panel is a box in a box.
   - Correct: `<Timeline/>`
   - Wrong: `<Panel><PanelBody><Timeline/></PanelBody></Panel>`
2. timeline-one-unit MUST Pass start and end in milliseconds and let the timeline pick one unit; never format durations yourself. Because mixed units put 950ms beside 1.2s, so the bigger-looking number is the shorter step.
   - Correct: `{label: 'plan', start: 0, end: 950}, {label: 'search', start: 950, end: 2150}`
   - Wrong: `{label: 'plan', meta: '950ms'}, {label: 'search', meta: '1.2s'}`
3. timeline-status-on-leaf MUST Set status on the span that owns it, never on its parents. Because a parent marked failed puts a second wash on the run, so two rows read as the root cause.
   - Correct: `{id: 'refund'}, {id: 'charge', depth: 1, status: 'fail'}`
   - Wrong: `{id: 'refund', status: 'fail'}, {id: 'charge', depth: 1, status: 'fail'}`
4. timeline-window-past-200 MUST Give a timeline that can pass 200 spans a maxHeight so its rows window. Because without it every span renders, and a long agent run stalls the page each second it ticks.
   - Correct: `<Timeline label="Run" spans={thousandSpans} maxHeight={480}/>`
   - Wrong: `<Timeline label="Run" spans={thousandSpans}/>`
5. timeline-no-gantt-planning NEVER Use a Timeline to plan work; it shows what happened. Because a bar here means time spent, so a planned bar reads as work already done.
   - Correct: `<Timeline label="Run run_8f2a91" spans={spans} now={elapsed}/>`
   - Wrong: `<Timeline label="Q4 roadmap" spans={[{label: 'Billing v2', start: oct1, end: dec1}]}/>`
6. timeline-name SHOULD Write label as the run it shows, with its id: "Run run_8f2a91".
   - Correct: `label="Run run_8f2a91"`
   - Wrong: `label="Timeline"`
7. timeline-wait-label SHOULD Give a waiting span the wait in waitingLabel, one to three words.
   - Correct: `{label: 'send_reply', status: 'waiting'}`
   - Wrong: `{label: 'send_reply', status: 'waiting'}`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `label` | `string` | `required` | The header title and the accessible name. |
| `spans` | `TimelineSpan[]` | `required` | {id, label, start, end?, status?, waitingLabel?, kind?, depth?, meta?, figure?}, ms from the start. figure is a token or cost count at the name column's end. |
| `now` | `number` |  | ms from the start for running and waiting spans; tick it once a second while live. |
| `activeId, onSpanClick` | `string, (span) => void` |  | The open span; rows become one tab stop. |
| `kind` | `Kind` |  | The kind the run belongs to. |
| `maxHeight` | `number` |  | Scroll past px; rows window from 200 spans. |
| `bars` | `'kind' \| 'quiet'` | `'kind'` | quiet draws grey bars; the open span takes the kind (run blue by default), a warn or failed span keeps amber or red. The trace look. |
| `footer` | `ReactNode` |  | A strip inside the frame under the rows, for the open span: tokens, cost, model. |
| `loading` | `boolean` | `false` | Still placeholder bars at fixed offsets. |
Other props pass through to the root element.

## Variants and states
- status: ok, running, warn, fail, waiting
- states: rest, open, running, warn, fail, waiting, loading, empty

## Accessibility
- [ ] The frame is a section named by label; the rows are a list, or a listbox with onSpanClick.
- [ ] Each row is named "{label}, started at 1.2s, took 0.8s, failed".
- [ ] With onSpanClick the rows are one tab stop: Up and Down move, Home and End jump, Enter opens.
- [ ] A screen-reader table carries step, start, duration and status; the bars and the axis are aria-hidden.
- [ ] Status is always a word; the wash and the bar colour never carry it alone. A narrow frame hides the status column, and the header and each row's name still say it.

## Edge cases
- Running span -> The bar has no end and grows to now, easing along between ticks of the clock.
- Waiting span -> A paper bar with an brand edge from the start to now and the waiting label, in the status column or after the bar when the frame is narrow.
- Span under 1% of the run -> Keeps a 4px bar so it stays visible.
- Deep nesting -> 16px per depth; the name truncates and meta shrinks first; under 448px the meta goes.
- 1,000 spans -> With maxHeight about 20 rows stay in the DOM.
- No spans -> "No steps yet." top-left in the body.
- Right to left -> Time runs from the right; names and the status column mirror.
- Forced colors -> Bars draw CanvasText; status stays a word.

## Tokens
--line-frame, --line-row, --accent-mark, --accent-line, --accent-wash, --ink, --surface-skeleton, --type-label, --type-label-sm, --type-tag, --text-2, --text-3, --status-column, --timeline-name, --timeline-name-min, --radius-inner, --radius-frame

## Related
- [Chart](/components/chart.md): Line, bar, sparkline or status buckets, with frame states, legend, tooltip and data table built in.
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
