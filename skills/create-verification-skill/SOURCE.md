# Source and adaptation notes

Adapted from the `create-verification-skill` skill in pstack in cursor/plugins (https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/create-verification-skill/SKILL.md>
- Upstream SHA-256: `d353973547bf8ad8977eca645f4cd4feaed0d32f4b43d1448f906b0a76c4d694`. It is preserved at `references/upstream/ORIGINAL-SKILL.md`, with the other upstream resources beside it. One link target changed: the link to the `references/feature-map-example/` folder now names its `README.md`, because the repository validator accepts links to files only. The current file's SHA-256 is `b5a1f6fdea50a30e868f869c0d09184e901c6a0cd833a12a45ca1296fce81bde`.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`. The description is kept.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.
- Bundled Cursor Team Kit's control-ui from <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/cursor-team-kit/skills/control-ui> into `references/upstream/related/control-ui/`. Its `SKILL.md` is stored as `control-ui.md`, because nested `SKILL.md` files are not allowed here. Only link targets changed: links to `SKILL.md` now name `control-ui.md`, and a link to a folder now names its `README.md`.
- Bundled Cursor Team Kit's control-cli from <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/cursor-team-kit/skills/control-cli> into `references/upstream/related/control-cli/`. Its `SKILL.md` is stored as `control-cli.md`, because nested `SKILL.md` files are not allowed here. Only link targets changed: links to `SKILL.md` now name `control-cli.md`, and a link to a folder now names its `README.md`.
- Bundled pstack's maintain-verification-skill from <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/maintain-verification-skill> into `references/upstream/related/maintain-verification-skill/`. Its `SKILL.md` is stored as `maintain-verification-skill.md`, because nested `SKILL.md` files are not allowed here. Only link targets changed: links to `SKILL.md` now name `maintain-verification-skill.md`, and a link to a folder now names its `README.md`.

Bundled files:

  - `related/control-ui/control-ui.md`: upstream SHA-256 `410cae25bdb1e5d2323b126abc5047b0213be7fdb0195710213fa8de8a751871`
  - `related/control-cli/control-cli.md`: upstream SHA-256 `13ac93e595bbda2000849bdb815d5f2ca03f7c2ca63788c8335f9212b9b422a2`
  - `related/maintain-verification-skill/maintain-verification-skill.md`: upstream SHA-256 `515c0eaa054b3f6be1b1fb06f2c2f173c80fddb58bbcac57576f89c479bc68e8`

The license, MIT (Copyright (c) 2026 Lauren Tan), is bundled in `LICENSE.txt`.
