---
name: Reasoning
system: iota
source: quartz
kind: component
import: "import {Reasoning, ReasoningTrigger, ReasoningContent, reasoningHeading} from '@/components/iota/ai/reasoning'"
install: "npx shadcn@latest add {{SITE}}/r/reasoning.json"
registryDependencies: [activity, conversation, kind, response, scroll-focus, status, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/reasoning
---

# Reasoning

Shows the model's reasoning as it thinks, then folds it away.

## Use when
- The model streams reasoning before or between answer parts.
- The person may want to read how the answer was reached, but not by default.

## Don't use when
- The answer itself. Use [Response](/components/response.md).
- Any other fold-away section. Use [Collapsible](/components/collapsible.md).

## Minimal example
```tsx
<Reasoning streaming={streaming} duration={seconds}>{parts}</Reasoning>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. reasoning-parts MUST Pass summary parts as an array of children, not a joined string. Because the label takes the first heading of the newest part, so a joined string keeps the first heading for the whole stream.
   - Correct: `<Reasoning>{parts}</Reasoning>`
   - Wrong: `<Reasoning>{parts.join('')}</Reasoning>`
2. reasoning-uncontrolled MUST Leave open unset and pass streaming; the block opens while it streams and folds at the end. Because a controlled open turns off the fold and the pin, so a block the person opened snaps shut when the stream ends.
   - Correct: `<Reasoning streaming={streaming}/>`
   - Wrong: `<Reasoning open={streaming}/>`
3. reasoning-active-turn MUST Show a live Reasoning only on the active turn. Because every streaming block opens and reads "Thinking", so finished turns look busy and push their answers down.
   - Correct: `streaming={turn.id === activeTurn}`
   - Wrong: `every turn streaming`
4. reasoning-duration SHOULD Pass duration in seconds when the stream ends so it reads "Thought for 12s".
   - Correct: `<Reasoning duration={12}>{t}</Reasoning>`
   - Wrong: `<Reasoning>{t}</Reasoning>`
5. reasoning-busy NEVER Put reasoning in a live region. The body carries aria-busy and the label stays the button name. Because a live region reads every paced slice aloud and cuts off the answer that follows.
   - Correct: `<Reasoning streaming>{reasoning}</Reasoning>`
   - Wrong: `<div aria-live="polite">{reasoning}</div>`
6. reasoning-not-answer NEVER Render reasoning as a Response above the answer. Keep it in text-2 at body-sm in its row's panel. Because brand at answer size reads as the answer, so the person acts on a draft the model later dropped.
   - Correct: `<Reasoning>{reasoning}</Reasoning>`
   - Wrong: `<Response>{reasoning}</Response> // above the answer`
7. reasoning-height SHOULD Keep the body at 160px and let it scroll; do not set max-h-none.
   - Correct: `<Reasoning>{parts}</Reasoning>`
   - Wrong: `<ReasoningContent className="max-h-none"/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `children` | `string \| string[] \| parts` |  | Strings render the default trigger and body. |
| `streaming` | `boolean` | `false` | Opens and follows the text; ending folds it unless pinned. |
| `duration` | `number` |  | Seconds, not ms like ToolCall: 12 reads "Thought for 12s". |
| `heading` | `string` | `from the text` | Overrides the heading taken from the text. |
| `open, defaultOpen, onOpenChange` | `Collapsible` |  | Controlled turns off the automatic behaviour. |
| `labels` | `{thinking?, stoppedEarly?, thoughtFor?, moment?}` | `English words` | The trigger's words, for another language. |
Other props pass through to the root element.

## Variants and states
- streaming: true, false
- states: streaming, folded, open, pinned-open, stopped

## Accessibility
- [ ] Enter or Space on the trigger opens or folds the body; opening pins it.
- [ ] The body carries aria-busy while streaming; the label stays the button name.
- [ ] Tab focuses an overflowing body so arrows scroll it; Up releases the follow.
- [ ] The trigger is a 32px row across the turn, the same line as a folded group of tool calls; a touch scroll up in the body stops the follow.
- [ ] Reduced motion stops the running arc; open and fold are cuts already.

## Edge cases
- Long heading -> Truncates in the row; long text scrolls inside 160px with a thin scrollbar, no fade.
- Right to left -> The chevron stays in the leading cell, at the start edge, and mirrors.
- One word -> Opens a one-line body.
- Empty streaming text -> Shows "Thinking" with an empty body; a stream stopped before text folds to "Stopped".
- Long pause -> Stays open with the last heading.
- Turn fails -> Streaming ends and the block folds; the error belongs to Conversation.
- Ten presses on the trigger while streaming -> It ends in the last state the person chose.
- Inside a Message above a Response -> The nested scroller lets the thread detach only at overscroll.
- 120px wide -> The trigger truncates its label and the body wraps.

## Tokens
--type-label, --type-body-sm, --text-2, --surface-hover, --row-sm, --dur-fast, --ease-step

## Related
- [Response](/components/response.md): Markdown that renders as it streams.
- [Collapsible](/components/collapsible.md): Shows and hides one region, or a group of them.
- [Conversation](/components/conversation.md): Keeps a streaming thread pinned to the bottom until the person scrolls.
