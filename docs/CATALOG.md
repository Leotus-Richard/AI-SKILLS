# Skill catalog

Generated from canonical `skills/<name>/SKILL.md` files and `registry/skills.json`. Run `npm run catalog` after source changes.

This repository contains **42 skills**. Each Perplexity upload archive contains one skill with `SKILL.md` at its root.

## design-and-formatting (2)

| Skill | Version | License | Description |
| --- | --- | --- | --- |
| [impeccable](../skills/impeccable/SKILL.md) | 1.0.0 | Apache-2.0 | Design, review or refine frontend interfaces using Impeccable's product-specific UX and visual craft playbooks. Use for UI hierarchy, accessibility, responsive states, typography, copy or design systems; not backend-only tasks or automatic browser overlays, hooks or publishing. |
| [latex](../skills/latex/SKILL.md) | 1.0.0 | Apache-2.0 | Format mathematical expressions for the chosen Markdown/chat renderer while preserving formula semantics. Use for inline/display math and literal LaTeX examples; not full TeX documents, package compilation or a guarantee of every host's rendering support. |

## engineering-practice (9)

| Skill | Version | License | Description |
| --- | --- | --- | --- |
| [create-verification-skill](../skills/create-verification-skill/SKILL.md) | 1.0.1 | MIT | Generate and execute a project-local verification skill for a local app; not remote deployment or installation. |
| [deslop](../skills/deslop/SKILL.md) | 1.0.0 | MIT | Review an authorized local change for unnecessary generated code and redundant guards without weakening trust boundaries. |
| [how-it-works](../skills/how-it-works/SKILL.md) | 1.0.0 | MIT | Explain local subsystem behavior, ownership and runtime flow; use why for historical motivation. |
| [interrogate](../skills/interrogate/SKILL.md) | 1.0.0 | MIT | Adversarially review a local design or diff with explicit criteria; independent model review is optional and must be real. |
| [maintain-verification-skill](../skills/maintain-verification-skill/SKILL.md) | 1.0.0 | MIT | Refresh an existing local verification skill and feature map against observed app behavior. |
| [negative-space-programming](../skills/negative-space-programming/SKILL.md) | 1.0.0 | Apache-2.0 | Use when code relies on optional values, loose data, state transitions, or implicit assumptions: enforce internal invariants with assertions that fail fast. Not for expected user or network errors. |
| [prototype](../skills/prototype/SKILL.md) | 1.0.1 | MIT | Create a disposable local logic or UI prototype to settle a named design question; not production implementation. |
| [retro](../skills/retro/SKILL.md) | 1.0.0 | MIT | Review a selected coding session for environment improvements using supplied local evidence; do not apply unrequested changes. |
| [show-me-your-work](../skills/show-me-your-work/SKILL.md) | 1.0.0 | MIT | Maintain one local append-only evidence-linked decision trail for a selected long task; no transcript crawling or fabricated cross-model review. |

## engineering-principles (24)

| Skill | Version | License | Description |
| --- | --- | --- | --- |
| [principle-attack-the-premise](../skills/principle-attack-the-premise/SKILL.md) | 2.0.0 | MIT | Apply when two or more fixes that share one premise have failed the same gate. Take a census of which actors hold the imbalance before the next fix, then question the premise instead of writing another fix that assumes it. |
| [principle-boundary-discipline](../skills/principle-boundary-discipline/SKILL.md) | 2.0.0 | MIT | Apply when wiring validation, error handling, or framework adapters. Concentrate guards at system boundaries (CLI, config, network, external APIs); trust internal types and keep business logic in pure functions. |
| [principle-build-the-lever](../skills/principle-build-the-lever/SKILL.md) | 2.0.0 | MIT | Apply to any non-trivial work, not just bulk work: edits, migrations, analyses, checks. Build the tool that does it or proves it (codemod, script, generator, or a skill your subagents follow) instead of working by hand. The tool is the artifact a reviewer can rerun. |
| [principle-encode-lessons-in-structure](../skills/principle-encode-lessons-in-structure/SKILL.md) | 2.0.0 | MIT | Apply when you catch yourself writing the same instruction a second time, or notice a recurring correction. Encode the rule as a lint, metadata flag, runtime check, or script instead of more text. |
| [principle-exhaust-the-design-space](../skills/principle-exhaust-the-design-space/SKILL.md) | 2.0.0 | MIT | Apply when facing a novel UI interaction or architectural decision with no precedent in the codebase. Build 2-3 competing prototypes and compare side by side before committing. |
| [principle-experience-first](../skills/principle-experience-first/SKILL.md) | 2.0.0 | MIT | Apply when product, UX, or feature-scope tradeoffs come up. Choose user delight over implementation convenience; ship fewer polished features over more rough ones. |
| [principle-explain-the-number](../skills/principle-explain-the-number/SKILL.md) | 2.0.0 | MIT | Apply before you trust, report, or act on a number you measured: a speedup, a regression, a throughput, a latency, or an eval result. Find what limits it, and rule out that it measured something other than the work you think. |
| [principle-fix-root-causes](../skills/principle-fix-root-causes/SKILL.md) | 2.0.0 | MIT | Apply when debugging. Trace each symptom to its root cause and fix it there; reproduce first, ask why until you reach it, resist nil-check guards that silence crashes. |
| [principle-foundational-thinking](../skills/principle-foundational-thinking/SKILL.md) | 2.0.0 | MIT | Apply before writing logic: choosing core types and data structures, sequencing scaffold-vs-feature work, asking what concurrent actors share. Get the data structures right so downstream code becomes obvious. |
| [principle-guard-the-context-window](../skills/principle-guard-the-context-window/SKILL.md) | 2.0.0 | MIT | Apply when context is filling up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents; keep summaries in the main thread, not raw payloads. |
| [principle-laziness-protocol](../skills/principle-laziness-protocol/SKILL.md) | 2.0.0 | MIT | Apply when refactoring, evaluating diff size, or tempted to add abstractions, layers, or signal threading. Bias toward deletion and the smallest change that solves the problem. |
| [principle-make-operations-idempotent](../skills/principle-make-operations-idempotent/SKILL.md) | 2.0.0 | MIT | Apply when designing commands, lifecycle steps, or processing loops that run amid crashes, restarts, and retries. Converge to the same end state regardless of partial prior runs. |
| [principle-migrate-callers-then-delete-legacy-apis](../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | 2.0.0 | MIT | Apply when introducing a new internal API while old callers still exist. Migrate callers and delete the old API in the same wave instead of preserving compatibility layers. |
| [principle-minimize-reader-load](../skills/principle-minimize-reader-load/SKILL.md) | 2.0.0 | MIT | Apply when reviewing or shaping code that's hard to trace. Count layers between question and answer, and hidden state in the reader's head; collapse one-caller wrappers and shrink mutable scope. |
| [principle-model-the-domain](../skills/principle-model-the-domain/SKILL.md) | 2.0.0 | MIT | Apply when writing stateful logic, or when code branches a lot or repeats a shape assumption across files. |
| [principle-never-block-on-the-human](../skills/principle-never-block-on-the-human/SKILL.md) | 2.0.0 | MIT | Apply when tempted to ask 'should I do X?' on reversible work. |
| [principle-outcome-oriented-execution](../skills/principle-outcome-oriented-execution/SKILL.md) | 2.0.0 | MIT | Apply during planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture; don't preserve smooth intermediate states with throwaway compatibility code. |
| [principle-prove-it-works](../skills/principle-prove-it-works/SKILL.md) | 2.0.0 | MIT | Apply after completing a task, before declaring done. Verify against the real artifact (run the feature, read the actual value, inspect the diff), not a proxy, self-report, or 'it compiles.' |
| [principle-redesign-from-first-principles](../skills/principle-redesign-from-first-principles/SKILL.md) | 2.0.0 | MIT | Apply when integrating a new requirement into an existing design. |
| [principle-separate-before-serializing-shared-state](../skills/principle-separate-before-serializing-shared-state/SKILL.md) | 2.0.0 | MIT | Apply when concurrent actors might write to the same file, branch, key, or state object. Eliminate the sharing first; serialize structurally only when one shared writer is a real invariant. |
| [principle-sequence-verifiable-units](../skills/principle-sequence-verifiable-units/SKILL.md) | 2.0.0 | MIT | Apply to multi-step work (sweeps, migrations, runs of similar edits) and to how you stack commits and PRs. Break work into small units that each end in a verifiable state, check each before the next, and order delivery so the sequence proves itself to a reviewer. |
| [principle-subtract-before-you-add](../skills/principle-subtract-before-you-add/SKILL.md) | 2.0.0 | MIT | Apply when sequencing an addition, refactor, or rewrite. Remove dead code, redundant validators, and stub references first, then build on the simpler base. |
| [principle-test-behavior-not-implementation](../skills/principle-test-behavior-not-implementation/SKILL.md) | 2.0.0 | MIT | Apply when you write, change, or keep a test. Call the code as its users do and assert the exact result they see. Rewrite or delete a test that would pass if every imported function returned undefined. |
| [principle-type-system-discipline](../skills/principle-type-system-discipline/SKILL.md) | 2.0.0 | MIT | Apply when designing types, reviewing a function signature, or writing code in any statically-typed language. Make illegal states unrepresentable, brand semantic primitives, parse external data at boundaries, refuse to lie to the compiler, exhaust variants, derive from authoritative schemas. |

## workflow (7)

| Skill | Version | License | Description |
| --- | --- | --- | --- |
| [agile-work-hierarchy](../skills/agile-work-hierarchy/SKILL.md) | 1.0.0 | Apache-2.0 | Use when planning, creating, reviewing, or reconciling Agile work as an Epic or Milestone → Feature → User Story → Task hierarchy, with independent Bugs and separate dependencies, in Linear, GitHub Issues, Azure DevOps, or Jira. |
| [domain-modeling](../skills/domain-modeling/SKILL.md) | 1.0.0 | MIT | Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR. To stress-test a plan through an interview, use grill-with-docs. |
| [enterprise-agent-architecture](../skills/enterprise-agent-architecture/SKILL.md) | 1.0.0 | Apache-2.0 | Use when designing, reviewing, or documenting governed enterprise AI agents (knowledge, diagnostic, or action agents and multi-agent systems): capability contracts, source authority tiers, hybrid retrieval, tool permissions and approval gates, risk-tiered governance, audit, and evaluation. Covers choosing among Microsoft Agent Framework, Google ADK, OpenAI Agents SDK, CrewAI, and LangGraph. |
| [graph-engineering](../skills/graph-engineering/SKILL.md) | 1.0.0 | Apache-2.0 | Use when designing, reviewing, or refactoring AI agent workflows into explicit execution graphs: branches, parallel workers, approvals, retries, stateful handoffs, or slow and flaky agent loops. Prefer a script for simple sequential work. |
| [grill-with-docs](../skills/grill-with-docs/SKILL.md) | 1.0.0 | MIT | Use when asked to grill a plan, stress-test a design, or clarify and document a domain model in one session: interview in dependency-aware rounds with recommendations, keeping a domain glossary and qualifying architecture decision records. For multi-session planning, use Wayfinder. |
| [orchestrate](../skills/orchestrate/SKILL.md) | 1.0.0 | Apache-2.0 | Coordinate bounded multi-repository or independent workstreams with explicit ownership, real dependencies, handoff contracts and result verification. Use for authorized fan-out or local coordination briefs; not automatic cloud sessions, PR publication, autonomous approvals or session deletion. |
| [wayfinder](../skills/wayfinder/SKILL.md) | 1.0.0 | MIT | Use when charting a route, resolving planning decisions, or resuming a Wayfinder map for a large, uncertain multi-session effort. Keeps decision tickets, a destination, fog, and a resume packet. One-session decisions: use grill-with-docs. |

## Tested with

Models used by the latest live evaluation (`skill-eval.yml`) of each skill's current version, from `registry/skills.json`.

- **agile-work-hierarchy** 1.0.0: not yet tested with a model
- **create-verification-skill** 1.0.1: not yet tested with a model
- **deslop** 1.0.0: not yet tested with a model
- **domain-modeling** 1.0.0: not yet tested with a model
- **enterprise-agent-architecture** 1.0.0: not yet tested with a model
- **graph-engineering** 1.0.0: not yet tested with a model
- **grill-with-docs** 1.0.0: not yet tested with a model
- **how-it-works** 1.0.0: not yet tested with a model
- **impeccable** 1.0.0: not yet tested with a model
- **interrogate** 1.0.0: not yet tested with a model
- **latex** 1.0.0: not yet tested with a model
- **maintain-verification-skill** 1.0.0: not yet tested with a model
- **negative-space-programming** 1.0.0: not yet tested with a model
- **orchestrate** 1.0.0: not yet tested with a model
- **principle-attack-the-premise** 2.0.0: not yet tested with a model
- **principle-boundary-discipline** 2.0.0: not yet tested with a model
- **principle-build-the-lever** 2.0.0: not yet tested with a model
- **principle-encode-lessons-in-structure** 2.0.0: not yet tested with a model
- **principle-exhaust-the-design-space** 2.0.0: not yet tested with a model
- **principle-experience-first** 2.0.0: not yet tested with a model
- **principle-explain-the-number** 2.0.0: not yet tested with a model
- **principle-fix-root-causes** 2.0.0: not yet tested with a model
- **principle-foundational-thinking** 2.0.0: not yet tested with a model
- **principle-guard-the-context-window** 2.0.0: not yet tested with a model
- **principle-laziness-protocol** 2.0.0: not yet tested with a model
- **principle-make-operations-idempotent** 2.0.0: not yet tested with a model
- **principle-migrate-callers-then-delete-legacy-apis** 2.0.0: not yet tested with a model
- **principle-minimize-reader-load** 2.0.0: not yet tested with a model
- **principle-model-the-domain** 2.0.0: not yet tested with a model
- **principle-never-block-on-the-human** 2.0.0: not yet tested with a model
- **principle-outcome-oriented-execution** 2.0.0: not yet tested with a model
- **principle-prove-it-works** 2.0.0: not yet tested with a model
- **principle-redesign-from-first-principles** 2.0.0: not yet tested with a model
- **principle-separate-before-serializing-shared-state** 2.0.0: not yet tested with a model
- **principle-sequence-verifiable-units** 2.0.0: not yet tested with a model
- **principle-subtract-before-you-add** 2.0.0: not yet tested with a model
- **principle-test-behavior-not-implementation** 2.0.0: not yet tested with a model
- **principle-type-system-discipline** 2.0.0: not yet tested with a model
- **prototype** 1.0.1: not yet tested with a model
- **retro** 1.0.0: not yet tested with a model
- **show-me-your-work** 1.0.0: not yet tested with a model
- **wayfinder** 1.0.0: not yet tested with a model

## Version history

Newest first. Each entry states the expected behavior of that version; see [versioning](VERSIONING.md).

### agile-work-hierarchy

- **1.0.0** (2026-11-24, initial): Plans, reviews, or reconciles Agile work as an Epic or Milestone → Feature → User Story → Task hierarchy with independent Bugs and separate dependency edges. Drafts by default and changes a tracker only with authorization; the bundled validator checks plan structure (exit 0 valid, 1 violations, 2 usage error).

### create-verification-skill

- **1.0.1** (2026-11-24, patch): Behavior unchanged. SOURCE.md now records the SHA-256 of each upstream file whose link targets were adjusted at import, so the bundled copy can be verified.
- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Generate and execute a project-local verification skill for a local app; not remote deployment or installation.

### deslop

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Review an authorized local change for unnecessary generated code and redundant guards without weakening trust boundaries.

### domain-modeling

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR. To stress-test a plan through an interview, use grill-with-docs.

### enterprise-agent-architecture

- **1.0.0** (2026-11-24, initial): Guides design and review of governed enterprise AI agents through the eight pillars, source authority tiers, hybrid retrieval and risk-tiered governance. Produces design documents or ranked reviews that separate proposed controls from implemented ones, and checks framework claims against current documentation.

### graph-engineering

- **1.0.0** (2026-11-24, initial): Turns agent workflows into explicit execution graphs (node contracts, routers, gates, bounded loops, checkpoints) or reviews existing ones, leading with ranked findings. Recommends a plain script when a graph is not needed and stays framework-neutral unless one is chosen.

### grill-with-docs

- **1.0.0** (2026-11-24, initial): Interviews the user in dependency-aware rounds with recommendations to settle a plan or design in one session, maintaining a domain glossary and qualifying ADRs. Points multi-session planning to Wayfinder and does not treat the interview as authorization to implement.

### how-it-works

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Explain local subsystem behavior, ownership and runtime flow; use why for historical motivation.

### impeccable

- **1.0.0** (2026-11-24, initial): Designs, reviews or refines frontend interfaces with Impeccable 4.0.3 playbooks, routed by the bundled command table. Uses local evidence and reference files only; never runs Impeccable's native detector, live mode or hooks, and reports those as capability gaps.

### interrogate

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Adversarially review a local design or diff with explicit criteria; independent model review is optional and must be real.

### latex

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Format mathematical expressions for the chosen Markdown/chat renderer while preserving formula semantics. Use for inline/display math and literal LaTeX examples; not full TeX documents, package compilation or a guarantee of every host's rendering support.

### maintain-verification-skill

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Refresh an existing local verification skill and feature map against observed app behavior.

### negative-space-programming

- **1.0.0** (2026-11-24, initial): Identifies the invariant a code path relies on and enforces it with a throwing assertion placed before mutation or side effects, with a message naming the value and the expected condition. Keeps expected user and network errors in normal error handling, and never substitutes a silent default for a violated invariant.

### orchestrate

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Coordinate bounded multi-repository or independent workstreams with explicit ownership, real dependencies, handoff contracts and result verification. Use for authorized fan-out or local coordination briefs; not automatic cloud sessions, PR publication, autonomous approvals or session deletion.

### principle-attack-the-premise

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. Related principles are named, not bundled, and are optional. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when two or more fixes that share one premise have failed the same gate. Take a census of which actors hold the imbalance before the next fix, then question the premise instead of writing another fix that assumes it.

### principle-boundary-discipline

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when wiring validation, error handling, or framework adapters. Concentrate guards at system boundaries (CLI, config, network, external APIs); trust internal types and keep business logic in pure functions.

### principle-build-the-lever

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. Related principles are named, not bundled, and are optional. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply to any non-trivial work, not just bulk work: edits, migrations, analyses, checks. Build the tool that does it or proves it (codemod, script, generator, or a skill your subagents follow) instead of working by hand. The tool is the artifact a reviewer can rerun.

### principle-encode-lessons-in-structure

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The body now opens with the rule from the description. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when you catch yourself writing the same instruction a second time, or notice a recurring correction. Encode the rule as a lint, metadata flag, runtime check, or script instead of more text.

### principle-exhaust-the-design-space

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The body now opens with the rule from the description. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when facing a novel UI interaction or architectural decision with no precedent in the codebase. Build 2-3 competing prototypes and compare side by side before committing.

### principle-experience-first

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when product, UX, or feature-scope tradeoffs come up. Choose user delight over implementation convenience; ship fewer polished features over more rough ones.

### principle-explain-the-number

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. Related principles are named, not bundled, and are optional. The benchmark checklist moves to references/benchmark-checklist.md. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply before you trust, report, or act on a number you measured: a speedup, a regression, a throughput, a latency, or an eval result. Find what limits it, and rule out that it measured something other than the work you think.

### principle-fix-root-causes

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when debugging. Trace each symptom to its root cause and fix it there; reproduce first, ask why until you reach it, resist nil-check guards that silence crashes.

### principle-foundational-thinking

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply before writing logic: choosing core types and data structures, sequencing scaffold-vs-feature work, asking what concurrent actors share. Get the data structures right so downstream code becomes obvious.

### principle-guard-the-context-window

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The body now opens with the rule from the description. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when context is filling up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents; keep summaries in the main thread, not raw payloads.

### principle-laziness-protocol

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The body now opens with the rule from the description. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when refactoring, evaluating diff size, or tempted to add abstractions, layers, or signal threading. Bias toward deletion and the smallest change that solves the problem.

### principle-make-operations-idempotent

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when designing commands, lifecycle steps, or processing loops that run amid crashes, restarts, and retries. Converge to the same end state regardless of partial prior runs.

### principle-migrate-callers-then-delete-legacy-apis

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when introducing a new internal API while old callers still exist. Migrate callers and delete the old API in the same wave instead of preserving compatibility layers.

### principle-minimize-reader-load

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. Related principles are named, not bundled, and are optional. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when reviewing or shaping code that's hard to trace. Count layers between question and answer, and hidden state in the reader's head; collapse one-caller wrappers and shrink mutable scope.

### principle-model-the-domain

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when writing stateful logic, or when code branches a lot or repeats a shape assumption across files.

### principle-never-block-on-the-human

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when tempted to ask 'should I do X?' on reversible work.

### principle-outcome-oriented-execution

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply during planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture; don't preserve smooth intermediate states with throwaway compatibility code.

### principle-prove-it-works

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply after completing a task, before declaring done. Verify against the real artifact (run the feature, read the actual value, inspect the diff), not a proxy, self-report, or 'it compiles.'

### principle-redesign-from-first-principles

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when integrating a new requirement into an existing design.

### principle-separate-before-serializing-shared-state

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when concurrent actors might write to the same file, branch, key, or state object. Eliminate the sharing first; serialize structurally only when one shared writer is a real invariant.

### principle-sequence-verifiable-units

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. Related principles are named, not bundled, and are optional. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply to multi-step work (sweeps, migrations, runs of similar edits) and to how you stack commits and PRs. Break work into small units that each end in a verifiable state, check each before the next, and order delivery so the sequence proves itself to a reviewer.

### principle-subtract-before-you-add

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when sequencing an addition, refactor, or rewrite. Remove dead code, redundant validators, and stub references first, then build on the simpler base.

### principle-test-behavior-not-implementation

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when you write, change, or keep a test. Call the code as its users do and assert the exact result they see. Rewrite or delete a test that would pass if every imported function returned undefined.

### principle-type-system-discipline

- **2.0.0** (2026-11-24, major): SKILL.md is now the principle itself, from upstream pstack. The toolkit hub, references/local-execution-contract.md and references/upstream/ are removed, so nothing else needs reading. Existing users: the contract's local-only limits no longer ship with this skill, so the host's and the user's own rules govern commits, pushes and other outward actions. Related principles are named, not bundled, and are optional. The trigger and description are unchanged.
- **1.0.0** (2026-11-24, initial): Applies one engineering principle to the current task only, not as a persistent mode. Trigger: Apply when designing types, reviewing a function signature, or writing code in any statically-typed language. Make illegal states unrepresentable, brand semantic primitives, parse external data at boundaries, refuse to lie to the compiler, exhaust variants, derive from authoritative schemas.

### prototype

- **1.0.1** (2026-11-24, patch): Behavior unchanged. SOURCE.md now records the SHA-256 of each upstream file whose link targets were adjusted at import, so the bundled copy can be verified.
- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Create a disposable local logic or UI prototype to settle a named design question; not production implementation.

### retro

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Review a selected coding session for environment improvements using supplied local evidence; do not apply unrequested changes.

### show-me-your-work

- **1.0.0** (2026-11-24, initial): Task-scoped and local-only. Maintain one local append-only evidence-linked decision trail for a selected long task; no transcript crawling or fabricated cross-model review.

### wayfinder

- **1.0.0** (2026-11-24, initial): Charts and maintains a multi-session decision map: destination, separate decision tickets, frontier, fog, and a resume packet. Plans only, never implements, and points decisions that fit one session to grill-with-docs.

## Provenance

- **agile-work-hierarchy**: original; <https://github.com/Leotus-Richard/AI-SKILLS/tree/881f8a1e46a3f8b64f22ac9d6d95824f137e26ea/skills/graph-engineering>, <https://docs.github.com/en/rest/issues/sub-issues>, <https://linear.app/docs/parent-and-sub-issues>, <https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/define-features-epics?view=azure-devops>, <https://support.atlassian.com/jira-cloud-administration/docs/configure-the-issue-type-hierarchy/>.
- **create-verification-skill**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/create-verification-skill/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/cursor-team-kit/skills/control-ui>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/cursor-team-kit/skills/control-cli>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/maintain-verification-skill>.
- **deslop**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/cursor-team-kit/skills/deslop/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/cursor-team-kit>.
- **domain-modeling**: adapted-upstream; <https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/SKILL.md>, <https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336>.
- **enterprise-agent-architecture**: user-supplied; user-supplied source with no independently verified URL.
- **graph-engineering**: user-supplied; user-supplied source with no independently verified URL.
- **grill-with-docs**: adapted-upstream; <https://github.com/mattpocock/skills>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/ADR-FORMAT.md>.
- **how-it-works**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/how/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **impeccable**: adapted-upstream; <https://github.com/pbakaus/impeccable/tree/68b1129634a1cdd9a0ba50b27376c71b4b083ae8/.github/skills/impeccable>, <https://impeccable.style>.
- **interrogate**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/interrogate/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **latex**: user-supplied; user-supplied source with no independently verified URL.
- **maintain-verification-skill**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/maintain-verification-skill/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/create-verification-skill>.
- **negative-space-programming**: original; user-supplied source with no independently verified URL.
- **orchestrate**: user-supplied; user-supplied source with no independently verified URL.
- **principle-attack-the-premise**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-attack-the-premise/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-boundary-discipline**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-boundary-discipline/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-build-the-lever**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-build-the-lever/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-encode-lessons-in-structure**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-encode-lessons-in-structure/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-exhaust-the-design-space**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-exhaust-the-design-space/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-experience-first**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-experience-first/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-explain-the-number**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-explain-the-number/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-fix-root-causes**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-fix-root-causes/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-foundational-thinking**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-foundational-thinking/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-guard-the-context-window**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-guard-the-context-window/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-laziness-protocol**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-laziness-protocol/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-make-operations-idempotent**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-make-operations-idempotent/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-migrate-callers-then-delete-legacy-apis**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-minimize-reader-load**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-minimize-reader-load/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-model-the-domain**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-model-the-domain/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-never-block-on-the-human**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-never-block-on-the-human/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-outcome-oriented-execution**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-outcome-oriented-execution/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-prove-it-works**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-prove-it-works/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-redesign-from-first-principles**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-redesign-from-first-principles/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-separate-before-serializing-shared-state**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-sequence-verifiable-units**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-sequence-verifiable-units/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-subtract-before-you-add**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-subtract-before-you-add/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-test-behavior-not-implementation**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-test-behavior-not-implementation/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **principle-type-system-discipline**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-type-system-discipline/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>.
- **prototype**: adapted-upstream; <https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/prototype/SKILL.md>, <https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336>.
- **retro**: adapted-upstream; <https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md>, <https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336>, <https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/correct>.
- **show-me-your-work**: adapted-upstream; <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/show-me-your-work/SKILL.md>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack>, <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/unslop>.
- **wayfinder**: adapted-upstream; <https://github.com/mattpocock/skills>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/research/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/ADR-FORMAT.md>.
