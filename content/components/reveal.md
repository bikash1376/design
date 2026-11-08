---
name: Reveal
system: iota
source: iota
kind: component
import: "import {Reveal} from '@/components/iota-app/work/motion'"
install: "npx shadcn@latest add {{SITE}}/r/reveal.json"
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/reveal
---

# Reveal

Fades a block up once it scrolls into view.

## Use when
- Marketing sections on first scroll.

## Don't use when
- Anything people see repeatedly.

## Minimal example
```tsx
<Reveal delay={0.1}>…</Reveal>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. reveal-once MUST Run once. Because motion repeated on every scroll becomes a wait.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `delay` | `number` | `0` |  |
| `y` | `number` | `24` |  |
| `onMount` | `boolean` | `false` | Runs on load instead of in view. |

## Variants and states
- trigger: in view, on mount
- states: hidden, revealing, shown, reduced motion

## Accessibility
- [ ] Follows reduced motion under WorkMotion.

## Related
- [Word reveal](/components/text-effects.md): Text that arrives word by word, each lifting out of a slight blur.
