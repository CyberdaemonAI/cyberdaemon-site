# ISA: Content Draft from Engineering Event

_Intelligent Service Agreement for the cyberdaemon.ai content pipeline._
_Governs autonomous agent behavior when drafting articles from engineering events._

---

## Intent

Draft a cyberdaemon.ai article from an engineering event (bead close, PR merge, feature shipped, incident resolved, failure analyzed). The article must follow publishing standards and style guide, use the component system, and be ready for PR review.

## Outcome

A clean MDX file in the correct lane directory (`src/content/{research,analysis,build-logs}/`), with components imported and used, zero banned patterns, ready for PR on CyberdaemonAI/cyberdaemon-site.

## Input

The dispatching context must provide:
- **Event summary**: what happened, when, what shipped or broke
- **Lane**: research, analysis, or build-logs
- **Thesis**: the one sentence this article argues or demonstrates
- **Key claims**: 3-5 bullet points the article must support
- **Audience signal**: practitioner, researcher, or general builder

## Autonomy Boundary

### Always (do without asking)
- Read and follow `docs/PUBLISHING-STANDARDS.md`
- Read and follow `docs/STYLE-GUIDE.md`
- Import all 6 core components (Callout, StatRow, PullQuote, SectionLabel, ScrollReveal, DiagramBlock)
- Use at least 3 components per article
- Include at least 1 mermaid diagram in a DiagramBlock
- Run `docs/CONTENT-REVIEW-CHECKLIST.md` against the draft before submitting
- Include a "Counterarguments" or "Open Questions" section that challenges the main thesis
- Write in first person, builder voice, humble with humor

### Ask (escalate to Casey)
- If the event touches multiple lanes and lane assignment is ambiguous
- If a concept name is new (not previously published on cyberdaemon.ai)
- If the article would reference personal information
- If the event involves work context (employer, clients, engagements)
- If the counterargument is strong enough to undermine the thesis entirely

### Never (hard constraints)
- Use internal project names: daemon-*, vault-*, prom-memory (as service), Prometheus (as system name)
- Include infrastructure topology, node names, IPs, ports, file paths
- Reveal implementation details beyond the published concept
- Use em dashes (use commas, semicolons, colons)
- End titles or headings with periods
- Publish without PR review (always open a PR, never push to master directly)
- Skip the counterarguments section
- Use hedge words: perhaps, arguably, it could be said, one might argue

## Acceptance Criteria

**Given** an engineering event description with lane, thesis, and key claims:

**When** the agent drafts the article:

**Then:**
- [ ] MDX file exists in correct `src/content/{lane}/` directory
- [ ] Frontmatter complete: title, description, date, tags (lowercase kebab), featured
- [ ] All 6 components imported
- [ ] At least 3 components used in the body
- [ ] At least 1 DiagramBlock with mermaid content
- [ ] Counterarguments or Open Questions section present
- [ ] Zero hits on CI banned pattern list (daemon-*, vault-*, K3s, kubectl, Tailscale, Zulip, ArgoCD, Longhorn, Cilium, Keycloak, IPs)
- [ ] Zero em dashes
- [ ] Zero periods on titles/headings
- [ ] Voice check: opening paragraph reads like a builder talking to a friend

**Negative:**
- Article must NOT pass CI if any banned pattern exists
- Article must NOT be merged without Casey's approval

**Measure:**
- CI content-check workflow passes on the PR
- Casey approves within one review cycle (no more than 1 revision round)

## Execution Loop

1. **Read context**: Article Manifest — source, lane, thesis, key claims, structural spec, LVE enrichment blob
2. **Read standards**: `docs/PUBLISHING-STANDARDS.md` + `docs/STYLE-GUIDE.md` (voice fingerprints, components)
3. **Read exemplars**: both register exemplars before drafting (see Exemplar Articles above)
4. **Research**: search RAG for supporting material against `sources` in Manifest
5. **Draft**: write MDX with components, counterarguments, builder voice. Populate `image_specs`. Populate `threads_not_pulled`.
6. **Generate images**: for each `image_spec`, call OpenAI API with style prefix + spec. Write to `output_path`.
7. **Challenger pass**: run adversarial review against draft (see taco.yaml `challenger_posture`). Revise significant/fatal challenges. Flag escalations in PR description.
8. **Self-review**: run `docs/CONTENT-REVIEW-CHECKLIST.md` against final draft
9. **Submit**: open PR on CyberdaemonAI/cyberdaemon-site via GitHub App. Include Challenger summary in PR description.
10. **Revise if needed**: Casey comments on PR; revise and re-push

## Completion Gate

PR merged to master by Casey. Vercel deploy confirmed. Topics page updated if the article introduces a new topic group.

---

## B0b Dispatch Protocol (vault-notv)

This section defines the structured dispatch format for B0b article runs. Every article bead must have these fields before dispatch. Resolve all ambiguity in the bead — do not leave open questions for B0b to figure out mid-run.

### Article Bead Schema (required fields)

```
# --- Initiation ---
source: casey-initiated | pipeline-proposed | thread-continuation
parent_slug: null  # if thread-continuation, which article's thread this continues

# --- Content spec ---
title: [working title]
description: [1-2 sentence meta description — this becomes the article excerpt]
lane: [build-logs | analysis | research]
thesis: [the single claim the article makes, in one sentence]
key_claims: [3-5 bullet points — the argument structure, in order]
audience: [who this is for and what they already know]
sources: [specific RAG queries or URLs — "zero trust agentic AI" beats "AI security"]
word_target: [1200–2000 recommended]
components: [list of MDX components to use from docs/STYLE-GUIDE.md]
voice_notes: [anything specific for this piece — tone, register, angle]

# --- Structural synthesis (populated by Stage 3, not by dispatch) ---
structural_spec:
  method: morphological | adversarial | dna-transplant
  argument_type: causal | comparative | paradoxical | analogical | theorem | inversion
  structure_id: ""
  tprng_seed: ""
  notes: ""

# --- Image specs (one entry per image in the article) ---
image_specs:
  - intent: [what the image communicates, one sentence]
    style_notes: [composition, mood, specific elements]
    alt_text: [accessibility + SEO — written by B0b]
    aspect_ratio: "16:9"
    placement: [where in the MDX: after-intro / section-X / conclusion]
    output_path: /public/images/{slug}/{index}-{descriptor}.webp

# --- Stage flags (optional overrides) ---
skip_challenger: false   # set true to skip Challenger pass (Stage 7)
skip_image_gen: false    # set true if images are manual
skip_lve: false          # set true to use static casey-voice.yaml constraints only

# --- Post-publish harvest (populated after Stage 12, not by dispatch) ---
threads_not_pulled: []   # observations surfaced but not developed in the draft
```

### Blog Writing Persona (casey-blog)

`casey-blog` is the LVE voice enrichment persona for blog articles. Same infrastructure as the daemon characters in Prometheus. Writes in Casey's voice. As LVE evolves, casey-blog inherits automatically.

NOTE: Previously planned as "taco" — name collision discovered 2026-09-29. LVE service already has a `taco` persona (Taco MacArthur, The League, chat character). Renamed to `casey-blog`. No conflict.

LVE reference profiles:
- **casey-blog** (writing agent): `prometheus-lve/profiles/casey-blog.yaml`
- **Casey voice** (voice constraints): `prometheus-lve/profiles/casey-voice.yaml`

LVE enrichment (Stage 4) calls `http://lve.prometheus.svc.cluster.local:8800/enrich` with `persona: casey-blog`. The enrichment blob is injected into B0b's system prompt before drafting. The blob includes: vocabulary OWN/NEVER lists, register constraints, 6 voice fingerprints, two-reader architecture constraints, MDX output requirements.

Confirmed live 2026-09-29. POST /enrich with `persona: casey-blog` returns enriched_system_prompt.

Fallback when LVE is unavailable: inject casey-voice.yaml OWN/NEVER lists as static constraints directly.

**Minimum static posture** (used as fallback, also included in LVE enrichment):
> You are writing for cyberdaemon.ai in Casey's voice. Read docs/STYLE-GUIDE.md before writing a single word. The voice is Casey's: curious builder, sarcasm with payload, zero hedge words. You share what and why. You keep how close unless it matters to the argument. Apply the vocabulary NEVER list absolutely. Check the structural delta — if a pattern is in the delta, don't use it.

Voice accuracy depends on STYLE-GUIDE.md and casey-voice.yaml being current. Voice drift occurs when either is stale.

### Exemplar Articles (B0b reads before writing)

- **Build-log register**: `src/content/build-logs/agent-couldnt-read-its-own-name.mdx` — story first, past tense, failure narrative, generalizable lesson
- **Analysis register**: `src/content/analysis/strip-agent-voice-guitar.mdx` — claim first, counterarguments mandatory, present tense

B0b should read both exemplars before drafting. These are the voice reference, not templates.

### Branch and PR Naming

```
Branch: content/[slug]           ← REQUIRED. Not feat/, not jen/. content/ only.
Commit: content([bead-id]): [title]
PR title: [article title] (no period)
PR body: 2-sentence summary + "Closes [bead]"
```

**HARD CONSTRAINT: Branch MUST start with `content/`.** The publish-gate.yml fires ONLY on `content/*` and `jen/*` branches. A `feat/*` branch bypasses Rex review and Casey's approval gate entirely — the article will auto-merge without review. Wrong prefix = broken pipeline = unauthorized publish.

Never push to master directly. Always open a PR.

### Turn Budget

Target: under 8 turns. Read + draft + verify = 3 core turns. If B0b is spending turns on clarification, the article bead spec is incomplete.

### Do Not Ask During Dispatch

Resolve these before dispatch — not during:
- What components to use (per `vault-cb90e` rules + `components` field in spec)
- What the thesis is (it's in the `thesis` field)
- Whether to include counterarguments (always, minimum 3, steelmanned not strawmanned)
- What voice to use (casey-blog LVE persona, `docs/STYLE-GUIDE.md` is authoritative)
- What lane (it's in the `lane` field)

---

## Naming Conventions (quick reference)

| Internal Name | Public Name |
|--------------|-------------|
| daemon-guard | "the authorization gateway" or "runtime authorization layer" |
| daemon-mm | "the persona broker" |
| daemon-state | "the state service" or "affect state service" |
| prom-memory | "the memory layer" or "episodic memory system" (OK in titles when it's the topic) |
| Prometheus | "my AI system" or "the system I built" |
| B0b | "the agent fleet" or "autonomous agents" |
| beads/vault-* | "work items" or "tasks" |
| K3s/kubectl | "container orchestration" or "the cluster" |
| Tailscale | "overlay networking" or "mesh VPN" |
| Zulip | "the coordination channel" or "messaging platform" |
