# Skill versioning

Each skill has its own [semantic version](https://semver.org/). Everything in `skills/<name>/` ships to users, so any change there needs a new version and a short description of the new expected behavior. CI enforces both.

## Where it lives

| What | Where |
| --- | --- |
| Current version | `metadata.version` in the skill's `SKILL.md` frontmatter, as a quoted `"MAJOR.MINOR.PATCH"` string. This is the field SkillEvaluator's semantic version check reads |
| Version history and expected behavior | `versions` in the skill's entry in `registry/skills.json`, oldest first |
| Models that tested a version | `evaluations` in the same registry entry, added by live evaluation runs |

The [catalog](CATALOG.md) shows each skill's version, what each version is expected to do, and which models last tested it.

## Choosing the bump

A skill's public contract is what users and agents depend on: **when it triggers** (name and description), **what it does and refuses** (its workflow and authorization rules), **what it produces** (output formats, file names, plan schemas), and **what it needs** (prerequisites, bundled scripts and their arguments, exit codes and error codes).

### MAJOR: existing users must adapt

- The skill is renamed, or its description changes so that requests it used to handle no longer trigger it, or it now claims a different domain.
- A capability, mode, section the workflow depends on, reference, asset or script is removed or renamed.
- An output contract changes incompatibly: a plan or document format, required fields, a script's arguments, exit codes or error codes.
- A new required prerequisite, such as a tool, credential or account, or a higher minimum runtime version.
- Safety or authorization behavior changes in either direction, for example acting without asking where it used to ask, or the reverse.

### MINOR: new behavior, nothing existing breaks

- A new capability, mode, provider adapter, example, reference, section or script.
- A new optional input, script option, or output field that existing consumers can ignore.
- The description broadens to cover more requests while still matching the ones it handled before.
- Guidance that changes what the agent does in a case the skill previously left open.

### PATCH: same behavior, better wording

- Clarifications, typo and grammar fixes, fixed links, formatting.
- Metadata changes such as tags or author.
- `SOURCE.md` and license-notice updates.
- Script fixes that restore the documented behavior without changing its interface.

When unsure, choose the higher bump.

**No bump is needed** for changes outside `skills/<name>/`: eval datasets in `evals/`, registry evaluation records, CI, or docs. Re-testing an unchanged skill with another model is also not a version change. It adds an evaluation record instead.

Versions start at `1.0.0`. Never reuse or lower a version.

## The expected-behavior entry

Add an entry for the new version at the end of the skill's `versions` list in `registry/skills.json`:

```json
{
  "version": "1.1.0",
  "date": "2026-12-01",
  "bump": "minor",
  "expectedBehavior": "Also projects the hierarchy onto Asana. Existing Linear, GitHub, Azure DevOps and Jira behavior is unchanged."
}
```

- `bump` is `major`, `minor` or `patch`, and must match the version change; the first entry is `initial`.
- `expectedBehavior` is 20–600 characters, saying what the skill should now do, in terms someone could check. For a major bump, say what existing users must change. For a patch, say that behavior is unchanged.
- Write it before testing, so a Tier 3 run (`skill-eval.yml`) can be read against it.

## What CI checks

- `npm run validate`: every skill has a strict `metadata.version`; every registry `versions` list is ordered, its bump types match its versions, and its last entry is the current version with an expected-behavior description; evaluation records are well formed and don't claim a version newer than the current one.
- **Skill versions** in `validate.yml`, on pull requests: every skill whose files changed has a version greater than at the PR's base, with a matching registry entry. It prints each change and its expected behavior in the job summary. You can run it locally with `node scripts/check-versions.mjs --base origin/main`.

## Models used to test a version

Each run of `skill-eval.yml` writes one record per skill it evaluated: the version tested, provider, judge, agent and embedding models, tiers run and their results, tool versions, and the run link. A `record` job adds them to `registry/skills.json`, regenerates the catalog on a branch, and opens a PR.

GitHub only lets Actions open that PR if **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests** is enabled. If it's off, the job pushes the branch and prints a link to open the PR yourself.

Recording is informational. A version without a record shows as "not yet tested with a model". Scores from different models are not comparable, which is why the record names the models.
