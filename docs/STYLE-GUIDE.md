# cyberdaemon.ai Style Guide

Design and writing reference for all cyberdaemon.ai content. This document describes the visual system, component library, article structure, frontmatter schema, and tone standards.

Read `PUBLISHING-STANDARDS.md` first. That document governs what ships. This document governs how it looks and reads.

---

## Typography

### Font Stack

| Role | Family | Fallbacks | Usage |
|---|---|---|---|
| Headings | Source Serif 4 | Georgia, Times New Roman, serif | h1, h2, h3 (h3 overridden to mono in article body), hero titles, pull quotes |
| Body | Inter | system-ui, sans-serif | Paragraphs, UI text, callout content, footnotes |
| Code / Labels | IBM Plex Mono | Fira Code, monospace | Inline code, section labels, lane tags, metadata, table of contents, stat labels |

### Type Scale

| Token | Size | Use |
|---|---|---|
| display | 2.5rem | Page titles, hero headings |
| title | 1.875rem | Section hero, large callouts |
| heading | 1.25rem | h2 in article body |
| body | 1.125rem | Article body text (Source Serif 4 in `.article-body`) |
| small | 0.875rem | Callout body, secondary text |
| label | 0.75rem | Section labels, metadata, tags |

Base font size: 18px on `html`. Article body renders at 1.125rem (approximately 20px).

### Heading Rules

- No periods at the end of any heading or title.
- h1: hero only, handled by `ArticleHero`. Never use h1 inside article body.
- h2: Source Serif 4, 1.3rem, semibold, bottom border. Major sections.
- h3: IBM Plex Mono, 0.75rem, uppercase, letter-spaced. Subsections.
- Prefer `SectionLabel` before h2 for visual rhythm. The label is the lane-colored uppercase marker; the h2 is the readable heading.

---

## Color System

### Backgrounds

| Token | Hex | Use |
|---|---|---|
| bg / canvas | `#111210` | Page background |
| surface | `#1a1917` | Cards, stat rows, elevated surfaces |
| border | `#2e2c29` | All borders, dividers, hr |

### Text

| Token | Hex | Use |
|---|---|---|
| text-primary / ink | `#e8e5de` | Headings, strong text, primary content |
| text-secondary / ink-2 | `#b0ada6` | Body text, callout content, code |
| text-muted / ink-muted | `#706e68` | Metadata, captions, subtitles, muted labels |
| text-dim | `#4a4842` | Timestamps, separators, ultra-muted |

### Accents

| Token | Hex | Use |
|---|---|---|
| accent / teal | `#00c8a0` | Links, active states, teal lane, selection bg, stat values |
| gold | `#c9a84c` | Analysis lane, warning callouts |
| purple | `#9b8ecf` | Build log lane |
| critical | `#c1121f` | Critical callouts, error states |

### Lane Colors

| Lane | Color | Hex |
|---|---|---|
| Research | Teal | `#00c8a0` |
| Analysis | Gold | `#c9a84c` |
| Build Logs | Purple | `#9b8ecf` |

Lane colors appear in: `ArticleHero` dot and label, `SectionLabel` default color, stat value color (teal default), lane tags on index pages.

---

## Components

All components live in `src/components/`. Import them in MDX files with relative paths from the content directory.

### Standard import block

Every article starts with the same import block after the frontmatter:

```mdx
import Callout from '../../components/Callout.astro';
import StatRow from '../../components/StatRow.astro';
import PullQuote from '../../components/PullQuote.astro';
import SectionLabel from '../../components/SectionLabel.astro';
import ScrollReveal from '../../components/ScrollReveal.astro';
import DiagramBlock from '../../components/DiagramBlock.astro';
```

Only import what you use. `ArticleHero` and `TableOfContents` are handled by the layout; do not import them in article content.

---

### Callout

Colored callout box with left border accent. Four variants.

**Props:**
- `variant`: `'insight'` | `'warning'` | `'critical'` | `'note'` (required)
- `label`: string (optional, overrides default label)

**Default labels:** Insight, Warning, Critical, Note

**When to use each:**
- `insight`: key takeaways, important observations, "here's the thing" moments
- `warning`: gotchas, caveats, things that will bite you
- `critical`: security risks, hard failures, things that must not be ignored
- `note`: context, background, setup information, article framing (e.g., "This is original research")

**Examples:**

```mdx
<Callout variant="insight">
The breach was not a failure of authentication. Every credential check passed.
The failure was authorization: no system asked whether the agent *should* be
doing what it was doing.
</Callout>

<Callout variant="warning" label="Heads Up">
This pattern only works when the agent declares intent at session start. If
there is no declared intent, there is nothing to compare against.
</Callout>

<Callout variant="critical">
If your runtime authorization checks are scoped only to "can this identity
access this resource," you are checking the wrong question.
</Callout>

<Callout variant="note" label="Original research">
DIRA is original research by Casey Gager, developed on personal time and
equipment.
</Callout>
```

**Frequency:** at least one per article. Do not stack three callouts in a row; break them up with body text.

---

### StatRow

Three-column stat grid with large serif numbers and small mono labels. Responsive: stacks to single column on mobile.

**Props:**
- `stats`: array of `{ value: string, label: string }` (required, exactly 3 items)

**When to use:** metrics, comparisons, key numbers that anchor an argument. Incident stats, performance benchmarks, before/after comparisons.

**Example:**

```mdx
<StatRow stats={[
  { value: "17,600", label: "Autonomous actions logged" },
  { value: "4.5 days", label: "Before detection" },
  { value: "9", label: "Zero-day CVEs exploited" }
]} />
```

**Rules:**
- Always exactly 3 stats. The grid is designed for 3 columns.
- Values should be short: numbers, percentages, durations. Not sentences.
- Labels are uppercase mono text. Keep them under 25 characters.
- Wrap in `<ScrollReveal>` for entrance animation.

---

### PullQuote

Serif italic blockquote with teal left border. For thesis statements and key arguments.

**When to use:** the single most important claim in a section. The sentence a reader should remember. Not for citations (use footnotes) or background (use blockquote markdown).

**Example:**

```mdx
<PullQuote>
An agent can hold every permission it needs and still be doing the wrong thing.
That gap between "permitted" and "intended" is the dual-intent problem.
</PullQuote>
```

**Rules:**
- Maximum one per major section. Overuse kills the emphasis.
- Keep to 2-3 sentences. If it needs more, it is not a pull quote; it is a paragraph.
- Wrap in `<ScrollReveal>` for entrance animation.
- Supports `<cite>` element for attribution inside the quote.

---

### SectionLabel

Uppercase mono label with an extending line. Marks major section transitions.

**Props:**
- `text`: string (required)
- `color`: string (optional, defaults to `#00c8a0` teal)

**When to use:** before every h2 heading. Provides the lane-colored visual marker that separates major sections.

**Example:**

```mdx
<SectionLabel text="The Attack Chain" />

## The lateral movement path
```

**Rules:**
- Always paired with an h2 immediately after it.
- Use default teal color unless there is a specific reason to override (e.g., gold for a warning section).
- Text should be short: 2-4 words. It is a label, not a heading.

---

### ScrollReveal

Wrapper that fades and slides content upward on scroll. Uses IntersectionObserver.

**When to use:** key visual elements: stat rows, diagrams, pull quotes, important callouts. Not every element. Overuse makes the page feel sluggish.

**Example:**

```mdx
<ScrollReveal>
<StatRow stats={[
  { value: "110K", label: "API keys exposed" },
  { value: "36h", label: "Time to detection" },
  { value: "14", label: "Compromised repos" }
]} />
</ScrollReveal>
```

**Rules:**
- Wrap `StatRow`, `DiagramBlock`, and `PullQuote` by default.
- Do not wrap consecutive paragraphs. It looks like a loading screen, not an article.
- Do not wrap `Callout`; callouts should be immediately visible.
- Do not nest `ScrollReveal` inside another `ScrollReveal`.

---

### DiagramBlock

Dark card container for Mermaid diagrams with optional caption.

**Props:**
- `caption`: string (optional)

**When to use:** architecture diagrams, attack chains, flow diagrams, sequence diagrams. At least one per article.

**Example:**

```mdx
<DiagramBlock caption="Authorization flow: token validation plus intent verification">
{`graph LR
    A[Agent Request] --> B{Token Valid?}
    B -->|Yes| C{Intent Match?}
    B -->|No| D[Reject]
    C -->|Yes| E[Allow]
    C -->|No| F[Flag + Review]`}
</DiagramBlock>
```

**Rules:**
- Always include a caption. Diagrams without captions are inaccessible.
- Use Mermaid syntax inside the block. Wrap in template literal backticks if the Mermaid contains special characters.
- Keep diagrams readable at article width (720px max). If a diagram needs to be wider, simplify it.
- Wrap in `<ScrollReveal>` for entrance animation.
- Remember the publishing standards: no real node names, IPs, service names, or internal identifiers in diagrams.

---

### ArticleHero

Hero section with lane label, pulsing dot, title, subtitle, and metadata. Handled by the `Article.astro` layout. Do not import or use directly in article content.

**Driven by frontmatter:** title, description (becomes subtitle), date, lane (inferred from content collection), readTime (optional).

---

### TableOfContents

Sticky sidebar nav generated from heading data. Scroll-spy highlights active section. Handled by the layout. Do not import or use directly in article content.

Filters to h2 and h3 only. Ensure heading text is concise enough to read in a narrow sidebar.

---

## Article Structure

Every article follows this skeleton. The specific content varies, but the structural rhythm is consistent.

### 1. Frontmatter

Required fields. See Frontmatter section below.

### 2. Component imports

Standard import block (only what you use).

### 3. Opening hook

1-2 sentences. The problem, the thesis, or the inciting question. No preamble. No throat-clearing. Drop the reader into the middle of the thought.

Good: "In July 2026, two AI models being evaluated inside a sandbox escaped containment."

Bad: "In today's rapidly evolving AI landscape, security professionals face unprecedented challenges..."

### 4. Body sections

Each major section follows this pattern:

```
<SectionLabel text="Section Name" />

## Readable Heading

Body text. Short paragraphs. Active voice.

<ScrollReveal>
<StatRow ... /> or <DiagramBlock ... /> or <PullQuote ... />
</ScrollReveal>

More body text.

<Callout variant="insight">Key takeaway for this section.</Callout>

---
```

### 5. Minimum component usage per article

- At least 1 `DiagramBlock` (preferably with Mermaid)
- At least 1 `Callout` (any variant)
- At least 1 `PullQuote` for the thesis statement
- `SectionLabel` before every h2
- `ScrollReveal` on stat rows, diagrams, and pull quotes
- Footnotes for all citations (use markdown footnote syntax)

### 6. Section breaks

Use `---` (horizontal rule) between major sections. This renders as a subtle border line in the article body.

### 7. No conclusion headers

Do not write a section called "Conclusion" or "Summary." The last section should be forward-looking or action-oriented: "What I'm watching next," "Where this breaks," "The open question." End with something the reader can think about, not a recap of what they just read.

---

## Frontmatter

### Schema

Defined in `src/content/config.ts`. All articles across all lanes share the same schema.

```typescript
{
  title: string,        // required
  description: string,  // required, becomes hero subtitle
  date: Date,           // required, YYYY-MM-DD format in frontmatter
  draft: boolean,       // optional, default false
  tags: string[],       // optional, default []
  featured: boolean,    // optional, default false
}
```

### Rules

- **title**: sentence case. No periods. Under 80 characters. Should be interesting enough to click on, specific enough to be useful.
- **description**: 1-2 sentences. The thesis or the problem. This appears as the hero subtitle and in social previews. No periods at the very end is acceptable but not required for descriptions (they are sentences, not titles).
- **date**: the intended publish date, not the writing date. Format: `YYYY-MM-DD` (Astro parses it to a Date object).
- **draft**: set to `true` to exclude from production builds. Remove or set `false` when publishing.
- **tags**: lowercase-kebab-case. See tag conventions below.
- **featured**: `true` for cornerstone content only. Limit to 2-3 featured articles at any time. Featured articles get promoted placement on index pages.

### Tag Conventions

Tags are lowercase-kebab-case strings. Use existing tags when possible. Create new tags only when no existing tag fits.

**Established tags (from current content):**

| Domain | Tags |
|---|---|
| AI/Agents | `agentic-ai`, `autonomous-agents`, `ai-governance`, `ai-memory`, `ai-security`, `ai-rmf` |
| Identity | `identity`, `nhi`, `authorization`, `human-in-the-loop` |
| Security | `security`, `incident-response`, `zero-trust` |
| Frameworks | `dira`, `padcn`, `isa`, `mcp`, `nist`, `sp-800-207` |
| Technical | `vector-search`, `episodic-memory`, `compression`, `infrastructure`, `ci-cd`, `structured-prompting` |
| Project | `prometheus`, `b0b`, `fleet-management` |
| Standards | `governance`, `risk-management`, `compliance`, `model-context-protocol` |

**Tag rules:**
- 3-7 tags per article. Enough to be findable, not so many that tags lose meaning.
- First tag should be the primary topic.
- Include the lane-relevant domain tag (e.g., articles in `research/` should include the framework or concept tag).
- Use `prometheus` tag only when the Prometheus system is explicitly part of the article topic.
- Never create tags that reveal internal system names that violate publishing standards.

### Example Frontmatter

```yaml
---
title: "Dual-Intent Runtime Authorization: the authorization model AI agents actually need"
description: "AI agents act on behalf of humans, not as them. OAuth checks what they can do. DIRA checks whether what they're doing matches what they said they would."
date: 2026-08-29
tags: ["dira", "authorization", "agentic-ai", "zero-trust", "nhi", "identity"]
featured: true
---
```

---

## Tone Examples

### Opening hooks

**Good:**

> In July 2026, two AI models escaped containment. Not through a novel exploit. Through authorization that was technically correct and completely insufficient.

Why it works: drops you into the story, specific, active voice, short sentences, stakes are clear.

**Bad:**

> In today's increasingly complex cybersecurity landscape, organizations face growing challenges as AI agents proliferate across enterprise environments, creating unprecedented risks that demand new approaches to authorization and governance.

Why it fails: throat-clearing, no specifics, passive construction, buzzword density, tells you nothing you did not already know.

---

### Explaining a technical concept

**Good:**

> prom-memory stores typed facts, not documents. A decision is different from a gotcha is different from a milestone. The type matters because it controls retrieval. When I ask "what broke last time I touched DNS," the system knows to look for gotchas and incident facts, not meeting notes.

Why it works: concrete, shows the reasoning, uses real examples, conversational.

**Bad:**

> The episodic memory system utilizes a sophisticated taxonomy-based approach to information classification, enabling semantically-aware retrieval of contextually relevant facts through type-driven query optimization.

Why it fails: "utilizes," "sophisticated," "enabling," "contextually relevant," jargon wall, says nothing specific.

---

### Stating an opinion

**Good:**

> NIST SP 800-207 is a good framework. It is not a good implementation guide. The gap between "here are the principles" and "here is how you wire it" is where most zero trust projects die.

Why it works: direct, opinion stated, reasoning follows immediately, no hedging.

**Bad:**

> While NIST SP 800-207 provides valuable guidance, it could perhaps be argued that there is sometimes a gap between theoretical frameworks and practical implementation, which may present challenges for some organizations.

Why it fails: "perhaps," "could be argued," "sometimes," "may present," every possible hedge word stacked into one sentence.

---

### Describing what you built

**Good:**

> The memory layer runs hybrid search: vector embeddings for semantic similarity, BM25 for keyword precision. Neither alone is good enough. Vectors miss exact terms. Keywords miss meaning. Together they cover most of the retrieval space.

Why it works: says what it is, says why, no jargon without explanation, pattern-level (no service names or infrastructure details).

**Bad:**

> I deployed a LanceDB instance on my Orin AGX node at 100.98.156.70 with tantivy for BM25, configured K3s to schedule the pod on the GPU namespace, and connected it to prom-memory via the internal API at port 8742.

Why it fails: violates every publishing standard. Node names, IPs, ports, internal service names, infrastructure topology.

---

### Humor and self-awareness

**Good:**

> I built a system to manage autonomous agents. Then one of the agents decided it had better ideas about its own task queue than I did. The system worked exactly as designed. The design was the problem.

Why it works: self-deprecating, funny, real, sets up the learning moment.

**Bad:**

> LOL my AI went rogue!!! But seriously folks, agent management is no laughing matter. Here's why you need to take it seriously...

Why it fails: forced, switches tone mid-thought, "seriously folks" is a crutch, "here's why you need to" is infomercial energy.

---

## Voice Registers

cyberdaemon.ai has two distinct writing registers. Know which one you are in before you write the first sentence.

### Register 1 — Build-Log

Use in `lane: build-logs`. What I tried. What broke. What I learned.

- Specific, honest, shows receipts. Exact dates, versions, real error messages.
- Never "we found that..." — "I built X and it did Y and here is the error."
- Self-aware about failures. The failure is the point, not a embarrassment to minimize.
- Present tense for the story, past tense for the aftermath.

### Register 2 — Thesis/Opinion

Use in `lane: analysis` or `lane: research`. Casey has a take. States it plainly.

- Claim first. Not hedged, not "it could be argued." Stated.
- Counterarguments section is mandatory: H2 heading, minimum 3 substantive points. Not strawmen.
- Frames from the practitioner vantage: what does this mean for someone actually building this?
- The counterarguments section is where the intellectual honesty lives. Do not skip it.

### Opening Sequence (both registers)

**story then observation then problem then argument.** In that order.

The argument is earned by the second paragraph, not stated in the first. The reader should be in the room — in the specific incident, the specific failure, the specific thing that happened — before they know what is being argued.

Good: "In September I had 22 open PRs and no way to approve them from my couch."
Not: "Autonomous agents create approval bottlenecks that challenge traditional review workflows."

### Sarcasm

Sarcasm is available. It is a register within the voice, not a mode. It varies by material.

- Dry: "nobody actually calls it that in a real meeting"
- Deadpan: "obviously this is fine"
- Dark: "this is the third time this month, which tells you something"
- Absurdist: "the correct solution is apparently to teach the agent to feel shame"

Never forced. Never the only note. Variations are the point.

The voice is never doom-posting, never cheerleading, never corporate-safe. Afraid of the sarcasm is a failure mode.

### Humility

Builder in a basement having fun learning. Not an authority figure delivering verdicts.

Do not brag. Do not announce credentials. Do not position experience as a status claim.

Bad: "As someone who has worked with enterprise clients across verticals..."
Bad: "With over a decade of experience in IAM..."
Good: write like someone who knows. Let the knowing be visible in specifics, not stated in bios.

### Voice Calibration Delta Log

Casey's edit cycles produce voice deltas. Each delta reveals a principle. Read the delta log at `C:/do-not-use/planning/blog-planning/voice-calibration.md` before drafting any article. Apply the deltas — this is how voice accuracy improves over time.

---

## Diagram Guidelines

- Use Mermaid syntax. The site renders Mermaid client-side inside `DiagramBlock`.
- Style nodes to match the dark palette: `fill:#1a1917`, `stroke:#00c8a0` (or lane color), `color:#E6EDF3`.
- Keep diagrams to 5-9 nodes. More than that needs to be split into multiple diagrams.
- Captions are mandatory.
- No real node names, IPs, service names, or internal identifiers in diagrams. Use functional labels ("Auth Service," "Intent Validator," "Agent Runtime").
- Prefer `graph LR` (left-to-right) for flows and chains. Use `graph TD` (top-down) for hierarchies.

---

## Code Blocks

- Use fenced code blocks with language identifier: ` ```python `, ` ```yaml `, ` ```typescript `.
- Code in articles must be illustrative, not copy-paste-runnable. Show the pattern, not the deployment.
- No real configuration values, endpoints, or secrets in code blocks.
- Inline code uses IBM Plex Mono, dark background, subtle border. Use for: tool names, function names, technical terms on first use, file formats.

---

## Footnotes

Use standard markdown footnote syntax:

```markdown
This claim is supported by the incident report[^1].

[^1]: HuggingFace, "Post-Incident Review: ExploitGym Containment Escape," July 2026.
```

Footnotes render in a separate section at the bottom with Inter font, muted color, and a top border. All citations require footnotes. Do not make claims without sources unless the claim is your own opinion (and state it as such).

---

## Responsive Behavior

- Article max-width: 720px, centered.
- `StatRow` collapses to single column below 640px.
- `ArticleHero` title drops from 2.75rem to 2rem below 640px.
- All components are designed for the 720px content column. Do not fight the constraint.
- Test articles on mobile before publishing. The dark palette reads differently on OLED vs LCD screens.
