# Publishing on cyberdaemon.ai

## Article Lifecycle

1. **Draft** — Jen writes in daemonvault `40 Prometheus/Drafts/`. Frontmatter: `draft: true`.
2. **Auto-dispatch** — vault-2efvr detects the draft, wraps it as MDX, and opens a PR to `src/content/{lane}/`.
3. **CI review** — content-check CI validates frontmatter (title, description, date required). Governance and standards gates run.
4. **Casey review** — Casey reads the PR diff, checks content quality and factual accuracy.
5. **Telegram approval** — Casey approves via the bot. PR merges.
6. **Vercel deploy** — Automatic on merge to master. Article goes live at publish date (see Scheduling below).
7. **Mattermost notification** — content-deployed workflow fires, posts to Mattermost.

## Scheduling Articles

Set `date` in the article frontmatter to a future date (YYYY-MM-DD). The article will be excluded from all collection listings until that date. It is built into the site but not discoverable: collection pages do not show it, but the direct URL resolves (and shows a "not yet published" message until the next build on or after the publish date).

To publish immediately: set `date` to today or any past date.

Note: the publish gate runs at build time, not request time. Vercel rebuilds on every merge to master. If an article has a publish date of tomorrow and you merge today, it will appear in the listing after the next build that runs on or after that date. Force a redeploy or schedule a Vercel build trigger to gate precisely.

## Required Frontmatter

```yaml
---
title: "Article Title"
description: "One to two sentences. Used for OG tags and article listing."
date: 2026-09-15
tags: [tag1, tag2]
---
```

Optional fields (recommended):

- `excerpt`: First pull quote. Used by the OG image generator and article cards.
- `threads`: Manifesto thread tags for cross-linking (agents-as-people, intent-consent, small-vs-large).
- `featured: true`: Pins to the top of the listing. Use sparingly.
- `updates: "original-slug"`: Use when this article amends or supersedes a prior position.

## Editorial Checklist (before approving a PR)

- [ ] Title is declarative, not clickbait
- [ ] Description accurately summarizes the article
- [ ] `date` is set correctly (today for immediate, future date for scheduled)
- [ ] No client names, employer names, or confidential information
- [ ] Factual claims are source-cited or explicitly framed as opinion
- [ ] No em dashes anywhere
- [ ] No AI writing tells (rhetorical setups, "this changes everything", "synergy", "robust")
- [ ] Voice matches Reader Zero: practitioner who has seen this before, not marketing

## Lane Selection

| Lane | Use when |
|------|----------|
| build-logs | You built something and are documenting what happened |
| analysis | You have a position on something in the field |
| research | You surveyed a topic and synthesized findings |

## Views Disclaimer

All content on cyberdaemon.ai represents Casey Gager's personal views and research. Nothing here reflects the positions of any employer or client.
