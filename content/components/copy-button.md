---
name: Copy button
system: iota
kind: component
import: "import {CopyButton} from '@/components/iota/ui/copy-button'"
install: "npx shadcn@latest add {{SITE}}/r/copy-button.json"
registryDependencies: [button, icon, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/copy-button
---

# Copy button

Copies a value to the clipboard and confirms it in place.

## Larger copies
For a whole block of code beside its preview, use `CopyButton` with a text label so the action names what it copies.

## Use when
- The person needs a value somewhere else: an ID, a key, a canned reply, a URL.
- Selecting by hand is slow or error-prone: a 40-character key, a token, a multi-line reply.

## Don't use when
- The value has to be read and edited, not copied. Use [Input](/components/input.md).
- The value is a block of code with a copy action in its corner. Use [Code block](/components/code-block.md).
- The action shares a link; label it "Copy link". Use [Button](/components/button.md).

## Minimal example
```tsx
<CopyButton value={ticket.id} label="ticket ID"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. copy-button-fetch-on-demand MUST Pass a function that fetches a secret; never the secret itself. Because a secret passed as value sits in the page's props before anyone asks to copy it.
   - Correct: `<CopyButton value={() => api.revealKey(key.id)} label="API key"/>`
   - Wrong: `<CopyButton value={key.secret} label="API key"/>`
2. copy-button-no-toast NEVER Add a toast on success; the button confirms in place. Because the icon turns to a check and a status region says "Copied", so a toast says it twice.
   - Correct: `<CopyButton value={id} label="ticket ID"/>`
   - Wrong: `<CopyButton onCopy={() => toast("Copied")} …/>`
3. copy-button-label-required MUST Pass label on an icon-only button so each one has its own name. Because without label every icon button is named "Copy", so a row of three reads the same.
   - Correct: `<CopyButton value={id} label="ticket ID"/>`
   - Wrong: `<CopyButton value={id}/>`
4. copy-button-label-noun MUST Set label to the thing copied, such as "conversation ID"; never a sentence or a verb. Because the name is "Copy {label}" and the announcement "{label} copied", so a sentence reads twice.
   - Correct: `<CopyButton label="conversation ID" …/>`
   - Wrong: `<CopyButton label="Click to copy the conversation ID" …/>`
5. copy-button-no-label-swap NEVER Swap a Button label between Copy and Copied; use CopyButton. Because the swap changes the width and a screen reader hears nothing, where CopyButton holds its width and announces.
   - Correct: `<CopyButton value={value} label="reply" showLabel/>`
   - Wrong: `<Button onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>`
6. copy-button-one-per-value SHOULD Give each copyable value its own button, up to 3 per row; never one that copies a combination.
   - Correct:
     ```tsx
     <CopyButton value={ticketId} label="ticket ID"/> … <CopyButton value={conversationId} label="conversation ID"/>
     ```
   - Wrong: `` <CopyButton value={`${ticketId} ${conversationId}`} label="IDs"/> ``
7. copy-button-hide-empty SHOULD Hide the button when the value is empty.
   - Correct: `{value && <CopyButton value={value} label="ticket ID"/>}`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `value` | `string \| () => string \| Promise<string>` | `required` | A promise pends the button until it resolves. |
| `label` | `string` |  | "conversation ID" names it "Copy conversation ID" and announces "conversation ID copied". |
| `showLabel` | `boolean` | `false` | Copy, Copied or Failed stacked in one cell. |
| `timeout` | `number` | `1600` | ms the confirmation stays; each press restarts it. |
| `onCopy` | `(value: string) => void` |  | Fires after the clipboard accepts. |
| `forceState` | `'fetching' \| 'copied' \| 'failed'` |  | For docs and visual tests. |
| `variant, size` | `Button` | `'ghost', 'icon-sm' or 'sm'` | sm with showLabel. |
Other props pass through to the root element.

## Variants and states
- label: hidden, shown
- variant: ghost, secondary
- states: rest, hover, focus-visible, disabled, fetching, copied, failed

## Accessibility
- [ ] The button is named `Copy <label>` and sets aria-busy while fetching.
- [ ] A fixed, sr-only role="status" region announces `<label> copied` on every copy.
- [ ] A failure announces "Could not copy. Select the text and copy it by hand."
- [ ] The glyph and words are aria-hidden; the glyph shape (check, warning) carries the state without color.
- [ ] Icon only is 28px, past the 24px target.

## Edge cases
- 2,000-character value -> Copies all of it; truncate the value beside the button in the middle.
- Empty value, no label -> Copies an empty string and says "Copied"; hide the button.
- Inside a scroller -> The status region is fixed and sr-only, so it never adds width.
- Right to left -> Glyph and word mirror their order.
- Zoom 200% -> With showLabel the box grows with the text; icon only stays 28px.
- Tap on iOS WebKit with a fetched value -> Uses clipboard.write with a ClipboardItem promise in the same tick; falls back to writeText.
- Value takes 1.2s; never resolves -> Pends in the same box; the caller times out the fetch.
- Clipboard denied or fetch rejects -> Warning glyph and "Failed" for 1.6s.
- Ten presses in a second -> Each copies and restarts the timer; the box never moves.
- Inside an Input suffix or code block corner -> Ghost flips with the surface channels.
- Forced colors -> Button draws its ButtonText border; glyph shapes switch.
- Reduced motion -> The glyph swap is a cut; the spinner stands still.

## Tokens
--button-ghost, --button-ghost-hover, --line-control, --control-sm, --line-focus, --border-focus, --focus-offset

## Related
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
- [Code block](/components/code-block.md): Highlighted code, one-line commands and inline code, with copy.
- [Input](/components/input.md): One line of text. Variants: text, password, secret, copy, search, number and OTP, with prefix and suffix slots.
