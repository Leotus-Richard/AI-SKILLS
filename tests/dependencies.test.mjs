import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INSTALL_SOURCE, SKILLS_CLI_VERSION, chooseSource, findDependencyIssues, findNamedSkills, installCommand,
  parseInstallArguments, requiredClosure, resolveInstallSet, revisionFromLockfile,
} from '../scripts/dependencies.mjs';
import { findSkillsCli, planInstall } from '../scripts/install.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// map-maker needs interview, which needs glossary. interview and retro point at each other as optional.
const library = [
  { name: 'map-maker', requires: ['interview'], related: ['retro'] },
  { name: 'interview', requires: ['glossary'], related: ['retro', 'side-note'] },
  { name: 'glossary' },
  { name: 'retro', related: ['interview'] },
  { name: 'side-note' },
];

test('installing a skill adds what it requires, at any depth, and nothing optional', () => {
  const plan = resolveInstallSet(library, ['map-maker']);
  assert.deepEqual(plan.skills, ['map-maker', 'interview', 'glossary']);
  assert.deepEqual(plan.added, [
    { name: 'interview', reason: 'required by map-maker' },
    { name: 'glossary', reason: 'required by interview' },
  ]);
  assert.deepEqual(resolveInstallSet(library, ['glossary']), { skills: ['glossary'], added: [] });
  assert.deepEqual(resolveInstallSet(library, ['retro']).skills, ['retro'], 'a related skill is not installed by default');
  assert.deepEqual(resolveInstallSet(library, ['interview', 'map-maker', 'interview']).skills, ['interview', 'map-maker', 'glossary']);
});

test('related skills come along only when asked, one level deep, with what they require', () => {
  const plan = resolveInstallSet(library, ['retro'], { withRelated: true });
  assert.deepEqual(plan.skills, ['retro', 'interview', 'glossary']);
  assert.equal(plan.skills.includes('side-note'), false, "interview's own related skills are not followed");
  assert.deepEqual(plan.added[0], { name: 'interview', reason: 'related to retro' });
});

test('an unknown skill stops the install, and skills that require each other still resolve', () => {
  assert.throws(() => resolveInstallSet(library, ['map-maker', 'nope', 'missing']), /Unknown skills: nope, missing/);
  const mutual = [{ name: 'create', requires: ['maintain'] }, { name: 'maintain', requires: ['create'] }];
  assert.deepEqual(resolveInstallSet(mutual, ['create']).skills, ['create', 'maintain']);
  assert.deepEqual(requiredClosure(mutual, 'create'), ['maintain']);
  assert.deepEqual(requiredClosure(library, 'map-maker'), ['glossary', 'interview']);
  assert.deepEqual(requiredClosure(library, 'retro'), []);
});

test('a skill is named by its hyphenated name anywhere, or by a one-word name in code or bold', () => {
  const names = ['map-maker', 'interview', 'retro', 'side-note'];
  const named = text => findNamedSkills(text, names, 'map-maker');
  assert.deepEqual(named('Use the side-note skill, then map-maker again.'), ['side-note'], 'its own name is not a dependency');
  assert.deepEqual(named('Hold an interview and a retro with the team.'), [], 'ordinary words are not skill names');
  assert.deepEqual(named('Use the `interview` skill, then **retro**.'), ['interview', 'retro']);
  assert.deepEqual(named('See [the side note](references/side-note.md) or `references/side-note.md`.'), [], 'a file path is not a skill');
  assert.deepEqual(named('Adapted from <https://example.test/skills/side-note/SKILL.md> and https://example.test/side-note.'), [], 'URLs cite sources');
  assert.deepEqual(named('Labels: `map-maker:interview`. Not side-notes or my-side-note.'), []);
});

test('declarations and the skill text must agree', () => {
  const skills = [
    { name: 'map-maker', requires: ['interview'], related: ['retro'] },
    { name: 'interview', requires: ['glossary'] },
    { name: 'glossary' },
    { name: 'retro' },
  ];
  const texts = new Map([
    ['map-maker', 'Charts a route. Use the `interview` skill first; **retro** is optional.'],
    ['interview', 'Asks questions and keeps a word list.'],
  ]);
  assert.deepEqual(findDependencyIssues(skills, texts), [
    'interview: requires lists "glossary" but SKILL.md never names it; name it where the agent should use it, or remove it',
  ]);
  texts.set('interview', 'Asks questions and keeps the words in the `glossary` skill.');
  assert.deepEqual(findDependencyIssues(skills, texts), []);
  const issues = findDependencyIssues([
    { name: 'map-maker', requires: ['map-maker', 'ghost'], related: ['interview', 'interview'] },
    { name: 'interview', requires: ['retro'], related: ['retro'] },
    { name: 'retro', requires: 'interview' },
  ], new Map([['map-maker', 'Use the `interview` skill and the `retro` skill.']])).join('\n');
  assert.match(issues, /map-maker: requires lists the skill itself/);
  assert.match(issues, /map-maker: requires lists "ghost", which is not a skill in this library/);
  assert.match(issues, /map-maker: "interview" is listed twice in related/);
  assert.match(issues, /map-maker: SKILL\.md names the skill "retro"; list it under requires or related/);
  assert.match(issues, /interview: "retro" is listed in both requires and related/);
  assert.match(issues, /retro: requires must be a list of skill names/);
});

test('installer arguments keep the CLI options and expand only the skills', () => {
  const parsed = parseInstallArguments(['--skill', 'map-maker', 'retro', '--agent', 'codex', 'cursor', '-s', 'glossary', '--copy', '--with-related', '--yes']);
  assert.deepEqual(parsed.skills, ['map-maker', 'retro', 'glossary']);
  assert.deepEqual(parsed.rest, ['--agent', 'codex', 'cursor', '--copy', '--yes']);
  assert.equal(parsed.withRelated, true);
  assert.throws(() => parseInstallArguments(['--skill', '--agent', 'codex']), /--skill needs a skill name/);
  assert.throws(() => parseInstallArguments(['--source']), /--source needs a value/);
  assert.throws(() => parseInstallArguments(['--ref', '--yes']), /--ref needs a value/);
  assert.equal(parseInstallArguments(['--ref', 'v1.2.0', '--skill', 'retro']).ref, 'v1.2.0');

  const plan = planInstall(['--skill', 'map-maker', '--agent', 'codex'], { skills: library });
  assert.deepEqual(plan.skills, ['map-maker', 'interview', 'glossary']);
  assert.equal(
    installCommand(plan.skills, { rest: plan.options.rest }),
    `npx --yes skills@${SKILLS_CLI_VERSION} add ${INSTALL_SOURCE} --skill map-maker --skill interview --skill glossary --agent codex`,
  );
  assert.deepEqual(planInstall(['--skill', '*', '--yes'], { skills: library }).skills, ['*'], 'every skill needs no resolving');
  assert.match(installCommand(['*']), /--skill '\*'$/);
  assert.deepEqual(planInstall(['--agent', 'codex'], { skills: library }).skills, [], 'with no --skill the CLI asks');
});

test('the printed install command uses the pinned CLI and this repository', () => {
  const manifest = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  assert.equal(manifest.dependencies.skills, SKILLS_CLI_VERSION, 'npx installs dependencies, not devDependencies');
  assert.equal(manifest.devDependencies.skills, undefined);
  assert.equal(manifest.repository.url, `https://github.com/${INSTALL_SOURCE}.git`);
});

test('the source is the checkout, an explicit choice, or GitHub at the fetched commit', () => {
  const sha = '0123456789abcdef0123456789abcdef01234567';
  assert.equal(chooseSource({ local: '/work/AI-SKILLS/skills' }), '/work/AI-SKILLS/skills');
  assert.equal(chooseSource({ detected: sha }), `${INSTALL_SOURCE}#${sha}`);
  assert.equal(chooseSource({}), INSTALL_SOURCE);
  assert.equal(chooseSource({ ref: 'v1.2.0', local: '/work/AI-SKILLS/skills', detected: sha }), `${INSTALL_SOURCE}#v1.2.0`, '--ref beats both');
  assert.equal(chooseSource({ source: 'someone/fork', ref: 'main', detected: sha }), 'someone/fork#main');
  assert.equal(chooseSource({ source: '../elsewhere/skills', detected: sha }), '../elsewhere/skills');
  assert.equal(installCommand(['retro'], { source: chooseSource({ ref: 'v1.2.0' }) }),
    `npx --yes skills@${SKILLS_CLI_VERSION} add ${INSTALL_SOURCE}#v1.2.0 --skill retro`);
});

test('the fetched commit is read from npm\'s record only when it names this repository', () => {
  const sha = 'ABCDEF0123456789abcdef0123456789abcdef01';
  const key = 'node_modules/@leotus-richard/ai-skills';
  const lock = resolved => JSON.stringify({ packages: { [key]: { resolved } } });
  assert.equal(revisionFromLockfile(lock(`git+ssh://git@github.com/Leotus-Richard/AI-SKILLS.git#${sha}`), key), sha.toLowerCase());
  assert.equal(revisionFromLockfile(lock(`git+https://github.com/leotus-richard/ai-skills#${sha}`), key), sha.toLowerCase());
  assert.equal(revisionFromLockfile(lock(`git+ssh://git@github.com/someone/AI-SKILLS.git#${sha}`), key), null, 'a fork is not this repository');
  assert.equal(revisionFromLockfile(lock(`git+ssh://git@github.com/Leotus-Richard/AI-SKILLS-extra.git#${sha}`), key), null);
  assert.equal(revisionFromLockfile(lock('https://registry.npmjs.org/x/-/x-1.0.0.tgz'), key), null);
  assert.equal(revisionFromLockfile(lock(`git+ssh://git@github.com/Leotus-Richard/AI-SKILLS.git#${sha}`), 'node_modules/other'), null);
  assert.equal(revisionFromLockfile('not json', key), null);
});

// Lay the package out the way npx does: beside the CLI, under node_modules, without the skills folder.
function fetchedCopy(t, resolved) {
  const cache = mkdtempSync(join(tmpdir(), 'ai-skills-npx-'));
  t.after(() => {
    assert.equal(dirname(resolve(cache)), resolve(tmpdir()));
    rmSync(cache, { recursive: true, force: true });
  });
  const manifest = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  const packageRoot = join(cache, 'node_modules', '@leotus-richard', 'ai-skills');
  for (const file of [...manifest.files, 'package.json']) {
    mkdirSync(dirname(join(packageRoot, file)), { recursive: true });
    cpSync(join(repoRoot, file), join(packageRoot, file));
  }
  if (resolved) {
    writeFileSync(join(cache, 'node_modules', '.package-lock.json'),
      JSON.stringify({ packages: { 'node_modules/@leotus-richard/ai-skills': { resolved } } }));
  }
  return { cache, packageRoot, command: join(packageRoot, manifest.bin['ai-skills']) };
}

test('a copy fetched by npx has what it needs and pins skills to the commit it came from', t => {
  const sha = '0123456789abcdef0123456789abcdef01234567';
  const copy = fetchedCopy(t, `git+ssh://git@github.com/${INSTALL_SOURCE}.git#${sha}`);
  assert.equal(existsSync(join(copy.packageRoot, 'skills')), false, 'the fixture has no skills folder, like the real package');
  const run = args => spawnSync(process.execPath, [copy.command, ...args], { cwd: copy.cache, encoding: 'utf8' });

  const pinned = run(['--skill', 'wayfinder', '--agent', 'codex', '--print']);
  assert.equal(pinned.status, 0, pinned.stderr);
  assert.equal(pinned.stdout.trim(),
    `npx --yes skills@${SKILLS_CLI_VERSION} add ${INSTALL_SOURCE}#${sha} --skill wayfinder --skill grill-with-docs --agent codex`);
  assert.match(pinned.stderr, /Also installing grill-with-docs \(required by wayfinder\)\./);

  // npm starts a package command through a link in node_modules/.bin, not by its real path.
  const link = join(copy.cache, 'node_modules', '.bin', 'ai-skills');
  mkdirSync(dirname(link), { recursive: true });
  let linked = true;
  try { symlinkSync(copy.command, link); }
  catch (error) { if (error.code !== 'EPERM') throw error; linked = false; } // Windows without the symlink privilege
  if (linked) {
    const viaLink = spawnSync(process.execPath, [link, '--skill', 'wayfinder', '--agent', 'codex', '--print'], { cwd: copy.cache, encoding: 'utf8' });
    assert.equal(viaLink.stdout, pinned.stdout, 'the command must run when started through the link');
  }

  const chosen = run(['--skill', 'retro', '--ref', 'v9.9.9', '--print']);
  assert.equal(chosen.stdout.trim(), `npx --yes skills@${SKILLS_CLI_VERSION} add ${INSTALL_SOURCE}#v9.9.9 --skill retro`);

  // The CLI is found beside the package, where npm puts a shared dependency.
  assert.throws(() => findSkillsCli(copy.packageRoot), /Skills CLI is not installed/);
  mkdirSync(join(copy.cache, 'node_modules', 'skills', 'bin'), { recursive: true });
  writeFileSync(join(copy.cache, 'node_modules', 'skills', 'bin', 'cli.mjs'), '');
  assert.equal(findSkillsCli(copy.packageRoot), join(copy.cache, 'node_modules', 'skills', 'bin', 'cli.mjs'));
});

test('a fetched copy that cannot tell its commit says so instead of pinning silently', t => {
  const copy = fetchedCopy(t, null);
  const result = spawnSync(process.execPath, [copy.command, '--skill', 'retro', '--print'], { cwd: copy.cache, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), `npx --yes skills@${SKILLS_CLI_VERSION} add ${INSTALL_SOURCE} --skill retro`);
  assert.match(result.stderr, /Could not tell which revision this copy came from.*Pass --ref to pin them\./);
});

test('the package npx fetches lists every file its command imports', () => {
  const manifest = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  const command = manifest.bin['ai-skills'];
  assert.ok(manifest.files.includes(command));
  assert.ok(manifest.files.includes('registry/skills.json'));
  assert.ok(readFileSync(join(repoRoot, command), 'utf8').startsWith('#!/usr/bin/env node\n'));
  const pending = [command];
  for (const file of pending) {
    for (const [, specifier] of readFileSync(join(repoRoot, file), 'utf8').matchAll(/from '(\.[^']+)'/g)) {
      const imported = join(dirname(file), specifier).replaceAll('\\', '/');
      assert.ok(manifest.files.includes(imported), `${file} imports ${imported}, which "files" leaves out`);
      if (!pending.includes(imported)) pending.push(imported);
    }
  }
});
