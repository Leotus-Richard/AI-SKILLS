---
name: domain-modeling
description: "Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR. To stress-test a plan through an interview, use grill-with-docs."
metadata:
  version: "1.0.0"
  author: "Matt Pocock"
  tags: [workflow]
---

# Domain Modeling

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Locate the glossary/context map and relevant ADRs. Use the bundled glossary and ADR formats.
2. Resolve overloaded terminology with concrete scenarios. Separate domain meaning from implementation details.
3. Check the local code against stated domain rules and surface contradictions rather than silently choosing.
4. Capture resolved terms immediately when editing is authorized. Propose unresolved changes rather than inventing agreement.
5. Write an ADR only for a hard-to-reverse, surprising decision with real alternatives.

## Default output

Resolved glossary terms, invariants, contradictions, and warranted ADRs.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [mattpocock:domain-modeling](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
