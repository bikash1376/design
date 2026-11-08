---
name: JSON view
system: iota
source: quartz
kind: component
import: "import {JsonView, pathOf} from '@/components/iota/ui/json-view'"
install: "npx shadcn@latest add {{SITE}}/r/json-view.json"
registryDependencies: [badge, button, code-block, copy-button, icon, scroll-focus, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/json-view
---

# JSON view

Shows structured output as a foldable tree the person can search and copy from.

## Use when
- A tool result, a run payload or a trace span carries nested data the person inspects.
- The person needs the path to a value for code, a jq filter or a bug report.

## Don't use when
- The data is a flat list of fields with labels. Use [Data list](/components/data-list.md).
- The data is code or config the person reads as text. Use [Code block](/components/code-block.md).
- The data is many rows of the same shape. Use [Table](/components/table.md).

## Minimal example
```tsx
<JsonView data={call.output} label="issue_refund result"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. json-view-data-prop MUST Pass the parsed value in data; never a JSON string. Because a string renders as one long string leaf, so nothing folds and nothing is searchable by key.
   - Correct: `<JsonView data={call.output}/>`
   - Wrong: `<JsonView data={JSON.stringify(call.output)}/>`
2. json-view-label MUST Pass label as a noun phrase that names the payload: "issue_refund result". Because it names the tree and the search field for a screen reader, and the default "JSON" says nothing about which payload this is.
   - Correct: `<JsonView data={call.output} label="issue_refund result"/>`
   - Wrong: `<JsonView data={call.output}/>`
3. json-view-no-secrets NEVER Pass a payload that holds a live secret, a token or a full key. Because the view renders every value as text, including in search and in the copy button, and shows no mask.
   - Correct: `<JsonView data={{key: 'sk_demo_0000aaaa'}}/>`
   - Wrong: `<JsonView data={{key: process.env.API_KEY}}/>`
4. json-view-depth SHOULD Set defaultExpandDepth to the level that fits the first screen; 0 starts closed. Because a fully open 500-key payload buries the part the person came for, and a closed one hides it.
   - Correct: `<JsonView data={trace} defaultExpandDepth={1}/>`
5. json-view-small-no-toolbar SHOULD Turn toolbar off for a payload under about 10 rows. Because a search field over ten lines costs 40px and finds nothing the eye misses.
   - Correct: `<JsonView data={summary} toolbar={false}/>`
6. json-view-max-height SHOULD Set maxHeight when the view sits in a page with other content; the tree scrolls inside. Because the default 420px keeps one payload from pushing the rest of a detail page off screen.
   - Correct: `<JsonView data={payload} maxHeight={320}/>`
7. json-view-refs SHOULD Pass refs for the resource IDs in the payload so they take their kind color. Because IDs found by default are underlined in their kind hue, and refs adds the ones whose shape the default does not know.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `data` | `unknown` | `required` | Any JSON-serialisable value. A bigint reads as its digits; undefined and functions read as null. |
| `label` | `string` | `'JSON'` | The tree's accessible name and the search field's. |
| `defaultExpandDepth` | `number` | `2` | Branches shallower than this start open. 0 starts fully closed. |
| `toolbar` | `boolean` | `true` | The search field, Open all and Close all. Also turns on the path footer. |
| `copy` | `boolean` | `true` | The Copy JSON button, which copies the whole value formatted. |
| `path` | `boolean` | `toolbar` | Shows the focused row's path with a copy button under the tree. |
| `maxHeight` | `number` | `420` | px. Past this the tree scrolls. |
| `refs` | `CodeRef[]` |  | Resource references to underline in their kind hue, on top of the IDs found by default. |
Other props pass through to the root element.

## Variants and states
- chrome: full, plain
- states: rest, focused row, search match, no match, closed

## Accessibility
- [ ] The tree follows the WAI-ARIA tree pattern: one tab stop, role="tree" with treeitems, aria-level and aria-expanded.
- [ ] The search field is named "Search <label>", announces "2 of 7" or "No matches" politely, and has a clear button.
- [ ] A body wider than its box becomes its own tab stop so keyboard users can scroll it.
- [ ] The current match gets a pressed fill and, in forced colors, an outline.
- [ ] Icon buttons are named (Open all, Close all, Copy JSON); focus shows a 2px brand outline.

## Keyboard
- `ArrowDown, ArrowUp`: Moves to the next or previous visible row.
- `ArrowRight`: Opens a closed branch; on an open one, moves to its first child.
- `ArrowLeft`: Closes an open branch; otherwise moves to the parent.
- `Home, End`: Moves to the first or last visible row.
- `Enter, Space`: Toggles a branch, or unfolds a long string.
- `Enter in search`: Steps to the next match; Shift+Enter goes back, Escape clears.

## Edge cases
- String over 120 characters -> Folds to its first 80 with a "+n chars" button.
- Closed branch -> Says how much it hides: "3 keys" or "5 items".
- Searching -> Opens the branches that hold a match and hides the rest; Open all and Close all are disabled.
- No match -> Says "Nothing matches" with the query in a code tag.
- Key with a space or slash -> The footer path uses bracket form: $["user agent"].
- Empty object or array -> Renders {} or [] on one row with no caret.
- Right to left page -> The tree stays left to right, as code does.
- Forced colors -> The current match keeps an outline, since its fill is lost.
- Zoom 200% -> Rows stay 24px tall; long lines scroll sideways inside the body.

## Tokens
--code-text, --code-string, --code-comment, --surface-page, --surface-hover, --surface-pressed, --line-frame, --line-row, --row-sm, --type-code, --type-tag, --dur-fast, --ease-step

## Related
- [Code block](/components/code-block.md): Highlighted code, one-line commands and inline code, with copy.
- [Log viewer](/components/log-viewer.md): Streaming lines with levels, search and follow.
- [Tool call](/components/tool-call.md): One call with its name, arguments, status, duration and output.
- [Data list](/components/data-list.md): Label and value pairs for a detail view.
