---
name: Chip
system: iota
kind: component
import: "import {Chip, ChipButton, ChipCount, ChipGroup, ChipGroupContext, chipVariants} from '@/components/iota/ui/chip'"
install: "npx shadcn@latest add {{SITE}}/r/chip.json"
registryDependencies: [icon, kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/chip
---

# Chip

Filters a list, or holds a value someone can remove.

## Use when
- The person narrows a list by one or more values and sees the list change at once.
- A field holds values the person chose (filters, recipients, labels) and each can be removed.
- A filter row needs a menu for one dimension (model, agent) beside on/off chips.

## Don't use when
- The token only labels something and is never pressed. Use [Badge](/components/badge.md).
- The person picks exactly one of two to five views. Use [Tabs](/components/tabs.md).
- The action starts work: send, refund, save. Use [Button](/components/button.md).
- A setting turns on or off outside the list. Use [Switch](/components/switch.md).

## Minimal example
```tsx
<ChipGroup role="group" aria-label="Filter conversations by status">
  <Chip pressed={on} onPressedChange={setOn} count={12}>Waiting</Chip>
</ChipGroup>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. chip-group-label MUST Wrap two or more filter chips in `<ChipGroup role="group" aria-label>`. Because a screen reader hears "Waiting, toggle button" with nothing to say what the chips filter.
   - Correct: `<ChipGroup role="group" aria-label="Filter conversations by status">…</ChipGroup>`
   - Wrong: `<div><Chip>Waiting</Chip><Chip>Open</Chip></div>`
2. chip-count-matches SHOULD Pass count as the rows the filter matches now; disable the chip at 0 instead of hiding it. Because a chip that disappears shifts the row under the pointer and hides that the filter exists.
   - Correct: `<Chip count={count} disabled={count === 0}>Waiting</Chip>`
   - Wrong: `{count > 0 && <Chip count={count}>Waiting</Chip>}`
3. chip-remove-in-group MUST Render removable values in one ChipGroup with stable keys so focus moves to the next remove button. Because with index keys React unmounts the last chip instead of the removed one, so the focus target is gone and focus falls to the page.
   - Correct:
     ```tsx
     <ChipGroup aria-label="Filters">{values.map(v => <Chip key={v.id} onRemove={() => remove(v.id)}>{v.text}</Chip>)}</ChipGroup>
     ```
   - Wrong: `{values.map((v, i) => <Chip key={i} onRemove={…}>{v}</Chip>)}`
4. chip-label-noun SHOULD Label a chip with the value itself in 1 to 3 words, not a sentence or a verb.
   - Correct: `<Chip>Waiting</Chip>`
   - Wrong: `<Chip>Show waiting conversations</Chip>`
5. chip-remove-label MUST Pass removeLabel when a value holds an element instead of a plain string. Because the default name is built only from string children, so every such remove button is just "Remove".
   - Correct: `<Chip onRemove={remove} removeLabel="Remove queue:billing"><b>queue</b>:prod</Chip>`
   - Wrong: `<Chip onRemove={remove}><b>queue</b>:prod</Chip>`
6. chip-pressed-not-color MUST Show on with pressed and the selected wash, kind or no kind; never a hue. Because a class sets no aria-pressed, so a screen reader cannot tell on from off, and hue means a kind in iOTA.
   - Correct: `<Chip pressed={on} onPressedChange={setOn}>Waiting</Chip>`
   - Wrong: `<Chip className={on ? "bg-blue-500" : ""}>Waiting</Chip>`
7. chip-not-pill NEVER Round a chip into a pill; keep the 6px control corner. Because round belongs to person avatars and radios in iOTA, and a pill chip no longer matches the buttons beside it.
   - Correct: `<Chip>Waiting</Chip>`
   - Wrong: `<Chip className="rounded-full">Waiting</Chip>`
8. chip-no-x-on-toggle NEVER Add an x to a pressed filter; pressing again turns it off. Because onRemove turns the chip into a value span, so pressed is dropped and the filter loses its on state.
   - Correct: `<Chip pressed onPressedChange={setOn}>Waiting</Chip>`
   - Wrong: `<Chip pressed onRemove={clear}>Waiting</Chip>`
9. chip-label-width SHOULD Let a value longer than 32 characters shrink; the chip truncates and keeps the remove button.
   - Correct: `` <Chip onRemove={remove} removeLabel={`Remove ${url}`}>{url}</Chip> ``
10. chip-strip SHOULD Put toggle filters in a table toolbar in a ChipGroup variant="strip", at size="xs". Because the toolbar is 40px, and a 24px chip sits 8px from its rules; a bare div loses the group name and the one-line row.
   - Correct:
     ```tsx
     <ChipGroup variant="strip" role="group" aria-label="Status"><Chip size="xs">Open</Chip><Chip size="xs">Waiting</Chip></ChipGroup>
     ```
   - Wrong: `<div className="flex gap-2"><Chip>Open</Chip><Chip>Waiting</Chip></div>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `variant` | `'secondary' \| 'ghost' \| 'outline'` | `'secondary'` | secondary and outline draw the control edge; ghost drops it. |
| `size` | `'default' \| 'sm' \| 'xs'` | `'default'` | default and sm are 28px; xs is 24px. |
| `kind` | `Kind` |  | Sets data-kind only; name the kind in the label. |
| `count` | `number` |  | Tabular count after the label. |
| `pressed, defaultPressed, onPressedChange` | `Base UI Toggle` |  | Filter form only. |
| `onRemove` | `() => void` |  | Makes the chip a removable value. |
| `removeLabel` | `string` | `'Remove ' + text` | Value form. |
| `invalid` | `boolean` |  | Value form; fail wash and line. |
| `focusAfterEmpty` | `RefObject<HTMLElement \| null>` |  | Gets focus when the last value is removed. |
| `chevron` | `boolean` |  | ChipButton only: a caret for a menu trigger. |
| `ChipGroup variant` | `'wrap' \| 'strip'` | `'wrap'` | Both keep 4px between chips and each chip's own edge. strip never wraps. |
Other props pass through to the root element.

## Variants and states
- variant: secondary, ghost, outline
- size: default, xs
- group: wrap, strip
- states: rest, hover, focus-visible, pressed, active, disabled, invalid value, menu open, active filter

## Accessibility
- [ ] A filter chip is a toggle button with aria-pressed; forced colors draws a 2px outline when on.
- [ ] Inside a FilterBar the chips are joined cells; they draw their focus ring inside the cell, so it never sits on a neighbour's line.
- [ ] Space or Enter toggles; Backspace, Delete or Enter on a remove button removes the value.
- [ ] A removed value moves focus to the next remove button, else the previous, else focusAfterEmpty.
- [ ] The remove button name is "Remove" plus the text; pass removeLabel for element children.
- [ ] An invalid value adds "(invalid)" in sr-only text.
- [ ] The remove glyph reaches 24px tall through its hit area.

## Edge cases
- Long label -> Never wraps; a string label ends in an ellipsis.
- One character -> About 28x28.
- No children -> An empty 28px button with no name; do not render empty chips.
- 25 chips in 160px -> A wrap group wraps; a strip never does, so a toolbar moves it to its own row.
- Right to left -> Label at the start, remove button at the end.
- Slow filter -> The chip flips at once; the list shows the wait. A chip never pends.
- Value the field rejects -> Fail wash and "(invalid)"; the value stays so it can be fixed or removed.
- Hold Backspace on remove -> Focus walks along the row; the last removal goes to focusAfterEmpty.
- Inside a form -> Toggle and remove are type="button"; they never submit.
- Ten clicks in a second -> Toggles ten times and ends in the right state.
- Forced colors -> Every chip keeps a 1px outline; pressed draws 2px; invalid draws it dashed.
- Pressed and disabled -> Keeps the darker edge and drops the fill, so the applied filter still shows.
- Touch -> Hover is guarded, so nothing sticks after a tap.

## Tokens
--line-control, --line-control-hover, --elev-control, --surface-page, --surface-hover, --surface-selected, --text-1, --accent-wash, --accent-line, --text-disabled, --control-sm, --radius-soft, --radius-inner, --type-label, --type-label-sm, --dur-fast, --dur-press, --scale-press, --text-2

## Related
- [Badge](/components/badge.md): A static label for a count, category or kind, shown as a tinted word.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
- [Tabs](/components/tabs.md): Panels of one view, with closable and reorderable document tabs.
- [Combobox](/components/combobox.md): A searchable choice, single, multiple or creatable.
