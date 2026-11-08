---
name: Stat
system: iota
source: quartz
kind: component
import: "import {Stat, StatGroup, StatLabel, StatValue, StatUnit, StatDelta, StatDescription, StatTrend, StatRow, statVariants, deltaOf} from '@/components/iota/ui/stat'"
install: "npx shadcn@latest add {{SITE}}/r/stat.json"
registryDependencies: [chart, icon, kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/stat
---

# Stat

Shows one key number and how it moved.

## Use when
- A view exists to answer how many or how much: spend, tickets, reply time.
- A row of two to four totals summarises the page below.
- A price or headline number on a marketing page: size xl.

## Don't use when
- The number is one cell among many of the same kind. Use [Table](/components/table.md).
- The number is progress toward a limit. Use [Progress](/components/progress.md).
- The number is a count beside a label in a row. Use [Badge](/components/badge.md).
- The shape over time matters more than the latest value. Use [Chart](/components/chart.md).

## Minimal example
```tsx
<Stat>
  <StatLabel>Tickets today</StatLabel>
  <StatValue>549</StatValue>
  <StatDelta from={498} to={549} period="yesterday"/>
</Stat>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. stat-delta-numbers MUST Pass from and to to StatDelta; never write the percent or arrow by hand. Because a typed "-8%" beside trend="up" puts the arrow against the figure and drops the "vs 507" baseline.
   - Correct: `<StatDelta from={498} to={549} period="yesterday"/>`
   - Wrong: `<StatDelta trend="up">-8%</StatDelta>`
2. stat-unit-apart MUST Put a unit in StatUnit, not in the value string. Because StatValue breaks the string only after separators, so "412ms" sets the unit in the stat face at full size.
   - Correct: `<StatValue>412<StatUnit>ms</StatUnit></StatValue>`
   - Wrong: `<StatValue>412ms</StatValue>`
3. stat-trend-words NEVER Color a delta good or bad; say it in StatDescription. Because faster latency and more errors both go down, so a green or red delta tells half the readers the wrong thing.
   - Correct:
     ```tsx
     <StatDelta from={480} to={412}/>
     <StatDescription>Faster is better</StatDescription>
     ```
   - Wrong: `<StatDelta className="text-green-600" from={480} to={412}/>`
4. stat-loading-together MUST Set loading on every Stat in a row from one flag so they land together. Because tiles that resolve one by one shift the row and let the eye compare a new number with a stale one.
   - Correct: `{tiles.map(t => <Stat key={t} loading={loading}>...</Stat>)}`
   - Wrong: `{stats.map(s => s ? <Stat>...</Stat> : <Skeleton/>)}`
5. stat-group-label MUST Give a StatGroup role="group" and an aria-label naming the period. Because a screen reader reads four labels and values with no period, so "549" has no time frame.
   - Correct: `<StatGroup role="group" aria-label="Totals for the last 24 hours">...</StatGroup>`
   - Wrong: `<StatGroup>...</StatGroup>`
6. stat-group-shared-line MUST Put two or more stats in a StatGroup, never side by side in separate cards. Because a row of boxed numbers is the template dashboard, and each box adds two edges where one shared line does the job.
   - Correct: `<StatGroup role="group" aria-label="Today"><Stat>…</Stat><Stat>…</Stat></StatGroup>`
   - Wrong: `<div className="flex gap-4"><Stat variant="framed">…</Stat><Stat variant="framed">…</Stat></div>`
7. stat-row-max SHOULD Put two to four stats in a row and drop to two columns under 576px.
   - Correct: `<div className="grid grid-cols-2 @xl:grid-cols-4">{fourStats}</div>`
   - Wrong: `<div className="flex">{eightStats}</div>`
8. stat-label-noun SHOULD Label with what is counted and the period in one to four words: Tickets today.
   - Correct: `<StatLabel>Tickets today</StatLabel>`
   - Wrong: `<StatLabel>Here is how many tickets you had</StatLabel>`
9. stat-digits SHOULD Shorten a value past six characters with formatCounts (12.5M) or step down a size.
   - Correct: `<StatValue>12.5<StatUnit>M</StatUnit></StatValue>`
   - Wrong: `<StatValue>12,480,991</StatValue>`
10. stat-no-flourish NEVER Add a gradient, glow or count-up animation; use size lg or xl. Because a count-up shows numbers that were never true, and a reader who glances mid-count reads a wrong value.
   - Correct: `<Stat size="lg">...</Stat>`
   - Wrong:
     ```tsx
     <Stat className="bg-gradient-to-br shadow-xl">...</Stat>
     useCountUp(549)
     ```

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Stat size` | `'default' \| 'lg' \| 'xl'` | `'default'` | 32, 40 or 48px numerals. |
| `Stat variant` | `'plain' \| 'framed'` | `'plain'` | framed puts the one Stat in its own frame. |
| `Stat loading` | `boolean` | `false` | Holds the space; aria-busy. |
| `Stat kind, status` | `Kind, 'warn' \| 'fail'` |  | Colors the trend line; status colors the description with the warn or fail text. |
| `StatGroup kind, variant` | `Kind, 'framed' \| 'plain'` | `'framed'` | One frame of cells sharing its lines; plain draws only the rules, inside another frame. |
| `StatDelta from, to` | `number` |  | Works out change, arrow and baseline. |
| `StatDelta format` | `(n: number) => string` |  | Formats the baseline. |
| `StatDelta period` | `string` |  | Follows the baseline: vs 498 yesterday. |
| `StatDelta trend` | `'up' \| 'down' \| 'flat'` |  | Overrides the worked-out arrow. |
| `StatTrend data, labels, label` | `number[]` |  | Sparkline, oldest first, two points or more. |
Other props pass through to the root element.

## Variants and states
- size: default, lg, xl
- variant: plain, framed
- states: up, down, flat, new, loading, empty, warn

## Accessibility
- [ ] Nothing in a Stat is a tab stop.
- [ ] The delta carries a sr-only word: Up, Down or No change.
- [ ] A new value (from 0) reads as the word new, not an infinite percent.
- [ ] The trend is role="img" named with the label and the trend in words; its sparkline and table are aria-hidden.
- [ ] The root sets aria-busy while loading.

## Edge cases
- 10-digit value at 160px -> Wraps between digit groups only; a long label wraps under itself.
- No value -> Write None in StatValue and say why in a StatDescription; from 0 to 0 draws no delta.
- Right to left -> Parts align to the start and the arrow mirrors.
- Zoom 200% -> The numeral doubles and wraps only between digit groups.
- Loading -> A 4ch block holds the value; delta and trend keep their space invisible.
- Value ticks four times a second -> Tabular figures keep the width; changes are not announced.
- NaN in from or to -> The delta renders nothing. On a failed request write None and say why.
- A group under 448px -> The cells stack, split by row rules instead of column rules.
- Forced colors -> The arrow stays currentColor; the frame edge draws in CanvasText, so the description carries trouble in words.

## Tokens
--type-stat, --type-stat-lg, --type-stat-xl, --features-data, --type-label, --text-2, --type-body-lg, --type-heading-sm, --type-label-sm, --text-3, --line-frame, --line-row, --surface-page, --radius-frame, --surface-skeleton, --accent-wash, --accent-mark, --accent-line, --warn-text, --fail-text

## Related
- [Badge](/components/badge.md): A static label for a count, category or kind, shown as a tinted word.
- [Progress](/components/progress.md): Bar, ring, steps or meter.
- [Chart](/components/chart.md): Line, bar, sparkline or status buckets, with frame states, legend, tooltip and data table built in.
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
