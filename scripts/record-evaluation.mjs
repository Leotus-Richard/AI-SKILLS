#!/usr/bin/env node
// Append a live-evaluation record to registry/skills.json so each skill version
// carries the models that tested it.
// Usage: node scripts/record-evaluation.mjs <record.json> [<record.json> ...]
// A record: { skill, version, date, provider, models: { judge, agent, embedding },
//             tiers: ["2","3"], results: { tier2: "completed", ... }, tier3: { scores }, tools: {...}, runUrl }
// Written by skill-eval.yml; run `npm run catalog` afterwards.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findEvaluationIssues, readSkillVersion } from './versioning.mjs';

const root = resolve(import.meta.dirname, '..');
const KEYS = ['version', 'date', 'provider', 'models', 'tiers', 'results', 'tier3', 'tools', 'runUrl'];

export function addEvaluation(registry, record, currentVersion) {
  const entry = registry.skills.find(skill => skill.name === record.skill);
  if (!entry) throw new Error(`Unknown skill in record: ${record.skill}`);
  const clean = Object.fromEntries(KEYS.filter(key => record[key] !== undefined).map(key => [key, record[key]]));
  const issues = findEvaluationIssues(record.skill, [clean], currentVersion);
  if (issues.length) throw new Error(issues.join('\n'));
  entry.evaluations = [...(entry.evaluations ?? [])];
  if (entry.evaluations.some(existing => existing.runUrl === clean.runUrl && existing.version === clean.version)) {
    return false; // Already recorded.
  }
  entry.evaluations.push(clean);
  entry.evaluations.sort((a, b) => a.date.localeCompare(b.date) || a.version.localeCompare(b.version));
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error('Usage: node scripts/record-evaluation.mjs <record.json> [...]');
    process.exit(2);
  }
  const registryPath = join(root, 'registry', 'skills.json');
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  let added = 0;
  for (const file of files) {
    const record = JSON.parse(readFileSync(file, 'utf8'));
    const skillText = readFileSync(join(root, 'skills', String(record.skill), 'SKILL.md'), 'utf8');
    if (addEvaluation(registry, record, readSkillVersion(skillText))) {
      added += 1;
      console.log(`Recorded ${record.skill} ${record.version}: ${JSON.stringify(record.models)}`);
    }
  }
  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(`${added} new record(s).`);
}
