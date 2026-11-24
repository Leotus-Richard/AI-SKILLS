# Source and adaptation notes

Adapted from pstack's `principle-minimize-reader-load` skill in [cursor/plugins](https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-minimize-reader-load/SKILL.md>
- Upstream SHA-256: `1ea2b7fef2391cae5844c4efdbd59031f775e8a52d06b7495d707229a200dcca`. It is preserved at `references/upstream/ORIGINAL-SKILL.md`.
- At import, links to other pstack skills (`../<skill>/SKILL.md`) were pointed at local copies of those skills, fetched from the pinned commit into `references/upstream/related/`. Only link targets changed. The current `ORIGINAL-SKILL.md` SHA-256 is `1841c441d6aa4ce7cc5054ce4ed6b6319caeb7c9522d9d6ea74f7dbfd5fdf043`. Bundled copies of each upstream skill folder's main file, with its upstream SHA-256:
  - `related/principle-guard-the-context-window.md` ← <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-guard-the-context-window> (`af0b9dd70b43628ce4a59a4d332e9d9ad055084e460f430e7a757495c627e81a`)

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The description is restored from the upstream skill. The toolkit's generic description ("Apply … to a selected relevant task") gave agents little to match on.
- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.

The MIT license (Copyright (c) 2026 Lauren Tan) is bundled in `LICENSE.txt`.
