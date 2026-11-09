# iOTA design system

A canvas of UI components and an installable skill for coding agents. Built with Next.js, shadcn, Base UI, Tailwind v4, Motion, Lenis, Torph, Phosphor and Hugeicons.

## Develop

```bash
bun install
bun run dev
```

## Deploy

`bun run cf-deploy` builds the static site and deploys it to Cloudflare at design.useiota.space.

## Endpoints

Generated into `public/` by `scripts/build-endpoints.mjs`, which runs before `dev` and `build`.

| Path | What |
|-|-|
| `/components/<name>` | Component on the canvas, with the me and agent views |
| `/components/<name>.md` | Component rules as Markdown |
| `/foundations/<name>.md` | Foundations as Markdown |
| `/skills/<name>/SKILL.md` | One skill |
| `/r/<name>.json` | shadcn registry item |
| `/r/theme.json` | Tokens, styles and the system skill |
| `/.well-known/agent-skills/index.json` | Skill discovery for `npx skills add <site>` |
| `/llms.txt` | Index of everything |

## Layout

- `components/ui`: stock shadcn on Base UI
- `components/iota`: the design system
- `components/iota-app`: components from the iOTA app, wrapping shadcn primitives
- `components/site`: this site's canvas and panels
- `content`: docs and skills in Markdown
- `skills`: generated copy of the skills with real URLs, for `npx skills add bikash1376/design`

## Credits

Adapted in part from work by Arlan Marat, MIT licensed. See `components/iota/THIRD_PARTY_NOTICES.md`.
