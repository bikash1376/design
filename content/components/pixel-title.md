---
name: Pixel title
system: iota
kind: component
import: "import {PixelTitle} from '@/components/iota-app/pixel-title'"
install: "npx shadcn@latest add {{SITE}}/r/pixel-title.json"
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/pixel-title
---

# Pixel title

The wordmark types itself out, then letters keep morphing between Geist Pixel variants.

## Setup
Load Geist Pixel as the CSS variable `--font-geist-pixel`, and as `--font-pixel-circle`, `--font-pixel-grid`, `--font-pixel-line` and `--font-pixel-triangle` for the morph. Without them the letters fall back to the default font.

## Use when
- The iOTA wordmark on a hero or a navbar.

## Don't use when
- Headings or body text. Use Geist Sans.

## Minimal example
```tsx
<PixelTitle text="iOTA" className="font-pixel text-brand"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. pixel-only-wordmark MUST Set Geist Pixel only on the wordmark and brand labels. Because pixel type at length is hard to read.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `text` | `string` | `'iOTA'` |  |
| `speed` | `number` | `200` | Typing ms per letter. |
| `interval` | `number` | `600` | Morph ms. |
| `caret` | `'typing' \| 'always'` | `'typing'` |  |

## Variants and states
- caret: typing, always
- states: typing, morphing, letter hovered, paused, reduced motion

## Accessibility
- [ ] aria-label holds the full word.

## Related
- [Typewriter](/components/text-effects.md): Types text once with a blinking caret.
