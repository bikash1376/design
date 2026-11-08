---
name: Activity
system: iota
source: quartz
kind: component
import: "import {Activity, ActivityText, ActivityGroup, Disclosure, StepGlyph, pastTense, joinSummary, pickActivity, useAntiFlicker, useHeldPhrase, MIN_DISPLAY, activityVariants, rowVariants} from '@/components/iota/ai/activity'"
install: "npx shadcn@latest add {{SITE}}/r/activity.json"
registryDependencies: [icon, kind, status, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/activity
---

# Activity

Says what the agent is doing now in plain words, and sums up the turn when it ends.

## Use when
- The agent works for a few seconds before any text, and the person needs to know it is alive.
- A finished turn folds its tool rows to one line, like "Worked for 14s".

## Don't use when
- A thread already shows each tool as a running row. Use [Tool call](/components/tool-call.md).
- The wait is a determinate task with a percent. Use [Progress](/components/progress.md).
- The model's thinking is the content the person reads. Use [Reasoning](/components/reasoning.md).

## Minimal example
```tsx
<Activity waiting={!started} active={running} label="Searching docs" doneLabel="Refunded 1 order"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. activity-phrase-form MUST Write label as an -ing verb and its object: "Searching docs", "Running eval". Because the done label is derived from it by pastTense, so "Searching docs" becomes "Searched docs" and a noun phrase does not.
   - Correct: `<Activity active label="Searching docs"/>`
   - Wrong: `<Activity active label="Docs search"/>`
2. activity-waiting-first-gap MUST Use waiting only for the gap before the first token, reasoning or tool call of a turn. Because the loader is the first-wait state; once anything arrives the phrase or the thread row takes over.
   - Correct: `<Activity waiting={isStreaming && !hasOutput}/>`
   - Wrong: `<Activity waiting={isStreaming}/>`
3. activity-summary-done-label SHOULD Pass doneLabel with a summary of the whole turn, and joinSummary for trouble counts. Because the default is the past tense of the last phrase, which tells only about the last step of the turn.
   - Correct: `<Activity doneLabel={joinSummary(['refunded 3 orders'], ['1 failed'])} status="fail"/>`
   - Wrong: `<Activity label="Writing the reply" status="fail"/>`
4. activity-status-end MUST Pass status="warn" or "fail" when the turn warned or failed; stopped when a person ended it. Because the end word and the reserved hue are the only signal that a turn did not go well, and ok hides it.
   - Correct: `<Activity doneLabel="Looked up 2 orders, 1 failed" status="fail"/>`
   - Wrong: `<Activity doneLabel="Looked up 2 orders, 1 failed"/>`
5. activity-announce-once MUST Pass announce={false} on every Activity inside a Conversation. Because Conversation makes one announcement per turn end, and each Activity with its own region reads the same turn again.
   - Correct: `<Conversation><Activity label="Searching docs" active announce={false}/></Conversation>`
   - Wrong: `<Conversation><Activity label="Searching docs" active/></Conversation>`
6. activity-no-timing-props SHOULD Leave delay, minLoader, minDisplay and settle at their defaults. Because they are tuned so a reply under 150ms never flashes a loader and a phrase stays long enough to read.
   - Correct: `<Activity waiting/>`
   - Wrong: `<Activity waiting delay={0} minDisplay={100}/>`
7. activity-group-closed SHOULD Close an ActivityGroup for a finished turn and open it only while the person is reading the rows. Because the summary line already says what happened, and a thread of open groups becomes a list of every call.
   - Correct: `<ActivityGroup summary="Worked for 14s" meta="14s">{rows}</ActivityGroup>`
8. activity-no-spinner-art NEVER Add a spinner, dots or an animated phrase of your own beside Activity. Because the running arc is the one moving shape in the system, and a second one shows two kinds of working.
   - Correct: `<Activity active label="Searching docs"/>`
   - Wrong: `<Activity active label="Searching docs"/><Spinner/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `label` | `string` |  | The phrase for work in progress, an -ing verb and its object. The loader shows it too, default "Thinking". |
| `active` | `boolean` | `false` | Work is running now. Shows the running arc and the phrase in still text. |
| `waiting` | `boolean` | `false` | Nothing has arrived yet this turn. Shows the first-wait loader after delay. |
| `doneLabel` | `string` |  | The finished phrase or turn summary. Defaults to the past tense of the last live phrase. |
| `status` | `'ok' \| 'warn' \| 'fail' \| 'stopped'` | `'ok'` | How the work ended. warn and fail take the reserved hues and add their word; stopped is idle brand. |
| `kind` | `'agent' \| 'key' \| 'run' \| 'deploy' \| 'model'` | `'agent'` | Sets data-kind; agents own their activity. |
| `size` | `'default' \| 'sm'` | `'default'` | default is label type; sm is small body type. |
| `minDisplay, settle` | `number` | `1000, 400` | ms a live phrase stays before the next replaces it, and ms to wait after going inactive before settling. |
| `delay, minLoader` | `number` | `150, 500` | ms before the loader shows, and the least ms it stays once shown. |
| `announce` | `boolean` | `true` | Owns a polite status region for the settled phrase. Pass false inside a Conversation. |
| `labels` | `ActivityLabels` | `English words` | Thinking, Stopped and the end words, for another language. |
| `ActivityGroup summary, meta, live` | `ReactNode, ReactNode, boolean` | `required, -, false` | The one line for the rows, a duration or failed count at its end, and rows arriving (shows the arc). |
| `ActivityGroup open, defaultOpen, onOpenChange` | `boolean, boolean, (open) => void` | `-, false, -` | Controlled or uncontrolled. It starts closed. |
| `StepGlyph state` | `'running' \| 'done' \| 'fail' \| 'stopped'` | `required` | The 16px cell at the start of a step: the arc, a check, a cross or a dash. |
| `Helpers` | `pastTense, joinSummary, pickActivity` |  | "Searching docs" to "Searched docs", a comma summary with trouble counts, and the item a header follows. |
Other props pass through to the root element.

## Variants and states
- state: waiting, active, done
- status: ok, warn, fail, stopped
- size: default, sm
- states: idle, waiting, active, done, warn, fail, stopped
- when states meet, the first wins: waiting > active > done > idle

## Accessibility
- [ ] One polite status region reads the loader label and the settled phrase; live phrases are never read, so a burst of tools does not talk over the person.
- [ ] aria-busy is set while it is waiting or active.
- [ ] Done is words: warn and fail add their word ("failed", "with a warning") and a status mark, so grayscale and screen readers get it too.
- [ ] The step glyph is aria-hidden; the row says its state in words.
- [ ] ActivityGroup is a disclosure button with a 32px row (44px on touch) and a 2px brand focus ring.
- [ ] Under reduced motion the arc stops and stays a static 3/4 arc.

## Keyboard
- `Enter, Space on an ActivityGroup`: Opens or closes the rows.

## Edge cases
- Reply in under 150ms -> The loader never shows.
- Loader shown, reply lands -> It stays at least 500ms, then gives way, so it never flashes for one frame.
- Phrases arrive faster than one a second -> Each holds for 1000ms and only the newest waiting one shows next; the rest are skipped.
- Tool ends and the next starts -> It waits 400ms before settling, so the two read as one live phrase.
- Phrase is not an -ing verb -> pastTense returns it unchanged, so write the phrase with an -ing verb.
- Summary already says "stopped" -> The end word is not repeated.
- No label and no doneLabel -> Renders nothing visible, and no region text.
- Long phrase -> Truncates with an ellipsis in one line.
- Right to left -> The arc and text mirror; the group chevron flips.
- Zoom 200% -> The row grows with the text and the phrase truncates.

## Tokens
--row-sm, --control-sm, --text-1, --text-2, --text-3, --warn-text, --fail-text, --surface-hover, --surface-pressed, --radius-soft, --type-label, --type-body-sm, --dur-fast, --ease-step

## Related
- [Tool call](/components/tool-call.md): One call with its name, arguments, status, duration and output.
- [Reasoning](/components/reasoning.md): The model's thinking, open while it streams and folded when done.
- [Status](/components/status.md): Idle, queued, running, waiting, ok, warn and fail, as a mark or a word.
- [Conversation](/components/conversation.md): Keeps a streaming thread pinned to the bottom until the person scrolls.
