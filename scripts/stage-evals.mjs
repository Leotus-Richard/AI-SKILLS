#!/usr/bin/env node
// Stage skills for SkillEvaluator Tier 2/3 runs without shipping eval data.
//
// Eval datasets live in evals/<skill>/ so release packages built from
// skills/<skill>/ stay unchanged. SkillEvaluator expects them inside the skill
// at <skill>/evals/, so this copies each skill into an output directory and
// overlays its datasets there.
//
// Usage: node scripts/stage-evals.mjs [--out .tmp/eval-skills] [--only-with-evals] [skill ...]
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
let out = join(root, '.tmp', 'eval-skills');
let onlyWithEvals = false;
const selected = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') out = resolve(args[++i] ?? '');
  else if (args[i] === '--only-with-evals') onlyWithEvals = true;
  else selected.push(args[i]);
}

const skillsDir = join(root, 'skills');
const evalsDir = join(root, 'evals');
const available = readdirSync(skillsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(join(skillsDir, entry.name, 'SKILL.md')))
  .map(entry => entry.name)
  .sort();

const unknown = selected.filter(name => !available.includes(name));
if (unknown.length) {
  console.error(`Unknown skill(s): ${unknown.join(', ')}`);
  process.exit(2);
}

const names = (selected.length ? selected : available)
  .filter(name => !onlyWithEvals || existsSync(join(evalsDir, name)));

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const name of names) {
  const target = join(out, name);
  cpSync(join(skillsDir, name), target, { recursive: true });
  const source = join(evalsDir, name);
  if (existsSync(source)) cpSync(source, join(target, 'evals'), { recursive: true });
  console.log(`${name}${existsSync(source) ? ' (with evals)' : ''}`);
}
if (!names.length) console.log('No skills matched.');
