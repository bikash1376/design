---
name: Sheet
system: iota
source: quartz
kind: component
import: "import {Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription, SheetAction, SheetSection, SheetField, useSheet, useScrollFade, fadeClass} from '@/components/iota/ui/sheet'"
install: "npx shadcn@latest add {{SITE}}/r/sheet.json"
registryDependencies: [button, direction, icon, kind, overlay, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/sheet
---

# Sheet

Slides in a panel to edit one thing in place.

## Use when
- Editing one item from a list the person wants in mind: an agent, an integration.
- Showing the details of the selected row next to its list (docked).
- Navigation or a few actions on a phone, from the left or the bottom.

## Don't use when
- A yes or no question, or a form of up to three fields. Use [Dialog](/components/dialog.md).
- Content of a few lines next to its control. Use [Popover](/components/popover.md).
- The panel is the main subject of the page. Use a route.

## Minimal example
```tsx
<Sheet>
  <SheetTrigger render={<Button variant="secondary"/>}>Edit agent</SheetTrigger>
  <SheetContent side="end">
    <SheetHeader><SheetTitle>Edit support-agent</SheetTitle></SheetHeader>
    <SheetBody>...</SheetBody>
    <SheetFooter><SheetClose>Cancel</SheetClose><SheetAction>Save</SheetAction></SheetFooter>
  </SheetContent>
</Sheet>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. sheet-shell MUST Follow the dialog shell: grey outer with a quiet frame line, one white card 4px in that holds the title, description and close and goes on as the body, and the actions on the grey. Because the grey gives the actions a ground of their own, and the white card is the one group that carries the heading and the rows, so the frame never needs a rule under its header.
   - Correct: `<SheetContent><SheetHeader/><SheetBody>…</SheetBody></SheetContent>`
   - Wrong: `<SheetContent><div className="p-4">…</div></SheetContent>`
2. sheet-no-white-in-shell NEVER Put a white Card inside a sheet; the inset is the only white surface inside it. Because a white card inside the sheet's grey is a second box in the box.
   - Correct: `<SheetBody><SheetSection/></SheetBody>`
   - Wrong: `<SheetBody><Card/></SheetBody>`
3. sheet-title-names-item MUST Title the sheet with the item's name or ID and put context in the description. Because the title is the sheet's accessible name, so "Details" tells a screen reader nothing about which ticket is open.
   - Correct:
     ```tsx
     <SheetTitle>tkt_4812</SheetTitle>
     <SheetDescription>Maya Chen, opened 4 minutes ago</SheetDescription>
     ```
   - Wrong: `<SheetTitle>Details</SheetTitle>`
4. sheet-body-scrolls MUST Put the middle in SheetBody; it is the only part that scrolls and fades. Because SheetBody is the only part that scrolls and fades, so without it the footer scrolls off with the fields.
   - Correct: `<SheetContent><SheetHeader/><SheetBody>...</SheetBody><SheetFooter/></SheetContent>`
   - Wrong: `<SheetContent><div>...60 fields...</div><SheetFooter/></SheetContent>`
5. sheet-docked-for-selection SHOULD Use modal={false} with stackBelow for the details of a selected row; a modal sheet hides the list.
   - Correct: `<Sheet modal={false} open={!!selected}><SheetContent stackBelow="3xl">...`
   - Wrong: `<Sheet open={!!selected}><SheetContent>...</SheetContent></Sheet>`
6. sheet-width-persist SHOULD Store the width from onWidthChange per surface and pass it back as defaultWidth on a resizable docked panel.
   - Correct: `<SheetContent defaultWidth={stored ?? 360} onWidthChange={store}/>`
7. sheet-bottom-actions-lg MUST Give actions in a side="bottom" sheet size="lg" (44px). Because a bottom sheet is the phone layout, and a 28px sm button is under the 44px thumb target.
   - Correct: `<SheetAction size="lg">Reassign</SheetAction>`
   - Wrong: `<SheetAction size="sm">Reassign</SheetAction>`
8. sheet-field-mono-ids SHOULD Pass mono to SheetField for an ID, hash or URL.
   - Correct: `<SheetField label="Trace" mono>trc_5d1e0c9b7a2f</SheetField>`
   - Wrong: `<SheetField label="Trace">trc_5d1e0c9b7a2f</SheetField>`
9. sheet-docked-opener MUST Open a docked panel with SheetTrigger, or close it with SheetClose, so Escape can return focus. Because the docked panel returns focus to the element SheetTrigger registered, so a plain button leaves focus lost on Escape.
   - Correct: `<SheetTrigger render={<Button variant="secondary"/>}>Show details</SheetTrigger>`
   - Wrong: `<button onClick={() => setOpen(true)}>Show details</button>`
10. sheet-no-border-docked NEVER Add border-l to a docked panel; it is already a frame in the layout. Because the docked panel draws its own frame line, and a border on top doubles the edge.
   - Correct: `<SheetContent>`
   - Wrong: `<SheetContent className="border-l">`
11. sheet-no-scroll-library NEVER Wrap the body in a scroll library; SheetBody has native overflow and a fade. Because a second scroller inside SheetBody hides the edge fade and gives the keyboard two scroll areas.
   - Correct: `<SheetBody><Fields/></SheetBody>`
   - Wrong: `<ScrollArea><Fields/></ScrollArea>`
12. sheet-docked-min SHOULD Keep minWidth at 280px or more and stack under 3xl of the container.
   - Correct: `<SheetContent minWidth={280} stackBelow="3xl"/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Sheet modal` | `boolean` | `true` | false docks it in the layout. |
| `Sheet open / defaultOpen / onOpenChange` | `boolean, (open) => void` | `false` | Controlled or not. |
| `SheetContent side` | `'start' \| 'end' \| 'top' \| 'right' \| 'bottom' \| 'left'` | `'end'` | Also the swipe direction. start and end follow the reading direction. Docked takes start or end. |
| `SheetContent showCloseButton` | `boolean` | `true` | false for side="bottom". |
| `SheetContent kind` | `Kind` |  | Sets data-kind, so a Badge or Status inside takes the kind's hue. |
| `SheetContent defaultWidth / minWidth / maxWidth` | `number` | `360 / 280 / 640` | Docked only. |
| `SheetContent onWidthChange` | `(width) => void` |  | Docked only. |
| `SheetContent stackBelow` | `'md' to '5xl'` |  | Docked: full width under that container size. |
| `SheetFooter defaultAction` | `'primary' \| 'dismiss' \| 'none'` | `auto` | As in Dialog. |
| `SheetAction onAction` | `() => void \| Promise` |  | A promise holds the sheet open; a rejection shows above the footer. |
| `SheetField mono` | `boolean` | `false` | IDs and hashes. |
Other props pass through to the root element.

## Variants and states
- side: end, start, bottom, top
- modal: true, false
- states: closed, open modal, pending, failed, swiping, open docked, resizing, scrolled, stacked

## Accessibility
- [ ] A modal panel is role="dialog" with aria-modal, named by SheetTitle; the page behind is inert and Tab stays inside.
- [ ] A docked panel is an aside named by SheetTitle; it does not trap focus.
- [ ] Escape closes it, a menu or popover inside closes first, and nothing closes while an action is pending.
- [ ] Focus returns to the trigger on close.
- [ ] The docked handle is role="separator" with aria-valuenow, min, max; arrows move 32px, Shift 8px, Home and End jump, Enter resets.
- [ ] The body is a tab stop only while it has more to scroll.
- [ ] A rejected onAction shows a role="alert" message above the footer.

## Edge cases
- 60 fields -> The body scrolls inside; header and footer stay; the fade shows only at an edge with more.
- Slow save -> The action shows pending, Escape and Close wait, and the sheet stays open.
- Failed save -> The sheet stays open with the message above the footer; fields keep their input.
- Right to left -> side="end" comes from the left and swipes back to it; a docked panel takes the wrapper dir, its handle on the edge facing the list.
- Long trace ID -> A mono field breaks anywhere and wraps.
- Long title -> Wraps in the modal sheet; truncates to one line in a docked one.
- No title -> The panel is unnamed. Always render SheetTitle.
- Zoom 200% -> A docked panel stacks under the list; a modal body scrolls.
- Menu inside -> Escape closes the menu first; a docked panel ignores Escape from an open menu or dialog.
- Forced colors -> The panel gets a 1px CanvasText outline; a docked frame's line survives as CanvasText.
- Reduced motion -> Fades instead of travelling its 8px; a swipe still follows the finger.

## Tokens
--surface-overlay, --surface-page, --elev-overlay, --overlay, --space-10, --radius-soft, --radius-frame, --line-frame, --line-row, --line-control, --accent-mark, --dur-slow, --dur-base, --sheet-shift, --ease-step, --ink, --dur-fast, --surface-inverse, --text-inverse, --type-state-word, --accent-wash, --text-1, --text-3, --type-label, --type-code-sm, --type-body-sm, --grab-size

## Related
- [Dialog](/components/dialog.md): Modal work, with alert and typed-confirm variants.
- [Popover](/components/popover.md): Anchored rich content, including the info toggletip and the hover preview.
