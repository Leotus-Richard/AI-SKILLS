import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bumpKind, compareSemver, findEvaluationIssues, findVersionHistoryIssues, findVersionIssues, parseSemver,
} from '../scripts/versioning.mjs';
import { addEvaluation } from '../scripts/record-evaluation.mjs';

const skill = version => `---\nname: demo\ndescription: Use when testing.\n${version ? `metadata:\n  version: "${version}"\n` : ''}---\n\n# Demo\n`;
const entry = (version, bump, expectedBehavior = 'Behaves as described for this version.') => ({ version, date: '2026-11-24', bump, expectedBehavior });
const record = (overrides = {}) => ({
  skill: 'demo', version: '1.0.0', date: '2026-11-24', provider: 'lmstudio',
  models: { judge: 'judge-model', agent: 'agent-model', embedding: null },
  tiers: ['3'], results: { tier3: 'completed' }, runUrl: 'https://github.com/o/r/actions/runs/1', ...overrides,
});

test('semantic versions compare numerically and reject loose forms', () => {
  assert.deepEqual(parseSemver('1.10.0'), [1, 10, 0]);
  for (const bad of ['1.0', 'v1.0.0', '01.0.0', '1.0.0-beta', '1.0.0+build', 1]) assert.equal(parseSemver(bad), null, String(bad));
  assert.equal(compareSemver('1.10.0', '1.9.9'), 1);
  assert.equal(compareSemver('2.0.0', '2.0.0'), 0);
  assert.deepEqual(['1.0.0>2.0.0', '1.2.3>1.3.0', '1.2.3>1.2.4'].map(p => bumpKind(...p.split('>'))), ['major', 'minor', 'patch']);
  assert.equal(bumpKind('1.2.3', '1.2.3'), null);
});

test('a changed skill needs a strictly greater version', () => {
  assert.deepEqual(findVersionIssues([{ name: 'demo', baseText: skill('1.0.0'), headText: skill('1.0.1') }]), []);
  assert.match(findVersionIssues([{ name: 'demo', baseText: skill('1.0.0'), headText: skill('1.0.0') }])[0], /bump it above 1.0.0/);
  assert.match(findVersionIssues([{ name: 'demo', baseText: skill('1.2.0'), headText: skill('1.1.9') }])[0], /bump it above 1.2.0/);
  assert.match(findVersionIssues([{ name: 'demo', baseText: null, headText: skill(null) }])[0], /must be a quoted/);
  assert.deepEqual(findVersionIssues([{ name: 'demo', baseText: skill(null), headText: skill('1.0.0') }]), [], 'first label accepted');
  assert.deepEqual(findVersionIssues([{ name: 'demo', baseText: skill('1.0.0'), headText: null }]), [], 'deletion needs no version');
});

test('version history needs an expected-behavior entry for the current version with a matching bump', () => {
  const history = [entry('1.0.0', 'initial'), entry('1.1.0', 'minor'), entry('2.0.0', 'major'), entry('2.0.1', 'patch')];
  assert.deepEqual(findVersionHistoryIssues('demo', history, '2.0.1'), []);
  assert.match(findVersionHistoryIssues('demo', history.slice(0, 3), '2.0.1').join('\n'), /add a versions entry for 2.0.1/);
  assert.match(findVersionHistoryIssues('demo', [entry('1.0.0', 'initial'), entry('1.0.1', 'minor')], '1.0.1').join('\n'), /patch bump, but bump says minor/);
  assert.match(findVersionHistoryIssues('demo', [entry('1.0.0', 'major')], '1.0.0').join('\n'), /"initial"/);
  assert.match(findVersionHistoryIssues('demo', [entry('1.0.0', 'initial', 'too short')], '1.0.0').join('\n'), /expectedBehavior/);
  assert.match(findVersionHistoryIssues('demo', [entry('1.1.0', 'initial'), entry('1.0.0', 'patch')], '1.0.0').join('\n'), /oldest first/);
  assert.match(findVersionHistoryIssues('demo', undefined, '1.0.0')[0], /needs a versions entry/);
});

test('evaluation records name the models and cannot claim a future version', () => {
  assert.deepEqual(findEvaluationIssues('demo', [record()], '1.0.0'), []);
  assert.match(findEvaluationIssues('demo', [record({ version: '1.1.0' })], '1.0.0').join('\n'), /newer than/);
  assert.match(findEvaluationIssues('demo', [record({ models: { judge: 'j' } })], '1.0.0').join('\n'), /models.agent/);
  assert.match(findEvaluationIssues('demo', [record({ runUrl: 'http://x' })], '1.0.0').join('\n'), /https/);
});

test('recording an evaluation appends once and keeps records ordered', () => {
  const registry = { skills: [{ name: 'demo', evaluations: [record({ date: '2026-12-01', runUrl: 'https://github.com/o/r/actions/runs/2' })] }] };
  assert.equal(addEvaluation(registry, record(), '1.0.0'), true);
  assert.equal(addEvaluation(registry, record(), '1.0.0'), false, 'same run is not recorded twice');
  assert.deepEqual(registry.skills[0].evaluations.map(r => r.date), ['2026-11-24', '2026-12-01']);
  assert.equal('skill' in registry.skills[0].evaluations[0], false);
  assert.throws(() => addEvaluation(registry, record({ skill: 'other' }), '1.0.0'), /Unknown skill/);
  assert.throws(() => addEvaluation(registry, record({ version: '9.0.0' }), '1.0.0'), /newer than/);
});
