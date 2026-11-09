---
name: Radio group
system: iota
kind: component
import: "import {RadioGroup, RadioGroupItem, RadioGroupOption} from '@/components/iota/ui/radio-group'"
install: "npx shadcn@latest add {{SITE}}/r/radio-group.json"
registryDependencies: [theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/radio-group
---

# Radio group

Picks exactly one option from a short list where all are visible.

## Use when
- The person picks exactly one of 2 to 6 options that are worth seeing together.
- Options differ in what they cost or do and each needs a line of description.

## Don't use when
- More than 6 options. Use [Select](/components/select.md).
- Any number of the options may apply. Use [Checkbox](/components/checkbox.md).
- Switching between views of the same data. Use [Segmented control](/components/segmented-control.md).

## Minimal example
```tsx
<RadioGroup defaultValue="pro" aria-labelledby="plan">
  <RadioGroupOption value="hobby" label="Hobby" description="1,000 conversations a month."/>
  <RadioGroupOption value="pro" label="Pro" description="10,000 conversations a month."/>
</RadioGroup>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. radio-group-name MUST Name the group with aria-labelledby pointing at its visible question. Because the group is a radiogroup with no name, so a screen reader announces the options without the question.
   - Correct: `<p id="plan">Plan</p><RadioGroup aria-labelledby="plan">...`
   - Wrong: `<p>Plan</p><RadioGroup>...`
2. radio-group-default SHOULD Pass defaultValue when one option is right for most people; leave it empty only when a wrong default costs money or data.
   - Correct: `<RadioGroup defaultValue="en">...</RadioGroup>`
   - Wrong: `<RadioGroup>...</RadioGroup> // English is the usual pick`
3. radio-group-describe MUST Put the difference between options in description, not in a tooltip or a link. Because description is tied by aria-describedby and read while arrowing, while a tooltip never opens on touch.
   - Correct: `<RadioGroupOption label="Pro" description="10,000 conversations a month"/>`
   - Wrong: `<RadioGroupOption label="Pro"/> <InfoTip>10,000 conversations</InfoTip>`
4. radio-group-parallel SHOULD Use the same grammatical form and length for every option label, 1 to 3 words.
   - Correct: `"Hobby", "Pro", "Team"`
   - Wrong: `"Hobby", "The Pro plan for growing teams", "Team"`
5. radio-group-not-cards NEVER Build plan cards with a radio in the corner. Use RadioGroupOption rows with descriptions. Because only the 16px circle is the target and the card text is not read with the radio, so the card looks clickable but is not.
   - Correct: `<RadioGroupOption label="Pro" description="..."/> x3`
   - Wrong: `<Card><RadioGroupItem/>...</Card> x3`
6. radio-group-six SHOULD Switch to Select past 6 options.
   - Correct: `<Select items={languages}/>`
   - Wrong: `9 RadioGroupOption for languages`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `RadioGroup value, defaultValue` | `unknown` |  | The chosen value; null for none. |
| `RadioGroup onValueChange` | `(value, details) => void` |  | Fires on arrow keys too. |
| `RadioGroup aria-invalid` | `boolean` | `false` | Sets the fail slot on every circle. |
| `RadioGroup disabled, readOnly, required, name` | `Base UI` |  | Form attributes for the group. |
| `RadioGroupOption label` | `ReactNode` | `required` | One to three words. |
| `RadioGroupOption description` | `ReactNode` |  | What picking it means; tied with aria-describedby. |
| `RadioGroupOption, RadioGroupItem value, disabled` | `Base UI Radio` |  | RadioGroupItem is the bare circle for custom rows. |
Other props pass through to the root element.

## Variants and states
- parts: label-only, label-and-description, RadioGroupItem
- states: rest, hover, focus-visible, chosen, disabled, invalid

## Accessibility
- [ ] The group is role="radiogroup", named by aria-labelledby, with one tab stop.
- [ ] Tab focuses the chosen option or the first; arrows move focus and the choice to the next enabled option, wrapping and following visual order in RTL.
- [ ] Space chooses a clear option.
- [ ] The description is read once through aria-describedby; the whole row is the target.
- [ ] A bare RadioGroupItem needs aria-label or a wrapping label.

## Edge cases
- Long label and description -> Both wrap; the circle stays aligned to the first line.
- Right to left -> The circle sits at the start (right).
- Required and invalid -> Rings every circle; the error sits under the group, only after a submit.
- On the inverse surface -> Brand and paper flip.
- One option -> Cannot be cleared again; use a Checkbox.
- Zero options -> An empty group the keyboard skips.
- Held arrow key -> Each repeat moves the choice one option, wrapping.
- Inside a form -> Submits through name.

## Tokens
--surface-page, --border-control, --fail-line, --radius-full, --ink, --paper, --surface-pressed, --text-disabled, --type-label, --type-body-sm, --text-1, --text-2, --ease-step

## Related
- [Checkbox](/components/checkbox.md): One option on or off, with a mixed state.
- [Select](/components/select.md): One choice from a popup list, or the native select.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
