---
name: Truncate
system: iota
source: quartz
kind: component
import: "import {Truncate, TextHint, textHintClass, splitTail} from '@/components/iota/ui/truncate'"
install: "npx shadcn@latest add {{SITE}}/r/truncate.json"
registryDependencies: [portal, theme, tooltip, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/truncate
---

# Truncate

Cuts one line of text that does not fit and keeps the full value one hover or one Tab away.

## Use when
- An ID, hash or path sits in a column or a header that cannot grow.
- A title or message preview must stay on one line.

## Don't use when
- The text is the content of the page. Let it wrap.
- The person needs to copy the value and read it whole. Use [Copy button](/components/copy-button.md).
- The value is code to read. Use [Code block](/components/code-block.md).

## Minimal example
```tsx
<Truncate position="middle">{run.id}</Truncate>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. truncate-middle-for-ids MUST Pass position="middle" for IDs, hashes and paths; keep the default end cut for natural text. Because IDs of one kind share a prefix, so an end cut makes run_01J9ZK… of three different runs look the same.
   - Correct: `<Truncate position="middle">{run.id}</Truncate>`
   - Wrong: `<Truncate>{run.id}</Truncate>`
2. truncate-string-child MUST Pass the value as one string child, never as nodes. Because the hint, the middle split and the copy handler all work from the string, so a node would show a hint of nothing.
   - Correct: `<Truncate position="middle">{run.id}</Truncate>`
   - Wrong: `<Truncate><b>{run.id}</b></Truncate>`
3. truncate-needs-width MUST Give the parent a width to cut against: a grid or flex cell with min-w-0, or a fixed or max width. Because an unbounded parent grows to fit the text, so nothing is ever cut and the row overflows.
   - Correct: `<div className="flex min-w-0"><Icon/><Truncate>{title}</Truncate></div>`
   - Wrong: `<div className="flex"><Icon/><Truncate>{title}</Truncate></div>`
4. truncate-tail-keeps-ext SHOULD Set tail for names with an extension or a suffix that matters. Because the default tail is the last path segment or 6 characters, which can cut ".json" off a file name.
   - Correct: `<Truncate position="middle" tail={9}>trace-2026-09-30.json</Truncate>`
5. truncate-keep-hint SHOULD Keep hint and focusable on, so a keyboard user reaches the full value. Because a cut value with no hint hides information from everyone, and one with a hint but no tab stop hides it from the keyboard.
   - Correct: `<Truncate>{title}</Truncate>`
   - Wrong: `<Truncate hint={false}>{title}</Truncate>`
6. truncate-no-css-ellipsis NEVER Cut a value with truncate or text-ellipsis classes on a iOTA surface. Because a plain ellipsis can land on half a glyph and gives no hint, no tab stop and no copy of the whole value.
   - Correct: `<Truncate position="middle">{run.id}</Truncate>`
   - Wrong: `<span className="truncate">{run.id}</span>`
7. truncate-not-for-essential NEVER Cut a value the person must read to act, like an error message or a confirmation name. Because a hint is not shown on touch until a tap and is easy to miss, so the person acts on half the text.
   - Correct: `<p>{error.message}</p>`
   - Wrong: `<Truncate>{error.message}</Truncate>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `children` | `string` | `required` | The full value. One string, so the hint can repeat it. |
| `position` | `'end' \| 'middle'` | `'end'` | end fades the last 24px; middle keeps the head and the tail and draws an ellipsis between them. |
| `tail` | `number \| 'auto'` | `'auto'` | middle only: characters kept at the end. auto keeps the last path segment, else 6. |
| `hint` | `boolean` | `true` | Shows the full value in a hint when the text is cut. |
| `focusable` | `boolean` | `true` | Makes a cut value a tab stop so a keyboard user can open the hint. |
| `TextHint content` | `ReactNode` | `required` | The same hint for any element: a wrapped child that takes a ref and props. Also disabled and side. |
Other props pass through to the root element.

## Variants and states
- position: end, middle
- states: fits, cut, hover, focus-visible

## Accessibility
- [ ] The DOM holds the whole string, so screen readers, find-in-page and copy get the full value.
- [ ] Only a value that is actually cut becomes a tab stop and shows a hint; a value that fits adds no Tab.
- [ ] The hint opens on hover and focus, closes on Escape, and on touch a tap toggles it.
- [ ] The middle cut copies the full string, not the head and tail with an ellipsis.
- [ ] Focus shows a 2px brand outline.

## Edge cases
- Value fits -> Plain text, no hint, no tab stop, no mask.
- Container resizes -> It re-measures and moves the cut; a hint appears or goes with it.
- Emoji or accented letters -> The cut lands between characters a person sees, never inside one.
- Tail longer than the value -> The whole value is the tail and nothing is cut at the head.
- Path with a long last segment -> Over 32 characters it falls back to the last 6 characters.
- Right to left -> The end fade flips to the left side; the middle cut sets dir="auto" on the text.
- Before fonts load -> It measures again when the fonts are ready, so the cut does not stay at the fallback font width.
- Narrow phone -> The hint is capped at the viewport less the gutters and wraps anywhere.
- Zoom 200% -> The cut follows the new width.

## Tokens
--hint-width, --gutter-sm, --radius-soft, --surface-inverse, --text-inverse, --line-focus, --border-focus, --space-6

## Related
- [Relative time](/components/relative-time.md): "3m ago", with the exact time on hover and focus.
- [Copy button](/components/copy-button.md): Copies a value and confirms in place.
- [Tooltip](/components/tooltip.md): Names an icon button or shows a shortcut; never holds anything essential.
- [Data grid](/components/data-grid.md): A table with spreadsheet behavior: cell focus, editing and paste.
