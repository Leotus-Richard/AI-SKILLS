# Source and adaptation notes

Impeccable 4.0.3 by Paul Bakaus (<https://impeccable.style>), from [pbakaus/impeccable](https://github.com/pbakaus/impeccable/tree/68b1129634a1cdd9a0ba50b27376c71b4b083ae8/.github/skills/impeccable) at tag `skill-v4.0.3`, commit `68b1129634a1cdd9a0ba50b27376c71b4b083ae8`, using the `.github/skills/impeccable/` variant (the GitHub Copilot build, which invokes commands as `/impeccable`). Apache-2.0; the upstream `LICENSE` is bundled as `LICENSE.txt`, and its `NOTICE.md` (third-party notices, including ehmo's platform-design-skills, MIT) is kept as `NOTICE.md`.

The hub (`SKILL.md`), `references/portability.md`, `references/commands.json` and `references/local-execution-contract.md` were written for Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`). That toolkit had taken Impeccable from the copy bundled with the GitHub Copilot desktop app.

Upstream files:

- `references/upstream/ORIGINAL-SKILL.md`: upstream `SKILL.md` (SHA-256 `5d6dd1fc35d1750ac8554aa2c18d9bf1a40e6fe0d90e07d3df4781b793fc0275`). 3 link(s) to playbooks that are not bundled now name the pinned upstream files; current SHA-256 `607b1ce1155de2b588e75b2d808d2fa28a31adf254d9bb7a98279935d47a5dc8`.
- `references/upstream/reference/`: 35 of the 38 upstream playbooks. `live.md`, `hooks.md` and `doctor.md` document live mode, automatic hooks and the CLI doctor, which need the native scripts, so they are not bundled; `commands.json` links them upstream. In `colorize.md`, `init.md`, `layout.md`, `typeset.md`, links to `live.md` now name the pinned upstream file.
- `references/upstream/reference/harden.md`: its "Bad" pluralization example concatenates with `+` instead of a template literal. It teaches the same lesson; SkillSpector's static parser stops at `${...}` and would leave the file uninspected. Upstream SHA-256 `8a1c872773996dfa1c1eb765ac7ed8e8d41f99d4f12f090b4725b694e85eaa62`; current `6db6f86296bb9deb6bdaa035d7865c98bccc6522a7103fb3a28d1fc0c730a469`.
- `references/upstream/reference/critique.md`: five lines changed so that SkillSpector 2.13.4, the version inside SkillEvaluator 1.0.1, can inspect the whole file. Angle-bracket placeholders in three example commands became UPPER_CASE names, and two blockquote lines lost their backticks. The instructions are otherwise unchanged. Upstream SHA-256 `9df18e41b69186fd0d084ef014c3a3d589142062369d888a1689f9e516f8fa44`; current `a430b17ef7ab5e6077057cf31e34ac58365cbe0634ec8f64bb0c543a0a6e3056`.

Other changes at import:

- The upstream files were fetched from GitHub at the pinned tag instead of reusing the toolkit's copy. That copy carried the app's injected header and absolute paths from a local Windows profile, which must not be published.
- Not included: `native-resources.zip` (the complete native snapshot, 88 scripts, with detector, live-mode, hook and helper code that scanners can only partly inspect) and the Codex sub-agent definitions. The hub never runs them, and it reports a capability gap where a playbook names a native script.
- The hub's companion skills (`work-tracking`, `commit-workflow`, `create-verification-skill`) are used only when installed, and its zip and toolkit "no-credit policy" references are removed. `portability.md` and `commands.json` now name the pinned upstream tag.
- This repository starts the skill at 1.0.0; the upstream version is 4.0.3.
