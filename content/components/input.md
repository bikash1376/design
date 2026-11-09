---
name: Input
system: iota
kind: component
import: "import {Input, InputAction, InputControl, InputPrefix, InputRoot, InputSuffix, autoStep, generatePassword, maskSecret} from '@/components/iota/ui/input'"
install: "npx shadcn@latest add {{SITE}}/r/input.json"
registryDependencies: [button, copy-button, field, format, icon, kbd, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/input
---

# Input

Takes one line of text, like a name, a key, a number or a code.

## Use when
- The answer fits on one line: a name, email, URL, ID or amount.
- The value is a secret the person pastes or reads once: a widget key, webhook secret or password.
- The person filters a list that is already on the page.
- A short code arrives by message or from an authenticator app.

## Don't use when
- The answer runs to more than one line. Use [Textarea](/components/textarea.md).
- The person picks from more than about seven options, or adds several values. Use [Combobox](/components/combobox.md).
- The value is a date, a range or a time. Use [Date picker](/components/date-picker.md).
- The value is on or off and applies at once. Use [Switch](/components/switch.md).
- The search covers the whole product, not this list. Use [Command](/components/command.md).

## Minimal example
```tsx
<Field>
  <FieldLabel>Queue name</FieldLabel>
  <Input placeholder="billing" autoComplete="off"/>
</Field>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. input-in-field MUST Put an Input that takes typed text in a Field with a FieldLabel, not a placeholder or a loose label. Because a placeholder vanishes on the first keystroke and is not a reliable accessible name.
   - Correct: `<Field><FieldLabel>Agent name</FieldLabel><Input/></Field>`
   - Wrong: `<Input placeholder="Agent name"/>`
2. input-secret-mode MUST Use mode="secret" for a credential, token or key, never type="password". A masked key keeps its length: one dot per hidden character. Because type="password" hides the tail that tells two keys apart, offers no copy, and invites the password manager to save it.
   - Correct: `<Input mode="secret" readOnly value={key} noun="widget key"/>`
   - Wrong: `<Input type="password" defaultValue={key}/>`
3. input-affix-in-slot MUST Pass an icon, scheme, unit or button as prefix or suffix, never beside the Input. Because outside the box the icon sits outside the edge that darkens on hover and turns brand on focus, and a click on it does not focus the text.
   - Correct: `<Input prefix={<Icon icon={Link} size={16}/>}/>`
   - Wrong: `<div className="flex"><Icon icon={Link}/><Input/></div>`
4. input-search-mode MUST Use mode="search" for a search box, never an icon and an input in a relative wrapper. Because a hand-placed icon misses the clear button, Escape to clear and the shortcut hint.
   - Correct: `<Input mode="search" aria-label="Search conversations"/>`
   - Wrong: `<div className="relative"><Icon icon={Search} className="absolute left-2"/><Input className="pl-8"/></div>`
5. input-one-shortcut MUST Give shortcut to one search per page; pass shortcutOwner={false} on others to show the hint only. Because only the first claiming field in document order gets the key, so a second claim does nothing.
   - Correct: `<Input mode="search" shortcut="/"/><Input mode="search"/>`
   - Wrong: `<Input mode="search" shortcut="/"/><Input mode="search" shortcut="/"/>`
6. input-auto-step SHOULD Set step="auto" on a number that spans more than two orders of magnitude.
   - Correct: `<Input mode="number" step="auto" unit="tokens"/>`
   - Wrong: `<Input mode="number" step={1} unit="tokens"/>`
7. input-generate-shows MUST Use generate on a password field so the generated value is revealed. Because a value set by hand stays masked with autoComplete="current-password", so the person never sees what to save.
   - Correct: `<Input mode="password" generate/>`
   - Wrong: `<Input mode="password" value={generatePassword()}/>`
8. input-type-keyboard MUST Set type and autoComplete for email, url and tel, or use mode="otp" for a one-time code. Because without type a phone shows the text keyboard and autofill cannot offer the address.
   - Correct: `<Input type="email" autoComplete="email" placeholder="you@acme.example"/>`
   - Wrong: `<Input placeholder="you@acme.example"/>`
9. input-placeholder-example SHOULD Give the placeholder an example value in the expected format, not the label again.
   - Correct: `<Input placeholder="triage"/>`
   - Wrong: `<Input placeholder="Enter agent name"/>`
10. input-secret-noun SHOULD Pass noun on a secret or copy field so its buttons read "Show widget key" and "Copy widget key".
   - Correct: `<Input mode="secret" readOnly value={key} noun="widget key"/>`
   - Wrong: `<Input mode="secret" readOnly value={key}/>`
11. input-no-border NEVER Add a border or change the text size on an Input. Because the box draws its own edge and its brand focus, and text-xs drops the 16px touch size that stops iOS zoom.
   - Correct: `<Input/>`
   - Wrong: `<Input className="border border-hair text-xs"/>`
12. input-min-width SHOULD Keep an Input at least 160px wide and stack the row under 320px.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `mode` | `'text' \| 'password' \| 'secret' \| 'copy' \| 'search' \| 'number' \| 'otp'` | `'text'` | Picks the props below. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | 28, 32 or 44px. OTP slots follow it. |
| `prefix, suffix` | `ReactNode` |  | Text, password, secret, copy take prefix; text takes suffix. |
| `className` | `string` |  | On the box: width and placement only. |
| `generate` | `boolean \| () => string` |  | password: adds Generate and reveals the result. |
| `noun, readOnly, redacted, tail` | `string, boolean, boolean, number` | `'value', false, false, 4` | secret. onCopy also runs after its copy. |
| `value, copyLabel, onCopy` | `string, string, (v) => void` |  | copy: a read-only value. |
| `shortcut, shortcutOwner, pending` | `string, boolean, boolean` | `, true, false` | search. The first owner in document order takes the key. |
| `min, max, step, unit` | `number, number, number \| 'auto', ReactNode` |  | number. Shift and Page keys step 10x. |
| `length, groups, onComplete` | `number, number[], (v) => void` |  | otp. validationType defaults to numeric. |
Other props pass through to the input element; className and style go to the box around it, controlClassName to the input.

## Variants and states
- mode: text, password, secret, copy, search, number, otp
- size: sm, default, lg
- states: rest, hover, focus-visible, filled, read-only, disabled, invalid, revealed, pending, at-limit, copied

## Accessibility
- [ ] The control is a native textbox named by FieldLabel or aria-label, with aria-invalid and aria-describedby from the Field.
- [ ] Number is a spinbutton with aria-valuetext including the unit; steppers are named with the step and skipped by Tab.
- [ ] The reveal toggle sets aria-pressed; a hidden secret is described as "Hidden, ending in" the last characters.
- [ ] OTP slots name the first from the label and the rest "Character n of 6"; a rejected key is announced in a status region.
- [ ] Escape in a search clears the query; a second Escape leaves the field.
- [ ] Text is 16px under pointer: coarse so iOS does not zoom; never set a smaller size.
- [ ] Forced colors draw a 1px system border on the box; the focus edge stays.

## Edge cases
- Long value -> Scrolls inside the box; copy truncates and still copies all; a read-only secret keeps its start and tail.
- Empty copy value -> Reads "None" with Copy disabled; an empty read-only secret drops its buttons.
- 120px wide -> Search keeps icon and shortcut; a number shrinks its unit before its digits.
- Right to left -> Prefix and suffix swap sides; wrap Latin pieces in bdi dir="ltr".
- Slow search -> The spinner stays in the prefix and the box keeps its size; the caller owns the timeout.
- In a well -> Stays paper with its control edge, so it reads on the grey.
- Letter typed in numeric OTP -> Refused and announced as "Digits only".
- Number out of range -> Clamps when stepped; a typed value clamps on blur.
- Stepper pressed ten times -> Adds exactly ten steps from the typed number.
- Enter inside a form -> Submits the form; no button in the field submits it.
- Reduced motion -> The search spinner stops and stays visible.

## Tokens
--line-control, --radius-soft, --text-1, --type-label, --control-sm, --control, --control-lg, --line-frame, --dur-fast, --ease-step, --line-focus, --focus-halo, --border-focus, --focus-offset, --accent-line, --accent-mark, --text-disabled, --text-3, --text-2, --type-code, --features-data, --type-label-sm, --type-heading-sm

## Related
- [Textarea](/components/textarea.md): Several lines of text that grow.
- [Field](/components/field.md): Label, control, hint and error as one unit, plus the Form part.
- [Combobox](/components/combobox.md): A searchable choice, single, multiple or creatable.
- [Date picker](/components/date-picker.md): A date, range, date-time or time, with Calendar as its popup part.
- [Copy button](/components/copy-button.md): Copies a value and confirms in place.
- [Command](/components/command.md): A searchable command list, the core of the command palette.
