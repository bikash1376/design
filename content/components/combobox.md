---
name: Combobox
system: iota
source: quartz
kind: component
import: "import {Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxClear, ComboboxCollection, ComboboxContent, ComboboxCreate, ComboboxEmpty, ComboboxField, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue, normalizeEmail, splitEmails, useComboboxAnchor, validateEmail} from '@/components/iota/ui/combobox'"
install: "npx shadcn@latest add {{SITE}}/r/combobox.json"
registryDependencies: [badge, empty-state, field, icon, input, kbd, portal, select, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/combobox
---

# Combobox

Finds one or more values in a long list by typing.

## Use when
- More than about seven options, so typing beats scanning: agents, models, queues, tools.
- Several values from a list, shown together: tools an agent may call, labels on a conversation.
- Free values the list cannot know: new labels, the emails allowed to review a draft.

## Don't use when
- Seven or fewer options and no typing needed. Use [Select](/components/select.md).
- Two to five options that should all stay visible. Use [Segmented control](/components/segmented-control.md).
- A search across the product that runs commands. Use [Command](/components/command.md).
- One line of free text with no list. Use [Input](/components/input.md).

## Minimal example
```tsx
<ComboboxField items={agents} placeholder="Search agents" showClear emptyText="No agents match."/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. combobox-creatable-strings MUST Set multiple creatable with string items, and a validate or preset when the format matters. Because creatable stores typed entries as strings, and without validate a typo like "ana@" commits as a valid chip.
   - Correct: `<ComboboxField multiple creatable preset="email"/>`
   - Wrong: `<TagInput validate={isEmail}/>`
2. combobox-pending MUST Pass pending while items load and filter={null} so the server order stands. Because without pending the list says nothing matched while results load, and the client filter reorders and drops server matches.
   - Correct: `<Combobox items={results} pending={loading} filter={null}>`
   - Wrong: `<Combobox items={results}>`
3. combobox-clear SHOULD Set showClear on an optional single field; it has no empty option. Because once a value is picked there is no other way back to empty.
   - Correct: `<ComboboxField items={agents} showClear/>`
   - Wrong: `<ComboboxField items={agents}/>`
4. combobox-empty-text SHOULD Name what was searched in the empty text, as 'No agents match.'
   - Correct: `<ComboboxEmpty>No agents match.</ComboboxEmpty>`
   - Wrong: `<ComboboxEmpty>No results</ComboboxEmpty>`
5. combobox-chip-name MUST Pass the value name as a plain string child of ComboboxChip. Because the remove button is named from string children only, so a chip holding an element gets a button called just "Remove".
   - Correct: `<ComboboxChip>{t.value}</ComboboxChip>`
   - Wrong: `<ComboboxChip>{t.icon}</ComboboxChip>`
6. combobox-not-for-five NEVER Use a combobox for 7 options or fewer; use Select. Because typing to filter a list that already fits on screen is an extra step, and Select shows every option at once.
   - Correct: `<Select items={["sm", "md", "lg"]}/>`
   - Wrong: `<ComboboxField items={["sm", "md", "lg"]}/>`
7. combobox-label MUST Label the field with FieldLabel or aria-label. Because a placeholder is not a name and disappears on the first keystroke, so a screen reader hears "combobox".
   - Correct: `<Field><FieldLabel>Agent</FieldLabel><ComboboxField items={agents}/></Field>`
   - Wrong: `<ComboboxField items={agents} placeholder="Agent"/>`
8. combobox-chip-height NEVER Lift the chips field height cap; it stops at four rows (176px) and scrolls. Because a pasted list of 200 emails would otherwise grow the field and push the rest of the form off the screen.
   - Correct: `<ComboboxField multiple creatable/>`
   - Wrong: `<ComboboxChips className="max-h-none">`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Combobox items, value, defaultValue, onValueChange, multiple` | `Base UI` |  | Every Base UI Root prop. |
| `creatable` | `boolean` | `false` | With multiple and string items. |
| `preset` | `'email'` |  | Sets normalize, validate, split and delimiters. |
| `normalize, validate, split` | `(raw) => string, (v, all) => string \| null, (text) => string[]` | `trim, none, commas and lines` | creatable. |
| `delimiters` | `string[]` | `[',']` | Keys that commit, besides Enter. |
| `pending` | `boolean` | `false` | Searching row, no empty flash. |
| `ComboboxField` | `items, multiple, placeholder, emptyText, size, showClear` |  | The standard composition for string items. |
| `ComboboxInput size, showSearchIcon, showTrigger, showClear` | `'sm' \| 'default' \| 'lg', boolean` | `'default'` | Single field. |
| `ComboboxChip value, showRemove` | `string, boolean` | `, true` | value lets a creatable root mark it. |
Other props pass through to the root element.

## Variants and states
- mode: single, multiple, creatable, email
- size: sm, default, lg
- states: rest, hover, focus open, highlighted item, selected item, empty, pending, create row, already added, marked chip, disabled, invalid

## Accessibility
- [ ] The input is role="combobox" with aria-expanded, aria-controls, aria-activedescendant and aria-invalid.
- [ ] The list is a listbox (multiselectable with multiple); items are options with aria-selected.
- [ ] ArrowDown and ArrowUp open and move; Enter picks or adds; Escape closes, a second Escape reaches the dialog.
- [ ] Backspace on an empty chips input removes the last chip; ArrowLeft at the start moves into the chips.
- [ ] Adds, removes and Searching are announced in polite status regions.
- [ ] A marked chip says its reason in title and sr-only text, so color is not the only cue.
- [ ] The chip remove button reads "Remove" plus the value; the chevron trigger reads "Show options" and stays out of the tab order.

## Edge cases
- Long chip -> Truncates inside the field; a 36-character email fits 320px.
- One-letter chip -> Keeps a 24px remove button so neighbours stay separate targets.
- items=[] -> Not creatable: the empty text. Creatable: nothing until the person types.
- 24 chips -> Wrap; the field caps at 176px and scrolls; the popup caps at the available height.
- Right to left -> Chips flow right to left; the check sits at the inline end.
- Slow search -> Keeps the Searching row and the old items until the query changes.
- Invalid email -> Kept as a marked chip; the field turns invalid and announces the count.
- Pasted list -> Splits into chips; a quoted `"Dee, Ops" <dee@acme.example>` stays one address.
- Enter held down -> Adds once; a repeat clears the text and flashes the existing chip.
- Inside a dialog -> Escape closes the list first, then the dialog.
- Inside a form -> Enter picks or adds and does not submit while the list is open.
- Forced colors -> The field and chips draw 1px system borders; the highlight gets an outline.
- Reduced motion -> The popup opens without a transition; the spinner stops.

## Tokens
--line-control, --line-frame, --accent-wash, --accent-mark, --line-focus, --focus-halo, --border-focus, --surface-pressed, --radius-inner, --radius-soft, --type-label-sm, --surface-inverse, --text-inverse, --fail-text, --surface-page, --elev-overlay, --dur-base, --dur-fast, --ease-step, --surface-hover, --type-label, --type-tag, --text-2, --field-max-height, --dur-spin, --ease-spin

## Related
- [Select](/components/select.md): One choice from a popup list, or the native select.
- [Input](/components/input.md): One line of text. Variants: text, password, secret, copy, search, number and OTP, with prefix and suffix slots.
- [Command](/components/command.md): A searchable command list, the core of the command palette.
- [Chip](/components/chip.md): An interactive token: filter toggle, removable value or menu trigger.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
