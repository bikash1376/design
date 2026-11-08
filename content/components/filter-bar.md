---
name: Filter bar
system: iota
source: quartz
kind: component
import: "import {FilterBar, FilterBarSearch, FilterBarChips, FilterChip, FilterToggle, FilterBarSelect, FilterBarAdd, FilterBarClear, FilterBarCount, useFilteredRows} from '@/components/iota/ui/filter-bar'"
install: "npx shadcn@latest add {{SITE}}/r/filter-bar.json"
registryDependencies: [chip, icon, input, kind, overlay, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/filter-bar
---

# Filter bar

Narrows a long list down to the rows someone came for.

## Use when
- Above a list or table of 20 or more rows that people narrow by text and by known fields.
- The person needs to see how many rows are left at every step.
- Filters combine: a status and an agent and a model at once.

## Don't use when
- Switching between two to five fixed views of the same data. Use [Segmented control](/components/segmented-control.md).
- Searching across the whole app, not one list. Use [Command](/components/command.md).
- Picking a value that a form submits. Use [Select](/components/select.md).

## Minimal example
```tsx
<FilterBar aria-label="Filter conversations">
  <FilterBarSearch value={query} onValueChange={setQuery} placeholder="Search conversations"/>
  <FilterBarSelect label="Status" multiple options={options} value={status} onValueChange={setStatus}/>
  <FilterBarCount shown={rows.length} total={conversations.length} noun="conversations"/>
</FilterBar>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. filter-bar-facet-counts MUST Pass each option count from useFilteredRows, counted against the search, the other filters and pressed toggles. Because a count against the whole list promises rows the other filters already hide, so the pick empties the table.
   - Correct: `count: counts.status[s] ?? 0`
   - Wrong: `count: all.filter(r => r.status === s).length`
2. filter-bar-count-always MUST End the bar with FilterBarCount. Because its status region is the only thing a screen reader hears when the list changes.
   - Correct: `<FilterBar><FilterBarSearch .../><FilterBarCount shown={12} total={240} noun="conversations"/></FilterBar>`
   - Wrong: `<FilterBar><FilterBarSearch .../></FilterBar>`
3. filter-bar-landmark MUST Give FilterBar an aria-label naming what it filters. Because FilterBar is a role="search" landmark, and unnamed ones read alike in the landmark list.
   - Correct: `<FilterBar aria-label="Filter conversations">`
   - Wrong: `<FilterBar>`
4. filter-bar-clear-when-set MUST Render FilterBarClear only while a filter or the search is set. Because a Clear all with nothing to clear is a dead tab stop that suggests a filter is still on.
   - Correct: `{anySet && <FilterBarClear onClick={clear}/>}`
   - Wrong: `<FilterBarClear onClick={clear}/>`
5. filter-bar-one-shortcut MUST Keep shortcut="/" on the main bar and pass shortcut={null} to every other bar on the page. Because only the first bar on the page takes "/", so a second bar shows a hint for a key that focuses another field.
   - Correct: `<FilterBarSearch shortcut={null} .../>`
   - Wrong: `<FilterBarSearch .../> {/* a second bar */}`
6. filter-bar-select-label SHOULD Name a select with the column's one-word name; the chip adds the value.
   - Correct: `<FilterBarSelect label="Status" />`
   - Wrong: `<FilterBarSelect label="Filter by status" />`
7. filter-bar-placeholder SHOULD Name the noun in the search placeholder.
   - Correct: `placeholder="Search conversations"`
   - Wrong: `placeholder="Search..."`
8. filter-bar-no-apply NEVER Add an Apply button; apply each change as it happens. Because until the press the chips say one thing and the list another, and the count announces nothing.
   - Wrong: `<FilterBar>...<Button>Apply filters</Button></FilterBar>`
9. filter-bar-no-funnel NEVER Hide filters behind a funnel icon button; put the two to four most used on the bar. Because a funnel hides which filters are set and adds a click before every pick.
   - Correct: `<FilterBarSelect label="Status" /><FilterBarSelect label="Agent" />`
   - Wrong: `<Button size="icon"><Icon icon={Filter}/></Button>`
10. filter-bar-add-one-value SHOULD Use FilterBarAdd for a log or feed whose filters are mostly off, one value per field; use FilterBarSelect for a field that takes several values or shows counts. Because the dashed chip lists what can narrow the list without spending a row on it, but it can hold only one value.
   - Correct: `<FilterBarSelect label="Status" multiple options={statuses}/>`
   - Wrong: `<FilterBarAdd label="Status" options={statuses}/> // a person needs fail and warn together`
11. filter-bar-four-selects SHOULD Keep 4 selects on the bar and move the rest behind a More filters menu.
12. filter-bar-in-table SHOULD Pass the bar to DataTable's toolbar so it shares the table's frame.
   - Correct: `<DataTable aria-label="Conversations" toolbar={() => <FilterBar>…</FilterBar>} …/>`
   - Wrong: `<FilterBar>…</FilterBar><DataTable aria-label="Conversations" …/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `FilterBar` | `div props` |  | role="search"; search, selects and toggles join one strip, the rest follows it. |
| `FilterBarChips row` | `boolean` | `false` | A 40px row inset 8px, for the chips under a frame's toolbar. |
| `FilterBarSearch value, onValueChange` | `string, (value) => void` | `required` | Escape clears it. |
| `FilterBarSearch shortcut` | `string \| null` | `'/'` | null turns the shortcut off. The hint hides on a coarse pointer or a screen without hover. |
| `FilterBarSelect label, options` | `string, FilterOption[]` | `required` | {value, label, count?, kind?, status?, disabled?} |
| `FilterBarSelect multiple` | `boolean` | `false` | Checkbox items that stay open. |
| `FilterBarSelect showValue` | `boolean` | `true` | false when chips show the values. |
| `FilterBarSelect showAllOption, allLabel` | `boolean, string` | `false, 'All'` | An All item that clears. |
| `FilterBarSelect sinkEmpty` | `boolean` | `true with counts` | Count-0 options sink below a divider. |
| `FilterBarSelect size` | `'xs' \| 'sm' \| 'default'` | `'default'` | Chip height: xs 24px, sm and default 28px. |
| `FilterBarAdd label, options` | `string, FilterOption[]` | `required` | A dashed chip "+ Channel" that opens a menu; a pick turns it into the filled chip "Channel: Chat" with a remove button, and removing it brings the dashed chip back. |
| `FilterBarAdd value, onValueChange` | `string \| null, (value) => void` | `null` | One value per field. Also defaultValue. |
| `FilterChip label, value, kind, onRemove` | `string, ReactNode, Kind, () => void` | `required` | An applied filter, removable. |
| `FilterToggle` | `pressed, onPressedChange` |  | A quick filter that sits pressed. |
| `FilterBarCount shown, total, noun` | `number, number, string` | `required` | A status region. |
| `useFilteredRows` | `(rows, {search, match, fields, filters, where})` |  | Returns {rows, counts}; counts[field.id][value] is how many rows that option leaves. |
| `fields, filters` | `{id: string; value: (row) => string \| string[]}[], Record<string, string[]>` |  | One field per select, its id the key in filters and counts: [{id: 'status', value: r => r.status}] with {status: ['fail']}. An empty list filters nothing. Keep fields stable (useMemo). |
| `match, where` | `(row, query) => boolean, ((row) => boolean \| false)[]` |  | match gets the lower-cased search; where holds pressed toggles, falsy entries off. |
Other props pass through to the root element.

## Variants and states
- multiple: false, true
- size: xs, default
- states: rest, hover, focus-visible, open, active, option-empty, disabled, search-filled, nothing-left

## Accessibility
- [ ] The bar is a search landmark; the search is a searchbox with aria-keyshortcuts="/".
- [ ] A select chip is a button with aria-haspopup and aria-expanded; options are menuitemcheckbox or menuitemradio with aria-checked.
- [ ] / focuses the search outside fields, menus and dialogs, and not during IME composition. Escape clears the text.
- [ ] Removing a chip moves focus to the next chip; after the last, to the select that set it.
- [ ] Clear all moves focus to the search.
- [ ] FilterBarCount is a polite status; the announced copy waits 500ms without change.

## Edge cases
- Long select value -> Truncates inside the chip; the full value is the accessible name.
- Right to left -> Search icon, clear and hint sit on the logical sides.
- Text spacing -> Chips widen, values truncate, the bar wraps.
- Filters leave 0 rows -> Count reads "0 of 240 conversations"; the list says why. Clear all in the bar is the one reset, so the empty row adds no Clear button.
- Select with no options -> Pass disabled instead of opening an empty menu.
- Option count 0 and chosen -> Stays in place so it can be unchecked.
- Server-side search -> The bar stays live; counts show the last result until the next arrives.
- Failed fetch -> Show Empty state reason="error" in the list; the bar keeps its values.
- Typing / in a dialog, menu or open listbox -> The shortcut does nothing there.
- Forced colors -> Chips take a 1px outline, pressed 2px.
- Inside a DataTable toolbar -> The strip is --row (40px) and spans the frame; cells drop their edges for the column rule.

## Tokens
--surface-page, --line-control, --line-control-hover, --line-row, --surface-selected, --control-sm, --row, --type-label, --text-3, --radius-soft, --radius-inner, --radius-frame, --elev-overlay, --dur-base, --dur-fast, --ease-step, --surface-hover, --type-label-sm, --type-body-sm, --text-1

## Related
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
- [Chip](/components/chip.md): An interactive token: filter toggle, removable value or menu trigger.
- [Select](/components/select.md): One choice from a popup list, or the native select.
- [Combobox](/components/combobox.md): A searchable choice, single, multiple or creatable.
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
- [Command](/components/command.md): A searchable command list, the core of the command palette.
