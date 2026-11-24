# Source and adaptation notes

Adapted from the `maintain-verification-skill` skill in pstack in cursor/plugins (https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/maintain-verification-skill/SKILL.md>
- Upstream SHA-256: `515c0eaa054b3f6be1b1fb06f2c2f173c80fddb58bbcac57576f89c479bc68e8`. It is preserved byte for byte at `references/upstream/ORIGINAL-SKILL.md`, with any upstream resources beside it.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`; the description is kept.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.
- The commit handoff now applies only when a `commit-workflow` skill is installed. That skill was written for the toolkit and has no public source, so it is not bundled.
- Bundled pstack's create-verification-skill from <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/create-verification-skill> into `references/upstream/related/create-verification-skill/`. Its `SKILL.md` is stored as `create-verification-skill.md`, because nested `SKILL.md` files are not allowed here. Only link targets changed: links to `SKILL.md` now name `create-verification-skill.md`, and a link to a folder now names its `README.md`.

Bundled files:

  - `related/create-verification-skill/create-verification-skill.md`: upstream SHA-256 `d353973547bf8ad8977eca645f4cd4feaed0d32f4b43d1448f906b0a76c4d694`
  - `related/create-verification-skill/references/feature-map-example/README.md`: upstream SHA-256 `cb7bd782cf89968a4ba3d58a5151db837430db92d19a6f52a906973b77b516ba`
  - `related/create-verification-skill/references/feature-map-example/create-note.md`: upstream SHA-256 `644a44c74f35d38c2feb7cd05a0121fdebbb623e8dc376c185b565a581d1ccf7`
  - `related/create-verification-skill/references/feature-map-example/search.md`: upstream SHA-256 `6e87b9e7f2791a7776ba1bb83f371cd285c306c67f19d245cc4dd6ca3015c823`

The license, MIT (Copyright (c) 2026 Lauren Tan), is bundled in `LICENSE.txt`.
