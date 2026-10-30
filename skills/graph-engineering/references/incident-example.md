# Example: platform / Kubernetes incident investigation

Use this as a shape to adapt, not a requirement to deploy agents or mutate infrastructure.

```text
Incident received
   |
Classify scope and severity
   +-> Gather cluster health ----------------+
   +-> Inspect deploy / GitOps changes -------+
   +-> Query application telemetry -----------+-> Join evidence and correlate
   +-> Check cloud dependencies --------------+             |
   +-> Retrieve runbooks and past incidents --+     Rank hypotheses
                                                           |
                                             Independent verifier / policy gate
                                               +-> Supported, authorized mitigation -> Execute or propose
                                               +-> Missing action authority          -> Human decision
                                               +-> Insufficient evidence             -> Bounded targeted query
                                               +-> Conflicting evidence              -> Incident packet / escalate
```

The evidence branches consume the incident scope, time window, and access scope; none should require another branch's prose merely to start. The join needs their results and must identify unavailable sources. A failed telemetry query retries or degrades locally rather than restarting cluster and deployment inspection.

Keep evidence references, citations, source observation times, correlation IDs, and query outcomes in durable state. Avoid copying secrets, raw customer content, or entire logs into every reviewer context.

The verifier receives the proposed mitigation, supporting evidence, counterevidence, and execution constraints. It checks the proposal independently of the diagnosing context. Confidence and risk classification inform routing but do not grant authority.

Changing a Kubernetes resource, running a migration, rolling back a deployment, communicating externally, and closing an incident have distinct scopes. Validate authorization for the exact proposed action. Use existing grants where valid; interrupt for a concrete reviewable decision when authority is absent or the action changes. Respect the repository's GitOps workflow instead of assuming direct cluster mutation is appropriate.

Bound the targeted-evidence loop by attempts, deadline, query/cost budget, and a convergence condition such as a verified hypothesis with sufficient independent evidence. Exhaustion produces a labeled incident packet with unresolved questions; it does not silently promote the leading guess to a fact.

Checkpoint before expensive queries, after the evidence join, and before/after a human decision. Store operation keys before mutations, and reconcile ambiguous outcomes before retrying. Verify recovery in an isolated environment by interrupting after a simulated successful action and resuming with the same workflow ID.

This shape also fits deployment review, cost remediation, security triage, and data-pipeline repair: independent evidence -> explicit join -> hypotheses/proposal -> independent gate -> authorized action or bounded recovery.
