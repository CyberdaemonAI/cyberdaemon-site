#!/usr/bin/env python3
"""
For each ready bead: convert draft to MDX, create branch, open PR to cyberdaemon-site.
Reads draft files from prometheus-drafts/drafts/{bead_id}-*.md.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

gh_token = os.environ["GH_TOKEN"]
vault_path = Path(os.environ.get("VAULT_PATH", "vault"))
ready_beads = json.loads(os.environ["READY_BEADS"])

LANE_MAP = {
    "build-log": "build-logs",
    "build-logs": "build-logs",
    "analysis": "analysis",
    "research": "research",
}

KEEP_KEYS = {"title", "description", "excerpt", "date", "tags", "featured", "topic", "threads", "updates", "draft"}


def strip_vault_frontmatter(content):
    lines = content.split("\n")
    in_fm = False
    fm_lines = []
    body_start = 0
    for i, line in enumerate(lines):
        if i == 0 and line.strip() == "---":
            in_fm = True
            continue
        if in_fm and line.strip() == "---":
            body_start = i + 1
            in_fm = False
            break
        if in_fm:
            fm_lines.append(line)

    out_fm = []
    for line in fm_lines:
        key = line.split(":")[0].strip().lstrip("-").strip()
        if key in KEEP_KEYS:
            out_fm.append(line)

    body = "\n".join(lines[body_start:]).strip()
    return "---\n" + "\n".join(out_fm) + "\n---\n\n" + body


def get_field(content, field):
    match = re.search(rf'^{field}:\s*([^\n]+)', content, re.MULTILINE)
    if match:
        return match.group(1).strip().strip("\"'")
    return None


def run(cmd, **kwargs):
    return subprocess.run(cmd, capture_output=True, text=True, **kwargs)


for bead in ready_beads:
    bead_id = bead["bead_id"]
    draft_file = Path(bead["draft_file"])

    print(f"\n--- Processing {bead_id} ---")
    content = draft_file.read_text(encoding="utf-8")

    raw_lane = get_field(content, "lane") or "build-logs"
    lane = LANE_MAP.get(raw_lane, raw_lane)
    slug = get_field(content, "slug") or bead_id
    mdx_content = strip_vault_frontmatter(content)

    branch = f"jen/{bead_id}-auto"
    target_dir = Path(f"src/content/{lane}")
    target_file = target_dir / f"{slug}.mdx"

    # Reset to master before creating branch
    run(["git", "checkout", "master"])
    result = run(["git", "checkout", "-b", branch])
    if result.returncode != 0 and "already exists" not in result.stderr:
        print(f"FAIL: could not create branch {branch}: {result.stderr}")
        continue

    target_dir.mkdir(parents=True, exist_ok=True)
    target_file.write_text(mdx_content, encoding="utf-8")

    run(["git", "config", "user.email", "b0b@daemonprompt.app"])
    run(["git", "config", "user.name", "B0b"])
    run(["git", "add", str(target_file)])
    commit = run(["git", "commit", "-m", f"jen({bead_id}): auto-dispatch draft to {lane}/{slug}.mdx"])
    if commit.returncode != 0:
        print(f"FAIL commit: {commit.stderr}")
        run(["git", "checkout", "master"])
        continue

    push = run(["git", "push", "origin", branch])
    if push.returncode != 0:
        print(f"FAIL push: {push.stderr}")
        run(["git", "checkout", "master"])
        continue

    pr_body = f"""Auto-dispatched by jen-autodispatch workflow.

**Bead:** {bead_id}
**Lane:** {lane}
**Slug:** {slug}

Jen draft converted to MDX and placed in `src/content/{lane}/{slug}.mdx`.

Casey: review content, check CI, approve when ready.
"""
    env = {**os.environ, "GH_TOKEN": gh_token}
    pr = run(
        ["gh", "pr", "create",
         "--title", f"jen({bead_id}): {bead['title']}",
         "--body", pr_body,
         "--base", "master",
         "--head", branch],
        env=env,
    )

    if pr.returncode == 0:
        print(f"PR opened: {pr.stdout.strip()}")
    else:
        print(f"FAIL opening PR: {pr.stderr}")

    run(["git", "checkout", "master"])

print("\nDone.")
