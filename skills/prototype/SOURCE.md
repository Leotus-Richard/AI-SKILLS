# Source and adaptation notes

Adapted from the `prototype` skill in Matt Pocock's skills repository (https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336), pinned to commit `49dd158d1076134a641b33efb035946536778336`.

- Upstream file: <https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/prototype/SKILL.md>
- Upstream SHA-256: `714de632d116bb73f65cdb5a882db15b9369a6713b9a47c0fad827848f0bfbe3`. It is preserved byte for byte at `references/upstream/ORIGINAL-SKILL.md`, with the other upstream resources beside it.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`. The description is kept.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.
- In `LOGIC.md`, `UI.md`, links to the upstream `SKILL.md` now name the bundled `ORIGINAL-SKILL.md`. Tier 1 reported them as dead links; only link targets changed.
- The commit handoff now applies only when a `commit-workflow` skill is installed. That skill was written for the toolkit and has no public source, so it is not bundled.

The license, MIT (Copyright (c) 2026 Matt Pocock), is bundled in `LICENSE.txt`.
