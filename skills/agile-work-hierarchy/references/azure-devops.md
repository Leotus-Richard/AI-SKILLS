# Azure DevOps adapter

Official sources checked **2026-10-29**. Examples describe Azure DevOps Services REST API `7.1`; verify the supported API version and process model for Azure DevOps Server. These are adapter instructions, not evidence that any organization was inspected or work item changed.

## Map canonical roles to the actual process

The canonical ownership tree is `Epic/Milestone -> Feature -> User Story -> Task`. Match roles to their meaning and backlog category rather than requiring every provider to use the same displayed noun.

| Observed process | Native mapping for the four canonical roles | Fidelity |
| --- | --- | --- |
| Agile | Epic -> Feature -> User Story -> Task | Direct native mapping |
| Scrum | Epic -> Feature -> Product Backlog Item -> Task | Direct native mapping with PBI as the canonical story |
| Basic | Epic -> Issue -> Task | Only three built-in levels; the canonical Feature/Story distinction is missing |
| Customized process | Inspect its actual portfolio, requirement, and task backlogs and associated work item types | Map only verified roles/levels |

Basic has no built-in Feature work item type/backlog. Do not claim that naming an Issue "Feature" creates another native level. The provider's built-in types and category semantics are documented in [default processes](https://learn.microsoft.com/en-us/azure/devops/boards/work-items/guidance/choose-process?view=azure-devops) and [work items and types](https://learn.microsoft.com/en-us/azure/devops/boards/work-items/about-work-items?view=azure-devops).

For Basic or an incompatible custom process, propose one of two explicit approaches. A **logical projection** preserves all four canonical roles and edges in an agreed register/available metadata while declaring which edges the native backlog cannot represent. A **process adaptation** changes the organization's process configuration only when separately requested and authorized. A Basic inherited process can potentially gain a new top portfolio level; mapping that new goal type to canonical Epic and its existing Epic level to canonical Feature is a role remapping, not a claim that a Feature level was inserted between existing levels. Verify labels, associated types, impacted projects, and admin permissions before proposing it as native parity.

In the inheritance model, custom portfolio backlogs can only be added above the existing set, with at most five portfolio levels. Inherited levels cannot be removed or reordered; a custom level cannot be inserted in the middle; one work item type cannot belong to two backlog levels. Renaming a backlog does not alter its depth. These restrictions are specific to the documented inheritance model; inspect XML/on-premises configurations separately. [Backlog customization and limits](https://learn.microsoft.com/en-us/azure/devops/organizations/settings/work/customize-process-backlogs-boards?view=azure-devops).

## Discover capability before constructing a write

Read the organization/project/team identity, actual process and customization model, work item types, backlog configuration, team visibility/settings, relation types, and permissions. Native product support, account permissions, and the currently available connector are separate checks.

Useful read-only REST shapes:

- `GET https://dev.azure.com/{organization}/{project}/_apis/wit/workitemtypes?api-version=7.1` lists the project's types. [Type discovery](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-item-types/list?view=azure-devops-rest-7.1).
- `GET https://dev.azure.com/{organization}/{project}/{team}/_apis/work/backlogconfiguration?api-version=7.1` returns `portfolioBacklogs`, `requirementBacklog`, `taskBacklog`, ranks, and associated work item types. [Backlog configuration](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/backlogconfiguration/get?view=azure-devops-rest-7.1).
- `GET https://dev.azure.com/{organization}/{project}/{team}/_apis/work/teamsettings?api-version=7.1` exposes settings including `bugsBehavior` (`off`, `asRequirements`, or `asTasks`) and backlog visibility. [Team settings](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/teamsettings/get?view=azure-devops-rest-7.1).
- `GET https://dev.azure.com/{organization}/_apis/wit/workitemrelationtypes?api-version=7.1` identifies available relation reference names and topology. [Relation-type API](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-item-relation-types/list?view=azure-devops-rest-7.1).

Record whether the connector can read types/settings, read relations, create the required types, set an actual Parent relation, update an existing relation, preserve revision preconditions, and read the result back. If a connector exposes only titles and descriptions, do not infer that Azure DevOps lacks hierarchy. Mark the connector limitation and deliver a reviewable mapping/draft or use another authorized access route. Conversely, a generic relation writer does not establish that the current process supplies the desired backlog semantics.

## Native ownership versus graph dependencies

The native Child relation is `System.LinkTypes.Hierarchy-Forward`; Parent is `System.LinkTypes.Hierarchy-Reverse`. This is a tree: a work item has one Parent and a parent can have many children; circular containment is prohibited. Related and Predecessor/Successor are different relation families, not additional parents. [Link types and topology](https://learn.microsoft.com/en-us/azure/devops/boards/queries/link-type-reference?view=azure-devops).

Do not mistake backlog conventions for a universal service-level type constraint. Azure Boards documents stored same-category nesting, such as Story -> Story or requirement-level Story -> Bug, that causes ordering/display problems. The skill must therefore validate canonical adjacent role pairs itself, even if an API accepts a link. Use the natural category hierarchy for native boards, and keep a separate dependency edge where work merely blocks other work. [Same-category nesting behavior](https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/resolve-backlog-reorder-issues?view=azure-devops).

Cross-project child links can exist, but a different process can prevent hierarchy rendering in the child backlog. Team Area/Iteration filtering can also hide valid linked work. Distinguish the stored graph from the team's visible board; do not delete or duplicate a parent solely because it is absent from one view. [Cross-team/project portfolios](https://learn.microsoft.com/en-us/azure/devops/boards/plans/portfolio-management?view=azure-devops).

## Authorized relation changes

When an actual write is requested, Azure's work-item update API uses `PATCH .../_apis/wit/workitems/{id}?api-version=7.1` with `Content-Type: application/json-patch+json`. An illustrative child-side parent addition is:

```json
[
  { "op": "test", "path": "/rev", "value": 7 },
  {
    "op": "add",
    "path": "/relations/-",
    "value": {
      "rel": "System.LinkTypes.Hierarchy-Reverse",
      "url": "https://dev.azure.com/example/_apis/wit/workItems/123"
    }
  }
]
```

The revision and URL must come from the real fetched records, not the example. Read existing relations first; adding a second Parent is not reparenting. If replacement is intended, address the fetched relation index and preserve a revision test so a concurrent edit cannot redirect removal. Never set `bypassRules` as a hierarchy workaround. `validateOnly=true` is a supported no-save validation option, but it neither proves a later write succeeded nor replaces authorization. [Update request/validation schema](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/update?view=azure-devops-rest-7.1).

Read back the work item with relations after mutation; verify its real type, exact Parent ID, expected child-side/parent-side relation, canonical role, and unchanged identity. A connector success message or a title-prefix convention is insufficient. On a timeout, inspect current state before repeating the patch.

## Bugs remain standalone by default

The user's policy is separate from Azure's team-level setting: **a Bug has no canonical or native Parent by default**. Identify its affected component as metadata, without inventing a Feature or Story to house it. Add any relationship only when explicitly specified. Attach it to a Story only when the user explicitly requests that parent and the discovered native configuration supports it.

Azure teams can display Bugs alongside requirements, as tasks, or outside backlogs; these settings do not authorize automatic nesting. Basic generally uses Issue rather than a built-in Bug type. If the native Bug type is absent, propose an explicit logical Bug classification on an available type instead of silently changing the process. A standalone Bug may have different board visibility under the observed setting; report that tradeoff rather than assigning a parent to make it appear. [Bug-management choices](https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/manage-bugs?view=azure-devops).

For an existing Bug with a parent, report the observed relationship and whether it conflicts with the requested policy. Do not remove an established parent as an incidental consequence of discovery. Creation defaults, existing-record repair, process customization, and dependency linking are distinct operations with distinct targets.
