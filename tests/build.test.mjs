import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { unzipSync } from 'fflate';
import {
  assertPortableRelativePaths, collectSkillFiles, createCatalog,
  readSkillFrontmatter, writeCatalog,
} from '../scripts/catalog.mjs';
import { buildPerplexity, createPerplexityArchive, PERPLEXITY_LIMITS } from '../scripts/build.mjs';

async function fixture(t, names = ['zulu', 'alpha']) {
  const prefix = join(tmpdir(), 'ai-skills-build-');
  const root = await mkdtemp(prefix);
  t.after(async () => {
    // Delete only the unique temporary fixture created by this helper.
    const checked = resolve(root);
    assert.ok(checked.startsWith(resolve(prefix)) && checked !== resolve(tmpdir()));
    assert.equal((await lstat(checked)).isSymbolicLink(), false);
    await rm(checked, { recursive: true });
  });
  await mkdir(join(root, 'registry'));
  await mkdir(join(root, 'skills'));
  const skills = [];
  for (const name of names) {
    const directory = join(root, 'skills', name);
    await mkdir(join(directory, 'references'), { recursive: true });
    await writeFile(join(directory, 'SKILL.md'), `---\nname: ${name}\ndescription: >-\n  Work on ${name} | use this when requested.\n---\n\n# ${name}\n\nRead [usage](references/usage.md).\n`);
    await writeFile(join(directory, 'references', 'usage.md'), `# Usage\n\nEvidence for ${name}.\n`);
    await writeFile(join(directory, 'LICENSE.txt'), 'MIT fixture notice\n');
    await writeFile(join(directory, 'SOURCE.md'), 'User-supplied fixture.\n');
    skills.push({ name, category: 'workflow', license: 'MIT', provenance: { kind: 'user-supplied', urls: [] } });
  }
  await writeFile(join(root, 'registry', 'skills.json'), JSON.stringify({ schemaVersion: 1, skills }));
  return root;
}

function hash(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

test('catalog derives descriptions and support-file hashes from canonical sources', async t => {
  const root = await fixture(t);
  const first = await createCatalog(root);
  assert.deepEqual(first.skills.map(skill => skill.name), ['alpha', 'zulu']);
  assert.equal(first.skills[0].description, 'Work on alpha | use this when requested.');
  assert.equal(first.skills[0].fileCount, 4);
  assert.deepEqual(first.skills[0].provenance.urls, []);
  await writeFile(join(root, 'skills', 'alpha', 'references', 'usage.md'), 'Changed evidence.\n');
  const second = await createCatalog(root);
  assert.notEqual(first.skills[0].contentSha256, second.skills[0].contentSha256);
  assert.equal(first.skills[1].contentSha256, second.skills[1].contentSha256);
});

test('catalog check detects drift without rewriting generated files', async t => {
  const root = await fixture(t);
  await writeCatalog(root);
  await writeCatalog(root, { check: true });
  const old = await readFile(join(root, 'generated', 'catalog.json'));
  const skillPath = join(root, 'skills', 'alpha', 'SKILL.md');
  await writeFile(skillPath, (await readFile(skillPath, 'utf8')).replace('Work on alpha', 'Changed alpha'));
  await assert.rejects(writeCatalog(root, { check: true }), /Catalog drift/);
  assert.deepEqual(await readFile(join(root, 'generated', 'catalog.json')), old);
});

test('catalog rejects name mismatches and unregistered canonical directories', async t => {
  const root = await fixture(t, ['alpha']);
  const path = join(root, 'skills', 'alpha', 'SKILL.md');
  const original = await readFile(path, 'utf8');
  await writeFile(path, original.replace('name: alpha', 'name: elsewhere'));
  await assert.rejects(createCatalog(root), /name mismatch/);
  await writeFile(path, original);
  await mkdir(join(root, 'skills', 'unregistered'));
  await writeFile(join(root, 'skills', 'unregistered', 'SOURCE.md'), 'Unregistered content.');
  await assert.rejects(createCatalog(root), /Unregistered canonical skill/);
});

test('catalog ignores truly empty directory trees but rejects nonempty unregistered trees', async t => {
  const root = await fixture(t, ['alpha']);
  await mkdir(join(root, 'skills', 'empty-shell', 'references', 'nested'), { recursive: true });
  assert.deepEqual((await createCatalog(root)).skills.map(skill => skill.name), ['alpha']);
  await writeFile(join(root, 'skills', 'empty-shell', 'references', 'nested', 'empty-file.md'), '');
  await assert.rejects(createCatalog(root), /Unregistered canonical skill/);
});

test('frontmatter rejects ambiguous YAML and wrong metadata types', () => {
  assert.throws(() => readSkillFrontmatter('---\nname: alpha\nname: beta\ndescription: test\n---\n'), /Invalid YAML/);
  assert.throws(() => readSkillFrontmatter('---\nname: alpha\ndescription: [one, two]\n---\n'), /description/);
  assert.throws(() => readSkillFrontmatter('---\nname: ../escape\ndescription: test\n---\n'), /name/);
});

test('portable archive paths reject case collisions and traversal on every host', () => {
  assert.throws(() => assertPortableRelativePaths(['references/Usage.md', 'references/usage.md']), /collision/);
  for (const path of ['../escape', 'references/../../escape', 'C:/escape', 'references\\escape', '/absolute']) {
    assert.throws(() => assertPortableRelativePaths([path]), /Unsafe/);
  }
});

test('portable archive paths reject Windows device components without filesystem creation', () => {
  for (const path of [
    'CON.txt', 'references/AUX.md', 'references/com1.json', 'LPT9.txt', 'COM¹.md',
    'references/lpt².json', 'references/COM³/details.md', 'nul.tar.gz', 'PRN/usage.md', 'CON .txt',
  ]) {
    assert.throws(() => assertPortableRelativePaths([path]), /Windows reserved path component/, path);
  }
  assert.doesNotThrow(() => assertPortableRelativePaths(['contest.md', 'com10.json', 'references/auxiliary.md']));
});

test('source directory links are rejected rather than followed', async t => {
  const root = await fixture(t, ['alpha']);
  const external = join(root, 'not-a-skill');
  await mkdir(external);
  await writeFile(join(external, 'private.txt'), 'Do not package this.');
  await symlink(external, join(root, 'skills', 'alpha', 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(collectSkillFiles(join(root, 'skills', 'alpha')), /Symlink/);
});

test('individual archives preserve root entrypoint, support files, and deterministic receipts', async t => {
  const root = await fixture(t, ['alpha']);
  const skillDir = join(root, 'skills', 'alpha');
  const first = await createPerplexityArchive(skillDir);
  const second = await createPerplexityArchive(skillDir);
  assert.deepEqual(first.archive, second.archive);
  assert.equal(first.receipt.sha256, hash(first.archive));
  const expanded = unzipSync(first.archive);
  assert.ok(expanded['SKILL.md']);
  assert.ok(expanded['references/usage.md']);
  assert.ok(expanded['LICENSE.txt']);
  assert.ok(expanded['SOURCE.md']);
  assert.equal(Object.keys(expanded).length, 4);
  for (const entry of first.receipt.files) {
    assert.equal(entry.sha256, hash(expanded[entry.path]));
    assert.equal(entry.bytes, expanded[entry.path].length);
  }
});

test('archive limits reject file count, extracted bytes, and compressed bytes', async t => {
  const root = await fixture(t, ['alpha']);
  const skillDir = join(root, 'skills', 'alpha');
  await assert.rejects(createPerplexityArchive(skillDir, { limits: { ...PERPLEXITY_LIMITS, maxFiles: 3 } }), /file limit/);
  await assert.rejects(createPerplexityArchive(skillDir, { limits: { ...PERPLEXITY_LIMITS, maxUncompressedBytes: 10 } }), /extracted size/);
  await assert.rejects(createPerplexityArchive(skillDir, { limits: { ...PERPLEXITY_LIMITS, maxArchiveBytes: 10 } }), /archive size/);
});

test('build produces separate upload ZIPs, a transport collection, and valid release checksums', async t => {
  const root = await fixture(t);
  const result = await buildPerplexity(root);
  assert.equal(result.manifest.artifacts.length, 2);
  const outer = unzipSync(await readFile(join(root, result.collectionPath)));
  assert.equal(outer['SKILL.md'], undefined);
  assert.match(Buffer.from(outer['README.md']).toString(), /Extract this collection first/);
  assert.match(Buffer.from(outer['CATALOG.md']).toString(), /\]\(perplexity\/alpha\.zip\)/);
  for (const artifact of result.manifest.artifacts) {
    const archive = await readFile(join(root, 'dist', 'perplexity', artifact.file));
    assert.equal(hash(archive), artifact.sha256);
    assert.deepEqual(Buffer.from(outer[`perplexity/${artifact.file}`]), archive);
    assert.ok(unzipSync(archive)['SKILL.md']);
  }
  const checksumLines = (await readFile(join(root, 'dist', 'SHA256SUMS'), 'utf8')).trim().split('\n');
  assert.equal(checksumLines.length, 4);
  for (const line of checksumLines) {
    const [expectedHash, name] = line.split('  ');
    assert.notEqual(name, 'SHA256SUMS');
    const path = name === 'ai-skills-perplexity-collection.zip' ? join(root, 'dist', name) : join(root, 'dist', 'perplexity', name);
    assert.equal(hash(await readFile(path)), expectedHash);
  }
  assert.deepEqual((await buildPerplexity(root)).changed, []);
  await buildPerplexity(root, { check: true });
});

test('build check reports tampering without repairing files', async t => {
  const root = await fixture(t, ['alpha']);
  await buildPerplexity(root);
  const path = join(root, 'dist', 'perplexity', 'alpha.zip');
  await writeFile(path, 'tampered');
  await assert.rejects(buildPerplexity(root, { check: true }), /Build drift/);
  assert.equal(await readFile(path, 'utf8'), 'tampered');
});

test('stale artifacts block a build and remain untouched', async t => {
  const root = await fixture(t, ['alpha']);
  await buildPerplexity(root);
  const stale = join(root, 'dist', 'perplexity', 'retired.zip');
  await writeFile(stale, 'old evidence');
  await assert.rejects(buildPerplexity(root), /stale build output/);
  assert.equal(await readFile(stale, 'utf8'), 'old evidence');
});

test('output directory links cannot redirect generated artifacts', async t => {
  const root = await fixture(t, ['alpha']);
  const external = join(root, 'external-output');
  await mkdir(external);
  await symlink(external, join(root, 'dist'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(buildPerplexity(root), /Unsafe build directory/);
  await symlink(external, join(root, 'generated'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(writeCatalog(root, { check: true }), /Symlink/);
});
