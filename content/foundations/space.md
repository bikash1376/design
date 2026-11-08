---
name: Space
system: iota
kind: foundation
source: registry/iota/tokens.css
last-updated: 2026-11-08
human: {{SITE}}/foundations/space
---

# Space

How much room goes between things, in steps of 4px.

## Rules
1. space-scale-only MUST Space with the scale (p-4 is 16px); 2px is for optical nudges only. Because an off-scale gap like 13px breaks the rhythm, so edges that should line up across a panel miss by a pixel or two.
   - Correct: `<div className="p-4">`
   - Wrong: `<div className="p-[13px]">`
2. space-control SHOULD Inside a control use 8px between icon and label and 12 to 16px padding.
3. space-card SHOULD Pad a card 16px, with 12px between rows of fields.
4. space-inset MUST Inset card text 16px (px-4). A control, chip or label at a card, header or footer edge sits as far from the edge as from the row's top and bottom: (row height minus control height) / 2. Because a 24px chip in a 40px header and a 28px button in a 44px footer both sit 8px from every edge, so the corners of a stack of cards line up.
   - Correct: `<CardHeader className="pe-2"><Chip size="xs"/></CardHeader>`
   - Wrong: `<CardHeader className="pe-4"><Chip size="xs"/></CardHeader>`
5. space-rows MUST Make a single-line row 40px and a row with a title and a description 56px; a card header is 40px; stacked cards are 12px apart. Because rows of one height scan as a column, and a row that grows by its content makes the lists beside it look misaligned.
   - Correct: `<Item size="default"/>`
   - Wrong: `<Item className="py-2.5"/>`
6. space-sections SHOULD Put 32px between app sections and 80px between marketing sections, with 120px above the hero.
7. space-before-lines MUST Try more space or a field before adding a divider line between blocks. Because every extra line competes with the table hairlines and focus rings that carry meaning.
   - Correct: `<div className="flex flex-col gap-8"><Section/><Section/></div>`
   - Wrong: `<Section/><Separator/><Section/>`

## Tokens
| Token | Role | Use for | Not for | Light |
|-|-|-|-|-|
| `--space-0-5` | optical nudge | optical nudge, tag inner gap | layout | `2px` |
| `--space-1` | icon to label inside tags | icon to label inside tags | controls | `4px` |
| `--space-2` | control inner gap, button arrow gap | control inner gap | card padding | `8px` |
| `--space-3` | control padding, table cell padding | control and table cell padding | sections | `12px` |
| `--space-4` | card padding, mobile gutter, button padding | card padding, phone gutter | sections | `16px` |
| `--space-5` | grid gap in the app | app grid gap | padding | `20px` |
| `--space-6` | section padding in the app, desktop gutter | panel padding, desktop gutter | inside controls | `24px` |
| `--space-8` | between app sections | between app sections | marketing | `32px` |
| `--space-10` | marketing block gap | marketing block gap | app | `40px` |
| `--space-15` | marketing sub-section gap | marketing sub-section gap | app | `60px` |
| `--space-20` | marketing section gap | marketing section gap | app | `80px` |
| `--space-30` | hero top padding | hero top padding | sections | `120px` |

## Decision table
| You need | Use |
|-|-|
| Icon to label | `--space-2` |
| Control padding | `--space-3 or --space-4` |
| Card padding | `--space-4, --space-6 on desktop` |
| Between app sections | `--space-8` |
| Between marketing sections | `--space-20` |

## Scale
2, 4, 8, 12, 16, 20, 24, 32, 40, 60, 80, 120px. The unit is 4px.

## Reject list
- No arbitrary pixel padding.
- No divider where space would do.

## Related
- [Grid](/foundations/grid.md): The columns and gutters a page sits on, at every width.
- [Radius](/foundations/radius.md): How round each corner is, from square marks to 10px frames, with 6px controls.
