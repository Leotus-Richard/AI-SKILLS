# Skill catalog

Generated from canonical `skills/<name>/SKILL.md` files and `registry/skills.json`. Run `npm run catalog` after source changes.

This repository contains **5 skills**. Each Perplexity upload archive contains one skill with `SKILL.md` at its root.

| Skill | Version | Category | License | Description |
| --- | --- | --- | --- | --- |
| [agile-work-hierarchy](../skills/agile-work-hierarchy/SKILL.md) | 1.0.0 | workflow | Apache-2.0 | Use when planning, creating, reviewing, or reconciling Agile work as an Epic or Milestone → Feature → User Story → Task hierarchy, with independent Bugs and separate dependencies, in Linear, GitHub Issues, Azure DevOps, or Jira. |
| [enterprise-agent-architecture](../skills/enterprise-agent-architecture/SKILL.md) | 1.0.0 | workflow | Apache-2.0 | Use when designing, reviewing, or documenting governed enterprise AI agents (knowledge, diagnostic, or action agents and multi-agent systems): capability contracts, source authority tiers, hybrid retrieval, tool permissions and approval gates, risk-tiered governance, audit, and evaluation. Covers choosing among Microsoft Agent Framework, Google ADK, OpenAI Agents SDK, CrewAI, and LangGraph. |
| [graph-engineering](../skills/graph-engineering/SKILL.md) | 1.0.0 | workflow | Apache-2.0 | Use when designing, reviewing, or refactoring AI agent workflows into explicit execution graphs: branches, parallel workers, approvals, retries, stateful handoffs, or slow and flaky agent loops. Prefer a script for simple sequential work. |
| [grill-with-docs](../skills/grill-with-docs/SKILL.md) | 1.0.0 | workflow | MIT | Use when asked to grill a plan, stress-test a design, or clarify and document a domain model in one session: interview in dependency-aware rounds with recommendations, keeping a domain glossary and qualifying architecture decision records. For multi-session planning, use Wayfinder. |
| [wayfinder](../skills/wayfinder/SKILL.md) | 1.0.0 | workflow | MIT | Use when charting a route, resolving planning decisions, or resuming a Wayfinder map for a large, uncertain multi-session effort. Keeps decision tickets, a destination, fog, and a resume packet. One-session decisions: use grill-with-docs. |

## Tested with

Models used by the latest live evaluation (`skill-eval.yml`) of each skill's current version, from `registry/skills.json`.

- **agile-work-hierarchy** 1.0.0: not yet tested with a model
- **enterprise-agent-architecture** 1.0.0: not yet tested with a model
- **graph-engineering** 1.0.0: not yet tested with a model
- **grill-with-docs** 1.0.0: not yet tested with a model
- **wayfinder** 1.0.0: not yet tested with a model

## Version history

Newest first. Each entry states the expected behavior of that version; see [versioning](VERSIONING.md).

### agile-work-hierarchy

- **1.0.0** (2026-11-24, initial): Plans, reviews, or reconciles Agile work as an Epic or Milestone → Feature → User Story → Task hierarchy with independent Bugs and separate dependency edges. Drafts by default and changes a tracker only with authorization; the bundled validator checks plan structure (exit 0 valid, 1 violations, 2 usage error).

### enterprise-agent-architecture

- **1.0.0** (2026-11-24, initial): Guides design and review of governed enterprise AI agents through the eight pillars, source authority tiers, hybrid retrieval and risk-tiered governance. Produces design documents or ranked reviews that separate proposed controls from implemented ones, and checks framework claims against current documentation.

### graph-engineering

- **1.0.0** (2026-11-24, initial): Turns agent workflows into explicit execution graphs (node contracts, routers, gates, bounded loops, checkpoints) or reviews existing ones, leading with ranked findings. Recommends a plain script when a graph is not needed and stays framework-neutral unless one is chosen.

### grill-with-docs

- **1.0.0** (2026-11-24, initial): Interviews the user in dependency-aware rounds with recommendations to settle a plan or design in one session, maintaining a domain glossary and qualifying ADRs. Points multi-session planning to Wayfinder and does not treat the interview as authorization to implement.

### wayfinder

- **1.0.0** (2026-11-24, initial): Charts and maintains a multi-session decision map: destination, separate decision tickets, frontier, fog, and a resume packet. Plans only, never implements, and points decisions that fit one session to grill-with-docs.

## Provenance

- **agile-work-hierarchy**: original; <https://github.com/Leotus-Richard/AI-SKILLS/tree/881f8a1e46a3f8b64f22ac9d6d95824f137e26ea/skills/graph-engineering>, <https://docs.github.com/en/rest/issues/sub-issues>, <https://linear.app/docs/parent-and-sub-issues>, <https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/define-features-epics?view=azure-devops>, <https://support.atlassian.com/jira-cloud-administration/docs/configure-the-issue-type-hierarchy/>.
- **enterprise-agent-architecture**: user-supplied; user-supplied source with no independently verified URL.
- **graph-engineering**: user-supplied; user-supplied source with no independently verified URL.
- **grill-with-docs**: adapted-upstream; <https://github.com/mattpocock/skills>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/grill-with-docs/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/ADR-FORMAT.md>.
- **wayfinder**: adapted-upstream; <https://github.com/mattpocock/skills>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/wayfinder/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/research/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/SKILL.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md>, <https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/domain-modeling/ADR-FORMAT.md>.
