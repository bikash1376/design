---
name: Card
system: iota
source: quartz
kind: component
import: "import {Card, CardHeader, CardTrigger, CardFooter, CardTitle, CardMeta, CardAction, CardDescription, CardContent, cardVariants} from '@/components/iota/ui/card'"
install: "npx shadcn@latest add {{SITE}}/r/card.json"
registryDependencies: [badge, button, icon, kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/card
---

# Card

Draws one frame around everything about one topic, and can fold its body away.

## Use when
- A page has several topics and each needs its own box: spend, usage, invoices.
- Detail most people skip but some need: a tool call's input, a trace step's attributes (collapsible).
- A settings page groups fields; fold the groups so the page fits and keep them deep-linkable.

## Don't use when
- A list of similar things, one per row. Use [Item](/components/item.md).
- Show and hide one region with no box around it. Use [Collapsible](/components/collapsible.md).
- A message about trouble that the person must see. Use [Alert](/components/alert.md).
- A summary or a decision: a few peer rows, one chart, a short read-only fact set, a card that asks Resume or Roll back. Use [Panel](/components/panel.md).

## Minimal example
```tsx
<Card>
  <CardHeader><CardTitle>Tickets</CardTitle></CardHeader>
  <CardContent>112 resolved, 9 escalated.</CardContent>
</Card>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. card-working-surface MUST Use a Card for a working surface: a big table or stream, a trace, a log, code, a form or settings group with fields the person edits, the detail of one object; anything that scrolls, filters, streams or is edited. Use a Panel for a summary or a decision. Because a working surface needs the white frame's edge and the rule under its header to show where it ends, while a glanceable widget reads best as a quiet grey group.
   - Correct: `<Card><CardHeader/><CardContent><form>…</form></CardContent></Card>`
   - Wrong: `<Panel><PanelBody><form>…</form></PanelBody></Panel>`
2. card-no-panel-mix NEVER A widget is a Panel and a working surface is a Card; never a Card inside a Panel or a Panel inside a Card. Because a white card in a grey panel is a box in a box; side by side, the grey widget and the white table tell the person which one to glance at and which one to work in.
   - Correct: `<Panel><PanelBody><div className="rule-row">…</div></PanelBody></Panel>`
   - Wrong: `<Panel><PanelBody><Card/></PanelBody></Panel>`
3. card-no-nested NEVER Put a Card inside a Card; a card is one frame, and rows inside it are split by rule-row, never by a second box. Because a box in a box stacks two edges until no one can tell which group a line closes.
   - Correct: `<Card><CardContent><div className="rule-row">…</div></CardContent></Card>`
   - Wrong: `<Card><Card>…</Card></Card>`
4. card-actions-outside-trigger MUST Put actions in CardAction beside CardTrigger, never inside it. Because CardTrigger is a button, and a button inside it is invalid HTML that also folds the card on every press.
   - Correct: `<CardTrigger>…</CardTrigger><CardAction><Button>Copy</Button></CardAction>`
   - Wrong: `<CardTrigger>search_tickets <Button>Copy</Button></CardTrigger>`
5. card-meta-folded MUST Add a CardMeta that says what is inside to every collapsible card, such as "3 arguments". Because folded, the header is all that shows, and a title alone does not say whether the body is worth opening.
   - Correct: `<CardTrigger><CardTitle>Input</CardTitle><CardMeta>3 arguments</CardMeta></CardTrigger>`
   - Wrong: `<CardTrigger><CardTitle>Input</CardTitle></CardTrigger>`
6. card-title-topic SHOULD Name the topic in 1 to 4 words, sentence case. Because a collapsible card truncates its title to one line.
   - Correct: `<CardTitle>Spend this period</CardTitle>`
   - Wrong: `<CardTitle>Here you can see your spend</CardTitle>`
7. card-no-border-shadow NEVER Add a border or shadow to a Card. Because the card already draws its one edge, and a shadow makes it read as an overlay above the page.
   - Correct: `<Card>…</Card>`
   - Wrong: `<Card className="border shadow-md">…</Card>`
8. card-group-label MUST Give a card that holds a form or group of controls role="group" and aria-labelledby its title. Because Card renders a plain div, so a screen reader tabbing into its fields never hears what they belong to.
   - Correct: `<Card role="group" aria-labelledby="invite-title"><CardTitle id="invite-title">Invite</CardTitle>…</Card>`
   - Wrong: `<Card><CardTitle>Invite</CardTitle><Input/></Card>`
9. card-fold-height SHOULD Link to a page instead of folding a body taller than 480px open. Because a tall body pushes the cards below it off the screen when it opens.
   - Correct: `A card with the last 20 lines and a link to the full conversation`
10. card-link-no-buttons NEVER Put a button inside a Card rendered as a link. Because a button inside a link is invalid HTML, and a press on it also follows the link.
   - Correct: `<Card render={<a href="/billing"/>}><CardTitle>Open billing</CardTitle></Card>`
   - Wrong: `<Card render={<a href="/billing"/>}><Button>Pay</Button></Card>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Card size` | `'sm' \| 'default' \| 'lg'` | `'default'` | 12, 16 or 24px spacing. |
| `Card kind` | `Kind` |  | The kind badge on a collapsible header; write the kind in the header too. |
| `Card collapsible` | `boolean` | `false` | Takes open, defaultOpen, onOpenChange, disabled. |
| `Card render` | `ReactElement` |  | Static cards only: a link, form or section. |
| `CardTrigger disabled` | `boolean` | `false` | Collapsible only. |
Other props pass through to the root element.

## Variants and states
- size: sm, default, lg
- collapsible: false, true
- states: rest, folded, open, trigger hover, trigger focus-visible, trigger disabled, link hover

## Accessibility
- [ ] A collapsible trigger is a button with aria-expanded and aria-controls, named by title and meta.
- [ ] A folded body uses hidden="until-found", so find-in-page and fragment links open it.
- [ ] Enter or Space toggles the trigger; Tab reaches the trigger, then each action.
- [ ] Use role="group" with aria-labelledby on a card that holds controls.
- [ ] Disabled trigger is keyed off aria-disabled; search still opens the body.

## Edge cases
- Very long title -> Wraps in a static card; truncates in a collapsible header and keeps the caret and actions.
- One-word title -> The header keeps 40px.
- Empty body -> Disable the trigger when there is nothing to show.
- Wide child -> overflow-hidden clips it; a table inside scrolls itself.
- Right to left -> The caret and the actions move to the left edge.
- Zoom 200% -> The header grows with the text; the body follows its content.
- Toggled ten times in a second -> Ends in the last state; the body cuts, so nothing lags.
- Inside a form -> The trigger is type="button" and never submits.
- Request failed inside -> Show an Alert inside; the card does not change.
- Forced colors -> The frame line survives as CanvasText; the kind badge keeps its text.
- Reduced motion -> Nothing changes: the body already cuts.

## Tokens
--surface-page, --line-frame, --line-row, --accent-mark, --radius-frame, --space-3, --space-4, --space-6, --surface-hover, --line-focus, --dur-fast, --ease-step, --type-label, --type-label-sm, --type-body-sm, --text-3

## Related
- [Panel](/components/panel.md): A grey widget for an overview or settings screen: header on the grey, content in a white body.
- [Collapsible](/components/collapsible.md): Shows and hides one region, or a group of them.
- [Item](/components/item.md): The list row: media, title, meta, status and actions.
- [Alert](/components/alert.md): A message about the current view, inline or across the page.
