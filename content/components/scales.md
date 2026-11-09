---
name: Scales
system: iota
kind: component
import: "import {Scales, ScalesContainer} from '@/components/iota-app/ui/scales'"
install: "npx shadcn@latest add {{SITE}}/r/scales.json"
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/scales
---

# Scales

A repeating line pattern for quiet texture behind a panel.

## Use when
- Marking an empty or reserved region of a layout.

## Don't use when
- Behind running text.

## Minimal example
```tsx
<ScalesContainer orientation="diagonal" size={10}>…</ScalesContainer>
```

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `orientation` | `'horizontal' \| 'vertical' \| 'diagonal'` | `'diagonal'` |  |
| `size` | `number` | `10` | Line spacing in px. |
| `color` | `string` | `Foreground at 10%` |  |

## Variants and states
- orientation: horizontal, vertical, diagonal
- parts: Scales alone, or ScalesContainer around content

## Accessibility
- [ ] aria-hidden.

## Related
- [Card](/components/card.md): A white working surface for one topic, optionally collapsible.
