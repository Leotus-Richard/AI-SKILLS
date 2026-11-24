# Source and adaptation notes

Adapted from the `maintain-verification-skill` skill in pstack in cursor/plugins (https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/maintain-verification-skill/SKILL.md>
- Upstream SHA-256: `515c0eaa054b3f6be1b1fb06f2c2f173c80fddb58bbcac57576f89c479bc68e8`. It is preserved byte for byte at `references/upstream/ORIGINAL-SKILL.md`, with any upstream resources beside it.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`; the description is kept.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.
- The commit handoff now applies only when a `commit-workflow` skill is installed. That skill was written for the toolkit and has no public source, so it is not bundled.

Changes in 2.0.0 (24 November 2026):

- Versions before 2.0.0 bundled a copy of pstack's create-verification-skill under `references/upstream/related/`. That skill is in this library, so the copy is removed. `registry/skills.json` lists `create-verification-skill` under `requires`, the installer adds it with this skill, and the upload ZIP carries it under `required-skills/`.
- Step 1 of the workflow names `create-verification-skill` where it said "the generator".

The license, MIT (Copyright (c) 2026 Lauren Tan), is bundled in `LICENSE.txt`.
