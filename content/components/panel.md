---
name: Panel
system: iota
kind: component
import: "import {Panel, PanelHeader, PanelTitle, PanelMeta, PanelAction, PanelBody, PanelFooter} from '@/components/iota/ui/panel'"
install: "npx shadcn@latest add {{SITE}}/r/panel.json"
registryDependencies: [button, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/panel
---

# Panel

A widget or an overlay: a grey outer with a quiet frame line, the header on the grey, the content in a white bordered body, the footer back on the grey.

## Use when
- An overview widget shows a few numbers or a short list, about 8 rows at most: what needs a look, the last releases, API keys.
- A chart widget: one chart with a title and a range, such as conversations over the last day (Chart frame="panel" is this anatomy).
- A card that asks the person for a decision, such as a prompt release waiting on Resume or Roll back, with the buttons in the footer.
- A short read-only fact set, such as an environment and its workspace ID.

## Don't use when
- A working surface: a big table or stream, a trace, a log, code, a form or the detail of one object; anything that scrolls, filters, streams or has fields the person edits, such as a settings group. Use [Card](/components/card.md).
- A task or a question that must finish first. Use [Dialog](/components/dialog.md).

## Minimal example
```tsx
<Panel>
  <PanelHeader><PanelTitle>Needs a look</PanelTitle><PanelMeta>3</PanelMeta></PanelHeader>
  <PanelBody>…rows with rule-row…</PanelBody>
</Panel>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. panel-overview-only MUST Use a Panel for a summary or a decision: a short list, one chart, a read-only fact set or a card that asks for a choice, with a title, a meta and at most one action. Fields the person edits belong in a Card. Because the grey outer gives a widget a ground of its own and puts its buttons on the grey, but a long list or a working surface needs the white Card's edge and header rule to read as one place.
   - Correct: `<Card><CardHeader/><DataTable/></Card>`
   - Wrong: `<Panel><PanelBody><DataTable/></PanelBody></Panel>`
2. panel-no-scroll NEVER Scroll inside a Panel; link to a full page for more. Because a white body that scrolls in a grey outer hides its edge, so no one can tell the list goes on.
   - Correct: `<PanelFooter><Button variant="ghost">View all</Button></PanelFooter>`
   - Wrong: `<PanelBody className="max-h-64 overflow-auto">…</PanelBody>`
3. panel-one-kind NEVER A widget is a Panel and a working surface is a Card; never a Card inside a Panel or a Panel inside a Card. Because a white card in a grey panel is a box in a box; side by side, the grey widget and the white table tell the person which one to glance at and which one to work in.
   - Correct: `<Panel><PanelBody><div className="rule-row">…</div></PanelBody></Panel>`
   - Wrong: `<Panel><PanelBody><Card/></PanelBody></Panel>`
4. panel-row-rules MUST Split rows in a PanelBody with rule-row and pad them px-3; an Item does both itself. Because the body sits 4px inside the panel, so px-3 lands the text on the same 16px as the header.
   - Correct: `<PanelBody><div className="px-3 rule-row">…</div></PanelBody>`
   - Wrong: `<PanelBody><div className="px-4 border-b">…</div></PanelBody>`
5. panel-one-action SHOULD Give the header at most one action, in PanelAction, and put "View all" there or in the footer. Because a header with several controls turns a glanceable widget into a toolbar and crowds the title off a narrow panel.
   - Correct: `<PanelAction><Button variant="ghost">View all</Button></PanelAction>`
   - Wrong: `<PanelAction><Button/><Button/><Button/></PanelAction>`
6. panel-footer-on-grey MUST Put a quiet line or buttons that belong to the whole panel in PanelFooter, never inside PanelBody. Because the body is the one white group of rows, and a footer line inside it reads as one more row.
   - Correct: `<PanelBody>…rows…</PanelBody><PanelFooter>Changes save as you go.</PanelFooter>`
   - Wrong: `<PanelBody>…rows…<p>Changes save as you go.</p></PanelBody>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Panel` | `section` |  | The grey outer (--surface-frame) with the 1px frame line and the 10px frame corner. |
| `PanelHeader` | `div` |  | A 40px row on the grey with no rule. Holds PanelTitle, PanelMeta and one PanelAction. |
| `PanelAction` | `div` |  | The header's one action, at the end, 8px from the edge. |
| `PanelBody` | `div` |  | A white bordered group 4px inside the grey. Rows take rule-row. Loses its bottom gap when a PanelFooter follows. |
| `PanelFooter` | `div` |  | Back on the grey under the body, 44px tall: a quiet line on the start, or sm buttons at the end, 8px from every edge. |
Other props pass through to the root element.

## Variants and states
- states: rest

## Accessibility
- [ ] Panel renders a section; give it aria-label, or name it with aria-labelledby on its PanelTitle.
- [ ] A list inside takes role="list" with listitem rows, named like the panel.

## Edge cases
- Very long title -> Truncates to one line and keeps the meta and the action.
- More than about 8 rows -> Show the first rows and a View all button in the header or footer.
- Empty body -> Put an empty state in the body; the panel keeps its header.
- Right to left -> The title and meta move to the right and the action to the left.
- Forced colors -> The panel keeps an outline and the body its frame border.

## Tokens
--surface-frame, --surface-page, --line-frame, --line-row, --radius-frame, --text-3, --type-label

## Related
- [Card](/components/card.md): A white working surface for one topic, optionally collapsible.
- [Dialog](/components/dialog.md): Modal work, with alert and typed-confirm variants.
- [Sheet](/components/sheet.md): A panel from an edge, modal or docked.
