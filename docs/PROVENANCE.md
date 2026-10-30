# Provenance and licensing

This repository combines original repository tooling and documentation with standalone skills that retain their own source history and notices. The root [Apache License 2.0](../LICENSE) covers the repository scaffold and original contributions; it does not replace notices attached to imported or adapted material. See the root [NOTICE](../NOTICE).

## Where the evidence lives

- [`registry/skills.json`](../registry/skills.json) records each skill's category, applicable license designation, and provenance metadata.
- Each `skills/<name>/SOURCE.md` describes the material used and relevant adaptation or evidence limits.
- License files inside each skill travel with that skill into its individual upload ZIP.
- [`generated/catalog.json`](../generated/catalog.json) and the [human-readable catalog](CATALOG.md) are generated views of source metadata, not independent provenance authorities.

Source references identify the versions used to create this collection. They do not claim that an upstream default branch remains unchanged. Verify current APIs, policies, or external behavior when a new task depends on them.

## Workflow skills

### Graph Engineering

Graph Engineering is the user's supplied runbook, contributed here under Apache-2.0. Its core guide and local design, review, and incident references are retained. Host interface metadata is omitted because it is not needed for a standalone portable skill.

The runbook attributes its guidance to “Graph Engineering: How to Build AI Agent Systems That Don't Break at Scale” and related material. That attribution is **user-supplied and was not independently verified**. This repository preserves the caveat; it does not claim ownership of, or republish additional text from, the attributed publication. No verified upstream repository commit is asserted for this contribution.

The contribution's notice and source explanation are in [`skills/graph-engineering/`](../skills/graph-engineering/).

### Grill with Docs and Wayfinder

These skills adapt Matt Pocock's MIT-licensed [skills repository](https://github.com/mattpocock/skills/tree/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa), using source revision:

```text
a496f5513d4a4cf889bc48e189e579f4b0bdf6aa
```

The source snapshot was retrieved on 29 October 2026. Grill with Docs originally delegates to the `grilling` and `domain-modeling` skills; this collection includes the working interview method, glossary guidance, and ADR format directly. Wayfinder preserves its destination, map, decision tickets, frontier, fog, human participation, and session boundaries while using a portable decision register.

The adaptations replace host-specific Skill-tool calls, setup commands, mandatory background-agent assumptions, automatic tracker writes, and throwaway branch instructions with explicit procedures and capability-aware outputs. Displaying a map or document in a response is distinguished from saving it through an actual tool. The original source is MIT-licensed; its copyright and permission notices remain in the affected skill folders.

Relevant upstream paths include:

- `skills/engineering/grill-with-docs/`
- `skills/productivity/grilling/`
- `skills/engineering/domain-modeling/`
- `skills/engineering/wayfinder/`
- Supporting research, prototype, and local-tracker conventions named by the individual `SOURCE.md` files.

See [`skills/grill-with-docs/`](../skills/grill-with-docs/) and [`skills/wayfinder/`](../skills/wayfinder/) for the exact included references and notices. This collection is an adaptation, not a claim that its authors endorse every host integration or later change here.

## Contribution and redistribution rules

Keep upstream notices with copied or substantially adapted material. When changing an adaptation, record the relevant source revision and explain the change; do not overwrite the source's attribution with the root project's name. If no reusable upstream license or contribution terms are established, resolve that before importing the material.

External links are citations, not bundled grants for unrelated publications, services, or assets. A reusable workflow also does not grant authority to mutate an external tracker, send communications, spend money, or publish work. Those actions remain governed by the user's actual task and the available tools.

Generated catalogs and ZIPs preserve provenance rather than creating a new upstream claim. Packaging checks, checksums, and isolated installer tests establish structural evidence. They do not establish that every agent has loaded a skill or that a consequential workflow has been run successfully.
