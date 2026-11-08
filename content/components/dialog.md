---
name: Dialog
system: iota
source: quartz
kind: component
import: "import {Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogAction, DialogConfirmField, dialogVariants, dialogSurface, useDialog} from '@/components/iota/ui/dialog'"
install: "npx shadcn@latest add {{SITE}}/r/dialog.json"
registryDependencies: [badge, button, field, icon, overlay, portal, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/dialog
---

# Dialog

Holds the page for a short task or a choice that must finish first. A grey shell holding one white card (the title, the X and the content), with the actions on the grey.

## Use when
- The person must finish or abandon a short task before the page makes sense again: rename, create a key, edit a secret.
- An action needs one yes or no and the page should not change until it gets one: stop a run, revert a prompt release.
- The action cannot be undone and deletes something with a name: an agent, a member, a key.

## Don't use when
- The task takes more than one screen of fields, or the page must stay beside it. Use [Sheet](/components/sheet.md).
- A few lines next to a control and the page stays usable. Use [Popover](/components/popover.md).
- The message reports a result and needs no answer, or the action is undoable (toast with Undo). Use [Toast](/components/toast.md).

## Minimal example
```tsx
<Dialog>
  <DialogTrigger render={<Button variant="secondary"/>}>Rename agent</DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Rename agent</DialogTitle></DialogHeader>
    <DialogFooter><DialogClose>Cancel</DialogClose><DialogAction onAction={save}>Save</DialogAction></DialogFooter>
  </DialogContent>
</Dialog>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. dialog-controlled-not-mounted MUST Pass open and onOpenChange; never render the dialog conditionally. Because defaultOpen is read once, so after Escape the parent still holds editing and the dialog will not open again.
   - Correct: `<Dialog open={editing} onOpenChange={setEditing}>…</Dialog>`
   - Wrong: `{editing && <Dialog defaultOpen>…</Dialog>}`
2. dialog-action-promise MUST Return the server promise from onAction; never close in onClick. Because closing in onClick drops a failed save without a word, where onAction holds the dialog pending and shows the error.
   - Correct: `<DialogAction onAction={() => save()} pendingLabel="Saving">Save</DialogAction>`
   - Wrong: `<DialogAction onClick={() => { save(); setOpen(false); }}>Save</DialogAction>`
3. dialog-destructive-default-dismiss NEVER Set defaultAction="primary" beside a destructive action; leave it unset or "dismiss". Because Enter outside a field would then press Delete.
   - Correct: `<DialogFooter>…<DialogAction variant="destructive">Delete</DialogAction>`
   - Wrong: `<DialogFooter defaultAction="primary">…<DialogAction variant="destructive">Delete</DialogAction>`
4. dialog-typed-confirm-irreversible MUST Use role="alertdialog" with confirmText and a DialogConfirmField to delete for good a thing that holds others, such as an agent, a workspace or a data source; one record, such as a prompt release or a run, takes a plain alertdialog. Because a stray click or Enter deletes it for good, and typing the name makes the person read which one, while typing for every record trains them to type through the real one.
   - Correct: `<Dialog role="alertdialog" confirmText="refund-agent">… <DialogConfirmField/> …`
   - Wrong: `<Dialog><DialogContent>Delete refund-agent? <DialogAction variant="destructive">Delete</DialogAction>`
5. dialog-no-confirm-reversible NEVER Confirm an undoable action; do it and show a toast with Undo. Because a confirm on every undoable action trains people to click through, so they click through the real one too.
   - Correct: `toast('Run archived', {action: {label: 'Undo', onClick: restore}})`
   - Wrong: `<Dialog role="alertdialog">Archive run 4812?</Dialog>`
6. dialog-title-label MUST Title a dialog in a few words; put the explanation in DialogDescription. With one field, the title names it: give the field an aria-label, not a second visible title. Because the title is a 16px heading on the X's line, so a sentence wraps beside the X and pushes the body down.
   - Correct: `<DialogTitle>Delete refund-agent?</DialogTitle>`
   - Wrong: `<DialogTitle>This will permanently delete the agent and all of its runs</DialogTitle>`
7. dialog-title-verb-object MUST Title an alert as a question ("Stop run 4812?") and work as a verb phrase ("Rename agent"); never "Are you sure?". Because "Are you sure?" names neither the action nor the object, so a screen reader opening it hears no context.
   - Correct: `<DialogTitle>Stop run 4812?</DialogTitle>`
   - Wrong: `<DialogTitle>Are you sure?</DialogTitle>`
8. dialog-buttons-repeat-verb SHOULD Repeat the title verb on the primary ("Stop run") and label the dismiss with what it keeps or "Cancel".
   - Correct: `<DialogClose>Keep running</DialogClose><DialogAction>Stop run</DialogAction>`
   - Wrong: `<DialogClose>No</DialogClose><DialogAction>Yes</DialogAction>`
9. dialog-description-consequence SHOULD State the consequence with numbers: what is lost, what keeps working, for how long.
   - Correct: `<DialogDescription>Its 214 runs, 3 keys and every prompt release are deleted.</DialogDescription>`
   - Wrong: `<DialogDescription>This action is permanent.</DialogDescription>`
10. dialog-title-required MUST Give every dialog a DialogTitle, with className="sr-only" when the design shows none. Because Base UI names the dialog from DialogTitle, so without one a screen reader announces only "dialog".
   - Correct: `<DialogContent><DialogTitle className="sr-only">Command palette</DialogTitle>…`
   - Wrong: `<DialogContent><Command>…</Command></DialogContent>`
11. dialog-focus-lands SHOULD Let the footer decide focus on open, or mark one element data-autofocus; never focus the panel yourself.
   - Correct: `<DialogContent>… <input data-autofocus …/>`
   - Wrong: `<DialogContent initialFocus={popupRef}>`
12. dialog-no-custom-backdrop NEVER Restyle the backdrop or shadow; pass only width or layout classes. Because the 24% backdrop and the frame line in shadow-overlay are shared by every overlay, so a custom one stands apart from Sheet and Popover.
   - Correct: `<DialogContent size="lg">`
   - Wrong: `<DialogContent className="shadow-2xl">`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `Dialog role` | `'dialog' \| 'alertdialog'` | `'dialog'` | alertdialog: no outside dismiss, no X. |
| `Dialog confirmText` | `string` |  | The exact name to type; the action stays disabled until it matches. |
| `Dialog open, defaultOpen, onOpenChange` | `Base UI` | `false` | onOpenChange is not called while pending. |
| `DialogContent size` | `'sm' \| 'default' \| 'lg'` | `'default'` | 400, 480, 640px. |
| `DialogContent showCloseButton` | `boolean` | `role === dialog` | The X in the top-right corner. |
| `DialogContent initialFocus, finalFocus` | `RefObject<HTMLElement \| null> \| ((type) => HTMLElement \| boolean \| null) \| boolean` | `first control, the trigger` | Base UI's: where focus lands on open, and on close; pass finalFocus when the trigger is gone. |
| `DialogFooter defaultAction` | `'primary' \| 'dismiss' \| 'none'` | `auto` | Auto: dismiss when the primary is destructive. |
| `DialogAction onAction` | `() => void \| Promise` |  | A promise holds the dialog until it settles. |
| `DialogAction close` | `boolean` | `true with onAction` | false with onClick or type="submit". |
| `DialogAction` | `ButtonProps` |  | variant, pendingLabel, disabled. |
| `DialogConfirmField label` | `(name) => ReactNode` | `"Type <name> to confirm"` | Native input props pass through. |
Other props pass through to the root element.

## Variants and states
- role: dialog, alertdialog, alertdialog + confirmText
- size: sm, default, lg
- defaultAction: primary, dismiss, none
- states: closed, open, enter target, pending, failed, typed empty, typed differs, typed matched, nested parent

## Accessibility
- [ ] The panel is role="dialog" or "alertdialog" named by DialogTitle, described by DialogDescription, with aria-modal.
- [ ] Focus lands from the footer default or data-autofocus; Tab cycles inside; the page behind is inert.
- [ ] Escape closes this dialog only and does nothing while pending.
- [ ] Enter presses the footer default; in a typed-confirm field it does nothing.
- [ ] A failed action shows a role="alert" message above the footer.
- [ ] The corner X is a button named "Close", disabled while pending.

## Edge cases
- 112-character title and 300-character description -> Wrap inside 400px; the X keeps its corner.
- A long ID to name -> Title it by the readable name ("Delete refund-prompt v14?") and put the ID in DialogDescription in code; an ID in the title breaks mid-word.
- The deleted row is gone -> Pass DialogContent finalFocus the next row's actions button, else the previous row's, else the table, since the trigger left with the row.
- 40 rows at 390x640 -> The panel stops at 100dvh minus 64px and scrolls inside; past 3 screens use a Sheet.
- Right to left -> The X moves to the top left and the footer reverses.
- 10-second action -> The button spins; Cancel, the X, Escape and the backdrop do nothing.
- Action rejects -> The dialog stays open with the typed name and an alert; a retry clears it first.
- Popover, menu and child dialog inside -> Escape closes the innermost only; the parent dims under its own overlay.
- Zoom 200% or 320px -> The title wraps and the panel scrolls; the footer buttons wrap and stay at the end.
- Touch -> Buttons stay at the end at their own width and grow to 44px; focus starts on the panel so the keyboard stays down.
- Forced colors -> The panel gets a 1px CanvasText outline.
- Reduced motion -> Open and close cut; a running action's arc stops turning but stays drawn.

## Tokens
--surface-overlay, --surface-page, --elev-overlay, --radius-frame, --overlay-sm, --overlay, --overlay-lg, --gutter-sm, --space-8, --dur-slow, --dur-base, --ease-step, --type-label, --type-body-sm, --type-tag, --text-1, --text-2, --text-3, --line-row, --line-control, --accent-mark, --accent-wash, --accent-line, --dur-spin, --ease-spin

## Related
- [Sheet](/components/sheet.md): A panel from an edge, modal or docked.
- [Popover](/components/popover.md): Anchored rich content, including the info toggletip and the hover preview.
- [Toast](/components/toast.md): Confirms an action or reports a background event, then leaves.
- [Command](/components/command.md): A searchable command list, the core of the command palette.
