# Installation and updates

This repository distributes standalone skill directories and uploadable archives. It reuses Vercel's external [Skills CLI 1.7.4](https://github.com/vercel-labs/skills/tree/v1.7.4); it does not implement another installer or promise native plugin registration.

## Requirements

- Node.js **22.20.0 or newer** for the pinned CLI and repository tooling.
- An agent supported by the CLI, such as `codex`, `claude-code`, or `cursor`, for coding-agent installation.
- A Perplexity plan with Computer and any required organization permission for Perplexity imports.

Installing a skill makes its instructions and supporting files available. It does not create external accounts, grant credentials, start background agents, or establish that the host can perform every operation described by a workflow. Read the selected skill's `SOURCE.md` and applicable notices.

## Discover from GitHub

Run this in the project where you want to use the skills:

```sh
npx --yes skills@1.7.4 add Leotus-Richard/AI-SKILLS --list
```

`--list` discovers available source skills without installing them. The `--yes` before the package name only suppresses npm's package-download prompt; skill selection remains interactive unless you also supply the CLI's own confirmation options.

The [catalog](CATALOG.md) is the repository's browsing view. Do not confuse source discovery with `skills list`, which lists skills already installed in the current scope.

## Install for an agent

Choose a named skill and target agent explicitly:

```sh
npx --yes skills@1.7.4 add Leotus-Richard/AI-SKILLS --skill graph-engineering --agent codex
```

For another supported agent, substitute `--agent claude-code` or `--agent cursor`. The CLI also accepts more than one target, for example `--agent codex claude-code`. These names select the CLI's supported agent layouts; they do not install those agents or enable an account feature.

Installation is **project-scoped by default**. Add `--global` only when you want the selected skill available across projects in your user installation:

```sh
npx --yes skills@1.7.4 add Leotus-Richard/AI-SKILLS --skill grill-with-docs --agent claude-code --global
```

The CLI normally offers linked installation. Use `--copy` when independent files are preferred or symlink support is unavailable, including some Windows configurations:

```sh
npx --yes skills@1.7.4 add Leotus-Richard/AI-SKILLS --skill wayfinder --agent cursor --copy
```

Copies do not change when you edit the repository checkout; update installed skills deliberately. Avoid `--all` unless you intend to select every skill and every available agent. The external [CLI command reference](https://github.com/vercel-labs/skills/blob/v1.7.4/docs/commands.md#skills-add) defines source formats, flags, authentication, and installation methods.

## Use a local checkout

Clone the repository and install its locked development dependencies:

```sh
git clone https://github.com/Leotus-Richard/AI-SKILLS.git
cd AI-SKILLS
npm ci
npm run skills:list
```

The repository scripts run the pinned local CLI:

```sh
npm run skills:install -- --skill graph-engineering --agent codex --copy
npm run skills:check
npm run skills:update -- graph-engineering --project
```

These commands operate in the checkout's current project scope unless a scope option says otherwise. To install the checkout's skills into a different project, run the CLI from that target project and give the skill directory as a source:

```sh
npx --yes skills@1.7.4 add ../AI-SKILLS/skills --skill graph-engineering --agent codex --copy
```

Adjust the source path to the actual checkout location. Keep canonical source changes under `skills/`; local agent installation directories and this repository's installation lock are ignored.

## Check and update installed skills

From the project where the skills were installed:

```sh
npx --yes skills@1.7.4 list --agent codex
npx --yes skills@1.7.4 check
npx --yes skills@1.7.4 update graph-engineering --project
```

Use `--global` for an intentionally global update. `check` is a read-only availability check; `update` changes installed skill files. Neither command regenerates this repository's catalog or updates its source skills. Review relevant upstream/source changes before relying on a changed workflow.

The GitHub shorthand follows the repository's selected default revision. For a reproducible installation, select a published tag or exact commit through a supported Git URL/tree source and record that source in your project. Do not assume that a moving branch is a release pin.

Vercel documents `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1` to disable telemetry and security-audit requests. Use the appropriate environment-variable syntax for your shell. The [upstream troubleshooting guide](https://github.com/vercel-labs/skills/blob/v1.7.4/docs/troubleshooting.md) documents this behavior.

## Perplexity Computer upload

Use an individual skill ZIP from this repository's GitHub release assets, or build one locally with `npm run build`. Output is `dist/perplexity/<name>.zip`, with `SKILL.md` at the archive root alongside that skill's own references and notices.

The [official Perplexity instructions](https://www.perplexity.ai/help-center/en/articles/13914413-how-to-use-computer-skills), checked 29 October 2026, accept a Markdown file directly or a ZIP containing root `SKILL.md`. The manifest must have YAML `name` and `description`; uploads and extracted ZIP contents are capped at 20 MB, with at most 100 files. A name uses 1–64 lowercase letters, digits, or hyphens, with no leading, trailing, or consecutive hyphens; descriptions are capped at 1,024 characters.

To import:

1. Open **Plugins** in Perplexity Computer.
2. Select **Add custom → Upload plugin or skill**.
3. Choose an individual `<name>.zip`.
4. Open its Installed entry and confirm the name and description.

If Plugins is not shown yet, use **Customize → Skills → Create skill → Upload skill**. Keep the individual archive zipped. Do not rename a PDF or text attachment to `.zip`.

The optional `ai-skills-perplexity-collection.zip` is an outer download bundle. **Extract it first**, then upload the individual ZIPs inside `perplexity/`. The outer archive has no root `SKILL.md` and is not a single importable skill. It also carries the catalog and manifest for browsing. Each individual skill is self-contained and does not require a sibling skill installation.

## Verify release downloads

Release assets include `manifest.json` and `SHA256SUMS`. Checksums use **asset basenames**, so place the downloaded files listed by the checksum file in one directory before checking the complete set:

```sh
# Linux
sha256sum --check SHA256SUMS

# macOS
shasum --algorithm 256 --check SHA256SUMS
```

For a selected file in PowerShell, compute its hash and compare it with that file's line in `SHA256SUMS`:

```powershell
Get-FileHash -LiteralPath '.\wayfinder.zip' -Algorithm SHA256
Get-Content -LiteralPath '.\SHA256SUMS'
```

The source build layout nests individual ZIPs under `dist/perplexity/`, while the checksum names intentionally match flattened release downloads. Do not run a basename-based full check from `dist/` and interpret missing nested files as corrupt downloads. A passing checksum verifies the downloaded bytes, not the workflow's behavior in an agent.

## Packaging and releases

Run `npm run validate`, `npm run catalog:check`, `npm test`, and `npm run build` before distributing packages. `generated/catalog.json` and `docs/CATALOG.md` are generated source artifacts; `dist/` is disposable build output.

A manual release-workflow run produces an Actions artifact for review. A pushed `v*` tag also creates a GitHub release from the existing tag and uploads the built assets. This automation does not install skills for consumers or certify host-specific behavior.
