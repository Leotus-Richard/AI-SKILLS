# Source and adaptation notes

Adapted from pstack's `principle-explain-the-number` skill in [cursor/plugins](https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-explain-the-number/SKILL.md>
- Upstream SHA-256: `cd5a25f9e7cf023627ccb470dc5faa97542f29b4319496a32b839a8e1e988047`. It is preserved at `references/upstream/ORIGINAL-SKILL.md`.
- At import, links to other pstack skills (`../<skill>/SKILL.md`) were pointed at local copies of those skills, fetched from the pinned commit into `references/upstream/related/`. Only link targets changed. The current `ORIGINAL-SKILL.md` SHA-256 is `c24b18594db10916f4e8d767853d2c0fc0ace36a8f58becff8d37923f22eb509`. Bundled copies of each upstream skill folder's main file, with its upstream SHA-256:
  - `related/benchmark-checklist.md` ← <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/benchmark-checklist> (`ba109e96c8f6c1c391baccf19e5d11e14370df7b3f2605e1572cd565a6c0fca0`)
  - `related/principle-prove-it-works.md` ← <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-prove-it-works> (`ec79a15025bac8d33d62011c54f3b612733fd2a024e623b531b3637aa75070e2`)

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The description is restored from the upstream skill. The toolkit's generic description ("Apply … to a selected relevant task") gave agents little to match on.
- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.

The MIT license (Copyright (c) 2026 Lauren Tan) is bundled in `LICENSE.txt`.
