---
name: Date picker
system: iota
source: quartz
kind: component
import: "import {Calendar, DatePicker, TimeField, addDays, addMonths, daysBetween, formatTime, parseTime} from '@/components/iota/ui/date-picker'"
install: "npx shadcn@latest add {{SITE}}/r/date-picker.json"
registryDependencies: [button, field, icon, input, overlay, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/date-picker
---

# Date picker

Sets a date, a range, a date and time, or a time of day.

## Use when
- A date that could be any day in the next or last few months: a snooze, a scheduled eval.
- A period for a report or chart, where the length matters.
- A time of day for something that repeats, like nightly quiet hours.

## Don't use when
- A date of birth or anything years away; type it. Use [Input](/components/input.md).
- A handful of fixed periods (24h, 7d, 30d). Use [Segmented control](/components/segmented-control.md).
- A duration, like a timeout; use a number input with a unit. Use [Input](/components/input.md).

## Minimal example
```tsx
<DatePicker aria-label="Snooze until" disabledDays={{before: today}}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. date-picker-range-count MUST Use mode="range" when the length matters; never two separate pickers. Because two pickers let the end come before the start and lose the day count the range shows.
   - Correct: `<DatePicker mode="range" presets={presets}/>`
   - Wrong: `<DatePicker aria-label="From"/><DatePicker aria-label="To"/>`
2. date-picker-draft MUST Write a range or datetime value only on a finished pick: both ends, a preset or Set. Because the first click writes half a range, and a query runs with no end date.
   - Correct: `<DatePicker mode="range" value={range} onValueChange={setRange}/>`
   - Wrong: `<Calendar mode="range" onSelect={setRange}/> // fires on the first click`
3. date-picker-disabled-days MUST Pass disabledDays for days that cannot be picked; never validate after the pick. Because the person learns the date was never allowed only after picking it; disabled days are skipped by the arrow keys.
   - Correct: `<DatePicker disabledDays={{before: today}}/>`
   - Wrong: `<DatePicker onValueChange={d => d < today && setError("Pick a future date")}/>`
4. date-picker-time-typed SHOULD Let the person type a time and keep step at 15 or 30 for the list.
   - Correct: `<DatePicker granularity="time" step={30}/>`
   - Wrong: `<DatePicker granularity="time" step={5}/>`
5. date-picker-preset-labels SHOULD Name a preset 'Last 7 days' and count it to include today.
   - Correct: `{label: 'Last 7 days', range: {from: addDays(today, -6), to: today}}`
   - Wrong: `{label: 'This week', range: {from: addDays(today, -7), to: today}}`
6. date-picker-field MUST Put a labelled picker in a Field with a FieldLabel. Because the trigger is a button that takes its name from the FieldLabel, so a p leaves it unnamed.
   - Correct: `<Field><FieldLabel>Expires</FieldLabel><DatePicker/></Field>`
   - Wrong: `<p>Expires</p><DatePicker/>`
7. date-picker-clearable SHOULD Set clearable on an optional date so it can go back to empty.
   - Correct: `<DatePicker clearable/>`
8. date-picker-no-library NEVER Add date-fns, dayjs or react-day-picker; this picker needs only Date and Intl. Because the picker works on plain Date and Intl, so a library adds bundle weight and a second idea of week start and locale.
   - Correct: `import {DatePicker} from '@/components/iota/ui/date-picker'`
   - Wrong: `import {DayPicker} from 'react-day-picker'`
9. date-picker-two-months SHOULD Expect one month under 640px; do not force numberOfMonths={2} in a narrow sheet.
   - Correct: `<DatePicker mode="range"/>`
   - Wrong: `<Calendar numberOfMonths={2}/> // in a 390px sheet`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `granularity` | `'date' \| 'datetime' \| 'time'` | `'date'` | Picks the value type. |
| `mode` | `'single' \| 'range'` | `'single'` | date only. |
| `value, defaultValue, onValueChange` | `Date \| null, DateRange, "HH:mm" \| null` |  | By granularity and mode. |
| `presets` | `{label, range}[]` |  | range only. |
| `disabledDays` | `(date) => boolean \| {before, after}` |  | date and datetime. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Not for time. |
| `locale` | `string` | `'en-US'` | Not for time. |
| `format` | `Intl.DateTimeFormatOptions` | `Sep 18, 2026` | How a date reads in the field; not for time. |
| `hourCycle` | `12 \| 24` | `24` | datetime and time. |
| `step, min, max` | `5 \| 10 \| 15 \| 30 \| 60, "HH:mm"` | `15` | time. |
| `name` | `string` |  | Hidden input; a range posts name-from and name-to. |
| `clearable` | `boolean` | `false` | Adds Clear to the popup; not for time, which clears by emptying the field. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Control height. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Popup alignment; not for time. |
Other props pass through to the root element.

## Variants and states
- granularity: date, range, datetime, time
- size: sm, default, lg
- states: empty, hover, focus-visible, open, range end open, picked, today, disabled day, unreadable time, invalid, disabled

## Accessibility
- [ ] The trigger is a button named by the Field label plus the value, with aria-expanded and aria-invalid.
- [ ] The calendar is an ARIA grid; days are named by their full date and carry aria-selected and aria-current="date".
- [ ] Arrows move by day and week, Page Up and Down by month, with Shift by year, Home and End by week; left and right swap in right to left.
- [ ] Escape closes and drops the draft; the value stays as it was.
- [ ] The range caption announces what to pick next and the day count.
- [ ] An unreadable time shows its reason in visible text under the field.

## Edge cases
- Long German date in 320px -> Truncates in the trigger; the day count drops out first.
- One-day range -> Reads "1 day", singular.
- No value, clearable -> The placeholder shows; the popup ends with Clear.
- 160px wide range -> The trigger fills the width; the popup drops to one month with wrapping presets.
- Right to left -> Carets mirror; the range band rounds its inline ends.
- Zoom 200% -> Day cells stay 32px; the popup scrolls inside the available height.
- Text spacing -> Two-letter weekdays and two-digit days still fit.
- Date not allowed -> Keeps the value, turns invalid and says how to fix it.
- Same day clicked twice in range mode -> Makes a one-day range.
- Inside a dialog -> Escape closes the calendar first, then the dialog.
- Forced colors -> Selected ends draw a 2px border; the band takes Highlight; today keeps its underline.
- Reduced motion -> The popup opens without a transition; month changes are cuts.

## Tokens
--line-control, --line-frame, --accent-wash, --accent-mark, --line-focus, --focus-halo, --border-focus, --focus-offset, --surface-page, --radius-soft, --elev-overlay, --dur-base, --gutter-sm, --control, --surface-hover, --dur-fast, --button-primary, --text-inverse, --surface-pressed, --text-3, --text-disabled, --type-label-sm, --text-2

## Related
- [Input](/components/input.md): One line of text. Variants: text, password, secret, copy, search, number and OTP, with prefix and suffix slots.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
- [Field](/components/field.md): Label, control, hint and error as one unit, plus the Form part.
- [Popover](/components/popover.md): Anchored rich content, including the info toggletip and the hover preview.
