---
name: Pagination
system: iota
kind: component
import: "import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationInfo, PaginationNav, paginationRange} from '@/components/iota/ui/pagination'"
install: "npx shadcn@latest add {{SITE}}/r/pagination.json"
registryDependencies: [icon, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/pagination
---

# Pagination

Moves through a long list one page at a time.

## Look
Pagination carries its own `--surface-page` background, so it reads on any surface.

## Use when
- A list or table has more rows than one page shows and the person needs to move through them.
- The total is known (numbered) or only a next cursor is (Previous and Next).

## Don't use when
- Switching between views of the same data. Use [Tabs](/components/tabs.md).
- The list loads as the person scrolls and has no pages. Use [Table](/components/table.md).

## Minimal example
```tsx
<PaginationNav page={4} pages={24} hrefPattern="?page={page}"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. pagination-links MUST Give every page a real href through getHref or hrefPattern, even with client routing. Because without href the PaginationLink anchor takes no focus and cannot open in a new tab.
   - Correct: `` <PaginationNav page={page} pages={pages} getHref={p => `?page=${p}`} onPageClick={go}/> ``
   - Wrong: `<PaginationLink onClick={() => setPage(3)}>3</PaginationLink>`
2. pagination-no-every-page NEVER Render every page number. Use paginationRange's seven slots. Because a thousand links wrap the row, move Next, and make a keyboard user tab through every one.
   - Correct: `<PaginationNav page={page} pages={pages} hrefPattern="?page={page}"/>`
   - Wrong: `Array.from({length: pages}, (_, i) => <PaginationLink>{i + 1}</PaginationLink>)`
3. pagination-steady MUST Keep a fixed slot count and pass the same minWidth to every number in a custom row. Because a slot that widens at page 10 moves Next under the pointer, so the next click lands on a number.
   - Correct: `<PaginationNav page={page} pages={pages} hrefPattern="?page={page}"/>`
   - Wrong: `pages.map(p => <PaginationLink>{p}</PaginationLink>)`
4. pagination-info-noun SHOULD Name the thing in PaginationInfo and use one number format with separators.
   - Correct: `<PaginationInfo from={1} to={50} total={60183} noun="conversations"/>`
   - Wrong: `<p>Showing 1 to 50 of 60183 results</p>`
5. pagination-announce MUST Wrap PaginationInfo in role="status" when the page changes without a full navigation. Because a client page change moves no focus, so a screen reader hears nothing change.
   - Correct: `<div role="status"><PaginationInfo .../></div>`
   - Wrong: `<PaginationInfo .../>`
6. pagination-row-width SHOULD Let the row compact when the full row does not fit its container (automatic); do not force the text back.
   - Correct: `<PaginationNav .../>`
   - Wrong: `<PaginationPrevious className="@max-md:inline" .../>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `PaginationNav page` | `number` | `required` | The current page, 1-based. |
| `PaginationNav pages` | `number` |  | Total pages. Leave out for a cursor API. |
| `PaginationNav getHref` | `(page) => string` |  | Every page is a real link, from client components. |
| `PaginationNav hrefPattern` | `string` | `'?page={page}'` | The same as a string, for server components. |
| `PaginationNav hasNext` | `boolean` |  | Cursor mode: whether Next is enabled. |
| `PaginationNav onPageClick` | `(page, event) => void` |  | Client routing; preventDefault keeps the link. |
| `PaginationLink isActive, disabled, size` | `boolean, boolean, Button size` | `size 'icon'` | Composed form: one page. |
| `PaginationInfo from, to, total, noun, page` | `number, number, number?, string?, number?` |  | "1-50 of 1,204 conversations"; without total, "page 3". |
Other props pass through to the root element.

## Variants and states
- mode: numbered, cursor
- form: PaginationNav, composed
- states: rest, hover, focus-visible, current, disabled, compact

## Accessibility
- [ ] The row is a nav landmark; page links are plain anchors that open in a new tab.
- [ ] Tab goes Previous, each page, Next; disabled ends are skipped.
- [ ] The current page sets aria-current="page".
- [ ] When the full row does not fit its container, it compacts to arrows and "Page 4 of 24".
- [ ] Announce PaginationInfo in a status region when the page changes in place.

## Edge cases
- 1,204,000 pages -> Every slot widens to fit the largest number, all equal.
- Cursor API -> Previous, the page, Next; no total.
- One page -> Previous and Next disabled, one current slot.
- Zero pages -> No slots, both ends disabled; hide pagination when the list is empty.
- Right to left -> Previous sits on the right and its caret mirrors.
- Page fails to load -> Show Empty state reason="error" in the list; the row stays.
- Ten clicks on Next -> Next never moves, so every click lands on it.

## Tokens
--line-control, --line-control-hover, --surface-hover, --surface-selected, --text-1, --text-disabled, --radius-soft, --control, --type-body-sm, --text-3, --features-data, --space-4, --dur-fast, --ease-step

## Related
- [Table](/components/table.md): Rows and columns with sort, selection, row actions and virtualization.
- [Tabs](/components/tabs.md): Panels of one view, with closable and reorderable document tabs.
