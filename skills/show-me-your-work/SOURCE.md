# Source and adaptation notes

Adapted from the `show-me-your-work` skill in pstack in cursor/plugins (https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack), pinned to commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`.

- Upstream file: <https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/show-me-your-work/SKILL.md>
- Upstream SHA-256: `920a8217cbb62f92a2222fb81fc9eab17ecd554a0277e444a95a927195139bd1`. It is preserved byte for byte at `references/upstream/ORIGINAL-SKILL.md`, with the other upstream resources beside it.

Imported on 24 November 2026 from Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). The toolkit wraps the original in a task-scoped hub (`SKILL.md`) and a shared `references/local-execution-contract.md`. The archive does not record who prepared that adaptation.

Changes at import:

- The toolkit's metadata (`profile`, `invocation`, `integration-status`) is replaced with `version`, `author`, and `tags`. The description is kept.
- `LICENSE` is renamed `LICENSE.txt`, as this repository requires.
- The commit handoff now applies only when a `commit-workflow` skill is installed. That skill was written for the toolkit and has no public source, so it is not bundled.
- `work-tracking` was written for the toolkit and has no public source, so it is not bundled; the hub uses it only when it is installed.
- Workflow step 1 now gives the bundled script's actual path, `references/upstream/scripts/log.sh`, as a later line already did.
- Bundled pstack's unslop from <https://github.com/cursor/plugins/tree/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/unslop> into `references/upstream/related/unslop/`. Its `SKILL.md` is stored as `unslop.md`, because nested `SKILL.md` files are not allowed here. Only link targets changed: links to `SKILL.md` now name `unslop.md`, and a link to a folder now names its `README.md`.

Bundled files:

  - `related/unslop/unslop.md`: upstream SHA-256 `ccab208e315ce05e2fab8eeee2f7879f1289b5c6844840b2d307adf31c79144f`

The license, MIT (Copyright (c) 2026 Lauren Tan), is bundled in `LICENSE.txt`.

## Changes in 2.0.0 (24 November 2026)

The toolkit's shared `references/local-execution-contract.md` is removed. It was the same 4.7 KB file in every toolkit skill, and it named skills and a manifest that are not in this library. The limits that govern this skill are now a short list under Scope in `SKILL.md`. Left out as general practice rather than limits: its alias table, its dependency-reading and failure-handling vocabulary, and its reminders to keep output formats and build the smallest correct solution. Its commit rules are not copied here. They belong to the separate `commit-workflow` skill, which this skill uses when it is installed.
