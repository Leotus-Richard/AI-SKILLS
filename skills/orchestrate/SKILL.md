---
name: orchestrate
description: "Coordinate bounded multi-repository or independent workstreams with explicit ownership, real dependencies, handoff contracts and result verification. Use for authorized fan-out or local coordination briefs; not automatic cloud sessions, PR publication, autonomous approvals or session deletion."
metadata:
  version: "1.0.0"
  author: "Leotus-Richard"
  tags: [workflow]
---

# Orchestrate

## Scope

Read `references/local-execution-contract.md` and `references/coordination.md` for the relevant pattern. Preserve the one coherent workstream per owned branch/worktree/session idea, but do not assume one session equals one published PR. Session tools, cloud options and autopilot approvals from any particular app are not portable permissions.

## Workflow

1. Read the requested scope, provided local repos and work in flight. Keep single-repo research/small changes inline. Use a local orchestration plan when the request benefits from multiple repos, real independent slices, a compatible stack or an isolated alternative.
2. Resolve materially missing repository/task boundaries before creating anything. Announce the proposed workstreams, exact ownership, inputs/outputs, verification and dependency shape. Do not discover remote projects under local-only scope.
3. Use a `work-tracking` skill, if installed, for canonical IDs/contracts/frontier, and the `graph-engineering` skill, if installed, for nontrivial fan-out/router/gate design. Cut false edges: repository boundaries, visual session grouping and list order are not execution dependencies.
4. Copy `assets/handoff.md` for each workstream. Quote the relevant user request, distinguish confirmed decisions from suggestions, list allowed/forbidden paths and actions, input/output tokens, acceptance checks, requester identity policy, budget, local failure handling and escalation.
5. Reuse actual existing work rather than duplicating it. Execute delegates only when the user and host actually authorize them and the necessary local capabilities are available. Otherwise return the local coordination briefs or execute explicitly requested work sequentially, labeling the missing independence. Never imitate session APIs or infer permission to spawn from a source example.
6. Map coordination labels to the existing canonical work states as defined in coordination.md; do not create another backlog/state database. Track actual artifacts and freshness. Idle/end-of-turn is not completion. Pending decisions remain blocked; never fabricate user approval or approve a consequential child plan by switching to autopilot.
7. Join only the outputs the next step consumes. Verify each actual result against the handoff and shared contracts; use a `commit-workflow` skill, if installed, for authorized small green commits and evidence identity checks. Coordinate overlapping writes through owned worktrees or explicit serialization.
8. Report completed artifacts, actual SHA/check evidence where available, current frontier and unresolved blockers. Leave sessions/worktrees/branches intact; cleanup, archival, pushes, PRs, merges and notifications require separate specific authority.

## Default output and failure boundary

Return local work graph updates, handoff briefs and evidence-linked coordination status. Bound retries/refinement under the shared contract, repair only failed work and refer permission and ownership decisions to the user. Never claim child creation, messages, publication or independent review that did not occur.

## Resources, dependencies and provenance

Read `references/coordination.md` for topology, preservation and overlap rules. Use `assets/handoff.md` for each bounded assignment. Optional companions, used only when installed, are `work-tracking`, `graph-engineering`, `commit-workflow` and `show-me-your-work`; read only the selected discipline, not all orchestration principles.

This hub was written for Engineering Toolkit v1.3 as a portable adaptation of an orchestration skill bundled with the GitHub Copilot app. That original is not redistributed here, and no native session adapter is asserted. The hub adds portable local scope, explicit contracts, approval boundaries and evidence-based joins. The repository owner contributed it under Apache-2.0; see `LICENSE.txt`.
