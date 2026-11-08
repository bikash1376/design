---
name: Control row
system: iota
source: iota
kind: component
import: "import {ControlRow} from '@/components/iota-app/playground/control-row'"
install: "npx shadcn@latest add {{SITE}}/r/control-row.json"
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/control-row
---

# Control row

A labelled panel row matching the sliders, for a swatch, toggle or select.

## Use when
- A non-slider control sits between slider rows.

## Don't use when
- Forms. Use [Field](/components/field.md).

## Minimal example
```tsx
<ControlRow label="Loop"><Switch checked={loop} onChange={setLoop} label="Loop"/></ControlRow>
```

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `label` | `string` |  |  |
| `children` | `ReactNode` |  | The control. |

## Variants and states
- content: switch, color swatch, select, any small control
- states: rest, control focused, control disabled

## Accessibility
- [ ] Give the inner control its own name.

## Related
- [Range slider](/components/slider.md): A row that is its own track: a thin tick marks the value, label left and value right.
- [Color picker](/components/color-picker.md): A swatch that opens saturation, hue, hex, swatches and the eyedropper in a shadcn Popover.
