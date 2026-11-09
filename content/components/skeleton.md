---
name: Skeleton
system: iota
kind: component
import: "import {Skeleton, SkeletonText, SkeletonSwap} from '@/components/iota/ui/skeleton'"
install: "npx shadcn@latest add {{SITE}}/r/skeleton.json"
registryDependencies: [css-var, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/skeleton
---

# Skeleton

Holds the space of content that is still loading.

## Use when
- Content with a known shape is loading: rows, a header, a chart frame.
- The load usually takes 150ms to a few seconds.

## Don't use when
- The shape is unknown, or the wait is a task with an amount. Use [Progress](/components/progress.md).
- A button waits on its own action. Use [Button](/components/button.md).
- The load failed. Use [Empty state](/components/empty-state.md).

## Minimal example
```tsx
<SkeletonSwap loading={loading} fallback={<RunRowSkeleton/>} label="Loading runs"><RunRow/></SkeletonSwap>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. skeleton-swap MUST Wrap loading content in SkeletonSwap, not a loading ternary; DataTable, Chart and Stat take their own loading prop instead. Because a bare ternary flashes the skeleton on a 40ms response and blanks the content on every refetch.
   - Correct: `<SkeletonSwap loading={loading} fallback={<RunRowSkeleton/>}><RunRow/></SkeletonSwap>`
   - Wrong: `{loading ? <RunRowSkeleton/> : <RunRow/>}`
2. skeleton-type-match MUST Use SkeletonText with the same type role and line count as the real text. Because each line is 1lh of its role, so a wrong role or a fixed h-4 box makes the rows jump when the text arrives.
   - Correct: `<SkeletonText type="label" className="w-48"/>`
   - Wrong: `<Skeleton className="h-4 w-48"/>`
3. skeleton-label-noun SHOULD Set SkeletonSwap label to what is loading: 'Loading runs'.
   - Correct: `<SkeletonSwap label="Loading runs">`
   - Wrong: `<SkeletonSwap label="Please wait…">`
4. skeleton-hidden MUST Keep skeletons aria-hidden and let SkeletonSwap announce once. Because a role or label on each block makes a screen reader read "loading" once per row.
   - Correct: `<SkeletonSwap label="Loading keys" loading={loading} fallback={<KeysSkeleton/>}>`
   - Wrong: `<div role="img" aria-label="loading"><Skeleton/></div>`
5. skeleton-soft-sweep SHOULD Keep the default soft sweep and add no other pulse or gradient. Because one quiet motion says the region is loading, and more pulls the eye from what has already arrived. It stops under reduced motion.
6. skeleton-row-count SHOULD Render only as many skeleton rows as fit the region, at most 8.
   - Correct: `Array.from({length: 8}, () => <RowSkeleton/>)`
   - Wrong: `Array.from({length: 50}, () => <RowSkeleton/>)`
7. skeleton-size-classes SHOULD Size a Skeleton box with the classes of the real thing: size-8 for an avatar, h-(--control) for a button.
8. skeleton-timeout MUST Time out a load that never ends and show an error Empty state in the same box. Because SkeletonSwap holds the skeleton while loading stays true, so a hung request reads as loading forever.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Skeleton` | `div props` |  | A box; size it with the real thing's classes. |
| `SkeletonText type` | `TextRole` | `'body'` | Type role it stands in for; each line is 1lh. |
| `SkeletonText lines` | `number` | `1` | How many lines; 0 renders 1. |
| `SkeletonText last` | `number` | `0.6` | Width of the last line as a fraction. |
| `SkeletonSwap loading` | `boolean` | `required` | After content has shown, a reload keeps it and marks it stale. |
| `SkeletonSwap fallback` | `ReactNode` | `required` | The skeleton. |
| `SkeletonSwap delay` | `number` | `150` | ms the skeleton stays invisible, space held. |
| `SkeletonSwap minDuration` | `number` | `400` | ms it stays once shown. |
| `SkeletonSwap label` | `string` | `'Loading'` | Announced once the skeleton shows. |
Other props pass through to the root element.

## Variants and states
- type: heading-lg, heading-sm, body, body-sm, label, code-sm
- box: avatar, button, image
- states: held invisible, shown, held after load, done, stale

## Accessibility
- [ ] Skeleton and SkeletonText are aria-hidden and take no focus.
- [ ] The swap region sets aria-busy while held or stale.
- [ ] A role="status" region announces the label once, when the skeleton shows; a reload announces nothing.
- [ ] Forced colors paint the fill GrayText so the shape stays visible.

## Edge cases
- One-line stub at w-8 -> Stays a visible 32px stub.
- lines={0} -> Clamps to one line so no zero-height block shifts later.
- Container 120px -> Text lines shrink to the container; fixed boxes keep their size.
- Right to left -> Lines start at the inline start; the short last line ends early on the left.
- Zoom 200% -> Line heights follow the role and still match the text.
- Response inside 150ms -> Swaps straight to content; the skeleton never shows.
- Loaded within 400ms of showing -> The skeleton stays to its minimum so it does not blink.
- Reload after content shown -> Content stays, aria-busy at once, 60% opacity after 150ms; no skeleton.
- Load never ends -> Skeleton and aria-busy stay forever; the caller times out.
- Inside a well or table -> The fill is the grey field, so it nearly vanishes on grey; keep skeletons on paper.

## Tokens
--surface-skeleton, --radius-soft, --radius-inner, --dur-skeleton-delay, --dur-skeleton-hold, --stale-opacity

## Related
- [Progress](/components/progress.md): Bar, ring, steps or meter.
- [Empty state](/components/empty-state.md): A region with nothing to show, that failed, or that the person cannot see.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
