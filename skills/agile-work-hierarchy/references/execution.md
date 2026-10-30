# Execution, resume, and readback

Read this when the user requests actual tracker changes or reconciliation. A planning request stays a plan. Preserve existing user authorization; ask only for genuinely missing target, scope, or mutation authority. Do not add an approval ritual for already authorized routine work.

## Capability and target preflight

Identify the provider, account/workspace, team/project/repository, access scope, native schema, and available operations. Resolve IDs from authoritative metadata rather than matching display names across different teams or guessing a process. Read existing work and the complete target area with pagination before deciding what to reuse.

Check capabilities individually: create/read/update items, parent links, dependency links, labels/fields, status writes, and full pagination. Having an issue-creation operation does not imply that the connector can set a parent or write a blocker. If the API supports a missing operation, use another already-authorized supported interface when available; otherwise report the gap and keep that operation pending.

Establish a projection table:

| Canonical ID/kind | Native object and type | Canonical parent | Native parent or logical marker | Remote ID/URL |
| --- | --- | --- | --- | --- |

Record dependency representations separately. Do not change global schemas, move existing issue trees, or bulk replace existing relationships without authorization covering that change. A parent replacement may detach an item from someone else's plan.

## Validate before writing

Check allowed kind edges, roots, duplicate IDs, missing context, cycles, acceptance/verification fields, and the provider's actual link/type/depth rules. Check the diff against existing items rather than generating an entirely new tree on every run. Flag ambiguous matches for resolution; a similar title alone is not reliable identity.

For each dependency, state the prerequisite output and consuming need. The direction `B.dependsOn = [A]` means A must provide its required result before B can proceed; it does not mean B blocks A. Separate completed prerequisite evidence from a merely closed issue or canceled work. A blocked item can exist in the backlog; it must not be represented as ready to execute just because its parent was created.

Use the bundled plan validator when the JSON format is useful. Passing it verifies declared structure and certain completion claims, not semantic correctness, external dependency cycles, or live permissions.

## Durable operation ledger

For bulk creation or any retried external mutation, persist enough state outside the chat to resume:

```text
plan ID + revision/hash; canonical item ID; target scope
operation key; action; intended payload hash
state: planned | dispatched | confirmed | needs-reconciliation | failed
remote ID/URL; response receipt; readback result; attempt count
```

Freeze the operation intent before dispatch. Use provider idempotency support where available; otherwise store a stable searchable canonical key in an approved field or a description marker such as `work-graph:<plan-id>:<item-id>`. Such a marker helps lookup; it does not guarantee exactly-once creation. It must not contain credentials, private conversation content, or personal filesystem paths.

Create/reconcile ancestors before their children. Record each confirmed remote ID before using it in another write. Create independent branches concurrently only where the provider, shared fields, and rate limits permit. Add prerequisites and specified related links after both endpoints exist. Do not infer dependencies from creation order.

On timeout or ambiguous response, mark the operation as needing reconciliation and look up the exact key in the exact target. Reuse the confirmed matching item after comparing intended fields. Do not blindly issue another create. If the result cannot be established, stop that operation with its ledger intact. Bound transient retries and retain consumed attempts across resume; do not rerun successful branches or delete ambiguous items to conceal the uncertainty.

## Independent readback

Read the saved state after writes, including all pages. Compare against the intended plan:

- One remote item per canonical key; correct scope, type/kind marker, and title/outcome.
- Exactly the intended canonical parent and a truthful record of whether that parent is native or logical. No skipped levels, extra parents, or accidentally parented independent Bugs.
- Correct prerequisite directions and endpoints, no cycles in the observed graph, and no accidental blockers between independent siblings. Include existing edges in cycle checks when visible; disclose inaccessible external boundaries.
- Expected workflow states. Newly planned work remains in intake/backlog unless a different state was requested. Do not advance Feature/goal completion from child state alone.
- All pending operations, conflicts, denied writes, partial results, and missing evidence retained in the report.

State separately what was drafted, written, read back, and behaviorally verified. Tracker readback proves the plan's stored structure, not that the software works. If a connector exposes only summaries or cannot enumerate all links, report that verification limit instead of calling the graph fully verified.
