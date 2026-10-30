# Designing a workflow graph

## Find the simplest sufficient shape

Begin with the happy path as a plain list or working script. Apply the edge test before selecting a framework.

```text
True linear dependency:
Parse request -> Retrieve selected record -> Prepare change -> Validate result

Independent work with a join:
                 +-> Security review ------+
Change proposal -+-> Cost analysis --------+-> Join evidence -> Decision
                 +-> Compatibility review -+

Conditional routing:
Validate proposal
  +-> Valid and authorized -> Apply
  +-> Missing authority    -> Human decision
  +-> Invalid              -> Repair or reject

Bounded cycle:
Generate patch -> Run checks
                   +-> Pass -> Next authorized step
                   +-> Fail within limits -> Diagnose -> Generate patch
                   +-> Limits exhausted   -> Stop with evidence
```

Compose shapes only when their dependencies justify them. For fan-out, define concurrency limits and the join policy: all required results, quorum, or explicitly permitted partial results. Mark missing, failed, and timed-out branches; do not silently treat them as passing.

## Design procedure

1. Capture the happy path and the requested outcome. Identify existing authorization, platform constraints, and side effects.
2. Test each edge. Separate independent reads or analyses; retain ordering for real data, authority, and shared-resource dependencies.
3. Contract each node: single job, implementation type, typed inputs, structured output, validation, timeout, and distinct failure states.
4. Select minimum durable state. Store evidence/artifact references, results, status, errors, attempts, deadlines, authorization receipts, operation keys, timestamps, and correlation IDs where needed.
5. Define deterministic gates and routers. Separate evidence sufficiency, technical validity, and permission to execute.
6. Bound each loop. Choose limits from the workload and risk; record an exhaustion outcome such as reject, escalate, or deliver a labeled partial result.
7. Define local recovery. Distinguish transient failure, invalid output, permanent failure, cancellation, and unknown mutation outcome.
8. Place checkpoints before expensive work, after joins, and around human decisions. Specify how in-flight tasks and stale callbacks behave after resume or cancellation.
9. Add human interrupts only at actual authority or judgment boundaries. Preserve already granted authorization when its scope remains valid.
10. Define observable outcomes and recovery tests before expanding the implementation.

## Default design deliverable

For a complete design, provide these eight artifacts; combine sections when the graph is small.

1. **Graph diagram:** ASCII or Mermaid showing true dependencies, branch labels, join policy, and terminal outcomes.
2. **Node table:** `Node | Type (code/model/tool/human) | Inputs | Output | Failure handling`. Include timeouts and validation where consequential.
3. **State schema:** Typed fields and artifact references, with ownership and update rules. Identify what must persist and what may remain transient.
4. **Routers and gates:** Explicit conditions, evaluation order, and fail-closed behavior for malformed or missing required evidence.
5. **Loop table:** `Loop | Stop condition | Attempts | Deadline | Budget | Exhaustion route`. Include nested loops in the workflow-wide budget.
6. **Checkpoints and interrupts:** Locations, authorization scope, resume identity, cancellation behavior, and recovery invariants.
7. **Observability:** Metrics, decision reason codes, and actionable alerts with content-free diagnostics.
8. **Build order:** Incremental implementation and validation steps tailored to the workflow.

### Example state contract

Adapt this illustrative schema; do not add every field to a simple script. Timestamps use UTC ISO 8601; artifact references identify access-controlled durable storage rather than copying sensitive content into orchestration state.

```python
from typing import Literal, TypedDict


class ArtifactRef(TypedDict):
    uri: str
    digest: str
    observed_at_utc: str


class NodeResult(TypedDict):
    input_revision: int
    status: Literal["succeeded", "failed", "unknown", "cancelled"]
    output_ref: str | None
    error_code: str | None


class Authorization(TypedDict):
    operation_digest: str  # Canonical action + target + material inputs.
    receipt_ref: str       # Existing grant or recorded human decision.
    expires_at_utc: str | None


class Budget(TypedDict):
    max_calls: int
    used_calls: int
    max_cost_units: int    # Define the unit for this deployment.
    used_cost_units: int


class WorkflowState(TypedDict):
    workflow_id: str
    correlation_id: str
    revision: int
    status: Literal["running", "waiting", "succeeded", "failed", "cancelled"]
    artifacts: dict[str, ArtifactRef]
    nodes: dict[str, NodeResult]
    attempts: dict[str, int]
    operation_keys: dict[str, str]
    authorizations: dict[str, Authorization]
    deadline_utc: str
    budget: Budget
    cancel_requested: bool
    updated_at_utc: str
```

State update rules matter as much as the fields. Give concurrent branches separate result slots or defined reducers. Use atomic claims or equivalent synchronization for shared budget reservations and side-effect ownership. Reject callbacks whose input revision or run generation is obsolete. Cancellation prevents new downstream work even if an old tool call finishes later.

### Router and gate conditions

Write conditions close to executable policy, for example:

```text
if cancelled or deadline_elapsed or budget_exhausted:
    stop_with_checkpoint
elif required_results_missing or proposal_schema_invalid:
    repair_if_within_limits_else_escalate
elif required_checks_failed:
    reject_or_targeted_repair
elif not valid_authorization_for(operation_digest):
    checkpoint_and_wait_for_human
else:
    execute_with_stable_operation_key
```

Define the actual evidence thresholds, checks, limits, and authorization source. Do not use “looks safe” or a model confidence score as a substitute. Revalidate relevant preconditions after a long human wait or changed external state.

## Recovery and bounded execution

- Retry only classified transient failures, with bounded backoff and the node's remaining budget. Invalid model output can use a separate bounded repair path.
- Assign a stable idempotency key to a logical side effect before invoking it. Reuse it on retries; a new attempt is not a new operation.
- If a side effect may have succeeded before a timeout or crash, query its outcome or stop for reconciliation before retrying. When the destination lacks deduplication, document the remaining ambiguity.
- Use compensation only when supported and authorized; it is another side effect with its own failure handling. A checkpoint cannot roll back an external action.
- Persist limits and approval receipts so restart cannot reset budgets or silently widen authority. Enforce limits at scheduling and dispatch, not only after a call completes.
- At a human interrupt, retain a proposal digest, exact target/action, evidence references, and decision. Changed material inputs invalidate that decision.
- Test process termination after a tool succeeds but before its completion checkpoint, during fan-out, and while waiting for a human. Resume with the same workflow ID; verify no duplicate side effect or reused stale decision.

## Instrumentation and build order

Measure node execution and queue time, retries by error code, selected routes and reasons, tool failures, checkpoint age, budget usage, and end-to-end outcome quality. Alert on stuck joins, expired waits, repeated unknown outcomes, exhausted budgets, and missing progress. Keep payloads and credentials out of logs; use scoped artifact IDs for investigation.

Build the happy-path script first. Define minimum durable state and typed node functions, then wire true dependencies. Add branches and bounded concurrency, gates, checkpoints and recovery tests, necessary human interrupts, and instrumentation. Add a framework only when its durability or scheduling primitives solve a demonstrated need.

When a framework is selected, map these contracts to its nodes/activities, conditional edges, reducers, retry policies, durable checkpoints, and signals/interrupts. Verify version-specific APIs from current primary documentation before writing integration code.
