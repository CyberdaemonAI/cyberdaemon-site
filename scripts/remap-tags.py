#!/usr/bin/env python3
"""vault-qs0g4: Remap cyberdaemon-site article tags to 6 canonical tags.

Canonical set: autonomous-agents, ai-security, ai-systems, infrastructure, research, reflection
Max 2 tags per article.

Strategy: map each existing tag to a canonical, count frequency, pick top 2.
Ties broken by priority: autonomous-agents > ai-security > ai-systems > infrastructure > research > reflection
"""
import re, sys
from pathlib import Path
from collections import Counter

CANONICAL_PRIORITY = ["autonomous-agents","ai-security","ai-systems","infrastructure","research","reflection"]
CANONICAL_SET = set(CANONICAL_PRIORITY)

TAG_MAP = {
    "autonomous-agents":"autonomous-agents","agentic-ai":"autonomous-agents",
    "fleet-management":"autonomous-agents","agents":"autonomous-agents",
    "human-agent-collaboration":"autonomous-agents","agent-governance":"autonomous-agents",
    "human-in-the-loop":"autonomous-agents",
    "ai-security":"ai-security","security":"ai-security","authorization":"ai-security",
    "zero-trust":"ai-security","incident-response":"ai-security",
    "agent-security":"ai-security","oauth":"ai-security",
    "ai-architecture":"ai-systems","ai-memory":"ai-systems","ai-governance":"ai-systems",
    "cognitive-security":"ai-systems","episodic-memory":"ai-systems","memory":"ai-systems",
    "affective-computing":"ai-systems","padcn":"ai-systems","personas":"ai-systems",
    "sycophancy":"ai-systems","rlhf":"ai-systems","multi-agent":"ai-systems",
    "architecture":"ai-systems","compression":"ai-systems","mcp":"ai-systems",
    "model-context-protocol":"ai-systems","bdd":"ai-systems","constraints":"ai-systems",
    "posture":"ai-systems",
    "infrastructure":"infrastructure","ci-cd":"infrastructure","kubernetes":"infrastructure",
    "networking":"infrastructure","vector-search":"infrastructure","prom-memory":"infrastructure",
    "prometheus":"infrastructure","testing":"infrastructure","failure-analysis":"infrastructure",
    "research":"research","nist":"research","ai-rmf":"research","sp-800-207":"research",
    "dira":"research","nhi":"research","identity":"research","isa":"research",
    "structured-prompting":"research","methodology":"research","risk-management":"research",
    "compliance":"research","huggingface":"research","governance":"research",
    "reflection":"reflection",
}

def remap(old_tags):
    counts = Counter()
    for t in old_tags:
        c = TAG_MAP.get(t) or (t if t in CANONICAL_SET else None)
        if c:
            counts[c] += 1
        else:
            print(f"  WARN: unmapped tag '{t}'", file=sys.stderr)
    ranked = sorted(counts, key=lambda c: (-counts[c], CANONICAL_PRIORITY.index(c)))
    return ranked[:2]

TAG_LINE_RE = re.compile(r'^tags:\s*\[.*?\]\s*$', re.MULTILINE)
TAG_PARSE_RE = re.compile(r'"([^"]+)"')

def process(path, dry=False):
    text = path.read_text(encoding="utf-8")
    m = TAG_LINE_RE.search(text)
    if not m:
        return [], []
    old = TAG_PARSE_RE.findall(m.group())
    new = remap(old)
    if not new:
        print(f"  ERROR: {path.name} produced no canonical tags", file=sys.stderr)
        return old, old
    if not dry:
        new_line = "tags: [" + ", ".join(f'"{t}"' for t in new) + "]"
        path.write_text(text[:m.start()] + new_line + text[m.end():], encoding="utf-8")
    return old, new

def main():
    dry = "--dry-run" in sys.argv
    root = Path(__file__).parent.parent / "src" / "content"
    changed = 0
    for mdx in sorted(root.rglob("*.mdx")):
        old, new = process(mdx, dry)
        if old != new:
            print(f"  {'DRY' if dry else '→'}  {mdx.relative_to(root)}")
            print(f"       old: {old}")
            print(f"       new: {new}")
            changed += 1
    print(f"\n{'[DRY RUN] ' if dry else ''}Remapped {changed} files.")

if __name__ == "__main__":
    main()
