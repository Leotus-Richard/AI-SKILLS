---
name: maintain-verification-skill
description: "Refresh an existing local verification skill and feature map against observed app behavior."
metadata:
  version: "1.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-practice]
---

# Maintain Verification Skill

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Find the selected verification skill; if absent, use the generator rather than inventing a target.
2. Inspect source feature surfaces and existing proof instructions.
3. Run one owned local launch/doctor/drive/capture/cleanup pass.
4. Make only evidence-backed corrections when authorized and preserve proof after cleanup.

## Commit handoff

When this implementation task explicitly includes local commits and a `commit-workflow` skill is installed, read it for small green slices, confirmed requester identity, structured messages and actual post-commit checks. Without it, follow the repository's own commit conventions. Do not commit or move dependent work forward on a failing/stale gate; the shared contract preserves scope and host approval requirements.

## Default output

Corrected local feature map, proof and unresolved drift.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Conditional skill dependencies

- `create-verification-skill`: when the workflow requires this discipline, read the installed skill of that name, or the bundled copy at `references/upstream/related/create-verification-skill/create-verification-skill.md`.

Use the host's actual skill loader for an installed skill. Do not guess host tool names. Bundled copies come from the same pinned upstream commit and need nothing else installed.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [pstack:maintain-verification-skill](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/maintain-verification-skill/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
