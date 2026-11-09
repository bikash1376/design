---
name: Toast
system: iota
kind: component
import: "import {Toaster, toast, toastManager, readingTimeout} from '@/components/iota/ui/toast'"
install: "npx shadcn@latest add {{SITE}}/r/toast.json"
registryDependencies: [button, css-var, direction, icon, portal, status, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/toast
---

# Toast

Briefly confirms an action, then goes away.

## Use when
- The result of what the person just did is not visible where they are: copied, published.
- A background event finished or changed: an index rebuilt, an inbox sync fell behind.
- An action can be undone for a short time: archive with Undo.

## Don't use when
- The message must stay until its cause is fixed. Use [Alert](/components/alert.md).
- A form field is wrong. Use [Field](/components/field.md).
- The result is already visible in the view. Use [Progress](/components/progress.md).
- The person must decide before continuing. Use [Dialog](/components/dialog.md).

## Minimal example
```tsx
toast.success('Published refund-prompt v14', {
  description: 'Version 14 is live.',
  action: {label: 'View', onClick: openRelease},
})
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. toast-errors-held MUST Report a failure with toast.fail, never toast() with fail words. Because a plain toast() times out and waits behind the limit, while toast.fail stays until closed and always shows.
   - Correct: `toast.fail("Couldn't save the key")`
   - Wrong: `toast("Couldn't save")`
2. toast-fail-cause SHOULD Name what failed and why in a fail toast, and offer the retry as the action.
   - Correct: `toast.fail("Couldn't delete refund-agent", {description: 'It still has 2 open conversations.'})`
   - Wrong: `toast.fail('Error')`
3. toast-reading-time MUST Leave timeout unset so the reading time applies; pass timeout: 0 only to hold a toast. Because a fixed 3000ms takes the toast away before the person reads it and decides on Undo.
   - Correct: `toast('Archived 3 tickets', {action: undo})`
   - Wrong: `toast('Archived 3 tickets', {timeout: 3000, action: undo})`
4. toast-one-host MUST Mount one Toaster at the app root and call toast() from anywhere. Because every Toaster reads the same manager, so two mounted Toasters show each toast twice.
   - Correct: `<Toaster/> once in the app shell`
   - Wrong: `<Toaster/> in every panel`
5. toast-update-in-place MUST Use toast.promise, or reuse the id with toast.update, when work finishes later. Because toast.loading never times out, so a separate success toast leaves "Rebuilding" on screen beside "Rebuilt".
   - Correct: `toast.promise(rebuild(), {loading: 'Rebuilding index', success: 'Rebuilt index', fail: 'Rebuild failed'})`
   - Wrong: `toast.loading('Rebuilding'); ...; toast.success('Rebuilt')`
6. toast-title-past SHOULD Write a success title in the past tense with its object under 48 characters: 'Published refund-prompt v14'.
   - Correct: `toast.success('Key created')`
   - Wrong: `toast.success('Success!')`
7. toast-not-only-path MUST Make a toast's action reachable in the view too, such as Undo in the row menu. Because the toast leaves on its timer, and a keyboard or screen reader user may never reach its button.
8. toast-no-confirm-everything NEVER Toast after every save; toast only when the result is not visible where the person is. Because a toast for a change already on screen teaches people to ignore the stack, including the fail that matters.
   - Correct: `The field shows the new value; no toast.`
   - Wrong: `onChange={() => { setName(v); toast('Name updated'); }}`
9. toast-no-emoji NEVER Put an emoji or an exclamation mark in a title. Because a screen reader reads "party popper" before the title, and the title already says what happened.
   - Correct: `toast.success('Published refund-prompt v14')`
   - Wrong: `toast.success('🎉 Published!')`
10. toast-stack-limit SHOULD Keep the Toaster limit at 3 and let the rest wait.
   - Correct: `<Toaster/>`
   - Wrong: `<Toaster limit={10}/>`
11. toast-loading-ring SHOULD Let a loading toast show its own ring; never add a spinner to its title. Because the toast already leads with a running ring, and a second spinner pushes the title off its edge.
   - Correct: `toast.loading('Rebuilding the policy index')`
   - Wrong: `toast.loading(<><Spinner/>Rebuilding index</>)`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `toast(title, options)` | `string` |  | Returns an id. Also toast.success, .warn, .fail, .loading. |
| `options.description` | `ReactNode` |  | One line under the title. |
| `options.action` | `{label, onClick}` |  | One action; adds 3 seconds. |
| `options.timeout` | `number` | `reading time` | ms; 0 holds. fail and loading default to 0. |
| `options.id` | `string` | `generated` | Reusing an id replaces in place. |
| `toast.promise(p, {loading, success, fail})` | `Promise` |  | Loading, then success (timed) or fail (held). |
| `toast.update(id, kind, title, options)` | `function` |  | Replaces it in place, action included; the timer restarts. |
| `toast.dismiss(id?)` | `function` |  | Closes one toast, or all. |
| `readingTimeout(title, description?, hasAction?)` | `number` |  | 3s + 60ms a character, +3s with an action, 4 to 12s. |
| `Toaster inline, limit, manager` | `boolean, number, manager` | `false, 3` | Mount once; inline renders a non-live example in place for docs. |
Other props pass through to the root element.

## Variants and states
- kind: default, success, warn, fail, loading
- states: entering, counting down, paused, held, loading to done, swiping, waiting, leaving

## Accessibility
- [ ] The viewport is a region labelled Notifications with aria-live="polite"; F6 moves focus into the stack and pauses timers.
- [ ] A fail toast has priority high and is repeated in a role="alert" node.
- [ ] Each toast is a dialog named by its title and described by its description.
- [ ] Tab moves through action and close; Escape closes the focused toast.
- [ ] The close button is named Dismiss; the drain line is aria-hidden decoration beside the words.
- [ ] Hover, focus in the stack and window blur pause the timer and the drain line.
- [ ] The stack clears the safe area inset; a swipe down or to the end dismisses.

## Edge cases
- Long title or 36-character ID -> Wraps and breaks; the toast grows and the reading time caps at 12 seconds.
- Ten toasts in a second -> Three show, the rest wait with timers stopped; a fail never waits.
- Empty title -> Adds nothing and returns an empty id.
- Right to left -> The stack sits at the inline end, a swipe toward that edge dismisses, and the drain line shrinks toward the start.
- Promise never settles -> The loading toast stays until closed.
- Reused id -> Replaces in place instead of stacking.
- Opened from a Dialog -> Portals into .iota and sits above it.
- Forced colors -> Each toast gets a 1px outline; words carry the kind.
- Reduced motion -> No rise or fade; the drain line is hidden; the timer still runs.

## Tokens
--surface-page, --text-1, --elev-overlay, --radius-frame, --toast-width, --gutter, --gutter-sm, --warn-text, --fail-text, --dur-spin, --type-label, --type-body-sm, --text-2, --text-3, --dur-base, --ease-step, --toast-read-base, --toast-read-char, --toast-read-action, --toast-read-min, --toast-read-max

## Related
- [Alert](/components/alert.md): A message about the current view, inline or across the page.
- [Progress](/components/progress.md): Bar, ring, steps or meter.
- [Dialog](/components/dialog.md): Modal work, with alert and typed-confirm variants.
- [Empty state](/components/empty-state.md): A region with nothing to show, that failed, or that the person cannot see.
