---
name: Data grid
system: iota
source: quartz
kind: component
import: "import {DataGrid, DataGridTable, DataGridHeader, DataGridBody, DataGridRow, DataGridHead, DataGridCell, DataGridHelp, useDataGrid, formatCellValue, parseCellValue} from '@/components/iota/ui/data-grid'"
install: "npx shadcn@latest add {{SITE}}/r/data-grid.json"
registryDependencies: [checkbox, icon, input, kbd, popover, select, status, table, textarea, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/data-grid
---

# Data grid

A table people edit cell by cell, with the keyboard, paste and a save state per cell.

## Use when
- People edit many records in place, a cell at a time: eval cases, ticket routing, a pricing sheet.
- People paste rows from a spreadsheet and expect them to fill cells.
- Each edit saves on its own and the person needs to see which saved and which failed.

## Don't use when
- People read, sort and open records but do not edit cells. Use [Table](/components/table.md).
- One record is edited as a form. Use [Field](/components/field.md).

## Minimal example
```tsx
<DataGrid rowCount={cases.length} colCount={2}>
  <DataGridTable aria-label="Eval cases">
    <DataGridBody>{cases.map((c, row) => <DataGridRow key={c.id} index={row}>
      <DataGridCell row={row} col={0} label={`Score for ${c.id}`} value={c.score} editor="number" onCommit={v => saveScore(c.id, v)}/>
      …</DataGridRow>)}</DataGridBody>
  </DataGridTable>
</DataGrid>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. data-grid-cell-label MUST Give each DataGridCell a label that names its row: "Score for eval_0412". Because the editor, the error and every save announcement read the label, so "Score" alone never says which row saved.
   - Correct: `` <DataGridCell label={`Score for ${c.id}`} …/> ``
   - Wrong: `<DataGridCell label="Score" …/>`
2. data-grid-counts MUST Set rowCount and colCount to what you render, and index rows from 0 with the header row at -1. Because the arrows clamp to the counts and aria-rowindex comes from index, so a wrong count strands focus or misreads the row.
   - Correct: `<DataGrid rowCount={page.length} colCount={5}>{page.map((c, i) => <DataGridRow index={i}>`
   - Wrong: `<DataGrid rowCount={100} colCount={5}>{page.map((c, i) => <DataGridRow index={i + 1}>`
3. data-grid-commit-promise MUST Return the save from onCommit and reject with an Error that says what to do. Because a void onCommit shows no saving or saved mark, so a failed save looks done.
   - Correct: `onCommit={v => saveScore(c.id, v)}`
   - Wrong: `onCommit={v => { saveScore(c.id, v); }}`
4. data-grid-cell-id MUST Pass cellId from the row id whenever rows can sort or filter. Because save state is keyed by position without it, so after a sort the saving mark lands on another row.
   - Correct: `` <DataGridCell cellId={`${c.id}:score`} …/> ``
5. data-grid-keep-bad-value NEVER Drop a bad value in onCommit; store it and let validate say why. Because validate reads the stored value, so a dropped value vanishes with no message.
   - Correct: `onCommit={save} validate={v => isScore(v) ? null : 'Use a number from 0 to 1.'}`
   - Wrong: `onCommit={v => { if (isScore(v)) return save(v); }}`
6. data-grid-mount-rows NEVER Window or virtualize the rows of one DataGrid; paginate and pass the page. Because moves, copy and paste reach only mounted cells, so a paste past the window is dropped.
   - Correct: `<DataGrid rowCount={page.length}>{page.map(…)}</DataGrid>`
   - Wrong: `<DataGrid rowCount={5000}>{visible.map(…)}</DataGrid>`
7. data-grid-help SHOULD Render DataGridHelp next to the table; the grid points aria-describedby at it.
   - Correct: `<DataGrid …><DataGridTable …/><DataGridHelp/></DataGrid>`
8. data-grid-types SHOULD Use editor="number" for numbers and mono for IDs, so they right-align and line up.
9. data-grid-header-buttons SHOULD With focusableHeader, put itemProps({row: -1, col}) on a head button and focusable={false} on its DataGridHead.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `DataGrid rowCount` | `number` | `required` | Body rows, not the header. |
| `DataGrid colCount` | `number` | `required` | Columns in every row. |
| `DataGrid readOnly` | `boolean` | `false` | Cells focus and copy; nothing edits or pastes. |
| `DataGrid focusableHeader` | `boolean` | `false` | The header row joins the arrows, as row -1. |
| `DataGrid activeCell` | `{row: number; col: number}` |  | Controlled active cell. |
| `DataGrid onActiveCellChange` | `(cell: CellPosition) => void` |  | Called when the active cell moves. |
| `DataGridTable aria-label` | `string` | `required` | Names the grid. |
| `DataGridTable size` | `'sm' \| 'default' \| 'lg'` | `'sm'` | Row height 32, 40 or 56px. |
| `DataGridTable title, count, actions` | `ReactNode` |  | The frame header: put "Eval cases" and "2 of 4 pass" here, not in a line under the grid. |
| `DataGridRow index` | `number` | `required` | Body row from 0; the header row is -1. |
| `DataGridHead col` | `number` | `required` | Column from 0. |
| `DataGridCell row, col` | `number` | `required` | Its place; match the row index. |
| `DataGridCell label` | `string` | `required` | Names the cell in editors and announcements. |
| `DataGridCell value` | `string \| number \| boolean \| null` | `null` | The stored value. |
| `DataGridCell editor` | `'text' \| 'long-text' \| 'number' \| 'select' \| 'boolean'` |  | Without one the cell is read only. |
| `DataGridCell options` | `{value: string; label: string}[]` |  | The choices for select. |
| `DataGridCell onCommit` | `(value: CellValue) => void \| Promise<unknown>` |  | Saves; a promise shows saving and saved. |
| `DataGridCell validate` | `(value: CellValue) => string \| null` |  | Marks a stored value invalid and says why. |
| `DataGridCell cellId` | `string` | `'row:col'` | Keys the save state. |
| `DataGridCell status` | `CellSaveState` |  | Save state from the product; wins over the grid. |
| `DataGridCell mono` | `boolean` | `false` | Mono text, for IDs. |
Other props pass through to DataGrid: the wrapper div; DataGridTable: the table; DataGridRow: the tr; DataGridHead: the th; DataGridCell: the td; DataGridHelp: the p.

## Variants and states
- editor: text, long-text, number, select, boolean
- size: sm, default, lg
- states: rest, active, editing, saving, saved, error, invalid, empty, read only

## Accessibility
- [ ] The table is role="grid" with one tab stop; cells are gridcells with aria-readonly, aria-invalid and aria-busy.
- [ ] The active cell shows a 2px brand ring drawn inside it, so a scroll box never clips it.
- [ ] Saves, failures, copies and pastes are announced in one polite status line.
- [ ] An invalid cell shows "Invalid:" and the reason, a failed save "Not saved:" and the error, as text on the fail wash, not as color alone.
- [ ] Only an invalid value sets aria-invalid; a failed save is announced in the status line, since the value itself may be fine.

## Keyboard
- `Arrows, Home, End`: Move a cell, or to the row ends; with Mod, Home and End go to the corners.
- `Page Up, Page Down`: Move ten rows.
- `Enter, F2 or a character`: Edits the cell; a character starts the text with it.
- `Space`: Toggles a boolean cell.
- `Delete, Backspace`: Clears the cell.
- `Mod+C, Mod+V`: Copies the active cell; pastes tab-separated text right and down from it.
- `Escape, Enter, Tab`: In an editor: cancel, save and move down, save and move sideways.

## Edge cases
- A failed save -> Shows "Not saved:" and the error; the value stays, so the person can retry.
- Delete on an empty cell -> Does nothing: no onCommit, no save mark.
- Paste a value a cell already holds -> Leaves it unsaved and announces it apart; a cell whose last save failed is saved again.
- Narrow container -> The table scrolls sideways; DataGridHelp stays unless you hide it.
- Paste over read-only cells or past the last row -> Those cells are skipped; the count is announced.
- Rows sort while a cell saves -> The mark follows cellId; without it, it stays at the position.
- A 400-character value -> The cell stops at 320px and cuts with an ellipsis; copy takes it all.

## Tokens
--line-frame, --line-row, --surface-page, --radius-soft, --radius-frame, --ink, --accent-wash, --fail-wash, --text-2, --text-3, --type-body, --type-body-sm, --type-tag, --row-sm, --features-data, --dur-spin

## Related
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
- [Field](/components/field.md): Label, control, hint and error as one unit, plus the Form part.
