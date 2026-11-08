---
name: Table
system: iota
source: quartz
kind: component
import: "import {Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, TableEmpty, TableFrameHeader, TableToolbar, tableFrameClassName, tableRowClassName, TableRowActions, TableRowAction, TableRowActionsMenu, TableRowActionsItem, TableRowActionsSeparator, DataTable, DataTableCheckbox, DataTableColumnHeader, DataTableColumnsMenu, selectColumn, severitySort, statusSeverity, useWindowedRows} from '@/components/iota/ui/table'"
install: "npx shadcn@latest add {{SITE}}/r/table.json"
registryDependencies: [badge, button, checkbox, css-var, dropdown-menu, empty-state, format, icon, kind, overlay, portal, scroll-focus, status, theme, use-offscreen, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/table
---

# Table

Lists records that share the same fields.

## Use when
- Many records with the same fields that a person compares across columns: runs, prompt releases, keys.
- A list the person sorts, filters or acts on in bulk.
- Exact values that need to line up: durations, counts, costs.

## Don't use when
- Each row is one line of mixed content and no columns compare. Use [Item](/components/item.md).

## Minimal example
```tsx
<DataTable aria-label="Runs" title="Runs" kind="run" columns={columns} data={runs} getRowId={r => r.id}
  defaultSorting={[{id: 'status', desc: true}]} maxHeight={420}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. table-label MUST Give every table aria-label or a TableCaption. Because a screen reader announces an unnamed "table", and a page with two cannot be told apart in the tables list.
   - Correct: `<DataTable aria-label="Runs" columns={columns} data={runs}/>`
   - Wrong: `<DataTable columns={columns} data={runs}/>`
2. table-status-severity MUST Set meta.severity on a status column and open with defaultSorting={[{id: 'status', desc: true}]}. Because sorted by the alphabet, warn lands at the bottom below ok and idle, where an operator scanning for trouble misses it.
   - Correct: `{accessorKey: 'status', header: 'Status', meta: {severity: true}}`
   - Wrong: `{accessorKey: 'status', header: 'Status'}`
3. table-status-word MUST Render a status cell with Status, which prints the word, not a colored dot or tint. Because hue alone vanishes in forced colors and grayscale, and a screen reader reads an empty cell.
   - Correct: `cell: ({getValue}) => <Status status={getValue()}/>`
   - Wrong: `cell: () => <span className="size-2 rounded-full bg-fail-text"/>`
4. table-one-unit MUST Set meta.unit to duration or count; never format each cell by hand. Because per-cell units put 950ms above 1.2s in one column, so the bigger-looking number is the smaller one.
   - Correct: `meta: {unit: 'duration'}`
   - Wrong: `` cell: ({getValue}) => getValue() < 1000 ? `${getValue()}ms` : `${getValue() / 1000}s` ``
5. table-open-not-select MUST Open details with onRowClick and activeRowId; keep checkboxes for selection. The open row gets aria-current and the neutral grey, a selected row a ticked checkbox and the kind wash. Because opening by selection ticks a checkbox the person never pressed, so a bulk action then hits that row.
   - Correct: `onRowClick={run => setOpenId(run.id)} activeRowId={openId}`
   - Wrong: `onRowClick={run => setSelection({[run.id]: true})}`
6. table-window-past-200 MUST Give a table that can pass 200 rows a maxHeight so it windows. Because without maxHeight DataTable renders every row, and 10,000 rows stall the page on each sort and filter.
   - Correct: `<DataTable data={tenThousandRuns} columns={columns} maxHeight={480}/>`
   - Wrong: `<DataTable data={tenThousandRuns} columns={columns}/>`
7. table-one-frame NEVER Wrap a Table in a Card or a second frame. Because the table is already one frame, and a second edge around it reads as two components.
   - Correct: `<DataTable aria-label="Runs" title="Runs" …/>`
   - Wrong: `<Card><DataTable aria-label="Runs" …/></Card>`
8. table-title-in-frame SHOULD Pass title rather than writing a heading above the table.
   - Correct: `<DataTable aria-label="Runs" title="Runs" …/>`
   - Wrong: `<h3>Runs</h3><DataTable aria-label="Runs" …/>`
9. table-empty-reason SHOULD Say why in empty, top-left, with the query in a CodeTag, and name the way out; under a FilterBar its Clear all owns the reset.
   - Correct: `empty={<TableEmpty title="No runs match" query="refund">Clear all resets the filters.</TableEmpty>}`
   - Wrong: `empty="No data"`
10. table-no-zebra NEVER Stripe rows, add vertical cell borders, or color row text; the status word carries fail. Because stripes and red row text compete with the status word, the one place a failed run is meant to show.
   - Correct: `<TableRow>`
   - Wrong: `<TableRow className="odd:bg-hover border-r">`
11. table-columns-at-1280 SHOULD Fit seven columns in the 980px a list gets at 1280: size time with meta.time, give one name or ID column the rest with Truncate, and give every column but name, status and actions meta.hideBelow: 768.
   - Correct: `{accessorKey: 'id', size: 240, cell: truncatedId}, {accessorKey: 'region', size: 120, meta: {hideBelow: 768}}`
   - Wrong: `columns.map(c => ({...c, size: 160}))`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `columns` | `ColumnDef<TData, any>[]` | `required` | TanStack columns; a string header gets sort and a menu, and its column never narrows below that head. |
| `data` | `TData[]` | `required` | The rows. |
| `aria-label` | `string` | `required` | Names the table. |
| `getRowId` | `(row, index) => string` | `index` | Stable ids for selection and the open row. |
| `defaultSorting, sorting, onSortingChange` | `SortingState` | `[]` | First sort, worst status on top, or a controlled one; Shift-click adds a column. |
| `rowSelection, onRowSelectionChange, enableRowSelection` | `RowSelectionState, boolean \| (row) => boolean` | `{}, true` | Put selectColumn() first for checkboxes; a function disables some rows. |
| `columnVisibility, defaultColumnVisibility` | `VisibilityState` | `{}` | Hidden columns; the menu shows them. |
| `enableColumnResizing` | `boolean` | `true` | Drag a head edge, or arrows; Enter resets. |
| `onRowClick, activeRowId` | `(row) => void, string` |  | The body becomes one tab stop and Enter opens; the open row takes the neutral grey and aria-current. |
| `rowActions, rowIndicator, rowActionsWidth` | `(row) => ReactNode` | `72` | Actions reveal on hover or focus in place of the indicator; on touch and below md they always show. |
| `TableRowActionsMenu label, TableRowActionsItem variant, TableRowActionsSeparator` | `string, 'default' \| 'destructive'` | `required, 'default'` | The row menu: label names the row; variant matches DropdownMenuItem. |
| `loading, loadingRows` | `boolean, number` | `false, 6` | Placeholder rows after a short delay, and aria-busy; use it, not SkeletonSwap. |
| `empty` | `ReactNode` | `'No rows.'` | Top-left in the body; a string becomes TableEmpty's line. |
| `title, actions, footer` | `ReactNode` |  | The frame header with the row count, its actions, and a footer under the rows. |
| `live, follow, rowStatus` | `boolean, boolean, (row) => warn \| fail` | `false` | A running Live status in the header; keep the newest row in view; mark trouble with no severity column. |
| `maxHeight, virtualizeFrom` | `number \| string, number` | `200` | Scroll box; windowing starts at that many rows. |
| `size, kind` | `'sm' \| 'default', Kind` | `'default'` | Rows 32 or 40px (static Table adds lg, 56px); kind tints the washes. |
| `toolbar` | `(table) => ReactNode` |  | A 40px strip under the header: FilterBar, bulk actions, DataTableColumnsMenu. |
| `BulkActionBar count, noun, onClear` | `number, [string, string], () => void` | `required, ['item', 'items'], -` | In the toolbar for selected rows: "3 runs selected", then BulkAction buttons, then Clear. 0 hides it; Escape and the X call onClear. |
| `BulkActionBar position, BulkAction status` | `'inline' \| 'floating', 'fail'` | `'inline'` | floating fixes the bar to the bottom of the viewport. BulkAction status="fail" writes Delete or Revoke in the fail text. |
| `Table title, count, actions, toolbar, footer, status, live` | `ReactNode, warn \| fail, boolean` |  | The static frame's parts; TableRow takes open and status. |
| `meta.severity` | `boolean` | `false` | Sorts by status severity, fail first. |
| `meta.unit` | `'duration' \| 'count'` |  | One unit from the largest value; right-aligned. |
| `meta.numeric, meta.mono, meta.hideBelow, meta.time` | `boolean, boolean, number, boolean` |  | Tabular figures, mono IDs, hide under N px, a RelativeTime column sized from --time-column. |
Other props pass through to the table element, not the scrolling div around it, which takes containerClassName.

## Variants and states
- size: sm, default, lg
- kind: plain, run
- states: rest, hover, focus-visible, selected, open, sorted, disabled row, loading, empty, resizing

## Accessibility
- [ ] The table is named by aria-label or caption and sets aria-rowcount and aria-busy while loading.
- [ ] Heads set aria-sort; Enter and Space on a sort button cycle it and Shift adds the column; a status line announces the row count, selection and sort politely.
- [ ] Rows set aria-selected, aria-current on the open row, and aria-rowindex.
- [ ] Checkboxes are named Select row n and Select all rows, with mixed for partial; Shift-click applies the anchor row state to the range.
- [ ] With onRowClick the body is one tab stop; arrows, Home, End, Page Up and Page Down move; Enter opens once.
- [ ] A resize handle is role="separator"; Left and Right move 16px, Shift 64px, Enter resets; arrows swap in RTL.
- [ ] Forced colors give selected and open rows a Highlight outline.
- [ ] BulkActionBar is a toolbar with one tab stop and arrow keys between actions; Escape clears the selection, and a polite status says "3 runs selected" and "Selection cleared".

## Edge cases
- 120-character agent, 36-character run ID -> Cells never wrap; they cut with an ellipsis and keep full text in the DOM.
- data=[] -> TableEmpty top-left in the visible width.
- 10,000 rows -> With maxHeight 360 about 20 rows stay in the DOM; the sort runs over all.
- Narrow pane -> hideBelow columns drop first; then the box scrolls sideways, joins the tab order so arrows scroll it, and pins the actions column to the end with a row rule on its edge.
- Right to left -> Padding, numeric alignment and the resize handle mirror.
- Loading -> The header stays; after --dur-skeleton-delay placeholder bars fill the real columns and stay at least --dur-skeleton-hold. A reload keeps the rows until then.
- Button or checkbox inside a row -> Row clicks ignore them, so an action never also opens the row.
- Warn, fail and waiting rows -> A warn row takes no wash and a fail row a faint 40% one; the status word carries the hue. A waiting status is the plain brand word in a DataTable row; the header holds the one InkSlot count.

## Tokens
--line-frame, --line-row, --surface-page, --surface-hover, --accent-wash, --accent-mark, --ink, --row-sm, --row, --row-lg, --status-column, --time-column, --radius-soft, --radius-inner, --radius-frame, --control-sm, --dur-fast, --ease-step, --surface-skeleton, --type-label-sm, --type-tag, --text-3, --elev-overlay

## Related
- [Item](/components/item.md): The list row: media, title, meta, status and actions.
- [Filter bar](/components/filter-bar.md): Search plus filter chips and clear-all.
- [Pagination](/components/pagination.md): Moves through pages of results.
