---
name: Badge
system: iota
source: quartz
kind: component
import: "import {Badge, badgeVariants, CodeTag, codeStatus, codeTone, kindLabels} from '@/components/iota/ui/badge'"
install: "npx shadcn@latest add {{SITE}}/r/badge.json"
registryDependencies: [kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/badge
---

# Badge

Labels a kind, a code or a trouble attribute next to what it describes.

## Use when
- A row or header needs the kind, category or count of a thing, read at a glance.
- A state is static while the view is open: over budget, revoked, read only.
- A row shows an HTTP method or status code: CodeTag.
- A title or row says which kind of thing it is: follow the name with a kind label, never an icon.

## Don't use when
- The person can press it to filter, remove or open a menu. Use [Chip](/components/chip.md).
- The state changes while the person watches: queued, running, ok. Use [Status](/components/status.md).
- A big number is the point of the view. Use [Stat](/components/stat.md).
- A message about trouble needs a sentence and an action. Use [Alert](/components/alert.md).

## Minimal example
```tsx
<Badge kind="run"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. badge-kind-prop MUST Pass kind for agent, key, run, deploy or model; never a colored class. Because kind sets data-kind, the word and the tint together, and a hand-set class misses the label step that passes contrast.
   - Correct: `<Badge kind="agent"/>`
   - Wrong: `<Badge className="bg-accent-tint" data-kind="agent">triage</Badge>`
2. badge-kind-quiet-word MUST Follow the name with the quiet kind word; no hue square and no icon. Because the name is what the person scans for, and a square or icon in front pulls the eye to the kind instead.
   - Correct: `refund-eval <Badge kind="run"/>`
   - Wrong: `<Icon icon={Flash}/> refund-eval`
3. badge-no-ink NEVER Fill a badge with brand; a count waiting on the person reading is an InkSlot, the paper waiting label. Because brand fill is the primary action, and an brand badge for a plan or a category makes a label look like something to press.
   - Correct: `<InkSlot>3 waiting on you</InkSlot>`
   - Wrong: `<Badge className="bg-inverse text-text-inverse">Pro</Badge>`
4. badge-code-tag MUST Write HTTP methods and status codes with CodeTag; never colour a method. Because CodeTag puts the status on the line and keeps the text brand, and a red DELETE reads as trouble when it is a normal call.
   - Correct: `<CodeTag>DELETE</CodeTag> <CodeTag code={503}/>`
   - Wrong: `<Badge status="fail">DELETE</Badge> <Badge status="fail">503</Badge>`
5. badge-overflow-count SHOULD Show 3 badges of one sort and a ghost +n badge for the rest.
   - Correct: `{scopes.slice(0, 3).map(s => <Badge key={s}>{s}</Badge>)}<Badge variant="ghost">+{scopes.length - 3}</Badge>`
   - Wrong: `{scopes.map(s => <Badge key={s}>{s}</Badge>)}`
6. badge-count-number MUST Pass the number to count; it caps at max and keeps the exact figure for screen readers. Because a hand-made "99+" is all a screen reader hears, and the real number is lost.
   - Correct: `<Badge count={n}/>`
   - Wrong: `<Badge>{n > 99 ? "99+" : n}</Badge>`
7. badge-label-words SHOULD Write 1 to 3 words in sentence case, or one identifier, with no end punctuation. Because the badge is whitespace-nowrap, so a sentence runs out of its row.
   - Correct: `<Badge status="warn">Over budget</Badge>`
   - Wrong: `<Badge status="warn">This release has breaking changes.</Badge>`
8. badge-not-control NEVER Put onClick on a Badge; render it as a link with render={<a href/>} or use Chip. Because Badge renders a span, so it takes no focus, no Enter and no button role.
   - Correct: `<Chip kind="agent">agent</Chip>`
   - Wrong: `<Badge onClick={openFilter}>agent</Badge>`
9. badge-no-hue-text NEVER Color badge text for good or bad; trouble is outlined in its line step with brand text (status warn or fail). Because green is not a iOTA status, and hue alone vanishes for color-blind readers and in forced colors.
   - Correct: `<Badge>Healthy</Badge>`
   - Wrong: `<Badge className="text-green-600">Healthy</Badge>`
10. badge-no-pill NEVER Round a badge into a pill; keep the 4px inner corner. Because round belongs to person avatars and radios in iOTA, so a pill badge reads as one of them.
   - Correct: `<Badge>New</Badge>`
   - Wrong: `<Badge className="rounded-full">New</Badge>`
11. badge-label-width SHOULD Wrap a label that may pass 24 characters in a truncate span and set max-w-full. Because the badge never wraps, so a long model name pushes its row wider than the column.
   - Correct: `<Badge kind="model" label={<span className="truncate">{name}</span>} className="max-w-full"/>`
   - Wrong: `<Badge kind="model" label={veryLongName}/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `variant` | `'secondary' \| 'outline' \| 'ghost' \| 'link'` | `'secondary'` | secondary is the tint. |
| `size` | `'default' \| 'sm'` | `'default'` | 20px or 16px tall. |
| `kind` | `Kind` |  | Shows the kind word on its tint. |
| `status` | `'warn' \| 'fail'` |  | Warning or Failed, outlined in the reserved line. |
| `label` | `ReactNode` |  | Replaces the kind's word. |
| `count` | `number` |  | Replaces children; formats thousands. |
| `max` | `number` | `99` | Cap for count. |
| `render` | `ReactElement` |  | Renders another element, such as an anchor. |
| `CodeTag code` | `number \| string` |  | 5xx draws the fail line, 4xx the warn line; children replace the text. |
| `CodeTag status` | `'neutral' \| 'warn' \| 'fail'` |  | Overrides the status code picks. |
| `CodeTag fill` | `'soft' \| 'solid' \| 'outline'` | `'soft'` | soft is a grey fill; solid is brand, or the status mark (amber, red) with dark text, for a column of status codes; outline is a line only, for a method beside a solid code. |
Other props pass through to the root element.

## Variants and states
- variant: secondary, outline, ghost, link
- size: default, sm
- kind: agent, key, run, deploy, model
- states: rest, hover (link), focus-visible (link), count capped, warn, kind, fail

## Accessibility
- [ ] A badge takes no focus; only a badge rendered as a link does, with a 2px brand outline.
- [ ] A kind badge names its kind in a word; the hue never carries it alone.
- [ ] A capped count keeps the exact figure in the title and the accessible name.
- [ ] Keep the label at 4.5:1 on its tint in both themes; outlined text is brand on paper and its line is 3:1.
- [ ] A badge link is 20px tall; give it 4px of gap or set it inside running text.

## Edge cases
- Long label -> Never wraps; truncate it with max-w-full and a truncate span.
- One character -> Keeps a 20px minimum width, so "1" is a square.
- No children -> Renders an empty 20px square with no name; render nothing instead. count={0} shows "0".
- 25 badges in a 160px row -> Wrap with flex-wrap; in a nowrap row they push it wider.
- Right to left -> Padding is symmetric; the label reads from the start.
- Zoom 200% -> Height grows with the text; min-h-5 holds the box.
- Text spacing -> The badge widens; nothing clips.
- On a warn or fail row -> The outline keeps its line on the wash; the text stays brand.
- Count waiting on data -> Leave the badge out until the number lands; never show "0".
- NaN or negative count -> Renders "NaN" or "-3"; pass finite non-negative integers.
- Forced colors -> Fills drop; label sizes take a 1px CanvasText outline.

## Tokens
--accent-tint, --accent-label, --accent-line, --line-control, --surface-page, --text-1, --text-2, --surface-hover, --dur-fast, --type-label-sm, --type-tag, --radius-inner

## Related
- [Chip](/components/chip.md): An interactive token: filter toggle, removable value or menu trigger.
- [Status](/components/status.md): Idle, queued, running, waiting, ok, warn and fail, as a mark or a word.
- [Stat](/components/stat.md): A plain numeral with its label, delta and trend.
- [Avatar](/components/avatar.md): A person, agent or source icon, alone or grouped.
