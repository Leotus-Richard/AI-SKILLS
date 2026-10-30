# Source and adaptation notes

Original AI-SKILLS contribution created on 29 October 2026 under Apache-2.0. The repository owner's requested hierarchy and clarification define the canonical policy: Epic/Milestone → Feature → User Story → Task; customer-consumable Features; Tasks parented by Stories; Bugs independent unless explicitly specified. This is a project/library convention, not a universal definition of Agile or Scrum.

The design adapts explicit node contracts, meaningful dependency edges, validation gates, durable operation keys, reconciliation after ambiguous writes, and evidence-aware outcomes from the repository's [Graph Engineering source at revision 881f8a1e46a3f8b64f22ac9d6d95824f137e26ea](https://github.com/Leotus-Richard/AI-SKILLS/tree/881f8a1e46a3f8b64f22ac9d6d95824f137e26ea/skills/graph-engineering). It bundles the necessary guidance locally and does not require that skill to be installed. Graph Engineering's original publication attribution remains user-supplied and unverified; no additional text from that attributed publication was imported here.

Provider references synthesize current official documentation accessed on 29 October 2026 and link directly to the relevant pages. They are maintained decision guidance rather than copied API manuals:

- [GitHub sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues) and [REST sub-issues](https://docs.github.com/en/rest/issues/sub-issues).
- [Linear parent and sub-issues](https://linear.app/docs/parent-and-sub-issues) and [GraphQL API](https://linear.app/developers/graphql).
- [Azure DevOps backlog levels](https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/define-features-epics?view=azure-devops) and [process customization](https://learn.microsoft.com/en-us/azure/devops/organizations/settings/work/customize-process-backlogs-boards?view=azure-devops).
- [Jira work-type hierarchy](https://support.atlassian.com/jira-cloud-administration/docs/configure-the-issue-type-hierarchy/) and [Plans parent relationships](https://support.atlassian.com/jira-software-cloud/docs/link-issue-to-a-parent-in-advanced-roadmaps/).

Capabilities vary by provider edition, workspace configuration, permissions, and available connector. Documentation research does not establish a successful live tracker round trip. The plan validator checks declared local structure and completion assertions; it does not prove real authorization, customer readiness, trustworthy evidence, or completeness of external dependency graphs. The example plan is synthetic and does not represent existing tickets or delivered software.

The bundled LICENSE.txt preserves the Apache-2.0 contribution terms. Documentation citations are references to provider behavior, not an assertion that provider documentation is relicensed under this contribution.
