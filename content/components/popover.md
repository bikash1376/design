---
name: Popover
system: iota
kind: component
import: "import {Popover, PopoverTrigger, PopoverClose, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, PopoverInfo} from '@/components/iota/ui/popover'"
install: "npx shadcn@latest add {{SITE}}/r/popover.json"
registryDependencies: [button, icon, overlay, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/popover
---

# Popover

Shows a few lines or a small control anchored to what it is about.

## Use when
- A small filter, form or picker anchored to its button.
- A hover preview of the thing a link points to.
- The explanation of a term beside it (PopoverInfo).

## Don't use when
- A list of actions. Use [Dropdown menu](/components/dropdown-menu.md).
- A one-line label on an icon. Use [Tooltip](/components/tooltip.md).
- Content that needs the whole page or a decision. Use [Dialog](/components/dialog.md).
- Content taller than 320px. Use [Sheet](/components/sheet.md).

## Minimal example
```tsx
<Popover>
  <PopoverTrigger render={<Button variant="secondary"/>}>Filter runs</PopoverTrigger>
  <PopoverContent align="start">
    <PopoverHeader><PopoverTitle>Status</PopoverTitle></PopoverHeader>
  </PopoverContent>
</Popover>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. popover-info-not-tooltip MUST Use PopoverInfo for an info icon that explains a term, never a Tooltip. Because a tooltip never opens on touch and closes when the pointer leaves, so the definition is unreadable on a phone.
   - Correct: `<PopoverInfo title="Token budget">The most tokens...</PopoverInfo>`
   - Wrong:
     ```tsx
     <Tooltip><TooltipTrigger><Icon icon={Info}/></TooltipTrigger><TooltipContent>The most tokens...</TooltipContent></Tooltip>
     ```
2. popover-info-label MUST Pass title (it names the button `About <title>`) or label to PopoverInfo. Because without either every info button is named "More information" and a screen reader cannot tell them apart.
   - Correct: `<PopoverInfo title="Token budget">The most tokens...</PopoverInfo>`
   - Wrong: `<PopoverInfo>The most tokens...</PopoverInfo>`
3. popover-info-text-only MUST Write plain text only in a PopoverInfo; put a link next to the term or use a Popover. Because focus never enters a PopoverInfo, so a link inside it cannot be reached by keyboard.
   - Correct:
     ```tsx
     Token budget <PopoverInfo title="Token budget">The cap per run.</PopoverInfo> <Link href="/docs/budget">Learn more</Link>
     ```
   - Wrong: `<PopoverInfo title="Token budget">The cap. <a href="/docs">Learn more</a></PopoverInfo>`
4. popover-hover-preview-only MUST Make an openOnHover trigger a link that works on its own, and show nothing the linked page does not. Because touch and keyboard never see a hover preview, so the trigger has to reach the same facts alone.
   - Correct:
     ```tsx
     <PopoverTrigger openOnHover nativeButton={false} render={<a href="/agents/support-agent"/>}>support-agent</PopoverTrigger>
     ```
   - Wrong: `<PopoverTrigger openOnHover render={<span/>}>support-agent</PopoverTrigger>`
5. popover-no-hover-menu NEVER Put actions in a hover preview. Move them to a DropdownMenu or the linked page. Because a peek closes when the pointer leaves and never opens on touch, so the actions slip away or never appear.
   - Wrong: `<PopoverContent><Button size="sm">Pause agent</Button><Button size="sm">Delete</Button></PopoverContent>`
6. popover-close-after-commit SHOULD Apply a choice on change and keep the popover open, with a PopoverClose "Done" for touch.
7. popover-preview-facts SHOULD Lead a preview with the name, one line of what it is, then 2 to 4 facts with numbers.
8. popover-info-length SHOULD Keep a PopoverInfo to 1 or 2 sentences under 200 characters, with the term as its title.
9. popover-no-arrow NEVER Add an arrow. Keep the arrowless paper panel 6px off the anchor. Because the 6px offset and overlay shadow already tie the panel to its trigger, and an arrow misses the forced-colors frame.
   - Correct: `<PopoverContent sideOffset={6}>...`
   - Wrong: `<PopoverContent><Popover.Arrow/>...`
10. popover-height SHOULD Let content scroll inside --available-height and move content past 320px tall into a Sheet.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Popover open, defaultOpen, onOpenChange` | `Base UI` | `false` | A pin cancels the close event. |
| `PopoverTrigger openOnHover` | `boolean` | `false` | Peek, then pin on a press inside. |
| `PopoverTrigger delay, closeDelay` | `number` | `600, 300` | Only with openOnHover. |
| `PopoverContent side, align, sideOffset` | `Base UI` | `'bottom', 'center', 6` | Where the panel sits; it flips on collision. |
| `PopoverContent collisionPadding` | `number` | `16` | Pixels kept clear of the viewport edge. |
| `PopoverInfo title` | `ReactNode` |  | First line; a string also names the button. |
| `PopoverInfo label` | `string` | `'About ' + title` | Names the info button when there is no title. |
| `PopoverInfo side, align` | `Base UI` | `'top', 'center'` | Where the toggletip opens. |
Other props pass through to the root element.

## Variants and states
- opening: click, openOnHover, PopoverInfo
- states: closed, open, peeking, pinned, info-open

## Accessibility
- [ ] Enter or Space on the trigger opens or closes it, and pins a peeking preview; Enter on a hover-preview link follows it.
- [ ] Tab moves through the content; leaving the panel closes it.
- [ ] Escape closes this popover only and returns focus to the trigger.
- [ ] PopoverInfo text is also the button description; the button is named `About <title>`.
- [ ] Hover previews never peek on touch; PopoverInfo opens by tap.

## Edge cases
- Long content and trace ID -> The title breaks; the panel scrolls inside the available height.
- Hover preview -> Waits 600ms, peeks without focus, closes when the pointer leaves; a press inside pins it.
- Opened at a screen edge -> The panel shifts and flips to stay 16px inside.
- Right to left -> The panel computes rtl inside an RTL portal scope.
- Empty content -> Opens a 32px padded box; nothing is announced but "dialog".
- Slow save inside -> A click outside still dismisses it; the save keeps running.
- Ten clicks on the trigger -> It toggles ten times and ends where the count says.
- Inside a Dialog -> Escape closes the popover first; focus returns to its trigger.
- Zoom 200% -> The panel stays 288px and wraps.

## Tokens
--surface-page, --elev-overlay, --radius-frame, --popover, --space-4, --dur-base, --dur-fast, --ease-step, --type-label, --type-body-sm, --text-1, --text-2, --text-3, --popover-sm

## Related
- [Tooltip](/components/tooltip.md): Names an icon button or shows a shortcut; never holds anything essential.
- [Dropdown menu](/components/dropdown-menu.md): Actions from a trigger or a right click.
- [Dialog](/components/dialog.md): Modal work, with alert and typed-confirm variants.
- [Sheet](/components/sheet.md): A panel from an edge, modal or docked.
