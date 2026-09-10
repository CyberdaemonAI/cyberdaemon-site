# Diagram Guide — cyberdaemon.ai

Reference for all visual elements in cyberdaemon.ai articles. B0b reads this before
placing any visual. Casey reads this before writing an illustration brief.

## When to Use a Visual

A diagram earns its place when it reveals something the prose cannot. If it illustrates
what the text already said, cut it. The test: would the article be weaker without it?

## Tier Decision

| Situation | Tier |
|-----------|------|
| Technical flow, sequence, state machine, data pipeline | 1 — Mermaid |
| Mental model, rough concept, "here's how I was thinking about it" | 2 — Sketch |
| Visual punchline, metaphor, earned narrative moment | 3 — Illustration |
| Not sure | Start with Tier 1. Tier 3 requires Casey approval. |

B0b rule: flag a Tier 3 candidate with a comment placeholder in the MDX. Never generate the image.
Casey approves the brief and handles image generation externally.

---

## Tier 1 — Precision Diagrams (Mermaid)

B0b builds these. Dark palette required — default Mermaid colors are wrong for this site.

### Dark Palette

Copy these values into every Mermaid diagram:

    fill:#1a1917       Background
    stroke:#00c8a0     Borders and lines (teal accent)
    color:#e8e5de      Text
    stroke-width:1.5px Line weight

### Template: Sequence Diagram

    sequenceDiagram
      participant A as Agent
      participant B as Service
      A->>B: Request
      B-->>A: Response
      Note over A,B: Brief, specific labels. No jargon abbreviations.

### Template: State Machine

    stateDiagram-v2
      [*] --> Idle
      Idle --> Active: trigger
      Active --> Done: complete
      Done --> [*]

### Template: Flow Chart (left-right)

    flowchart LR
      A[Start] --> B{Decision}
      B -->|yes| C[Action]
      B -->|no| D[Alt]
      style A fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style B fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style C fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style D fill:#1a1917,stroke:#00c8a0,color:#e8e5de

### Template: Architecture (top-down)

    flowchart TD
      A[Layer One] --> B[Layer Two]
      B --> C[Layer Three]
      style A fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style B fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style C fill:#1a1917,stroke:#00c8a0,color:#e8e5de

### Template: Pipeline / Timeline (left-right)

    flowchart LR
      A([Input]) --> B[Step A] --> C[Step B] --> D([Output])
      style A fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style B fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style C fill:#1a1917,stroke:#00c8a0,color:#e8e5de
      style D fill:#1a1917,stroke:#00c8a0,color:#e8e5de

---

## Tier 2 — Sketch (Excalidraw SVG)

B0b builds simple ones via Excalidraw MCP. Casey builds complex or narrative ones.

### Export Settings

- Format: SVG
- Background: Transparent
- Theme: Dark
- Scale: 2x (retina)

### File Location and URL

Files go in `public/images/`. The MDX src prop uses `/images/` (Astro serves `public/` at root).

    Store at:  public/images/{article-slug}-{descriptor}.svg
    Use in MDX: src="/images/{article-slug}-{descriptor}.svg"

Example: file at `public/images/context-finite-resource-flow.svg`, MDX uses `/images/context-finite-resource-flow.svg`.

### Sizing

Target export width: 900px at 2x. The component scales to fit. Do not hard-code width in SVG attributes.

### MDX Usage

    <DiagramBlock type="sketch" src="/images/{slug}-{name}.svg" caption="Caption text" />

---

## Tier 3 — Narrative Illustration (AI-directed, Casey owns)

Casey writes the brief. Claude directs the prompt. Casey approves. External tool — not automated.

B0b does NOT generate illustrations. B0b does NOT call any image API. B0b flags where a Tier 3
could land with a comment placeholder in the MDX and moves on. Casey handles generation externally.

### B0b Placeholder Format

Add this comment in the MDX where a Tier 3 could land:

    {/* TIER 3 CANDIDATE
        Section: [section name]
        Brief: [1-2 sentences — what the image shows, why it earns this moment]
        Style: [photorealistic | painterly | dark/moody | technical sketch]
        Avoid: [specific failure modes for this image]
    */}

### Casey's Illustration Rules

- The image must earn the moment. Not decoration.
- Dark/moody is the default register. Match the site.
- Specific over generic: "a half-filled notepad, the last line unfinished, a cursor blinking" not "a person using a computer."
- Iterate until it's right. First output is a draft, not a ship.
- No AI slop: stock image energy, generic hands-on-keyboard, corporate-blue backgrounds.

### File Location and URL

Same convention as Tier 2. Prefer WebP for illustrations.

    Store at:  public/images/{article-slug}-{descriptor}.webp
    Use in MDX: src="/images/{article-slug}-{descriptor}.webp"

### MDX Usage

    <DiagramBlock
      type="illustration"
      src="/images/{slug}-{name}.webp"
      caption="Caption text"
      alt="Descriptive alt text — required for illustrations"
    />
