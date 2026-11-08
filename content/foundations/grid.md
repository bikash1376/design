---
name: Grid
system: iota
kind: foundation
source: registry/iota/tokens.css
last-updated: 2026-11-08
human: {{SITE}}/foundations/grid
---

# Grid

The columns and gutters a page sits on, at every width.

## Rules
1. grid-layout-tokens MUST Use --container, --sidebar, --toc and --topbar for layout widths; never a raw number. Because a raw width drifts from the shell, so the page edge no longer lines up with the header and nav.
   - Correct: `<div className="max-w-(--container)">`
   - Wrong: `<div className="max-w-[1120px]">`
2. grid-no-sideways-scroll MUST Keep the page from scrolling sideways at 320px; tables and code scroll inside their own container. Because one wide table makes the whole page pan, and on a phone the person loses the nav and the first column together.
   - Correct: `<CodeBlock code={longCommand}/>  // scrolls inside`
   - Wrong: `<main><pre>{longCommand}</pre></main>`
3. grid-full-bleed SHOULD Break a full-bleed section out of the container and return its content to the container on the same gutter. Because content that rides the bleed edge no longer lines up with the text above and below it.
4. grid-measure SHOULD Stop prose at --measure (68ch); tables, previews and grey panels take the full column. Because lines past about 70 characters make the eye lose its place on the return.
5. grid-lines-clear NEVER Set content on a drawn grid line; guides are brand at 8% along the container edges. Because a line through text or a control reads as a strike-through or a border the element does not have.
   - Correct: `<div className="px-6"><h2>Runs</h2></div>`
   - Wrong: `<div className="border-l border-hair pl-0"><h2>Runs</h2></div>`

## Tokens
| Token | Role | Use for | Not for | Light |
|-|-|-|-|-|
| `--container` | marketing and docs content width | marketing and docs content width | app panels | `1120px` |
| `--sidebar` | app and docs sidebar width | app and docs sidebar | collapsed icon column | `248px` |
| `--toc` | docs on-this-page column | docs on-this-page column | sidebar | `200px` |
| `--topbar` | app and docs top bar height | app and docs top bar height | controls | `56px` |
| `--gutter` | page gutter at desktop | page gutter at desktop | phones | `24px` |
| `--gutter-sm` | page gutter on phones | page gutter on phones | desktop | `16px` |
| `--control-xs` | the action in a 40px header, 8px from its edges | button xs, chip xs, segmented xs, filter bar xs |  | `24px` |
| `--control-sm` | small control height, the sm of every control | button sm, chip, segmented sm, field sm, tag input |  | `28px` |
| `--control` | default control height, wider than tall: 16px of padding a side | button, input, select, slider thumb |  | `32px` |
| `--tag` | a tag's height: the smallest box that holds a 12px label, a count or a key cap | badge, code tag, kbd, brand slot sm, sidebar count |  | `20px` |
| `--control-lg` | large control and touch target | button lg |  | `44px` |
| `--overlay-sm` | small dialog and confirm width | dialog sm, alert dialog |  | `400px` |
| `--overlay` | default dialog, sheet and drawer content width | dialog, sheet, drawer |  | `480px` |
| `--overlay-lg` | wide dialog for forms and previews | dialog lg |  | `640px` |
| `--popover` | popover and picker panel width | popover, mode picker |  | `288px` |
| `--toast-width` | toast stack width from 640px up; full width below | toaster |  | `384px` |
| `--popover-sm` | a short info panel opened from an info button | popover info |  | `256px` |
| `--tooltip-max` | tooltip line length before it wraps | tooltip, chart tooltip |  | `256px` |
| `--hint-width` | widest a full-text hint grows; still capped at the viewport less the phone gutters | truncate hint |  | `420px` |
| `--menu-min` | narrowest a menu opens, so short labels still give a usable target row | dropdown menu, filter bar menu, attachment row |  | `192px` |
| `--popup-max` | tallest a list popup grows before it scrolls | select, combobox, command list, prompt-input menu, chart data table |  | `320px` |
| `--menu-width` | width the @ and / list opens at beside the caret; narrower on a phone | prompt-input menu |  | `320px` |
| `--field-max-height` | tallest a wrapping chips field grows, four touch rows, before it scrolls | combobox chips |  | `calc(var(--control-lg) * 4)` |
| `--row-sm` | compact row, for dense data | table size sm |  | `32px` |
| `--row` | default row, one line | table, item |  | `40px` |
| `--row-lg` | a row with a second line | table size lg, item with a description |  | `56px` |
| `--label-column` | widest a description-list label column grows before it wraps | data list |  | `160px` |
| `--measure` | long-form reading measure | long-form reading measure | tables | `68ch` |
| `--tab-max` | widest a document tab grows before its title truncates | tabs document variant |  | `220px` |
| `--sidebar-icon` | collapsed sidebar width: one control plus 8px a side | sidebar icon mode |  | `calc(var(--control) + var(--space-4))` |
| `--attachment-media` | the media square in an attachment row; size sm uses 32px, --row-sm | attachment |  | `40px` |
| `--attachment-max` | widest an attachment chip in the composer grows before its name truncates | prompt-input attachment |  | `256px` |
| `--grab-size` | length of a sheet's grab bar | sheet |  | `40px` |
| `--fade-edge` | the mask fade at the clipped edge of a sideways scroller | suggestions scroll |  | `24px` |
| `--fade-line-end` | the mask fade at the end of one line of text that overflows, in place of an ellipsis | segmented control label |  | `16px` |
| `--measure-hint` | a description under a title, a page lede or a field's hint, shorter than prose | field description, section description, page header description |  | `60ch` |
| `--measure-short` | an empty state's title and line, set top-left in the body | empty state |  | `48ch` |
| `--page-header-max` | widest a page header's title block grows beside its actions | page header |  | `720px` |
| `--search-min` | narrowest the filter bar's search gets before the filters wrap under it | filter bar |  | `200px` |
| `--search-max` | widest the filter bar's search grows once the bar has room | filter bar |  | `320px` |
| `--crumb-floor` | shortest the page crumb truncates to before the trail folds another crumb | breadcrumb trail |  | `8ch` |
| `--log-level` | the level column, as wide as the longest level word | log viewer |  | `5ch` |
| `--status-column` | a right-aligned status column, wide enough for the status "Waiting on you" | table, tool call, timeline |  | `128px` |
| `--timeline-name` | the widest the name column of a timeline gets from 576px; narrower frames give it 40%, and never less than --timeline-name-min | timeline |  | `200px` |
| `--timeline-name-min` | the least the name column of a timeline keeps, so a label never shrinks to a stub | timeline |  | `120px` |
| `--timeline-label-min` | the least a span name keeps before its figure is hidden, so a name never shrinks to a stub | timeline |  | `10ch` |
| `--time-column` | a column of relative times, wide enough for the first paint's date ("Sep 30, 2025") so the swap to "3m ago" never moves it | relative time column |  | `12ch` |
| `--stat-placeholder` | the loading bar standing in for a stat's value, about four digits | stat |  | `4ch` |
| `--tool-detail-min` | the least of a tool call's detail kept before its status wraps to a second line | tool call |  | `6ch` |
| `--line-box` | one line of the text it sits in; lh resolves where it is read | prose rhythm, stat, status, toast mark, date picker field, prompt input, tool call output |  | `1lh` |
| `--skeleton-text` | a text skeleton bar, about the cap height of the text it stands for | skeleton text |  | `0.7em` |
| `--code-inline` | inline code, a step under the text around it so mono does not look larger | code |  | `0.9em` |

## Decision table
| You need | Use |
|-|-|
| Page content width | `--container` |
| Left navigation | `--sidebar` |
| Side gutter | `--gutter, --gutter-sm on phones` |
| Reading width | `--measure` |

## Scale
12 columns, 20px gaps. Under 640px: 4 columns, 16px gutter. 640 to 1023: 8 columns, 24px.

## Reject list
- No raw pixel widths for layout.
- No page-level horizontal scroll.

## Related
- [Space](/foundations/space.md): How much room goes between things, in steps of 4px.
- [Typography](/foundations/typography.md): One sans for every word, mono for what a person copies.
