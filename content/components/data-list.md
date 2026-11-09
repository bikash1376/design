---
name: Data list
system: iota
kind: component
import: "import {DataList, DataListItem, DataListLabel, DataListValue, DataListEmpty, dataListVariants} from '@/components/iota/ui/data-list'"
install: "npx shadcn@latest add {{SITE}}/r/data-list.json"
registryDependencies: [format, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/data-list
---

# Data list

Lists the facts about one thing as label and value pairs, in a real description list.

## Use when
- A detail view of one run, key, prompt release or customer lists its facts.
- A side panel or a trace span shows attributes the person reads, not edits.

## Don't use when
- Many things share the same columns and the person compares them. Use [Table](/components/table.md).
- The person edits the values. Use [Field](/components/field.md).
- The pairs are headline numbers with trends. Use [Stat](/components/stat.md).

## Minimal example
```tsx
<DataList>
  <DataListItem>
    <DataListLabel>Agent</DataListLabel>
    <DataListValue>support-agent</DataListValue>
  </DataListItem>
</DataList>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. data-list-real-dl MUST Build the pairs with DataListItem, DataListLabel and DataListValue; never a grid of divs. Because the parts render a dl with dt and dd, so a screen reader announces the term and its definition as a pair.
   - Correct: `<DataListItem><DataListLabel>Agent</DataListLabel><DataListValue>support-agent</DataListValue></DataListItem>`
   - Wrong: `<div className="grid grid-cols-2"><span>Agent</span><span>support-agent</span></div>`
2. data-list-empty-value MUST Pass null, undefined or an empty string for a missing value; never write "N/A", a dash or a blank. Because DataListValue shows the one empty word in text-3 itself, so every missing field reads the same and none looks like a bug.
   - Correct: `<DataListValue>{key.lastUsed}</DataListValue>`
   - Wrong: `<DataListValue>-</DataListValue>`
3. data-list-label-short SHOULD Keep a label to one or two words in sentence case, without a trailing colon. Because the label column is as wide as the longest label up to 160px, so one long label squeezes every value.
   - Correct: `<DataListLabel>Started by</DataListLabel>`
   - Wrong: `<DataListLabel>The person who started this run:</DataListLabel>`
4. data-list-mono-for-ids SHOULD Set identifiers, hashes and paths with mono, and counts and times with numeric. Because mono marks what a person copies, and tabular figures keep a column of numbers on one edge.
   - Correct: `<DataListValue mono>run_01J9ZKQX8M2V4E7Q</DataListValue>`
   - Wrong: `<DataListValue>run_01J9ZKQX8M2V4E7Q</DataListValue>`
5. data-list-framed-alone SHOULD Use variant="framed" only for a list that stands on its own; inside a Card or Panel keep plain. Because a frame inside a frame stacks two lines, and the card already holds the list.
   - Correct: `<Card><DataList/></Card>`
   - Wrong: `<Card><DataList variant="framed"/></Card>`
6. data-list-class-placement MUST Pass className for placement on the list; every other prop lands on the dl. Because className goes on the frame that measures the width, so a width class there sets the width the list wraps at.
   - Correct: `<DataList className="max-w-xl"/>`
   - Wrong: `<DataList className="grid-cols-3"/>`
7. data-list-no-actions-in-label NEVER Put buttons or links in a label; put the action in the value. Because a dt names the field, and a control in it is announced as part of the term.
   - Correct: `<DataListValue mono>{key}<CopyButton value={key} label="key"/></DataListValue>`
   - Wrong: `<DataListLabel><Button>Key</Button></DataListLabel>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `variant` | `'plain' \| 'framed'` | `'plain'` | framed draws its own frame with a rule between pairs. card and frame are deprecated names for framed. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | horizontal shares one label column; vertical stacks each label over its value. |
| `size` | `'sm' \| 'default'` | `'default'` | sm uses the small row (32px) and small text. |
| `DataListValue mono` | `boolean` | `false` | Mono, for identifiers, hashes and paths. |
| `DataListValue numeric` | `boolean` | `false` | Tabular figures, for a count, a time or a price. |
| `DataListEmpty` | `span props` |  | The placeholder for a field with no value. DataListValue renders it for an empty value. |
| `className` | `string` |  | Placement, on the frame. Other props go on the dl. |
Other props pass through to the dl, while className goes on the frame around it.

## Variants and states
- variant: plain, framed
- orientation: horizontal, vertical
- size: sm, default
- states: filled, empty value

## Accessibility
- [ ] It renders a dl with each pair in a div, and a dt and dd inside, which HTML allows and screen readers read as term and definition.
- [ ] The empty word is real text, not a placeholder attribute, so it is announced.
- [ ] Nothing in it is focusable; links and buttons in a value keep their own focus ring.
- [ ] Label and value use text-3 and text-1, both 4.5:1 or better on paper.

## Edge cases
- Under 448px wide -> Each label stacks above its value, so it works in a 320px panel and a page alike.
- Long label -> The label column stops at 160px and the label wraps anywhere.
- Long value or ID -> The value wraps anywhere and never widens the list.
- Missing value -> Shows the empty word in text-3; the row keeps its height.
- Several values in one pair -> They wrap in a row with an 8px gap.
- Right to left -> The label column and the text mirror.
- Zoom 200% -> Rows grow with the text and the list stacks sooner as the container narrows.
- Inside a Panel body -> Use plain; the panel body is already the white field.

## Tokens
--row, --row-sm, --label-column, --surface-page, --line-row, --line-frame, --text-1, --text-3, --type-label, --type-body, --type-tag

## Related
- [Item](/components/item.md): The list row: media, title, meta, status and actions.
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
- [Stat](/components/stat.md): A plain numeral with its label, delta and trend.
- [Field](/components/field.md): Label, control, hint and error as one unit, plus the Form part.
