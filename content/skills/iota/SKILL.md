---
name: iota
description: iOTA design system rules for this project's UI. Use when building or changing any screen, component, form or style, when porting an existing screen onto iOTA, or when checking UI against iOTA.
license: MIT
---

# iOTA

White chassis, one brand blue (#0057fc) for the primary action and checked controls, muted kind hues, warm trouble colors, Geist at small sizes. Built on shadcn and Base UI, with Motion, Lenis, Torph, Phosphor and Hugeicons.

## Setup
Once, in the root layout: put the "iota" class on `<body>` or the root element of the UI, with `IotaPortalProvider` inside it. iOTA's styles and tokens apply only inside that class.
Menus, dialogs, popovers and toasts render at the end of the body; IotaPortalProvider keeps them inside the scope, and without it they lose every token. `import {IotaPortalProvider} from '@/components/iota/lib/portal'`
`<body className="iota"><IotaPortalProvider>{children}</IotaPortalProvider></body>`

## What you get
The site shows a selection of each component. The installed code has every variant and state, and each component's page lists them under Variants and states, with the props in API. Build from those lists, not from what the site happens to show.

## Steps
1. Pick the components the screen needs from the index below. Fetch each one's page before using it: it has the props, variants and that component's rules.
2. Build only from those components and the tokens under Tokens, inside an element with the "iota" class. Import each from the path in the index; support pieces are under Imports. Dark mode: put data-theme="dark" or the class dark on the iota element or any ancestor, such as <html>. The theme does not follow the system setting (prefers-color-scheme) on its own.
3. Frame the screen with the Page shell. If a component is missing, build the stand-in under Coverage gaps; if none is listed, compose it from existing components and tokens and say what you built. Never invent a token.
4. Ask the person when the screen needs a credential, an environment, the object of a destructive action or an approval policy you were not given; never invent a key, an endpoint or which tools need approval. Decide layout, copy and components from these rules and say what you chose.
5. Porting an existing screen: swap one piece at a time for its component, keep the behavior and copy, and delete the old styles once nothing uses them. For a whole app, run migrate-design-system when it is installed.
6. Lint: install it once with `npx shadcn@latest add {{SITE}}/r/lint.json`, then run `npx eslint -c iota.eslint.config.mjs .`. Each message names the fix.
7. Review before you finish: run the lint and fix every error, then render the screen at 390 and 1280 wide, check it against the global rules and the anti-slop list, fix the worst defect, and check again. Done when no MUST or NEVER is broken and no raw color, size or font is left. Run ui-review when it is installed.

## Priority order
When rules conflict, the earlier item wins.
1. Accessibility and keyboard behavior
2. Tokens, never raw values
3. Existing components, never rebuilt
4. Layout and spacing scale
5. Polish: motion, radius, details

## Global rules
1. iota-components-first MUST Use a component from this system before writing custom markup. Because hand-built markup skips the component's focus ring, keyboard handling and states, which people notice one at a time.
   - Correct: `<Button onClick={open}>Open run</Button>`
   - Wrong: `<div onClick={open} className="cursor-pointer">Open run</div>`
2. iota-scope MUST Put className="iota" on `<body>`, once, in the root layout, with IotaPortalProvider inside it. Because the class carries every token and the font, and the provider gives menus, dialogs and toasts a home beside the page so a modal can make the page behind inert.
   - Correct: `<body className="iota"><IotaPortalProvider>{children}</IotaPortalProvider></body>`
   - Wrong: `<div className="iota"><IotaPortalProvider>{children}</IotaPortalProvider></div>`
3. iota-tokens-only MUST Reference tokens by role; never hex, rgb or arbitrary px. Because a raw value keeps its light-theme color in the dark theme and drifts off the spacing scale.
   - Correct: `<div className="bg-surface p-4">`
   - Wrong: `<div className="bg-[#f4f4f5] p-[13px]">`
4. iota-kind-is-a-word MUST Name a kind with <Badge kind/> or data-kind; hue never fills a region. Because the word reads in grayscale and aloud, and a filled region makes everything inside look like that kind.
   - Correct: `<Badge kind="agent"/>`
   - Wrong: `<Card className="bg-accent-field">Agent</Card>`
5. iota-warm-is-trouble NEVER Use amber or red for anything but warn and fail. Because an operator scanning for trouble stops on every warm mark, so a warm Beta tag reads as a failing run.
   - Correct: `<Badge>Beta</Badge>`
   - Wrong: `<Badge className="bg-amber-200">Beta</Badge>`
6. iota-prop-names SHOULD Name a prop by the question it answers: status for warn and fail, orientation for the direction a row or column runs, layout for which arrangement of the same parts, placement for where it sits on the page; variant only for a Button and a menu item's intent. Because one word for one question lets a person guess the prop on a component they have not used, and tone, kind or variant for a state sends them to the docs.
7. iota-fields-not-lines SHOULD Separate containers with a grey field; use a hairline only where a field cannot. Because boxes inside bordered boxes stack lines until the groups blur.
8. iota-keyboard MUST Keep every control keyboard-operable with a visible focus ring and an accessible name. Because a keyboard user loses their place without the ring, and a screen reader announces an unnamed icon button as "button".
   - Correct: `<Button size="icon-sm" aria-label="Close"><Icon icon={Close}/></Button>`
   - Wrong: `<Button size="icon-sm" className="outline-none"><Icon icon={Close}/></Button>`
9. iota-ask-before-destructive MUST Stop an agent before a destructive or irreversible action with a ToolCall awaiting permission and Deny and Allow; save typed confirmation for deleting for good a thing that holds others, such as a project (dialog-typed-confirm-irreversible). Because a prompt release, a deleted key or a sent reply cannot be taken back, and a typed name on every action trains people to type through the real one.
   - Correct: `<ToolCall call={call} actions={<><Button variant="secondary">Deny</Button><Button>Allow</Button></>}/>`
10. iota-ai-turn MUST Build a turn inside Conversation from AgentTurn, ToolCallList, Response and ConversationTail, with PromptQueue above PromptInput; only the running tool row shows the arc. Because each part owns one job, and a second spinner or phrase in the turn makes the thread say two things at once.
   - Correct:
     ```tsx
     <AgentTurn name="planner">
       <ToolCallList calls={calls}/>
       <Response>{text}</Response>{done && <MessageFooter>{actions}</MessageFooter>}</AgentTurn>
     <ConversationTail>{waiting && <Activity waiting announce={false}/>}</ConversationTail>
     ```
11. iota-sentence-case MUST Write sentence case, plain labels, verb plus object on actions. Because title case reads as proper nouns, and a bare OK or Submit does not say what the press will do.
   - Correct: `<Button>Create key</Button>`
   - Wrong: `<Button>Submit</Button>`
12. iota-no-decoration NEVER Add shadows on flat things, gradients, glass, pills, side bars or looping motion. Because each one competes with the status words and kind labels that carry meaning, and glass drops text contrast.
   - Correct: `<Card>`
   - Wrong: `<Card className="shadow-md bg-gradient-to-br from-accent-wash backdrop-blur">`
13. iota-smallest-change SHOULD Make the smallest change; do not add files or abstractions that were not requested. Because every extra file is code the person has to review and keep.
14. iota-stop-when-missing MUST Stop and say so when a component or token is missing; do not invent one. Because an invented token resolves to nothing and renders unstyled, and an invented component never gets the system's fixes.

## Page shell
Every screen sits in this frame.
- Root: the `<body className="iota">` from iota-scope, which sets the page color, text and font; in its IotaPortalProvider, `<SidebarProvider className="min-h-dvh">` holding `Sidebar` (`--sidebar` wide, a sheet under 768px) and `SidebarInset`, the page's `main`
- Top bar, first in SidebarInset: `<header className="sticky top-0 z-10 flex h-(--topbar) shrink-0 items-center gap-2 bg-page px-(--gutter-sm) sm:px-(--gutter)">` with `SidebarTrigger` and a Breadcrumb; the h1 is never here
- List page: runs, keys, agents: `<div className="mx-auto flex w-full max-w-(--container) flex-col gap-6 px-(--gutter-sm) py-6 sm:px-(--gutter)">` holding PageHeader (the one h1), FilterBar, then the Table
- List and detail: the list page, with the selection in a docked `<Sheet modal={false}>` whose SheetContent has `stackBelow="3xl"`, so it takes the full width under the list in a narrow container; a trace beside its timeline is two panels side by side filling `SidebarInset`, each scrolling inside itself
- Chat or agent run, full height: `h-dvh` on SidebarProvider; in `SidebarInset` a `flex min-h-0 flex-1 flex-col` holding `<PageHeader size="sm">` with the run's title (the h1) and its Status in PageHeaderDescription, Conversation (`min-h-0 flex-1`), then PromptQueue and PromptInput in `mx-auto w-full max-w-3xl px-(--gutter-sm) pb-4 sm:px-(--gutter)`, so the composer stays pinned

## Anti-slop
The habits of generated UI that iOTA bans. Details: {{SITE}}/foundations/anti-slop.md
- anti-slop-no-caps NEVER Set text in capitals or tracked out; keep sentence case. Because capitals read slower and make every label shout, so a real warning no longer stands out.
  - Wrong: `<span className="uppercase tracking-widest">Running</span>`
- anti-slop-mono-for-copyable MUST Set mono only for code, commands, paths, IDs, keys and hashes; numbers get the data utility. Because mono marks what a person copies, so a mono duration looks like an id.
- anti-slop-no-em-dash NEVER Use an em dash for a pause or an empty value; end the sentence, or write None. Because an empty cell with a dash reads as a minus or a value still loading, and a screen reader may skip it.
  - Wrong: `<dd>{run.owner ?? '\u2014'}</dd>`
- anti-slop-no-dot-separator NEVER Join facts with a middle dot; give each its own element with a gap. Because a screen reader reads each dot aloud, and the string wraps mid-fact on a phone.
  - Wrong: `` `${model} · ${variant} · ${time}` ``
- anti-slop-no-eyebrow NEVER Put a small category label above a title. Because it repeats the sidebar and makes two headings compete for the first read.
  - Wrong: `<p className="type-eyebrow">Components</p><h1>Input</h1>`
- anti-slop-no-side-rail NEVER Mark selection, quotes or panels with a bar on one edge or a stripe across a card; use the wash between frame lines. Because an edge bar reads as a status stripe, so a selected row looks flagged.
  - Wrong: `data-selected:shadow-[inset_2px_0_0_var(--accent-mark)]`
- anti-slop-no-card-grid NEVER Show several numbers as three equal icon cards; compose one stats strip, a table or a sentence. Because equal cards give every number the same weight and push the table the person came for below the fold.
  - Wrong: `<Card><Icon/><Stat>42</Stat></Card> x3`
- anti-slop-no-pill NEVER Round a label, tag or filter fully; use rounded-inner or rounded-soft. Round is for people, the radio and the switch. Because a pill reads as a toggle, so people click a static tag.
  - Wrong: `<span className="rounded-full px-2">beta</span>`
- anti-slop-no-box-in-box NEVER Put a bordered or grey box inside a frame; split it with row rules or a well. Because a box in a box stacks edges until no one can tell which group a line closes.
  - Wrong: `<Card><div className="rounded-md border p-3">…</div></Card>`
- anti-slop-no-centred-empty NEVER Centre an empty state in a big box; put it top-left of the body with the query in a code tag. Because a centred block in a void reads as a template and moves the action away from where the first row was.
  - Wrong: `<Empty align="center" className="min-h-60"/>`
- anti-slop-no-tinted-alert NEVER Fill an alert with a tinted block; frame it and mark trouble with the status icon and a title that names it. Because a tinted block buries the words under the colour and reads like every Bootstrap alert.
  - Wrong: `<div className="rounded-md bg-red-50 p-4">Sync failed</div>`
- anti-slop-no-red-button NEVER Fill a destructive button red; give it the fail edge and fail text. Because a red fill is the loudest shape on the page and outshouts the primary action.
  - Wrong: `<Button className="bg-red-600 text-white">Delete</Button>`
- anti-slop-no-brand-decoration NEVER Fill a header, kind, icon tile or second button with brand; brand fill is the primary button, one per view, and a checked control. Because when headers and tiles are brand too, the primary action no longer stands out.
  - Wrong: `<header className="bg-ink text-text-inverse">Runs</header>`
- anti-slop-no-hue-wallpaper NEVER Fill a section, card or header with a kind hue; put the hue in a label, a chart line or the selected row. Because a hue names a kind, so a filled section makes everything inside look like that kind.
  - Wrong: `<Section className="bg-accent-field">`
- anti-slop-no-icon-tiles NEVER Put a category icon in a colored tile; write the kind as a tinted word. Because the tile spends the hue on decoration, and the glyph names nothing a screen reader can read.
  - Wrong: `<span className="bg-accent-mark p-2"><Icon icon={Rocket}/></span>`
- anti-slop-no-status-dots NEVER Write status as a dot, square or pill; write the word, and color only warn and fail. Because a dot carries status by hue alone, which color-blind people, forced colors and screen readers all lose.
  - Wrong: `<span className="size-2 bg-green-500"/> api@v312`
- anti-slop-no-outline-rings NEVER Ring a filled mark or badge in a dark 1px outline; leave the fill flat. Because the ring reads as focus or selection, so people think the badge is active.
  - Wrong: `<span className="bg-accent-mark shadow-[inset_0_0_0_1px_black]"/>`
- anti-slop-no-empty-art NEVER Draw art in an empty state; write a title, one muted line and the action. Because the art pushes the action below the fold on a phone and says nothing about why the list is empty.
  - Wrong: `<Empty><PixelRobot/><EmptyTitle>No agents yet</EmptyTitle></Empty>`
- anti-slop-no-decorative-motion NEVER Pulse, ping, bounce, glow or sweep to look alive; a running status is a small turning arc. Because constant motion takes the eye from the row that changed and keeps moving under reduced motion.
  - Wrong: `<span className="animate-ping rounded-full bg-green-500"/>`
- anti-slop-no-terminal-cosplay NEVER Use prompt signs, block cursors or bracketed labels outside a terminal; use the normal component. Because a screen reader reads the signs and brackets aloud, and people try to type at the fake cursor.
  - Wrong: `<p>&gt; [OK] deploy complete_</p>`
- anti-slop-no-arrow-links NEVER End link text in an arrow or write Learn more; name where the link goes. Because a screen reader listing links hears ten Learn mores and no destination.
  - Wrong: `<a>Learn more →</a>`
- anti-slop-no-shimmer-text NEVER Sweep a gradient through in-progress text; keep the text still and show the running status. Because the sweep drops the text under its contrast floor mid-pass and never says when the work stops.
  - Wrong: `<span className="shimmer">Thinking</span>`
- anti-slop-no-glass NEVER Blur or fade an overlay, bar or card; use the solid surface and the overlay shadow. Because the page shows through and pulls the overlay text under its contrast floor.
  - Wrong: `<div className="bg-white/70 backdrop-blur-md">`
- anti-slop-no-grey-prose NEVER Set a sentence at label-sm in text-3; use body-sm or larger in text-2. Because 12px at the 5:1 floor holds a word or two, and a whole sentence there is tiring to read.
  - Wrong: `<p className="type-label-sm text-text-3">Runs older than 30 days move to cold storage.</p>`
- anti-slop-no-icon-every-label NEVER Put an icon on every button, menu item or heading; icons are for actions found by shape. Because when every item has a glyph, none can be found by its shape.
  - Wrong: `<MenuItem><Icon icon={Pencil}/>Rename</MenuItem>`
- anti-slop-no-filler NEVER Write seamless, robust, effortless or leverage; name the mechanism or the number. Because the words promise without telling the person what happens or how fast.
  - Wrong: `Seamlessly deploy robust agents.`

## Reject list
- Grey cards for list entries, icons on every label, kind icons and icon tiles; use rows in one frame and the kind word. Status dots, transition: all, and outline: none without a replacement; write the status word.

## Coverage gaps
Not in the system yet, and what to build meanwhile.
- Attachments on a sent message: a `<AttachmentGroup aria-label="Attached files">` of done Attachment chips in MessageContent above the MessageBubble, never inside it.
- Retry for a failed run or job row: a `variant="secondary" size="sm"` Button that names the run (Rerun refund-eval) in the row's last cell; a failed load uses EmptyRetry and a failed turn ConversationError.
- One duration on its own: `formatDuration(ms)` from the tool-call item; a column uses `formatDurations` from the format item. Reasoning takes seconds; ToolCall and the formatters take ms.

## Imports
- `import {PageHeader, PageHeaderRow, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, PageHeaderActions, PageHeaderStats, PageHeaderStat, pageHeaderVariants} from '@/components/iota/ui/page-header'`: Title, description, stats and actions.
- `import {BulkActionBar, BulkAction} from '@/components/iota/ui/bulk-action-bar'`: Actions for the rows a person has selected.
- `import {controlHeight, cn, mergeClass, mergeRefs, withDefaults} from '@/components/iota/lib/utils'`: cn, which merges class names and resolves conflicts between iOTA's type roles and text colors; mergeClass, which keeps iOTA's classes when a caller passes a className function; and mergeRefs.
- `import {Icon} from '@/components/iota/icon'`: The one import point for icons: Phosphor and Hugeicons.
- `import {IotaPortalProvider, useIotaPortal, useIotaModal, cycleTab, coarsePointer} from '@/components/iota/lib/portal'`: Puts overlays inside the .iota scope so they keep its tokens.
- `import {useOverlayOpen, overlayModel, overlayOpenChanged, overlayMayClose, overlayRunStarted, overlayRunSettled, isThenable, closesAfter, useDefaultAction, overlaySurface, overlayShellSurface, overlayMotion, backdropClass, useScrollFade, fadeClass} from '@/components/iota/lib/overlay'`: What every overlay shares: the paper surface with its frame line and the way it appears; and for Dialog and Sheet, the open state that waits for a running action, Enter on the footer's default action, the backdrop and the scroll fade.
- `import {kinds, reserved} from '@/components/iota/lib/kind'`: The five kinds and two reserved statuses, as a type and an ordered list.
- `import {EMPTY_VALUE, CHART_EMPTY, fixed, durationUnitFor, formatDurations, countUnitFor, formatCounts, formatElapsed, formatCount, formatBytes, formatByteProgress} from '@/components/iota/lib/format'`: Picks one unit for a numeric column from its largest value.
- `import {cssNumber} from '@/components/iota/lib/css-var'`: Reads a design token from the page for charts and canvases.
- `import {IotaDirection, useDomDirection} from '@/components/iota/lib/direction'`: Hands the document direction to Base UI.
- `import {useFocusWhenReplaced} from '@/components/iota/lib/use-focus-when-replaced'`: Moves focus to an outcome when the buttons that had it are replaced, so a keyboard user is not dropped to the top.
- `import {useOffscreen} from '@/components/iota/lib/use-offscreen'`: Marks a live frame with data-offscreen while it is out of view, so its running arc pauses.
- `import {isPart} from '@/components/iota/lib/children'`: Finds the compound parts of a component among its children.
- `import {useScrollTabStop} from '@/components/iota/lib/scroll-focus'`: Puts a scroll box in the tab order while its content overflows, so a keyboard can scroll it.

## Icons
Import a glyph beside Icon and pass it in: `<Icon icon={Activity} size={16}/>`. Phosphor supplies glyphs, Hugeicons the chevrons and overflow mark. Rules and sizes: {{SITE}}/foundations/iconography.md

## Tokens
The closed list. Use a token through its class, never a raw value: colors are utilities named after the role (bg-page, text-text-1, border-hair); sizes read the scale (type-body, rounded-inner, shadow-overlay, h-(--control-lg), duration-(--dur-fast)).
The class to use follows each token in brackets. Color names take bg-, text- or border-. A token with no class is read as a value, such as h-(--name).
- Brand and paper: 6 tokens read only through their classes and components; never by name.
- Category hues: 30 tokens read only through their classes and components; never by name.
- Reserved status hues: --warn-mark (bg-/text-/border-warn), --warn-field, --warn-wash, --warn-line, --fail-mark (bg-/text-/border-fail), --fail-field, --fail-wash, --fail-line, --warn-text (bg-/text-/border-warn-text), --fail-text (bg-/text-/border-fail-text)
- Type families: --font-sans (font-sans), --font-mono (font-mono)
- Type weights: --weight-body (font-normal), --weight-medium (font-medium), --weight-strong (font-semibold), --width-normal, --features-data (data), --features-id
- Type roles: --type-display-xl (type-display-xl), --type-display-lg (type-display-lg), --type-display (type-display), --type-heading-lg (type-heading-lg), --type-heading (type-heading), --type-heading-sm (type-heading-sm), --type-heading-xs (type-heading-xs), --type-body-lg (type-body-lg), --type-body (type-body), --type-body-sm (type-body-sm), --type-button (type-button), --type-label (type-label), --type-label-sm (type-label-sm), --type-code (type-code), --type-code-sm (type-code-sm), --type-tag (type-tag), --type-code-display (type-code-display), --type-code-touch (type-code-touch), --type-stat-xl (type-stat-xl), --type-stat-lg (type-stat-lg), --type-stat (type-stat), --type-state-word (type-state-word), --tracking-display (tracking-display), --tracking-heading (tracking-heading), --tracking-body (tracking-body), --tracking-text (tracking-text)
- Space: --space-0-5, --space-1 (frame-head-action), --space-2, --space-3, --space-4, --space-5, --space-6, --space-8, --space-10, --space-15, --space-20, --space-30
- Layout: --container, --sidebar, --toc, --topbar, --gutter, --gutter-sm, --control-xs, --control-sm, --control, --tag, --control-lg, --overlay-sm (max-w-overlay-sm), --overlay (max-w-overlay), --overlay-lg (max-w-overlay-lg), --popover (max-w-popover), --toast-width (max-w-toast), --popover-sm, --tooltip-max, --hint-width, --menu-min, --popup-max (max-w-popup), --menu-width, --field-max-height, --row-sm, --row, --row-lg, --label-column, --measure, --tab-max, --sidebar-icon, --attachment-media, --attachment-max, --grab-size, --fade-edge, --fade-line-end, --measure-hint, --measure-short, --page-header-max, --search-min, --search-max, --crumb-floor, --log-level, --status-column, --timeline-name, --timeline-name-min, --timeline-label-min, --time-column, --stat-placeholder, --tool-detail-min, --line-box, --skeleton-text, --code-inline
- Radius: --radius-0 (rounded-none), --radius-inner (rounded-sm), --radius-soft (rounded-md), --radius-frame (rounded-xl), --radius-full (rounded-full)
- Lines: --line-hair, --line-accent, --line-focus (focus-ring), --focus-offset, --line-frame-alpha, --mark-size, --ring-cutout, --chart-dash, --chart-axis-gap
- Motion: --dur-press, --dur-fast, --dur-base, --dur-slow, --dur-spin, --dur-run, --dur-slide, --ease-spin, --thumb-lift, --thumb-ring-alpha, --skeleton-step, --dur-skeleton-delay, --dur-skeleton-hold, --toast-read-base, --toast-read-char, --toast-read-action, --toast-read-min, --toast-read-max, --scale-press, --ease-step (ease-step), --sheet-shift, --surface-skeleton, --stale-opacity, --dim-opacity
- Layers: --z-raised, --z-above, --z-cover, --z-drop, --z-overlay
- Code: --code-string-alpha, --code-comment-alpha, --code-text, --code-string, --code-comment, --code-prompt
- Surface: --ink (bg-ink), --paper (bg-paper), --surface-canvas, --surface-page (bg-page), --surface-card (bg-well), --surface-frame, --surface-raised (bg-raised), --surface-hover (bg-hover), --surface-selected (bg-selected), --surface-pressed (bg-pressed), --surface-inverse (bg-inverse), --surface-tile (bg-tile), --surface-overlay (bg-overlay)
- Text: --text-1 (text-text-1), --text-2 (text-text-2), --text-3 (text-text-3), --text-disabled (text-text-disabled), --text-inverse (text-text-inverse), --text-on-field (text-on-field)
- Border: --border-hair (border-hair), --border-faint (border-faint), --border-strong (border-strong), --border-control (border-control), --border-focus (border-ring), --line-frame (border-frame), --line-row (border-line-row), --line-control (border-input), --line-control-hover, --scrollbar-thumb
- Elevation: --surface-thumb, --focus-halo, --elev-control, --elev-none, --elev-thumb, --elev-overlay (shadow-overlay)
- Accent slot: --accent-mark (bg-/text-/border-accent-mark), --accent-field (bg-/text-/border-accent-field), --accent-wash (bg-/text-/border-accent-wash), --accent-tint (bg-/text-/border-accent-tint), --accent-label (bg-/text-/border-accent-label), --accent-line (bg-/text-/border-accent-line), --accent-on-field (bg-/text-/border-on-accent-field)
- Button: 18 tokens read only through their classes and components; never by name.
- Chart: --chart-brand-2 (bg-/text-/border-chart-brand-2), --cell-quiet (bg-/text-/border-cell-quiet)

## Components

### Actions
- [Button]({{SITE}}/components/button.md): Every button: primary, secondary, ghost, with an icon, icon only, joined groups with split menus, and a bar for bulk actions. `import {Button} from '@/components/iota/ui/button'`, and `import {ButtonGroup, ButtonGroupMenu, ButtonGroupMenuItem} from '@/components/iota/ui/button-group'`
- [Copy button]({{SITE}}/components/copy-button.md): Copies a value and confirms in place. `import {CopyButton} from '@/components/iota/ui/copy-button'`

### Inputs
- [Input]({{SITE}}/components/input.md): One line of text. Variants: text, password, secret, copy, search, number and OTP, with prefix and suffix slots. `import {Input, InputAction, InputControl, InputPrefix, InputRoot, InputSuffix, autoStep, generatePassword, maskSecret} from '@/components/iota/ui/input'`
- [Textarea]({{SITE}}/components/textarea.md): Several lines of text that grow. `import {Textarea} from '@/components/iota/ui/textarea'`
- [Field]({{SITE}}/components/field.md): Label, control, hint and error as one unit, plus the Form part. `import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle, Form, FormActions, FormStatus, Label, LabelHint, fieldBoxVariants, fieldControlVariants, labelClasses, useFieldDisabled} from '@/components/iota/ui/field'`
- [Date picker]({{SITE}}/components/date-picker.md): A date, range, date-time or time, with Calendar as its popup part. `import {Calendar, DatePicker, TimeField, addDays, addMonths, daysBetween, formatTime, parseTime} from '@/components/iota/ui/date-picker'`
- [Combobox]({{SITE}}/components/combobox.md): A searchable choice, single, multiple or creatable. `import {Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxClear, ComboboxCollection, ComboboxContent, ComboboxCreate, ComboboxEmpty, ComboboxField, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue, normalizeEmail, splitEmails, useComboboxAnchor, validateEmail} from '@/components/iota/ui/combobox'`

### Selection
- [Checkbox]({{SITE}}/components/checkbox.md): One option on or off, with a mixed state. `import {Checkbox, CheckboxGroup} from '@/components/iota/ui/checkbox'`
- [Radio group]({{SITE}}/components/radio-group.md): One choice from a short visible list. `import {RadioGroup, RadioGroupItem, RadioGroupOption} from '@/components/iota/ui/radio-group'`
- [Switch]({{SITE}}/components/switch.md): A setting that applies immediately. `import {Switch} from '@/components/iota/ui/switch'`
- [Slider]({{SITE}}/components/slider.md): A value or range on a track. `import {Slider} from '@/components/iota/ui/slider'`
- [Select]({{SITE}}/components/select.md): One choice from a popup list, or the native select. `import {NativeSelect, NativeSelectOptGroup, NativeSelectOption, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, listPopupClassName, listItemClassName, listGroupLabelClassName, listSeparatorClassName, fieldTriggerClassName} from '@/components/iota/ui/select'`
- [Segmented control]({{SITE}}/components/segmented-control.md): Two to five views, single or multiple. `import {SegmentedControl, SegmentedControlItem, segmentedVariants} from '@/components/iota/ui/segmented-control'`

### Display
- [Badge]({{SITE}}/components/badge.md): A static label for a count, category or kind, shown as a tinted word. `import {Badge, badgeVariants, CodeTag, codeStatus, codeTone, kindLabels} from '@/components/iota/ui/badge'`
- [Chip]({{SITE}}/components/chip.md): An interactive token: filter toggle, removable value or menu trigger. `import {Chip, ChipButton, ChipCount, ChipGroup, ChipGroupContext, chipVariants} from '@/components/iota/ui/chip'`
- [Status]({{SITE}}/components/status.md): Idle, queued, running, waiting, ok, warn and fail, as a mark or a word. `import {Status, StatusArc, InkSlot, inkSlotVariants, statuses, statusLabels, statusRank, statusWordVariants} from '@/components/iota/ui/status'`
- [Stat]({{SITE}}/components/stat.md): A plain numeral with its label, delta and trend. `import {Stat, StatGroup, StatLabel, StatValue, StatUnit, StatDelta, StatDescription, StatTrend, StatRow, statVariants, deltaOf} from '@/components/iota/ui/stat'`
- [Avatar]({{SITE}}/components/avatar.md): A person, agent or source icon, alone or grouped. `import {Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarInitials, AvatarGroup, AvatarGroupCount, avatarVariants, initialsOf} from '@/components/iota/ui/avatar'`
- [Kbd]({{SITE}}/components/kbd.md): A key or a shortcut. `import {Kbd, KbdGroup, shortcut} from '@/components/iota/ui/kbd'`
- [Relative time]({{SITE}}/components/relative-time.md): "3m ago", with the exact time on hover and focus. `import {RelativeTime, formatRelative, untilChange} from '@/components/iota/ui/relative-time'`
- [Truncate]({{SITE}}/components/truncate.md): Long IDs and text cut at the middle or the end, with the full value reachable. `import {Truncate, TextHint, textHintClass, splitTail} from '@/components/iota/ui/truncate'`
- [Item]({{SITE}}/components/item.md): The list row: media, title, meta, status and actions. `import {Item, ItemMedia, ItemContent, ItemActions, ItemLink, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemMeta, ItemStatus, ItemHeader, ItemFooter, itemVariants} from '@/components/iota/ui/item'`
- [Card]({{SITE}}/components/card.md): A white working surface for one topic, optionally collapsible. `import {Card, CardHeader, CardTrigger, CardFooter, CardTitle, CardMeta, CardAction, CardDescription, CardContent, cardVariants} from '@/components/iota/ui/card'`
- [Panel]({{SITE}}/components/panel.md): A grey widget for an overview or settings screen: header on the grey, content in a white body. `import {Panel, PanelHeader, PanelTitle, PanelMeta, PanelAction, PanelBody, PanelFooter} from '@/components/iota/ui/panel'`
- [Data list]({{SITE}}/components/data-list.md): Label and value pairs for a detail view. `import {DataList, DataListItem, DataListLabel, DataListValue, DataListEmpty, dataListVariants} from '@/components/iota/ui/data-list'`

### Feedback
- [Alert]({{SITE}}/components/alert.md): A message about the current view, inline or across the page. `import {Alert, AlertTitle, AlertDescription, AlertAction, AlertClose, alertVariants} from '@/components/iota/ui/alert'`
- [Toast]({{SITE}}/components/toast.md): Confirms an action or reports a background event, then leaves. `import {Toaster, toast, toastManager, readingTimeout} from '@/components/iota/ui/toast'`
- [Empty state]({{SITE}}/components/empty-state.md): A region with nothing to show, that failed, or that the person cannot see. `import {Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, EmptyStatus, EmptyCode, EmptyQuery, EmptyRetry, emptyVariants} from '@/components/iota/ui/empty-state'`
- [Skeleton]({{SITE}}/components/skeleton.md): Holds the shape of loading content. `import {Skeleton, SkeletonText, SkeletonSwap} from '@/components/iota/ui/skeleton'`
- [Progress]({{SITE}}/components/progress.md): Bar, ring, steps or meter. `import {Progress, ProgressLabel, ProgressValue, ProgressRing, ProgressSteps, ProgressStep, ProgressStepTrigger, ProgressStepIndicator, ProgressStepTitle, ProgressStepDescription, ProgressStepText, ProgressStepSeparator, ProgressItem, ProgressList, meterStatus} from '@/components/iota/ui/progress'`

### Overlays
- [Dialog]({{SITE}}/components/dialog.md): Modal work, with alert and typed-confirm variants. `import {Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogAction, DialogConfirmField, dialogVariants, dialogSurface, useDialog} from '@/components/iota/ui/dialog'`
- [Sheet]({{SITE}}/components/sheet.md): A panel from an edge, modal or docked. `import {Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription, SheetAction, SheetSection, SheetField, useSheet, useScrollFade, fadeClass} from '@/components/iota/ui/sheet'`
- [Popover]({{SITE}}/components/popover.md): Anchored rich content, including the info toggletip and the hover preview. `import {Popover, PopoverTrigger, PopoverClose, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, PopoverInfo} from '@/components/iota/ui/popover'`
- [Tooltip]({{SITE}}/components/tooltip.md): Names an icon button or shows a shortcut; never holds anything essential. `import {Tooltip, TooltipTrigger, TooltipContent, TooltipChip, TooltipProvider, TooltipShortcut, tooltipPopupClass, tooltipMotionClass} from '@/components/iota/ui/tooltip'`
- [Dropdown menu]({{SITE}}/components/dropdown-menu.md): Actions from a trigger or a right click, plus the Export menu split button (`ExportMenu` from `@/components/iota-app/ui/export-menu`). `import {DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuLinkItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, menuPopupClass, menuItemClass, menuCheckItemClass, menuLabelClass, menuSeparatorClass, menuShortcutClass} from '@/components/iota/ui/dropdown-menu'`
- [Command]({{SITE}}/components/command.md): A searchable command list, the core of the command palette. `import {Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandLoading, CommandGroup, CommandItem, CommandLabel, CommandShortcut, CommandSeparator, CommandFooter, CommandHint, useCommand} from '@/components/iota/ui/command'`

### Navigation
- [Tabs]({{SITE}}/components/tabs.md): Panels of one view, with closable and reorderable document tabs. `import {Tabs, TabsList, TabsTrigger, TabsContent, TabsCount, tabsListVariants} from '@/components/iota/ui/tabs'`
- [Breadcrumb]({{SITE}}/components/breadcrumb.md): Where the page sits. `import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, BreadcrumbId, BreadcrumbTrail} from '@/components/iota/ui/breadcrumb'`
- [Pagination]({{SITE}}/components/pagination.md): Moves through pages of results. `import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationInfo, PaginationNav, paginationRange} from '@/components/iota/ui/pagination'`

### Layout
- [Page header]({{SITE}}/components/page-header.md): Title, description, stats and actions at the top of a page. `import {PageHeader, PageHeaderRow, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, PageHeaderActions} from '@/components/iota/ui/page-header'`
- [Collapsible]({{SITE}}/components/collapsible.md): Shows and hides one region, or a group of them. `import {Collapsible, CollapsibleGroup, CollapsibleTrigger, CollapsibleCaret, CollapsibleContent} from '@/components/iota/ui/collapsible'`

### Data
- [Table]({{SITE}}/components/table.md): Rows and columns with sort, selection, row actions and virtualization. `import {Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, TableEmpty, TableFrameHeader, TableToolbar, tableFrameClassName, tableRowClassName, TableRowActions, TableRowAction, TableRowActionsMenu, TableRowActionsItem, TableRowActionsSeparator, DataTable, DataTableCheckbox, DataTableColumnHeader, DataTableColumnsMenu, selectColumn, severitySort, statusSeverity, useWindowedRows} from '@/components/iota/ui/table'`
- [Filter bar]({{SITE}}/components/filter-bar.md): Search plus filter chips and clear-all. `import {FilterBar, FilterBarSearch, FilterBarChips, FilterChip, FilterToggle, FilterBarSelect, FilterBarAdd, FilterBarClear, FilterBarCount, useFilteredRows} from '@/components/iota/ui/filter-bar'`
- [Timeline]({{SITE}}/components/timeline.md): Shows when each step of a run started and how long it took, with the slow and failed ones marked. `import {Timeline} from '@/components/iota/ui/timeline'`
- [Data grid]({{SITE}}/components/data-grid.md): A table with spreadsheet behavior: cell focus, editing and paste. `import {DataGrid, DataGridTable, DataGridHeader, DataGridBody, DataGridRow, DataGridHead, DataGridCell, DataGridHelp, useDataGrid, formatCellValue, parseCellValue} from '@/components/iota/ui/data-grid'`

### Code
- [Code block]({{SITE}}/components/code-block.md): Highlighted code, one-line commands and inline code, with copy. `import {CodeBlock, Code, CopyCodeButton, MaskedKey, TokenLine, tokenize, parseLines, commandLines, codeVariants, refClass, matchClass, currentMatchClass, languageLabels} from '@/components/iota/ui/code-block'`
- [JSON view]({{SITE}}/components/json-view.md): Foldable structured output. `import {JsonView, pathOf} from '@/components/iota/ui/json-view'`
- [Log viewer]({{SITE}}/components/log-viewer.md): Streaming lines with levels, search and follow. `import {LogViewer} from '@/components/iota/ui/log-viewer'`

### Media and charts
- [Attachment]({{SITE}}/components/attachment.md): A file in a form, prompt or message, with drop zone and image tile. `import {Attachment, AttachmentGroup, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentProgress, AttachmentActions, AttachmentAction, AttachmentTrigger, AttachmentGlyph, AttachmentDrop, AttachmentDropIcon, AttachmentDropTitle, AttachmentDropDescription, AttachmentDropTrigger, AttachmentTile, attachmentVariants, attachmentDropVariants, attachmentTileVariants, fileGlyph, formatBytes, formatProgress, rejectionReason, acceptTokens, dragVerdict, describeAccept, useAttachmentDrop} from '@/components/iota/ui/attachment'`
- [Chart]({{SITE}}/components/chart.md): Line, bar, sparkline or status buckets, with frame states, legend, tooltip and data table built in. `import {Chart, unitFormat, ChartContainer, ChartPlot, ChartSwatch, WithChart, useChart, useOptionalChart, useElementWidth, useElementDirection, useRovingPoints, seriesTone, inkSteps, niceScale, formatCompact, numberAt, ChartTooltip, ChartTooltipContent, ChartTooltipRow, ChartDataTable, ChartLegend, chartLegendVariants, LineChart, monotonePath, linearPath, stepPath, BarChart, Sparkline, sparklineVariants, StatusBar, statusBarVariants, ChartFrame, chartFrameVariants} from '@/components/iota/ui/chart'`

### AI
- [Message]({{SITE}}/components/message.md): One turn from the person or the agent, plus dividers. `import {MessageGroup, Message, AgentTurn, MessageAvatar, MessageAgentAvatar, MessageContent, MessageHeader, MessageMeta, MessageTime, MessageModel, MessageStatus, MessageFooter, MessageWorked, MessageBubble, MessageBubbleContent, MessageReactions, MessageSendState, MessageDivider, MessageDividerIcon, messageVariants, bubbleVariants, dividerVariants} from '@/components/iota/ai/message'`
- [Conversation]({{SITE}}/components/conversation.md): Keeps a streaming thread pinned to the bottom until the person scrolls. `import {Conversation, ConversationProvider, ConversationViewport, ConversationContent, ConversationItem, ConversationTail, ConversationJump, ConversationTimeline, ConversationRetry, ConversationError, useConversation, useStickToBottom, useStableRows, useCountdown, STICK, REATTACH} from '@/components/iota/ai/conversation'`
- [Response]({{SITE}}/components/response.md): Markdown that renders as it streams. `import {Response, usePacedText, splitChunks, parseMarkdown, resolveTag, viableLength, completeJsonEnd, closeJson, nextCut, paceStep, safeHref, responseVariants} from '@/components/iota/ai/response'`
- [Reasoning]({{SITE}}/components/reasoning.md): The model's thinking, open while it streams and folded when done. `import {Reasoning, ReasoningTrigger, ReasoningContent, reasoningHeading} from '@/components/iota/ai/reasoning'`
- [Tool call]({{SITE}}/components/tool-call.md): One call with its name, arguments, status, duration and output. `import {splitForce, ToolCall, ToolCallGroup, ToolCallList, CappedOutput, DiffCount, toolCallsReducer, useToolCalls, groupToolCalls, registerTool, resolveTool, summarizeToolCalls, toolActivity, toolLabel, formatDuration, cleanOutput, isTerminal} from '@/components/iota/ai/tool-call'
import {RequestTicker, RequestSummary, ShowMoreRow, summarizeRequests, codeClass} from '@/components/iota/ai/request-ticker'`
- [Activity]({{SITE}}/components/activity.md): What the agent is doing now, with the first-wait loader. `import {Activity, ActivityText, ActivityGroup, Disclosure, StepGlyph, pastTense, joinSummary, pickActivity, useAntiFlicker, useHeldPhrase, MIN_DISPLAY, activityVariants, rowVariants} from '@/components/iota/ai/activity'`
- [Prompt input]({{SITE}}/components/prompt-input.md): The composer editor with mentions, slash commands and voice. `import {PromptInput, PromptInputModel, PromptAttachment, PromptQueue, PromptInputMic, serializePrompt, acceptsFile} from '@/components/iota/ai/prompt-input'`

## iOTA components
These come from the iOTA apps and live in `@/components/iota-app`. Each wraps shadcn primitives where one exists. Read a component's page before using it.

### Actions

### Controls
- [Color picker]({{SITE}}/components/color-picker.md): A swatch that opens saturation, hue, hex, swatches and the eyedropper in a shadcn Popover.
- [Control row]({{SITE}}/components/control-row.md): A labelled panel row matching the sliders, for a swatch, toggle or select.

### Feedback
- [Origin wave]({{SITE}}/components/origin-wave.md): A dot grid that ripples out from its origin, iOTA's spinner.

### Brand
- [Pixel title]({{SITE}}/components/pixel-title.md): The wordmark types itself out, then letters keep morphing between Geist Pixel variants.

### Layout
- [Scales]({{SITE}}/components/scales.md): A repeating line pattern for quiet texture behind a panel.
- [FAQ]({{SITE}}/components/faq.md): Single-open questions on shadcn Accordion, the open one on a soft panel.

### Motion
- [Text effects]({{SITE}}/components/text-effects.md): Text that arrives or changes with motion: a cycling word, a typewriter line and a word-by-word reveal.
- [Reveal]({{SITE}}/components/reveal.md): Fades a block up once it scrolls into view.

## Loaders
Use Origin Wave for a brand loading moment. For other matrix loaders, use Dot Matrix (https://dotmatrix.zzzzshawn.cloud/), a free shadcn registry of 55+ loaders: `npx shadcn@latest add @dotmatrix/<loader-name>`, for example `@dotmatrix/dotm-square-3`. Check the loader's name on the site first, and color it with `--brand`. A running status in a row stays Status, not a matrix loader.

## Brand moments
The anti-slop list governs product UI. Two things are exempt because they are rare and carry no information: the Geist Pixel wordmark and its morph, and the slow canvas float. All of them stop under reduced motion. Do not borrow them for product screens.

## Motion
Read {{SITE}}/foundations/motion.md before animating. Short form: transform and opacity only, under 300ms on UI, `--ease-step`, never `ease-in`, never scale(0), `active:scale-[0.97]` on pressables.

## Foundations
- [Color]({{SITE}}/foundations/color.md): Five hues name the kind of thing, and amber and red mean trouble.
- [Typography]({{SITE}}/foundations/typography.md): One sans for every word, mono for what a person copies.
- [Space]({{SITE}}/foundations/space.md): How much room goes between things, in steps of 4px.
- [Radius]({{SITE}}/foundations/radius.md): How round each corner is, from square marks to 10px frames, with 6px controls.
- [Borders and lines]({{SITE}}/foundations/borders-and-lines.md): Grey fields keep things apart, and hairlines go only where a field cannot.
- [Elevation]({{SITE}}/foundations/elevation.md): Everything is flat, and only overlays get a shadow.
- [Motion]({{SITE}}/foundations/motion.md): How things move, fast and only when something changes.
- [Iconography]({{SITE}}/foundations/iconography.md): A few solid icons, only for actions you find by their shape.
- [Grid]({{SITE}}/foundations/grid.md): The columns and gutters a page sits on, at every width.
- [Anti-slop]({{SITE}}/foundations/anti-slop.md): The habits of generated UI to avoid, and what to do instead.

## Add a component
`npx shadcn@latest add {{SITE}}/r/<name>.json`, the name being the last part of its page link.

## Credits
Adapted from work by Arlan Marat, MIT licensed. See NOTICE.md.
