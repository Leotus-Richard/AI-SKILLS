#!/usr/bin/env node
// Fail when a skill changed since a base commit without a metadata.version bump.
// Usage: node scripts/check-versions.mjs --base <git-ref>
// Needs the base commit in the local clone (fetch-depth: 0 in CI).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bumpKind, findVersionIssues, parseSemver, readSkillVersion } from './versioning.mjs';

const root = resolve(import.meta.dirname, '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

function showAtRef(ref, path) {
  try { return git('show', `${ref}:${path}`); }
  catch { return null; } // Not present at that ref.
}

export function changedSkills(base) {
  const mergeBase = git('merge-base', base, 'HEAD').trim();
  const names = new Set(
    git('diff', '--name-only', mergeBase, 'HEAD', '--', 'skills/')
      .split('\n')
      .filter(Boolean)
      .map(path => path.split('/')[1]),
  );
  return [...names].sort().map(name => {
    const path = `skills/${name}/SKILL.md`;
    const local = join(root, path);
    return {
      name,
      baseText: showAtRef(mergeBase, path),
      headText: existsSync(local) ? readFileSync(local, 'utf8') : null,
    };
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = process.argv.indexOf('--base');
  const base = index > 0 ? process.argv[index + 1] : undefined;
  if (!base) {
    console.error('Usage: node scripts/check-versions.mjs --base <git-ref>');
    process.exit(2);
  }
  const changed = changedSkills(base);
  if (!changed.length) {
    console.log('No skill changed; no version bump needed.');
    process.exit(0);
  }
  for (const { name, baseText, headText } of changed) {
    const from = baseText === null ? 'new' : (() => { try { return readSkillVersion(baseText) ?? 'unversioned'; } catch { return 'unreadable'; } })();
    const to = headText === null ? 'deleted' : (() => { try { return readSkillVersion(headText) ?? 'missing'; } catch { return 'unreadable'; } })();
    console.log(`${name}: ${from} -> ${to}`);
  }
  const issues = findVersionIssues(changed);
  const registry = JSON.parse(readFileSync(join(root, 'registry', 'skills.json'), 'utf8'));
  for (const { name, baseText, headText } of changed) {
    if (headText === null) continue;
    let head;
    try { head = readSkillVersion(headText); } catch { continue; }
    if (!parseSemver(head)) continue;
    const entry = registry.skills.find(skill => skill.name === name)?.versions?.find(version => version.version === head);
    if (!entry) {
      issues.push(`${name}: add { "version": "${head}", "date", "bump", "expectedBehavior" } to its versions in registry/skills.json`);
      continue;
    }
    let base = null;
    try { base = baseText === null ? null : readSkillVersion(baseText); } catch { base = null; }
    const kind = parseSemver(base) ? bumpKind(base, head) : null;
    if (kind) console.log(`  ${kind} ${base} -> ${head}: ${entry.expectedBehavior}`);
  }
  if (issues.length) {
    for (const issue of issues) console.error(`::error title=Skill version::${issue}`);
    console.error('Bump rules and the expected-behavior entry are described in docs/VERSIONING.md.');
    process.exit(1);
  }
  console.log('Every changed skill has a valid version bump.');
}
