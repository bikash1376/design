---
name: Color picker
system: iota
kind: component
import: "import {ColorSwatch} from '@/components/iota-app/ui/color-picker'"
install: "npx shadcn@latest add {{SITE}}/r/color-picker.json"
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/color-picker
---

# Color picker

A swatch that opens saturation, hue, hex, swatches and the eyedropper in a shadcn Popover.

## Use when
- A playground needs any color rather than a token.

## Don't use when
- Choosing a color in product UI. Use tokens.

## Minimal example
```tsx
<ColorSwatch value={color} onChange={setColor}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. color-picker-artwork MUST Use only for artwork colors. Because a free color in product UI breaks the token rule.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `value` | `string` |  | Hex color. |
| `onChange` | `(hex) => void` |  | Called while dragging. |
| `className` | `string` |  | Placement only. |

## Variants and states
- states: closed, open, dragging the color area, dragging hue, typing a hex, invalid hex
- parts: saturation area, hue slider, hex field, preset swatches, eyedropper where the browser supports it

## Accessibility
- [ ] The trigger is named Pick color.
- [ ] The eyedropper only shows where the browser supports it.

## Related
- [Control row](/components/control-row.md): A labelled panel row matching the sliders, for a swatch, toggle or select.
- [Range slider](/components/slider.md): A row that is its own track: a thin tick marks the value, label left and value right.
