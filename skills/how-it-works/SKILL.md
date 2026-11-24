---
name: how-it-works
description: "Explain local subsystem behavior, ownership and runtime flow; use why for historical motivation."
metadata:
  version: "1.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-practice]
---

# How it works

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Identify the code target and choose narrow versus cross-cutting scope.
2. Read the explorer/explainer templates. For a complex target, partition two to four independent angles.
3. Explore local code sequentially or with authorized readonly workers; validate findings at the actual code anchors.
4. Synthesize Overview, Key Concepts, How It Works, Where Things Live and Gotchas, omitting irrelevant sections.

## Default output

Code-grounded subsystem explanation and any unverified runtime assumptions.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [pstack:how](https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/how). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
