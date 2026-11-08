---
name: Item
system: iota
source: quartz
kind: component
import: "import {Item, ItemMedia, ItemContent, ItemActions, ItemLink, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemMeta, ItemStatus, ItemHeader, ItemFooter, itemVariants} from '@/components/iota/ui/item'"
install: "npx shadcn@latest add {{SITE}}/r/item.json"
registryDependencies: [kind, status, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/item
---

# Item

Shows one thing on a row with its name, status, time and actions.

## Use when
- A list of things of one or more kinds, each opened by clicking its row: eval runs, agents, prompt releases.
- A row needs a status, a time and one or two actions beside the name.
- The same list appears in a sidebar and on a page and must work in both.

## Don't use when
- The rows need sorting or aligned columns of numbers. Use [Table](/components/table.md).

## Minimal example
```tsx
<Item kind="run">
  <ItemContent><ItemTitle><ItemLink href="/runs/run_01">refund-eval</ItemLink></ItemTitle></ItemContent>
  <ItemStatus status="running"/>
</Item>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. item-link-stretch MUST Put an ItemLink in the title and keep ItemActions as buttons when the row opens something and has actions. Because a row rendered as a link with a Button inside nests a button in a link, which a screen reader flattens.
   - Correct:
     ```tsx
     <Item><ItemContent><ItemTitle><ItemLink href={url}>{name}</ItemLink></ItemTitle></ItemContent>
     <ItemActions><Button>More</Button></ItemActions></Item>
     ```
   - Wrong: `<Item render={<a href={url}/>}>... <Button>More</Button></Item>`
2. item-kind-on-row MUST Set kind on the Item, not only on the kind label. Because selection takes its hue from data-kind on the row, so without it the open run shows the default wash.
   - Correct: `<Item kind="deploy" selected>...</Item>`
   - Wrong: `<Item selected>... <Badge kind="deploy"/> ...</Item>`
3. item-current MUST Pass selected and aria-current="true" on its ItemLink for the open row. Because a wash class sets no data-selected or aria-current, so forced colors lose the outline and a screen reader hears no current row.
   - Correct:
     ```tsx
     <Item selected kind="run"><ItemTitle><ItemLink aria-current="true" href={url}>...</ItemLink></ItemTitle></Item>
     ```
   - Wrong: `<Item className="bg-accent-wash">...</Item>`
4. item-list-markup SHOULD Render a list of Items as a ul with each Item in an li.
   - Correct: `<ul>{runs.map(r => <li key={r.id}><Item .../></li>)}</ul>`
   - Wrong: `<ItemGroup>{runs.map(r => <Item .../>)}</ItemGroup>`
5. item-title-name SHOULD Use the thing's name in the title, not its kind.
   - Correct: `<ItemTitle>refund-eval</ItemTitle>`
   - Wrong: `<ItemTitle>Run: refund-eval</ItemTitle>`
6. item-actions-two SHOULD Show at most 2 icon buttons and move the rest into a DropdownMenu.
7. item-description-two-lines SHOULD Keep a description to what tells this row apart, up to 2 lines.
   - Correct: `<ItemDescription>Replays 412 tickets against the release candidate.</ItemDescription>`
8. item-name-room SHOULD Leave the ID out of the title in a rail under 240px; the row drops it under 416px.
9. item-no-card-per-row NEVER Wrap every row in its own card or frame; put rows in an ItemGroup, which draws the one frame. Because a frame per row stacks two frame lines between neighbours and hides the selected row's rules.
   - Correct: `<ul>{runs.map(r => <li><Item>...</Item></li>)}</ul>`
   - Wrong: `{runs.map(r => <Card className="shadow">...</Card>)}`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Item variant` | `'default' \| 'framed' \| 'muted' \| 'outline'` | `'default'` | framed draws its own edge; outline is its old name and muted is deprecated, both kept. |
| `Item in a Card` | `context` |  | Rows under a CardHeader are split by row rules, square, with the card clipping the corners. |
| `Item size` | `'default' \| 'sm' \| 'dense'` | `'default'` | Minimum 40px, 56px with a description; sm 32px, dense 28px. xs is a deprecated alias of dense. |
| `Item kind` | `Kind` |  | Selection takes this hue. |
| `Item selected` | `boolean` |  | The kind's wash. |
| `Item render` | `ReactElement` |  | A link or li. With actions inside, use ItemLink. |
| `ItemMedia variant` | `'default' \| 'icon' \| 'image'` | `'default'` | default holds an Avatar. |
| `ItemStatus status` | `StatusValue` |  | Children replace the word. |
Other props pass through to the root element.

## Variants and states
- variant: default, framed
- size: default, sm, dense
- states: rest, hover, focus-visible, pressed, selected, narrow

## Accessibility
- [ ] Tab focuses the row link, then each action; focus draws a 2px ring around the whole row.
- [ ] ItemLink is the link with the name and aria-current when open; the whole row is its hit area.
- [ ] The status word stays at every width, so it is always read.
- [ ] Selected draws a 2px outline in forced colors.
- [ ] Hover applies on hover-capable devices only.

## Edge cases
- Long name -> Truncates with an ellipsis; the ID keeps 7ch; a description clamps at 2 lines.
- Narrowing row -> Drops the time under 608px, the ID under 416px, then truncates the name.
- Right to left -> Parts mirror.
- Failed row -> Show ItemStatus fail; put the reason in the description.
- Long list -> Scrolls inside its box; rows measure with container queries, so length costs no layout.
- No children -> An empty row at its minimum height; use Empty state for zero items.
- Loading -> Show Skeleton rows at the same minimum height.
- Action pressed ten times -> Fires the button only, never the row link.
- Zoom 200% -> The row grows (min-h, not h).
- Inside a menu -> Use size="dense".

## Tokens
--surface-hover, --surface-pressed, --dur-fast, --ease-step, --accent-wash, --accent-mark, --line-frame, --line-row, --radius-soft, --radius-frame, --row, --row-sm, --row-lg, --control-sm, --space-4, --space-3, --space-2, --type-label, --type-body-sm, --text-2, --text-3, --line-focus, --border-focus

## Related
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
- [Card](/components/card.md): A white working surface for one topic, optionally collapsible.
