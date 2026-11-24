---
name: deslop
description: "Review an authorized local change for unnecessary generated code and redundant guards without weakening trust boundaries."
metadata:
  version: "1.0.0"
  author: "Cursor (Team Kit)"
  tags: [engineering-practice]
---

# Deslop

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Read the selected diff and the source style checklist.
2. Identify abnormal wrappers, speculative helpers, redundant trusted-internal guards and comments that restate code.
3. Preserve required boundary validation, security and user behavior.
4. Propose or apply only changes within the current scope and rerun the relevant local checks.

## Commit handoff

When this implementation task explicitly includes local commits and a `commit-workflow` skill is installed, read it for small green slices, confirmed requester identity, structured messages and actual post-commit checks. Without it, follow the repository's own commit conventions. Do not commit or move dependent work forward on a failing/stale gate; the shared contract preserves scope and host approval requirements.

## Default output

Smaller coherent diff or review findings with actual verification.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [cursor-team-kit:deslop](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/cursor-team-kit/skills/deslop/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
