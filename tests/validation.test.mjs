import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { validateRepository } from '../scripts/validate.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ai-skills-validate-'));
  t.after(() => {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    rmSync(root, { recursive: true, force: true });
  });
  const skill = join(root, 'skills', 'sample');
  mkdirSync(join(skill, 'references'), { recursive: true });
  mkdirSync(join(root, 'registry'));
  writeFileSync(join(skill, 'SKILL.md'), '---\nname: sample\ndescription: Use this fixture for validation.\n---\n\nRead [guide](references/guide.md).\n');
  writeFileSync(join(skill, 'references', 'guide.md'), '# Guide\n');
  writeFileSync(join(skill, 'LICENSE.txt'), 'Fixture license\n');
  writeFileSync(join(skill, 'SOURCE.md'), 'Fixture provenance\n');
  const registry = { schemaVersion: 1, skills: [{ name: 'sample', category: 'workflow', license: 'Apache-2.0', provenance: { kind: 'original', urls: [] } }] };
  writeFileSync(join(root, 'registry', 'skills.json'), JSON.stringify(registry));
  return { root, skill, registry };
}

test('validates a complete self-contained skill', t => {
  const { root } = fixture(t);
  const result = validateRepository(root);
  assert.equal(result.skills.length, 1);
  assert.equal(result.skills[0].localLinks, 1);
});

test('rejects a missing bundled reference', t => {
  const { root, skill } = fixture(t);
  rmSync(join(skill, 'references', 'guide.md'));
  assert.throws(() => validateRepository(root), /local reference does not name a bundled file/);
});

test('ignores empty work folders that Git cannot track', t => {
  const { root } = fixture(t);
  mkdirSync(join(root, 'skills', 'empty', 'references'), { recursive: true });
  assert.equal(validateRepository(root).skills.length, 1);
});

test('does not silently ignore a nonempty folder without an entrypoint', t => {
  const { root } = fixture(t);
  mkdirSync(join(root, 'skills', 'orphan'));
  writeFileSync(join(root, 'skills', 'orphan', 'notes.md'), 'not an empty folder');
  assert.throws(() => validateRepository(root), /missing regular root SKILL.md/);
});

test('rejects references that escape the upload package', t => {
  const { root, skill } = fixture(t);
  writeFileSync(join(root, 'outside.md'), 'outside');
  writeFileSync(join(skill, 'SOURCE.md'), '[escape](../../outside.md)');
  assert.throws(() => validateRepository(root), /reference escapes/);
});

test('ignores example links inside code fences', t => {
  const { root, skill } = fixture(t);
  writeFileSync(join(skill, 'SOURCE.md'), '```markdown\n[example](absent.md)\n```\n');
  assert.equal(validateRepository(root).skills.length, 1);
});

test('rejects duplicate YAML keys instead of accepting the last value', t => {
  const { root, skill } = fixture(t);
  writeFileSync(join(skill, 'SKILL.md'), '---\nname: sample\nname: hidden\ndescription: Example\n---\n');
  assert.throws(() => validateRepository(root), /invalid YAML/);
});

test('keeps frontmatter names aligned with discoverable folder names', t => {
  const { root, skill } = fixture(t);
  writeFileSync(join(skill, 'SKILL.md'), '---\nname: other\ndescription: Example\n---\n');
  assert.throws(() => validateRepository(root), /folder and frontmatter name/);
});

test('rejects registry drift in either direction', t => {
  const { root, registry } = fixture(t);
  registry.skills[0].name = 'absent';
  writeFileSync(join(root, 'registry', 'skills.json'), JSON.stringify(registry));
  assert.throws(() => validateRepository(root), /missing registry entry[\s\S]*registry points to a missing skill/);
});

test('requires licenses and provenance to travel with uploads', t => {
  const { root, skill } = fixture(t);
  rmSync(join(skill, 'LICENSE.txt'));
  assert.throws(() => validateRepository(root), /missing bundled LICENSE/);
});

test('rejects nested entrypoints that CLI discovery could install twice', t => {
  const { root, skill } = fixture(t);
  writeFileSync(join(skill, 'references', 'SKILL.md'), 'nested');
  assert.throws(() => validateRepository(root), /nested SKILL.md/);
});

test('rejects an upload above the importer file-count limit', t => {
  const { root, skill } = fixture(t);
  for (let i = 0; i < 100; i++) writeFileSync(join(skill, `asset-${i}.txt`), 'x');
  assert.throws(() => validateRepository(root), /exceeds 100 upload files/);
});

test('rejects directory links that can leak files outside a skill', t => {
  const { root, skill } = fixture(t);
  const outside = join(root, 'outside');
  mkdirSync(outside);
  writeFileSync(join(outside, 'private.txt'), 'not part of the skill');
  symlinkSync(outside, join(skill, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => validateRepository(root), /symlinks\/junctions/);
});
