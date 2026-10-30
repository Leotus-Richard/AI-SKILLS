# Work-item contracts

Use these fields to make scope and completion assessable. Native field names can differ; place unsupported fields in the description or canonical register. Do not replace required native fields or organization policies.

## Shared contract

- Stable canonical ID, kind, title, intended outcome, scope boundaries, and owner/team when known.
- Canonical parent, if permitted; separate prerequisites with a reason and required result; other relationships only when specified.
- Observable acceptance criteria and a concrete verification method or evidence artifact. Use Given/When/Then where it clarifies behavior; avoid generating ceremonial scenarios for every sentence.
- Existing evidence, uncertainty, and readiness separately from implementation status. A dependency can be planned before its output exists; the dependent is not ready to execute until the required output is available.
- Completion evidence appropriate to the outcome: test result, inspected behavior, deploy/release reference, documentation, or an explicit acceptance decision. A proposed test is not a passing test.

## Epic or Milestone

Record the goal and success measures, scope, included Features, exclusions, and goal mode. A deadline or release target can be additional metadata but does not change containment.

- **Bounded:** define a completion join over required Features and goal-level evidence. An MVP is complete when its required capabilities work together for its intended audience and the goal's criteria hold.
- **Ongoing:** define a recurring outcome/health measure, review cadence, and next checkpoint. Empty or finished current children do not close the goal. Closure requires an explicit decision to end or replace the ongoing goal and supporting evidence.

Epic and Milestone are alternative names at the same canonical level. A native dated milestone may be a release grouping beside the work hierarchy; explain that mapping instead of creating Milestone → Epic → Feature.

## Feature

Describe the customer/consumer, end-to-end capability, interface or access path, boundaries, acceptance criteria, required Stories, and completion evidence.

A Feature is done when its intended audience can consume the capability and its acceptance criteria hold. Review, merged code, isolated unit tests, or all Stories marked Done are insufficient by themselves. For an API, a consumer must be able to access and use the supported contract in the agreed target environment; include documentation and operational/release evidence when required by that delivery context. Do not impose public production launch when the intended consumer is an internal team or the target is a private pilot.

Keep optional/deferred Stories outside the required completion join. If scope changes, record the change rather than silently dropping unfinished work to make the Feature appear done.

## User Story

Describe one observable outcome, its beneficiary, acceptance criteria, boundaries/failure cases, and the Tasks that implement and verify it. The “As a … I want … so that …” form is optional. A technical/enabler Story can establish a prerequisite capability with a named downstream consumer; it still needs a result that can be accepted, rather than a vague department or phase label such as “backend work.”

Split a Story when its outcomes can be independently accepted or it bundles unrelated changes. Do not enforce an arbitrary task count, story-point limit, or one-PR rule unless the team has adopted one.

## Task

State one concrete result, inputs/preconditions, implementation boundary, and how to verify it. Its output must contribute to the parent Story. A Task may be code, design, migration, testing, documentation, or a bounded research result; its verification must match that output. “Investigate exports” needs a question and exit condition before it is a ready Task.

Use small delivery units. A Task is not inherently a PR or a whole iteration, and the skill does not dictate TDD or a particular estimation method.

## Bug

Record the existing expected behavior and its authority, observed behavior, affected component/version/environment, reproduction or diagnostic evidence, impact, severity, priority, and fix/regression verification. When reproducibility is uncertain, define the diagnostic result needed before promising a fix.

New desired behavior is a Feature/Story rather than a Bug solely because it is urgent. Regression, compatibility failure, and contract violation are Bugs when the expected behavior already exists.

Default to an independent root Bug, with no inferred parent, prerequisite, or related-item edges. An affected component, release, or Feature can be described as context without adding a relationship. If the user specifies a relationship, record its kind and direction. If they explicitly request a Story parent, record that exception; another parent needs resolution against the canonical child rules before proceeding.

## Status mapping

Map native states to clear meanings; never infer semantics from the display name alone. Backlog, Ready, In Progress, Review, Done, and Canceled are useful canonical values, not a requirement to replace the team's workflow. Review remains intermediate. Canceled work is not delivered; update the required scope explicitly before treating cancellation as satisfying a completion join. A status transition may be proposed before evidence exists, but do not execute or report completion without the required evidence.
