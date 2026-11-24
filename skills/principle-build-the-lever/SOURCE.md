# Source and adaptation notes

Adapted from pstack's `principle-build-the-lever` skill in [cursor/plugins](https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-build-the-lever/SKILL.md>
- Upstream SHA-256: `3434b0ad0c640c6f1d7960be7a8986c3bcdc14e26060360dec29903df60074ff`. It is preserved at `references/upstream/ORIGINAL-SKILL.md`.
- At import, links to other pstack skills (`../<skill>/SKILL.md`) were pointed at local copies of those skills, fetched from the pinned commit into `references/upstream/related/`. Only link targets changed. The current `ORIGINAL-SKILL.md` SHA-256 is `495a5dfc9b495ecc7ec3835818a296450b897d67e6c7b9d0e42b662b1b8268ad`. Bundled copies of each upstream skill folder's main file, with its upstream SHA-256:
  - `related/principle-laziness-protocol.md` ← <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-laziness-protocol> (`1be6e7a435f26a75a76eb848b9c3d611b9977d0f5822361753244da25ca3ca45`)
  - `related/principle-encode-lessons-in-structure.md` ← <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-encode-lessons-in-structure> (`228963799189f481827d6f28065f278bc2008ffa37030b1234cbd5814d36b9e9`)
  - `related/principle-prove-it-works.md` ← <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-prove-it-works> (`ec79a15025bac8d33d62011c54f3b612733fd2a024e623b531b3637aa75070e2`)

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The description is restored from the upstream skill. The toolkit's generic description ("Apply … to a selected relevant task") gave agents little to match on.
- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.

The MIT license (Copyright (c) 2026 Lauren Tan) is bundled in `LICENSE.txt`.
