#!/usr/bin/env node
// Install skills with the pinned Skills CLI, adding the skills they require.
//
// Usage: node scripts/install.mjs --skill <name...> [--with-related] [--print]
//          [--source <path|owner/repo>] [any other `skills add` option]
//   --with-related  also install the skills the requested ones name as optional
//   --print         print the equivalent npx command and install nothing
//   --source        where to install from; default: this checkout's skills/
//                   (with --print: the GitHub repository)
// Everything else (--agent, --global, --copy, --yes, ...) goes to the CLI as given.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INSTALL_SOURCE, installArguments, installCommand, parseInstallArguments, resolveInstallSet,
} from './dependencies.mjs';

const root = resolve(import.meta.dirname, '..');

export function planInstall(argv, registry) {
  const options = parseInstallArguments(argv);
  // '*' already means every skill, and with no --skill the CLI asks which to install.
  if (options.all) return { options, skills: ['*'], added: [] };
  if (!options.skills.length) return { options, skills: [], added: [] };
  return { options, ...resolveInstallSet(registry.skills, options.skills, { withRelated: options.withRelated }) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const registry = JSON.parse(readFileSync(join(root, 'registry', 'skills.json'), 'utf8'));
    const { options, skills, added } = planInstall(process.argv.slice(2), registry);
    for (const { name, reason } of added) console.error(`Also installing ${name} (${reason}).`);
    if (options.print) {
      console.log(installCommand(skills, { source: options.source ?? INSTALL_SOURCE, rest: options.rest }));
    } else {
      const cli = join(root, 'node_modules', 'skills', 'bin', 'cli.mjs');
      const args = installArguments(options.source ?? join(root, 'skills'), skills, options.rest);
      const result = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit' });
      if (result.error) throw result.error;
      process.exitCode = result.status ?? 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
