---
name: Prompt input
system: iota
source: quartz
kind: component
import: "import {PromptInput, PromptInputModel, PromptAttachment, PromptQueue, PromptInputMic, serializePrompt, acceptsFile} from '@/components/iota/ai/prompt-input'"
install: "npx shadcn@latest add {{SITE}}/r/prompt-input.json"
registryDependencies: [attachment, badge, button, css-var, empty-state, field, format, icon, overlay, portal, status, theme, tooltip, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/prompt-input
---

# Prompt input

Writes the next message to an agent, then sends, queues or stops it.

## Use when
- The person writes the next turn for an agent and may reference tickets, runs or commands.
- The agent works for a while and the person may queue a follow-up or stop it.

## Don't use when
- A plain multi-line form field. Use [Textarea](/components/textarea.md).
- A single-line value. Use [Input](/components/input.md).

## Minimal example
```tsx
<PromptInput draftKey={`chat:${chat.id}`} status={status} generation={run.id} onStop={stop} onSubmit={submit} mentions={mentions}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. prompt-input-chips-atomic MUST Insert a file, run, prompt release or command as a chip through the @ or / menu or a [label](type:id) token via insert(). Because plain "@run 4812" stays text, so Backspace eats it a letter at a time and the serialized value carries no run id.
   - Correct: `ref.current.insert('[run 4812](run:run_4812)')`
   - Wrong: `ref.current.insert('@run 4812')`
2. prompt-input-stop-before-byte MUST Pass status="submitted" while a send is in flight with no byte back; it is already Stop. Because a disabled composer leaves a slow or stuck request with no way to cancel it.
   - Correct: `<PromptInput status={firstByte ? 'streaming' : 'submitted'} onStop={stop}/>`
   - Wrong: `<PromptInput status={sending ? 'ready' : status} disabled={sending}/>`
3. prompt-input-generation MUST Pass a new generation (the run id) for each run, and settle only the run onStop names. Because without it a stop that lands after the next run began settles the new run.
   - Correct: `<PromptInput onStop={abort} generation={run.id}/>`
   - Wrong: `<PromptInput onStop={abort}/>`
4. prompt-input-queue-while-busy MUST Append to PromptQueue in FIFO order when the person sends while the agent works; never interrupt the run. Because stopping to send throws away the work the agent has done this turn.
   - Correct: `onSubmit={v => (busy || queue.length ? enqueue(v) : send(v))}`
   - Wrong: `onSubmit={v => {stop(); send(v);}}`
5. prompt-input-failed-head MUST Keep a failed queued message at the head with status="failed" and its error, and stop draining. Because dropping the head loses the message without a word and sends the rest out of order.
   - Correct: `setQueue(q => q.map(m => m.id === id ? {...m, status: 'failed', error} : m))`
   - Wrong: `setQueue(q => q.slice(1))`
6. prompt-input-queue-joined MUST Render PromptQueue directly above PromptInput with no gap; they share one line. Because a gap or a wrapper between them breaks the shared line and the queue reads as a second, unrelated box.
   - Correct: `<div className="flex flex-col"><PromptQueue items={q}/><PromptInput/></div>`
   - Wrong: `<div className="gap-2"><PromptQueue items={q}/><PromptInput/></div>`
7. prompt-input-disabled-reason MUST Pass disabledReason with what happened and when it changes, plus one action, instead of disabled alone. Because disabled alone leaves a dead box with no word on why or when it returns; the reason becomes its description.
   - Correct: `<PromptInput disabled disabledReason="Out of credits until Oct 1." disabledAction={<PlansButton/>}/>`
   - Wrong: `<PromptInput disabled/>`
8. prompt-input-label MUST Pass label (default "Prompt"); never rely on the placeholder for the name. Because the editor is a contenteditable textbox named only by label, and aria-placeholder is not a name.
   - Correct: `<PromptInput label="Message support-agent"/>`
9. prompt-input-inline-default MUST Keep the default inline layout for chat; use layout="stacked" only where the person writes a long brief. Because a two-line box with a toolbar under it spends 40px of the thread on a prompt that is one line most turns.
   - Correct: `<PromptInput placeholder="Ask support-agent"/>`
   - Wrong: `<PromptInput layout="stacked" placeholder="Ask support-agent"/>`
10. prompt-input-ime MUST Return early on isComposing or keyCode 229 before reading Enter, Tab, arrows or Backspace. Because the Enter that confirms a Japanese or Chinese candidate would send a half-written prompt.
   - Correct: `if (e.nativeEvent.isComposing || e.keyCode === 229) return`
   - Wrong: `if (e.key === 'Enter') send()`
11. prompt-input-no-textarea-chips NEVER Paint chips over a textarea with a mirror overlay. Use PromptInput. Because the overlay drifts from the text on wrap and scroll, and Backspace deletes one letter of a chip.
   - Correct: `<PromptInput mentions={resources}/>`
   - Wrong: `<textarea/> + <div aria-hidden>{chips}</div>`
12. prompt-input-no-disabled-while-sending NEVER Disable the composer to block double sends. The editor clears on send and the generation key guards repeats. Because disabled removes the editor from the tab order, so the person cannot write a follow-up or press Escape to stop.
   - Correct: `<PromptInput status={busy ? 'streaming' : 'ready'}/>`
   - Wrong: `<PromptInput disabled={busy}/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `onSubmit` | `(value: PromptValue, attachments: Attachment[]) => void` |  | Text, serialized [label](type:id), mentions, mode; finished attachments only. |
| `onValueChange` | `(value: PromptValue) => void` |  | Every edit, chips included. |
| `defaultValue` | `string` |  | Tokens become chips; a saved draft wins over it. |
| `draftKey` | `string` |  | Saves the draft 200ms after the last edit; cleared on send. Pass one per conversation. |
| `placeholder` | `string` | `'Ask the agent to do something'` | A verb under 40 characters, "Queue a follow-up" while the agent works; never the name. |
| `waitingCount, onReviewWaiting` | `number, () => void` | `0` | Calls waiting on the person: the status line says "1 call waiting on you" in brand, with Review. |
| `layout` | `'inline' \| 'stacked'` | `'inline'` | inline is one 44px row (attach, text, model chip, Send) that grows to 8 lines; stacked puts the text over a toolbar row, for long briefs. |
| `label` | `string` | `'Prompt'` | Names the editor. |
| `status` | `'ready' \| 'submitted' \| 'streaming' \| 'stopping' \| 'error'` | `'ready'` | submitted and streaming turn Send into Stop. |
| `onStop, generation` | `(generation) => void, string \| number` |  | onStop fires once per generation, from Stop or Escape; a new generation re-arms Stop. |
| `disabled, disabledReason, disabledAction` | `boolean, ReactNode, ReactNode` | `false` | No input at all, why it is off and when it returns, then one action. |
| `mentions, commands` | `MentionItem[], CommandItem[]` | `[]` | What @ and / offer. |
| `shell, mode, onModeChange` | `boolean, 'normal' \| 'shell', (mode) => void` | `false` | shell turns on the ! trigger; mode controls shell mode and onModeChange fires on ! and on leaving it. |
| `attachments, onAttach, onRemoveAttachment, onRetryAttachment, accept` | `Attachment[], (files: File[]) => void, (id) => void, (id) => void, string` | `[]` | Files with upload status; onAttach gets files already checked against accept ("image/*,.log") on pick, paste and drop, and leaving it out hides the paperclip. |
| `maxLength` | `number` | `100000` | Characters; a longer paste is refused with a reason. |
| `tools, meta, voice` | `ReactNode, ReactNode, Omit<PromptInputMicProps, 'size'>` |  | The model picker (PromptInputModel, a quiet chip), the slot before Send (context meter) and the mic. |
| `onEditQueued, onSendQueuedNow` | `() => boolean, () => void` |  | On an empty prompt, Up edits the last queued message (false when none) and Enter while busy sends the head now. |
| `PromptQueue items` | `{id, text, status?: 'queued' \| 'sending' \| 'failed', error?}[]` | `required` | The follow-ups, in send order, rendered just above PromptInput; sending while dispatched, failed with its error holds the rest. |
| `PromptQueue onSendNow, onRetry, onEdit, onRemove, onMove` | `(id) => void, (id) => void, (id, text) => void, (id) => void, (id, index) => void` |  | Each one shows its row button when passed; onMove also answers Alt+Up and Alt+Down. |
| `PromptQueue editingId, onEditingChange` | `string \| null, (id) => void` |  | The row being edited; set it from onEditQueued so Up on an empty prompt edits the last row. |
| `PromptQueue returnFocus, labels` | `() => void, PromptQueueLabels` |  | Where focus goes when the last row leaves, usually the composer ref's focus(); the words, for another language. |
| `labels` | `PromptInputLabels` | `English words` | Every other word it says, Send's and a file's included, for another language. |
| `SendButton status, onStop, generation, empty, blockedReason` | `SendStatus, (generation) => void, string \| number, boolean, string` | `'ready'` | The composer's one action, also usable alone. submitted, streaming and stopping show Stop; error shows Send again. empty disables Send; blockedReason keeps it focusable and becomes its description. |
| `Mention type, children, missing, onRemove` | `MentionType, ReactNode, boolean, () => void` | `required, required` | A resource named in an answer. A kind takes its line hue; file, folder, doc, table, web, command and paste the control line. missing strikes it through; onRemove adds a remove button. mentionToText and parseMentions write and read [label](type:id). |
| `ref` | `Ref<PromptInputHandle>` |  | focus, clear, insert, getValue. |
Other props pass through to the root element.

## Variants and states
- mode: normal, shell
- status: ready, submitted, streaming, stopping, error
- states: ready, focused, submitted, streaming, error, disabled, menu-open, drag-over, uploading, queued, queue-failed

## Accessibility
- [ ] The editor is a contenteditable textbox, aria-multiline, named by label; it points at the open list with aria-activedescendant; chips are contenteditable=false.
- [ ] Enter sends (holds while files upload), Shift+Enter breaks the line.
- [ ] @ after a space opens resources, / as the whole input opens commands, ! opens shell; arrows or Ctrl+P and Ctrl+N move, Enter or Tab picks.
- [ ] Escape closes the menu, then leaves shell, then cancels a held send, then stops the run.
- [ ] Backspace next to a chip removes it whole; Mod+Z restores it; arrows hop over it (mirrored in RTL).
- [ ] Up in an empty editor edits the last queued message; Alt+Up and Alt+Down move a queue row.
- [ ] Toolbar buttons are 28px with aria-labels; the editor is 16px so iOS does not zoom.
- [ ] PromptInput sends on its own and passes type="button" to its Send, so a surrounding form never submits; a bare SendButton is type="submit" while ready.

## Edge cases
- Long text and URLs -> Wraps; the editor grows to 8 lines (10 stacked) then scrolls, and the buttons stay on the bottom line.
- Chips with an attachment, narrow -> A long chip truncates; the attachment keeps its name.
- Right to left -> Layout mirrors; the chip hop reads the editor direction.
- Enter during upload -> The send is held and fires when the last upload finishes, with Cancel; a failed file blocks it.
- Inside a dialog, @ then Escape twice -> The first closes the menu, the second closes the dialog.
- Paste of 3 lines or 150 characters -> Collapses into a "Pasted n lines" chip and is sent in full; Mod+Z collapses it again.
- Paste past maxLength -> Refused; the status line says how much fits.
- Narrow -> A toolbar under 320px drops the tools to their own row, and under 384px the status line takes a row of its own; inline stays one row.
- Send fails -> status="error" shows Send again; the caller keeps the text.
- Drag of a type accept refuses -> The overlay takes the fail wash and says what it takes, top-left, before the drop.

## Tokens
--line-control, --line-frame, --line-row, --surface-card, --code-prompt, --border-focus, --type-body, --type-code, --focus-halo, --elev-control, --text-1, --text-3, --fail-wash, --fail-text, --elev-overlay, --surface-hover, --control-sm, --type-label-sm, --type-tag, --text-2, --dur-fast, --dur-base, --ease-step, --attachment-max, --popup-max

## Related
- [Attachment](/components/attachment.md): A file in a form, prompt or message, with drop zone and image tile.
- [Message](/components/message.md): One turn from the person or the agent, plus dividers.
