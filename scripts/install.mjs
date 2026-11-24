#!/usr/bin/env node
// Install skills with the pinned Skills CLI, adding the skills they require.
//
// From a checkout:      npm run skills:install -- --skill <name...> [options]
// From any project:     npx --yes github:Leotus-Richard/AI-SKILLS#<tag|commit> --skill <name...> [options]
//
//   --with-related  also install the skills the requested ones name as optional
//   --print         print the equivalent Skills CLI command and install nothing
//   --ref <ref>     install from the GitHub repository at this tag, branch or commit
//   --source <src>  install from another path or repository
// Everything else (--agent, --global, --copy, --yes, --list, ...) goes to the CLI as given.
//
// Without --ref or --source, a checkout installs its own skills/ folder. A copy fetched by
// npx has no skills/ folder: it installs from GitHub at the commit npx fetched, so one
// revision decides both the requirements and the skill text.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  chooseSource, installArguments, installCommand, parseInstallArguments, resolveInstallSet, revisionFromLockfile,
} from './dependencies.mjs';

const root = resolve(import.meta.dirname, '..');

export function planInstall(argv, registry) {
  const options = parseInstallArguments(argv);
  // '*' already means every skill, and with no --skill the CLI asks which to install.
  if (options.all) return { options, skills: ['*'], added: [] };
  if (!options.skills.length) return { options, skills: [], added: [] };
  return { options, ...resolveInstallSet(registry.skills, options.skills, { withRelated: options.withRelated }) };
}

function ancestors(directory) {
  const found = [];
  for (let current = resolve(directory); ; current = dirname(current)) {
    found.push(current);
    if (dirname(current) === current) return found;
  }
}

// The CLI sits in this package's node_modules in a checkout, and beside this package when npx installed both.
export function findSkillsCli(packageRoot) {
  for (const directory of ancestors(packageRoot)) {
    const candidate = join(directory, 'node_modules', 'skills', 'bin', 'cli.mjs');
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('The Skills CLI is not installed beside this script. In a checkout, run "npm ci" first.');
}

// The commit npm fetched this package at, when it was installed from GitHub (as npx does).
export function detectRevision(packageRoot) {
  const modules = ancestors(packageRoot).find(directory => basename(directory) === 'node_modules');
  if (!modules) return null;
  try {
    const key = `node_modules/${relative(modules, packageRoot).split(sep).join('/')}`;
    return revisionFromLockfile(readFileSync(join(modules, '.package-lock.json'), 'utf8'), key);
  } catch {
    return null;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const registry = JSON.parse(readFileSync(join(root, 'registry', 'skills.json'), 'utf8'));
    const { options, skills, added } = planInstall(process.argv.slice(2), registry);
    const checkout = existsSync(join(root, 'skills'));
    const detected = checkout ? null : detectRevision(root);
    // A printed command is for use elsewhere, so it never names this machine's folder.
    const source = chooseSource({
      source: options.source, ref: options.ref, detected,
      local: checkout && !options.print ? join(root, 'skills') : null,
    });
    if (!checkout && !options.source && !options.ref && !detected) {
      console.error('Could not tell which revision this copy came from, so skills come from the default branch. Pass --ref to pin them.');
    }
    for (const { name, reason } of added) console.error(`Also installing ${name} (${reason}).`);
    if (options.print) {
      console.log(installCommand(skills, { source, rest: options.rest }));
    } else {
      const result = spawnSync(process.execPath, [findSkillsCli(root), ...installArguments(source, skills, options.rest)], { stdio: 'inherit' });
      if (result.error) throw result.error;
      process.exitCode = result.status ?? 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
