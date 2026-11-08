---
name: Button
system: iota
source: quartz
kind: component
import: "import {Button, ButtonSize, buttonVariants, useNameCheck} from '@/components/iota/ui/button'"
install: "npx shadcn@latest add {{SITE}}/r/button.json"
registryDependencies: [icon, kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/button
---

# Button

Starts an action, like running an agent or saving a change.

## Variants
- **Primary**: the one next step in a view, in brand blue.
- **Secondary**: the quiet default beside it.
- **Ghost**: no surface until hover, for skipping or stepping aside.
- **With icon**: an icon on the left of the label. Copy is this, and its label morphs when it confirms.
- **Icon only**: the arrow on a send button is the model. It needs an aria-label.
- **Group**: joined buttons, with an optional split menu.
- **Bulk actions**: a bar of actions for the rows a person has selected.

The site shows the common ones. The full set, including `destructive` and `link`, is under Variants and states.

## One button
Every button in iOTA is this component.

- Skins: `primary` (brand), `secondary`, `ghost`. `destructive` and `link` exist for confirmations and inline actions.
- Icon only: `size="icon"`, `icon-xs`, `icon-sm` or `icon-lg`, with an `aria-label`. A send button is this with the send glyph.
- Selected rows: `BulkActionBar` and `BulkAction` from `@/components/iota/ui/bulk-action-bar`.
- Joined: wrap buttons in `ButtonGroup` from `@/components/iota/ui/button-group`; `ButtonGroupMenu` makes the split menu.

```tsx
<Button aria-label="Send" size="icon"><Icon icon={ArrowUp}/></Button>
<ButtonGroup>
  <Button>Export</Button>
  <ButtonGroupMenu label="More export options">
    <ButtonGroupMenuItem>Export as GIF</ButtonGroupMenuItem>
  </ButtonGroupMenu>
</ButtonGroup>
```

## Use when
- The person changes something: create, save, publish, refund, delete.
- A row or toolbar repeats one small action on every item.
- A single filter stays on until turned off (pressed mode).

## Don't use when
- The control turns a setting on or off at once. Use [Switch](/components/switch.md).
- The person picks one of two to five views. Use [Segmented control](/components/segmented-control.md).
- More than three actions compete for one row. Use [Dropdown menu](/components/dropdown-menu.md).

## Minimal example
```tsx
<Button variant="primary" onClick={publish}>Publish prompt</Button>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. button-one-primary MUST Use one variant="primary" per view; make every other button secondary or ghost. Because the brand fill marks the next step, so a view has one; primary is the default variant, and two bare Buttons give the view two brand fills and no clear next step.
   - Correct:
     ```tsx
     <Button variant="secondary">Save</Button>
     <Button>Publish</Button>
     ```
   - Wrong:
     ```tsx
     <Button>Save</Button>
     <Button>Publish</Button>
     ```
2. button-destructive-written MUST Show destructive with variant="destructive", a fail edge and fail text; never a red fill. Because a red fill is the loudest shape on the page and outshouts the primary; trouble is written, not painted.
   - Correct: `<Button variant="destructive">Revoke key</Button>`
   - Wrong: `<Button className="bg-fail">Delete</Button>`
3. button-pending-not-swap MUST Set pending and pendingLabel; never swap the children while an action runs. Because swapped children change the width and the accessible name mid-press, while pendingLabel shares the idle label's cell.
   - Correct: `<Button pending={saving} pendingLabel="Saving">Save</Button>`
   - Wrong: `<Button>{saving ? 'Saving' : 'Save'}</Button>`
4. button-pending-from-start MUST Pass pending as a boolean from the first render on any button that can pend. Because Button reserves the spinner's room only when pending is defined, so undefined then true makes the box jump.
   - Correct: `<Button pending={saving}>Save</Button>`
   - Wrong: `<Button pending={saving || undefined}>Save</Button>`
5. button-icon-name MUST Give every icon size an aria-label. Because the button holds only a glyph, so a screen reader announces "button" and the dev check logs an error.
   - Correct: `<Button size="icon-sm" aria-label="Remove key"><Icon icon={TrashCan}/></Button>`
   - Wrong: `<Button size="icon-sm"><Icon icon={TrashCan}/></Button>`
6. button-submit-type MUST Set type="submit" on the Button that submits a form. Because Base UI defaults to type="button", so the press and Enter in a field never submit the form.
   - Correct: `<form onSubmit={save}><Button type="submit">Save</Button></form>`
   - Wrong: `<form onSubmit={save}><Button>Save</Button></form>`
7. button-link-not-wrapped NEVER Wrap a Button in an `<a>`. Use Link, or render the Button as an anchor. Because a button inside a link is invalid HTML, takes two tab stops and announces as both a link and a button.
   - Correct: `<Link variant="standalone" href="/conversations">View conversations</Link>`
   - Wrong: `<a href="/conversations"><Button>View conversations</Button></a>`
8. button-link-no-arrow NEVER Pass arrow to a variant="link" Button; it acts on this page, and only an external Link carries an arrow. Because an arrow ending link text breaks anti-slop-no-arrow-links and reads as leaving the page.
   - Correct: `<Button variant="link" onClick={showMore}>Show 12 more</Button>`
   - Wrong: `<Button variant="link" arrow onClick={showMore}>Show 12 more</Button>`
9. button-classname-placement MUST Pass only placement classes in className, never fills, colors or heights. Because a hand-set fill skips the variant's hover, disabled and forced-colors states, and a fixed height clips text at 200% zoom.
   - Correct: `<Button variant="destructive">Delete</Button>`
   - Wrong: `<Button className="bg-fail text-white h-10">Delete</Button>`
10. button-disabled-reason SHOULD Say why a button is disabled in text beside it, not in a tooltip on it. Because a disabled button takes no hover on touch, so a tooltip on it never shows there.
   - Correct:
     ```tsx
     <Button disabled focusableWhenDisabled aria-describedby="hint">Save</Button>
     <p id="hint">Name is required</p>
     ```
11. button-verb-label SHOULD Label with a verb and its object in sentence case, 40 characters or fewer.
   - Correct: `<Button>Create key</Button>`
   - Wrong: `<Button>OK</Button>`
12. button-row-wraps SHOULD Let a row of buttons wrap with flex-wrap; buttons never shrink. Because Button is shrink-0 and whitespace-nowrap, so a row that cannot wrap overflows a narrow column.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link'` | `'primary'` | The job, not the look. |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg' \| 'icon-xs' \| 'icon-sm' \| 'icon' \| 'icon-lg'` | `'default'` | xs (24px) is the action in a 40px header. Icon sizes are square and need aria-label. |
| `ButtonSize size` | `'xs' \| 'sm' \| 'default'` |  | Wrapper: every Button inside takes this size unless it sets its own. A frame header uses xs, a footer sm. |
| `pending` | `boolean` |  | Keeps the name and box, blocks presses, sets aria-busy. |
| `pendingLabel` | `ReactNode` |  | The -ing verb shown while pending. Not announced. |
| `arrow` | `boolean` | `false` | Arrow after the label, for a next step such as Continue. Flips in RTL. |
| `pressed` | `boolean` |  | Pressed mode: renders aria-pressed. Also defaultPressed, onPressedChange. |
| `kind` | `'agent' \| 'key' \| 'run' \| 'deploy' \| 'model'` |  | Pressed mode: sets data-kind for what is inside; the fill stays brand. |
| `focusableWhenDisabled` | `boolean` | `false` | Keeps a disabled button in the tab order. |
| `render` | `ReactElement` |  | Renders another element. Set nativeButton={false}. |
| `className` | `string` |  | Placement only: margin, grid area, width in a layout. |
Other props pass through to the root element.

## Variants and states
- variant: primary, secondary, ghost, destructive, link
- size: xs, sm, default, lg, icon-xs, icon-sm, icon, icon-lg
- states: rest, hover, focus-visible, active, disabled, pending, pressed

## Accessibility
- [ ] Focus shows a 2px brand outline on :focus-visible, on every variant.
- [ ] Name icon sizes with aria-label; the glyph is aria-hidden.
- [ ] Pending sets aria-busy and keeps the idle name.
- [ ] Pressed mode renders aria-pressed; the pressed fill is brand.
- [ ] Report results in a role="status" region, never in the label.

## Edge cases
- Long label -> Never wraps; the box grows past its container. Keep labels under 40 characters.
- Row narrower than its buttons -> Buttons never shrink. Wrap the row with flex-wrap.
- Right to left -> Layout mirrors and the arrow flips.
- Zoom 200% -> Height grows with the text; the label stays inside.
- Slow request -> The box keeps its width, focus stays, repeats are blocked.
- Failed request -> Returns to rest with its name; report the error in a status region.
- Empty or unnamed icon button -> Development builds log it and set data-unnamed.
- Held Enter or double click -> Pending blocks repeats; the handler needs no guard.
- Inside a form -> Presses submit only with type="submit".
- Forced colors -> Non-link variants draw a ButtonText border; the focus outline survives.
- Disabled primary -> Fades the whole key with --dim-opacity, since an brand fill has no quieter colour that still reads as a button; the other variants keep their fill and set the label to text-disabled.
- Reduced motion -> No press scale; the spinner stays as a still ring.

## Tokens
--ink, --button-primary-hover, --button-ghost, --button-ghost-hover, --line-control, --line-frame, --fail-line, --fail-text, --fail-wash, --text-inverse, --text-disabled, --dim-opacity, --surface-inverse, --surface-pressed, --elev-control, --key-primary-body, --key-primary-body-hover, --key-primary-edge, --key-primary-edge-press, --key-primary-sheen, --key-secondary-body, --key-secondary-body-hover, --key-secondary-edge, --key-secondary-edge-press, --control-xs, --control-sm, --control, --control-lg, --radius-soft, --line-focus, --border-focus, --focus-offset, --dur-fast, --dur-press, --ease-step


- [Copy button](/components/copy-button.md): Copies a value and confirms in place.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
- [Switch](/components/switch.md): A setting that applies immediately.
- [Dropdown menu](/components/dropdown-menu.md): Actions from a trigger or a right click.
