---
name: Text effects
system: iota
source: iota
kind: component
import: "import {RotatingWord} from '@/components/iota-app/work/rotating-word'"
install: "npx shadcn@latest add {{SITE}}/r/text-effects.json"
version: 1
last-updated: 2026-11-09
human: {{SITE}}/components/text-effects
---

# Text effects

Text that arrives or changes with motion: a word that cycles in place, a line that types itself, and words that lift in one by one.

## Variants
- **Rotating word**: one word cycles in place and the line around it never reflows.
- **Typewriter**: types once, with a blinking caret.
- **Word reveal**: words lift out of a slight blur, one after another.

## Use when
- A hero or a brand line has one moment to land.

## Don't use when
- People need to read the text quickly, or the text carries information they need.

## Minimal example
```tsx
import {RotatingWord} from '@/components/iota-app/work/rotating-word';
import {Typewriter} from '@/components/iota-app/typewriter';
import {WordReveal} from '@/components/iota-app/work/motion';

<RotatingWord words={["logos", "icons", "type"]}/>
<Typewriter text="draw it on"/>
<WordReveal onMount lines={[[{text: "every word arrives"}], [{text: "on its own"}]]}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. text-effects-once-per-view SHOULD Use one text effect per view. Because two moving lines compete and neither lands.
2. text-effects-no-reflow MUST Keep rotating words in one grid cell. Because a line that reflows moves the words around it.
3. text-effects-reduced MUST Show the finished text under reduced motion. Because the words matter more than the arrival.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `RotatingWord words, interval` | `string[], number` | `2400` | Words in order; ms on each. |
| `RotatingWord paused` | `boolean` | `false` | Holds the current word. |
| `Typewriter text, speed` | `string, number` | `200` | ms per letter. |
| `Typewriter paused` | `boolean` | `false` | Shows the whole text. |
| `WordReveal lines, stagger, delay` | `Segment[][], number, number` | `0.05, 0` | Lines of segments; each segment can carry a class. |
| `WordReveal onMount` | `boolean` | `false` | Runs on load instead of in view. |

## Variants and states
- effect: rotating word, typewriter, word reveal
- trigger: on mount, in view (word reveal)
- states: running, paused, finished, reduced motion

## Accessibility
- [ ] Words stay real text in reading order.
- [ ] Typewriter puts the full text in aria-label and hides the caret.
- [ ] Rotating word stops under reduced motion.

## Related
- [Reveal](/components/reveal.md): Fades a block up once it scrolls into view.
- [Pixel title](/components/pixel-title.md): The wordmark types itself out, then letters keep morphing between Geist Pixel variants.
