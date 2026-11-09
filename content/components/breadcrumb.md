---
name: Breadcrumb
system: iota
kind: component
import: "import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, BreadcrumbId, BreadcrumbTrail} from '@/components/iota/ui/breadcrumb'"
install: "npx shadcn@latest add {{SITE}}/r/breadcrumb.json"
registryDependencies: [dropdown-menu, icon, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/breadcrumb
---

# Breadcrumb

Shows where the page sits in the product and gives a link to each level above it.

## Use when
- The page is three or more levels deep: workspace, agent, run.
- A detail page needs a way back to its list and to the levels above.

## Don't use when
- The page is a peer of its neighbours, like Runs next to Keys. Use [Tabs](/components/tabs.md).
- The person pages through results. Use [Pagination](/components/pagination.md).
- The page is one level below home. The page header title is enough.

## Minimal example
```tsx
<BreadcrumbTrail items={[
  {label: 'Agents', href: '/agents'},
  {label: 'support-agent', href: '/agents/support-agent'},
  {label: 'Runs'},
]}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. breadcrumb-trail-from-data SHOULD Use BreadcrumbTrail with items; compose the parts by hand only for a fixed trail of three or fewer. Because the trail measures its container and folds crumbs into a menu in a fixed order, which hand-built parts do not.
   - Correct: `<BreadcrumbTrail items={items}/>`
   - Wrong: `<Breadcrumb><BreadcrumbList>{items.map(renderCrumb)}</BreadcrumbList></Breadcrumb>`
2. breadcrumb-last-is-page MUST Make the last item the current page, with no href. Because the current page is brand and not a link, and aria-current="page" tells a screen reader where it is.
   - Correct: `{label: 'Runs'}`
   - Wrong: `{label: 'Runs', href: '/runs'}`
3. breadcrumb-root-first MUST Order items from the root to the current page. Because the trail folds from the left and keeps the current page last, so a reversed list folds the wrong crumbs.
4. breadcrumb-ids-mono MUST Set an ID crumb with id: true or BreadcrumbId. Because it sets the ID in mono and cuts the middle while keeping the type prefix, so run_8f2a…e5b6a7 stays readable.
   - Correct: `{label: 'run_8f2a91c0d4e5b6a7', id: true}`
   - Wrong: `{label: 'run_8f2a91c0d4e5b6a7'}`
5. breadcrumb-router-link MUST Pass renderLink with your router link so a press does not reload the page. Because without it every crumb is a plain anchor and each press is a full page load.
   - Correct: `<BreadcrumbTrail items={items} renderLink={href => <Link href={href}/>}/>`
   - Wrong: `<BreadcrumbTrail items={items}/>`
6. breadcrumb-labels-match-titles SHOULD Use the page title as the crumb label, and a short noun for a list level. Because a crumb that names a page differently from its heading sends the person to a place they do not recognise.
7. breadcrumb-one-per-page NEVER Render two breadcrumbs on one page. Because each is a nav landmark with the same name, so a screen reader cannot tell them apart.
   - Correct: `<BreadcrumbTrail items={a}/>`
   - Wrong: `<><BreadcrumbTrail items={a}/><BreadcrumbTrail items={b}/></>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `items` | `Crumb[]` | `required` | Root first, current page last. A Crumb is {label, href?, id?}. The last is not a link. |
| `renderLink` | `(href: string) => ReactElement` |  | Renders each link, for a router: href => <Link href={href}/>. |
| `Crumb id` | `boolean` | `false` | Sets the label in mono with the middle cut (BreadcrumbId). |
| `Breadcrumb parts` | `BreadcrumbList, Item, Link, Page, Separator, Ellipsis` |  | The pieces for a hand-built trail. BreadcrumbLink takes render for a router link. |
| `className` | `string` |  | Placement, on the nav. Give it a width; the trail fits itself to it. |
Other props pass through to the root element.

## Variants and states
- fit: full, folded, cut
- states: link, hover, focus-visible, current

## Accessibility
- [ ] The root is a nav named "Breadcrumb" holding an ordered list; the separators are aria-hidden.
- [ ] The current page has aria-current="page" and is not a link.
- [ ] The fold button names its count ("2 more levels") and opens a menu of links with arrow keys and Escape.
- [ ] A cut current page carries its full text as a title, and an ID crumb keeps the whole ID for screen readers.
- [ ] Links show a 2px brand outline on focus and underline on hover; touch targets are at least 24px tall.

## Edge cases
- Trail too wide -> Middle crumbs fold into a "…" menu from the left, then the current page truncates, then the root joins the menu.
- Current page -> Never shrinks below 8ch and the trail never ends in a slash.
- One item -> Renders the current page alone; it truncates if it does not fit.
- Long ID -> Past 18 characters it shows the type prefix and 4 characters, an ellipsis and the last 6.
- First paint -> It measures a hidden copy before it decides, so nothing jumps while it folds.
- Container resizes -> It measures again and unfolds as room returns.
- Right to left -> The trail mirrors; labels use dir="auto".
- Zoom 200% -> More crumbs fold sooner, and every folded one stays one menu press away.

## Tokens
--crumb-floor, --radius-inner, --radius-soft, --text-1, --text-2, --text-3, --surface-hover, --surface-pressed, --popover, --type-label, --type-tag

## Related
- [Tabs](/components/tabs.md): Panels of one view, with closable and reorderable document tabs.
- [Dropdown menu](/components/dropdown-menu.md): Actions from a trigger or a right click.
- [Pagination](/components/pagination.md): Moves through pages of results.
