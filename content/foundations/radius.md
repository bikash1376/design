---
name: Radius
system: iota
kind: foundation
version: 1
last-updated: 2026-11-08
human: {{SITE}}/foundations/radius
---

# Radius

Square marks, 8px controls, 12px frames, 16px for the outer card.

| Token | Value | Class | Use |
|-|-|-|-|
| `--radius-inner` | 4px | `rounded-sm` | Tags, menu items, segment inners |
| `--radius-soft` | 8px | `rounded-lg`, `rounded-md` | Buttons, inputs, control rows |
| `--radius-frame` | 12px | `rounded-xl` | Preview panels, cards, menus |
| none | 16px | `rounded-2xl` | Vault card outer edge, the canvas |
| `--radius-full` | 999px | `rounded-full` | People, radios, switches, marketing CTAs |

## Rules
1. radius-nested MUST Make an inner radius smaller than its parent by the padding between them. Because equal radii look bloated at the corners.
2. radius-pill-marketing SHOULD Use full rounding on labels and tags only on marketing pages. Because in product UI a pill reads as a toggle, so people click a static tag.
