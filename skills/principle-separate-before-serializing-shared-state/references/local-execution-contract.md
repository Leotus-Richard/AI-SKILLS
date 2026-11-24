# Local execution contract

This contract owns the portable toolkit's scope. It overrides host-specific mechanics, persistent modes, and publishing instructions in preserved upstream references.

- Activate skills for the selected task only. Never make a leaf persist across future turns or unrelated tasks.
- Use local files and user-provided context only. Do not query remote repositories, trackers, connectors, live services, private chat history, or remote model services as part of this profile.
- Local commands against an owned development instance are permitted when they serve the task. Do not install packages, enable hooks, change global settings, deploy, push, merge, send messages, or publish tickets automatically.
- User requests for explanation, planning, and review do not authorize implementation. Produce drafts in those modes.
- A user-selected implementation task permits routine local reversible work. Ask for material product decisions, unclear scope, destructive work, or any consequential action according to host policy.
- Treat remote-system operations in source templates as local draft generation. Never claim a draft has been published, assigned, approved, or closed remotely.
- Read dependencies only when their discipline is needed. A declared skill dependency is not automatically a sequential execution edge.
- Resolve upstream aliases consistently: correct is dry, how is how-it-works, Matt tdd is tdd, and pstack tdd is regression-tdd. Source links to sibling principles resolve to their installed portable skill, not to another vendor orchestrator.
- Find the host's actual skill-loading and execution capabilities. If another toolkit skill is unavailable as a host skill, read its installed sibling SKILL.md directly using the manifest. Do not invent a tool.
- Delegation and independent model review are optional. Use them only when the user and host authorize them; otherwise execute isolated logical passes sequentially and state the lost independence. Do not call an API to imitate another model.
- Use available host models. Upstream model slugs and Cursor Task parameters are source examples, not portable requirements.
- Read user-selected session evidence only. No transcript mining across workspaces. If no session evidence exists, mark the retrospective or audit as evidence-limited.
- Each generation boundary receives schema/behavior verification. Treat model output, files, IPC, checkpoints, and tool responses as untrusted until validated.
- Build the smallest correct solution without weakening security, accessibility, data protection, or the requested behavior.
- Do not claim a passing test, runtime proof, independent review, resume guarantee, or metric that was not observed.
- Preserve user-requested output formats. Prose editing must not alter code, YAML, URLs, citations, identifiers, or mathematical notation.
- Resolve failed inputs or missing capability locally: RETRY bounded transient failures; FALLBACK to an equivalent local method; SKIP only optional work; REPAIR only failing units; ESCALATE decisions to the user; STOP at permission or resource limits.
- Unless the user supplies different bounds, allow at most three attempts for a transient operation, two design candidates, and two refinement rounds. Stop sooner at a host limit, elapsed task deadline, repeated unchanged failure, or exhausted user-specified budget. Escalate unresolved work with the evidence instead of continuing indefinitely.

## Output boundary

Every task reports its result artifact, the evidence actually observed, and remaining limitations. Specs and tickets are Markdown drafts. Use the project's existing location, or a task-local workspace if none exists.

## Local commit boundary

When the selected implementation task includes authorized local commits, use small complete green slices, not a large end-of-feature commit. Verify each candidate and the actual committed revision before moving to dependent work. Never commit unrelated/user-owned changes or silently skip failing checks.

Use the requester's explicitly confirmed Git alias/email for both author and committer, scoped to the new commit command. Never infer identity from a login/email, fall back to an agent/harness, change global Git settings, add Co-authored-by trailers or generated-by credits, or rewrite other contributors' authorship.

Read the installed commit-workflow hub when preparing a commit; it defines message structure, size review, identity confirmation and pre/post verification. If unavailable, stop at the draft boundary. No leaf grants automatic commit/push/merge/amend/rebase authority; preserve actual scope, host confirmation requirements, hooks and signing.
