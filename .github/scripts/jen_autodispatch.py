#!/usr/bin/env python3
"""
Scan prometheus-drafts for jen-queue beads with matching draft files.
prometheus-drafts repo structure:
  issues.jsonl     -- copy of .beads/issues.jsonl from vault
  drafts/          -- .md draft files named {bead_id}-*.md

Outputs GITHUB_OUTPUT: ready_count, ready_beads (JSON list).
"""
import json
import os
import sys
from pathlib import Path

vault_path = Path(os.environ.get("VAULT_PATH", "vault"))
bead_filter = os.environ.get("BEAD_FILTER", "").strip()
issues_file = vault_path / "issues.jsonl"
drafts_dir = vault_path / "drafts"

if not issues_file.exists():
    print(f"issues.jsonl not found at {issues_file} -- prometheus-drafts checkout may have failed or watcher not yet run")
    sys.exit(1)

if not drafts_dir.exists():
    print(f"drafts/ dir not found at {drafts_dir} -- no drafts pushed yet")
    drafts_dir.mkdir(parents=True, exist_ok=True)

ready = []
with open(issues_file) as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            issue = json.loads(line)
        except json.JSONDecodeError:
            continue
        if issue.get("status") != "open":
            continue
        labels = issue.get("labels", [])
        if "jen-queue" not in labels:
            continue
        bead_id = issue.get("id", "")
        if bead_filter and bead_id != bead_filter:
            continue
        matches = list(drafts_dir.glob(f"{bead_id}-*.md")) + list(drafts_dir.glob(f"{bead_id}-*.mdx"))
        if not matches:
            print(f"SKIP {bead_id}: no draft file in drafts/")
            continue
        draft_file = matches[0]
        ready.append({"bead_id": bead_id, "title": issue.get("title", ""), "draft_file": str(draft_file)})
        print(f"READY {bead_id}: {draft_file.name}")

output_file = os.environ.get("GITHUB_OUTPUT", "/dev/stdout")
with open(output_file, "a") as f:
    f.write(f"ready_count={len(ready)}\n")
    f.write(f"ready_beads={json.dumps(ready)}\n")

print(f"\nTotal ready: {len(ready)}")
