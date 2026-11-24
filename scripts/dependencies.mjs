// Skill-to-skill dependencies, declared per skill in registry/skills.json:
//   requires: skills the workflow sends the agent to; installed with the skill.
//   related:  skills the text names as optional companions; not installed by default.
// See docs/INSTALLATION.md and docs/VERSIONING.md.

export const INSTALL_SOURCE = 'Leotus-Richard/AI-SKILLS';
export const SKILLS_CLI_VERSION = '1.7.4';
// Folder inside an upload ZIP that holds the skills it requires.
export const BUNDLE_DIRECTORY = 'required-skills';

const namesOf = value => (Array.isArray(value) ? value : []);
const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function entriesByName(skills) {
  return new Map(skills.map(entry => [entry.name, entry]));
}

// Everything `name` requires, directly or through another required skill, without `name` itself.
export function requiredClosure(skills, name) {
  const byName = entriesByName(skills);
  const found = new Set();
  const queue = [name];
  while (queue.length) {
    for (const next of namesOf(byName.get(queue.shift())?.requires)) {
      if (next === name || found.has(next)) continue;
      found.add(next);
      queue.push(next);
    }
  }
  return [...found].sort();
}

// The skills to install for a request: the requested ones in the order given, then
// what they require. `withRelated` adds the requested skills' related skills (one
// level, so a chain of "see also" pointers cannot pull in the library).
export function resolveInstallSet(skills, requested, { withRelated = false } = {}) {
  const byName = entriesByName(skills);
  const unknown = requested.filter(name => !byName.has(name));
  if (unknown.length) {
    throw new Error(`Unknown skill${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}. Run "npm run skills:list" to see the names.`);
  }
  const selected = [...new Set(requested)];
  const reasons = new Map();
  if (withRelated) {
    for (const name of [...selected]) {
      for (const related of namesOf(byName.get(name).related)) {
        if (selected.includes(related)) continue;
        selected.push(related);
        reasons.set(related, `related to ${name}`);
      }
    }
  }
  for (let i = 0; i < selected.length; i += 1) {
    for (const required of namesOf(byName.get(selected[i])?.requires)) {
      if (selected.includes(required)) continue;
      selected.push(required);
      reasons.set(required, `required by ${selected[i]}`);
    }
  }
  return { skills: selected, added: selected.filter(name => reasons.has(name)).map(name => ({ name, reason: reasons.get(name) })) };
}

// Library skills that `text` names, other than `self`. A hyphenated name counts
// wherever it stands as a word. A one-word name (retro, prototype) is also an
// ordinary word, so it counts only in code or bold formatting. Link targets and
// URLs are ignored: they cite sources, they don't send the agent to a skill.
export function findNamedSkills(text, names, self) {
  const prose = text
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/<https?:\/\/[^>\s]+>/g, '')
    .replace(/https?:\/\/\S+/g, '');
  return names.filter(name => {
    if (name === self) return false;
    const pattern = name.includes('-')
      ? new RegExp(`(?<![\\w/-])${escapeRegExp(name)}(?![\\w-])`)
      : new RegExp(`(?:\`|\\*\\*)${escapeRegExp(name)}(?:\`|\\*\\*)`);
    return pattern.test(prose);
  }).sort();
}

// `texts` maps a skill name to the text an agent always reads: its description and SKILL.md body.
export function findDependencyIssues(skills, texts) {
  const issues = [];
  const names = skills.map(entry => entry.name);
  const known = new Set(names);
  for (const entry of skills) {
    const declared = new Map();
    for (const field of ['requires', 'related']) {
      if (!(field in entry)) continue;
      if (!Array.isArray(entry[field]) || entry[field].some(item => typeof item !== 'string')) {
        issues.push(`${entry.name}: ${field} must be a list of skill names`);
        continue;
      }
      for (const name of entry[field]) {
        if (name === entry.name) issues.push(`${entry.name}: ${field} lists the skill itself`);
        else if (!known.has(name)) issues.push(`${entry.name}: ${field} lists "${name}", which is not a skill in this library`);
        else if (declared.has(name)) {
          issues.push(`${entry.name}: "${name}" is listed ${declared.get(name) === field ? `twice in ${field}` : 'in both requires and related'}`);
        } else declared.set(name, field);
      }
    }
    const text = texts.get(entry.name);
    if (typeof text !== 'string') continue;
    const named = findNamedSkills(text, names, entry.name);
    for (const name of named) {
      if (!declared.has(name)) {
        issues.push(`${entry.name}: SKILL.md names the skill "${name}"; list it under requires or related in registry/skills.json`);
      }
    }
    for (const [name, field] of declared) {
      if (!named.includes(name)) {
        issues.push(`${entry.name}: ${field} lists "${name}" but SKILL.md never names it; name it where the agent should use it, or remove it`);
      }
    }
  }
  return issues;
}

// Split installer arguments into the skills to resolve, this script's own
// options, and everything else, which goes to the Skills CLI untouched.
export function parseInstallArguments(argv) {
  const options = { skills: [], all: false, withRelated: false, print: false, source: null, rest: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--skill' || arg === '-s') {
      let taken = 0;
      // --skill is variadic in the CLI: it takes every value up to the next option.
      while (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
        const value = argv[++i];
        if (value === '*') options.all = true;
        else options.skills.push(value);
        taken += 1;
      }
      if (!taken) throw new Error(`${arg} needs a skill name`);
    } else if (arg === '--with-related') options.withRelated = true;
    else if (arg === '--print') options.print = true;
    else if (arg === '--source') {
      if (i + 1 >= argv.length) throw new Error('--source needs a value');
      options.source = argv[++i];
    } else options.rest.push(arg);
  }
  return options;
}

// Arguments for `skills add`, with one --skill per skill so no value can be mistaken for another option's.
export function installArguments(source, skillNames, rest = []) {
  return ['add', source, ...skillNames.flatMap(name => ['--skill', name]), ...rest];
}

export function installCommand(skillNames, { source = INSTALL_SOURCE, rest = [] } = {}) {
  const quote = value => (/^[\w@%+=:,./-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`);
  return ['npx', '--yes', `skills@${SKILLS_CLI_VERSION}`, ...installArguments(source, skillNames, rest)].map(quote).join(' ');
}
