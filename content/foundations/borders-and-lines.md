---
name: Borders and lines
system: iota
kind: foundation
source: registry/iota/tokens.css
last-updated: 2026-11-08
human: {{SITE}}/foundations/borders-and-lines
---

# Borders and lines

One quiet grey line around each Card, a fainter rule between its rows, and a stronger edge on each control; a Panel is the grey widget with a quiet frame line.

## Rules
1. borders-and-lines-card-panel MUST Draw a working surface (a big table or stream, a trace, a log, code, a form, the detail of one object) as a white Card: one grey edge and a rule under its header. Draw a widget or a decision (an overview, a chart widget, a short list, a card that asks Resume or Roll back) as a Panel: grey outer with a quiet frame line, the header on the grey, the content in a white bordered body 4px in, the footer back on the grey. Because a working surface needs its edge and header rule to show where it ends, while a widget reads best as a quiet grey group whose body is the one white group and whose buttons rest on the grey.
   - Correct: `<Card><CardHeader/><DataTable/></Card>`
   - Wrong: `<Panel><PanelBody><DataTable/></PanelBody></Panel>`
2. borders-and-lines-no-mixed-frames NEVER A widget is a Panel and a working surface is a Card; never a Card inside a Panel or a Panel inside a Card. Because a white card in a grey panel is a box in a box; side by side, the grey widget and the white table tell the person which one to glance at and which one to work in.
   - Correct: `<Panel><PanelBody><div className="rule-row">…</div></PanelBody></Panel>`
   - Wrong: `<Panel><PanelBody><Card/></PanelBody></Panel>`
3. borders-and-lines-one-frame MUST Give a component one frame line and split its rows with rule-row; never a box in a box. Because a box in a box stacks edges until no one can tell which group a line closes.
   - Correct: `<Card><div className="rule-row">…</div></Card>`
   - Wrong: `<Card><Card>…</Card></Card>`
4. borders-and-lines-row-rules MUST Split rows with rule-row, the 8% line; the last row drops it because the frame line is right below. Because a row rule as heavy as the frame line reads as a second box, and a rule on the last row doubles the bottom edge.
   - Correct: `<li className="rule-row"/>`
   - Wrong: `<li className="border-b border-gray-200"/>`
5. borders-and-lines-control-edge MUST Give every control its 1px control edge at rest; it is brand at 50%, 3.3:1 on paper, and neither --line-frame nor --line-row is ever a control's only edge. Because the frame line and row rule are decorative and fall under 3:1, so a control drawn with them has no edge a person can find until they hover.
   - Correct: `<Input/>`
   - Wrong: `<input className="bg-surface"/>`
6. borders-and-lines-shared-line MUST Draw cells side by side in a ButtonGroup (frame-shared), so neighbours meet on one line. Because two cells that each draw a full border paint the shared pixel twice, and a translucent line reads heavier where they meet.
   - Correct: `<div className="flex">{cells.map(c => <span className="frame-shared"/>)}</div>`
   - Wrong: `<div className="flex gap-px">{cells.map(c => <span className="border"/>)}</div>`
7. borders-and-lines-wash-selection MUST Mark selection with the wash and the frame line above and below; never a bar on one edge. Because an edge bar reads as a status stripe, and a wash alone vanishes in forced colors where the lines survive.
   - Correct: `<Item kind="deploy" selected/>`
8. borders-and-lines-focus MUST Show focus on a field (input, textarea, select, date trigger, OTP, composer, code editor) by turning its edge brand with a soft 3px brand halo around it (--focus-halo), eased, with no outline. Every other keyboard target, such as a button, gets a 2px brand outline at a 2px offset; in a strip or a list the ring sits inside the cell (focus-ring-inset), and on an brand fill it is paper (focus-ring-ink). Because a field already has an edge, so an outline on top doubles it; an offset ring on a button lands on the neighbour's shared line, and an brand ring on an brand fill is 1:1.
   - Correct: `focus-visible:focus-ring-inset data-checked:focus-visible:focus-ring-ink`

## Tokens
| Token | Role | Use for | Not for | Light | Dark (blank: same as light) |
|-|-|-|-|-|-|
| `--line-hair` | dividers, rings | separator, ring |  | `1px` |  |
| `--line-accent` | the 2px accent stroke | active tab line, chart stroke | dividers | `2px` |  |
| `--line-focus` | focus outline width | focus outline width | borders | `2px` |  |
| `--focus-offset` | focus outline offset | every focusable |  | `2px` |  |
| `--line-frame-alpha` | the brand alpha of a frame's edge: a quiet grey line, so a screen of frames reads light | line-frame |  | `0.14` | `0.20` |
| `--mark-size` | the legend square and the menu radio dot | chart legend, radio item |  | `8px` |  |
| `--ring-cutout` | the gap ring that cuts an overlapping avatar out of the surface | avatar group |  | `2px` |  |
| `--chart-dash` | stroke-dasharray for a comparison or projected series | chart |  | `6 4` |  |
| `--chart-axis-gap` | gap between a tick label and the plot; chart.tsx reads it into its layout | chart |  | `8px` |  |
| `--border-hair` | a divider where fields cannot separate | old hairline, kept until its last reader goes | anything new | `oklch(var(--brand-c) / 0.08)` |  |
| `--border-faint` | a divider inside a grey card | card rows |  | `oklch(var(--brand-c) / 0.05)` |  |
| `--border-strong` | the strongest hairline | input hover, outline button |  | `oklch(var(--brand-c) / 0.12)` |  |
| `--border-control` | the edge of an empty control, 3.4:1 on --surface-page, 3.3:1 on --surface-card (WCAG 1.4.11) | checkbox, radio, switch |  | `oklch(var(--brand-c) / 0.50)` |  |
| `--border-focus` | focus outline, always brand | focus outline, always brand | hover | `var(--ink)` |  |
| `--line-frame` | the one outer edge of a component, 1px, a quiet grey | the one outer edge of a component and of an overlay; a quiet grey, decorative and not in the 3:1 check | rows, or a control's only edge | `oklch(var(--brand-c) / var(--line-frame-alpha))` |  |
| `--line-row` | the rule between rows and under a header, 1px; decorative, since rows also differ by content and space | between rows and under a header; decorative | a control's only edge | `oklch(var(--brand-c) / 0.08)` |  |
| `--line-control` | the quiet edge of a field, a secondary button and a chip; the label and placeholder identify the control, so it stays light | empty control edge and strip cells, 3.3:1 on paper | dividers | `oklch(var(--brand-c) / 0.16)` |  |
| `--line-control-hover` | that edge under the pointer or while open | input, select, secondary button |  | `oklch(var(--brand-c) / 0.32)` |  |
| `--scrollbar-thumb` | scrollbar thumb at rest | scroll area, scrollbar-color |  | `oklch(var(--brand-c) / 0.20)` |  |
| `--chart-brand-2` | second brand series, 5.8:1 on --surface-page | multi-series chart without kinds |  | `oklch(var(--brand-c) / 0.66)` |  |
| `--cell-quiet` | an empty or zero cell in a heat strip or calendar grid | heatmap, status bar |  | `oklch(var(--brand-c) / 0.07)` |  |
| `--focus-halo` | a field with the cursor: a soft brand halo around its brand edge, eased in | the soft 3px brand halo around a focused field | buttons, which take the outline | `0 0 0 3px oklch(var(--brand-c) / 0.08)` |  |

## Decision table
| You need | Use |
|-|-|
| Edge of a component | `--line-frame (frame)` |
| Between rows | `--line-row (rule-row)` |
| Edge of an empty control | `--line-control (control-edge)` |
| Cells side by side | `frame-shared` |
| Focus | `--border-focus: a button outline at --line-focus, a field edge` |
| Selected row | `--accent-wash between frame lines` |

## Scale
Three lines, all 1px: the 14% frame line (20% in dark), the 50% control edge and the 8% row rule. Only the control edge counts toward the 3:1 check. Focus and accent lines are 2px.

## Reject list
- No box inside a box.
- No two lines where neighbours meet.
- No one-edge bars for selection or emphasis.

## Related
- [Color](/foundations/color.md): Five hues name the kind of thing, and amber and red mean trouble.
- [Elevation](/foundations/elevation.md): Everything is flat, and only overlays get a shadow.
- [Radius](/foundations/radius.md): How round each corner is, from square marks to 10px frames, with 6px controls.
