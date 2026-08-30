# cyberdaemon.ai Publishing Standards

These are enforced rules. Not guidelines. Not suggestions. Every article, page, and piece of content published to cyberdaemon.ai passes through these standards or it does not ship.

This document is the source of truth. If it conflicts with a napkin note, a session log, or something someone remembers, this document wins.

---

## Content Classification

Three categories. No gray area. If you are unsure, escalate.

### SHARE

These are safe to publish. This is the entire point of the site.

- Concepts and mental models
- Architecture patterns (generalized, not wired to specific infrastructure)
- Design decisions and the reasoning behind them
- Results and metrics (generalized, anonymized, no exact counts that fingerprint the system)
- Lessons learned from building, breaking, and fixing
- Frameworks: DIRA, CB4A, PADCN, Middle-Out Compression, ISA patterns
- The "what" and the "why"
- Opinions backed by reasoning
- Industry analysis, incident breakdowns, standards interpretation

### DO NOT SHARE

These never appear in published content. Not in articles, not in code blocks, not in diagrams, not in alt text.

- Configuration files (YAML, TOML, JSON, .env, anything with real values)
- API schemas, endpoint paths, request/response shapes from internal services
- Rule sets, regex patterns, detection logic
- Deployment YAML, Helm charts, Kubernetes manifests
- Database schemas, table structures, migration files
- Exact wiring between services (which service calls which endpoint on which port)
- Infrastructure topology: node names, IPs, ports, service URLs, hostnames
- Internal tool names by their real names (see Naming Rules below)
- File paths from the build environment
- Bead IDs (vault-*), session numbers, internal tracking references
- Tailscale hostnames or IPs
- Kubernetes namespace names, pod names, node names
- Git repo names from the private daemonprompt account (unless the repo is public under CyberdaemonAI)

### ESCALATE TO CASEY

Stop. Do not publish. Flag the specific passage and explain what it reveals.

- Anything that names an employer, client, or engagement (past or present)
- Anything that reveals the exact implementation of DIRA, CB4A, or prom-memory beyond the published framework (the framework is public; the wiring is not)
- Any content that could be used for reconnaissance against the infrastructure (service discovery, network topology, authentication flows with real endpoints)
- Any personal information (health, finances, relationships)
- Any content where you are unsure whether it crosses the line between "pattern" and "implementation"
- Content that references specific vendor engagements or presales work
- Content that could identify Casey's employer through context clues

---

## Naming Rules

Internal services and tools are referenced by their function, not their name. The reader learns the pattern. They do not learn the attack surface.

| Internal Name | Public Reference |
|---|---|
| daemon-guard, daemon-mm, daemon-state | "the agent framework" or "the orchestration layer" |
| prom-memory | "the memory layer" or "episodic memory" (unless prom-memory IS the article topic, e.g., the prom-memory build log) |
| beads, bd.exe | "the work tracking system" or "the issue tracker" |
| Zulip, Mattermost | "a message board" or "the team chat" |
| Prometheus (the platform) | "the system I built" or "my system" (unless on the About page or where naming the project is the point) |
| K3s, kubectl | "the cluster" or "the container orchestration layer" |
| Tailscale | "the overlay network" or "the mesh VPN" |
| ArgoCD | "the GitOps deployment system" |
| Longhorn | "the distributed storage layer" |
| Cilium, Tetragon | "the network policy engine" or "the runtime security layer" |
| LanceDB, tantivy | "the search index" or "the vector store" |
| Orin, Beelink, Thor, Kronos, Atlas | never referenced by name; use "a GPU node," "an edge device," "the inference server" |

### Absolute prohibitions

- No bead IDs (vault-*) ever. Not in text, not in diagrams, not in footnotes.
- No session numbers (session-NNN) ever.
- No K3s pod names, namespace names, or node names ever.
- No Tailscale IPs, MagicDNS hostnames, or LAN IPs ever.
- No file paths from the build environment (C:\, /data/, /home/, ~/.claude/).
- No references to daemonprompt GitHub account (unless linking a public CyberdaemonAI repo).

---

## Voice

The voice is a curious builder in a basement having fun learning. Not a professor. Not a consultant. Not a vendor. A person who builds things, breaks them, learns from it, and writes about it because the patterns are interesting.

### Core principles

- Lead with curiosity and play, not authority
- Sarcastic, funny, self-aware. Push humor. Not offensive, not punching down.
- Strong opinions backed by reasoning. Say what you think. Say why.
- "Here's the pattern I found" not "here's my exact code"
- Short declarative sentences. No hedge words.
- Active voice. Strong verbs. Kill passive constructions.
- If a sentence works without an adverb, cut the adverb.

### Reference voices

- **Daniel Miessler**: practitioner voice. Writes like someone who does the work, not someone who reads about it. Direct, opinionated, grounded in practice.
- **James Cameron**: "build the impossible" energy. Aspiration reference, not tone reference. The ambition to build real things, not just write about them.

### Banned words and constructions

| Banned | Use instead |
|---|---|
| perhaps, arguably, it could be said | say it or don't |
| robust, utilize, leverage (as buzzword), synergy | use plain language |
| next-generation, cutting-edge, industry-leading | describe what it actually does |
| as an AI language model | never |
| em dashes (any form) | commas, semicolons, colons, or restructure the sentence |
| in order to | "to" |
| it should be noted that | just say it |
| at the end of the day | cut it |

### Formatting rules

- No em dashes. Zero tolerance. Use commas, semicolons, colons, or break into two sentences.
- No periods at the end of titles or headings. Ever.
- Contractions are fine. "Doesn't" not "does not" (unless emphasis requires the long form).
- Numbers under 10 spelled out in body text. Numbers in stats, metrics, and technical contexts stay as digits.
- Oxford comma: yes, always.
- One space after periods.

---

## Pre-Publish Checklist

This checklist is enforced. Every article passes every check before it commits to the repo. No exceptions. No "I'll fix it later." Fix it now or don't ship.

1. **No hard secrets**: grep the article for IP addresses, port numbers, tokens, passwords, API keys, file paths, and hostnames. Zero matches required.
2. **No internal service names**: grep for `daemon-`, `vault-`, `K3s`, `kubectl`, `Tailscale`, `Zulip`, `ArgoCD`, `Longhorn`, `Cilium`, `Tetragon`, `LanceDB`, `tantivy`, `Mattermost`, `beads`, `bd.exe`, `prom-memory` (unless prom-memory is the article topic). Zero matches except where explicitly approved as the article subject.
3. **No employer or client references**: no company names, no engagement descriptions, no project names that could identify a client. Not even oblique references ("a large healthcare company" is fine; "a hospital system in the northeast" narrows it too much).
4. **No bead IDs or session numbers**: grep for `vault-` and `session-`. Zero matches.
5. **Concept-level only**: read the article and ask: "Would a reader learn the pattern or the implementation?" If the answer is "implementation," redact to pattern level.
6. **Voice check**: read the opening paragraph aloud. Does it sound like a builder talking to a friend? If it sounds like a whitepaper, a press release, or an infomercial, rewrite.
7. **Em dash check**: search for all em dash characters (U+2014, U+2013, and the double-hyphen substitute). Zero tolerance.
8. **Title check**: confirm no heading or title ends with a period.
9. **Tag check**: confirm all tags use lowercase-kebab-case and match existing conventions.
10. **Frontmatter check**: confirm all required fields present (title, description, date, tags, featured).

---

## Escalation Protocol

When in doubt, do not publish. Flag for Casey with:

- **The specific passage**: quote it exactly.
- **What it reveals**: name the risk. "This sentence reveals that the cluster runs K3s on ARM64 nodes" is useful. "This might be sensitive" is not.
- **Why you are unsure**: explain what makes this a borderline case.
- **Suggested redaction**: propose an alternative that preserves the insight without the exposure.

The default answer is "don't publish." The cost of a delayed article is zero. The cost of exposing infrastructure details is nonzero.

---

## Content Lanes

Three lanes. Every article belongs to exactly one.

| Lane | Slug | Color | What goes here |
|---|---|---|---|
| Research | `research` | `#00c8a0` (teal) | Original frameworks, new ideas, formal analysis. DIRA, PADCN, NHI governance, Middle-Out Compression. |
| Analysis | `analysis` | `#c9a84c` (gold) | Incident breakdowns, standards interpretation, industry commentary, threat analysis. |
| Build Logs | `build-logs` | `#9b8ecf` (purple) | What I built, how it works, what broke, what I learned. Implementation stories at the pattern level. |

---

## Authorship

Casey Gager is the named author on all cyberdaemon.ai content. No anonymity required. No pseudonyms.

Employment disclaimer applies to all public content: views expressed are Casey's own and do not represent his employer.

---

## Original Research

DIRA (Dual-Intent Runtime Authorization), PII Semantic Envelope, Behavioral Drift Detection, CB4A, PADCN, Middle-Out Compression, and ISA patterns are Casey's personal intellectual property, developed on personal time and equipment. They are published freely on cyberdaemon.ai. They are not products, not commercials, and not employer IP.

DIRA and other frameworks appear in articles where contextually appropriate. They are never the conclusion to an unrelated section. They are never positioned as products for sale.
