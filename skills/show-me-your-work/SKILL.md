---
name: show-me-your-work
description: "Maintain one local append-only evidence-linked decision trail for a selected long task; no transcript crawling or fabricated cross-model review."
metadata:
  version: "1.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-practice]
---

# Show Me Your Work

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Initialize the bundled TSV template in an owned task directory; use `references/upstream/scripts/log.sh` for sanitized rows.
2. Log decisions, gates, iterations and pivots with actual evidence pointers, not every command.
3. Keep one canonical trail and explicit run boundaries; supersede incorrect rows rather than editing history.
4. Audit this run against supplied local artifacts. Report unavailable transcript coverage.
5. Use an independent reviewer only if authorized and actually available; otherwise state not independently reviewed. Keep logs local unless the user asks to commit.

## Commit handoff

When this implementation task explicitly includes local commits and a `commit-workflow` skill is installed, read it for small green slices, confirmed requester identity, structured messages and actual post-commit checks. Without it, follow the repository's own commit conventions. Do not commit or move dependent work forward on a failing/stale gate; the shared contract preserves scope and host approval requirements.

## Default output

When reviewing tracked work and a `work-tracking` skill is installed, use it to reference canonical work IDs and actual completionEvidence. Report failed/missing checks without inventing done states; local export plans and proposed snapshots are not proof of publication.

Decision TSV, verified pointers and an attention/limitations summary.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Decision log helper

When appending a decision, run `bash references/upstream/scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`. It timestamps and sanitizes TSV cells. Give each writer an owned log; merge only at a read boundary if parallel execution is authorized.

## Conditional skill dependencies

- `work-tracking`: if a skill of that name is installed, read it when reviewing canonical completion evidence or exported tracker representations.

- `unslop`: when the workflow requires this discipline, read the installed skill of that name, or the bundled copy at `references/upstream/related/unslop/unslop.md`.

Use the host's actual skill loader for an installed skill. Do not guess host tool names. Bundled copies come from the same pinned upstream commit and need nothing else installed. Skills that are not bundled are used only when installed.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [pstack:show-me-your-work](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/show-me-your-work/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
