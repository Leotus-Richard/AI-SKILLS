import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePlan } from '../skills/agile-work-hierarchy/scripts/validate-plan.mjs';

const helperPath = fileURLToPath(new URL('../skills/agile-work-hierarchy/scripts/validate-plan.mjs', import.meta.url));
const item = (id, kind, parentId = null, extra = {}) => ({
  id, kind, title: `${kind} ${id}`, parentId, dependsOn: [],
  outcome: 'An observable result for the intended consumer.',
  acceptanceCriteria: ['The specified behavior is available in its agreed context.'],
  verification: ['Exercise the behavior and compare it with the expected result.'],
  ...extra,
});
const forest = () => ({
  schemaVersion: 1,
  items: [
    item('e', 'epic', null, { goalMode: 'ongoing', status: 'in-progress' }),
    item('f', 'feature', 'e', { status: 'in-progress' }),
    item('s', 'story', 'f', { status: 'in-progress' }),
    item('t', 'task', 's', { status: 'ready' }),
    item('b', 'bug'),
  ],
});
const get = (plan, id) => plan.items.find(value => value.id === id);
const codes = plan => validatePlan(plan).map(error => error.code);
const done = value => Object.assign(value, { status: 'done', doneEvidence: ['Confirmed acceptance evidence.'] });
const run = (args, input) => spawnSync(process.execPath, [helperPath, ...args], {
  input, encoding: 'utf8', timeout: 10_000, maxBuffer: 1024 * 1024,
});

test('a valid forest keeps bugs independent and does not infer dependencies or mutate it', () => {
  const plan = forest();
  plan.items.push(item('m', 'milestone', null, { goalMode: 'bounded' }));
  plan.items.push(item('mf', 'feature', 'm'));
  const before = JSON.stringify(plan);
  assert.deepEqual(validatePlan(plan), []);
  assert.equal(JSON.stringify(plan), before);
  assert.equal(get(plan, 'b').parentId, null);
  assert.deepEqual(get(plan, 'b').dependsOn, []);
  assert.equal(get(plan, 'e').status, 'in-progress');
});

test('root parent and dependency fields may be omitted without mutating the input', () => {
  const plan = forest();
  delete get(plan, 'e').parentId;
  delete get(plan, 'b').parentId;
  plan.items.push(item('m', 'milestone', null, { goalMode: 'bounded' }));
  delete get(plan, 'm').parentId;
  for (const value of plan.items) delete value.dependsOn;
  const before = JSON.stringify(plan);
  assert.deepEqual(validatePlan(plan), []);
  assert.equal(JSON.stringify(plan), before);
});

test('an empty item collection is not a work plan', () => {
  assert.ok(codes({ schemaVersion: 1, items: [] }).includes('NONEMPTY_ITEMS_REQUIRED'));
});

test('a bug can belong to a story only with a recorded explicit user exception', () => {
  const plan = forest();
  Object.assign(get(plan, 'b'), {
    parentId: 's',
    bugParentException: { requestedBy: 'user', reason: 'The user explicitly requested this placement.' },
  });
  assert.deepEqual(validatePlan(plan), []);
  delete get(plan, 'b').bugParentException;
  assert.ok(codes(plan).includes('BUG_PARENT_EXCEPTION_REQUIRED'));
  get(plan, 'b').bugParentException = { requestedBy: 'assistant', reason: 'Convenient grouping.' };
  assert.ok(codes(plan).includes('BUG_PARENT_EXCEPTION_REQUIRED'));
});

test('a bug exception cannot bypass the feature-only and story-only child rules', () => {
  for (const parentId of ['e', 'f', 't']) {
    const plan = forest();
    Object.assign(get(plan, 'b'), {
      parentId,
      bugParentException: { requestedBy: 'user', reason: 'A recorded request is not a hierarchy rewrite.' },
    });
    assert.ok(codes(plan).includes('BUG_PARENT'), parentId);
  }
});

test('each delivery level requires its immediate canonical parent', () => {
  for (const [id, parentId, code] of [
    ['f', null, 'FEATURE_PARENT'],
    ['s', 'e', 'STORY_PARENT'],
    ['t', 'f', 'TASK_PARENT'],
  ]) {
    const plan = forest();
    get(plan, id).parentId = parentId;
    assert.ok(codes(plan).includes(code), code);
  }
  const nestedGoal = forest();
  get(nestedGoal, 'e').parentId = 'b';
  assert.ok(codes(nestedGoal).includes('GOAL_MUST_BE_ROOT'));
});

test('missing parents and ambiguous IDs do not become valid by being external references', () => {
  const unknown = forest();
  get(unknown, 't').parentId = 'missing';
  assert.ok(codes(unknown).includes('UNKNOWN_PARENT'));
  const externalParent = forest();
  externalParent.externalReferences = [{ id: 'outside', url: 'https://example.com/items/1' }];
  get(externalParent, 't').parentId = 'outside';
  assert.ok(codes(externalParent).includes('EXTERNAL_PARENT_FORBIDDEN'));
  const duplicate = forest();
  duplicate.items.push(item('t', 'bug'));
  duplicate.externalReferences = [{ id: 's', url: 'https://example.com/items/2' }];
  assert.equal(codes(duplicate).filter(code => code === 'DUPLICATE_ID').length, 2);
});

test('explicit dependency and relation stubs are accepted without pretending to traverse the external graph', () => {
  const plan = forest();
  plan.externalReferences = [{ id: 'outside', url: 'https://example.com/items/external' }];
  get(plan, 't').dependsOn = ['outside'];
  get(plan, 'b').relatedTo = ['outside', 'f'];
  assert.deepEqual(validatePlan(plan), []);
  const result = run(['-'], JSON.stringify(plan));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /External graph.*not verified/);
});

test('relations do not create blockers or containment', () => {
  const plan = forest();
  get(plan, 't').relatedTo = ['e'];
  get(plan, 'b').relatedTo = ['s'];
  get(plan, 's').relatedTo = ['b'];
  assert.deepEqual(validatePlan(plan), []);
  assert.equal(get(plan, 'b').parentId, null);
  assert.deepEqual(get(plan, 't').dependsOn, []);
});

test('unknown, self, and duplicate relationship targets are rejected', () => {
  const plan = forest();
  get(plan, 't').dependsOn = ['t', 'unknown', 'b', 'b'];
  get(plan, 'b').relatedTo = ['b', 's', 's'];
  const found = codes(plan);
  assert.ok(found.includes('UNKNOWN_REFERENCE'));
  assert.equal(found.filter(code => code === 'SELF_EDGE').length, 2);
  assert.equal(found.filter(code => code === 'DUPLICATE_EDGE').length, 2);
});

test('containment and dependency cycles are identified without extra combined-cycle noise', () => {
  const containment = forest();
  get(containment, 'e').parentId = 't';
  assert.ok(codes(containment).includes('CONTAINMENT_CYCLE'));
  assert.ok(!codes(containment).includes('COMPLETION_CYCLE'));
  const dependency = forest();
  dependency.items.push(item('t2', 'task', 's', { dependsOn: ['t'] }));
  get(dependency, 't').dependsOn = ['t2'];
  assert.ok(codes(dependency).includes('DEPENDENCY_CYCLE'));
  assert.ok(!codes(dependency).includes('COMPLETION_CYCLE'));
});

test('a task depending on ancestor completion is a deadlock despite two individually acyclic graphs', () => {
  const plan = forest();
  get(plan, 't').dependsOn = ['f'];
  const found = codes(plan);
  assert.ok(found.includes('COMPLETION_CYCLE'));
  assert.ok(!found.includes('CONTAINMENT_CYCLE'));
  assert.ok(!found.includes('DEPENDENCY_CYCLE'));
});

test('cross-branch required-completion deadlocks are detected', () => {
  const plan = forest();
  plan.items.push(item('f2', 'feature', 'e'));
  plan.items.push(item('s2', 'story', 'f2'));
  plan.items.push(item('t2', 'task', 's2', { dependsOn: ['f'] }));
  get(plan, 't').dependsOn = ['f2'];
  assert.ok(codes(plan).includes('COMPLETION_CYCLE'));
});

test('a parent may explicitly depend on a descendant result without manufacturing a reverse edge', () => {
  const plan = forest();
  get(plan, 'f').dependsOn = ['t'];
  assert.deepEqual(validatePlan(plan), []);
});

test('readiness contracts need observable outcome, acceptance, and verification entries', () => {
  for (const [field, value] of [
    ['outcome', '  '], ['acceptanceCriteria', []], ['verification', ['']],
    ['title', null], ['dependsOn', null], ['parentId', undefined],
  ]) {
    const plan = forest();
    get(plan, 't')[field] = value;
    assert.notEqual(validatePlan(plan).length, 0, field);
  }
});

test('Review is not Done and feature Done needs customer-ready declaration plus evidence', () => {
  const reviewed = forest();
  get(reviewed, 'f').status = 'review';
  assert.deepEqual(validatePlan(reviewed), []);
  const plan = forest();
  done(get(plan, 'f'));
  done(get(plan, 's'));
  done(get(plan, 't'));
  assert.ok(codes(plan).includes('FEATURE_NOT_CUSTOMER_READY'));
  get(plan, 'f').customerReady = true;
  assert.deepEqual(validatePlan(plan), []);
  get(plan, 'f').doneEvidence = [];
  assert.ok(codes(plan).includes('NONEMPTY_ARRAY_REQUIRED'));
});

test('a done parent cannot roll up unfinished or canceled children', () => {
  for (const status of ['ready', 'review', 'canceled', undefined]) {
    const plan = forest();
    done(get(plan, 's'));
    get(plan, 't').status = status;
    assert.ok(codes(plan).includes('DONE_PARENT_UNDONE_CHILD'), String(status));
  }
});

test('an ongoing goal is not closed by empty children or completion counts', () => {
  const ongoing = item('goal', 'epic', null, { goalMode: 'ongoing', status: 'in-progress' });
  const plan = { schemaVersion: 1, items: [ongoing] };
  assert.deepEqual(validatePlan(plan), []);
  assert.equal(ongoing.status, 'in-progress');
  done(ongoing);
  assert.ok(codes(plan).includes('ONGOING_GOAL_CLOSURE_REQUIRED'));
  ongoing.closureDecision = 'The user explicitly closed the ongoing objective after evaluating its outcome.';
  assert.deepEqual(validatePlan(plan), []);
});

test('status readiness is not an execution scheduler or a fabricated approval gate', () => {
  const plan = forest();
  get(plan, 'b').status = 'canceled';
  get(plan, 't').dependsOn = ['b'];
  assert.deepEqual(validatePlan(plan), []);
  // The workflow must reconcile the unavailable required result before executing;
  // this helper does not reinterpret statuses or write to the tracker.
});

test('malformed schema and reference declarations return diagnostics instead of throwing', () => {
  for (const value of [null, [], { schemaVersion: 2, items: [] }, { schemaVersion: 1, items: null },
    { schemaVersion: 1, items: [null] }, { schemaVersion: 1, items: [], externalReferences: null }]) {
    assert.notEqual(validatePlan(value).length, 0);
  }
  const plan = forest();
  get(plan, 'e').goalMode = 'automatic';
  get(plan, 't').status = 'approved';
  plan.externalReferences = [{ id: 'outside', url: '/not-absolute' }];
  assert.ok(codes(plan).includes('GOAL_MODE_REQUIRED'));
  assert.ok(codes(plan).includes('INVALID_STATUS'));
  assert.ok(codes(plan).includes('INVALID_EXTERNAL_URL'));
});

test('external evidence references must use absolute HTTP or HTTPS URLs', () => {
  for (const url of ['file:///private/plan.json', 'javascript:alert(1)', 'data:text/plain,evidence', '/relative']) {
    const plan = forest();
    plan.externalReferences = [{ id: 'outside', url }];
    get(plan, 'b').relatedTo = ['outside'];
    assert.ok(codes(plan).includes('INVALID_EXTERNAL_URL'), url);
  }
  for (const url of ['http://example.com/item', 'https://example.com/item']) {
    const plan = forest();
    plan.externalReferences = [{ id: 'outside', url }];
    get(plan, 'b').relatedTo = ['outside'];
    assert.deepEqual(validatePlan(plan), []);
  }
});

test('a long dependency chain does not depend on the JavaScript recursion limit', () => {
  const plan = forest();
  plan.items = plan.items.filter(value => !['t', 'b'].includes(value.id));
  const tasks = Array.from({ length: 12_000 }, (_, index) => item(`unit-${index}`, 'task', 's', {
    dependsOn: index === 0 ? [] : [`unit-${index - 1}`],
  }));
  plan.items.push(...tasks.reverse());
  assert.deepEqual(validatePlan(plan), []);
});

test('CLI separates structural invalidity from parse, I/O, and usage failures', () => {
  const invalid = forest();
  get(invalid, 't').parentId = 'f';
  const structural = run(['-'], JSON.stringify(invalid));
  assert.equal(structural.status, 1);
  assert.match(structural.stderr, /TASK_PARENT/);
  assert.equal(run(['-'], '{ malformed').status, 2);
  const absent = join(tmpdir(), `ai-skills-missing-${randomUUID()}.json`);
  assert.equal(run([absent]).status, 2);
  assert.equal(run([], '').status, 2);
  assert.equal(run(['--help']).status, 0);
});
