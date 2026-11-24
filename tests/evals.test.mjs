import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const evalsRoot = join(root, 'evals');
const datasets = existsSync(evalsRoot)
  ? readdirSync(evalsRoot, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
  : [];

test('eval datasets stay outside packaged skill folders', () => {
  for (const skill of readdirSync(join(root, 'skills'))) {
    assert.equal(existsSync(join(root, 'skills', skill, 'evals')), false, `skills/${skill}/evals would ship in release packages; use evals/${skill}/`);
  }
});

for (const name of datasets) {
  test(`evals/${name} matches a skill and has a well-formed dataset`, () => {
    assert.ok(existsSync(join(root, 'skills', name, 'SKILL.md')), `no skills/${name}/SKILL.md for evals/${name}`);
    const dataset = JSON.parse(readFileSync(join(evalsRoot, name, 'evals.json'), 'utf8'));
    assert.equal(dataset.skill_name, name);
    assert.ok(Array.isArray(dataset.evals) && dataset.evals.length > 0);
    const ids = new Set();
    for (const entry of dataset.evals) {
      assert.match(String(entry.id), /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/);
      assert.ok(!ids.has(entry.id), `duplicate id ${entry.id}`);
      ids.add(entry.id);
      assert.ok(entry.prompt?.trim(), `${entry.id} needs a prompt`);
      assert.ok(entry.expected_output?.trim(), `${entry.id} needs an expected_output`);
    }
  });
}
