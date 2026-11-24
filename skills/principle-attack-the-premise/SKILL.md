---
name: principle-attack-the-premise
description: "Apply when two or more fixes that share one premise have failed the same gate. Take a census of which actors hold the imbalance before the next fix, then question the premise instead of writing another fix that assumes it."
metadata:
  version: "1.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-principles]
---

# Principle Attack The Premise

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

## Conditional skill dependencies

- `principle-build-the-lever`: read the installed sibling skill only when its named discipline is required by the workflow.
- `principle-fix-root-causes`: read the installed sibling skill only when its named discipline is required by the workflow.
- `principle-laziness-protocol`: read the installed sibling skill only when its named discipline is required by the workflow.
- `principle-redesign-from-first-principles`: read the installed sibling skill only when its named discipline is required by the workflow.

Use the host's actual skill loader, or read `../<skill-name>/SKILL.md` from this installed directory. Do not guess host tool names. Install the dependency closure shown in manifest.json if these siblings are absent.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

Links in the original to other pstack skills open local copies in `references/upstream/related/`, taken from the same pinned commit. Use the installed skill of the same name if there is one; this skill works without it.

## Provenance

Adapted from [pstack:principle-attack-the-premise](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-attack-the-premise/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
