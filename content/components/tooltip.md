---
name: Tooltip
system: iota
kind: component
import: "import {Tooltip, TooltipTrigger, TooltipContent, TooltipChip, TooltipProvider, TooltipShortcut, tooltipPopupClass, tooltipMotionClass} from '@/components/iota/ui/tooltip'"
install: "npx shadcn@latest add {{SITE}}/r/tooltip.json"
registryDependencies: [children, kbd, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/tooltip
---

# Tooltip

Names an icon button on hover or focus.

## Use when
- An icon button whose glyph alone may be read two ways: reassign or refresh, archive or download.
- Showing the keyboard shortcut for a button that already has a name.
- A toolbar of icon buttons, inside one TooltipProvider.

## Don't use when
- The text explains a term or a rule the person needs. Use [Popover](/components/popover.md).
- The text says why a button is disabled. Use [Field](/components/field.md).
- The content has a link, a button or more than one sentence. Use [Popover](/components/popover.md).

## Minimal example
```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon-sm"/>}><Icon icon={Copy}/></TooltipTrigger>
  <TooltipContent shortcut={['⌘', 'C']}>Copy ticket ID</TooltipContent>
</Tooltip>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. tooltip-names-icon-button MUST Let the tooltip name an icon-only trigger, or give the button an aria-label with the same words. Because a different aria-label has a screen reader say "Copy" while the eye reads "Copy ticket ID".
   - Correct:
     ```tsx
     <TooltipTrigger render={<Button size="icon-sm"/>}>...</TooltipTrigger>
     <TooltipContent>Copy ticket ID</TooltipContent>
     ```
   - Wrong: `<Button size="icon-sm" aria-label="Copy"/> with tooltip "Copy ticket ID"`
2. tooltip-verb-object MUST Write a verb and its object in sentence case under 32 characters, no period. Because the label becomes the trigger's accessible name, and a sentence wraps into a block that covers the row.
   - Correct: `<TooltipContent>Copy ticket ID</TooltipContent>`
   - Wrong: `<TooltipContent>This button copies the ID of the ticket to your clipboard.</TooltipContent>`
3. tooltip-shortcut-prop MUST Pass a shortcut as shortcut={['⌘', 'C']}, one string per key; never type it into the label. Because typed in, "(⌘C)" joins the trigger's accessible name and is read aloud as part of what the button does.
   - Correct: `<TooltipContent shortcut={['⌘', 'C']}>Copy ticket ID</TooltipContent>`
   - Wrong: `<TooltipContent>Copy ticket ID (⌘C)</TooltipContent>`
4. tooltip-label-only NEVER Put a link, a button or a sentence of help in a tooltip; use a Popover. Because a tooltip never opens on touch and closes as the pointer moves to the link, so nobody can press it.
   - Correct: `<PopoverInfo title="Token budget">...</PopoverInfo>`
   - Wrong: `<TooltipContent>Learn more about tokens <a href="/docs">here</a></TooltipContent>`
5. tooltip-disabled-reason-visible MUST Show why a button is disabled as text beside it with aria-describedby; never in a tooltip. Because a tooltip never opens on touch, so a phone user meets a dead Publish button with no reason.
   - Correct:
     ```tsx
     <Button disabled focusableWhenDisabled aria-describedby="r">Publish</Button>
     <p id="r">Add a model before publishing.</p>
     ```
   - Wrong:
     ```tsx
     <Tooltip><TooltipTrigger render={<span tabIndex={0}/>}><Button disabled>Publish</Button></TooltipTrigger><TooltipContent>Add a model first</TooltipContent></Tooltip>
     ```
6. tooltip-not-on-text NEVER Add a tooltip to a button that already has a text label, unless it adds a shortcut. Because it repeats the label in a popup that covers the next control and says nothing new.
   - Correct: `<TooltipContent shortcut={['⌘', '⏎']}>Publish</TooltipContent>`
   - Wrong: `<Tooltip><TooltipTrigger render={<Button>Publish</Button>}/><TooltipContent>Publish</TooltipContent></Tooltip>`
7. tooltip-provider-toolbar SHOULD Wrap three or more icon buttons in one row in a single TooltipProvider.
   - Correct: `<TooltipProvider>{tools.map(t => <Tooltip>...</Tooltip>)}</TooltipProvider>`
   - Wrong: `{tools.map(t => <TooltipProvider><Tooltip>...</Tooltip></TooltipProvider>)}`
8. tooltip-toolbar-roving MUST Build a role="toolbar" row on Base UI Toolbar with Toolbar.Button triggers, or drop the role. Because role="toolbar" tells a screen reader user to move with arrow keys, and a plain div ignores them.
   - Correct:
     ```tsx
     <Toolbar.Root aria-label="Ticket actions">{tools.map(t => <Tooltip><TooltipTrigger render={<Toolbar.Button render={<Button/>}/>}/>...</Tooltip>)}</Toolbar.Root>
     ```
   - Wrong: `<div role="toolbar">{tools.map(t => <Tooltip>...</Tooltip>)}</div>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `TooltipContent children` | `string (plus a TooltipShortcut)` |  | Other elements are dropped with a development error. |
| `TooltipContent shortcut` | `string[]` |  | One string per key. |
| `TooltipContent side, align, sideOffset` | `Base UI` | `'top', 'center', 6` | Where the tooltip sits; it flips on collision. |
| `TooltipProvider delay / closeDelay` | `number` | `500 / 0` | Shared by every tooltip inside. |
| `Tooltip open, defaultOpen, onOpenChange` | `Base UI` |  | Control it only for a docs or test harness. |
| `TooltipTrigger render` | `ReactElement` |  | Usually <Button size="icon-sm"/>. |
Other props pass through to the root element.

## Variants and states
- shortcut: none, keys
- side: top, bottom, right, left
- states: closed, delayed open, instant open, named trigger

## Accessibility
- [ ] The tooltip is visual only; the trigger carries its own name, written from the tooltip when none exists.
- [ ] Focus opens the tooltip at once; hover opens it after 500ms.
- [ ] Moving to the next trigger inside one TooltipProvider opens it with no delay and no fade.
- [ ] Escape closes the tooltip and nothing else; Enter or Space runs the button and closes it.
- [ ] The popup and the shortcut keys are not announced.
- [ ] Touch never opens a tooltip; the trigger is still named.
- [ ] Forced colors give the chip and each key a 1px outline.

## Edge cases
- 120-character label -> Wraps inside 256px and breaks anywhere.
- Toolbar of four -> The first opens after 500ms, the rest at once with no fade.
- Right to left -> The chip computes RTL and the shortcut sits at the inline end.
- Touch -> Tap runs the button and never opens the tooltip.
- One-letter label -> Renders a 24px chip and names the trigger R. Write a verb phrase.
- Empty label -> Renders nothing and names nothing.
- Link or button as a child -> Dropped with a development error.
- Near a viewport edge -> Flips or shifts to stay 8px inside.
- Inside a dialog -> Portals above it; Escape closes the tooltip only.
- Reduced motion -> It cuts in; it never grew.

## Tokens
--surface-page, --text-1, --radius-soft, --radius-inner, --type-label-sm, --elev-overlay, --dur-fast, --ease-step, --text-2, --type-tag, --tooltip-max

## Related
- [Popover](/components/popover.md): Anchored rich content, including the info toggletip and the hover preview.
- [Kbd](/components/kbd.md): A key or a shortcut.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
