---
name: Motion
system: iota
kind: foundation
version: 1
last-updated: 2026-11-08
human: {{SITE}}/foundations/motion
---

# Motion

Fast and only when something changes, with a few slow brand moments.

## When to animate
Ask how often the person sees it.
- Hundreds of times a day (shortcuts, palette toggles): no animation.
- Tens of times a day (hover, list navigation): remove or cut it right down.
- Occasionally (menus, dialogs, toasts): standard animation.
- Rarely (first load, the hero, a finished export): this is where delight belongs.

Every animation needs a job: where a thing came from, what changed, or that a press landed. "It looks nice" is not a job on a frequent action.

## Easing and duration
| Motion | Easing | Duration |
|-|-|-|
| Enter and exit | `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-step`) | 120 to 200ms |
| On-screen move | `cubic-bezier(0.77, 0, 0.175, 1)` | 200 to 300ms |
| Press | ease-out | 100 to 160ms |
| Hover and color | `ease` | 150ms |
| Constant loop | `linear` | Any |
| Drag, momentum, thumb | spring, bounce 0.1 to 0.3 | Interruptible |

Exits run faster than entrances. Never use `ease-in` on UI: it delays the first frame, which is the one people watch.

## Rules
1. motion-transform-opacity MUST Animate only transform and opacity. Because anything else repaints or reflows per frame.
2. motion-no-scale-zero NEVER Enter from scale(0). Start at 0.95 with opacity 0. Because nothing real appears from nothing.
3. motion-origin MUST Scale a popover from its trigger with `origin-(--transform-origin)`; keep modals centered. Because the origin says what opened it.
4. motion-press MUST Give pressables `active:scale-[0.97]`. Because it confirms the press before anything loads.
5. motion-no-transition-all NEVER Write `transition: all`. Because it animates things you did not choose, including layout.
6. motion-css-interruptible SHOULD Use CSS transitions for rapid state changes, and keyframes only for fixed loops. Because a keyframe restarts from zero when interrupted.
7. motion-stagger SHOULD Stagger 30 to 80ms, never blocking input. Because a list that makes you wait is decoration in your way.
8. motion-tooltip-delay SHOULD Delay the first tooltip, then open neighbours at once. Because scanning a toolbar should not feel slow.
9. motion-reduced MUST Keep opacity and color under reduced motion and drop movement. Because that is what the setting asks for.
10. motion-hover-fine MUST Wrap hover motion in `@media (hover: hover) and (pointer: fine)`. Because on touch a hover state sticks after the tap.
11. motion-drag-spring SHOULD Capture the pointer during a drag, treat under 4px as a click, carry the release velocity, and damp past bounds. Because a drag should feel like an object.

## Scrollbars
Scrollbars are 2px, appear while scrolling and fade a second after it stops. `IotaPortalProvider` handles this for the whole app.

## Stack
- Motion for shared layout, springs and presence.
- CSS for the float, press and hover.
- Torph's TextMorph for a label that changes in place.
- Lenis for smooth scrolling of long panels, never on the page behind a modal.

## Brand moments
The wordmark morph, the canvas float and marketing reveals may loop or run long. They are rare, they carry no information, and they stop under reduced motion. Product UI does not borrow them.
