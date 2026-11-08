---
name: Alert
system: iota
source: quartz
kind: component
import: "import {Alert, AlertTitle, AlertDescription, AlertAction, AlertClose, alertVariants} from '@/components/iota/ui/alert'"
install: "npx shadcn@latest add {{SITE}}/r/alert.json"
registryDependencies: [button, icon, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/alert
---

# Alert

Tells the person about something on this page and what to do next.

## Use when
- Something about the current view needs reading before the person acts: a limit is near, a setting is off, a sync failed.
- The state lasts as long as its cause, so the message stays until the cause is fixed.
- A whole page or the app shell is affected: use placement="page" across its top.

## Don't use when
- Confirming an action the person just took. Use [Toast](/components/toast.md).
- A region failed to load and has nothing else to show. Use [Empty state](/components/empty-state.md).
- A field has invalid input. Use [Field](/components/field.md).
- The person must decide before anything else can happen. Use [Dialog](/components/dialog.md).

## Minimal example
```tsx
<Alert status="warn">
  <AlertTitle>Reply limit at 82%</AlertTitle>
  <AlertDescription>New tickets queue at the limit.</AlertDescription>
</Alert>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. alert-fail-stays NEVER Render AlertClose on status warn or fail; remove the alert only when the cause is gone. Because a dismissed failure hides a problem that still exists, so AlertClose renders nothing on those statuses.
   - Correct: `{overLimit && <Alert status="fail">…</Alert>}`
   - Wrong: `<Alert status="fail">…<AlertClose/></Alert>`
2. alert-dismiss-key MUST Pass a dismissKey that carries a version of the message when a neutral alert can be dismissed. Because the dismissal is stored under the key, so a fixed key also hides the changed message that follows.
   - Correct: `` <Alert dismissKey={`sampling@${rate}`}>Replies are sampled at {rate}</Alert> ``
   - Wrong: `<Alert dismissKey="sampling">Replies are sampled at {rate}</Alert>`
3. alert-one-page MUST Show one placement="page" alert at a time; merge the second or move it inline next to its cause. Because stacked page strips push the content down and leave no single thing to read first.
   - Correct: `<Alert placement="page" status="warn">…</Alert>`
   - Wrong:
     ```tsx
     <Alert placement="page" status="warn">…</Alert>
     <Alert placement="page">…</Alert>
     ```
4. alert-one-action MUST Give an alert one AlertAction with a size="sm" Button; put other paths in the description as links. Because two buttons in the action slot wrap under the message on a narrow alert and split the next step.
   - Correct:
     ```tsx
     <AlertDescription>See the <a href="/logs">run log</a>.</AlertDescription>
     <AlertAction><Button size="sm">Retry</Button></AlertAction>
     ```
   - Wrong: `<AlertAction><Button>Retry</Button><Button>Logs</Button></AlertAction>`
5. alert-title-cause SHOULD Name what happened in the title, under 48 characters, never the status.
   - Correct: `<AlertTitle>Sync with the help center failed</AlertTitle>`
   - Wrong: `<AlertTitle>Error</AlertTitle>`
6. alert-lead-strong SHOULD Lead a short alert with `<strong>` ending in a period inside AlertDescription, not an AlertTitle.
   - Correct: `<Alert size="sm"><AlertDescription><strong>Read only.</strong> Ask an owner.</AlertDescription></Alert>`
   - Wrong: `<Alert size="sm"><AlertTitle>Read only</AlertTitle>…</Alert>`
7. alert-description-next SHOULD Say what happens next or what to do, with numbers, in one or two sentences.
   - Correct: `<AlertDescription>412 articles are waiting. Retry, or check the help center's status.</AlertDescription>`
   - Wrong: `<AlertDescription>Something went wrong. Please try again later.</AlertDescription>`
8. alert-static-note MUST Pass announce={false} on an alert that is part of the page from first render. Because the default role="status" or role="alert" makes a screen reader read a standing note as news.
   - Correct: `<Alert size="sm" announce={false}>…</Alert>`
9. alert-status-not-color MUST Keep the status icon on warn and fail, or name the status in the title. Because the icon is the only other status cue, and a color-only cue vanishes in forced colors and for color-blind readers.
   - Correct: `<Alert status="fail"><AlertTitle>Past the limit</AlertTitle></Alert>`
   - Wrong: `<Alert status="fail" icon={false}>…</Alert>`
10. alert-no-success NEVER Use an Alert for success; there is no success status. Use a toast. Because a success alert stays on the page after the work is done, and green is not a iOTA status hue.
   - Correct: `toast.success('Saved support-agent')`
   - Wrong: `<Alert className="bg-green-100">Saved</Alert>`
11. alert-no-border NEVER Add a border or left stripe to an Alert. Because the alert already draws one frame line, and the icon and title carry the status; a stripe hue drifts from the status tokens.
   - Correct: `<Alert status="warn">…</Alert>`
   - Wrong: `<Alert className="border-s-4 border-amber-500">…</Alert>`
12. alert-trouble-not-painted MUST Mark warn and fail with status, which sets the icon; never fill the alert with the wash. Because a tinted block reads as a Bootstrap alert and buries the words under the colour; trouble is marked where it is.
   - Correct: `<Alert status="fail"><AlertTitle>Sync failed</AlertTitle></Alert>`
   - Wrong: `<Alert className="bg-fail-wash">Sync failed</Alert>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `status` | `'neutral' \| 'warn' \| 'fail'` | `'neutral'` | warn and fail set the status icon and never render AlertClose. |
| `placement` | `'inline' \| 'page'` | `'inline'` | page is a full-width strip at the top. |
| `size` | `'default' \| 'sm'` | `'default'` | sm is 13px with tighter padding. |
| `inset` | `boolean` | `false` | Rounds a page alert inside padding. |
| `icon` | `boolean \| ReactNode` | `true inline` | A page warn or fail keeps its icon. |
| `announce` | `boolean` | `true` | role alert for warn and fail, status otherwise. |
| `dismissKey` | `string` |  | Remembers a dismissal in localStorage. |
| `onDismiss` | `() => void` |  | Called after AlertClose hides the alert. |
Other props pass through to the root element.

## Variants and states
- status: neutral, warn, fail
- placement: inline, page
- size: default, sm
- states: rest, close hover, close focus-visible, close pressed, action pending, dismissed

## Accessibility
- [ ] Warn and fail render role="alert"; other statuses render role="status".
- [ ] Static notes pass announce={false} so nothing is read on load.
- [ ] AlertClose is a type="button" with aria-label "Dismiss".
- [ ] The status icon is aria-hidden; the icon shape and the title carry the status in forced colors.
- [ ] The alert takes no focus; Tab reaches AlertAction, then AlertClose.
- [ ] Dismissing moves focus to the next focusable element.

## Edge cases
- Long title and description -> Wraps at word boundaries; an ID breaks inside the box.
- No children -> Renders nothing, no icon and no box.
- Under 12rem wide -> Close joins the icon row; text runs full width; the action wraps under.
- Right to left -> Icon, text and action mirror through flex order.
- Zoom 200% -> Text wraps word by word; the action drops under it; nothing clips.
- Inside a card -> Render it as the card's first row rather than a frame in a frame.
- Retry fails again -> Update the description and keep the alert; never swap to a toast.
- Slow action -> The Button keeps its box and label while pending.
- Close pressed ten times -> The first dismisses and unmounts; the rest land on nothing.
- Inside a form -> AlertClose is type="button" and never submits.
- Forced colors -> Fills drop; icon shape and words tell the statuses apart.
- Touch -> AlertClose is 28px with a 36px hit area; hover is guarded.

## Tokens
--surface-page, --line-frame, --accent-mark, --warn-mark, --fail-mark, --warn-text, --fail-text, --radius-soft, --radius-frame, --control, --space-3, --space-4, --type-label, --type-body-sm, --text-1, --text-2, --button-ghost-hover, --surface-pressed, --border-focus, --line-focus, --dur-fast

## Related
- [Toast](/components/toast.md): Confirms an action or reports a background event, then leaves.
- [Empty state](/components/empty-state.md): A region with nothing to show, that failed, or that the person cannot see.
- [Field](/components/field.md): Label, control, hint and error as one unit, plus the Form part.
- [Dialog](/components/dialog.md): Modal work, with alert and typed-confirm variants.
