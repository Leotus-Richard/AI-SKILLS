# Portable plan format and validator

Use JSON when a durable plan, bulk creation, migration, or repeatable audit needs explicit IDs and edges. Small drafts can use a table or outline. The format is provider-neutral; keep the native projection and operation ledger alongside it rather than confusing native object names with canonical kinds.

## Run the helper

Requires Node.js 22.20 or newer, with no package installation or network access:

```sh
node scripts/validate-plan.mjs assets/example-plan.json
node scripts/validate-plan.mjs path/to/plan.json
# Use '-' to read JSON from standard input.
```

Run from this skill's folder, or resolve the script and plan paths from the installed skill location. The helper reads input and prints a report; it does not write files or contact a tracker. Exit 0 means structurally valid, 1 means invariant violations, and 2 means usage, read, or JSON-parse failure. The module also exports `validatePlan(plan)`, returning an array of `{code, path, message}` errors.

## Shape

```json
{
  "schemaVersion": 1,
  "items": [
    {
      "id": "goal-1",
      "kind": "epic",
      "title": "Customer export MVP",
      "parentId": null,
      "dependsOn": [],
      "outcome": "Customers can export their saved searches.",
      "acceptanceCriteria": ["The required export capability is usable by pilot customers."],
      "verification": ["Record a pilot customer's end-to-end export result."],
      "goalMode": "bounded",
      "status": "backlog"
    }
  ],
  "externalReferences": []
}
```

This one-item fragment is a valid early goal draft, not a complete delivery plan. The bundled [example](../assets/example-plan.json) includes all four levels and an independent Bug.

| Field | Contract |
| --- | --- |
| `schemaVersion` | Exactly `1`. |
| `items` | Nonempty array of canonical work items, with unique nonempty `id` values. |
| `kind` | `epic`, `milestone`, `feature`, `story`, `task`, or `bug`. Epic and Milestone occupy the same root level. |
| `title`, `outcome` | Nonempty text. Outcome describes the bounded result, not the workflow state. |
| `acceptanceCriteria`, `verification` | Nonempty arrays of nonempty text. Criteria specify success; verification describes how it will be checked. They do not assert that checks have passed. |
| `parentId` | Absent or null for Epic/Milestone and independent Bugs. Required existing local ID for Feature → Epic/Milestone, Story → Feature, Task → Story. |
| `dependsOn` | Optional unique ID array. `B.dependsOn: [A]` means B requires A's completed result. No dependency is inferred from containment or item order. |
| `dependencyReasons` | Optional mapping from prerequisite ID to required output and consuming need. Record these reasons in the plan or accompanying edge list; their quality needs review rather than a structural check. |
| `relatedTo` | Optional unique ID array for explicitly specified non-containment context. It neither orders work nor supplies a parent. Bugs acquire no such links by default. |
| `goalMode` | Required `bounded` or `ongoing` for Epic/Milestone. |
| `status` | Optional `backlog`, `ready`, `in-progress`, `review`, `done`, or `canceled`. Map native states explicitly. |
| `doneEvidence` | Nonempty text array required when `status` is `done`. References declared completion evidence; the helper does not inspect it. |
| `customerReady` | Must be boolean `true` for a done Feature. A declaration to verify against evidence, not proof of actual availability. |
| `closureDecision` | Nonempty text required for a done ongoing Epic/Milestone. Record the explicit decision to end the continuing goal. |
| `bugParentException` | Required only for a parented Bug: `{"requestedBy":"user","reason":"..."}`. Its parent must be a Story. Other parent requests need a hierarchy decision outside this format. The marker records a claim; it cannot establish real user authorization. |
| `externalReferences` | Optional array of `{id, url}` for known dependency/related targets outside the plan. IDs must be unique across local and external items; use absolute HTTP(S) URLs to authoritative items. External references cannot be parents. |

Optional additional fields may hold owner, scope, component, reproduction, deadline, or provider projection metadata. The helper checks the documented invariants, not a closed schema for all domain details. Keep credentials and private conversation content out of plans.

## What is checked

- Required fields, valid kinds/statuses, unique IDs, permitted parent kinds, and explicit Bug-parent exceptions.
- Known edge endpoints, no duplicate/self edges, and no containment or prerequisite cycles among local items.
- No completion deadlock formed by combining prerequisites with child-completion → parent-completion joins. A Task cannot depend on its own Story's completed result; cross-branch rollup deadlocks are invalid too.
- Done items have declared evidence; done Features declare customer readiness; ongoing goals have a closure decision; a done parent has no retained child that is unfinished or canceled. If work leaves the required scope, revise the plan explicitly before closing the parent.

## What still needs judgment and readback

The validator cannot establish good decomposition, acceptance quality, trustworthy evidence, actual customer access, native tracker enforcement, permissions, or a user's real authority. It does not prove `ready` items have satisfied prerequisites. Check dependency readiness and release evidence separately before execution or completion transitions.

Only edges included in the plan are visible. An external reference resolves identity but supplies no outgoing edges, so cycles through outside work remain unverified until the relevant graph is read and included. A partial plan can pass with an empty Feature or Story; passing is not a claim of complete scope coverage. Inspect the intended completion joins and remaining work before publishing a full backlog.
