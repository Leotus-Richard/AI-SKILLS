import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INSTALL_SOURCE, SKILLS_CLI_VERSION, findDependencyIssues, findNamedSkills, installCommand,
  parseInstallArguments, requiredClosure, resolveInstallSet,
} from '../scripts/dependencies.mjs';
import { planInstall } from '../scripts/install.mjs';

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
  assert.equal(manifest.devDependencies.skills, SKILLS_CLI_VERSION);
  assert.equal(manifest.repository.url, `https://github.com/${INSTALL_SOURCE}.git`);
});
