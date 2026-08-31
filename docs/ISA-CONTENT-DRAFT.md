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

1. **Read context**: event description, lane, thesis, key claims
2. **Read standards**: `docs/PUBLISHING-STANDARDS.md` + `docs/STYLE-GUIDE.md`
3. **Research**: search RAG for supporting material if needed
4. **Draft**: write MDX with components, counterarguments, builder voice
5. **Self-review**: run `docs/CONTENT-REVIEW-CHECKLIST.md` against the draft
6. **Submit**: open PR on CyberdaemonAI/cyberdaemon-site via GitHub App
7. **Post to Zulip**: summary + key claims to #content-pipeline for Casey's review
8. **Revise if needed**: Casey comments on PR or reacts in Zulip; revise and re-push

## Completion Gate

PR merged to master by Casey. Vercel deploy confirmed. Topics page updated if the article introduces a new topic group.

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
