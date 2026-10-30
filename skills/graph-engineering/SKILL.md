---
name: graph-engineering
description: Design, review, or refactor AI agent workflows into explicit execution graphs. Use when orchestration has meaningful branches, parallel workers, approvals, retries, or stateful handoffs, including slow or flaky agent loops; prefer a script for simple sequential work.
---

# Graph Engineering for AI Agent Systems

Make execution logic explicit instead of hiding it inside an opaque agent loop. The graph constrains the next permitted action; models contribute judgment inside bounded nodes.

**Use code for control flow and invariants; use models for ambiguous interpretation, synthesis, and generation.**

## Choose the scope

- For a new workflow or substantial redesign, read [references/design.md](references/design.md).
- For an existing loop, prompt chain, or orchestration implementation, read [references/review.md](references/review.md). Read the design reference only for the parts being redesigned.
- For incident response or operational remediation, also read [references/incident-example.md](references/incident-example.md).

Start with the user's actual goal and existing implementation. A process does not need a graph merely because it has several steps. If a plain function or script suffices, say so and use it. Do not introduce agents, frameworks, persistent services, or a new product scope without a concrete need.

Stay framework-neutral unless the user or repository has selected a framework. Then map the design onto its actual primitives; do not assume that orchestration, checkpointing, or retries imply exactly-once side effects.

## Vocabulary

| Term | Contract |
| --- | --- |
| Node | One bounded job, with explicit inputs, structured output, and defined failure states; implemented by code, a model, a tool, or a human. |
| Edge | A real data or authority dependency specifying exactly what may cross. |
| State | Durable execution data that survives transitions and interruption, rather than prose held only in chat. |
| Router | An inspectable rule choosing the next permitted path. |
| Gate | Validation that blocks invalid, insufficiently supported, or unauthorized work. |

**The edge test:** Does the next step actually need the previous step's output or authority? If not, remove that dependency. Run independent work concurrently when shared resources, ordering requirements, and mutation conflicts permit it; name the join that needs the results.

## Essential rules

1. Give each node one job and typed input/output contracts. Specify validation and failure handling at important transitions.
2. Pass only the evidence and authority each consumer needs. Prefer scoped artifact references over entire chat histories; keep secrets out of shared state and telemetry.
3. Make routing criteria inspectable. Validate model-produced classifications before code uses them to select a path. A model's claimed confidence is not authorization.
4. Bound every cycle with a convergence test, attempt cap, deadline, budget, and explicit exhaustion route. Preserve consumed limits across resume.
5. Handle failures locally. Retry the affected node, degrade with visible missing evidence, compensate when appropriate, or escalate. Avoid restarting successful branches.
6. Checkpoint enough state to resume with the same workflow ID. Use stable operation keys for retried side effects, and reconcile an unknown outcome before repeating a mutation.
7. Honor existing user authorization. A gate checks the exact operation, target, and relevant input revision; ask for human approval only when required authority is missing or the action has changed. A graph diagram does not grant execution permission.
8. Prepare a concrete, reviewable proposal before an approval interrupt. Checkpoint before and after the decision; invalidate stale decisions when the approved action changes.
9. Verify consequential proposals independently of the drafting context, using deterministic checks or a separate reviewer as appropriate. Do not add a second agent for trivial transformations.
10. Record node and queue duration, tool failures, router decisions, retries, budget consumption, and outcome quality without logging sensitive payloads.

## Deliver the appropriate artifact

For a complete new graph, use the design reference's eight-part output: diagram, node contracts, state schema, routers/gates, loop limits, checkpoints/interrupts, observability, and build order. Scale detail to the request.

For a review, lead with findings ranked by impact: the concrete failure, supporting code or execution evidence, and the smallest useful fix. Use before/after graph fragments when they clarify a change. If the existing design is sound, say so and focus on the few changes that matter.

Explain why each dependency, gate, and loop bound exists. Distinguish implemented behavior, design proposals, and measured results.

## Provenance

Adapted from the user's graph-engineering runbook, which attributes its guidance to “Graph Engineering: How to Build AI Agent Systems That Don't Break at Scale” (whrrari.substack.com) and related material. Treat this as user-supplied attribution, not independent verification of the publication.
