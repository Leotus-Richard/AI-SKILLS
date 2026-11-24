---
name: interrogate
description: "Adversarially review a local design or diff with explicit criteria; independent model review is optional and must be real."
metadata:
  version: "1.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-practice]
---

# Interrogate

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Read the bundled rubric, code-quality review and reviewer prompts.
2. Anchor the target, assumptions, invariant and evidence.
3. Run isolated correctness, design and maintainability passes; do not present sequential self-review as multi-model review.
4. Aggregate contradictions and severity; verify high-impact findings at the code or test artifact.

## Default output

Evidence-linked risks and a review verdict with independence limitations.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [pstack:interrogate](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/interrogate/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
