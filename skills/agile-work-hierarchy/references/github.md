# GitHub projection and readback

Sources accessed **2026-10-29**. The canonical hierarchy is `epic|milestone -> feature -> story -> task`. These are semantic kinds, not promises about GitHub's native object names. Bugs remain independent unless the user explicitly specifies another placement.

## Select a faithful mapping

| Canonical concept | Preferred GitHub representation | What does not establish containment |
| --- | --- | --- |
| Epic or semantic Milestone | Parent issue with its configured kind | A native milestone, Project, title prefix, or label alone |
| Feature | Issue of Feature kind, linked as a sub-issue of the chosen top goal | Sharing a milestone or Project with the goal |
| User Story | Issue of Story kind, linked as a sub-issue of its Feature | Mentioning the Feature in prose |
| Task | Issue of Task kind, linked as a sub-issue of its Story | A checklist item or blocking relation alone |
| Bug | Independent issue of Bug kind by default | Automatically attaching it to a Feature/Story because it affects that area |

Native sub-issue relationships supply the tree; kind metadata classifies nodes. GitHub permits nested sub-issues, including cross-repository links, with at most **100 direct sub-issues per parent** and **eight nested levels**. UI management requires at least triage permission. [Sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues).

Native GitHub milestones group issues and pull requests in one repository and track dates/progress. They are separate grouping objects, not parent issues. Keep a semantic Milestone issue distinct from an optional native milestone used for release tracking. Do not create both automatically. [Milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones).

## Discover capabilities before choosing fields

Identify the exact host, account, repository, organization or personal ownership, permissions, and supported API/CLI version. Inspect existing kind conventions and reuse them when compatible; do not rename workspace-wide types or labels as an incidental planning step.

Organization issue types provide defaults Task, Bug, and Feature. Organization owners can manage up to **25 types**, so Epic/Milestone/Story may be configured types when available. Resolve the actual existing types rather than assuming those three extra names exist. In a context without suitable native types, use one explicit semantic-kind label convention and validate exclusivity yourself. Types and labels do not enforce permitted parent/child pairs. [Issue types](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/managing-issue-types-in-an-organization).

Projects can provide useful views and optional single-select kind fields, but Project membership is not a parent edge. Custom fields belong to Project items, so an item ID/field ID is distinct from the underlying issue ID. Treat mirrored kind fields as projections rather than independent contradictory sources of truth. A single-select field supports up to **50 options**. [Single-select fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-single-select-fields).

Inspect the connector's actual schema before acting. A generic issue-create tool may lack issue-type, sub-issue, dependency, or Project-field operations, and a fetch operation may permit reads only. Do not pretend a successful issue creation also created links. Use an available authorized API/CLI path, or return a proposed graph and an explicit unmaterialized-link list.

## Keep identity and relationship types separate

The documented REST paths are:

- Read parent: `GET /repos/{owner}/{repo}/issues/{issue_number}/parent`.
- Read children: `GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues`.
- Add child: `POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues`, using numeric `sub_issue_id`.
- Remove child: `DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue`, also using `sub_issue_id`.

The child must have the **same repository owner** as the parent; cross-repository does not mean cross-owner. The optional `replace_parent` deliberately changes an existing parent; do not set it just to suppress a conflict. Issue number, REST numeric ID, and GraphQL node ID are different identifiers. Read operations require Issues read access for private resources; writes require Issues write access. [REST sub-issues](https://docs.github.com/en/rest/issues/sub-issues).

Dependencies express execution ordering, not decomposition. Maintain `blocks`/`blocked_by` edges separately from parent edges. GitHub documents dependency support for Free, Pro, Team, and Enterprise Cloud, with at least triage permission in the UI; verify the target server edition/version separately. [Dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies), [REST dependency endpoints](https://docs.github.com/en/rest/issues/issue-dependencies).

## Materialize and verify

For authorized tracker writes, create missing nodes first, retain returned IDs/URLs, then add exact parent and dependency edges. Reconcile an uncertain result before retrying; never create duplicate issues because a response was lost. A changed existing parent is a material operation to assess explicitly.

Read every affected node's actual kind and parent, enumerate its children, and compare against the proposed graph. Verify each Feature has one top goal, each Story one Feature, and each Task one Story; do not infer parents from inherited grouping metadata. Read bug placement separately. A platform's ability to accept a link does not mean the semantic hierarchy allows it.

The child-list REST endpoint defaults to **30 results** and supports **100 per page**; follow pagination rather than assuming a requested page size proves completeness. GraphQL connections require `first` or `last` between **1 and 100**, with cursor traversal to completion. [REST pagination contract](https://docs.github.com/en/rest/issues/sub-issues), [GraphQL pagination](https://docs.github.com/en/graphql/guides/using-pagination-in-the-graphql-api).

Search is useful for candidates, not a complete graph audit: REST search returns at most **1,000 matches** and can mark results incomplete. Prefer repository/relationship enumeration for verification, recording visibility gaps, inaccessible nodes, and unvisited pages. A not-found result may reflect access rather than absence. [Search limits](https://docs.github.com/en/rest/search/search).

When native relationships are unavailable or insufficient, preserve the canonical graph in a structured local proposal/register with stable IDs and explicit edges. Mark its projection status as logical-only; do not describe labels or body links as native hierarchy. Include the exact remaining provider operations needed to complete materialization.
