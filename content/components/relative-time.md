---
name: Relative time
system: iota
source: quartz
kind: component
import: "import {RelativeTime, formatRelative, untilChange} from '@/components/iota/ui/relative-time'"
install: "npx shadcn@latest add {{SITE}}/r/relative-time.json"
registryDependencies: [theme, truncate, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/relative-time
---

# Relative time

Shows when something happened as a distance from now, with the exact time on hover and focus.

## Use when
- A row, card or message says when a run, edit or key event happened.
- A future moment counts down: a retry, an expiry, a scheduled eval.

## Don't use when
- The exact time is the content, like a log line or an audit export. Use [Log viewer](/components/log-viewer.md).
- The date is a fixed fact the person plans around, like a release day. Write the date.

## Minimal example
```tsx
<RelativeTime date={run.startedAt}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. relative-time-component MUST Render a moment with RelativeTime; never format "3m ago" by hand. Because a hand-made label goes stale on the page, has no exact time on hover and reads differently from the rest of the product.
   - Correct: `<RelativeTime date={run.startedAt}/>`
   - Wrong: `<span>{minutesAgo}m ago</span>`
2. relative-time-date-prop MUST Pass date as a Date, an ISO string or epoch milliseconds; never a preformatted label. Because the component needs the moment to tick, to build the exact-time hint and to set dateTime on the time element.
   - Correct: `<RelativeTime date="2026-10-13T11:57:00Z"/>`
   - Wrong: `<RelativeTime date="3 minutes ago"/>`
3. relative-time-short-in-columns SHOULD Use the default short format in rows and tables, and format="long" only inside a sentence. Because "3m ago" stays narrow and lines up on tabular figures, while "3 minutes ago" widens every row of the column.
   - Correct: `<RelativeTime date={run.startedAt}/>`
   - Wrong: `<RelativeTime date={run.startedAt} format="long"/>`
4. relative-time-freeze-now SHOULD Pass now to freeze the clock in tests, docs and screenshots. Because a live clock changes the label between renders, so a snapshot never matches twice.
   - Correct: `<RelativeTime date={run.startedAt} now="2026-10-13T12:00:00Z"/>`
5. relative-time-keep-hint SHOULD Keep hint on unless the time sits inside a control that is already a tab stop or already shows the exact time beside it. Because the hint is the only place the exact time appears; hint={false} also removes the extra tab stop.
   - Correct: `<RelativeTime date={run.startedAt}/>`
   - Wrong: `<RelativeTime date={run.startedAt} hint={false}/>`
6. relative-time-no-size-classes NEVER Pass type or color classes to make a time louder; set the color on the parent. Because a time is metadata, and a heavier time in a row competes with the title and the status.
   - Correct: `<span className="text-text-3"><RelativeTime date={run.startedAt}/></span>`
   - Wrong: `<RelativeTime date={run.startedAt} className="text-text-1 font-bold"/>`
7. relative-time-old-dates SHOULD Leave past a week to the component, which switches to a calendar date. Because "41d ago" is harder to place than "Sep 2", and a date answers "was that before the release".

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `date` | `Date \| string \| number` | `required` | The moment, as a Date, an ISO string or epoch milliseconds. An invalid value renders "Unknown time". |
| `format` | `'short' \| 'long'` | `'short'` | short is "3m ago"; long is "3 minutes ago", for a sentence. |
| `now` | `Date \| string \| number` |  | Freezes the clock. When set, the time never ticks. |
| `hint` | `boolean` | `true` | Shows the exact local time and UTC on hover and focus, and makes the time a tab stop. |
| `className` | `string` |  | Placement only. Set color and type on the parent. |
Other props pass through to the time element, not the hint.

## Variants and states
- format: short, long
- range: now, minutes, hours, days, past a week, future
- states: rest, hover, focus-visible

## Accessibility
- [ ] The visible label is aria-hidden; a screen reader reads the long form and the exact local time ("14 minutes ago, Oct 13, 2026, 11:46:00 AM").
- [ ] The time element carries dateTime in ISO form.
- [ ] With a hint it is a tab stop and shows a 2px focus outline; the hint opens on focus, and a tap toggles it on touch.
- [ ] It ticks only when the label would change, and not while the tab is hidden.

## Edge cases
- Under 45 seconds -> Reads "now" in both directions.
- Unit boundary -> Turns to the next unit before the rounded value reaches it, so it never reads "60m ago".
- Past a week -> A calendar date, with the year only when it is not this year.
- Invalid date -> Renders "Unknown time" in text-3 with data-invalid.
- Server render -> Reads in UTC as a calendar date with no clock; the browser clock and zone take over after mount.
- A page of 200 times -> Each schedules its own next change, not a shared interval, so none wakes to render the same words.
- Background tab -> Stops ticking and catches up the moment the tab shows again.
- Right to left -> The label is English text; the box stays inline and does not wrap.
- Zoom 200% -> Stays on one line and grows with the text.

## Tokens
--text-3, --text-2, --radius-soft, --line-focus, --border-focus, --focus-offset, --surface-inverse, --text-inverse

## Related
- [Truncate](/components/truncate.md): Long IDs and text cut at the middle or the end, with the full value reachable.
- [Tooltip](/components/tooltip.md): Names an icon button or shows a shortcut; never holds anything essential.
- [Log viewer](/components/log-viewer.md): Streaming lines with levels, search and follow.
- [Item](/components/item.md): The list row: media, title, meta, status and actions.
