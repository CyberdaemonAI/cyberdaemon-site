#!/usr/bin/env python3
"""Convert vault drafts to MDX and open PRs in cyberdaemon-site.

For each ready bead: strip vault frontmatter, wrap as MDX, create branch, open PR.

stdout output intentional: CI script, progress logged to stdout.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

gh_token = os.environ["GH_TOKEN"]
vault_path = Path(os.environ.get("VAULT_PATH", "vault"))
ready_beads: list[dict[str, str]] = json.loads(os.environ["READY_BEADS"])

LANE_MAP: dict[str, str] = {
    "build-log": "build-logs",
    "build-logs": "build-logs",
    "analysis": "analysis",
    "research": "research",
}

# Astro articleSchema fields to keep from vault frontmatter
KEEP_KEYS: frozenset[str] = frozenset(
    {"title", "description", "excerpt", "date", "tags", "featured", "topic", "threads", "updates", "draft"}
)


def strip_vault_frontmatter(content: str) -> str:
    """Remove vault-specific fields, keep Astro-compatible ones."""
    lines = content.split("\n")
    in_fm = False
    fm_lines: list[str] = []
    body_lines: list[str] = []

    for i, line in enumerate(lines):
        if i == 0 and line == "---":
            in_fm = True
            continue
        if in_fm and line == "---":
            in_fm = False
            body_lines = lines[i + 1 :]
            break
        if in_fm:
            fm_lines.append(line)

    out_fm: list[str] = []
    for line in fm_lines:
        key = line.split(":")[0].strip().lstrip("-").strip()
        if key in KEEP_KEYS:
            out_fm.append(line)

    frontmatter = "---\n" + "\n".join(out_fm) + "\n---"
    body = "\n".join(body_lines).strip()
    return frontmatter + "\n\n" + body


def get_lane(content: str) -> str:
    """Extract lane from vault frontmatter, fall back to build-logs."""
    match = re.search(r"^lane:\s*([^\n]+)", content, re.MULTILINE)
    if match:
        raw = match.group(1).strip().strip("\"'")
        return LANE_MAP.get(raw, raw)
    return "build-logs"


def get_slug(content: str, bead_id: str) -> str:
    """Extract slug from vault frontmatter, fall back to bead_id."""
    match = re.search(r"^slug:\s*([^\n]+)", content, re.MULTILINE)
    if match:
        return match.group(1).strip().strip("\"'")
    return bead_id


def run(cmd: list[str], **kwargs: object) -> subprocess.CompletedProcess[str]:
    """Run a subprocess command, return result."""
    return subprocess.run(cmd, capture_output=True, text=True, **kwargs)  # type: ignore[call-overload]


failures: list[str] = []

for bead in ready_beads:
    bead_id = bead["bead_id"]
    draft_file = Path(bead["draft_file"])

    print(f"\n--- Processing {bead_id} ---")

    if not draft_file.exists():
        print(f"FAIL {bead_id}: draft file not found: {draft_file}")
        failures.append(bead_id)
        continue

    content = draft_file.read_text(encoding="utf-8")
    lane = get_lane(content)
    slug = get_slug(content, bead_id)
    mdx_content = strip_vault_frontmatter(content)

    branch = f"jen/{bead_id}-auto"
    target_dir = Path(f"src/content/{lane}")
    target_file = target_dir / f"{slug}.mdx"

    # Create branch from master
    result = run(["git", "checkout", "-b", branch])
    if result.returncode != 0 and "already exists" not in result.stderr:
        print(f"FAIL {bead_id}: could not create branch {branch}: {result.stderr}")
        run(["git", "checkout", "master"])
        failures.append(bead_id)
        continue

    target_dir.mkdir(parents=True, exist_ok=True)
    target_file.write_text(mdx_content, encoding="utf-8")

    run(["git", "config", "user.email", "b0b@daemonprompt.app"])
    run(["git", "config", "user.name", "B0b"])
    run(["git", "add", str(target_file)])
    commit_result = run(
        ["git", "commit", "-m", f"jen({bead_id}): auto-dispatch draft to {lane}/{slug}.mdx"]
    )
    if commit_result.returncode != 0:
        print(f"FAIL {bead_id}: git commit failed: {commit_result.stderr}")
        run(["git", "checkout", "master"])
        failures.append(bead_id)
        continue

    push_result = run(["git", "push", "origin", branch])
    if push_result.returncode != 0:
        print(f"FAIL {bead_id}: git push failed: {push_result.stderr}")
        run(["git", "checkout", "master"])
        failures.append(bead_id)
        continue

    pr_body = f"""Auto-dispatched by jen-autodispatch workflow.

Bead: {bead_id}
Lane: {lane}
Slug: {slug}

Jen draft converted to MDX and placed in src/content/{lane}/{slug}.mdx.

Casey: review content, run content-check CI, approve when ready.
"""
    env_with_token = {**os.environ, "GH_TOKEN": gh_token}
    pr_result = run(
        [
            "gh",
            "pr",
            "create",
            "--title",
            f"jen({bead_id}): {bead['title']}",
            "--body",
            pr_body,
            "--base",
            "master",
            "--head",
            branch,
        ],
        env=env_with_token,
    )

    if pr_result.returncode == 0:
        print(f"PR opened: {pr_result.stdout.strip()}")
    else:
        print(f"FAIL {bead_id}: opening PR failed: {pr_result.stderr}")
        failures.append(bead_id)

    run(["git", "checkout", "master"])

if failures:
    print(f"\nFailed beads: {failures}")
    sys.exit(1)

print("\nAll beads dispatched successfully.")
