# Source and adaptation notes

Adapted from the `interrogate` skill in pstack in cursor/plugins (https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/interrogate/SKILL.md>
- Upstream SHA-256: `a16dfe179005abc22a4651b82f25b0c8ab953284276efe4e6dc341958fb63647`. It is preserved byte for byte at `references/upstream/ORIGINAL-SKILL.md`, with any upstream resources beside it.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`; the description is kept.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.

The license, MIT (Copyright (c) 2026 Lauren Tan), is bundled in `LICENSE.txt`.

## Changes in 2.0.0 (24 November 2026)

The toolkit's shared `references/local-execution-contract.md` is removed. It was the same 4.7 KB file in every toolkit skill, and it named skills and a manifest that are not in this library. The limits that govern this skill are now a short list under Scope in `SKILL.md`. Left out as general practice rather than limits: its alias table, its dependency-reading and failure-handling vocabulary, and its reminders to keep output formats and build the smallest correct solution. Its commit rules are not copied here. They belong to the separate `commit-workflow` skill.
