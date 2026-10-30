# Linear projection and readback

Sources accessed **2026-10-29**. Preserve `epic|milestone -> feature -> story -> task` as the semantic hierarchy. Bugs are independent unless the user explicitly requests another placement. Linear's Projects, Initiatives, milestones, labels, and parent links represent different concepts.

## Preferred issue-tree projection

Where the workspace supports the required depth, represent all four semantic levels as issues, mark their kind with a controlled label convention, and use actual issue `parentId` relationships. Confirm the three parent edges required by a four-node root-to-Task chain rather than assuming that recursive capacity exists because the API accepts one parent ID.

The reviewed parent/sub-issue documentation does not publish a numerical maximum issue depth or child count. Inspect the public schema, connector fields, and an existing accessible hierarchy or an appropriate authorized isolated validation case. Do not borrow the separately documented five-level limit for sub-initiatives or sub-teams and apply it to issues. [Parent and sub-issues](https://linear.app/docs/parent-and-sub-issues), [GraphQL API and introspection](https://linear.app/developers/graphql).

Check whether the available interface supports assigning `parentId`, reading each parent, and listing children by parent. Individual-link operations do not establish recursive readback, complete pagination, or workspace depth. If the necessary depth is unavailable, retain a structured logical graph and explicitly identify which native edges cannot be represented.

## Native grouping is a separate projection

| Linear object | Native purpose | Mapping caution |
| --- | --- | --- |
| Issue parent/sub-issue | Decompose work through an issue parent | Preferred containment representation when required depth works |
| Project | Group outcome-oriented issues, possibly across teams | Not an issue parent; an issue belongs to only one Project at a time |
| Project milestone | Group issues within one Project into stages | Not the parent issue of those issues |
| Initiative | Group contributing Projects toward strategic goals | Not a direct issue-parent replacement |
| Label/group | Classify issue kind and other dimensions | Does not create or prove any parent relationship |

[Projects](https://linear.app/docs/projects), [Project milestones](https://linear.app/docs/project-milestones), [Initiatives](https://linear.app/docs/initiatives).

A provider-oriented alternative can map a semantic Epic to a Project and its Features to issues. That is an explicit adapter choice, not the default meaning of Epic. Preserve the logical immediate-parent graph separately: a Story sharing the Project of its Feature does not create a forbidden direct semantic Epic-to-Story edge. Document every native ID, semantic kind, canonical parent, and the provider property used for its projection. Do not infer a semantic parent from a date, Project, cycle, or milestone name.

Avoid introducing Initiatives merely to obtain an Epic-shaped name. Sub-initiatives can have multiple parents, which differs from the canonical single-parent work-item tree. Check the target plan and actual grouping semantics before selecting this projection. [Initiatives](https://linear.app/docs/initiatives), [Sub-initiatives](https://linear.app/docs/sub-initiatives).

## Kind conventions and inheritance

Do not invent a native `issueType: epic` field. Linear's documentation explicitly distinguishes its model from Jira Issue Types. Use existing workspace labels or a semantic-kind label group for Epic/Milestone/Feature/Story/Task/Bug when those are the agreed classifications. Templates can prefill these values but do not prove they were applied. [Jira model differences](https://linear.app/docs/jira), [Issue templates](https://linear.app/docs/issue-templates).

The current issue-properties guide supports single-select and multi-select label groups; single-select is the default. Choose or verify a single-select kind group when available, then still validate exactly one semantic kind. Same-name team labels can aggregate in UI filters while the API requires their distinct IDs, so resolve labels within their workspace/team scope. Do not remove unrelated labels when replacing only the kind. [Current issue properties](https://linear.app/docs/issue-property).

New sub-issues inherit team, priority, and Project, and sometimes the active cycle; labels are not inherited. Classify each child explicitly. Team-configured parent/sub-issue auto-close can change statuses beyond the edited item, so inspect those automations when validating completion behavior. Converting a parent issue to a Project removes its sub-issue relationships; it is not a harmless rename. [Parent properties and conversion](https://linear.app/docs/parent-and-sub-issues).

## Dependencies and connector capability

Issue relations include related, blocking, blocked, and duplicate. These are distinct from `parentId`. Record decomposition and prerequisite edges separately, and do not nest an independent Bug simply because it blocks a Feature or Story. The UI can regroup a resolved blocker under Related; inspect actual relation/status data before interpreting that presentation as a graph mutation. [Issue relations](https://linear.app/docs/issue-property#issue-relations).

Verify that the available interface can write and read the needed relation kind independently of `parentId`. Explicitly request parent, labels, Project/milestone, and relations when field-selection readback is available. A sparse default response is not evidence that omitted fields are empty. Do not treat a connector's schema as the complete public API.

## Verify the projection completely

After authorized writes, retain immutable IDs and returned URLs, then read each node's kind, actual parent, and actual children. Validate one top goal per Feature, one Feature per Story, one Story per Task, and the explicit bug-placement policy. Preserve the canonical graph if provider grouping projects additional ancestor metadata onto descendants.

Issue list results are paginated. Linear's GraphQL defaults to **50 results** and uses Relay cursors (`first`/`after`, `pageInfo.hasNextPage`, `endCursor`). Traverse every relevant parent/child list; a single page or a connector's `limit` does not prove complete readback. Request only needed fields and do not expand every nested branch into one enormous query. [Pagination](https://linear.app/developers/pagination).

Honor request/complexity limits and `Retry-After`; do not treat rate limiting or an access-filtered response as absent work. Check actual workspace capacity before bulk materialization. [Rate limiting](https://linear.app/developers/rate-limiting), [Plan comparison](https://linear.app/pricing).
