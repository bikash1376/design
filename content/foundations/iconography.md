---
name: Iconography
system: iota
kind: foundation
version: 1
last-updated: 2026-11-08
human: {{SITE}}/foundations/iconography
---

# Iconography

Phosphor for glyphs, Hugeicons for chevrons and overflow, one import point.

## Using icons
```tsx
import {Icon, Copy} from '@/components/iota/icon';
<Icon icon={Copy} size={16}/>
```
Direct imports also work in iOTA's own components: `CopyIcon` from `@phosphor-icons/react` and `MoreHorizontalIcon` from `hugeicons-react`.

## Which library
- Phosphor, regular weight: nearly everything. Use bold for a check confirming an action.
- Hugeicons, stroke 2.2 to 2.4: chevrons, back arrows and the overflow mark, where iOTA wants a lighter line.
- react-icons: brand logos only (Si*), never UI glyphs.

## Rules
1. icon-one-source MUST Import UI icons from `icon.tsx`, or from Phosphor and Hugeicons directly in iOTA's own components. Because a third style breaks the set.
2. icon-actions-only NEVER Put an icon on every label. Because when every item has a glyph, none can be found by its shape.
3. icon-name-it MUST Name an icon-only control with aria-label. Because a screen reader otherwise says "button".
4. icon-sizes SHOULD Use 12, 14, 16 or 18. Because other sizes land between pixels and blur.
