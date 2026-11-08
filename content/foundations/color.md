---
name: Color
system: iota
kind: foundation
version: 1
last-updated: 2026-11-08
human: {{SITE}}/foundations/color
---

# Color

White chassis, one brand blue, and warm colors only for trouble.

## Palette
| Token | Light | Dark | Use |
|-|-|-|-|
| `--brand` | `#0057fc` | `#0057fc` | Primary action, checked controls, focus, wordmark |
| `--brand-foreground` | `#ffffff` | `#ffffff` | Text on brand |
| `--ink` | `#18181b` | `#ededf0` | Body text (read as `text-text-1`) |
| `--muted-fg` | `#71717a` | `#9b9ba4` | Secondary text (`text-text-2`) |
| `--faint-fg` | `#a1a1aa` | `#6b6b74` | Icons and hints, never sentences (`text-text-faint`) |
| `--hairline` | `#ececed` | `#26262b` | Row rules |
| `--panel` | `#f4f4f5` | `#161619` | Control rows, wells |
| `--fill` | `#e6e6e9` | `#2a2a31` | Slider fill, segmented thumb |
| `--card-frame` | `#fbf9f7` | `#131316` | The mat a preview sits on |
| `--card-frame-border` | `#f0f0f0` | `#1d1d21` | Card edge |
| `--canvas-bg` | `#f2f2f2` | `#101013` | The floating canvas |
| `--canvas-dot` | brand at 34% | brand at 34% | Canvas dots |

## Kind hues
Five muted hues name the kind of thing: agent, key, run, deploy and model. Use them through `<Badge kind/>` or `data-kind`, never as a fill for a region.

## Rules
1. color-brand-one-action MUST Use the brand fill for one primary action per view. Because blue marks the next step, so two blue fills give no next step.
2. color-warm-is-trouble NEVER Use amber or red for anything but warn and fail. Because a warm tag reads as a failing run.
3. color-tokens-only MUST Reference tokens by role, never a raw hex. Because a raw value keeps its light color in the dark theme.
4. color-faint-no-sentences NEVER Set a sentence in `text-text-faint`. Because #a1a1aa is 2.5:1 on white, which holds an icon or a hint and not a sentence.
5. color-artwork-exempt SHOULD Let artwork use any color through Color picker. Because a person's artwork belongs to them, not the system.
