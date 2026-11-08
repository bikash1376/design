---
name: Typography
system: iota
kind: foundation
version: 1
last-updated: 2026-11-08
human: {{SITE}}/foundations/typography
---

# Typography

Geist for every word, Geist Mono for what a person copies, Geist Pixel for the wordmark. Small sizes throughout.

## Families
- `--font-sans`: Geist. Every label, sentence and heading.
- `--font-mono`: Geist Mono. Code, commands, paths, IDs, keys and agent-facing Markdown.
- `--font-pixel`: Geist Pixel (Square, Circle, Grid, Line, Triangle). The iOTA wordmark and brand labels only.

## Scale
| Role | Size / line | Weight | Use |
|-|-|-|-|
| `type-display` | 28 / 32 | 500 | One hero line |
| `type-heading` | 17 / 22 | 600 | Page title |
| `type-heading-sm` | 15 / 20 | 500 | Card title |
| `type-heading-xs` | 13 / 18 | 500 | Section title |
| `type-body` | 13 / 19 | 400 | Body |
| `type-body-sm` | 12 / 17 | 400 | Captions and helper text |
| `type-label` | 13 / 16 | 400 | Controls |
| `type-label-sm` | 11 / 14 | 400 | Badges, a word or two |
| `type-code` | 12 / 18 | 400 | Code |

## Rules
1. type-small-by-default SHOULD Start at 13px and go up only for a hero. Because iOTA's tools are dense and the artwork is the loud thing on screen.
2. type-mono-for-copyable MUST Set mono only for what a person copies, plus agent Markdown. Because mono marks copyable text, so a mono duration looks like an ID.
3. type-pixel-brand-only MUST Set Geist Pixel only on the wordmark and brand labels. Because pixel type at length is hard to read.
4. type-sentence-case MUST Write sentence case. Because capitals read slower and make every label shout.
5. type-tracking SHOULD Keep body tracking at -0.01em. Because Geist at 13px sits better slightly tight.
