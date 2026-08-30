<p align="center">
  <strong>cyberdaemon.ai</strong><br/>
  <em>Casey Gager</em>
</p>

<p align="center">
  AI security practitioner. Original research on agentic systems, identity, and Zero Trust.<br/>
  I build what I recommend, then write about what I find.
</p>

<p align="center">
  <a href="https://cyberdaemon.ai">cyberdaemon.ai</a>
</p>

---

> Most security research stops at the recommendation. This site publishes the parts that come after:
> the implementation, the failure modes, and the honest assessment of what actually worked.

## Lanes

| Lane | What goes here |
|------|---------------|
| **Research** | Original frameworks and formal analysis. DIRA, Middle-Out temporal compression, PADCN architecture, NHI identity models. |
| **Analysis** | Practitioner takes on AI governance, Zero Trust applied to agentic systems, and the standards that don't survive contact with production. |
| **Build Logs** | Implementation notes from building Prometheus, the AI system where this research gets tested. prom-memory, CB4A, B0b, ISA-driven development. |

## Design System

Dark scholarly aesthetic. Source Serif 4 for headings, Inter for body, IBM Plex Mono for labels and code. Teal, gold, and purple lane accents on a warm dark canvas (`#111210`).

Component toolkit: callouts (insight/warning/critical/note), stat rows, pull quotes, scroll-reveal animations, section labels, table of contents, diagram blocks, article heroes with lane-colored radial glow.

Design references: OpenAI research publications, Claude documentation, Daniel Miessler's practitioner voice.

## Stack

- [Astro](https://astro.build) 4.15 with MDX
- [Tailwind CSS](https://tailwindcss.com) 3.4
- Deployed on [Vercel](https://vercel.com)
- Content in `src/content/{research,analysis,build-logs}/`

## Development

```bash
npm install
npm run dev       # localhost:4321
npm run build     # static output in dist/
```

## Content Format

Each article is an `.mdx` file with frontmatter and component imports:

```yaml
---
title: "Article title"
description: "One sentence."
date: 2026-08-29
tags: ["tag1", "tag2"]
featured: false
---
```

Components available: `Callout`, `StatRow`, `PullQuote`, `SectionLabel`, `ScrollReveal`, `DiagramBlock`, `TableOfContents`.

## Author

Casey Gager ([daemonprompt](https://github.com/daemonprompt)). Cybersecurity architect, CISSP/CCSP/CISM/CISA, presales solutions engineering. Views are my own, not those of my employer.

---

<p align="center">
  <a href="https://github.com/CyberdaemonAI">CyberdaemonAI</a>
</p>
