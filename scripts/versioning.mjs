// Semantic versions for skills and the evaluation records that say which
// models tested them. Used by validate.mjs, check-versions.mjs,
// record-evaluation.mjs and the catalog.
//
// A skill's version is `metadata.version` in its SKILL.md frontmatter, a quoted
// strict "MAJOR.MINOR.PATCH" string (the field SkillEvaluator's semantic version
// check reads). Any change to a file under skills/<name>/ ships to users, so it
// needs a strictly greater version:
//   MAJOR  the skill's contract changes: it triggers for different requests,
//          drops a capability, or renames/removes files other skills or users rely on
//   MINOR  new capability, section, example, reference or script, compatible with
//          existing use
//   PATCH  wording, typo, link or metadata fixes that do not change behavior
import { readSkillFrontmatter } from './catalog.mjs';

export const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseSemver(value) {
  const match = typeof value === 'string' ? SEMVER.exec(value) : null;
  return match ? match.slice(1).map(Number) : null;
}

export function compareSemver(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);
  if (!left || !right) throw new Error(`Not a strict semantic version: ${left ? b : a}`);
  for (let i = 0; i < 3; i += 1) if (left[i] !== right[i]) return left[i] < right[i] ? -1 : 1;
  return 0;
}

/** Return metadata.version from SKILL.md text, or null when absent. */
export function readSkillVersion(text, source = 'SKILL.md') {
  const version = readSkillFrontmatter(text, source).metadata?.version;
  return version === undefined ? null : version;
}

/**
 * Compare changed skills against their base versions.
 * @param changed  [{ name, baseText: string|null, headText: string|null }]
 *                 baseText null = new skill; headText null = deleted skill.
 * @returns issues as human-readable strings (empty when every bump is valid).
 */
export function findVersionIssues(changed) {
  const issues = [];
  for (const { name, baseText, headText } of changed) {
    if (headText === null) continue; // Deleted skills need no version.
    const head = readSkillVersion(headText, `skills/${name}/SKILL.md`);
    if (!parseSemver(head)) {
      issues.push(`${name}: metadata.version must be a quoted "MAJOR.MINOR.PATCH" string (found ${JSON.stringify(head)})`);
      continue;
    }
    if (baseText === null) continue; // New skill: any valid version.
    let base;
    try { base = readSkillVersion(baseText, `base skills/${name}/SKILL.md`); }
    catch { base = null; }
    if (!parseSemver(base)) continue; // The base predates versioning; the first label is accepted.
    if (compareSemver(head, base) <= 0) {
      issues.push(`${name}: files changed but metadata.version is ${head}; bump it above ${base} (MAJOR for contract changes, MINOR for additions, PATCH for fixes)`);
    }
  }
  return issues;
}

/** Validate a registry entry's evaluation records against the skill's current version. */
export function findEvaluationIssues(name, evaluations, currentVersion) {
  if (evaluations === undefined) return [];
  if (!Array.isArray(evaluations)) return [`${name}: evaluations must be an array`];
  const issues = [];
  evaluations.forEach((record, index) => {
    const at = `${name}: evaluations[${index}]`;
    if (!record || typeof record !== 'object' || Array.isArray(record)) { issues.push(`${at} must be an object`); return; }
    if (!parseSemver(record.version)) issues.push(`${at}.version must be MAJOR.MINOR.PATCH`);
    else if (parseSemver(currentVersion) && compareSemver(record.version, currentVersion) > 0) {
      issues.push(`${at}.version ${record.version} is newer than the skill's ${currentVersion}`);
    }
    if (typeof record.date !== 'string' || !DATE.test(record.date)) issues.push(`${at}.date must be YYYY-MM-DD`);
    if (typeof record.provider !== 'string' || !record.provider) issues.push(`${at}.provider is required`);
    const models = record.models;
    if (!models || typeof models !== 'object' || Array.isArray(models)) issues.push(`${at}.models is required`);
    else {
      for (const role of ['judge', 'agent', 'embedding']) {
        if (!(role in models) || (models[role] !== null && typeof models[role] !== 'string')) {
          issues.push(`${at}.models.${role} must be a model ID or null`);
        }
      }
    }
    if (!Array.isArray(record.tiers) || !record.tiers.length) issues.push(`${at}.tiers must list the tiers that ran`);
    try { if (new URL(record.runUrl).protocol !== 'https:') throw new Error(); }
    catch { issues.push(`${at}.runUrl must be an https URL`); }
  });
  return issues;
}

/** The newest evaluation record for a version, or null. */
export function latestEvaluation(evaluations, version) {
  const matching = (evaluations ?? []).filter(record => record.version === version);
  return matching.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))[0] ?? null;
}

export const BUMPS = ['initial', 'major', 'minor', 'patch'];
const BEHAVIOR_MIN = 20;
const BEHAVIOR_MAX = 600;

/** The bump that takes `from` to `to`: major, minor or patch (null if not an increase). */
export function bumpKind(from, to) {
  const [a, b] = [parseSemver(from), parseSemver(to)];
  if (!a || !b || compareSemver(from, to) >= 0) return null;
  if (b[0] > a[0]) return 'major';
  if (b[1] > a[1]) return 'minor';
  return 'patch';
}

/**
 * Validate a registry entry's version history: one entry per released version,
 * oldest first, each with a bump type that matches the version change and a
 * short description of the expected behavior. The current version needs one.
 */
export function findVersionHistoryIssues(name, versions, currentVersion) {
  if (!Array.isArray(versions) || !versions.length) {
    return [`${name}: registry needs a versions entry for ${currentVersion ?? 'the current version'} describing the expected behavior`];
  }
  const issues = [];
  versions.forEach((entry, index) => {
    const at = `${name}: versions[${index}]`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) { issues.push(`${at} must be an object`); return; }
    if (!parseSemver(entry.version)) issues.push(`${at}.version must be MAJOR.MINOR.PATCH`);
    if (typeof entry.date !== 'string' || !DATE.test(entry.date)) issues.push(`${at}.date must be YYYY-MM-DD`);
    if (!BUMPS.includes(entry.bump)) issues.push(`${at}.bump must be one of ${BUMPS.join(', ')}`);
    const text = typeof entry.expectedBehavior === 'string' ? entry.expectedBehavior.trim() : '';
    if (text.length < BEHAVIOR_MIN || text.length > BEHAVIOR_MAX) {
      issues.push(`${at}.expectedBehavior must describe the new expected behavior in ${BEHAVIOR_MIN}-${BEHAVIOR_MAX} characters`);
    }
    if (index === 0) {
      if (entry.bump !== 'initial') issues.push(`${at}.bump must be "initial" for the first recorded version`);
      return;
    }
    const previous = versions[index - 1];
    if (!parseSemver(previous?.version) || !parseSemver(entry.version)) return;
    const kind = bumpKind(previous.version, entry.version);
    if (!kind) issues.push(`${at}: ${entry.version} must be greater than the previous entry ${previous.version} (list oldest first)`);
    else if (entry.bump !== kind) issues.push(`${at}: ${previous.version} -> ${entry.version} is a ${kind} bump, but bump says ${entry.bump}`);
  });
  const listed = versions.map(entry => entry?.version);
  if (new Set(listed).size !== listed.length) issues.push(`${name}: versions lists a version more than once`);
  if (parseSemver(currentVersion)) {
    if (!listed.includes(currentVersion)) {
      issues.push(`${name}: add a versions entry for ${currentVersion} to registry/skills.json describing the expected behavior`);
    } else if (listed.at(-1) !== currentVersion) {
      issues.push(`${name}: the last versions entry must be the current version ${currentVersion}`);
    }
  }
  return issues;
}
