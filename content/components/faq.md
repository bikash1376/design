---
name: FAQ
system: iota
kind: component
import: "import {Faq} from '@/components/iota-app/work/faq'"
install: "npx shadcn@latest add {{SITE}}/r/faq.json"
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/faq
---

# FAQ

Single-open questions on shadcn Accordion, the open one on a soft panel.

## Use when
- Questions on a marketing page.

## Don't use when
- Settings. Use [Collapsible](/components/collapsible.md).

## Minimal example
```tsx
<Faq items={[{q: "Which agents?", a: "Any that read skills."}]}/>
```

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `items` | `{q, a}[]` |  |  |

## Variants and states
- states: closed, open, hover, focus-visible, disabled, reduced motion

## Accessibility
- [ ] Accordion keyboard and aria-expanded come from shadcn.

## Related
- [Collapsible](/components/collapsible.md): Shows and hides one region, or a group of them.
