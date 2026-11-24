# Coordination contracts

## Pattern selection

| Pattern | Shape | Real dependency test |
|---|---|---|
| Multi-repo implementation | One owned workstream per coherent repo slice | Consumer needs a specific producer API/artifact or authority |
| Cross-repo research | Independent provided local repo investigations | Usually fan-out; join only for requested synthesis |
| Compatible change stack | One runnable layer per contract slice | Later layer actually consumes the prior layer's contract/code |
| Independent tasks | Separate owners/paths with a shared report boundary | No blockers solely for list/session ordering |
| Alternative exploration | Isolated proposed branch/worktree | Original remains untouched; no automatic fork |

Graph-engineering owns runtime architecture; work-tracking owns canonical work state; orchestrate owns assignment and coordination. Do not create three separate backlogs or treat a session group as a dependency graph. Arena owns comparing competing candidates; orchestrate should not spawn an arena for ordinary coordination.

## Handoff minimum

Use the asset template with stable ID, relevant verbatim request, confirmed decisions, repo/owned paths, allowed operations, inputs and their evidence, required output artifacts/tokens, acceptance commands, deadlines/budgets, dependency/gate references, failure policy and escalation. Preserve unknown inputs/owners as unknown; do not invent repository project IDs or approvals.

Delegate read-only research separately from implementation. Never instruct a delegate to infer approval, weaken verification, change global Git identity or add co-author/agent-credit trailers. A shared identity policy does not grant commit permission.

## Joining and safe progression

Use the shared work graph's state model, not a parallel coordination database. Proposed work is backlog (ready only after accepted and prepared); running/review-needed is in_progress; blocked is derived from unmet contracts; verified becomes done only after every output and acceptance/gate obligation is evidenced. Failed remains non-done with failure evidence and a local policy, not a new canonical state. Cancellation does not automatically unblock a consumer.

Read actual outputs, not a child's self-reported completion alone. Verify changed paths and observable checks. Several green commits can implement one workstream; output contracts and approval gates still determine whether a consumer is ready.

Use a documented local result record keyed by canonical ID. When a workstream is blocked, update only the affected frontier and retain successful branches. If input contracts change, explicitly invalidate affected downstream evidence; never relabel stale results as verified.

Limit attempts and scope under the shared contract. Wait only through actually available authorized host coordination mechanisms; do not add sleep/watch loops or invent notifications.

## Preservation and host differences

The supplied source names list_projects, create_session, fork_session, message/plan APIs and destructive archive behavior for its original app. They are source examples, not available API claims. Native adapters have not been implemented for the portable package.

Under local-only scope there is no cloud-session creation, remote project discovery, PR/issue opening, automatic plan approval or session archival. Even a clean working tree or idle session is insufficient to authorize deletion: commits, saved artifacts, branches, pending work and automations may still matter. Ask before any separately requested destructive cleanup.
