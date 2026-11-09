---
name: Origin wave
system: iota
kind: component
more: https://dotmatrix.zzzzshawn.cloud/
more-label: Dot Matrix
import: "import {OriginWave} from '@/components/iota-app/origin-wave'"
install: "npx shadcn@latest add {{SITE}}/r/origin-wave.json"
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/origin-wave
---

# Origin wave

A dot grid that ripples out from its origin, iOTA's spinner.

## More loaders
Origin Wave is one of the matrix loaders in [Dot Matrix](https://dotmatrix.zzzzshawn.cloud/). When a screen needs another loader, get it from there rather than drawing one:

```bash
npx shadcn@latest add @dotmatrix/<loader-name>
```

For example `@dotmatrix/dotm-square-3`. Browse names at https://dotmatrix.zzzzshawn.cloud/. Setup is at https://dotmatrix.zzzzshawn.cloud/getting-started/usage.

## Use when
- A brand loading moment on a stage.

## Don't use when
- A running row. Use [Status](/components/status.md).

## Minimal example
```tsx
<OriginWave size={60} dotSize={8} pattern="grid3" color="#0057fc" animated/>
```

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `size` | `number` |  | Box in px. |
| `dotSize` | `number` |  |  |
| `pattern` | `OriginWavePattern` |  |  |
| `dotShape` | `'circle' \| 'square' \| 'diamond' \| 'hearts'` |  |  |
| `animated` | `boolean` |  |  |

## Variants and states
- dotShape: circle, square, diamond, hearts
- pattern: every OriginWavePattern, such as grid3
- states: animated, still, hover animated, muted, reduced motion

## Accessibility
- [ ] Decorative: pair with text.
