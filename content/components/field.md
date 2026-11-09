---
name: Field
system: iota
kind: component
import: "import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle, Form, FormActions, FormStatus, Label, LabelHint, fieldBoxVariants, fieldControlVariants, labelClasses, useFieldDisabled} from '@/components/iota/ui/field'"
install: "npx shadcn@latest add {{SITE}}/r/field.json"
registryDependencies: [theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/field
---

# Field

Puts a label, a hint and any error around a control.

## Use when
- Any control the person fills: Input, Textarea, Combobox, Date picker, Select.
- A Switch or Checkbox that needs a sentence of explanation beside it.
- A set of fields that submit together, wrapped in Form.

## Don't use when
- A search box in a toolbar names itself with aria-label. Use [Input](/components/input.md).
- A row of filters, not a form. Use [Filter bar](/components/filter-bar.md).
- A message about the whole page or account. Use [Alert](/components/alert.md).

## Minimal example
```tsx
<Field name="name">
  <FieldLabel>Agent name</FieldLabel>
  <Input placeholder="support-agent"/>
  <FieldDescription>Lowercase and dashes.</FieldDescription>
  <FieldError/>
</Field>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. field-error-timing MUST Leave validationMode unset so a field checks on blur, then on change while invalid. Because onChange flags the value as wrong on the first keystroke, before the person has finished typing it.
   - Correct: `<Field validate={slug}>`
   - Wrong: `<Field validationMode="onChange" validate={slug}>`
2. field-form-submit MUST Wrap fields that submit together in Form with a type="submit" Button, and pass pending to both. Because without Form, Enter in a field submits nothing and a second press sends the request twice.
   - Correct:
     ```tsx
     <Form pending={saving} onFormSubmit={save}>
       <Field name="name">...</Field>
       <Button type="submit" pending={saving}>Save</Button>
     </Form>
     ```
   - Wrong: `<div><Field>...</Field><Button onClick={save}>Save</Button></div>`
3. field-server-errors MUST Pass server rejections to Form errors keyed by field name, not to a toast. Because a toast disappears and is tied to no control, while Form errors mark the field invalid under its own label.
   - Correct: `<Form errors={{name: "An agent with this name already exists."}}>`
   - Wrong: `toast.error("Name taken")`
4. field-label-bound MUST Name a control with FieldLabel inside a Field, or Label htmlFor outside one, never a styled p. Because a p is not a label, so the control has no accessible name and a click on the text does not focus it.
   - Correct: `<Field><FieldLabel>Agent name</FieldLabel><Input/></Field>`
   - Wrong: `<p className="type-label">Agent name</p><Input/>`
5. field-error-fix SHOULD Write an error as what to do, in a sentence with a period.
   - Correct: `<FieldError>Use lowercase letters, digits and dashes.</FieldError>`
   - Wrong: `<FieldError>Invalid name</FieldError>`
6. field-mark-optional SHOULD Mark the few optional fields with optional and mark nothing else.
   - Correct: `<FieldLabel optional>Team</FieldLabel>`
   - Wrong: `<FieldLabel>Name *</FieldLabel>`
7. field-error-component NEVER Style an error as raw red text; use FieldError. Because a loose p is not in the control's aria-describedby, so a screen reader never reads it, and red-600 is not the fail text step.
   - Correct: `<FieldError>An agent with this name already exists.</FieldError>`
   - Wrong: `<p className="text-red-600">Name taken</p>`
8. field-description-length SHOULD Keep a FieldDescription to one sentence under 120 characters.
   - Correct: `<FieldDescription>Lowercase letters, digits and dashes.</FieldDescription>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Field` | `name, invalid, validate, validationMode, disabled, orientation` |  | validationMode defaults to blur, then change while invalid. |
| `FieldLabel` | `optional` |  | Bound by Base UI. |
| `FieldError` | `errors, match, children` |  | Children or errors always show. |
| `FieldSet, FieldLegend` | `disabled; variant` |  | FieldLegend variant: 'legend' \| 'label'. |
| `Form` | `pending, errors, onFormSubmit` |  | Drops submits while pending. |
| `FormStatus` | `status: 'ok' \| 'fail'` |  | A status region, always rendered. |
| `Label, LabelHint` | `optional, htmlFor` |  | For a control outside a Field. |
Other props pass through to the root element.

## Variants and states
- orientation: vertical, horizontal, responsive
- states: rest, optional, invalid, several-errors, disabled, form-pending, form-result

## Accessibility
- [ ] FieldLabel is a native label bound to the control; a click on it focuses the control.
- [ ] FieldDescription and FieldError link by aria-describedby; the control gets aria-invalid.
- [ ] Tab leaves the control and validates it; Enter in a Form submits, and does nothing while pending.
- [ ] Form sets aria-busy while pending; FormStatus is a polite status region.
- [ ] The error is text, so it survives forced colors.

## Edge cases
- Long label and error -> Both wrap; nothing has a fixed height.
- Right to left -> Label, hint and error align to the inline start; FieldSeparator centres logically.
- Inside a disabled FieldSet -> Every Field and the buttons in its controls take the disabled state.
- 120px wide -> Label, control and error stack; responsive stays vertical.
- No FieldLabel -> The control is unnamed; add the label or aria-label.
- Disabled and invalid -> Disabled wins; validation is skipped and the error hides.
- Server and client error -> FieldError dedupes and lists both.
- Enter three times while pending -> One request is sent; Form drops the rest.
- Failed submit -> Values stay and the first invalid field takes focus.
- Zoom 200% -> Label, hint and error wrap and grow.

## Tokens
--type-label, --text-1, --text-disabled, --type-body-sm, --text-2, --fail-text, --line-control, --line-frame, --accent-wash, --line-focus, --border-focus

## Related
- [Input](/components/input.md): One line of text. Variants: text, password, secret, copy, search, number and OTP, with prefix and suffix slots.
- [Textarea](/components/textarea.md): Several lines of text that grow.
- [Combobox](/components/combobox.md): A searchable choice, single, multiple or creatable.
- [Checkbox](/components/checkbox.md): One option on or off, with a mixed state.
- [Filter bar](/components/filter-bar.md): Search plus filter chips and clear-all.
