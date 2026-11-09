---
name: Command
system: iota
kind: component
import: "import {Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandLoading, CommandGroup, CommandItem, CommandLabel, CommandShortcut, CommandSeparator, CommandFooter, CommandHint, useCommand} from '@/components/iota/ui/command'"
install: "npx shadcn@latest add {{SITE}}/r/command.json"
registryDependencies: [dialog, empty-state, icon, kbd, overlay, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/command
---

# Command

Finds and runs any action by typing part of its name.

## Use when
- An app has more actions and items than its navigation shows: Cmd K for everything.
- Picking one of many named things where typing is faster than scrolling: an agent, a workspace.

## Don't use when
- Three to twelve actions on one item. Use [Dropdown menu](/components/dropdown-menu.md).
- Choosing a value for a form field. Use [Combobox](/components/combobox.md).
- Filtering a table that stays on screen. Use [Filter bar](/components/filter-bar.md).

## Minimal example
```tsx
<Command>
  <CommandInput placeholder="Search commands and agents"/>
  <CommandList>
    <CommandEmpty/>
    <CommandGroup heading="Agents"><CommandItem>support-agent</CommandItem></CommandGroup>
  </CommandList>
</Command>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. command-keywords SHOULD Pass keywords with the other names people use, such as ['ship', 'release'] for Publish prompt release.
   - Correct: `<CommandItem keywords={['ship', 'release']}>Publish prompt release</CommandItem>`
   - Wrong: `<CommandItem>Publish prompt release</CommandItem>`
2. command-server-loading MUST Set shouldFilter={false} and mount CommandLoading while a server request runs. Because the client filter hides server results whose text lacks the query, and without CommandLoading the list says No results while the request runs.
   - Correct: `<Command shouldFilter={false}>…{loading && <CommandLoading/>}…</Command>`
   - Wrong: `<Command><CommandList>{results.map(…)}</CommandList></Command>`
3. command-label-part MUST Wrap item text in CommandLabel when the item holds an icon or shortcut. Because only a string child gets its matched letters drawn, so a mixed item shows no reason it matched.
   - Correct: `<CommandItem value="Create agent"><Icon icon={Plus}/><CommandLabel>Create agent</CommandLabel></CommandItem>`
   - Wrong: `<CommandItem><Icon icon={Plus}/>Create agent</CommandItem>`
4. command-item-verb SHOULD Start an action with its verb and name things by their own name; ranking favours the first word.
   - Correct: `<CommandItem>Create agent</CommandItem>`
   - Wrong: `<CommandItem>Agent creation</CommandItem>`
5. command-placeholder SHOULD Say what can be found in the placeholder, such as "Search commands and agents".
   - Correct: `<CommandInput placeholder="Search commands and agents"/>`
   - Wrong: `<CommandInput placeholder="Type here…"/>`
6. command-dialog-title MUST Give CommandDialog a specific title. Because the sr-only title names the dialog, and the default "Command palette" does not say what it searches.
   - Correct: `<CommandDialog title="Search commands and agents">`
   - Wrong: `<CommandDialog title="">`
7. command-no-fuzzy-soup NEVER Swap in a loose fuzzy matcher. Because scattered-letter matches rank unrelated items first, and Enter runs the first item.
   - Correct: `<Command>`
   - Wrong: `<Command filter={fuzzyScore}>`
8. command-no-icons-everywhere SHOULD Give every item in a group an icon or none, only from the allowed action set (see Iconography), and none to named things such as agents.
   - Correct: `The same icon rule across a group, none on the agents`
   - Wrong: `Icons on half the actions, or on the agents`
9. command-list-height SHOULD Keep the list at 320px and filter on the server past 500 items.
   - Correct: `shouldFilter={false} and a server search`
   - Wrong: `5,000 tickets in one Command`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Command label` | `string` | `'Commands'` | Names the search field and the list; not shown. |
| `Command shouldFilter` | `boolean` | `true` | false for server results. |
| `Command filter` | `(value, search, keywords) => number` | `ranked word match` | Above 0 shows; higher ranks first. |
| `Command loop` | `boolean` | `false` | Wrap at the ends. |
| `CommandInput value, onValueChange` | `string` |  | Controlled search. |
| `CommandItem value, keywords` | `string, string[]` | `text content` | What the filter matches. |
| `CommandItem onSelect` | `(value) => void` |  | Enter or a click. |
| `CommandItem disabled, forceMount` | `boolean` | `false` | forceMount keeps the item when the filter misses. |
| `CommandDialog title, description` | `ReactNode \| null` | `'Command palette'` | sr-only; null leaves one out when the children render their own. |
Other props pass through to the root element.

## Variants and states
- placement: inline, dialog
- filtering: built in, by your server
- states: rest, active item, searching, empty, loading, disabled item

## Accessibility
- [ ] The input is a combobox with aria-controls, aria-activedescendant and aria-autocomplete="list".
- [ ] The field and the list are named by label; the list is a listbox holding only groups and options, with aria-selected, aria-posinset and aria-setsize in screen order.
- [ ] Up and Down (Ctrl P, Ctrl N) move the active item; Home and End move it when the field is empty.
- [ ] Enter runs the active item, which after typing is the best match.
- [ ] CommandDialog traps focus, makes the page inert and closes with Escape back to the opener.
- [ ] A polite status outside the list announces the result count, including "1 result, unavailable" for a disabled match, and CommandLoading's words while it is mounted.

## Edge cases
- 72-character ID, 90-character label -> Truncates with an ellipsis on one line; the shortcut keeps its place.
- One-letter search -> Names starting with it rank first across groups, then word starts, then the rest.
- No items -> Empty shows "No results" top-left, in Empty's plain look.
- 500 items -> Scrolls inside 320px (--popup-max) with an edge fade; arrows keep the active item in view.
- Right to left -> The icon and search glyph lead on the right.
- Request never returns -> The spinner stays; Empty never shows; typing continues.
- Request fails -> Render a CommandEmpty with the error text and a retry item.
- Typing fast -> Re-ranks every key; the active item resets to the best match.
- Inside a Popover -> Escape closes the container.
- Touch -> Items grow to 44px; the input uses 16px text so iOS does not zoom.
- Forced colors -> The active item takes Highlight; disabled takes GrayText; matched letters keep their underline.
- Reduced motion -> The spinner stops and shows the static glyph.

## Tokens
--surface-page, --radius-inner, --radius-soft, --radius-frame, --line-control, --border-focus, --line-row, --surface-hover, --text-disabled, --type-label, --text-2, --text-1, --space-6, --line-frame, --type-body-sm, --text-3, --dur-spin, --ease-spin, --popup-max

## Related
- [Dropdown menu](/components/dropdown-menu.md): Actions from a trigger or a right click.
- [Combobox](/components/combobox.md): A searchable choice, single, multiple or creatable.
- [Dialog](/components/dialog.md): Modal work, with alert and typed-confirm variants.
- [Filter bar](/components/filter-bar.md): Search plus filter chips and clear-all.
