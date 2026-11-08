---
name: Avatar
system: iota
source: quartz
kind: component
import: "import {Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarInitials, AvatarGroup, AvatarGroupCount, avatarVariants, initialsOf} from '@/components/iota/ui/avatar'"
install: "npx shadcn@latest add {{SITE}}/r/avatar.json"
registryDependencies: [icon, status, theme, truncate, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/avatar
---

# Avatar

Shows who did something: a person, an agent or a source.

## Use when
- A row, message or event shows who did it: a person or an agent.
- Several people or agents share one thing and the count matters more than each name.
- A linked source or integration needs its icon: type="source".

## Don't use when
- The thing has a kind but no identity (a run, a key). Use [Badge](/components/badge.md).
- The person needs every name readable at once. Use [Item](/components/item.md).
- Presence or progress is the whole point. Use [Status](/components/status.md).

## Minimal example
```tsx
<Avatar name="Ana Marsh" src={user.photo}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. avatar-name-prop MUST Pass name and let Avatar make the initials and the accessible name. Because without name the root gets no role="img" or aria-label, and hand-cut initials skip the fit that drops to one letter.
   - Correct: `<Avatar name={name}/>`
   - Wrong: `<Avatar><AvatarFallback>{name.split(" ").map(w => w[0])}</AvatarFallback></Avatar>`
2. avatar-name-full MUST Pass the full display name, not a handle fragment. Because name is the accessible name and the +N hint, so a screen reader hears "am" and initials come out as AM.
   - Correct: `<Avatar name="Ana Marsh"/>`
   - Wrong: `<Avatar name="am"/>`
3. avatar-group-max MUST Wrap more than 4 avatars in AvatarGroup with max 3 to 5 and name each one. Because a bare row never folds, and the +N can only list the hidden people that carry a name.
   - Correct:
     ```tsx
     <AvatarGroup max={4} label="People on this ticket">{people.map(p => <Avatar key={p.id} name={p.name}/>)}</AvatarGroup>
     ```
   - Wrong: `<div className="flex">{people.map(p => <Avatar key={p.id}/>)}</div>`
4. avatar-decorative-beside-name MUST Pass decorative when the name is written next to the avatar. Because otherwise a screen reader reads the name twice, once from the avatar and once from the text.
   - Correct: `<Avatar name="Maya Chen" decorative/> Maya Chen`
   - Wrong: `<Avatar name="Maya Chen"/> Maya Chen`
5. avatar-status-named MUST Use AvatarBadge with a label that names the status, such as Online. Because a colored dot says nothing to a screen reader, while the badge label joins the name as "Maya Chen, Online".
   - Correct: `<AvatarBadge status="ok" label="Online"/>`
   - Wrong: `<span className="absolute bottom-0 right-0 size-2 bg-green-500"/>`
6. avatar-source-local MUST Serve a source src from your own origin or cache, never a favicon service URL. Because a favicon service learns every domain the person cites and breaks when it is down or blocked.
   - Correct: `<Avatar type="source" src={integration.iconUrl} name={integration.name}/>`
   - Wrong: `` <Avatar type="source" src={`https://favicons.example/${domain}`}/> ``
7. avatar-agent-not-round NEVER Show an agent as a round avatar with a robot photo; use type="agent". Because round means a person in iOTA, so a round agent reads as a teammate wrote the change.
   - Correct: `<Avatar type="agent" name="triage"/>`
   - Wrong: `<Avatar><AvatarImage src="/robot.png"/></Avatar>`
8. avatar-no-gradient-initials NEVER Give initials a gradient or a hue per person. Because hue names a kind in iOTA, so a pink person reads as a kind of actor that does not exist.
   - Correct: `<Avatar name="Ana Marsh"/>`
   - Wrong: `<AvatarFallback className="bg-gradient-to-br from-pink-400">AM</AvatarFallback>`
9. avatar-group-hint-names SHOULD Say the count in words beside a group that folds more than 12 names. Because the +N hint lists every hidden name in one line, which stops being readable past a dozen.
   - Correct: `<AvatarGroup max={3}>{…}</AvatarGroup> <span>40 people</span>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Avatar type` | `'person' \| 'agent' \| 'source'` | `'person'` | person is round, agent a tinted square, source a square. |
| `Avatar size` | `'2xs' \| 'xs' \| 'sm' \| 'default' \| 'lg'` | `'default'` | 16, 20, 24, 32, 40px. |
| `Avatar name` | `string` |  | A person's initials and the accessible name; an agent shows the bot glyph. |
| `Avatar src` | `string` |  | Shorthand for AvatarImage plus AvatarFallback. |
| `Avatar decorative` | `boolean` | `false` | Hides it from assistive tech. |
| `AvatarBadge status, label` | `StatusValue, string` |  | The corner status. |
| `AvatarGroup max, label, size` | `number, string, size` |  | max counts the +N. |
Other props pass through to the root element.

## Variants and states
- type: person, agent, source
- size: 2xs, xs, sm, default, lg
- states: image, initials, no name, status, folded +N, focus-visible +N

## Accessibility
- [ ] Avatar is role="img" named by name or aria-label; decorative sets aria-hidden.
- [ ] A group is a list named by label; +N is a list item that names the hidden people.
- [ ] Tab focuses a +N that has names and opens the list; Escape closes it; a tap toggles it.
- [ ] AvatarBadge label joins the avatar name: "Maya Chen, Online, image".
- [ ] An avatar with no name and no aria-label has no accessible name; always pass one.

## Edge cases
- Very long name -> Two initials and a long accessible name; the box never grows.
- One-word or one-letter name -> One letter gives one initial; a word gives its first two; 24px and under show one.
- No name, no image -> An empty edge, round for a person; sources show a globe. Pass aria-label.
- 40 avatars, max 4 -> Shows 3 and +37; the hint lists 37 names and wraps at 420px.
- Right to left -> The group overlaps with logical margins, from the right.
- Zoom 200% -> Initials measure themselves: two letters drop to one, then scale to the box.
- Slow image -> The fallback holds the same box; the image swaps in with no shift.
- Broken src -> The broken image never paints; the fallback stays.
- Inside a link -> Make the avatar decorative and let the link carry the name.
- src changes ten times in a second -> The fallback stays until the last one loads.
- 200 avatars with initials -> Each adds a ResizeObserver; pass src or hide initials in rows that do not need a person.
- Forced colors -> Fallback and +N keep a 1px outline; the source globe shows in currentColor.

## Tokens
--radius-soft, --radius-full, --line-control, --text-1, --type-label-sm, --type-label, --accent-tint, --accent-label, --surface-page, --line-frame, --mark-size, --ring-cutout

## Related
- [Badge](/components/badge.md): A static label for a count, category or kind, shown as a tinted word.
- [Item](/components/item.md): The list row: media, title, meta, status and actions.
- [Status](/components/status.md): Idle, queued, running, waiting, ok, warn and fail, as a mark or a word.
- [Tooltip](/components/tooltip.md): Names an icon button or shows a shortcut; never holds anything essential.
