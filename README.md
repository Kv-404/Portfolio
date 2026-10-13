# kv404.dev

Personal portfolio of Kv — computer science student in Mumbai.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** with a two-anchor token system (`--base` / `--base-foreground`) and one signal colour
- **Satoshi** for body text, **Pixelify Sans** for the wordmark, **Geist Mono** for the small type
- **Motion** (framer-motion) for interaction and layout animation
- **Lenis** for smooth scrolling on pointer-fine devices
- **Nodemailer** for the contact form relay

## Structure

```
app/                  routes: / , /projects , /contact , /api/*
components/layout/    container, rails, rules, nav, footer — the design system
components/home/      one file per home-page section
components/projects/  project card, grid and searchable list
components/ui/        shadcn primitives actually in use
lib/content/          all site content as typed data (single source of truth)
hooks/                interaction feedback (sound + haptics)
```

Content lives in `lib/content/`. Editing a project, role or link there updates
every place it appears — the home page, `/projects`, the command menu and the
JSON-LD structured data.

## Design system

The theme derives from two colour anchors, pure black and white. Layout
is one 715px column marked by full-height rails, with sections separated by
full-bleed hatch bands (`HatchRule`) and hairlines (`.screen-line-top` /
`.screen-line-bottom`).

## Local development

```bash
npm install
npm run dev
```

Environment variables (see `.env.local`):

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` `SMTP_FROM` | Contact form relay |
| `CONTACT_TO` | Where contact messages are delivered |
| `GITHUB_USERNAME` | GitHub login for the contribution graph. Defaults to `Kv-404` |

The activity graph reads the public contribution calendar, so it shows
without a token. It hides only if that feed is unreachable.

## Keyboard

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Command menu |
| `D` | Toggle theme |

Interface sound is off by default and can be enabled from the command menu.
All motion respects `prefers-reduced-motion`.

## License

[MIT](LICENSE) © 2026 Kv.
