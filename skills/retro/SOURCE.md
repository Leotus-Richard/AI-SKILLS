# Source and adaptation notes

Adapted from the `retro` skill in Matt Pocock's skills repository (https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336), pinned to commit `49dd158d1076134a641b33efb035946536778336`.

- Upstream file: <https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md>
- Upstream SHA-256: `33fbc28568e3146f20fd908b12998bc0ab30aa4f4c87288199a40793efa94696`. It is preserved byte for byte at `references/upstream/ORIGINAL-SKILL.md`, with any upstream resources beside it.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`; the description is kept.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.
- Bundled Matt Pocock's writing-for-agents from <https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/productivity/writing-for-agents> into `references/upstream/related/writing-for-agents/`. Its `SKILL.md` is stored as `writing-for-agents.md`, because nested `SKILL.md` files are not allowed here. Only link targets changed: links to `SKILL.md` now name `writing-for-agents.md`, and a link to a folder now names its `README.md`.
- Bundled pstack's correct skill, which the toolkit renames dry from <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/correct> into `references/upstream/related/dry/`. Its `SKILL.md` is stored as `dry.md`, because nested `SKILL.md` files are not allowed here. Only link targets changed: links to `SKILL.md` now name `dry.md`, and a link to a folder now names its `README.md`.

Bundled files:

  - `related/writing-for-agents/SKILL-MECHANICS.md`: upstream SHA-256 `c768e6307c7c10728c401c213f2c4ba71c542127eeb7ad2956aabd15a0fa0059`
  - `related/writing-for-agents/writing-for-agents.md`: upstream SHA-256 `551adca942227b44192edba88acd4e8db911f0121ce58ad16944ccf6a896a74a`
  - `related/writing-for-agents/agents/openai.yaml`: upstream SHA-256 `eacb24b2a618cfb81dacb0416f4fdd75ddf3a8060f8ddb99aae1b1e301907e4b`
  - `related/dry/dry.md`: upstream SHA-256 `bf482bacc972b3f124a4af8bf9364b4b3e280cb5845e44c326ea4f4565e5c904`

The license, MIT (Copyright (c) 2026 Matt Pocock), is bundled in `LICENSE.txt`.
