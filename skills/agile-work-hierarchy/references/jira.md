# Jira Cloud adapter

Official sources checked **2026-10-29**. Jira's UI documentation increasingly says *work item*, *work type*, and *space*; its REST v3 paths still use `issue`, `issuetype`, and `project`. These examples are unexecuted request shapes, not claims about a live site's subscription, schema, or connector.

## Discover levels rather than matching names

Jira Cloud's default levels are Epic (`1`), standard work (`0`), and Subtask (`-1`). Story, Task, and Bug are ordinarily peers at standard level. Therefore **the canonical testable Task maps to a native Subtask**, not automatically to Jira's standard Task type. A custom standard type named Feature does not insert another level above Story.

Premium/Enterprise administrators can configure levels above Epic and additional types at the Epic level for company-managed projects. New levels are added at the top; renaming Epic leaves it at level `1`. Hierarchy changes affect company-managed configuration and can break existing relationships; do not make a site-wide change merely to import a plan. [Hierarchy configuration](https://support.atlassian.com/jira-cloud-administration/docs/configure-the-issue-type-hierarchy), [custom levels in Plans](https://support.atlassian.com/jira-software-cloud/docs/configure-custom-hierarchy-levels-in-advanced-roadmaps/).

| Observed capability | Mapping/projection | What must remain explicit |
| --- | --- | --- |
| Premium/Enterprise with a configured level above Epic | Canonical Epic/Milestone -> native Goal/Initiative at level 2; Feature -> native Epic or a configured level-1 Feature type; Story -> standard Story; Task -> Subtask | The native type named Epic may represent the canonical Feature role; record IDs/types/roles instead of relying on names |
| Standard/default three-level company-managed project | Native Epic can represent canonical Feature; Story and Subtask preserve its delivery subtree; top canonical goal remains a logical register/association | This is a logical projection for the missing top level, not a native four-level hierarchy |
| Standalone team-managed project | Inspect the Epic -> standard -> Subtask structure; use the same honest missing-level projection when needed | Do not claim that a custom standard Feature type creates extra hierarchy depth |
| Premium Plans with verified cross-project support | A company-managed Initiative can parent a team-managed Epic; that Epic may represent canonical Feature above its Story/Subtask subtree | Verify the actual account/Plans/API/connector path rather than blanket-forbidding mixed project styles |

The Plans documentation explicitly permits a company-managed Initiative above a team-managed Epic. It otherwise requires parents at the corresponding configured level: a Story cannot skip its Epic and point directly to an Initiative. This is a specific supported rollup; it does not establish arbitrary cross-style relationships for every API/UI operation. [Parent relationships in Plans](https://support.atlassian.com/jira-software-cloud/docs/link-issue-to-a-parent-in-advanced-roadmaps/).

A logical projection must retain the canonical top goal and `goal -> Feature` ownership edge in a stable register or available metadata. If an ordinary issue link carries that association, label it as logical containment and document its direction. It does not produce Jira-native parent rollup. Do not silently replace `Epic -> Feature -> Story` with `Epic -> Story`, or present a version/release label as a native issue parent. A label, component, fix version, dependency, and Parent field have different semantics.

## Read the site and connector contracts

Before drafting native writes, identify the site, project, project management style, subscription/configured hierarchy, available work type IDs and levels, required fields, subtask availability, and permissions. Read representative existing records where permitted. A plan or type name is not enough to infer the site's real configuration.

Useful read-only discovery includes:

- `GET /rest/api/3/project/{projectIdOrKey}` for project metadata. [Project API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/).
- `GET /rest/api/3/issuetype/project?projectId={id}` for project-scoped type details, including available `id`, `name`, `subtask`, and `hierarchyLevel`. This endpoint is marked experimental in the researched reference, so verify the actual contract or use supported create metadata as a fallback. [Issue-type API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-types/).
- `GET /rest/api/3/issue/createmeta/{projectIdOrKey}/issuetypes` and `GET /rest/api/3/issue/createmeta/{projectIdOrKey}/issuetypes/{issueTypeId}` for the paginated type/field metadata permitted for creation. [Create metadata](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/).
- Fetch existing issue fields and, when editing is requested, its edit metadata. Determine whether the relevant parent field is available for that project/type and caller; a field missing from one screen or connector is not proof that Jira lacks the underlying feature.

Discover IDs instead of hard-coding custom field numbers or assuming every project shares a global Story/Epic type ID. Required fields and writable fields are context-specific. Follow pagination, distinguish permission errors from empty results, and do not create a sacrificial issue to probe capability during a read-only planning task.

Probe the connector separately: can it read type levels and parent data, create a subtask type with a parent, assign a standard Story to its verified level-1 parent, set a configured higher-level parent, modify an existing parent, and read the result back? A generic issue-link tool is not equivalent to a Parent-field tool. If the necessary capability is absent, retain the canonical graph and provide a draft/manual/API procedure within the authorized scope; do not claim a native relationship was written.

## Parent field and subtasks

For authorized issue creation, REST v3 uses `POST /rest/api/3/issue`, with writable content in `fields`/`update`. A minimal illustrative field fragment is:

```json
{
  "fields": {
    "project": { "id": "10000" },
    "issuetype": { "id": "10004" },
    "summary": "Validate the saved preference after reload",
    "parent": { "key": "APP-42" }
  }
}
```

For a canonical Task, `10004` must be the **discovered subtask type ID** and `APP-42` its canonical Story; these example values are not universal. The API specifically requires a subtask issue type and a parent ID/key for subtask creation. A subtask cannot be created in a different project from its parent. Rich descriptions use Atlassian Document Format where required, not an assumed Markdown string. [Creation schema and constraints](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/).

Team-managed subtasks can sit under standard Stories, Bugs, and Tasks, but not directly beneath an Epic. The official guide notes a company-managed exception allowing direct Epic subtasks; the canonical policy still forbids skipping the Story level even where the product permits it. Do not infer the user's desired ownership from the loosest operation the API accepts. [Team-managed subtasks and the company-managed distinction](https://support.atlassian.com/jira-software-cloud/docs/manage-subtasks-in-team-managed-projects/).

After an authorized write, fetch the created/updated issue with the relevant parent/type fields and verify actual project, issue type ID, canonical role, and exact parent ID/key. For higher-level relationships, verify they appear in the intended native hierarchy/Plans context as well as the raw record. A successful create response or a written issue link is not proof of the desired rollup. On uncertain outcomes, reconcile the returned identity or existing state before retrying creation.

## Generic issue links are different edges

`POST /rest/api/3/issueLink` creates a typed ordinary relationship using inward/outward issue keys and a discovered link type. Linking must be enabled and caller permissions must allow it. It does not insert hierarchy levels or turn two standard peers into a supported parent/subtask pair. Fetch the linked issue's `issuelinks` to verify the relationship; creation can report success for an existing link, and an optional comment can still be added on repetition. Avoid replaying a comment-bearing request blindly. [Issue-link API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-links/).

Keep dependency edges distinct from canonical containment. Fetch the site's available link types and their inward/outward meanings; do not assume that `blocks`, `is blocked by`, or a custom `parent of` string is available or represents native Parent. Changing the site's link types or hierarchy is separate administrative work.

## Bugs stay standalone unless the user chooses a parent

Create a default canonical Bug as a non-subtask issue with **no Parent**, recording the affected component as metadata. Add any relationship only when explicitly specified. Native Bug is normally a standard type; it is not automatically a child of a Story. Omitting `parent` in the request is not sufficient verification if automation can add one afterward: read the actual parent back.

If the user explicitly asks for a Bug under a Story, check what the site supports. A standard Bug at level `0` cannot become a native child of a standard Story at the same level just because the relationship is requested. A configured subtask Bug type can represent that placement only if it exists, the user accepts that mapping, and its context permits it; otherwise use a clearly identified logical association or report the native limitation. Never silently convert a standalone existing Bug into a subtask, change its type, or reparent it to satisfy a display convention.

Report Bug placement separately from feature-delivery planning: actual component, canonical parent choice, native type, any existing native parent, and projection limitations. If a connector omits the parent field from responses, mark the result unverified rather than treating missing data as proof of no parent.
