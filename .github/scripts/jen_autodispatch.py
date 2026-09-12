#!/usr/bin/env python3
"""Scan beads issues.jsonl for jen-queue beads with matching draft files.

Outputs: GITHUB_OUTPUT ready_count and ready_beads (JSON list).

stdout output intentional: this is a CI script, structured output goes to GITHUB_OUTPUT.
"""
import json
import os
import sys
from pathlib import Path

vault_path = Path(os.environ.get("VAULT_PATH", "vault"))
bead_filter = os.environ.get("BEAD_FILTER", "").strip()
issues_file = vault_path / ".beads" / "issues.jsonl"
drafts_dir = vault_path / "40 Prometheus" / "Drafts"

if not issues_file.exists():
    print(f"issues.jsonl not found at {issues_file} -- vault checkout may have failed")
    sys.exit(1)

ready: list[dict[str, str]] = []

with open(issues_file, encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            issue = json.loads(line)
        except json.JSONDecodeError as exc:
            print(f"WARN: malformed line in issues.jsonl: {exc}")
            continue

        if issue.get("status") != "open":
            continue

        labels: list[str] = issue.get("labels", [])
        if "jen-queue" not in labels:
            continue

        bead_id: str = issue.get("id", "")
        if not bead_id:
            continue

        if bead_filter and bead_id != bead_filter:
            continue

        # Find matching draft file (filename starts with bead_id)
        matches = list(drafts_dir.glob(f"{bead_id}-*.md")) + list(
            drafts_dir.glob(f"{bead_id}-*.mdx")
        )
        if not matches:
            print(f"SKIP {bead_id}: no draft file found in Drafts/")
            continue

        draft_file = matches[0]
        ready.append(
            {
                "bead_id": bead_id,
                "title": issue.get("title", ""),
                "draft_file": str(draft_file),
            }
        )
        print(f"READY {bead_id}: {draft_file.name}")

output_file = os.environ.get("GITHUB_OUTPUT", "/dev/stdout")
with open(output_file, "a", encoding="utf-8") as f:
    f.write(f"ready_count={len(ready)}\n")
    f.write(f"ready_beads={json.dumps(ready)}\n")

print(f"\nTotal ready: {len(ready)}")
