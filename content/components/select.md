---
name: Select
system: iota
kind: component
import: "import {NativeSelect, NativeSelectOptGroup, NativeSelectOption, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, listPopupClassName, listItemClassName, listGroupLabelClassName, listSeparatorClassName, fieldTriggerClassName} from '@/components/iota/ui/select'"
install: "npx shadcn@latest add {{SITE}}/r/select.json"
registryDependencies: [badge, field, icon, kind, overlay, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/select
---

# Select

Picks one option from a list in a popup.

## Use when
- One choice from 5 to about 30 known options.
- Options of different kinds share names: pass kind.
- A form used mostly on phones or generated from a schema: native.

## Don't use when
- Two to six options fit on screen. Use [Radio group](/components/radio-group.md).
- There are more than 30 options, or the person types the name. Use [Combobox](/components/combobox.md).
- The choice switches a view on this page. Use [Segmented control](/components/segmented-control.md).

## Minimal example
```tsx
<Select items={languages} defaultValue="en">
  <SelectTrigger aria-label="Reply language"><SelectValue/></SelectTrigger>
  <SelectContent>{languages.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
</Select>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. select-items-prop MUST Pass the options as items on Select as well as rendering SelectItems, so the trigger shows the label before the popup opens. Because Base UI finds the label from items, so without it the trigger shows the raw value "agent:triage" until the popup opens.
   - Correct: `<Select items={sources} defaultValue="agent:triage">...</Select>`
   - Wrong: `<Select defaultValue="agent:triage">...</Select>`
2. select-label MUST Label the trigger with Field and FieldLabel, or aria-labelledby; its text is the value, not the question. Because the trigger text is the current value, so a screen reader hears "English, combobox" with no question.
   - Correct:
     ```tsx
     <p id="src">Show activity from</p>
     <SelectTrigger aria-labelledby="src"><SelectValue/></SelectTrigger>
     ```
   - Wrong: `<SelectTrigger><SelectValue/></SelectTrigger>`
3. select-placeholder MUST Use SelectValue placeholder to say what to pick; never add a fake first option like None. Because a None option counts as a real choice, so a required field passes empty and the list gains a fake row.
   - Correct: `<SelectValue placeholder="Pick a language"/>`
   - Wrong: `<SelectItem value="">None</SelectItem>`
4. select-kind-prop MUST Pass kind on options that share a name; never mark kinds with a colored dot. Because a dot is hue alone, which vanishes in forced colors and for color-blind readers; kind adds the word.
   - Correct: `<SelectItem value="agent:triage" kind="agent">triage</SelectItem>`
   - Wrong: `<SelectItem><span className="size-2 bg-[var(--hue-1-mark)]"/>triage</SelectItem>`
5. select-native-on-phones SHOULD Use native for forms used mostly on phones or generated from a schema.
   - Correct: `<Select native items={schema.enum.map(...)}/>`
   - Wrong: `<Select items={schema.enum.map(...)}>...</Select>`
6. select-thirty MUST Use Combobox past 30 options; the popup caps at 320px, about nine items. Because the popup caps at 320px, about nine items, and Select has no search to reach the rest.
   - Correct: `<Combobox items={allRuns}/>`
   - Wrong: `<Select items={allRuns}/>`
7. select-known-options MUST Pass only options known up front; options that load belong in Combobox. Because Select has no loading or empty state, so options that arrive late leave a popup that opens blank.
8. select-empty NEVER Render a Select with no options; show why in its place. Because an empty popup opens to nothing and gives no reason or way forward.
   - Correct: `<p className="type-body-sm text-text-2">No agents yet. <Link href="/agents/new">Create one</Link></p>`
   - Wrong: `<Select items={[]}><SelectTrigger><SelectValue placeholder="Pick an agent"/></SelectTrigger></Select>`
9. select-invalid SHOULD Set aria-invalid on the trigger and show the error in the Field.
   - Correct: `<SelectTrigger aria-invalid aria-label="Reply language">`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Select items` | `{value, label, kind?, disabled?}[] \| Record` |  | The options. Required for native mode. |
| `Select value / defaultValue / onValueChange` | `string \| null` |  | null is no choice. |
| `Select native` | `boolean` | `false` | Renders the platform select. No kind labels or groups. |
| `Select size, placeholder` | `ControlSize; string` | `'default'` | Native mode only; the popup trigger takes its size on SelectTrigger. |
| `SelectTrigger size` | `'sm' \| 'default' \| 'lg'` | `'default'` | 28, 32 or 44px. Grows with zoomed text. |
| `SelectTrigger aria-invalid` | `boolean` | `false` | The fail line on its edge, no wash. |
| `SelectValue placeholder` | `ReactNode` |  | Shown in text-3 until a choice. |
| `SelectItem kind` | `'agent' \| 'key' \| 'run' \| 'deploy' \| 'model'` | `from items` | Ends the item with the kind label. |
| `SelectContent side, align, sideOffset` | `Base UI` | `'bottom', 'start', 4` | Where the popup opens. |
Other props pass through to the root element.

## Variants and states
- native: false, true
- size: sm, default, lg
- states: rest, placeholder, hover, focus-visible, open, highlighted item, invalid, disabled

## Accessibility
- [ ] The trigger is a combobox with aria-expanded, aria-haspopup="listbox" and aria-invalid.
- [ ] The popup is a listbox; each item is an option with aria-selected.
- [ ] Enter, Space or ArrowDown on the trigger opens it with the chosen item highlighted.
- [ ] Letters jump to the next item starting with them, open or closed.
- [ ] Enter picks and returns focus to the trigger; Escape closes without a change.
- [ ] The kind label is text after the option name, so it reads without colour.

## Edge cases
- Long label -> Value and item text truncate with an ellipsis; the popup is at most --popover wide.
- 40 options at the viewport edge -> The list scrolls inside a 320px popup and flips above the trigger near the bottom.
- Right to left -> The check and the caret sit at the end, the left in RTL.
- Zoom 200% -> Height is max(--control, 1lh + 12px) and grows with the text.
- Invalid with no value -> The edge takes the fail line; the Field shows the error.
- items=[] -> Opens an empty popup. Do not render it.
- Inside a Dialog -> The popup portals above the dialog; Escape closes only the popup.
- Native on touch -> Opens the platform picker; text is 16px so iOS does not zoom.
- Typing "sp" fast while closed -> Typeahead jumps to Spanish without opening.

## Tokens
--line-control, --control, --control-sm, --radius-inner, --radius-soft, --line-frame, --accent-wash, --accent-mark, --surface-pressed, --text-disabled, --surface-page, --focus-halo, --elev-overlay, --dur-base, --dur-fast, --ease-step, --surface-hover, --type-label, --accent-tint, --accent-label, --fail-line, --popup-max, --popover

## Related
- [Combobox](/components/combobox.md): A searchable choice, single, multiple or creatable.
- [Radio group](/components/radio-group.md): One choice from a short visible list.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
