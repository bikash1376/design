---
name: Response
system: iota
kind: component
import: "import {Response, usePacedText, splitChunks, parseMarkdown, resolveTag, viableLength, completeJsonEnd, closeJson, nextCut, paceStep, safeHref, responseVariants} from '@/components/iota/ai/response'"
install: "npx shadcn@latest add {{SITE}}/r/response.json"
registryDependencies: [copy-button, format, status, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/response
---

# Response

Shows an agent's answer as it streams in.

## Use when
- An agent answer arrives as a stream of markdown.
- Generated text carries structured cards (a refund, a ticket) inside it.

## Don't use when
- The text is the model thinking aloud. Use [Reasoning](/components/reasoning.md).

## Minimal example
```tsx
<Response streaming={streaming} tags={refundTags}>{textSoFar}</Response>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. response-full-text MUST Pass the whole text so far as children and keep streaming true until the end. Because any change that is not an append resyncs, so passing a delta replaces the answer with its last chunk.
   - Correct: `<Response streaming>{textSoFar}</Response>`
   - Wrong: `<Response>{delta}</Response>`
2. response-tags-json MUST Register every card in tags with a pending label and a renderer that takes the parsed JSON. Because only registered names open a tag, so an unregistered card prints its raw tag and JSON into the answer.
   - Correct: `<Response tags={{'refund-card': {pending: 'Preparing refund', render}}}>{text}</Response>`
   - Wrong: `{text.includes('<refund-card') ? <Card/> : text}`
3. response-stable-inline-tags MUST Define the inlineTags array at module scope or in useMemo. Because a new array each render breaks the memo on every frozen chunk, so the whole answer re-parses on each token.
   - Correct:
     ```tsx
     const inline = [citation];
     <Response inlineTags={inline}/>
     ```
   - Wrong: `<Response inlineTags={[citation]}/>`
4. response-pending-label SHOULD Write a tag pending label as an -ing verb and its object, two or three words, no ellipsis.
   - Correct: `pending: 'Preparing refund'`
   - Wrong: `pending: 'Loading…'`
5. response-no-live-region NEVER Wrap a streaming Response in aria-live; leave announcements to Conversation. Because a live region reads every paced slice aloud, and Conversation already announces the finished turn.
   - Correct: `<ConversationProvider status={status}>...<Response streaming/>...</ConversationProvider>`
   - Wrong: `<div aria-live="polite"><Response streaming/></div>`
6. response-no-typewriter NEVER Add a fake typewriter; pacing already runs on the real stream. Because a second pace holds back text that already arrived and ignores the reduced-motion skip.
   - Correct: `<Response streaming>{answer}</Response>`
   - Wrong: `<Typewriter text={answer}/>`
7. response-code-cap SHOULD Keep maxCodeLines at its default of 40; longer fences get a Show more lines button.
   - Correct: `<Response>{answer}</Response>`
   - Wrong: `maxCodeLines={Infinity}`
8. response-size-sm SHOULD Use size="sm" for side panels; keep default for an answer in a turn. Reasoning sets its own body styles.
   - Correct: `<Response size="sm">{summary}</Response>`
9. response-no-heading-display NEVER Set a Response heading above type-heading-xs. Because display type inside an answer outranks the page and the turn header, so the answer reads as a new page.
   - Correct: `<Response>{"# Summary"}</Response> // heading-xs`
   - Wrong: `<Response>{"# Summary"}</Response> // styled as display`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `children` | `string` | `required` | The markdown so far. |
| `streaming` | `boolean` | `false` | Sets aria-busy and opens unfinished syntax. |
| `pace` | `boolean` | `true` | Off renders every delta at once. |
| `tags` | `Record<string, TagRenderer>` | `{}` | {pending, render(data, attrs), json = true}. |
| `inlineTags` | `InlineTag[]` | `[]` | Keep the array stable. |
| `tagTimeout` | `number` | `8000` | Ms without growth before an open tag resolves. |
| `maxCodeLines` | `number` | `40` | Lines shown before Show more. |
| `size` | `'default' \| 'sm'` | `'default'` | Body or body-sm roles. |
| `showMoreLines` | `(lines: number) => string` | `"Show n more lines"` | The words of a long code block's button, for another language. |
Other props pass through to the root element.

## Variants and states
- size: default, sm
- tag: card, waiting, broken, unknown
- states: settled, streaming, pacing, tag pending, tag stalled, tag timed out, unknown tag, open fence

## Accessibility
- [ ] The root has no role and sets aria-busy while streaming.
- [ ] Headings render as h3 to h5, below the turn.
- [ ] Tables render as table with th scope="col".
- [ ] Links stay inline text links; code and tables scroll by keyboard and touch.
- [ ] Never put a live region on the answer.

## Edge cases
- Long hash or URL -> Inline code and links break anywhere; a code block caps at maxCodeLines.
- Empty or whitespace -> Renders no blocks, so leading newlines draw no empty paragraph.
- Table at 160px -> Tables scroll on paper and code inside its well; the page does not.
- Right to left -> Text and lists align right; the quote indent moves to the right edge.
- Unsafe link -> javascript: and data: links render as plain labels.
- Broken JSON in a tag -> The value is discarded; raw JSON never reaches the page.
- Stream ends with an open tag -> The tag resolves as if it timed out; a JSON tag with a viable body keeps its placeholder until the value completes.
- Burst over 512 characters -> Paces in word-snapped 24ms slices; a non-append text resyncs at once.
- Reduced motion or hidden tab -> Every delta renders at once.

## Tokens
--type-body, --type-body-sm, --text-1, --type-heading-xs, --type-label, --surface-card, --type-code, --type-code-sm, --type-tag, --line-row, --line-control, --text-2, --row, --row-sm

## Related
- [Reasoning](/components/reasoning.md): The model's thinking, open while it streams and folded when done.
- [Message](/components/message.md): One turn from the person or the agent, plus dividers.
