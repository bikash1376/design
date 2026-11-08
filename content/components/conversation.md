---
name: Conversation
system: iota
source: quartz
kind: component
import: "import {Conversation, ConversationProvider, ConversationViewport, ConversationContent, ConversationItem, ConversationTail, ConversationJump, ConversationTimeline, ConversationRetry, ConversationError, useConversation, useStickToBottom, useStableRows, useCountdown, STICK, REATTACH} from '@/components/iota/ai/conversation'"
install: "npx shadcn@latest add {{SITE}}/r/conversation.json"
registryDependencies: [button, icon, message, status, theme, tool-call, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/conversation
---

# Conversation

Keeps a chat thread on its newest line until someone scrolls back.

## Use when
- A chat or run transcript grows while the person reads it.
- Any thread where new content arrives at the bottom.

## Don't use when
- A static list of items. Use [Table](/components/table.md).

## Minimal example
```tsx
<ConversationProvider status={status}>
  <Conversation>
    <ConversationViewport><ConversationContent><ConversationTimeline rows={rows}/></ConversationContent></ConversationViewport>
    <ConversationJump/>
  </Conversation>
</ConversationProvider>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. conversation-snap-on-send MUST Call snap() from useConversation() when the person sends. Because a detached view does not follow new rows, so the person's own message lands off screen.
   - Correct: `<Composer onSend={() => { send(); snap(); }}/>`
   - Wrong: `<Composer onSend={send}/>`
2. conversation-no-scroll-detach MUST Move the view in code with scrollToEnd(); never set scrollTop. Because a scroll without a gesture never re-attaches, so the view reaches the end and then stops following the stream.
   - Correct: `scrollToEnd()`
   - Wrong: `viewport.scrollTop = viewport.scrollHeight`
3. conversation-no-scroll-into-view NEVER Call scrollIntoView on new content; leave following to the component. Because it pulls a reader who scrolled up back to the end on every token, which the gesture-only detach exists to stop.
   - Correct: `<ConversationTimeline rows={rows}/>`
   - Wrong: `useEffect(() => end.current?.scrollIntoView(), [messages])`
4. conversation-typed-rows MUST Push a typed row (divider, retry, error) for an abort, compaction or retry; never write it into the answer text. Because text added to the answer is copied and read as the model's words, and no divider or retry row renders.
   - Correct: `rows.push({type: 'divider', reason: 'interrupted'})`
   - Wrong: `answer += ' [stopped]'`
5. conversation-error-words MUST Pass the error kind and let the row title it. Because kind picks a title such as "Out of credits for this workspace" and hides Retry for gone; a generic message tells the operator nothing.
   - Correct: `{type: "error", kind: "quota", message: "This workspace used 100% of its credits."}`
   - Wrong: `{type: "error", message: "Something went wrong"}`
6. conversation-thinking-row MUST Push a thinking row the moment the person sends; it shows the agent turn. Because the agent turn appearing at once is the answer to "did it hear me", before any token.
   - Correct: `rows.push({type: 'thinking', id, author: 'support-agent'})`
   - Wrong: `<ConversationTail>{waiting && <Spinner/>}</ConversationTail>`
7. conversation-tail MUST Put only the end-of-turn actions in ConversationTail in a thread; the running tool row carries the live state. Because the tail reserves one control height, so the swap shifts nothing, and a live phrase in the tail repeats the running row (activity-one-live).
   - Correct: `<ConversationTail>{done && <Actions/>}</ConversationTail>`
   - Wrong: `<ConversationTail>{streaming ? <Activity active label={call.label}/> : <Actions/>}</ConversationTail>`
8. conversation-one-announcement MUST Pass status to ConversationProvider, the one place, and let the viewport announce a turn end; no per-row live regions. Because a live region per row reads every streamed token aloud, and a Conversation inside a provider reads status from the provider, not its own prop.
   - Correct: `<ConversationProvider status={status}>`
   - Wrong: `<div aria-live="polite">{answer}</div>`
9. conversation-quiet-activity MUST Pass announce={false} on an Activity inside the thread. Because Activity announces by default, so a screen reader hears it on top of the viewport's one turn-end announcement.
   - Correct: `<Activity announce={false} active label="Thinking"/>`
   - Wrong: `<Activity active label="Thinking"/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `ConversationProvider status` | `'idle' \| 'streaming' \| 'stopped' \| 'error'` | `'idle'` | Wraps Conversation and the composer, so the composer can snap(). Conversation takes status itself only with no provider. |
| `ConversationViewport aria-label` | `string` | `'Conversation'` | role="log". |
| `ConversationTimeline rows, renderRow, onRetry` | `ConversationRow[]` |  | Typed rows with stable ids; renderRow returns a node for a row, or undefined for the default. |
| `ConversationRow` | `{type: 'user', text, meta?, name?, avatar?} \| {type: 'assistant', content} \| {type: 'thinking', label?, author?} \| {type: 'retry', attempt, next, message?} \| {type: 'diff', files, additions, deletions} \| {type: 'error', kind, message?} \| {type: 'divider', reason: 'compaction' \| 'interrupted', label?}` |  | Each with an id. A user row draws its own Message; an assistant row draws content as given, so wrap it in `<AgentTurn name="support-agent">`. |
| `ConversationItem rowKey, pinned` | `string, boolean` |  | Wraps your own Message when you render rows yourself instead of through ConversationTimeline. |
| `ConversationTail` | `div props` |  | Reserves one control height for the first wait, then the actions. |
| `ConversationJump waiting, labels` | `boolean, {latest?, waitingOnYou?}` | `true` | Latest past max(400px, the viewport height) from the end; "Waiting on you" with an brand count while a waiting call is out of view. |
| `useConversation()` | `hook` |  | attached, distance, atEnd, scrollToEnd, snap, detach, status. |
| `labels` | `ConversationLabels` | `English words` | On ConversationTimeline, ConversationRetry and ConversationError: the row words, for another language, including `agent`, the name a thinking row shows when it has no `author`. The viewport takes its turn-end words. |
Other props pass through to the root element.

## Variants and states
- row: retry, error, stopped, compacted
- states: attached, detached, far from the end, selecting, streaming, ended

## Accessibility
- [ ] The viewport is role="log" named "Conversation" with aria-live off and aria-busy while streaming.
- [ ] One status region announces "Response complete", "Stopped" or "Response failed".
- [ ] Arrow Up, Page Up and Home scroll and detach; End re-attaches even while content grows.
- [ ] The jump is a button, inert while near the end and nothing waits, so it leaves the tab order and the tree.
- [ ] Enter on Latest scrolls to the end; on "Waiting on you" it scrolls to the waiting call and focuses its first action.
- [ ] The jump reaches the waiting call by keyboard.

## Edge cases
- 3,000-word answer -> Offscreen rows skip layout; the last user row and the last row stay laid out.
- One short turn -> Sits at the bottom of the viewport beside the composer.
- No rows -> Renders empty; render an Empty state above the composer.
- 500 rows, prepend 2 turns -> The row under the reader keeps its place.
- Retry row -> Counts down, never negative; reads "Retrying now" at 0.
- Error after a partial answer -> The partial answer stays; a run-gone error has no retry.
- Abort -> A divider, never an error.
- Wheel up while streaming -> Stays detached, even within 5px of the end.
- Wheel inside a reasoning pane or code block -> Scrolls the pane; detaches the thread only at the pane top.
- Touch drag down -> Detaches; momentum does not re-attach until the end.
- Reduced motion -> Jumps scroll at once; the button cuts in and out.
- Waiting call off screen -> The jump reads "Waiting on you" with the count and goes there.

## Tokens
--line-focus, --scrollbar-thumb, --row, --row-sm, --line-row, --line-frame, --elev-overlay, --dur-base, --fail-wash, --surface-inverse

## Related
- [Message](/components/message.md): One turn from the person or the agent, plus dividers.
- [Response](/components/response.md): Markdown that renders as it streams.
