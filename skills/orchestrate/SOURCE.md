# Source and contribution notes

Written for Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`), where it was labelled version 1.3.0, as a portable adaptation of a `orchestrate` skill bundled with the GitHub Copilot app. The archive does not record who wrote the adaptation.

The repository owner contributed it here under Apache-2.0 (`LICENSE.txt`). The Copilot original, which the toolkit kept at `references/upstream/ORIGINAL-SKILL.md` without a license, is **not redistributed**. Ownership of that original is not established, and its license is unknown.

Changes at import:

- The hub no longer points at the omitted original.
- Companion skills (`work-tracking`, `graph-engineering`, `commit-workflow`, `show-me-your-work`) are used only when installed; the toolkit's `graph-engineering-skill` maps to this library's `graph-engineering`.
- Toolkit metadata is replaced with `version`, `author`, and `tags`; this repository starts the skill at 1.0.0.

Bundled files: `LICENSE.txt`, `SKILL.md`, `assets/handoff.md`, `references/coordination.md`.

## Changes in 2.0.0 (24 November 2026)

The toolkit's shared `references/local-execution-contract.md` is removed. It was the same 4.7 KB file in every toolkit skill, and it named skills and a manifest that are not in this library. The limits that govern this skill are now a short list under Scope in `SKILL.md`. Left out as general practice rather than limits: its alias table, its dependency-reading and failure-handling vocabulary, and its reminders to keep output formats and build the smallest correct solution. Its commit rules are not copied here. They belong to the separate `commit-workflow` skill, which this skill uses when it is installed.
