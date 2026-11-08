---
name: Tabs
system: iota
source: quartz
kind: component
import: "import {Tabs, TabsList, TabsTrigger, TabsContent, TabsCount, tabsListVariants} from '@/components/iota/ui/tabs'"
install: "npx shadcn@latest add {{SITE}}/r/tabs.json"
registryDependencies: [css-var, icon, kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/tabs
---

# Tabs

Switches between panels of one view.

## Use when
- One view has two to seven panels of the same object, read one at a time: thread, activity, settings.
- People keep several things open and switch between them: variant="document".

## Don't use when
- The choice changes how one set of data is shown, like a chart range. Use [Segmented control](/components/segmented-control.md).
- One section shows or hides under a heading. Use [Collapsible](/components/collapsible.md).
- The person goes through the panels in order. Use [Progress](/components/progress.md).

## Look
The default tabs are iOTA's segmented bar: a panel track with one fill thumb that glides to the active tab. Use `variant="line"` for an underline inside a page and `variant="document"` for closable tabs.

## Minimal example
```tsx
<Tabs defaultValue="thread">
  <TabsList aria-label="Conversation">
    <TabsTrigger value="thread">Thread</TabsTrigger>
    <TabsTrigger value="activity">Activity<TabsCount>1,204</TabsCount></TabsTrigger>
  </TabsList>
  <TabsContent value="thread">42 messages.</TabsContent>
  <TabsContent value="activity">1,204 events.</TabsContent>
</Tabs>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. tabs-list-name MUST Give every TabsList aria-label naming the object: 'Conversation'. Because a screen reader announces an unnamed "tab list", so two tab sets on one page sound the same.
   - Correct: `<TabsList aria-label="Conversation">`
   - Wrong: `<TabsList>`
2. tabs-panels-same-object MUST Keep every tab about the same object at the same level, two to seven tabs. Because a tab bar reads as one object seen several ways, so Billing beside Activity hides a page people look for in navigation.
   - Correct: `<TabsTrigger value="thread">Thread</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger>`
   - Wrong: `<TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="billing">Billing</TabsTrigger>`
3. tabs-keep-mounted MUST Pass keepMounted to a TabsContent that holds typed or scrolled state. Because Base UI unmounts a hidden panel, so switching away and back drops the typed text and the scroll position.
   - Correct: `<TabsContent value="test" keepMounted><Textarea/></TabsContent>`
   - Wrong: `<TabsContent value="test"><Textarea/></TabsContent>`
4. tabs-document-close-focus MUST Select the next tab, or the previous when it was last, when a document tab closes. Because closing the selected tab leaves none selected, so the panel goes blank and focus drops to the page.
   - Correct: `onClose={id => { setValue(next(id)); setDocs(without(id)); }}`
   - Wrong: `onClose={id => setDocs(d => d.filter(x => x.id !== id))}`
5. tabs-pinned-name MUST Pass label with the full name on a pinned (icon-only) document tab. Because a pinned tab hides its text, so without label a screen reader reads the value: "run_8f2a, pinned".
   - Correct: `<TabsTrigger value="run_8f2a" pinned label="Nightly eval" icon={<Home/>}/>`
   - Wrong: `<TabsTrigger value="run_8f2a" pinned icon={<Home/>}/>`
6. tabs-label-noun SHOULD Label with a noun of one or two words under 20 characters and a TabsCount for how many.
   - Correct: `<TabsTrigger value="activity">Activity<TabsCount>1,204</TabsCount></TabsTrigger>`
   - Wrong: `<TabsTrigger value="activity">View all activity (1204)</TabsTrigger>`
7. tabs-one-treatment NEVER Mix pill, underline and per-tab icons; pick default or line and keep icons off. Because an underline on one tab and a chip on another both read as selected, so the person cannot tell which panel shows.
   - Correct: `<TabsList variant="line"><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>`
   - Wrong: `<TabsTrigger className="border-b-2"><Icon/>Activity</TabsTrigger>`
8. tabs-document-truncate SHOULD Let a document tab label truncate at 220px and carry the full name in label.
   - Correct:
     ```tsx
     <TabsTrigger value="run_8f2a" label="run_8f2a91c0d4e5 nightly eval">run_8f2a91c0d4e5 nightly eval</TabsTrigger>
     ```
9. tabs-min-two MUST Render tabs only with at least two triggers. Because a single tab switches nothing, and a screen reader still announces a tab list of one.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Tabs value, defaultValue, onValueChange, orientation` | `Base UI Tabs.Root` | `'horizontal'` | Vertical stacks the lists with the line on the end edge. |
| `TabsList variant` | `'default' \| 'line' \| 'document'` | `'default'` | document adds close, pin and reorder. |
| `TabsList size` | `'default' \| 'sm'` | `'default'` | 32 or 28px tall. |
| `TabsList onClose` | `(value) => void` |  | Document only; Delete and middle click close too. |
| `TabsList onReorder` | `(values: string[]) => void` |  | Document only; drag and Alt+Arrow. |
| `TabsList activateOnFocus` | `boolean` | `true; false for document` | Arrows select the tab they land on. |
| `TabsList actions` | `ReactNode` |  | After the tabs, outside the scroller. |
| `TabsTrigger kind, pinned, dirty, label, icon` | `Kind, boolean, boolean, string, ReactNode` |  | Document only; label names a pinned tab and the close button. |
| `TabsContent value, keepMounted` | `Base UI Tabs.Panel` |  | keepMounted keeps a hidden panel's state. |
| `TabsCount` | `span` |  | A count after the label, tabular. |
Other props pass through to the root element.

## Variants and states
- variant: default, line, document
- size: default, sm
- states: rest, selected, hover, focus-visible, disabled, overflowing, dirty, pinned, dragging

## Accessibility
- [ ] The list is a tablist named by aria-label; each trigger is a tab with aria-selected and aria-controls.
- [ ] Tab focuses the selected tab; a second Tab goes to the panel.
- [ ] Arrow keys move and select on default and line, skipping disabled and mirroring in RTL.
- [ ] Document tabs use manual activation: arrows move focus only; Enter or Space selects.
- [ ] Home and End jump to the first and last tab.
- [ ] Delete or Backspace closes a closable document tab, named by aria-keyshortcuts. The chip's cross is aria-hidden, so the tablist holds only tabs; the selected tab's named Close button sits beside the list, for touch screen readers and voice control.
- [ ] Alt+Left and Alt+Right reorder a document tab within its group when onReorder is set.
- [ ] A dirty tab carries sr-only "unsaved changes".

## Edge cases
- Long label at 320px -> Tabs never wrap; the list scrolls with a fade. Document tabs cap at 220px.
- 25 tabs at 160px -> One scroller with the end fade; the selected tab scrolls into view.
- Right to left -> Tabs mirror, arrows mirror, and the fade flips.
- Zoom 200% -> Tabs take min-height and grow; the list scrolls.
- Kind on a document tab -> Kept as data-kind but not drawn; the panel header writes the kind.
- One-letter tab -> Keeps 12px side padding.
- Closing a dirty tab -> onClose confirms first: Delete and Backspace close in one keystroke, and Backspace is easy to hit.
- No triggers or no value -> An empty row with its line renders and no panel shows.
- Panel loading or failing -> The panel owns Skeleton or Empty state; the tab switches at once.
- Forced colors -> The selected tab gets a 1px outline; the line paints Highlight.
- Reduced motion -> The line indicator jumps.

## Tokens
--fill, --panel, --line-frame, --line-row, --radius-soft, --radius-inner, --radius-frame, --control, --control-sm, --space-6, --text-2, --text-1, --surface-hover, --surface-page, --surface-selected, --text-disabled, --line-accent, --dur-fast, --ease-step, --ink, --tab-max

## Related
- [Segmented control](/components/segmented-control.md): Two to five views, single or multiple.
- [Collapsible](/components/collapsible.md): Shows and hides one region, or a group of them.
