# Source and adaptation notes

Adapted from the `domain-modeling` skill in Matt Pocock's skills repository (https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336), pinned to commit `49dd158d1076134a641b33efb035946536778336`.

- Upstream file: <https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/domain-modeling/SKILL.md>
- Upstream SHA-256: `7b925d7b1e341a2eeae33ad68a8a8c0ab889a38ddd22a7598e4c240e5a7556a3`. It is preserved byte for byte at `references/upstream/ORIGINAL-SKILL.md`, with the other upstream resources beside it.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.
- The description is restored from upstream, with a pointer to `grill-with-docs`, so agents can tell the two apart.

The license, MIT (Copyright (c) 2026 Matt Pocock), is bundled in `LICENSE.txt`.

## Changes in 2.0.0 (24 November 2026)

The toolkit's shared `references/local-execution-contract.md` is removed. It was the same 4.7 KB file in every toolkit skill, and it named skills and a manifest that are not in this library. The limits that govern this skill are now a short list under Scope in `SKILL.md`. Left out as general practice rather than limits: its alias table, its dependency-reading and failure-handling vocabulary, and its reminders to keep output formats and build the smallest correct solution. Its commit rules are not copied here. They belong to the separate `commit-workflow` skill.
