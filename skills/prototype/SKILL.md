---
name: prototype
description: "Create a disposable local logic or UI prototype to settle a named design question; not production implementation."
metadata:
  version: "1.0.1"
  author: "Matt Pocock"
  tags: [engineering-practice]
---

# Prototype

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Name the decision and choose the source LOGIC.md or UI.md branch.
2. Build a clearly marked local throwaway artifact with trivial startup and visible relevant state.
3. Avoid persistence unless it is the question; use owned scratch data only. Omit production polish that does not answer the decision.
4. Exercise the edge cases or variants, capture the observed result and ask the user for subjective choices when needed.
5. Keep the artifact local. Record the decision and a cleanup/promotion boundary; do not push a throwaway branch.

## Commit handoff

When this implementation task explicitly includes local commits and a `commit-workflow` skill is installed, read it for small green slices, confirmed requester identity, structured messages and actual post-commit checks. Without it, follow the repository's own commit conventions. Do not commit or move dependent work forward on a failing/stale gate; the shared contract preserves scope and host approval requirements.

## Default output

Runnable local prototype, named question, observed cases, chosen or pending decision, explicit non-production status.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [mattpocock:prototype](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/prototype/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
