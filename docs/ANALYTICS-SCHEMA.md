# Analytics Event Schema

_Plausible custom events for cyberdaemon.ai. Locked 2026-09-29._
_Deploy when: analytics-tripwire.yml fires (5+ articles published)._
_Platform: Plausible Cloud. Implementation: custom events via Plausible script._

---

## Why three events

Two pipeline questions drive this schema:

1. **Where do readers stop?** Structural signal for Blog-Pipeline Stage 3 — avoid argument
   shapes that create drop-off. Also a threads-not-pulled signal (the section where people
   stop is often where the argument breaks down).

2. **Which articles get completed?** Demand signal for Stage 2 gap analysis — high completion
   on a topic suggests adjacent articles worth writing.

Everything else is derivable from these three events.

---

## Events

### `article-view`

Fires on article page load. Replaces Plausible's default pageview for articles — use this
instead to attach lane and slug metadata.

```js
plausible('article-view', {
  props: {
    slug: 'how-i-broke-my-own-agent',       // kebab-case, matches MDX filename
    lane: 'build-logs',                      // build-logs | analysis | research
    referrer_type: 'search'                  // direct | search | social | internal | other
  }
})
```

`referrer_type` derivation:
- `document.referrer` empty → `direct`
- referrer includes google/bing/ddg → `search`
- referrer includes twitter/linkedin/hn/reddit → `social`
- referrer is cyberdaemon.ai → `internal`
- else → `other`

---

### `section-exit`

Fires when a section scrolls out of viewport (IntersectionObserver, threshold 0.1).
Tracks the last section the reader was in — primary drop-off signal.

```js
plausible('section-exit', {
  props: {
    slug: 'how-i-broke-my-own-agent',
    section_id: 'the-actual-failure',        // heading text → kebab-case
    section_index: 3,                        // 0-based position in article
    time_spent_ms: 14200                     // ms in viewport before exit
  }
})
```

Implementation: wire to IntersectionObserver on each `<h2>` and `<h3>` in the article layout.
Fire on exit (isIntersecting = false), record time since entry.

**Key derived metric**: last `section-exit` event per session = where the reader stopped.

---

### `read-complete`

Fires once when scroll depth reaches 90% of article body.

```js
plausible('read-complete', {
  props: {
    slug: 'how-i-broke-my-own-agent',
    completion_pct: 92,                      // actual scroll depth at fire time
    total_time_ms: 187000                    // ms since article-view
  }
})
```

Implementation: ScrollObserver on a sentinel element placed at 90% of article body.
Fire once per session (guard with a boolean flag).

---

## Pipeline integration

| Event | Pipeline stage | Signal |
|-------|---------------|--------|
| `article-view` (referrer_type) | Stage 2 raw material | demand by source channel |
| `section-exit` (section_id, last per session) | Stage 3 structural synthesis | drop-off by argument position |
| `read-complete` (completion_pct) | Stage 2 gap analysis | topic demand signal |

Plausible query at Stage 2: articles with `read-complete` rate > 60% in last 30 days →
adjacent topic candidates. Articles with `section-exit` clustering on section_index 1-2 →
structural opening problem.

---

## Implementation checklist (open when vault-0frp trips)

- [ ] Create Plausible Cloud account, add cyberdaemon.ai domain
- [ ] Add Plausible script to Astro layout (`src/layouts/ArticleLayout.astro`)
- [ ] Add `PLAUSIBLE_DOMAIN` env var to Vercel project
- [ ] Wire `article-view` event on page load in article layout
- [ ] Wire `section-exit` IntersectionObserver on h2/h3 elements
- [ ] Wire `read-complete` ScrollObserver sentinel at 90% body
- [ ] Verify events firing in Plausible dashboard on a test article
- [ ] Update Blog-Pipeline.md Extension Slot E1 with live endpoint
