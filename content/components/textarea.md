---
name: Textarea
system: iota
kind: component
import: "import {Textarea} from '@/components/iota/ui/textarea'"
install: "npx shadcn@latest add {{SITE}}/r/textarea.json"
registryDependencies: [field, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/textarea
---

# Textarea

Takes several lines of text and grows with them.

## Use when
- The answer runs past one line: instructions, a description, a note, a handoff message.
- Line breaks matter, like a list of steps or a pasted email thread.

## Don't use when
- The answer fits on one line. Use [Input](/components/input.md).
- The text is an agent prompt with mentions and slash commands. Use [Prompt input](/components/prompt-input.md).

## Minimal example
```tsx
<Field>
  <FieldLabel>Tool description</FieldLabel>
  <Textarea limit={280} placeholder="Looks up an invoice by its number."/>
</Field>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. textarea-limit-soft MUST Use limit, not maxLength. Because maxLength cuts a long paste without a word, while limit keeps every character and counts how far over it is.
   - Correct: `<Textarea limit={280}/>`
   - Wrong: `<Textarea maxLength={280}/>`
2. textarea-limit-in-description SHOULD State the limit in FieldDescription; the counter appears only at 80%.
   - Correct:
     ```tsx
     <Textarea limit={280}/>
     <FieldDescription>Up to 280 characters.</FieldDescription>
     ```
3. textarea-label MUST Name the textarea with FieldLabel or aria-label. Because a screen reader announces an unnamed text area, and the placeholder is gone once the person types.
   - Correct: `<Field><FieldLabel>Reviewer note</FieldLabel><Textarea/></Field>`
4. textarea-rows-not-height MUST Size with minRows and maxRows; never a fixed h- class. Because a fixed height stops the growth from minRows to maxRows, so a long note scrolls inside a short box.
   - Correct: `<Textarea minRows={3} maxRows={8}/>`
   - Wrong: `<Textarea className="h-32"/>`
5. textarea-max-rows SHOULD Set maxRows between 5 and 12 for text that can run long.
   - Correct: `<Textarea maxRows={8}/>`
   - Wrong: `<Textarea maxRows={100}/>`
6. textarea-placeholder-example SHOULD Write the placeholder as one real example sentence under 100 characters.
   - Correct: `<Textarea placeholder="Looks up an invoice by its number and returns its status."/>`
   - Wrong: `<Textarea placeholder="Enter description here..."/>`
7. textarea-no-live-counter NEVER Add your own aria-live counter to a Textarea with limit. Because it speaks on every keystroke, on top of the 80% and over-limit crossings the Textarea already announces.
   - Correct: `<Textarea limit={280}/>`
   - Wrong: `<span aria-live="polite">{left} left</span>`
8. textarea-enter-adds-line NEVER Submit a form on Enter in a Textarea; Enter adds a line. Because people press Enter for a new paragraph, so the form submits a half-written note.
   - Wrong: `<Textarea onKeyDown={e => e.key === 'Enter' && form.current?.requestSubmit()}/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `minRows` | `number` | `3` | Lines at rest; rows is read as minRows. |
| `maxRows` | `number` | `12` | Lines before it scrolls. |
| `limit` | `number` |  | Soft limit with a counter; past it the field is invalid. |
| `resizable` | `boolean` | `false` | A vertical drag corner. |
| `onValueChange` | `(value: string) => void` |  | The plain value; onChange still fires. |
| `className` | `string` |  | Width and placement; with limit it goes on the wrapper. |
Other props pass through to the textarea; with limit, className moves to the wrapper div that holds the count.

## Variants and states
- height: three rows, one row
- corner: fixed, resizable
- states: rest, hover, focus-visible, growing, read-only, disabled, invalid, near the limit, over the limit

## Accessibility
- [ ] The textarea is a multi-line textbox with aria-invalid and aria-describedby to the description, error and counter.
- [ ] The counter is sr-only under 80% of limit and linked by aria-describedby.
- [ ] A polite status region announces only the crossings: near the limit and over it.
- [ ] Enter adds a line and never submits; Tab leaves and inserts no tab character.
- [ ] Text is 16px on coarse pointers so iOS does not zoom.
- [ ] Forced colors draw a 1px system border; the over-limit words carry the state.

## Edge cases
- 2,000-character paste or long URL -> Grows to maxRows then scrolls inside; an unbroken URL wraps anywhere.
- One character -> Sits in a three-line box; it never shrinks below minRows.
- Container 120px -> The box fills the width and the counter wraps under it.
- Right to left -> Text aligns right and the counter sits at the inline end.
- Zoom 200% -> Heights are in lh, so three lines stay three lines as the text grows.
- In a well -> Stays paper with its control edge, so it reads on the grey.
- Empty or whitespace only -> Empty shows the placeholder; whitespace counts toward the limit.
- Held key past the limit -> Every character stays and the counter keeps pace; the region speaks only on crossing.
- Failed submit -> Keep every character.
- Reduced motion -> Growth is a cut, not a tween.

## Tokens
--line-control, --radius-soft, --type-label, --space-2, --line-frame, --dur-fast, --fade-edge, --line-focus, --focus-halo, --border-focus, --focus-offset, --accent-wash, --accent-mark, --type-label-sm, --text-3, --text-1, --fail-text

## Related
- [Input](/components/input.md): One line of text. Variants: text, password, secret, copy, search, number and OTP, with prefix and suffix slots.
- [Field](/components/field.md): Label, control, hint and error as one unit, plus the Form part.
- [Prompt input](/components/prompt-input.md): The composer editor with mentions, slash commands and voice.
