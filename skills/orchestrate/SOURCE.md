# Source and contribution notes

Written for Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`), where it was labelled version 1.3.0, as a portable adaptation of a `orchestrate` skill bundled with the GitHub Copilot app. The archive does not record who wrote the adaptation.

The repository owner contributed it here under Apache-2.0 (`LICENSE.txt`). The Copilot original, which the toolkit kept at `references/upstream/ORIGINAL-SKILL.md` without a license, is **not redistributed**. Ownership of that original is not established, and its license is unknown.

Changes at import:

- The hub no longer points at the omitted original.
- Companion skills (`work-tracking`, `graph-engineering`, `commit-workflow`, `show-me-your-work`) are used only when installed; the toolkit's `graph-engineering-skill` maps to this library's `graph-engineering`.
- Toolkit metadata is replaced with `version`, `author`, and `tags`; this repository starts the skill at 1.0.0.

Bundled files: `LICENSE.txt`, `SKILL.md`, `assets/handoff.md`, `references/coordination.md`, `references/local-execution-contract.md`.
