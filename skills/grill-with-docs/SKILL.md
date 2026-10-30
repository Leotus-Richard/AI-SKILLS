---
name: "grill-with-docs"
description: "Interview the user about a plan, design, or decision in dependency-aware rounds with recommendations, while maintaining a domain glossary and qualifying architecture decision records. Use when asked to grill a plan, stress-test a design, or clarify and document a domain model in one session."
---

# Grill with Docs

Adapted from Matt Pocock's `grill-with-docs`, `grilling`, and `domain-modeling` skills, including their glossary and ADR formats. This skill contains the complete interview method and document formats directly; no external skill installation or Skill tool invocation is required.

## Purpose and scope

Use a structured interview to turn a fuzzy plan, design, or decision into a shared understanding, while capturing agreed vocabulary and qualifying architectural decisions as they emerge. Use this for a change that can be settled in one working session. Use Wayfinder for a larger effort with unresolved decisions across sessions.

This is a planning and documentation method. An interview does not itself authorize implementation or changes to external systems.

## Start from available evidence

Read the plan, relevant uploaded documents, existing glossary, and accessible code before asking questions. Distinguish what the implementation demonstrates from what someone wants it to do. If code contradicts a stated rule, show the discrepancy and ask which behavior is intended.

Look up factual questions using accessible primary sources. Cite what supports a finding and say when the needed repository, document, or tool is unavailable. Ask the user for preferences, decisions, private context, or inaccessible facts; do not ask them to repeat facts already available in the supplied material.

## Interview in dependency-aware rounds

Represent the discussion as a design tree: decisions branch into the decisions that depend on them. The frontier is the set of questions whose prerequisites are already settled.

1. Identify the current frontier. Ask its independent questions in one numbered round, giving a recommended answer for each.
2. Word each question so that a plain "yes" accepts the recommendation. Make alternatives and trade-offs clear.
3. Wait for the user's answers. Never supply the human's side of the exchange or treat an unanswered question as acceptance.
4. Apply the answers, capture resolved terms and qualifying decisions, and recompute the frontier.
5. Ask downstream questions in a later round once their prerequisites are settled. If research is pending, continue with unrelated questions where possible.

Round format:

```text
Q1 - <short title>
<The question, its context, and relevant choices.>
Recommended answer: <a concrete proposal and its reason.>

Q2 - <short title>
<An independent question whose prerequisites are settled.>
Recommended answer: <a concrete proposal and its reason.>

Wait for the user's answers before starting the next round.
```

The interview is complete when the frontier is empty, the relevant branches have been explored, and no material assumption is hidden. Present the resulting understanding for the user's confirmation before moving from planning to implementation.

## Sharpen the domain model throughout

Challenge a term immediately when it conflicts with the existing glossary. Explain the two meanings and resolve the distinction with the user. Replace vague or overloaded language with precise canonical terms: for example, distinguish Customer from User when "account" could mean either.

Probe relationships with concrete edge cases. If an order can be partly cancelled, ask what happens to its invoice, shipment, and remaining items. Check accessible code against these statements and surface differences as evidence, without treating existing code as an automatic product decision.

As soon as a term is agreed, update the working glossary artifact and show the changed entry. When the user has requested documentation and the environment supports writing files or artifacts, save the updates using those available tools and report the real artifact location. Otherwise, show the updated glossary entry in the response. Do not postpone all documentation until the end. Keep a complete current copy available for the user to save or export; do not claim that displaying text updated a repository file.

## Glossary format

Use one glossary for a single domain context. For a project with several contexts, preserve its existing context map and separate glossaries; if the relevant context is unclear, resolve it before assigning a term. Suggested repository names are `GLOSSARY.md` and, when needed, `GLOSSARY-MAP.md`; these are proposed save locations unless an actual write is performed through an authorized tool.

```markdown
# Ordering

Receives and tracks customer orders.

## Language

**Order**:
A customer's agreed request for a specified set of goods.
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

Choose one canonical term for each concept and list rejected synonyms under `_Avoid_`. Define what the concept is in one or two sentences. Include vocabulary specific to the project's context; leave out general programming concepts. Group related terms under subheadings when helpful.

Keep implementation details, specifications, scratch notes, and implementation decisions out of the glossary. An agreed database, timeout, or migration strategy is not a glossary entry merely because it was discussed in the same session.

For several contexts, a context map can use this structure:

```markdown
# Glossary Map

## Contexts

- Ordering: receives and tracks customer orders.
- Billing: generates invoices and processes payments.
- Fulfillment: manages warehouse picking and shipping.

## Relationships

- Ordering -> Fulfillment: OrderPlaced events start picking.
- Fulfillment -> Billing: ShipmentDispatched starts invoicing.
- Ordering <-> Billing: shared meanings for CustomerId and Money.
```

Replace these examples with actual domain relationships and links to saved glossaries when those files exist. Create or propose a glossary only when a term has actually been resolved.

## Architecture decision records

Offer an ADR only when all three conditions are true:

1. The decision is hard to reverse: changing it later has a meaningful cost.
2. It is surprising without context: a future reader would ask why this choice was made.
3. It follows a real trade-off: genuine alternatives existed, and specific reasons determined the choice.

If any condition is absent, skip the ADR. A useful session may produce no ADRs. A qualifying record may be only a short title and one paragraph:

```markdown
# <Short title of the decision>

<One to three sentences explaining the context, what was decided,
and why that choice was made.>
```

Use optional Status, Considered Options, or Consequences sections only when they add useful information. Status can be proposed, accepted, deprecated, or superseded by a named ADR. Do not label a proposal accepted until the user has made the decision.

When saving to a repository, the source convention is `docs/adr/0001-slug.md`, increasing the highest existing number by one. Respect an existing project convention; do not guess the next number if the records are inaccessible. Create or propose the directory only when the first record is needed.

Candidates include architectural shape, integration between contexts, technology choices with substantial lock-in, ownership boundaries, deliberate departures from the obvious approach, constraints invisible in code, and non-obvious reasons for rejecting alternatives. Each candidate still needs all three conditions above.

## What to return

During the interview, return the current question round and any newly resolved glossary entries or ADR drafts. At completion, return the current glossary, qualifying ADRs, and a short account of the shared understanding with unresolved issues identified.

The glossary and ADRs are not a full specification. Other answers otherwise remain in the conversation. If the next task needs an enduring specification, explicitly carry the agreed requirements into a separate handoff; preserve exact numbers, ordering guarantees, exclusions, and constraints rather than assuming they appear in the glossary.

For each artifact, distinguish text prepared for saving from a file actually created or updated. Where no repository write tool is available, provide clearly titled copyable document blocks or downloadable files supported by the current environment.


## Example

User request: "Grill this design and document our terminology and architectural decisions." Read the supplied design, ask the current independent decision questions with recommendations, wait for answers, and capture glossary changes and qualifying ADRs during the exchange.
