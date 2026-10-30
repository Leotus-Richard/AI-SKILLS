# Reviewing an existing agent workflow

Inspect actual code, tool contracts, persisted state, and representative execution evidence when available. Separate confirmed failures from design risks and unmeasured latency or cost claims. Do not assume the user's description proves implementation behavior.

Trace a successful run, a failure, and a resume. Apply the edge test and check the transitions below. Report findings ranked by concrete impact, with code/evidence references when available.

| Check | Failure to look for | Typical fix |
| --- | --- | --- |
| Fake dependencies | Independent evidence collection is serialized, extending latency. | Fan out within resource/concurrency limits; join under an explicit completion policy. |
| God nodes | One prompt retrieves, reasons, mutates, and judges its own result. | Split responsibilities and validate typed outputs at transitions. |
| Unstructured handoffs | Whole histories or ambiguous prose cross node boundaries. | Scoped typed inputs and durable artifact references with provenance. |
| Hidden routing | A model silently selects tools or next steps without inspectable criteria. | Validate the model's classification; route through explicit code conditions. |
| Missing gates | Invalid evidence or missing authorization reaches a consequential action. | Separate validity, evidence, and authorization checks before execution. |
| Self-approval | The drafting context is the only verifier of a consequential proposal. | Independent checks or reviewer with evidence and criteria; no automatic extra agent for trivial work. |
| Unbounded loops | Refinement/retries lack convergence, caps, deadlines, or shared budgets. | Bound all cycles, including nested retries and resumed runs; define exhaustion behavior. |
| Global failure | One query restarts successful branches or kills the entire run. | Local retry, explicit partial results, targeted repair, or escalation. |
| Missing durability | A crash loses evidence, human decisions, limits, or run identity. | Minimum durable state and checkpoints with a tested resume path. |
| Duplicate side effects | Timeout/restart repeats a possibly successful mutation. | Stable operation key, destination deduplication, and outcome reconciliation. |
| Stale results | Old callbacks or decisions apply after inputs change or cancellation. | Revision/generation checks, scoped decisions, and dispatch-time cancellation gates. |
| Missing observability | Operators cannot explain paths, cost, delays, or failure location. | Correlated structured events, route reasons, metrics, and progress alerts. |

For each material finding, state:

1. What is wrong and where the evidence supports it.
2. Which concrete failure it causes, including conditions required to trigger it.
3. The smallest useful fix, including any cost or behavior tradeoff.
4. How to verify the fix; include a before/after graph fragment only when useful.

Do not label every missing mechanism a defect. A short deterministic transformation may need neither a framework nor durable orchestration. Preserve sound existing contracts and the user's chosen architecture.

## Targeted behavioral validation

Choose tests for the actual findings, rather than checking diagram headings or matching generated wording:

- Fail one independent branch; verify successful branches are retained and the join reports incompleteness honestly.
- Feed malformed or unsupported model output; verify no unauthorized route or tool invocation occurs.
- Exhaust retries, time, or budget; verify a terminal or human-wait outcome and no reset on resume.
- Interrupt after an external action succeeds but before checkpointing; verify reconciliation or deduplication rather than blind repetition.
- Change proposal inputs while waiting for a human; verify the old decision cannot authorize the changed action.
- Cancel during an in-flight call; verify late results cannot start downstream work.
- Resume a checkpoint with the same workflow ID; verify state, evidence references, and valid prior authorization survive.

Use fixtures or isolated environments where possible. A review or design task does not authorize live remediation, deployment, spending, or external communication. Existing exact authorization remains valid within its scope; do not invent an additional approval requirement just because the workflow contains a gate.

If the design is already sound, say so. Suggest only changes supported by the observed behavior or a clearly explained failure condition.
