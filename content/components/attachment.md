---
name: Attachment
system: iota
kind: component
import: "import {Attachment, AttachmentGroup, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentProgress, AttachmentActions, AttachmentAction, AttachmentTrigger, AttachmentGlyph, AttachmentDrop, AttachmentDropIcon, AttachmentDropTitle, AttachmentDropDescription, AttachmentDropTrigger, AttachmentTile, attachmentVariants, attachmentDropVariants, attachmentTileVariants, fileGlyph, formatBytes, formatProgress, rejectionReason, acceptTokens, dragVerdict, describeAccept, useAttachmentDrop} from '@/components/iota/ui/attachment'"
install: "npx shadcn@latest add {{SITE}}/r/attachment.json"
registryDependencies: [button, format, icon, kind, theme, truncate, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/attachment
---

# Attachment

Shows a file in a form, prompt or message, takes files by drop or pick, and holds an image slot that uploads on press.

## Variants
- **States**: idle, uploading, processing, done and error.
- **Sizes**: small shows only the name; default adds a second line.
- **Orientation**: a horizontal row, or a vertical card with the media on top.
- **Files on a message**: chips in a group above the bubble, never inside it.
- **Drop zone**: a visible frame with limits and a Choose files button, or an invisible region that appears on drag.
- **Image tile**: a square image slot that is its own upload button.

## Use when
- A person adds files to a prompt, a ticket or a form and sees them before sending.
- A message shows the files it carries.
- A page takes files by drop or pick, such as an import or a knowledge upload.

## Don't use when
- The files are the composer's own; the prompt input draws its chips with this component. Use [Prompt input](/components/prompt-input.md).
- The file is a table row with columns of its own. Use [Table](/components/table.md).
- The list is a browsable library of files. Use a Table with a file column.

## Minimal example
```tsx
<Attachment state="uploading">
  <AttachmentMedia><AttachmentGlyph type={file.type} name={file.name}/></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>{file.name}</AttachmentTitle>
    <AttachmentDescription>{formatProgress(loaded, file.size)}</AttachmentDescription>
  </AttachmentContent>
  <AttachmentProgress value={percent} label={`Uploading ${file.name}`}/>
</Attachment>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. attachment-state-prop MUST Pass state="uploading" or "processing" while the file is in flight and "error" when it failed; do not hide the chip. Because the state sets aria-busy, dims the media and puts the fail wash on the chip, and a hidden chip loses the file without a word.
   - Correct: `<Attachment state={file.status}>...</Attachment>`
   - Wrong: `{uploaded && <Attachment>...</Attachment>}`
2. attachment-progress-with-figures MUST Pair AttachmentProgress with the same figure in AttachmentDescription, and render it only while uploading. Because the 2px bar is easy to miss, and the description and aria-valuenow carry the number for everyone else.
   - Correct:
     ```tsx
     <AttachmentDescription>{formatProgress(loaded, size)}</AttachmentDescription>
     <AttachmentProgress value={40} label="Uploading ticket-export.csv"/>
     ```
   - Wrong: `<AttachmentProgress value={40} label="Uploading"/>`
3. attachment-error-reason MUST Say why a file failed in AttachmentDescription, from rejectionReason or the server, and offer a retry action when a retry can work. Because a red chip with no reason leaves the person guessing between size, type and a dropped connection.
   - Correct: `<AttachmentDescription>{rejectionReason(rejection, {accept, maxSize})}</AttachmentDescription>`
   - Wrong: `<AttachmentDescription>Failed</AttachmentDescription>`
4. attachment-action-name MUST Give every AttachmentAction an aria-label that names the file. Because with three chips on a row, three buttons all named "Remove" cannot be told apart by a screen reader.
   - Correct: `` <AttachmentAction aria-label={`Remove ${file.name}`}><Icon icon={Close} size={16}/></AttachmentAction> ``
   - Wrong: `<AttachmentAction aria-label="Remove"><Icon icon={Close}/></AttachmentAction>`
5. attachment-zone-needs-reasons MUST Set accept and maxSize on AttachmentDrop, say them in AttachmentDropDescription, and handle onReject. Because the drag is judged by type before the drop, so the person only learns the limits if the words and the overlay agree.
   - Correct: `<AttachmentDrop accept="image/*,.pdf" maxSize={25_000_000} onFiles={add} onReject={showReasons}/>`
   - Wrong: `<AttachmentDrop onFiles={add}/>`
6. attachment-always-a-button MUST Include AttachmentDropTrigger in every zone, and in a composer region beside a visible attach button. Because dragging is a pointer gesture, so a keyboard, a screen reader and a phone have no other way in.
   - Correct: `<AttachmentDrop variant="zone">...<AttachmentDropTrigger>Choose files</AttachmentDropTrigger></AttachmentDrop>`
   - Wrong: `<AttachmentDrop variant="zone"><AttachmentDropTitle>Drop files</AttachmentDropTitle></AttachmentDrop>`
7. attachment-tile-label MUST Give a variant="tile" an aria-label that says which image it sets: "Change agent avatar". Because the tile has no text, and the Replace hint is aria-hidden.
   - Correct: `<Attachment variant="tile" src={url} aria-label="Change agent avatar" onFile={upload}/>`
   - Wrong: `<Attachment variant="tile" src={url}/>`
8. attachment-nested-regions SHOULD Nest an AttachmentDrop inside another instead of adding a second drop handler of your own. Because the innermost region claims the drop and the outer one stands down, while two handlers on one drop add the file twice.
   - Correct:
     ```tsx
     <AttachmentDrop onFiles={addToPage}><AttachmentDrop onFiles={addToPrompt}><Composer/></AttachmentDrop></AttachmentDrop>
     ```
   - Wrong: `<AttachmentDrop onFiles={addToPage}><Composer onDrop={addToPrompt}/></AttachmentDrop>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `state` | `'idle' \| 'uploading' \| 'processing' \| 'done' \| 'error'` | `'done'` | idle: picked, not sent. uploading and processing dim the media and set aria-busy. error takes the fail wash. |
| `size` | `'sm' \| 'default'` | `'default'` | default has a 40px media cell and two lines; sm is 32px and shows only the name. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | horizontal is a 40px row; vertical is a 112px card with the media on top and the actions over it. |
| `variant` | `'chip' \| 'tile'` | `'chip'` | tile is a square image slot that is its own upload button. |
| `AttachmentMedia variant` | `'icon' \| 'image'` | `'icon'` | image fills the cell with a thumbnail; one that fails to decode falls back to the image glyph. |
| `AttachmentProgress value, label` | `number, string` | `required` | 0 to 100. label names the progressbar. Render only while uploading. |
| `AttachmentGroup layout` | `'wrap' \| 'scroll'` | `'wrap'` | scroll keeps a composer one row tall and snaps chips. |
| `AttachmentTrigger` | `button props` |  | Makes the whole chip one button, for opening a preview. The actions sit above it. |
| `AttachmentDrop variant` | `'region' \| 'zone'` | `'region'` | region is invisible until a drag; zone is a visible frame with its words and a browse button. |
| `AttachmentDrop accept, maxSize, multiple` | `string, number, boolean` | `-, -, true` | The accept syntax of an input; bytes; one file or many per drop. |
| `AttachmentDrop onFiles, onReject` | `(files: File[]) => void, (r: FileRejection[]) => void` |  | Files that passed every check, then the ones that did not, each with a reason of type, size or count. |
| `AttachmentDrop paste, disabled, kind` | `boolean, boolean, Kind` | `false` | Take pasted screenshots while focus is inside; take nothing; tint the overlay in a kind. |
| `AttachmentDrop overlayLabel, rejectLabel, dragState` | `ReactNode, ReactNode, accept \| reject` |  | The overlay words, and a held overlay for docs and tests. |
| `tile src, fit, loading, onFile, accept` | `string, cover \| contain, boolean, (file) => void, string` | `-, 'cover', false, -, 'image/*'` | The current image, how it fills, an upload in progress, the picked file, the picker filter. |
| `Helpers` | `formatBytes, formatProgress, rejectionReason, fileGlyph` |  | "1.2 MB", "1.2 of 4.8 MB", a short reason for a rejected file, and the glyph for a type or name. |
Other props pass through to the root element.

## Variants and states
- state: idle, uploading, processing, done, error
- size: sm, default
- orientation: horizontal, vertical
- states: idle, uploading, processing, done, error, drag accept, drag reject, disabled

## Accessibility
- [ ] A chip in flight sets aria-busy; the progress bar is a progressbar with aria-valuenow, aria-valuetext in percent and its own name.
- [ ] The failure reason is text in the chip, not only a color; the wash and the fail text are extra.
- [ ] Actions are 28px buttons, 24px in the small chip, each named for its file.
- [ ] The drag overlay is aria-hidden because dragging is a pointer gesture; the trigger button is the accessible path to the same file picker.
- [ ] The tile is a button with aria-busy while uploading; its Replace hint shows at rest on devices without hover.
- [ ] A zone and its overlay survive forced colors with a dashed border.

## Keyboard
- `Enter, Space on an action`: Removes, retries or downloads the file.
- `Enter, Space on AttachmentDropTrigger or the tile`: Opens the file picker.
- `Ctrl or Cmd+V in a region with paste`: Takes pasted files; plain text pastes as usual.

## Edge cases
- Long file name -> Cut in the middle, keeping the extension and a few characters before it.
- Drag of the wrong type -> The overlay turns to the fail wash and says what is accepted before the drop.
- Extensions in accept -> A drag has only types, so extension-only accepts are judged at the drop.
- File over maxSize or past count -> Comes back through onReject with reason size or count; the other files still pass.
- Image fails to decode -> The thumbnail falls back to the image glyph.
- Nested regions -> The inner one claims the event and the outer one hides its overlay.
- Disabled zone -> No overlay, a disabled trigger, text-disabled words.
- Right to left -> The media, rule and actions mirror.
- Reduced motion -> The tile spinner stays still.

## Tokens
--row, --row-sm, --line-control, --surface-page, --surface-tile, --surface-hover, --accent-wash, --stale-opacity, --dim-opacity, --scale-press, --fail-line, --fail-text, --ink, --border-focus, --radius-soft, --radius-inner, --dur-fast, --ease-step, --z-drop

## Related
- [Prompt input](/components/prompt-input.md): The composer editor with mentions, slash commands and voice.
- [Truncate](/components/truncate.md): Long IDs and text cut at the middle or the end, with the full value reachable.
- [Progress](/components/progress.md): Bar, ring, steps or meter.
- [Button](/components/button.md): Starts an action now. States: pressed and pending, which keeps the label.
