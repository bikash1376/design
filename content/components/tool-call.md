---
name: Tool call
system: iota
source: quartz
kind: component
import: "import {splitForce, ToolCall, ToolCallGroup, ToolCallList, CappedOutput, DiffCount, toolCallsReducer, useToolCalls, groupToolCalls, registerTool, resolveTool, summarizeToolCalls, toolActivity, toolLabel, formatDuration, cleanOutput, isTerminal} from '@/components/iota/ai/tool-call'
import {RequestTicker, RequestSummary, ShowMoreRow, summarizeRequests, codeClass} from '@/components/iota/ai/request-ticker'"
install: "npx shadcn@latest add {{SITE}}/r/tool-call.json"
registryDependencies: [activity, badge, button, format, panel, status, theme, use-focus-when-replaced, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/tool-call
---

# Tool call

Shows one tool call an agent made as a step of a checklist that opens onto what came back.

## Use when
- An agent calls a tool and the person should see what it asked for and what came back.
- A turn lists the calls of a step, in order, with how each ended.
- A call needs the person: it is paused for permission or was refused.

## Don't use when
- The output is a long shell session the person may type into. Use [Code block](/components/code-block.md).

## Minimal example
```tsx
const [state, dispatch] = useToolCalls();
dispatch({type: 'result', seq: 40, id, status: 'completed', output});
<ToolCallList calls={state.calls}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. tool-call-seq MUST Give every event a per-call seq and dispatch all of them through toolCallsReducer. Because a plain setState applies a duplicate or late running event over completed, so a finished call spins again.
   - Correct: `dispatch({type: 'result', seq: e.seq, id: e.id, status: 'completed', output})`
   - Wrong: `setCalls(cs => cs.map(c => c.id === e.id ? {...c, status: e.status} : c))`
2. tool-call-explicit-status MUST Send status: 'completed' or 'error' explicitly when a tool ends. Because the reducer reads a result with no status as an error, so a call that worked shows Failed.
   - Correct: `dispatch({type: 'result', seq, id, status: 'completed', output})`
   - Wrong: `dispatch({type: 'result', seq, id, output})`
3. tool-call-stop MUST Dispatch {type: 'stop', gen} before the network cancel returns, and open the next turn with a newer gen. Because events that arrive while the cancel is awaited keep rows running, and reusing the stopped gen drops the next turn.
   - Correct: `dispatch({type: 'stop', gen}); api.cancel(run)`
   - Wrong: `await api.cancel(run); setStopped(true)`
4. tool-call-show-trouble MUST Hide finished calls with ToolCallList hideCompleted, not a filter of your own. Because a hand filter for running drops failed and awaiting-permission rows, so the run stalls on an approval no one sees.
   - Correct: `<ToolCallList calls={calls} hideCompleted/>`
   - Wrong: `calls.filter(c => c.status === 'running')`
5. tool-call-register SHOULD Call registerTool(name, renderer, aliases) once at module scope for a product tool; never pass label per call site.
   - Correct: `registerTool('refund', {active: 'Refunding', done: 'Refunded', ask: 'Refund', summary})`
   - Wrong: `<ToolCall call={c} label="Refunding"/>`
6. tool-call-verbs SHOULD Write active as an -ing verb, done in past tense and ask in the imperative, one or two words, with the object in detail.
   - Correct: `active: 'Looking up', done: 'Looked up', ask: 'Look up', detail: input => input.orderId`
   - Wrong: `active: 'Tool is now looking up the order'`
7. tool-call-denied-not-error MUST Use status: 'denied' with the person's feedback as reason for a refused call; never status: 'error'. Because a refusal is the person's choice; as an error it opens on a failure message and counts as a failed call in the turn's line.
   - Correct: `<ToolCall call={{...c, status: 'denied', reason}}/>`
   - Wrong: `<ToolCall call={{...c, status: 'error', error: 'Denied by user'}}/>`
8. tool-call-status-words MUST Keep the state in the glyph cell and the end of the line to the duration; add a word only for Failed, Stopped and Denied. Because a status word on every row is a column of noise, and the word is what survives grayscale and forced colors when the red is gone.
   - Correct: `<ToolCall call={{...call, status: 'error'}}/>`
   - Wrong: `<span className="text-fail">3.0s</span>`
9. tool-call-approval-card MUST Pass onReply to a waiting call, and put what the call does in permission.message. Because the ask card shows the detail in full under the question and the cost, and the person decides on those; a call with no message asks the question with nothing to weigh, and with no onReply the card has no way to answer.
   - Correct: `<ToolCall call={waiting} onReply={reply => dispatch({type: 'reply', seq, id, reply})}/>`
   - Wrong: `<ToolCall call={waiting} actions={<Button>Allow</Button>}/>`
10. tool-call-no-standalone-stack NEVER Stack ToolCalls in a div. Put them in a ToolCallList. Because the list folds finished calls into one line and keeps the newest visible; a hand-made stack shows every row of a long turn.
   - Correct: `<ToolCallList calls={calls}/>`
   - Wrong: `<div>{calls.map(c => <ToolCall key={c.id} call={c}/>)}</div>`
11. tool-call-no-raw-json NEVER Dump the input JSON as the body of a tool call. Because the registry renders the command, patch or capped output, and raw JSON shows escaped quotes with no cap.
   - Correct: `<ToolCall call={call}/>`
   - Wrong: `<pre>{JSON.stringify(call.input)}</pre>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `call` | `ToolCallData` | `required` | id, tool, status, input, metadata, output, error, permission, reason, startedAt, endedAt, seq. |
| `call.tool and the input it reads` | `built-in renderers` |  | shell (bash, sh, zsh, run_command, terminal): input.command, metadata.output; edit (write, apply_patch, patch, multiedit, str_replace): input.filePath, path or file, metadata.diff or patch; read: filePath, path or file; glob: pattern; grep: pattern or query; list (ls): path; webfetch (fetch, web_fetch): url; http (http_request, api, mcp, mcp_call): metadata.requests as {id, method?, target, code?, duration?}[], drawn by RequestTicker, newest three while running and every one, capped at 10, once done; websearch (web_search, search_web): query; task (subagent, agent): description, metadata.current. Any other name shows its first of filePath, path, file, url, query, pattern, command, description, name, id. |
| `call.startedAt, call.endedAt` | `number` |  | Epoch milliseconds, as Date.now() gives; the reducer stamps them from each event's at, or the time it applies it. |
| `call.permission` | `{patterns: string[]; message?: string}` |  | dispatch({type: 'ask', seq, id, patterns: ['Refund $48.00 on ord_4812'], message: 'Returns $48.00 to the customer.'}) sets it and the awaiting-permission status; the ask card shows message, one sentence of what allowing does, under its question. With no command in the input, patterns fill the card's well. |
| `size` | `'default' \| 'sm'` | `'default'` | 32px or 28px line. |
| `onReply` | `(reply: 'once' \| 'reject') => void` |  | The ask card for an awaiting-permission call: the question, one sentence, the detail in a well, then Deny and Allow. Dispatch a reply event with the answer. |
| `actions` | `ReactNode` |  | Your own buttons under the detail, right-aligned, in place of Deny and Allow. onReply wins when both are set. |
| `detailMono` | `boolean` | `the renderer's` | Sets the detail in type-tag. registerTool takes it: true for paths and commands, false for prose. |
| `label` | `string` | `from the registry` | Overrides the -ing phrase. |
| `doneLabel` | `string` | `past tense of label` | Overrides the done phrase. |
| `detail` | `string` | `from the registry` | Overrides the text after the label. |
| `duration` | `number` |  | Milliseconds, when the data has no timestamps; Reasoning takes seconds. |
| `children` | `ReactNode` |  | A custom body. |
| `defaultOpen` | `boolean` | `true when the call failed` | Open, defaultOpen and onOpenChange are Base UI Collapsible props. A failed call opens on its message. |
| `ToolCallList calls` | `readonly ToolCallData[]` | `required` | One row per call, in order. |
| `ToolCallList live` | `boolean` | `any call not ended` | The turn is working. Live, the completed calls before the newest fold into one line; done, all fold into "Worked for 14s". |
| `ToolCallList hideCompleted` | `boolean` | `false` | Running, waiting and failed calls always show. |
| `ToolCallList orphanTtl` | `number` | `2000` | Milliseconds a result waits for its call. |
| `ToolCallList onReply` | `(call, reply) => void` |  | The answer to the waiting call, as on a row; actions is a function of the call too. |
| `useToolCalls(initial)` | `[{calls, gen, dropped}, dispatch]` | `initial: []` | initial seeds the calls (ToolCallData[]). A call's events all take seq, id and optional gen and at (epoch ms): call {tool, input?, raw?}; input {raw, input?}; start {tool?, input?, title?}; progress {metadata?, title?}; ask {patterns, message?}; reply {reply: 'once' \| 'reject', feedback?}; result {tool?, status?: 'completed' \| 'error', output?, error?, title?, metadata?}. Turn events: stop {gen, at?} cancels that turn's live calls, turn {gen?} opens the next, reset {} clears all. |
| `labels` | `ToolCallLabels` | `English words` | Status words, the cap words and the folded line (worked, ranTools, failedCount), for another language; ToolCallList passes them on. |
Other props pass through to the root element.

## Variants and states
- status: pending, running, completed, error, awaiting-permission, denied, cancelled
- size: default, sm
- states: pending, running, completed, error, awaiting permission, denied, cancelled, hover, focus-visible, open, orphan

## Accessibility
- [ ] A row that opens is a button with aria-expanded; its name is label, detail, the status word and the time.
- [ ] Every status has a word, read aloud when it is not shown: Done, Running, Failed, Denied, Stopped. The glyph is aria-hidden. The root sets aria-busy while pending or running.
- [ ] Enter or Space opens the body; Tab moves into the body controls; plain rows are not tab stops.
- [ ] The arc is aria-hidden beside its read-aloud word; a failure message is the first thing in the opened body.
- [ ] Deny comes before Allow in the tab order, so the first stop in the ask card never allows by accident.
- [ ] A result before its call shows after 2s as "Orphaned result", never Done.
- [ ] The ask card is a group named by its question. When it goes, the row takes focus, so a keyboard user is not dropped to the top of the page.

## Edge cases
- 120-character path -> Label and detail truncate to one line; the body wraps anywhere.
- No input or output -> One plain row, not a button, with no hover wash and no chevron. The glyph cell stays, so its verb lines up with the rows that open.
- Narrow screen -> The target truncates first, down to 6 characters; on a phone it wraps to a second line instead. The end of the line never wraps.
- Command in an approval -> Shown in full and wrapped in a code block, never truncated.
- Right to left -> Spacing and caret mirror; code stays left to right.
- Duplicate, out-of-order or replayed events -> Dropped and counted; a late stop echo leaves the next turn running.
- Finished turn -> ToolCallList folds every call into "Worked for 14s" (or "Ran 5 tools"), with a red Failed at its end when a call failed.
- Live turn -> Completed calls before the newest fold into one line like "Read 2 files, searched once"; the newest stays a row.
- Output longer than the cap -> Shell shows 24 lines, other tools 8, and 20,000 characters in all, with the cut said.
- Forced colors -> The words carry every state; the arc keeps its edge.
- Reduced motion -> The arc holds still; the sr-only word still says running.

## Tokens
--line-frame, --surface-hover, --surface-card, --fail-text, --text-2, --type-tag, --type-body-sm, --tool-detail-min, --code-prompt, --ease-step

## Related
- [Code block](/components/code-block.md): Highlighted code, one-line commands and inline code, with copy.
