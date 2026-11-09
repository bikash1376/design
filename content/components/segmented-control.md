---
name: Segmented control
system: iota
kind: component
import: "import {SegmentedControl, SegmentedControlItem, segmentedVariants} from '@/components/iota/ui/segmented-control'"
install: "npx shadcn@latest add {{SITE}}/r/segmented-control.json"
registryDependencies: [kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/segmented-control
---

# Segmented control

Switches between a few views of one thing.

## Use when
- Two to five views of the same content: time range, conversation state, monthly or yearly.
- Filters that combine, such as errors and warnings shown together (multiple).

## Don't use when
- The views are separate pages or panels with their own content. Use [Tabs](/components/tabs.md).
- The choice is a form value saved later. Use [Radio group](/components/radio-group.md).
- There are more than five options. Use [Select](/components/select.md).
- One setting is on or off. Use [Switch](/components/switch.md).

## Minimal example
```tsx
<SegmentedControl aria-label="Time range" defaultValue="24h">
  <SegmentedControlItem value="1h">1h</SegmentedControlItem>
  <SegmentedControlItem value="24h">24h</SegmentedControlItem>
</SegmentedControl>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. segmented-control-name MUST Name the control with aria-label or aria-labelledby. Because the control is a radiogroup, so without a name a screen reader announces "24h, radio" with no question.
   - Correct: `<SegmentedControl aria-label="Time range" defaultValue="24h">`
   - Wrong: `<SegmentedControl defaultValue="24h">`
2. segmented-control-default MUST Pass defaultValue or value in single mode; it is empty until the first press and cannot be cleared. Because with nothing selected the view has no state to show, and a radio cannot be cleared back to none.
   - Correct: `<SegmentedControl defaultValue="24h">...</SegmentedControl>`
   - Wrong: `<SegmentedControl>...</SegmentedControl>`
3. segmented-control-count SHOULD Pass count on each segment when the views hold different amounts, and countMax for a live count.
   - Correct: `<SegmentedControlItem value="waiting" count={waiting} countMax={999}>Waiting on you</SegmentedControlItem>`
4. segmented-control-short-labels SHOULD Write one or two words per segment, of about equal length.
   - Correct: `"1h", "24h", "7d"`
   - Wrong: `"1h", "Last 24 hours", "7d"`
5. segmented-control-max-five MUST Use Select past five segments; the control cannot wrap or scroll. Because a sixth segment overflows the box on a narrow screen, since the control never wraps or shrinks a label below 6 characters.
   - Correct: `<Select items={languages}/>`
   - Wrong: `<SegmentedControl>{languages.map(...)}</SegmentedControl>`
6. segmented-control-icon-name MUST Set aria-label on a segment that holds only an icon. Because the glyph has no text, so a screen reader announces an unnamed radio.
   - Correct: `<SegmentedControlItem value="list" aria-label="List"><Icon icon={List} size={16}/></SegmentedControlItem>`
7. segmented-control-no-hue NEVER Fill a segment with a kind's hue; the selected segment is always the fill thumb on the panel track, and the kind goes in a Badge beside the control. Because the thumb is how a person sees the choice, and a pastel segment reads as a label, not a selected one.
   - Correct: `<SegmentedControlItem value="refund">Refunds</SegmentedControlItem>`
   - Wrong: `<SegmentedControlItem value="refund" className="bg-accent-tint">Refunds</SegmentedControlItem>`
8. segmented-control-thumb-springs SHOULD Keep the one thumb that springs between segments in single mode. Because it shows where the selection came from, and it stays in step with arrow keys because the spring is short. Multiple mode has no thumb; each pressed segment fills.
   - Correct: `<SegmentedControl defaultValue="24h">...</SegmentedControl>`
   - Wrong: `<SegmentedControlItem className="data-checked:bg-page"/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `multiple` | `boolean` | `false` | false is a radio group; true is a toggle group. |
| `value / defaultValue` | `string \| string[]` |  | The selected segment, or segments with multiple. |
| `onValueChange` | `(value) => void` |  | Fires on arrow keys too in single mode. |
| `size` | `'xs' \| 'sm' \| 'default'` | `'default'` | 24, 28 or 32px minimum; grows with 200% text. |
| `fill` | `boolean` | `false` | Stretch to the container; segments share the width. |
| `countMax` | `number` |  | Widest expected count; its width is reserved. |
| `Item count` | `number` |  | Tabular figures after the label, read as the description. |
| `Item kind` | `'agent' \| 'key' \| 'run' \| 'deploy' \| 'model'` |  | Sets data-kind only, for the things inside the segment; the selected thumb stays the fill color and no segment takes a hue. |
| `Item value, disabled, aria-label` | `string, boolean, string` |  | aria-label is required for an icon-only segment. |
Other props pass through to the root element.

## Variants and states
- multiple: false, true
- fill: false, true
- size: xs, sm, default
- states: rest, hover, pressed, focus-visible, selected, disabled, one segment disabled, multiple none pressed

## Accessibility
- [ ] The root is a radiogroup, or a group with multiple, named by aria-label.
- [ ] Each segment is a radio, or a button with aria-pressed in multiple mode.
- [ ] The control is one tab stop; Tab focuses the selected segment.
- [ ] Arrow keys move and select in single mode and move focus only in multiple mode; arrows skip disabled segments.
- [ ] Space and Enter select a segment, or toggle it in multiple mode.
- [ ] The count is aria-hidden and read as the segment description.
- [ ] Forced colors keep a Highlight fill on the selected segment and GrayText on disabled ones.

## Edge cases
- Long label -> The label box fades its last 16px, the title carries the full text, and segments shrink to a floor.
- Seven labels in 320px -> The track cannot wrap or scroll and runs past its container. Use Select past five.
- Count passes 99 to 100 -> The slot is reserved for countMax, so no segment moves.
- Right to left -> Segments mirror and arrow keys follow the visual order.
- Zoom 200% -> The track is max(--control, 1lh + 12px) and grows with the text.
- No value in single mode -> Nothing is selected until the first press; it cannot return to none.
- Slow or failed view -> The view shows its own loading or error under the control; the control stays put.

## Tokens
--panel, --fill, --radius-inner, --radius-soft, --control, --control-sm, --control-xs, --space-3, --space-4, --text-2, --text-1, --surface-hover, --text-disabled, --surface-pressed, --line-focus, --ease-step, --fade-line-end

## Related
- [Button group](/components/button.md): Joins related buttons, including a split menu.
- [Radio group](/components/radio-group.md): One choice from a short visible list.
- [Select](/components/select.md): One choice from a popup list, or the native select.
- [Tabs](/components/tabs.md): Panels of one view, with closable and reorderable document tabs.
