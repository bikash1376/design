---
name: Kbd
system: iota
kind: component
import: "import {Kbd, KbdGroup, shortcut} from '@/components/iota/ui/kbd'"
install: "npx shadcn@latest add {{SITE}}/r/kbd.json"
registryDependencies: [theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/kbd
---

# Kbd

Shows the key or shortcut that does something.

## Use when
- A hint, menu item or tooltip names the shortcut for an action.
- Docs or onboarding tell the person which key to press.

## Don't use when
- The text is code to type, not a key to press. Use [Code block](/components/code-block.md).
- The shortcut is the only way to do the action. Add a visible control and name the shortcut beside it.

## Minimal example
```tsx
<Kbd keys="mod+k"/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. kbd-keys-string MUST Pass keys="mod+k" for a modifier shortcut instead of choosing the command or Ctrl glyph yourself. Because a hand-picked glyph flashes Ctrl to a Mac user at hydration and has no spoken name.
   - Correct: `<Kbd keys="mod+k"/>`
   - Wrong: `<Kbd>{mac ? '⌘' : 'Ctrl'}</Kbd><Kbd>K</Kbd>`
2. kbd-pair-aria MUST Set aria-keyshortcuts on the control with both forms (Meta+K Control+K). Because a Kbd beside the control is only text; aria-keyshortcuts is what a screen reader reports on the control.
   - Correct: `<Button aria-keyshortcuts="Meta+Enter Control+Enter">Send</Button>`
   - Wrong: `<Button>Send</Button> <Kbd keys="mod+enter"/>`
3. kbd-key-names SHOULD Use the platform's label: Esc, Enter, Tab, Space, arrows as up, down, left, right, letters upper-case.
   - Correct: `<Kbd>Esc</Kbd>`
   - Wrong: `<Kbd>escape</Kbd>`
4. kbd-not-only-way MUST Make the same action reachable by a visible control. Because a phone has no keyboard, and a shortcut stays unknown until someone learns it.
5. kbd-no-3d NEVER Draw keys as 3D caps with a bottom border or shadow. Because only overlays cast a shadow in iOTA, and the key is flat paper with a 1px control edge.
   - Correct: `<Kbd>K</Kbd>`
   - Wrong: `<Kbd className="border-b-2 shadow">K</Kbd>`
6. kbd-shortcut-length SHOULD Use a shortcut of 3 keys or fewer; pick a shorter one or a sequence (G then R).
   - Correct: `<Kbd keys="mod+shift+p"/>`
   - Wrong: `<Kbd keys="mod+shift+alt+p"/>`
7. kbd-hide-on-touch SHOULD Hide shortcut hints on phones; Kbd stays inert.
8. kbd-aria-hidden-in-control SHOULD Set aria-hidden on a Kbd inside a control that sets aria-keyshortcuts. Because its spoken keys join the control's name.

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `keys` | `string` |  | mod, cmd, ctrl, shift, alt, enter, esc, backspace, tab, space, up, down, left, right or any key, joined by +. |
| `children` | `ReactNode` |  | A single key, when keys is not used. |
| `KbdGroup` | `div props` |  | Wraps combinations and sequences. |
Other props pass through to the root element.

## Variants and states
- context: paper, card, text-hint, inverse
- states: rest, platform-read

## Accessibility
- [ ] Kbd is a kbd element, not focusable, with pointer-events none.
- [ ] A shortcut carries a screen-reader-only spoken form ("Command K" on a Mac, "Control K" elsewhere); the caps are aria-hidden.
- [ ] Forced colors keep a 1px outline on each cap.
- [ ] The platform is read at hydration; before it, differing keys render blank caps with data-placeholder.

## Edge cases
- Platform differences -> keys="mod+k" renders the symbols on a Mac and the words elsewhere.
- Narrow box -> Caps wrap between each other; a long key name wraps inside its cap.
- Right to left -> Caps keep their key order; the group mirrors only its gap.
- Inside a tooltip hint -> Paper caps on the inverse hint, in text-1; the channels flip, so both themes read.
- Without JavaScript -> Keys whose forms differ show blank caps; only the client knows the platform.
- Unknown key name -> keys="mod+foo" shows foo as typed.
- Empty Kbd -> A 20px blank cap; keys="" draws nothing. Do not render without a key.
- Zoom 200% -> The cap is at least 20px tall and grows with the text.

## Tokens
--line-control, --surface-page, --text-2, --type-tag, --radius-inner, --text-inverse, --text-1

## Related
- [Tooltip](/components/tooltip.md): Names an icon button or shows a shortcut; never holds anything essential.
- [Command](/components/command.md): A searchable command list, the core of the command palette.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
- [Code block](/components/code-block.md): Highlighted code, one-line commands and inline code, with copy.
