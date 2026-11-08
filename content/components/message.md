---
name: Message
system: iota
source: quartz
kind: component
import: "import {MessageGroup, Message, AgentTurn, MessageAvatar, MessageAgentAvatar, MessageContent, MessageHeader, MessageMeta, MessageTime, MessageModel, MessageStatus, MessageFooter, MessageWorked, MessageBubble, MessageBubbleContent, MessageReactions, MessageSendState, MessageDivider, MessageDividerIcon, messageVariants, bubbleVariants, dividerVariants} from '@/components/iota/ai/message'"
install: "npx shadcn@latest add {{SITE}}/r/message.json"
registryDependencies: [avatar, badge, button, icon, kind, status, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/message
---

# Message

Shows one turn of a conversation: an agent turn as flow with no drawn header, a person turn as a bubble at the end of the row.

## Look
Every turn sits on `--message-bg` (#f2f2f2) at the frame radius: the person's bubble on the right, the agent's response on the left. Reasoning, tool calls and the footer stay on the page, so the answer is what stands out.

## Use when
- A thread shows turns from a person and an agent in order.
- The thread needs a marked change: a stop, a compaction, a handoff or a new day.

## Don't use when
- A transient notice about the page, not a turn. Use [Alert](/components/alert.md).
- The scrolling container of the whole thread. Use [Conversation](/components/conversation.md).
- The agent's answer body with Markdown. Use [Response](/components/response.md).

## Minimal example
```tsx
<AgentTurn name="support-agent" time="14:02">
  <ToolCallList calls={calls}/>
  <Response>{answer}</Response>
  <MessageFooter><MessageWorked duration="14s" time="14:02"/>{copy}<MessageModel model="model-s"/></MessageFooter>
</AgentTurn>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. message-agent-status MUST Give every agent turn a MessageHeader that carries one MessageStatus. Because the footer hides while the turn is live and the header ends in Failed or Stopped, all read from that one status.
   - Correct: `<MessageHeader>support-agent<MessageStatus state="live"/></MessageHeader>`
   - Wrong: `<MessageHeader>support-agent<Status status="running"/></MessageHeader>`
2. message-person-bubble MUST Set a person's turn as a `--message-bg` bubble at the end of the row; no avatar and no drawn name. Because the bubble at the end against the full-width flow of the agent is what tells the two speakers apart, in grayscale too.
   - Correct:
     ```tsx
     <Message from="user"><MessageContent><MessageHeader>Ana</MessageHeader><MessageBubble><MessageBubbleContent>{text}</MessageBubbleContent></MessageBubble></MessageContent></Message>
     ```
   - Wrong: `<Message from="user"><MessageAvatar><Avatar name="Ana Marsh"/></MessageAvatar>…</Message>`
3. message-speaker-named MUST Name the speaker in MessageHeader text on both turns; a person's header is read aloud and not drawn. Because the bubble has no avatar or name beside it, so a screen reader hears the turn with no speaker.
   - Correct: `<MessageHeader>Ana<MessageTime>14:02</MessageTime></MessageHeader>`
   - Wrong: `<MessageContent><MessageBubble>…</MessageBubble></MessageContent>`
4. message-abort-divider MUST End a stopped turn with MessageStatus state="stopped" and a MessageDivider reason="interrupted", and keep the partial answer. Because a red Alert reads the person's own Stop as a failure, and dropping the partial answer loses work they may need.
   - Correct: `<MessageDivider reason="interrupted"/>`
   - Wrong: `<Alert status="fail">Response aborted</Alert>`
5. message-keep-unsent MUST Keep a failed message in its row with MessageSendState state="failed" and onRetry. Because a toast fades in seconds and the person has to retype what they wrote.
   - Correct: `<MessageSendState state="failed" onRetry={retry}/>`
   - Wrong: `toast.error('Send failed'); removeMessage(id)`
6. message-answered-by MUST Pass both models when the answering model differs from the picked one. Because an operator reads a fallback model's answer as the picked model's and misjudges its quality.
   - Correct: `<MessageModel model="model-s" requested="model-l"/>`
   - Wrong: `<MessageMeta>model-l</MessageMeta>`
7. message-agent-response-only MUST Put the background on the agent's Response, not the whole turn; Reasoning, tool calls and the footer stay on the page. Because the answer is what a person came for, so it is the one thing that gets a surface.
8. message-no-header-word NEVER Put a Working or Paused word, a badge or the model in the agent header. The running tool row is the live state; the model goes in the footer. Because a word in the header and the arc in a row say the same thing twice, and the header word goes stale the moment the turn waits on an approval.
   - Correct: `<MessageHeader>support-agent<MessageStatus state="live"/></MessageHeader>`
   - Wrong: `<MessageHeader>support-agent<Badge kind="agent"/><Status status="running">Working</Status></MessageHeader>`
9. message-divider-words SHOULD Use the reason's default words, or 2 to 5 words in sentence case: "Handed to Ana", "Back to support-agent".
   - Correct: `<MessageDivider reason="handoff">Handed to Ana</MessageDivider>`
   - Wrong: `<MessageDivider>The conversation context window has been compacted.</MessageDivider>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Message from, kind, size` | `'agent' \| 'user'` |  | Agent is flow with its Response on `--message-bg`; user is a bubble at the end of the row. |
| `AgentTurn name, time, state` | `string, ReactNode, MessageStatus state` | `state 'done'` | A whole agent turn: the children, with the name, state and time read aloud and drawn only for a failed or stopped turn. Takes Message props except from. |
| `MessageStatus state, label` | `'live' \| 'waiting' \| 'fail' \| 'stopped' \| 'done'` |  | Sits in the agent header. Live and waiting hide the footer and read aloud; fail shows a red Failed and stopped a quiet Stopped at the end of the line. |
| `MessageTime` | `time` |  | The end column every turn shares. |
| `MessageBubble variant, kind` | `default, outline, inverse, ghost, destructive, tinted` | `'default'` | The default bubble is `--message-bg` at the frame radius; outline, inverse, ghost and destructive are for other uses. tinted is a deprecated alias of outline. |
| `MessageBubble status` | `'fail'` |  | The row takes the fail wash. Replaces variant destructive. |
| `MessageBubbleContent render` | `ReactElement` |  | Renders a button or link. |
| `MessageWorked duration, time, labels` | `string, ReactNode` |  | The footer's first words in text-3: "Worked for 14s, 14:02". Pass duration formatted (formatDuration from the tool-call item); with only a time it reads the time. The copy and retry buttons after it show on hover where there is a pointer, and always on touch. |
| `MessageModel model, requested` | `string` |  | Quiet mono text for the footer; it adds "for requested" when they differ. |
| `MessageSendState state, onRetry` | `'sending' \| 'sent' \| 'failed'` |  | Failed washes the row. Nothing when sent. |
| `MessageDivider reason, kind, render` | `'interrupted' \| 'compaction' \| 'handoff' \| 'day'` |  | handoff with no kind is a rule with the InkSlot label in its centre: a handoff to a person. |
| `labels` | `per part` | `English words` | MessageStatus, MessageSendState and MessageDivider take their words. MessageModel takes forModel. |
Other props pass through to the root element.

## Variants and states
- from: agent, user
- state: live, waiting, fail, stopped, done
- reason: interrupted, compaction, handoff, day
- states: rest, hover, live, waiting, fail, stopped, done, sending, failed

## Accessibility
- [ ] Tab moves to footer actions, bubble buttons and links; turns are not stops.
- [ ] Enter on Retry in the failed state resends and the button leaves, so repeats cannot double-send.
- [ ] The turn state and the send state read as words; the wash is never the only iota.
- [ ] MessageHeader names the speaker aloud on both turns; an agent's is drawn only when the turn failed or stopped.

## Edge cases
- Long message and hash -> Wraps at the reading measure; a 40-character hash breaks anywhere.
- Narrow screen -> Both turns keep a 16px inset; a bubble grows to 85% of the row, and a failed or stopped header keeps one line.
- Right to left -> The agent flow starts from the right and the bubble moves to the left; the time column stays at the end.
- Empty turn -> Nothing is drawn; the name is read aloud, and the thread's thinking row shows the first wait.
- Slow send -> The row stays and says Sending, with no spinner on the text.
- Failed send -> Keeps the text, washes the row and offers Retry in place.
- Reduced motion -> The row arc holds still; the row says Running.
- Zoom 200% -> Sections grow with the text; a drawn header keeps 24px as a minimum.

## Tokens
--message-bg, --line-frame, --line-row, --line-control, --fail-text, --fail-wash, --surface-inverse, --text-inverse, --type-label, --type-tag, --type-body-sm, --text-3, --time-column

## Related
- [Conversation](/components/conversation.md): Keeps a streaming thread pinned to the bottom until the person scrolls.
- [Response](/components/response.md): Markdown that renders as it streams.
- [Tool call](/components/tool-call.md): One call with its name, arguments, status, duration and output.
