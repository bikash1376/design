---
name: Code block
system: iota
source: quartz
kind: component
import: "import {CodeBlock, Code, CopyCodeButton, MaskedKey, TokenLine, tokenize, parseLines, commandLines, codeVariants, refClass, matchClass, currentMatchClass, languageLabels} from '@/components/iota/ui/code-block'"
install: "npx shadcn@latest add {{SITE}}/r/code-block.json"
registryDependencies: [button, copy-button, icon, input, kind, theme, utils]
version: 1
last-updated: 2026-11-08
human: {{SITE}}/components/code-block
---

# Code block

Shows code and commands exactly, ready to copy.

## Look
Syntax is colored from `--code-*` tokens: keywords in brand blue, strings green, JSX tags teal, attributes violet, comments muted. The header shows the file name as written, such as `app.tsx` or `PillButton.tsx`; with no `filename` it shows the language in lowercase. Copy swaps its icon in place, and a labelled copy morphs its word with Torph.

## Use when
- A command a person will paste into a terminal.
- A file, config or excerpt they read and copy from.
- An identifier, path or value inside a sentence, with Code.

## Don't use when
- A secret on its own in a form. Use [Input](/components/input.md).

## Minimal example
```tsx
<CodeBlock variant="command" code={`$ npm install @iota/sdk`}/>
```

## Rules
Ordered by priority. MUST and NEVER break the system if skipped. SHOULD is style.

1. code-block-white-surface NEVER Put a CodeBlock in a Panel or beside Panels; it is a working surface, white with one grey edge and a rule under its header. Because a surface that scrolls, streams or is read closely needs the white frame's edge to show where it ends, and a white frame in a grey Panel is a box in a box.
   - Correct: `<CodeBlock/>`
   - Wrong: `<Panel><PanelBody><CodeBlock/></PanelBody></Panel>`
2. code-block-command-output MUST Show a command and its output in one variant="command" block with the prompt on commands only. Because a plain block copies the $ and the printed output, so a pasted command fails in the terminal.
   - Correct: `<CodeBlock variant="command" code={"$ npm install\nadded 14 packages"}/>`
   - Wrong: `<CodeBlock code={"$ npm install\nadded 14 packages"}/>`
3. code-block-no-dollar-copy NEVER Type $ into a plain block; pass the command as command. Because a plain block copies every character, so the $ lands in the clipboard and the shell answers "command not found".
   - Correct: `<CodeBlock command="npx iota login"/>`
   - Wrong: `<CodeBlock code="$ npx iota login"/>`
4. code-block-secret MUST Pass a key or token in a command as secret; copy still takes the real value. A masked key keeps its length: one dot per hidden character. Because without it the key shows in full to anyone looking at the screen or a screenshot of it.
   - Correct: `<CodeBlock command="export IOTA_KEY=sk_demo_0000aaaa" secret="sk_demo_0000aaaa"/>`
   - Wrong: `<CodeBlock command="export IOTA_KEY=sk_demo_0000aaaa"/>`
5. code-block-highlight SHOULD Mark the 1 to 3 lines the text talks about with highlight and set startLine for an excerpt. Because without startLine an excerpt numbers from 1, so the numbers no longer match the file.
   - Correct: `<CodeBlock code={excerpt} startLine={42} highlight="3-4"/>`
6. code-block-filename SHOULD Name a file the person creates or edits with filename.
   - Correct: `<CodeBlock code={yaml} language="yaml" filename="iota.yaml"/>`
   - Wrong: `<CodeBlock code={yaml} language="yaml"/>`
7. code-block-real-values SHOULD Write example IDs with real prefixes: run_, agt_, key_, dpl_, mdl_. Because the tokenizer underlines those prefixes in their kind, and a bare "123" looks like no ID the API returns.
   - Correct: `client.runs.get("run_8f2a00c4")`
   - Wrong: `client.runs.get("123")`
8. code-block-region-name MUST Pass filename or language on a file block; the scroll body is named from them. Because with neither, the focusable region is named "Text", so a screen reader cannot tell one block from the next.
   - Correct: `<CodeBlock code={code} language="ts" header={false}/>`
   - Wrong: `<CodeBlock code={code} header={false}/>`
9. code-block-token-colors MUST Color syntax through the `--code-*` tokens only. Because a hex in a theme keeps its light color in the dark theme, and one set of tokens keeps every block reading the same.
10. code-block-height SHOULD Set maxHeight to 480 or link the file for a block longer than 24 lines. Because the block grows to its content, so a long file pushes the rest of the page out of reach.
   - Correct: `<CodeBlock code={long} maxHeight={480}/>`

## API
| Prop | Type | Default | Note |
|-|-|-|-|
| `code` | `string` | `''` | Command block: prompt lines are commands, the rest is output. |
| `variant` | `'block' \| 'command'` | `'block'` | command copies only the commands. |
| `command` | `string \| string[]` |  | Commands without prompts; implies command. |
| `prompt` | `string` | `'$'` | Never selected or copied. |
| `secret, defaultRevealed` | `string, boolean` | `, false` | Shown as dots until revealed. |
| `language` | `'ts' \| 'tsx' \| 'js' \| 'json' \| 'bash' \| 'python' \| 'yaml' \| 'text'` | `'text'` | Tokenizer and header label. |
| `filename, header` | `string, boolean` | `, true` | Header row. |
| `lineNumbers, startLine, highlight` | `boolean, number, number[] \| string` | `true, 1` | Gutter, first number, marked lines "3-4,9". |
| `defaultWrap, maxHeight` | `boolean, number` | `false` | Start wrapped; scroll past px. |
| `refs, detectRefs` | `{text, kind, href?}[], boolean` | `[], true` | Underline resource IDs in their kind line step. |
| `size` | `'sm' \| 'default'` | `'default'` | Command line height 24 or 28px. |
| `copyLabel, onCopy` | `string, (text) => void` | `'Copy code'` | Copy button name and callback. |
| `Code kind, href, variant` | `Kind, string, 'default' \| 'plain'` |  | Inline code. |
| `kind` | `Kind` |  | Sets data-kind on the file frame for a file that belongs to a kind. It draws no mark of its own. |
| `MaskedKey prefix, tail, length` | `string, string, number` | `required` | A key the server keeps the tail of, as long as the real key: sk_demo_••••i0p0. |
Other props pass through to the root element.

## Variants and states
- variant: block, command
- size: sm, default
- inline: default, plain, kind
- states: rest, focus-visible, secret hidden, secret shown, copied, copy failed, wrapped, highlighted line

## Accessibility
- [ ] The block is a figure; the body is a focusable region named by filename, language or "Command".
- [ ] Arrows and Page Up or Down scroll the focused body.
- [ ] Copy confirms in place and announces "copied"; a refused clipboard announces how to copy by hand.
- [ ] Wrap and reveal are toggle buttons with aria-pressed.
- [ ] The prompt, line numbers and secret dots are aria-hidden and never selected or copied.
- [ ] The code always reads left to right (dir="ltr").

## Edge cases
- Long line -> Scrolls sideways with the gutter held; wrap breaks anywhere.
- One-character command -> Keeps the 32px box with copy at the end.
- Empty code -> Renders one empty line; do not render an empty block.
- 120px container -> The command scrolls in its body; copy stays visible.
- Right to left -> The chrome mirrors; the code stays left to right.
- Zoom 200% -> The line height grows with the font; nothing clips.
- Heredoc in a command block -> The body reads as output; pass command for those.
- Ten copies in a second -> Each restarts the 1.6s confirm; no flicker.
- Secret wider than the line -> The dots keep the key's length and the line scrolls; the dots never shrink in a command.
- Forced colors -> The frame edge draws in CanvasText, Code takes a border, highlights an outline.
- Reduced motion -> Nothing moves; the copy confirm is a cut.

## Tokens
--code-punct, --code-number, --code-attr, --code-tag, --code-keyword, --line-frame, --line-row, --surface-card, --code-text, --type-code, --code-string, --code-comment, --weight-strong, --code-prompt, --accent-wash, --accent-line, --accent-mark, --type-label-sm, --type-tag, --text-3, --radius-inner, --radius-frame, --features-id

## Related
- [Copy button](/components/copy-button.md): Copies a value and confirms in place.
