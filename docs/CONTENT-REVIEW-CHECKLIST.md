# Content Review Checklist

Per-article checklist for reviewers (human or agent). Run this before any article commits to the cyberdaemon-site repo.

Fill in each checkbox. Every item must pass. One failure blocks the publish.

---

## Article Under Review

- **File**: `src/content/{lane}/{slug}.mdx`
- **Title**:
- **Reviewer**:
- **Date**:

---

## 1. Secrets and Infrastructure Exposure

- [ ] **No IP addresses** in body text, code blocks, diagrams, or alt text
- [ ] **No port numbers** referencing internal services
- [ ] **No tokens, passwords, or API keys** (including placeholder-looking strings that match real patterns)
- [ ] **No file paths** from the build environment (C:\, /data/, /home/, ~/.claude/, etc.)
- [ ] **No hostnames** (Tailscale MagicDNS, LAN hostnames, or FQDN)

**Grep targets:** `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`, `:\d{4,5}`, `C:\\`, `/data/`, `/home/`, `.ts.net`, `localhost`

---

## 2. Internal Service Names

- [ ] **No `daemon-*` references** (daemon-guard, daemon-mm, daemon-state, daemon-infra, etc.)
- [ ] **No `vault-*` bead IDs** (vault-abc1, vault-f16w, etc.)
- [ ] **No K3s/Kubernetes internal names** (kubectl, K3s, namespace names, pod names, node names)
- [ ] **No Tailscale references** (Tailscale, tailscale, MagicDNS, tailnet)
- [ ] **No internal tool names** (Zulip, ArgoCD, Longhorn, Cilium, Tetragon, LanceDB, tantivy, Mattermost, beads, bd.exe)
- [ ] **No prom-memory reference** (unless prom-memory IS the article topic)
- [ ] **No daemonprompt GitHub references** (unless linking a public CyberdaemonAI repo)

**Grep targets:** `daemon-`, `vault-`, `kubectl`, `K3s`, `k3s`, `Tailscale`, `tailscale`, `Zulip`, `ArgoCD`, `Longhorn`, `Cilium`, `Tetragon`, `LanceDB`, `tantivy`, `Mattermost`, `beads`, `bd\.exe`, `prom-memory` (check context), `daemonprompt`

---

## 3. Employer and Client References

- [ ] **No employer name** (current or past)
- [ ] **No client names** (current or past)
- [ ] **No engagement descriptions** specific enough to identify a client
- [ ] **No project names** from client work
- [ ] **No presales-specific details** (proposal content, RFP responses, vendor evaluations for specific clients)

---

## 4. Internal Tracking References

- [ ] **No bead IDs** (vault-* pattern)
- [ ] **No session numbers** (session-NNN pattern)
- [ ] **No internal node names** (Orin, Beelink, Thor, Kronos, Atlas, Hyperion, or any infrastructure hostname)

**Grep targets:** `vault-[a-z0-9]`, `session-\d`, `Orin`, `Beelink`, `Thor`, `Kronos`, `Atlas`, `Hyperion`

---

## 5. Content Level

- [ ] **Pattern, not implementation**: a reader learns the concept, the architecture, the reasoning. They do not learn how to replicate the exact deployment.
- [ ] **Diagrams use functional labels**: "Auth Service," "Intent Validator," "Agent Runtime," not real service names
- [ ] **Code blocks are illustrative**: show the pattern, not runnable deployment code with real endpoints
- [ ] **Metrics are generalized**: no exact counts that fingerprint a specific system instance

---

## 6. Voice and Tone

- [ ] **Opening hook works**: 1-2 sentences, drops the reader into the problem or thesis. No throat-clearing, no "in today's landscape" preamble.
- [ ] **Reads like a builder talking to a friend**: not a whitepaper, not a press release, not an infomercial
- [ ] **No hedge words**: no "perhaps," "arguably," "it could be said," "it should be noted"
- [ ] **No buzzwords**: no "robust," "utilize," "leverage" (as buzzword), "synergy," "next-generation," "cutting-edge"
- [ ] **Active voice throughout**: grep for "was" + past participle constructions; fix if passive dominates
- [ ] **Opinions are backed by reasoning**: no unsupported claims, no "everyone knows"

---

## 7. Formatting

- [ ] **Zero em dashes**: search for U+2014 and U+2013. Also search for ` -- ` (double hyphen used as em dash substitute). Zero tolerance.
- [ ] **No periods on titles or headings**: check every h1, h2, h3, SectionLabel text, and frontmatter title
- [ ] **Oxford comma used consistently**
- [ ] **Contractions are natural**: not forced, not avoided
- [ ] **No "as an AI language model"** or similar bot-voice phrases

---

## 8. Component Usage

- [ ] **At least 1 DiagramBlock** with caption
- [ ] **At least 1 Callout** (any variant)
- [ ] **At least 1 PullQuote** for the thesis or key argument
- [ ] **SectionLabel before every h2**
- [ ] **ScrollReveal wraps** stat rows, diagrams, and pull quotes
- [ ] **No ScrollReveal on consecutive paragraphs** (wraps visual elements only)
- [ ] **No stacked callouts** (body text between consecutive callouts)
- [ ] **No h1 in article body** (hero handles h1)

---

## 9. Frontmatter

- [ ] **title** present, sentence case, no period, under 80 characters
- [ ] **description** present, 1-2 sentences
- [ ] **date** present, YYYY-MM-DD format
- [ ] **tags** present, lowercase-kebab-case, 3-7 tags, use existing tags where possible
- [ ] **featured** explicitly set (true or false)
- [ ] **draft** set to true if not ready for production

---

## 10. Citations and Claims

- [ ] **All factual claims have footnotes** (except personal opinions stated as opinions)
- [ ] **CVE IDs verified** against NVD or source
- [ ] **Dates verified** against original sources
- [ ] **Named organizations and models verified** (correct names, correct context)
- [ ] **Specific numbers verified** (not carried forward from a compact summary without re-checking the source)

---

## 11. Diagram Review

- [ ] **Mermaid syntax is valid** (renders without errors)
- [ ] **Node labels use functional names** (no real service names, hostnames, or IPs)
- [ ] **Diagram has a caption** (DiagramBlock `caption` prop)
- [ ] **Diagram is readable at 720px** (not wider than article column)
- [ ] **Style matches dark palette** (fill:#1a1917, stroke in lane or accent colors, light text)

---

## Review Result

- [ ] **ALL CHECKS PASS**: article is clear to commit

If any check fails:

- **Failed check(s)**:
- **Specific passage(s)**:
- **Required fix**:
- **Reviewer notes**:

---

## Escalation

If any of the following are true, stop the review and escalate to Casey:

- Content names an employer, client, or engagement
- Content reveals exact DIRA/CB4A/prom-memory implementation beyond the published framework
- Content could be used for infrastructure reconnaissance
- Content contains personal information
- You are unsure whether something crosses the line between "pattern" and "implementation"

Escalation format: quote the passage, name the risk, explain the uncertainty, propose a redaction.
