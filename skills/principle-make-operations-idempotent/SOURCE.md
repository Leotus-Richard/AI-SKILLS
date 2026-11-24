# Source and adaptation notes

Adapted from pstack's `principle-make-operations-idempotent` skill in [cursor/plugins](https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-make-operations-idempotent/SKILL.md>
- Upstream SHA-256: `540738217c3da7bf513b9886924ad6a2bc77e58be867f5bd2e1831c74bf2ce70`. The text was checked against it before conversion.

`SKILL.md` is the upstream text with these changes:

- Frontmatter: upstream's `disable-model-invocation: true` is dropped so the principle can trigger on its own description, and `metadata` (`version`, `author`, `tags`) is added. The name and description are upstream's.
- A one-line source note is added at the end.

History:

- 1.0.0 (24 November 2026): imported from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`), which wrapped the original in a task-scoped hub and a shared `references/local-execution-contract.md`, with the upstream text at `references/upstream/ORIGINAL-SKILL.md`. The archive does not record who prepared that adaptation.
- 2.0.0 (24 November 2026): the hub, the contract and the separate original are removed. `SKILL.md` is now the principle itself.

The MIT license (Copyright (c) 2026 Lauren Tan) is bundled in `LICENSE.txt`.
