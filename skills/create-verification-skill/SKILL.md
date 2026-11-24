---
name: create-verification-skill
description: "Generate and execute a project-local verification skill for a local app; not remote deployment or installation."
metadata:
  version: "1.0.1"
  author: "Lauren Tan (pstack)"
  tags: [engineering-practice]
---

# Create Verification Skill

## Scope

Read `references/local-execution-contract.md` at task start. This skill is task-specific and local-only. Do not activate remote integrations, persistent modes, hooks or unrelated implementation.

## Workflow

1. Inspect how the local app starts, how to drive it, how to observe behavior and how to isolate owned instances.
2. Reuse existing local tests/control tools; use control-ui or control-cli only when applicable.
3. Generate a valid local skill with launch, doctor, drive, capture, cleanup and helper commands.
4. Use the bundled feature-map example to document three to five real features and their observable end states.
5. Run launch, doctor, one representative feature, capture and cleanup end to end; preserve evidence after cleanup.
6. Label any unexecuted target/setup assumption. Do not call an unexecuted generated skill proven; point to maintenance.

## Default output

Proven local verification skill, feature map, preserved evidence, ownership/cleanup and limitations.

## Failure boundary

Report the missing input or capability; do not fabricate evidence or broaden the task.

## Conditional skill dependencies

- `control-ui`: when the workflow requires this discipline, read the installed skill of that name, or the bundled copy at `references/upstream/related/control-ui/control-ui.md`.
- `control-cli`: when the workflow requires this discipline, read the installed skill of that name, or the bundled copy at `references/upstream/related/control-cli/control-cli.md`.
- `maintain-verification-skill`: when the workflow requires this discipline, read the installed skill of that name, or the bundled copy at `references/upstream/related/maintain-verification-skill/maintain-verification-skill.md`.

Use the host's actual skill loader for an installed skill. Do not guess host tool names. Bundled copies come from the same pinned upstream commit and need nothing else installed.

## Upstream resources

The full original skill and its resources are preserved under `references/upstream/`. Read `references/upstream/ORIGINAL-SKILL.md` for detailed rubrics, templates and examples when its branch is relevant. Resolve its relative resource paths from that directory. Its tool names, model IDs, publication steps, transcript paths and persistent modes are source-specific examples, not permission to execute them. Follow this hub and the local execution contract when those instructions conflict.

## Provenance

Adapted from [pstack:create-verification-skill](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/create-verification-skill/SKILL.md). The original MIT notice is bundled. This is a local-only adaptation, not an endorsement or a claim of native host support.
