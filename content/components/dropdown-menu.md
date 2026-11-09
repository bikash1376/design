---
name: Dropdown menu
system: iota
kind: component
import: "import {ExportMenu} from '@/components/iota-app/ui/export-menu'; import {DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuLinkItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, menuPopupClass, menuItemClass, menuCheckItemClass, menuLabelClass, menuSeparatorClass, menuShortcutClass} from '@/components/iota/ui/dropdown-menu'"
install: "npx shadcn@latest add {{SITE}}/r/dropdown-menu.json"
registryDependencies: [icon, kbd, overlay, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/dropdown-menu
---

# Dropdown menu

Keeps the actions for one thing out of sight until asked for.

## Variants
- **Menu**: actions from a trigger or a right click, with groups, checks, radios and submenus.
- **Export menu**: a split button whose main half repeats the last format. The caret opens the formats, each can fold its settings open, and the label morphs through the export while the button fills.

```tsx
<ExportMenu fileName="logo" progress={progress} items={[
  {id: "svg", label: "SVG", onSelect: exportSvg},
  {id: "mp4", label: "MP4", onSelect: exportMp4},
]}/>
```

## Use when
- Three or more actions on one item compete for a row.
- A row or canvas where people expect a right click, with the same actions on a visible button.
- A few view settings toggle: columns, density, sort.

## Don't use when
- One or two actions. Use [Button](/components/button.md).
- Picking a value for a form field. Use [Select](/components/select.md).
- Finding one of many commands by name. Use [Command](/components/command.md).

## Minimal example
```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="secondary"/>}>Actions</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Reassign</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. dropdown-menu-visible-path MUST Put the same actions behind a visible More button on every row that has a contextmenu trigger. Because a right click or long press is invisible, so a person who never tries one never finds the actions.
   - Correct:
     ```tsx
     <Button size="icon-sm" aria-label="Actions for tkt_4812">...</Button>
     <DropdownMenu trigger="contextmenu">...</DropdownMenu>
     ```
   - Wrong: `<DropdownMenu trigger="contextmenu">...</DropdownMenu>`
2. dropdown-menu-destructive-last MUST Put a destructive item last, after a separator, with variant="destructive". Because a destructive item first sits under the pointer and the first arrow press, one slip from Delete.
   - Correct:
     ```tsx
     <DropdownMenuItem>Reassign</DropdownMenuItem>
     <DropdownMenuSeparator/>
     <DropdownMenuItem variant="destructive">Delete ticket</DropdownMenuItem>
     ```
   - Wrong:
     ```tsx
     <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
     <DropdownMenuItem>Reassign</DropdownMenuItem>
     ```
3. dropdown-menu-link-item MUST Use DropdownMenuLinkItem for an item that navigates, never an item with router.push. Because router.push leaves a menuitem with no href, so open in new tab and copy link do nothing.
   - Correct: `<DropdownMenuLinkItem href="/tickets/1">Open conversation</DropdownMenuLinkItem>`
   - Wrong: `<DropdownMenuItem onClick={() => router.push('/tickets/1')}>Open conversation</DropdownMenuItem>`
4. dropdown-menu-selectable SHOULD Pass selectable to a context trigger that covers text people copy.
   - Correct: `<DropdownMenuTrigger selectable render={<pre/>}>{log}</DropdownMenuTrigger>`
   - Wrong: `<DropdownMenuTrigger render={<pre/>}>{log}</DropdownMenuTrigger>`
5. dropdown-menu-icon-trigger-name MUST Name an icon trigger with the object it acts on. Because every row's trigger reads "More", so a screen reader cannot tell which row it opens.
   - Correct: `<Button size="icon-sm" aria-label="Actions for tkt_4812">`
   - Wrong: `<Button size="icon-sm" aria-label="More">`
6. dropdown-menu-item-verb SHOULD Start each item with a verb in sentence case and name the object when the menu covers several.
   - Correct: `<DropdownMenuItem>Copy ticket ID</DropdownMenuItem>`
   - Wrong: `<DropdownMenuItem>ID</DropdownMenuItem>`
7. dropdown-menu-shortcut-real SHOULD Show only shortcuts that work on the page now.
8. dropdown-menu-icons-all-or-none SHOULD Give every item in a group an icon or none, only from the allowed action set (see Iconography).
9. dropdown-menu-no-red-text NEVER Color an item red by className; use variant="destructive". Because a raw red skips the fail tokens, so its contrast on the highlight wash and in dark theme goes unchecked.
   - Correct: `<DropdownMenuItem variant="destructive">Delete ticket</DropdownMenuItem>`
   - Wrong: `<DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>`
10. dropdown-menu-length SHOULD Group a menu past 12 items with labels, or move it to a Command list with search.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `DropdownMenu.trigger` | `'click' \| 'contextmenu'` | `'click'` | contextmenu opens at the pointer and marks the row. |
| `DropdownMenu.onTargetChange` | `(row: HTMLElement \| null) => void` |  | The marked row on open, null on close. |
| `DropdownMenuTrigger.selectable` | `boolean` | `false` | Context trigger keeps text selection. |
| `DropdownMenuItem variant` | `'default' \| 'destructive'` | `'default'` | destructive goes last, after a separator. |
| `DropdownMenuItem.inset` | `boolean` | `false` | Aligns with checkbox items. |
| `DropdownMenuLinkItem.href` | `string` |  | A real link. |
| `DropdownMenuCheckboxItem / RadioItem` | `Base UI` |  | closeOnClick keeps the menu open. |
Other props pass through to the root element.

## Variants and states
- trigger: click, contextmenu
- item variant: default, destructive
- states: closed, open, highlighted, destructive-highlighted, disabled, checked, submenu-open, target-marked

## Accessibility
- [ ] Enter, Space or Down on the trigger opens with the first item highlighted; Shift+F10 opens a context menu.
- [ ] Arrows move the highlight, a letter jumps to the next match, Escape closes this menu only and returns focus to the trigger.
- [ ] Right and Left open and close a submenu, mirrored in RTL.
- [ ] The trigger carries aria-haspopup="menu" and aria-expanded; the popup is role="menu".
- [ ] A disabled item stays reachable by arrows so its label can be read; Enter does nothing.
- [ ] Checkbox and radio items render menuitemcheckbox and menuitemradio with aria-checked.

## Edge cases
- Long item label -> Wraps inside the panel, which stops at 480px or the available width.
- Right to left -> The indicator column, shortcut and caret move to logical sides.
- Touch -> Items grow to 44px; a long press opens the context menu without selecting a word.
- Sixty items -> The panel scrolls inside the space below the trigger and flips or shifts 8px at each viewport edge.
- One item -> Opens at the 192px minimum; use a Button instead.
- No items -> Do not render the trigger; an empty menu opens an 8px padded box.
- Inside a Dialog -> Escape closes the menu only.
- Failed action -> Report it in a Toast after the menu closed; the menu has no error state.
- Forced colors -> Items take Highlight, disabled takes GrayText, the marked row gets a 2px outline.
- Reduced motion -> The fade cuts; the menu never grows.

## Tokens
--surface-page, --elev-overlay, --radius-frame, --radius-inner, --space-1, --menu-min, --overlay, --dur-base, --dur-fast, --ease-step, --type-label, --type-label-sm, --text-1, --text-3, --text-disabled, --surface-hover, --accent-wash, --mark-size, --ink, --line-row

## Related
- [Command](/components/command.md): A searchable command list, the core of the command palette.
- [Select](/components/select.md): One choice from a popup list, or the native select.
- [Popover](/components/popover.md): Anchored rich content, including the info toggletip and the hover preview.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
