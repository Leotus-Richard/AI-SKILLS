---
name: retro
description: "Review a selected coding session for environment improvements using supplied local evidence; do not apply unrequested changes."
metadata:
  version: "1.0.0"
  author: "Matt Pocock"
  tags: [engineering-practice]
---

# Retro

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Read writing-for-agents, then the explicitly supplied session evidence or current-session artifacts.
2. Inspect the actual project lint/check/test commands before suggesting a replacement.
3. Identify navigation, missing guardrails, standards, oversized instructions, expensive tooling, and evidence-access gaps.
4. Prefer an executable guardrail for a mechanical mistake; reserve prose standards for judgment.
5. Rank proposed improvements by severity and evidence. Separate recommendations from authorized implementation.

## Default output

Evidence-linked improvement list with proposed enforcement, cost, and remaining evidence gaps.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Conditional skill dependencies

- `writing-for-agents`: when the workflow requires this discipline, read the installed skill of that name, or the bundled copy at `references/upstream/related/writing-for-agents/writing-for-agents.md`.
- `dry`: when the workflow requires this discipline, read the installed skill of that name, or the bundled copy at `references/upstream/related/dry/dry.md`.

Use the host's actual skill loader for an installed skill. Do not guess host tool names. Bundled copies come from the same pinned upstream commit and need nothing else installed.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [mattpocock:retro](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
