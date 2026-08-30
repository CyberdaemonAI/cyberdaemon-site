# cyberdaemon.ai

Casey Gager's research and writing platform. AI security practitioner, original research on agentic systems, identity, and Zero Trust.

Built with Astro + Tailwind. Deployed on Vercel.

## Structure

- `/research` — original research (DIRA, Middle-Out, PADCN)
- `/analysis` — practitioner takes on AI security and governance
- `/build-logs` — implementation guides and system design
- `/topics` — all content organized by topic

## Development

```bash
npm install
npm run dev
```

## Publishing

Content lives in `src/content/{research,analysis,build-logs}/`. Each article is an MDX file with frontmatter:

```yaml
---
title: "Article title"
description: "One sentence."
date: 2026-08-29
tags: ["tag1", "tag2"]
featured: false
---
```

Vercel auto-deploys on merge to main.
