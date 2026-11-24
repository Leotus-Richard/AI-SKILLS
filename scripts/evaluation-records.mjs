#!/usr/bin/env node
// Turn one live evaluation run into a record per skill: the version tested, the
// models that ran it, and what Tier 3 measured. skill-eval.yml runs this, and its
// record job adds the records to registry/skills.json.
//
// Usage: node scripts/evaluation-records.mjs --skills DIR --status DIR --history DIR --tier3 DIR --out DIR
//   --skills   staged skills (one folder per skill, with SKILL.md)
//   --status   <skill>.tier2 and <skill>.tier3 files holding completed, failed or invalid-dataset
//   --history  <skill>.json from `skillevaluator tier3 history --json`
//   --tier3    Tier 3 results root, holding <skill>/<skill>/latest/result.json
//   --out      where to write <skill>.json
// The models and tool versions come from the environment the workflow sets.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSkillVersion } from './versioning.mjs';

const score = value => (typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 10000) / 10000 : null);
const count = value => (Number.isInteger(value) && value >= 0 ? value : null);

// What the Tier 3 run measured, from SkillEvaluator's own history output. `result`
// is the run's result.json, read only for how often the agent activated the skill.
// Lift is reported only when SkillEvaluator itself reports one: a run that lost
// attempts has scores for one side at most, and no lift.
export function summarizeTier3(history, result = null) {
  const rows = Array.isArray(history?.rows) ? history.rows : [];
  const row = rows.at(-1);
  if (!row) return null;
  const summary = {
    agent: typeof row.agent === 'string' ? row.agent : null,
    cases: count(row.case_count),
    scoredWithSkill: count(row.coverage?.with_skill?.scored_cases),
    scoredWithoutSkill: count(row.coverage?.without_skill?.scored_cases),
    withSkill: score(row.with_skill_score),
    withoutSkill: score(row.without_skill_score),
    lift: row.lift_status === 'available' ? score(row.lift_delta) : null,
  };
  const activation = result?.agents?.[row.agent]?.skill_activation;
  const [activated, trials] = [count(activation?.activated_trials), count(activation?.positive_trials)];
  if (activated !== null && trials !== null && activated <= trials) Object.assign(summary, { activated, activationTrials: trials });
  return summary;
}

export function buildRecord({ skill, version, statuses, tier3 = null, env, date }) {
  const local = env.PROVIDER === 'lmstudio';
  const record = {
    skill,
    version,
    date,
    provider: env.PROVIDER,
    models: {
      judge: env.SKILL_EVAL_LLM_MODEL || 'provider-default',
      agent: statuses.tier3 ? (local ? env.LOCAL_AGENT_MODEL : (env.AGENT_DEFAULT || 'provider-default')) : null,
      embedding: statuses.tier2 ? (env.SKILL_EVAL_EMBEDDING_MODEL || 'provider-default') : null,
    },
    tiers: Object.keys(statuses).map(tier => tier.replace('tier', '')),
    results: statuses,
  };
  if (statuses.tier3 && tier3) record.tier3 = tier3;
  record.tools = { skillevaluator: env.SKILLEVALUATOR_VERSION, skillspector: String(env.SKILLSPECTOR_REF ?? '').slice(0, 12) };
  record.runUrl = env.RUN_URL;
  return record;
}

function readJson(file) {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; }
}

export function writeRecords({ skills, status, history, tier3, out }, env, date = new Date().toISOString().slice(0, 10)) {
  mkdirSync(out, { recursive: true });
  const written = [];
  for (const skill of existsSync(skills) ? readdirSync(skills).sort() : []) {
    const statuses = {};
    for (const tier of ['tier2', 'tier3']) {
      const file = join(status, `${skill}.${tier}`);
      if (existsSync(file)) statuses[tier] = readFileSync(file, 'utf8').trim();
    }
    if (!Object.keys(statuses).length) continue; // No model-backed tier ran for this skill.
    const record = buildRecord({
      skill,
      version: readSkillVersion(readFileSync(join(skills, skill, 'SKILL.md'), 'utf8')),
      statuses,
      tier3: summarizeTier3(readJson(join(history, `${skill}.json`)), readJson(join(tier3, skill, skill, 'latest', 'result.json'))),
      env,
      date,
    });
    writeFileSync(join(out, `${skill}.json`), `${JSON.stringify(record, null, 2)}\n`);
    written.push(skill);
  }
  return written;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i]?.replace(/^--/, '');
      if (!['skills', 'status', 'history', 'tier3', 'out'].includes(key) || args[i + 1] === undefined) throw new Error(`Bad argument near ${args[i] ?? '(end)'}`);
      options[key] = args[i + 1];
    }
    for (const key of ['skills', 'status', 'history', 'tier3', 'out']) if (!options[key]) throw new Error(`--${key} is required`);
    const written = writeRecords(options, process.env);
    console.log(`${written.length} evaluation record(s).`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
