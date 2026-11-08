---
name: Anti-slop
system: iota
kind: foundation
last-updated: 2026-11-08
human: {{SITE}}/foundations/anti-slop
---

# Anti-slop

The habits of generated UI to avoid, and what to do instead.

## Rules
1. anti-slop-no-caps NEVER Set text in capitals or tracked out; keep sentence case. Because capitals read slower and make every label shout, so a real warning no longer stands out.
   - Correct: `<Status status="running"/>`
   - Wrong: `<span className="uppercase tracking-widest">Running</span>`
2. anti-slop-mono-for-copyable MUST Set mono only for code, commands, paths, IDs, keys and hashes; numbers get the data utility. Because mono marks what a person copies, so a mono duration looks like an id.
   - Correct: `<span className="type-body-sm data">2m 14s</span>`
   - Wrong: `<span className="type-code-sm">2m 14s</span>`
3. anti-slop-no-em-dash NEVER Use an em dash for a pause or an empty value; end the sentence, or write None. Because an empty cell with a dash reads as a minus or a value still loading, and a screen reader may skip it.
   - Correct: `<dd>{run.owner ?? 'None'}</dd>`
   - Wrong: `<dd>{run.owner ?? '\u2014'}</dd>`
4. anti-slop-no-dot-separator NEVER Join facts with a middle dot; give each its own element with a gap. Because a screen reader reads each dot aloud, and the string wraps mid-fact on a phone.
   - Correct: `<span>{model}</span><span>{variant}</span><time>{time}</time>`
   - Wrong: `` `${model} · ${variant} · ${time}` ``
5. anti-slop-no-eyebrow NEVER Put a small category label above a title. Because it repeats the sidebar and makes two headings compete for the first read.
   - Correct: `<h1>Input</h1>`
   - Wrong: `<p className="type-eyebrow">Components</p><h1>Input</h1>`
6. anti-slop-no-side-rail NEVER Mark selection, quotes or panels with a bar on one edge or a stripe across a card; use the wash between frame lines. Because an edge bar reads as a status stripe, so a selected row looks flagged.
   - Correct: `<Item kind="deploy" selected/>`
   - Wrong: `data-selected:shadow-[inset_2px_0_0_var(--accent-mark)]`
7. anti-slop-no-card-grid NEVER Show several numbers as three equal icon cards; compose one stats strip, a table or a sentence. Because equal cards give every number the same weight and push the table the person came for below the fold.
   - Correct: `<PageHeaderStats/>`
   - Wrong: `<Card><Icon/><Stat>42</Stat></Card> x3`
8. anti-slop-no-pill NEVER Round a label, tag or filter fully; use rounded-inner or rounded-soft. Round is for people, the radio and the switch. Because a pill reads as a toggle, so people click a static tag.
   - Correct: `<Badge>Beta</Badge>`
   - Wrong: `<span className="rounded-full px-2">beta</span>`
9. anti-slop-no-box-in-box NEVER Put a bordered or grey box inside a frame; split it with row rules or a well. Because a box in a box stacks edges until no one can tell which group a line closes.
   - Wrong: `<Card><div className="rounded-md border p-3">…</div></Card>`
10. anti-slop-no-centred-empty NEVER Centre an empty state in a big box; put it top-left of the body with the query in a code tag. Because a centred block in a void reads as a template and moves the action away from where the first row was.
   - Wrong: `<Empty align="center" className="min-h-60"/>`
11. anti-slop-no-tinted-alert NEVER Fill an alert with a tinted block; frame it and mark trouble with the status icon and a title that names it. Because a tinted block buries the words under the colour and reads like every Bootstrap alert.
   - Wrong: `<div className="rounded-md bg-red-50 p-4">Sync failed</div>`
12. anti-slop-no-red-button NEVER Fill a destructive button red; give it the fail edge and fail text. Because a red fill is the loudest shape on the page and outshouts the primary action.
   - Wrong: `<Button className="bg-red-600 text-white">Delete</Button>`
13. anti-slop-no-brand-decoration NEVER Fill a header, kind, icon tile or second button with brand; brand fill is the primary button, one per view, and a checked control. Because when headers and tiles are brand too, the primary action no longer stands out.
   - Wrong: `<header className="bg-ink text-text-inverse">Runs</header>`
14. anti-slop-no-hue-wallpaper NEVER Fill a section, card or header with a kind hue; put the hue in a label, a chart line or the selected row. Because a hue names a kind, so a filled section makes everything inside look like that kind.
   - Wrong: `<Section className="bg-accent-field">`
15. anti-slop-no-icon-tiles NEVER Put a category icon in a colored tile; write the kind as a tinted word. Because the tile spends the hue on decoration, and the glyph names nothing a screen reader can read.
   - Wrong: `<span className="bg-accent-mark p-2"><Icon icon={Rocket}/></span>`
16. anti-slop-no-status-dots NEVER Write status as a dot, square or pill; write the word, and color only warn and fail. Because a dot carries status by hue alone, which color-blind people, forced colors and screen readers all lose.
   - Wrong: `<span className="size-2 bg-green-500"/> api@v312`
17. anti-slop-no-outline-rings NEVER Ring a filled mark or badge in a dark 1px outline; leave the fill flat. Because the ring reads as focus or selection, so people think the badge is active.
   - Correct: `<Badge kind="run"/>`
   - Wrong: `<span className="bg-accent-mark shadow-[inset_0_0_0_1px_black]"/>`
18. anti-slop-no-empty-art NEVER Draw art in an empty state; write a title, one muted line and the action. Because the art pushes the action below the fold on a phone and says nothing about why the list is empty.
   - Correct: `<Empty><EmptyTitle>No agents yet</EmptyTitle><EmptyDescription>Create one to start.</EmptyDescription></Empty>`
   - Wrong: `<Empty><PixelRobot/><EmptyTitle>No agents yet</EmptyTitle></Empty>`
19. anti-slop-no-decorative-motion NEVER Pulse, ping, bounce, glow or sweep to look alive; a running status is a small turning arc. Because constant motion takes the eye from the row that changed and keeps moving under reduced motion.
   - Correct: `<Status status="running"/>`
   - Wrong: `<span className="animate-ping rounded-full bg-green-500"/>`
20. anti-slop-no-terminal-cosplay NEVER Use prompt signs, block cursors or bracketed labels outside a terminal; use the normal component. Because a screen reader reads the signs and brackets aloud, and people try to type at the fake cursor.
   - Correct: `<Status status="ok">Deployed</Status>`
   - Wrong: `<p>&gt; [OK] deploy complete_</p>`
21. anti-slop-no-arrow-links NEVER End link text in an arrow or write Learn more; name where the link goes. Because a screen reader listing links hears ten Learn mores and no destination.
   - Correct: `<Link href="/docs/keys">Rotating API keys</Link>`
   - Wrong: `<a>Learn more →</a>`
22. anti-slop-no-shimmer-text NEVER Sweep a gradient through in-progress text; keep the text still and show the running status. Because the sweep drops the text under its contrast floor mid-pass and never says when the work stops.
   - Correct: `<Status status="running"/>`
   - Wrong: `<span className="shimmer">Thinking</span>`
23. anti-slop-no-glass NEVER Blur or fade an overlay, bar or card; use the solid surface and the overlay shadow. Because the page shows through and pulls the overlay text under its contrast floor.
   - Correct: `<div className="bg-page shadow-overlay">`
   - Wrong: `<div className="bg-white/70 backdrop-blur-md">`
24. anti-slop-no-grey-prose NEVER Set a sentence at label-sm in text-3; use body-sm or larger in text-2. Because 12px at the 5:1 floor holds a word or two, and a whole sentence there is tiring to read.
   - Correct: `<p className="type-body-sm text-text-2">Runs older than 30 days move to cold storage.</p>`
   - Wrong: `<p className="type-label-sm text-text-3">Runs older than 30 days move to cold storage.</p>`
25. anti-slop-no-icon-every-label NEVER Put an icon on every button, menu item or heading; icons are for actions found by shape. Because when every item has a glyph, none can be found by its shape.
   - Correct: `<MenuItem>Rename</MenuItem>`
   - Wrong: `<MenuItem><Icon icon={Pencil}/>Rename</MenuItem>`
26. anti-slop-no-filler NEVER Write seamless, robust, effortless or leverage; name the mechanism or the number. Because the words promise without telling the person what happens or how fast.
   - Correct: `Deploys an agent in 42 seconds to 3 regions.`
   - Wrong: `Seamlessly deploy robust agents.`

## Decision table
| You need | Use |
|-|-|
| Distinguish a kind | `<Badge kind/>` |
| Show a state | `<Status/> with its word` |
| Separate containers | `one frame line; rows split by rule-row` |
| Mark selection | `--accent-wash between frame lines` |

## Reject list
- Caps, mono labels, dots between facts, eyebrows.
- Side bars, pills, hue fills, icon tiles, status dots, grey slabs, tinted blocks, centred voids.
- Glass, glow, shimmer, terminal costume.

## Related
- [Color](/foundations/color.md): Five hues name the kind of thing, and amber and red mean trouble.
- [Typography](/foundations/typography.md): One sans for every word, mono for what a person copies.
- [Iconography](/foundations/iconography.md): A few solid icons, only for actions you find by their shape.
