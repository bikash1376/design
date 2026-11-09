---
name: Log viewer
system: iota
kind: component
import: "import {LogViewer} from '@/components/iota/ui/log-viewer'"
install: "npx shadcn@latest add {{SITE}}/r/log-viewer.json"
registryDependencies: [badge, button, code-block, icon, kind, status, theme, use-offscreen, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/log-viewer
---

# Log viewer

Shows a run's or an eval's output line by line as it streams, with levels, search and follow.

## Use when
- A run, deploy or eval writes lines the person reads while it works or after it fails.
- A log can reach thousands of lines and needs filtering by level and text.

## Don't use when
- The output is one block of code or a command. Use [Code block](/components/code-block.md).
- The output is structured data. Use [JSON view](/components/json-view.md).
- The steps are a handful with durations. Use [Timeline](/components/timeline.md).

## Minimal example
```tsx
<LogViewer lines={lines} streaming={run.live} label="Log for run_01J9ZKQX8M2V4E7Q"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. log-viewer-stable-ids MUST Give every line a stable id that never changes or repeats; do not use the array index when lines are removed or reordered. Because rows are windowed and measured by id, so a reused id shows the wrong height and the wrong text after a filter.
   - Correct: `lines.map(l => ({...l, id: l.seq}))`
   - Wrong: `lines.map((l, i) => ({...l, id: i}))  // after trimming the head`
2. log-viewer-levels MUST Set level to debug, info, warn or fail; leave it out for info. Because only warn and fail take color, through the row wash and the level word, and the level cells count by these four.
   - Correct: `{id: 7, level: 'fail', message: 'Could not send'}`
   - Wrong: `{id: 7, level: 'error', message: 'Could not send'}`
3. log-viewer-streaming-flag MUST Pass streaming while lines still arrive and drop it when the run ends. Because it shows "Streaming" with a running arc and says "Waiting for the first line" instead of "No output" while empty.
   - Correct: `<LogViewer lines={lines} streaming={run.live}/>`
   - Wrong: `<LogViewer lines={lines}/>  // run still live`
4. log-viewer-label MUST Pass label as a noun phrase that names the log: "Deploy log for api@v314". Because it is the header title and the accessible name of the log region, and the default "Logs" cannot tell two logs apart.
   - Correct: `<LogViewer lines={lines} label="Deploy log for api@v314"/>`
   - Wrong: `<LogViewer lines={lines}/>`
5. log-viewer-height SHOULD Set a fixed height that fits its place; the log scrolls inside it. Because rows are windowed, so the box needs a fixed height to know how many to render.
   - Correct: `<LogViewer lines={lines} height={320}/>`
6. log-viewer-kind SHOULD Pass kind for the thing the log belongs to: run for an eval, agent for an agent. Because the hue names what the log is about without coloring the lines.
   - Correct: `<LogViewer lines={lines} kind="run"/>`
7. log-viewer-no-secrets NEVER Send lines with a live key, token or customer card number. Because every line is searchable, copyable and kept in the page, and Copy lines puts the whole log on the clipboard.
   - Correct: `{id: 3, message: 'Authorization: Bearer sk_demo_0000aaaa'}`
   - Wrong: `` {id: 3, message: `Authorization: Bearer ${token}`} ``
8. log-viewer-no-custom-ids-style NEVER Underline resource IDs inside lines; the viewer turns that off on purpose. Because in a log the most repeated ID would get the loudest mark, which is noise.
   - Correct: `<LogViewer lines={lines}/>`
   - Wrong: `<LogViewer lines={lines.map(markIds)}/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `lines` | `LogLine[]` | `required` | A LogLine is {id, message, level?, source?, time?}. time is a Date, epoch ms or a preformatted string, shown as HH:MM:SS in UTC. |
| `streaming` | `boolean` | `false` | Lines are still arriving: "Streaming" with a running arc in the header. |
| `follow` | `boolean` | `true` | Stick to the bottom as lines arrive. Scrolling up pauses it; the jump button resumes it. |
| `label` | `string` | `'Logs'` | The header title and the log's accessible name. |
| `height` | `number` | `360` | px. The log's fixed height; it scrolls inside. |
| `header` | `boolean` | `true` | The label, line count, status, Next failure and Copy lines. |
| `toolbar` | `boolean` | `false` | Opt in to the filter field, the four level cells and the wrap toggle, for a long log a person searches. |
| `timestamps` | `boolean` | `true` | The time column. It hides below 640px. |
| `wrap` | `boolean` | `true` | Start with long messages wrapped. The toolbar toggle switches it. |
| `kind` | `'agent' \| 'key' \| 'run' \| 'deploy' \| 'model'` |  | The kind the log belongs to; sets data-kind on the frame. |
Other props pass through to the root element.

## Variants and states
- chrome: full, bare
- states: empty, waiting, streaming, following, scrolled back, failed, filtered
- when states meet, the first wins: streaming > failed

## Accessibility
- [ ] The body is role="log" with aria-live="off" and one tab stop, named by label, so a streaming log does not read every line.
- [ ] A polite status region announces the number of failed lines when it changes.
- [ ] Level is a word on every row, so color is never the only signal; fail and warn add a wash and a colored word.
- [ ] The level cells are toggle buttons with aria-pressed; the wrap toggle is named "Wrap lines".
- [ ] Next failure is named with its count; the jump button names how many lines are new and how many failed.
- [ ] The log stays left to right inside a right-to-left page.

## Keyboard
- `Tab`: Moves through filter, levels, wrap, then the log body as one stop.
- `Escape in the filter`: Clears the filter text.
- `Arrow keys, Page Up, Page Down`: Scroll the focused log body.

## Edge cases
- No lines, streaming -> Says "Waiting for the first line."
- No lines, finished -> Says "No output."
- Filter matches nothing -> Says "No lines match" with the text in a code tag, or "No lines at these levels."
- Scrolled up while lines arrive -> Following stops; a button counts the new lines and the failed ones, "38 new, 2 fail".
- 100,000 lines -> Only the rows on screen render; each is measured as it appears.
- Failure 40,000 lines up -> Next failure walks the fail lines in order and centers each.
- Hand selection -> Copies one line per row, with the time, level and source joined by spaces.
- Narrow box -> The filter takes its own row under 448px, level counts show from 576px and the time column hides below 640px.
- Offscreen while streaming -> The running arc pauses when the frame leaves the viewport.
- Zoom 200% -> Rows re-measure and grow with the text.

## Tokens
--log-level, --code-text, --code-comment, --accent-wash, --fail-text, --warn-text, --surface-page, --surface-hover, --surface-pressed, --surface-inverse, --text-inverse, --line-frame, --line-row, --elev-overlay, --type-code, --type-label-sm

## Related
- [Code block](/components/code-block.md): Highlighted code, one-line commands and inline code, with copy.
- [JSON view](/components/json-view.md): Foldable structured output.
- [Timeline](/components/timeline.md): Shows when each step of a run started and how long it took, with the slow and failed ones marked.
- [Status](/components/status.md): Idle, queued, running, waiting, ok, warn and fail, as a mark or a word.
