---
name: commit-workflow
description: "Prepare small, tested Git commits with structured messages, confirmed requester identity and no agent credit or co-author trailers. Use for implementation checkpoints or commit policy; not permission to push, rewrite history or commit someone else's work."
compatibility: "Git. The project's own check commands must be known; this skill does not guess them."
metadata:
  version: "1.0.0"
  author: "Leotus-Richard"
  tags: [engineering-practice]
---

# Commit Workflow

## Scope

Read `references/policy.md` before preparing commits. Commit only within specifically authorized repository/task scope and the host's confirmation policy. This skill adds behavior; it does not grant authority to commit, push, merge, sign, amend, rebase or change Git settings. If the repository's own convention requires an attribution line this skill forbids, stop and ask the user instead of overriding either rule.

## Workflow

1. Read repository policy and inspect existing changes, hooks, signing requirements and test commands. Do not stage unrelated/user-owned work. Read `references/identity.md` before resolving author/committer identity.
2. Plan one independently testable and reversible behavioral slice at a time. Default to a size review above 10 files or 300 added-plus-deleted lines; split unrelated purposes. Document approved exceptions for inseparable mechanical/generated changes. Never commit solely because time passed or a test turned red.
3. Run feature/regression TDD as appropriate. Finish the slice, run focused checks and affected integration/type/lint/build checks, repair bounded failures, and keep dependent work closed until this slice is green. Do not add placeholders to manufacture a runnable intermediate commit.
4. Stage explicit owned paths or reviewed hunks, then inspect the complete staged diff. Copy `assets/message.txt` when drafting a message. Use type(scope): imperative summary, Why, actual Tests and optional canonical Work-Item. No Co-authored-by trailer, agent/harness signature or generated-by credit.
5. Run the project's configured checks on the exact staged tree, with no unstaged tracked changes or untracked files mixed in. For a mixed tree, use a clean worktree you own rather than stashing or removing someone's files. Record each command, its exit status, and the HEAD and staged tree it ran against, outside the working tree. Do not use installation, deployment, remote writes or destructive operations as checks.
6. Before committing, confirm that HEAD and the index have not changed since the checks ran, that the message names the checks that actually passed, and that identity and size are reviewed. Missing identity, oversized unapproved changes, stale evidence, failing checks or a prohibited message block the commit. Obtain any required actual commit approval; never skip hooks or signing.
7. If authorized, execute the reviewed Git commit using confirmed requester author AND committer identity scoped to that command. Do not change global config or apply these identities to imported/cherry-picked contributions. Never push automatically.
8. Verify the actual commit: its parent is the tested HEAD, its tree is the tested staged tree, author and committer are the confirmed requester, and the message follows the rules. Rerun the checks on that revision. Record its SHA and actual results, then move to the next dependent slice. If hooks changed the tree/message or post-commit tests fail, stop and repair through a separately authorized follow-up; never rewrite history automatically.

## Default output

Slice boundaries, staged review, proposed message, confirmed identity or explicit gap, pre/post test evidence and committed SHA only if actually created. Link canonical work IDs when available; several commits may implement one work item, and a commit alone does not prove the item done.

## Failure boundary

Never use the agent/harness identity as a fallback or infer an alias from an email/login. Do not use --no-verify, disable hooks, fake successful tests, silently weaken checks, or commit a red/incomplete slice. Repair at most two rounds, then stop/escalate with evidence. A plan to commit is not a commit.

## Resources and dependencies

Read `references/policy.md` for cadence/message/size rules and `references/identity.md` for identity safety. Use `assets/message.txt` only as a template.

Where a test-driven-development skill or a work-tracking skill is installed, it supplies the observed red/green checks or the canonical work IDs when relevant. These are conditional disciplines, not mandatory stages or blanket publication permission.
