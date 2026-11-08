---
name: Checkbox
system: iota
source: quartz
kind: component
import: "import {Checkbox, CheckboxGroup} from '@/components/iota/ui/checkbox'"
install: "npx shadcn@latest add {{SITE}}/r/checkbox.json"
registryDependencies: [icon, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/checkbox
---

# Checkbox

Turns one option on or off, or a whole set at once.

## Use when
- A form asks for a yes or no that applies when the form is saved.
- The person picks any number from a short visible list, including none.
- Table rows are selected for a bulk action, with a select-all in the head.

## Don't use when
- The setting applies the moment it changes. Use [Switch](/components/switch.md).
- Exactly one option can be chosen. Use [Radio group](/components/radio-group.md).
- More than eight options, or a long searchable list. Use [Combobox](/components/combobox.md).

## Minimal example
```tsx
<label><Checkbox name="notify" defaultChecked/>Notify me about escalations</label>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. checkbox-parent-for-select-all MUST Build select-all as <Checkbox parent/> inside a CheckboxGroup with allValues; never compute mixed by hand. Because a hand toggle from mixed clears or fills everything, while parent cycles back to the set the person picked.
   - Correct: `<CheckboxGroup allValues={keys} …><Checkbox parent/>…</CheckboxGroup>`
   - Wrong: `<Checkbox checked={all} indeterminate={some && !all} onCheckedChange={toggleAll}/>`
2. checkbox-label-wraps MUST Wrap the checkbox and its text in one `<label>`, or use Field. Because a loose span is not the accessible name and not a click target, so a screen reader hears "checkbox" and only the 16px box toggles.
   - Correct: `<label><Checkbox/>Notify me about escalations</label>`
   - Wrong: `<Checkbox id="n"/> <span>Notify me about escalations</span>`
3. checkbox-error-on-submit MUST Set aria-invalid after a submit attempt, never on first render. Because aria-invalid turns the edge to the fail line and announces invalid before the person has done anything wrong.
   - Correct: `<Checkbox aria-invalid={tried && !checked}/>`
   - Wrong: `<Checkbox aria-invalid={!checked}/>`
4. checkbox-label-positive SHOULD State what ticking does, in the positive; no "Don't" labels. Because ticking a negative label makes the person undo a double negative to know what happens.
   - Correct: `<label><Checkbox/>Review flagged replies</label>`
   - Wrong: `<label><Checkbox/>Don't skip flagged replies</label>`
5. checkbox-mixed-glyph MUST Show mixed with the minus glyph, never a lighter or partial fill. Because a lighter fill reads as disabled, and forced colors drop it so mixed looks unticked.
   - Correct: `<Checkbox indeterminate/>`
   - Wrong: `className="data-indeterminate:bg-ink/40"`
6. checkbox-no-hue NEVER Color a ticked checkbox; it stays brand. Because hue names a kind or a status in iOTA, so a colored tick reads as a warning or an agent setting.
   - Correct: `<Checkbox/>`
   - Wrong: `<Checkbox className="data-checked:bg-[var(--hue-1-mark)]"/>`
7. checkbox-list-length SHOULD Switch to a multiple Combobox past 8 options. Because a long list of boxes has no search and pushes the rest of the form off the screen.
   - Correct: `<Combobox multiple items={agents}/>`
8. checkbox-multiline-align SHOULD Use items-start on a row whose label can wrap. Because centered, the box drifts to the middle of a two-line label instead of its first line.
   - Correct: `<label className="flex items-start gap-3 type-label"><Checkbox/>…</label>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `value` | `string` |  | Its value inside a CheckboxGroup. |
| `parent` | `boolean` | `false` | Derives its state from the group children. |
| `indeterminate` | `boolean` | `false` | Mixed; the minus glyph. |
| `aria-invalid` | `boolean` | `false` | The fail line on the edge. |
| `disabled, readOnly, required, name` | `Base UI` |  | name submits through the hidden input. |
| `CheckboxGroup value, onValueChange, allValues` | `string[]` |  | Base UI CheckboxGroup. |
Other props pass through to the root element.

## Variants and states
- checked: false, true, indeterminate
- states: rest, hover, pressed, focus-visible, invalid, disabled, read-only

## Accessibility
- [ ] The box is role="checkbox" with aria-checked true, false or mixed, named by the wrapping label.
- [ ] Space toggles; a parent cycles all, none, then the old mix.
- [ ] The glyph is aria-hidden; mixed reads without color through the minus.
- [ ] A group is role="group" named by aria-labelledby.
- [ ] The unticked edge is --border-control, 3:1 on paper, and the ticked fill carries the state besides.
- [ ] The box is 16px with a 28px hit area; the label makes the whole line the target.

## Edge cases
- Long wrapping label -> Use items-start so the box aligns to the first line.
- No label -> Announced as "checkbox" with no name; pass aria-label.
- Select-all over 500 values -> The parent reads the value array, not rendered boxes.
- Right to left -> The box moves to the start with the label.
- Zoom 200% -> The box stays 16px, centred on the first line.
- Invalid after submit -> The fail line on the edge and the error text it describes; ticking clears it.
- Inside a clickable row -> The box stops its click from bubbling.
- Double click on the label -> Toggles twice and ends where it began.
- Space held down -> Toggles once, on key up.
- Touch -> Tapping the label toggles; the tap highlight is off.
- Forced colors -> CanvasText border; ticked and mixed use Highlight with HighlightText; disabled is GrayText.

## Tokens
--surface-page, --border-control, --fail-line, --radius-soft, --ink, --text-inverse, --surface-pressed, --text-disabled, --line-focus, --border-focus, --focus-offset, --ease-step

## Related
- [Switch](/components/switch.md): A setting that applies immediately.
- [Radio group](/components/radio-group.md): One choice from a short visible list.
- [Combobox](/components/combobox.md): A searchable choice, single, multiple or creatable.
