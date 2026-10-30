# Contributing

Keep each skill focused on a concrete task, usable outside the authoring chat, and explicit about the evidence and tools it needs. Preserve the library's flat layout and existing source notices.

## Local setup

Use Node.js 22.20.0 or newer and run `npm ci` from the repository root. Commit dependency changes through both `package.json` and `package-lock.json`. The Skills CLI is an external pinned dependency; do not add a second installer or copy its implementation into this repository.

Before editing, inspect the working tree and keep unrelated changes intact. Do not install skills globally as part of ordinary validation.

## Add or update a skill

1. Create or edit `skills/<name>/SKILL.md`. Use a stable lowercase hyphenated name, valid YAML frontmatter with `name` and a useful `description`, and a task-sized operating workflow.
2. Keep supporting material inside that skill's directory, normally in `references/`. Use relative links that resolve within the folder. A separately uploaded skill must not depend on another skill being installed.
3. Include an example input, expected result, and meaningful acceptance or diagnostic steps. Distinguish instructions from supplied source content, proposals from changes actually made, and structural checks from observed runtime behavior.
4. Update `SOURCE.md` with the source URLs, revision or version where available, what changed, and any limits on the evidence. Preserve required license and copyright notices. Do not turn a user-supplied attribution into a verified publication claim.
5. Add or update the entry in `registry/skills.json`. Use the existing `workflow` category for this collection. Keep the description in `SKILL.md`; do not maintain a second manually copied description in the registry.
6. Regenerate the catalog and run the checks below. Review generated diffs and packaged contents alongside the source change.

Do not include secrets, personal filesystem paths, generated session history, or links that imply an artifact exists when it does not. Do not preserve host-specific tool names or slash-command conventions as if every target agent provides them. Describe the needed capability and a truthful fallback when it is unavailable.

## Validate the change

```sh
npm run catalog
npm run validate
npm run catalog:check
npm test
npm run build
```

The generated catalog files are checked in; edit their sources and regenerate them instead of editing them by hand. `dist/` is generated and ignored. Check that each Perplexity ZIP has exactly one root `SKILL.md`, contains its own references and notices, and stays inside the current platform limits. The collection ZIP is a transport bundle rather than an uploadable skill.

Tests that exercise the external installer must use temporary projects and isolated user directories, disable telemetry, avoid the contributor's real agent configuration, and clean up only their own temporary files. Test `--copy` when symlinks are unavailable. Listing skills and installing instructions do not prove that an agent loaded them or that hardware-backed behavior works.

When changing code examples, verify signatures against the version they name. Typecheck or exercise meaningful examples when practical, and state which behavioral checks remain unperformed. Do not add tests that only repeat the prose or match incidental wording.

## Documentation and review

Update the installation guide when supported commands or packaging change. Update provenance when adopting a new upstream revision. Explain concrete before/after behavior and relevant validation in the pull request; avoid claiming broad readiness from a narrow passing check.

Use the root Apache-2.0 license for original repository work. Imported material keeps its applicable notices and recorded contribution terms; see [provenance](docs/PROVENANCE.md). Do not remove a notice because the root project uses a different license.

## Releases

The release workflow validates and rebuilds the library from the selected revision. A manual run produces an Actions artifact for inspection. A `v*` tag push additionally creates a GitHub release using that existing tag and uploads the generated assets. Creating a release does not install skills for consumers or publish a native plugin.

Review the catalog, package manifest, checksums, and individual ZIP contents before tagging a release. Do not move a published tag or silently replace release assets to hide a changed source revision; publish a new version when a correction is needed.
