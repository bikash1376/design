---
name: Slider
system: iota
source: quartz
kind: component
import: "import {Slider} from '@/components/iota/ui/slider'"
install: "npx shadcn@latest add {{SITE}}/r/slider.json"
registryDependencies: [direction, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/slider
---

# Slider

Sets a number or a range by dragging along a track.

## Look
The whole row is the track: a panel row, a `--fill` range and a thin tick for the value, with `label` on the left and the value in mono on the right.

## Use when
- The value sits on a known scale and the person thinks in more or less: sampling rate, concurrency, a spend band.
- The person wants to see the value against the whole range while setting it.

## Don't use when
- The exact number matters, like a refund amount or a timeout in seconds. Use [Input](/components/input.md).
- There are fewer than five meaningful positions. Use [Segmented control](/components/segmented-control.md).

## Minimal example
```tsx
<Slider min={1} max={64} value={value} onValueChange={setValue} showValue aria-label="Concurrency"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. slider-save-on-commit MUST Save in onValueCommitted, not onValueChange. Because onValueChange fires on every pixel of a drag, so a save there sends dozens of requests and can land out of order.
   - Correct: `<Slider onValueChange={setV} onValueCommitted={v => api.save(v)}/>`
   - Wrong: `<Slider onValueChange={v => api.save(v)}/>`
2. slider-show-value SHOULD Pass showValue and a format when the value means something on its own.
   - Correct: `<Slider max={1} step={0.05} showValue format={{style: 'percent'}}/>`
3. slider-format-unit MUST Put the unit in format, not in the label. Because format also writes aria-valuetext, so without it a screen reader reads "0.25" where the eye sees "25%".
   - Correct: `<p>Review sampling</p><Slider max={1} format={{style: 'percent'}} showValue/>`
   - Wrong: `<p>Sampling (%)</p><Slider max={100}/>`
4. slider-thumb-names MUST Pass thumbLabels on a two-thumb range. Because both thumbs otherwise share the one name, and a screen reader cannot tell the lower bound from the upper.
   - Correct: `<Slider defaultValue={[20, 80]} thumbLabels={['Lower bound', 'Upper bound']}/>`
   - Wrong: `<Slider defaultValue={[20, 80]}/>`
5. slider-name MUST Name a single slider with aria-label or aria-labelledby. Because the thumb is a hidden input with no label of its own, so a screen reader reads only "slider".
   - Correct: `<Slider aria-label="Review sampling" showValue/>`
6. slider-min-width MUST Give the track at least 160px. Because below that one step on 0 to 100 is under 2px and the thumb cannot land on a chosen value.
   - Correct: `<div className="w-56"><Slider showValue/></div>`
   - Wrong: `<div className="w-20"><Slider/></div>`
7. slider-row-track NEVER Add a thin bar, a round thumb or a hue; the row is the track, the fill is `--fill` and the value is a thin tick. Because iOTA's sliders stack in dense columns, and a row reads as one control with its label and value.
8. slider-no-single-value NEVER Render a slider whose min equals max. Because the thumb cannot move, so the person drags a control that changes nothing.
   - Correct: `{min < max ? <Slider min={min} max={max} aria-label="Seats" showValue/> : <p>{min} seats</p>}`
   - Wrong: `<Slider min={plan.seats} max={plan.seats} aria-label="Seats" showValue/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `value / defaultValue` | `number \| number[]` | `min` | An array of two makes a range. |
| `onValueChange / onValueCommitted` | `(value, details) => void` |  | Save on commit (pointer up, key up). |
| `min, max, step, largeStep` | `number` | `0, 100, 1, 10` | Page Up and Page Down move by largeStep. |
| `format` | `Intl.NumberFormatOptions` |  | Formats the read-out and aria-valuetext. |
| `locale` | `Intl.LocalesArgument` | `'en-US'` | Fixed so server and browser print the same. |
| `label` | `ReactNode` |  | Sits at the left of the row and names nothing by itself, so still pass aria-label when it is not plain text. |
| `showValue` | `boolean` | `false` | Read-out at the track's end; widest value reserved. |
| `thumbLabels` | `string[]` |  | One accessible name per thumb. |
| `orientation, disabled, name` | `Base UI` | `'horizontal'` | Vertical needs a parent with a height. |
Other props pass through to the root element.

## Variants and states
- value: one value, range
- states: rest, hover, dragging, focus-visible, disabled, at min, at max

## Accessibility
- [ ] Each thumb is a slider input with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext from format.
- [ ] Arrow keys move by step, mirrored in RTL; Page Up and Page Down move by largeStep; Home and End jump.
- [ ] Tab moves to the second thumb of a range.
- [ ] The read-out is an output that announces politely; its width stand-ins are aria-hidden.
- [ ] The control is touch-none so a horizontal drag moves the thumb and a vertical swipe scrolls.

## Edge cases
- Long read-out in 320px -> The read-out takes its widest width and the track shrinks.
- Container 120px -> The track shrinks beside the read-out and never overflows.
- Right to left -> The range fills from the right and the arrows follow.
- Zoom 200% -> The read-out doubles and the track shrinks; the thumb stays 16px.
- Held arrow key -> One step per repeat, stopping at max; the read-out reserves the widest of min, max and one step in from each.
- On the inverse surface -> Brand and paper flip.
- Failed save -> Set value back; the thumb jumps to it.
- Forced colors -> Track has a CanvasText border, range is Highlight, thumb is CanvasText.
- Reduced motion -> The thumb never grows; hover and drag only step its brand.

## Tokens
--faint-fg, --fill, --panel, --line-row, --line-control, --radius-soft, --ink, --paper, --text-disabled, --surface-disabled, --line-focus, --border-focus, --focus-offset, --type-label, --ring-thumb, --button-primary-hover

## Related
- [Input](/components/input.md): One line of text. Variants: text, password, secret, copy, search, number and OTP, with prefix and suffix slots.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
