import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { buildRecord, summarizeTier3, writeRecords } from '../scripts/evaluation-records.mjs';
import { tier3Text } from '../scripts/catalog.mjs';
import { findEvaluationIssues } from '../scripts/versioning.mjs';

// One row in the shape `skillevaluator tier3 history --json` printed for the first real run.
const row = (overrides = {}) => ({
  run_id: '20261124_181131', agent: 'opencode', model: 'openai/qwen/qwen3.6-35b-a3b', case_count: 12,
  with_skill_score: 0.9712, without_skill_score: 0.9338, lift_delta: 0.0374, lift_status: 'available', lift_reasons: [],
  coverage: { with_skill: { scored_cases: 12, expected_cases: 12 }, without_skill: { scored_cases: 12, expected_cases: 12 } },
  status: 'succeeded', ...overrides,
});
const incomplete = row({
  with_skill_score: null, lift_delta: null, lift_status: 'unavailable', status: 'failed',
  lift_reasons: ['agent status is failed', 'with_skill: incomplete or unknown case coverage'],
  coverage: { with_skill: { scored_cases: 10, expected_cases: 12 }, without_skill: { scored_cases: 12, expected_cases: 12 } },
});
const activation = { agents: { opencode: { skill_activation: { positive_trials: 8, activated_trials: 1 } } } };
const env = {
  PROVIDER: 'lmstudio', SKILL_EVAL_LLM_MODEL: 'judge-model', LOCAL_AGENT_MODEL: 'agent-model', SKILL_EVAL_EMBEDDING_MODEL: 'embed-model',
  SKILLEVALUATOR_VERSION: '1.0.1', SKILLSPECTOR_REF: 'e2674da339b0bddc6e565d059c0577c6d9cd25da', RUN_URL: 'https://github.com/o/r/actions/runs/7',
};

test('a finished run records both scores, the lift and how often the skill was used', () => {
  assert.deepEqual(summarizeTier3({ rows: [row()] }, activation), {
    agent: 'opencode', cases: 12, scoredWithSkill: 12, scoredWithoutSkill: 12,
    withSkill: 0.9712, withoutSkill: 0.9338, lift: 0.0374, activated: 1, activationTrials: 8,
  });
  assert.equal(summarizeTier3({ rows: [row({ lift_delta: -0.05 })] }).lift, -0.05, 'a skill can make a model worse');
});

test('a run that lost attempts keeps what it measured and claims no lift', () => {
  const summary = summarizeTier3({ rows: [incomplete] }, activation);
  assert.equal(summary.lift, null);
  assert.equal(summary.withSkill, null);
  assert.equal(summary.withoutSkill, 0.9338);
  assert.deepEqual([summary.scoredWithSkill, summary.cases], [10, 12]);
  // A delta that SkillEvaluator did not stand behind is never reported as lift.
  assert.equal(summarizeTier3({ rows: [row({ lift_status: 'unavailable' })] }).lift, null);
  assert.equal(summarizeTier3({ rows: [] }), null);
  assert.equal(summarizeTier3(null), null);
  assert.equal('activated' in summarizeTier3({ rows: [row()] }, { agents: {} }), false, 'no activation data, no claim');
});

test('the latest run in the history is the one recorded', () => {
  assert.equal(summarizeTier3({ rows: [row({ without_skill_score: 0.5 }), row({ without_skill_score: 0.75 })] }).withoutSkill, 0.75);
});

test('a record names the models for the tiers that ran and passes validation', () => {
  const record = buildRecord({ skill: 'demo', version: '1.0.0', statuses: { tier3: 'completed' }, tier3: summarizeTier3({ rows: [row()] }, activation), env, date: '2026-11-24' });
  assert.deepEqual(record.models, { judge: 'judge-model', agent: 'agent-model', embedding: null }, 'no embedding model when Tier 2 did not run');
  assert.deepEqual(record.tiers, ['3']);
  assert.equal(record.tier3.lift, 0.0374);
  assert.equal(record.tools.skillspector, 'e2674da339b0');
  assert.deepEqual(findEvaluationIssues('demo', [record], '1.0.0'), []);

  const tier2Only = buildRecord({ skill: 'demo', version: '1.0.0', statuses: { tier2: 'completed' }, tier3: summarizeTier3({ rows: [row()] }), env, date: '2026-11-24' });
  assert.deepEqual(tier2Only.models, { judge: 'judge-model', agent: null, embedding: 'embed-model' });
  assert.equal('tier3' in tier2Only, false, 'no Tier 3 scores on a record for a run without Tier 3');
});

test('validation rejects scores that cannot be true', () => {
  const base = buildRecord({ skill: 'demo', version: '1.0.0', statuses: { tier3: 'completed' }, tier3: summarizeTier3({ rows: [row()] }), env, date: '2026-11-24' });
  const issues = tier3 => findEvaluationIssues('demo', [{ ...base, tier3: { ...base.tier3, ...tier3 } }], '1.0.0').join('\n');
  assert.match(issues({ withSkill: 1.2 }), /tier3\.withSkill must be between 0 and 1, or null/);
  assert.match(issues({ withSkill: null }), /tier3\.lift needs a score for both sides/);
  assert.match(issues({ lift: 2 }), /tier3\.lift must be between -1 and 1, or null/);
  assert.match(issues({ cases: -1 }), /tier3\.cases must be a count or null/);
  assert.match(issues({ activated: 9, activationTrials: 8 }), /activated must be a count no greater than activationTrials/);
  assert.match(findEvaluationIssues('demo', [{ ...base, tier3: 'good' }], '1.0.0').join('\n'), /tier3 must be an object/);
});

test('the catalog states lift only when the run reported one', () => {
  assert.equal(tier3Text(summarizeTier3({ rows: [row()] }, activation), 'completed'),
    'lift +3.7 points (93.4% without the skill, 97.1% with it); skill activated in 1 of 8 trials');
  assert.equal(tier3Text(summarizeTier3({ rows: [row({ lift_delta: -0.05, with_skill_score: 0.8838 })] }), 'completed'),
    'lift -5.0 points (93.4% without the skill, 88.4% with it)');
  assert.equal(tier3Text(summarizeTier3({ rows: [incomplete] }, activation), 'failed'),
    'no lift reported, because the with-skill run was incomplete (10 of 12 cases scored); 93.4% without the skill; skill activated in 1 of 8 trials');
  assert.equal(tier3Text(null, 'failed'), 'Tier 3 failed, no scores recorded');
  assert.equal(tier3Text(null, undefined), '');
});

test('records are written from the files a run leaves behind', t => {
  const root = mkdtempSync(join(tmpdir(), 'ai-skills-records-'));
  t.after(() => {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    rmSync(root, { recursive: true, force: true });
  });
  const paths = Object.fromEntries(['skills', 'status', 'history', 'tier3', 'out'].map(name => [name, join(root, name)]));
  for (const name of ['demo', 'untested']) {
    mkdirSync(join(paths.skills, name), { recursive: true });
    writeFileSync(join(paths.skills, name, 'SKILL.md'), `---\nname: ${name}\ndescription: Use when testing.\nmetadata:\n  version: "2.1.0"\n---\n\n# ${name}\n`);
  }
  mkdirSync(paths.status);
  mkdirSync(paths.history);
  mkdirSync(join(paths.tier3, 'demo', 'demo', 'latest'), { recursive: true });
  writeFileSync(join(paths.status, 'demo.tier3'), 'failed\n');
  writeFileSync(join(paths.history, 'demo.json'), JSON.stringify({ rows: [incomplete] }));
  writeFileSync(join(paths.tier3, 'demo', 'demo', 'latest', 'result.json'), JSON.stringify(activation));

  assert.deepEqual(writeRecords(paths, env, '2026-11-24'), ['demo'], 'a skill no model-backed tier ran for gets no record');
  const record = JSON.parse(readFileSync(join(paths.out, 'demo.json'), 'utf8'));
  assert.equal(record.version, '2.1.0');
  assert.deepEqual(record.results, { tier3: 'failed' });
  assert.deepEqual(record.tier3, {
    agent: 'opencode', cases: 12, scoredWithSkill: 10, scoredWithoutSkill: 12, withSkill: null, withoutSkill: 0.9338, lift: null, activated: 1, activationTrials: 8,
  });
  assert.deepEqual(findEvaluationIssues('demo', [record], '2.1.0'), []);
});
