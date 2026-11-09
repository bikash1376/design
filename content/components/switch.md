---
name: Switch
system: iota
kind: component
import: "import {Switch} from '@/components/iota/ui/switch'"
install: "npx shadcn@latest add {{SITE}}/r/switch.json"
registryDependencies: [theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/switch
---

# Switch

Turns a setting on or off right away.

Off is a light `--switch-off` track with a grey thumb. On is brand with a white thumb.

## Use when
- A setting takes effect the moment it changes, with no Save button: auto-reply, retries, a spend limit.
- A list of independent settings, each on its own row with its label.

## Don't use when
- The choice is saved with a form's Save button. Use [Checkbox](/components/checkbox.md).
- The person picks one of two named options, like Light and Dark. Use [Segmented control](/components/segmented-control.md).
- Pressing starts an action rather than changing a setting. Use [Button](/components/button.md).

## Minimal example
```tsx
<label>Auto-reply to new tickets<Switch checked={on} onCheckedChange={save} pending={saving}/></label>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. switch-applies-now MUST Use Checkbox instead of Switch in a form with a Save button. Because a switch reads as already applied, so the person flips it and leaves without pressing Save.
   - Correct: `<Switch checked={autoReply} onCheckedChange={saveAutoReply}/>`
   - Wrong: `<form><Switch name="autoReply"/><Button type="submit">Save</Button></form>`
2. switch-pending-save MUST Set checked at once, pass pending until the save settles, and on failure set checked back and say why in a status line. Because a thumb that waits for the server stays put after the press, so the person presses again and flips it back.
   - Correct: `<Switch checked={on} onCheckedChange={flip} pending={saving}/>`
   - Wrong: `<Switch checked={server.autoReply} onCheckedChange={v => api.save(v).then(refetch)}/>`
3. switch-label-wraps MUST Wrap the switch and its label in one label element. Because a sibling span neither names the switch for a screen reader nor flips it on click, so the target is the 36px track.
   - Correct: `<label>Auto-reply to new tickets<Switch/></label>`
   - Wrong: `<span>Auto-reply</span><Switch/>`
4. switch-label-setting SHOULD Name the setting in the positive, with no On or Off in it.
   - Correct: `<label>Auto-reply to new tickets<Switch/></label>`
   - Wrong: `<label>Retries off<Switch/></label>`
5. switch-no-on-off-text NEVER Print On or Off beside the switch. Because a screen reader reads the word and then the checked state, and the row width shifts between On and Off.
   - Correct: `<label>Auto-reply to new tickets<Switch/></label>`
   - Wrong: `<label>Auto-reply to new tickets <span>On</span><Switch/></label>`
6. switch-brand-track NEVER Color the on track; it stays brand. Because a colored track reads as a status, good or bad, when it only means the setting is on.
   - Correct: `<Switch/>`
   - Wrong: `<Switch className="data-checked:bg-[var(--hue-5-mark)]"/>`
7. switch-one-per-row SHOULD Put one switch per row and split past 12 rows with a heading.
   - Correct:
     ```tsx
     <Row>Auto-reply to new tickets<Switch/></Row>
     <Row>Notify me about escalations<Switch/></Row>
     ```
   - Wrong: `<Row>Auto-reply <Switch/> Notify <Switch/></Row>`
8. switch-invalid-rare SHOULD Disable a switch that cannot be on and say why in text; use aria-invalid rarely.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `checked / defaultChecked` | `boolean` | `false` | On or off. |
| `onCheckedChange` | `(checked, details) => void` |  | Save here; the change applies now. |
| `pending` | `boolean` |  | Save in flight: thumb dims, aria-busy, flips ignored. |
| `size` | `'sm' \| 'default'` | `'default'` | 16 by 28px or 20 by 36px; hit area adds 4px at each side and 6px above and below. |
| `aria-invalid` | `boolean` | `false` | Turns the edge to the fail line. |
| `disabled, readOnly, name, value` | `Base UI` |  | readOnly is forced on while pending. |
Other props pass through to the root element.

## Variants and states
- size: sm, default
- states: off, on, hover, pressed, focus-visible, pending, invalid, disabled, read-only

## Accessibility
- [ ] The root is role="switch" with aria-checked, named by the wrapping label.
- [ ] Pending sets aria-busy and aria-readonly.
- [ ] Space and Enter flip it and are ignored while pending; focus stays.
- [ ] The thumb is presentational.
- [ ] Forced colors draw a CanvasText border; on fills with Highlight; disabled is GrayText.
- [ ] Say read-only in the row text; it has no other visual cue.

## Edge cases
- 120-character label in 320px -> The label wraps and the switch keeps its size at the end of the row.
- Right to left -> On moves the thumb to the left, the end of the line.
- Zoom 200% -> The switch stays fixed px; the label grows beside it.
- Slow save -> The thumb stays dimmed while the save runs and further flips are ignored.
- On the inverse surface -> Brand and paper flip; the shape holds.
- No label -> Announced as switch, on, with no name.
- Five clicks during a save -> One flips; the rest are ignored, so one save runs.
- Save never returns -> Stays dimmed; the caller times it out and reverts.
- Reduced motion -> The thumb jumps with no transition; pending is a still 50% dim.

## Tokens
--faint-fg, --brand, --switch-off, --surface-page, --fail-line, --radius-full, --text-disabled, --surface-pressed, --dur-fast, --ease-step

## Related
- [Checkbox](/components/checkbox.md): One option on or off, with a mixed state.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
