---
name: Chart
system: iota
kind: component
import: "import {Chart, unitFormat, ChartContainer, ChartPlot, ChartSwatch, WithChart, useChart, useOptionalChart, useElementWidth, useElementDirection, useRovingPoints, seriesTone, inkSteps, niceScale, formatCompact, numberAt, ChartTooltip, ChartTooltipContent, ChartTooltipRow, ChartDataTable, ChartLegend, chartLegendVariants, LineChart, monotonePath, linearPath, stepPath, BarChart, Sparkline, sparklineVariants, StatusBar, statusBarVariants, ChartFrame, chartFrameVariants} from '@/components/iota/ui/chart'"
install: "npx shadcn@latest add {{SITE}}/r/chart.json"
registryDependencies: [button, css-var, direction, format, icon, kind, portal, scroll-focus, segmented-control, status, theme, use-offscreen, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/chart
---

# Chart

Shows how a number moved over time, with exact values on hover.

## Use when
- A number over time where the shape matters: runs per day, reply time, cost.
- Two to four series compared on one axis.
- A daily health strip for an agent or a prompt release (type="status").
- A small trend beside a stat or in a table row (type="sparkline").

## Don't use when
- One number now. Use [Stat](/components/stat.md).
- How far a task got. Use [Progress](/components/progress.md).
- Exact values to sort and compare. Use [Table](/components/table.md).

## Minimal example
```tsx
<Chart type="line" label="Runs, last 30 days" data={rows} xKey="day" config={{runs: {label: "Runs", kind: "run"}}} unit="count"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. chart-unit MUST Set unit to duration or count; never a valueFormat that picks a unit per value. Because a per-value unit puts 900ms and 1.2s on one axis, so the ticks no longer read as one scale.
   - Correct: `unit="duration"`
   - Wrong: `` valueFormat={v => v > 1000 ? `${v / 1000}s` : `${v}ms`} ``
2. chart-loading-in-place MUST Render the Chart with loading and its final height; never a spinner or a 0px chart. Because a spinner or an empty box makes the dashboard jump when data lands, and hides which chart is which.
   - Correct: `<Chart type="line" loading={loading} height={200} …/>`
   - Wrong: `{loading ? <Spinner/> : <Chart …/>}`
3. chart-kinds-for-series SHOULD Give each series its kind in the config so the kind's hue reads the same on every screen; a single-kind chart also passes kind for its legend mark.
   - Correct: `config={{runs: {label: 'Runs', kind: 'run'}}}`
   - Wrong: `config={{runs: {label: 'Runs'}}}`
4. chart-error-in-place MUST Show an error top-left in the chart's own frame with Retry; the frame keeps its height. Because a chart swapped for an alert box moves the dashboard and loses which chart failed.
   - Correct: `<Chart error={error} onRetry={refetch} …/>`
   - Wrong: `{error ? <Alert>{error}</Alert> : <Chart …/>}`
5. chart-point-square NEVER Draw a round point; the active point is a square. Because round means a person in iOTA, and a dot on a line reads as an avatar.
   - Correct: `<rect width={8} height={8}/>`
   - Wrong: `<circle r={4}/>`
6. chart-label-range MUST Name the measure and the range in label, such as "Runs, last 30 days". Because label is the title, the table caption and the name of every point group, so "Chart" is all a screen reader hears.
   - Correct: `label="Runs, last 30 days"`
   - Wrong: `label="Chart"`
7. chart-empty-sentence SHOULD Pass empty as a sentence that names the range.
   - Correct: `empty="No runs in the last 24 hours"`
   - Wrong: `empty="No data"`
8. chart-table-always MUST Let the chart render its data table; never hide it with your own CSS. Because the sr-only table is the only way a screen reader gets the values, and display:none removes it.
   - Correct: `<Chart table …/>`
   - Wrong: `<Chart table={false} … className="[&_table]:hidden"/>`
9. chart-no-gradient NEVER Fill an area with a gradient; use area, a flat wash under one line. Because a gradient fades to nothing near the axis, so low values lose their fill and overlapping areas mix into a new hue.
   - Correct: `<Chart type="line" area series={["runs"]} …/>`
   - Wrong: `<defs><linearGradient …/></defs>`
10. chart-no-rainbow NEVER Color series by index; map series to kinds or leave them brand. Because hue means a kind in iOTA, so a purple series reads as agents, and hex values skip the line step that passes 3:1.
   - Correct: `config={{agent: {label: 'Agent', kind: 'agent'}}}`
   - Wrong: `colors={['#8b5cf6', '#ec4899', '#f59e0b']}`
11. chart-series-four SHOULD Draw at most 4 series in a line chart; split it or show the top 3 and an Other. Because kind-less series past two repeat dashed, so a fifth line no longer has a look of its own.
   - Correct: `<Chart type="line" series={topThree} …/>`
12. chart-bars-kindless-two SHOULD Keep kind-less bar series to 2. Because kind-less series step from brand to brand at 66%, and bars cannot dash for a third.
   - Correct: `<Chart type="bar" config={{a: {label: 'p50'}, b: {label: 'p95'}}}/>`
   - Wrong: `<Chart type="bar" config={{a: {label: 'p50'}, b: {label: 'p95'}, c: {label: 'p99'}}}/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `type` | `'line' \| 'bar' \| 'sparkline' \| 'status'` | `required` | Picks the chart and its loading silhouette. |
| `label` | `string` | `required` | Frame title, point group, table caption. |
| `data` | `ChartRow[] \| (number \| null)[] \| StatusBarBucket[]` | `required` | Rows, values or buckets by type. |
| `xKey, config, series` | `string, ChartConfig, string[]` |  | x field; label, kind or dashed per series; which to draw. |
| `title, description, actions` | `ReactNode` | `label` | The frame header. |
| `frame` | `'panel' \| 'plain' \| 'none'` | `'panel', sparkline 'none'` | panel is a widget in the Panel anatomy: header and legend on the grey, the plot in a white bordered body (card is its old name). plain has no chrome, inside a frame. |
| `kind, live` | `Kind, boolean` |  | The kind of a single-kind chart; a running Live status in the header while data arrives. |
| `height` | `number` | `200, status 56, sparkline 24` | px; held in every state. |
| `loading, error, onRetry, retrying, empty` | `boolean, ReactNode, () => void, boolean, ReactNode` |  | Frame states. |
| `unit` | `'duration' \| 'count'` |  | One unit for axis, tooltip and table. |
| `legend, table, defaultHidden` | `boolean, boolean, string[]` | `legend at 2+ series` | Legend toggle, table switch, hidden series. |
| `curve, area, zero` | `'monotone' \| 'linear' \| 'step', boolean, boolean` | `'monotone', false, true` | line only. |
| `stacked` | `boolean` | `false` | bar only; adds a total. |
| `kind, variant, end, size` | `sparkline` |  | Hue, line or bar, end mark, 16/24/32px. |
| `kind, noun, range, onBucketClick, size` | `status` |  | Hue, nouns, end labels, bucket click, 16/32/40px. |
Other props pass through to the root element.

## Variants and states
- type: line, bar, sparkline, status
- frame: panel, plain, none
- config: kinds, statuses, no kind
- states: ready, active point, loading, empty, error, retrying, series hidden, series highlighted, table view

## Accessibility
- [ ] The plot is a group named by label with aria-roledescription "chart".
- [ ] Each point is a button named by its x value and every series value.
- [ ] A data table with the label as caption is always in the DOM.
- [ ] Arrow keys move between points, Shift moves 7, Home and End jump, Escape hides the tooltip.
- [ ] Legend items are toggle buttons with aria-pressed.
- [ ] The tooltip is aria-hidden; the point name carries the values.
- [ ] Series differ by dash and position as well as hue, so forced colors still read.
- [ ] The frame sets aria-busy while loading; error is a status region.

## Edge cases
- Long label and series name -> The title wraps; x labels thin to one per 72px; legend names truncate.
- One data point -> Draws a small square; one bar fills its band.
- data is [] -> The sentence top-left over a baseline at the body height; the screen-reader table stays, with one row that says it.
- Null value -> Breaks the line; never drops to zero.
- 90 status cells on 320px -> Cells share the width in whole pixels at 1px gaps.
- Right to left -> The chart mirrors: x runs from the right, the y axis sits on the right, and Left and Right follow the screen.
- Text-only zoom -> SVG axis text stays 12px; read exact values from the table switch.
- Query fails -> The reason in red and Retry sit top-left at the same height; focus moves to the title when Retry unmounts.
- Touch -> Each x value is a full-height column; use about 30 buckets on phones.
- Forced colors -> Series map to CanvasText and differ by dash and position; silhouettes map to GrayText.
- Reduced motion -> Data changes redraw in one frame; nothing tweens.
- Inside a frame -> Use frame="plain" or "none" so there is one frame, never two; a chart in a Panel's body takes "none".
- Study a chart on a working page -> Put it in a Card with frame="plain"; frame="panel" is the widget.

## Tokens
--accent-mark, --accent-line, --line-accent, --chart-ink-2, --accent-wash, --line-frame, --line-row, --line-hair, --ink, --type-label-sm, --text-3, --surface-skeleton, --cell-quiet, --elev-overlay, --radius-soft, --radius-frame, --mark-size, --chart-dash

## Related
- [Stat](/components/stat.md): A plain numeral with its label, delta and trend.
- [Progress](/components/progress.md): Bar, ring, steps or meter.
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
