# AI-SKILLS

A personal library of portable agent skills for planning, workflow design, and decision documentation.

Skills live in a flat `skills/<name>/` layout. The [catalog](docs/CATALOG.md) groups them by workload and links to their instructions, references, and provenance. The [registry](registry/skills.json) records category and source metadata; descriptions stay in each `SKILL.md`.

## Use a skill

Use the external [Vercel Skills CLI](https://github.com/vercel-labs/skills/tree/v1.7.4) to discover and install this library. Node.js **22.20.0 or newer** is required. The repository pins CLI version `1.7.4` rather than maintaining a separate installer.

```sh
# List available skills without installing
npx --yes skills@1.7.4 add Leotus-Richard/AI-SKILLS --list

# Install one skill into the current project for Codex
npx --yes skills@1.7.4 add Leotus-Richard/AI-SKILLS --skill graph-engineering --agent codex
```

The CLI also supports agents such as `claude-code` and `cursor`. Installation is project-scoped by default; `--global` selects the user scope, and `--copy` uses independent files instead of links. See [installation](docs/INSTALLATION.md) for local checkout commands, updates, Windows considerations, and Perplexity imports.

These are reusable skill files. This repository does not promise native plugin registration, a hosted tool server, or identical tool capabilities across agents. Installing instructions is separate from having the files, tools, account access, and context that a task requires.

## Perplexity Computer

Download a release's individual skill ZIP and upload it through **Plugins → Add custom → Upload plugin or skill**. Each generated ZIP has `SKILL.md` at its archive root. If the older interface is shown, use **Customize → Skills → Create skill → Upload skill**. The current [official upload requirements](https://www.perplexity.ai/help-center/en/articles/13914413-how-to-use-computer-skills) are documented in the installation guide.

The optional collection ZIP is a download bundle: **extract it first**, then upload the individual ZIPs in its `perplexity/` directory. Do not upload the outer collection as one skill. Release assets include a manifest and SHA-256 checksums.

## Work on the library

```sh
npm ci
npm run validate
npm run catalog:check
npm test
npm run build
```

Run `npm run catalog` after changing skill metadata or the registry. It regenerates `generated/catalog.json` and `docs/CATALOG.md`. Build output goes to `dist/`; source skills remain the canonical files.

CI runs validation, catalog checks, tests, and packaging on Linux, macOS, and Windows with Node `22.20.0`. Tests include isolated installer checks; routine validation must not change the contributor's global skills. A manually dispatched release workflow builds downloadable Actions artifacts. A pushed `v*` tag additionally publishes the built files as a GitHub release.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before adding or adapting a skill.

## Sources and licenses

Repository scaffolding and original contributions use [Apache-2.0](LICENSE). Imported and adapted skills retain the notices shipped in their own folders; the root license does not replace them. See [NOTICE](NOTICE), [provenance](docs/PROVENANCE.md), and each skill's `SOURCE.md` and license files.

Graph Engineering retains the user-supplied publication-attribution caveat; this repository does not assert independent verification of that publication.
