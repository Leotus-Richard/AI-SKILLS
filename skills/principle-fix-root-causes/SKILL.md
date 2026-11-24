---
name: principle-fix-root-causes
description: "Apply when debugging. Trace each symptom to its root cause and fix it there; reproduce first, ask why until you reach it, resist nil-check guards that silence crashes."
metadata:
  version: "1.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-principles]
---

# Principle Fix Root Causes

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Read the preserved source leaf for the exact trigger, rule and examples.
2. Apply only to the current relevant decision, using the local execution contract as the scope authority.
3. Preserve its invariant rather than mechanically applying examples to unrelated systems.
4. Report the concrete decision or check this principle changed.

## Default output

A justified local design/action/check; no unrelated workflow activation.

## Failure boundary

If evidence or scope is insufficient, report the gap rather than treating a principle as proof.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

Links in the original to other pstack skills open local copies in `references/upstream/related/`, taken from the same pinned commit. Use the installed skill of the same name if there is one; this skill works without it.

## Provenance

Adapted from [pstack:principle-fix-root-causes](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-fix-root-causes/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
