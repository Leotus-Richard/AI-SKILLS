import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseDocument } from 'yaml';

export const CATALOG_SCHEMA_VERSION = 1;
export const GENERATED_CATALOG_PATHS = ['generated/catalog.json', 'docs/CATALOG.md'];

function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function stableObject(value) {
  if (Array.isArray(value)) return value.map(stableObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort(compareText).map(key => [key, stableObject(value[key])]));
  }
  return value;
}

export function assertPortableRelativePaths(paths) {
  const seen = new Map();
  for (const entry of paths) {
    if (typeof entry !== 'string' || !entry || entry.startsWith('/') || entry.includes('\\')) {
      throw new Error(`Unsafe archive path: ${JSON.stringify(entry)}`);
    }
    const parts = entry.split('/');
    if (parts.some(part => !part || part === '.' || part === '..' || /[<>:"|?*\u0000-\u001f]/u.test(part) || /[. ]$/u.test(part))) {
      throw new Error(`Unsafe or non-portable archive path: ${entry}`);
    }
    // Windows device names remain reserved in directories and with extensions.
    // COM/LPT also reserve superscript 1, 2, and 3: learn.microsoft.com/windows/win32/fileio/naming-a-file
    const reservedComponent = parts.find(part => /^(?:con|prn|aux|nul|(?:com|lpt)[1-9¹²³])$/iu.test(part.split('.')[0].trimEnd()));
    if (reservedComponent) throw new Error(`Windows reserved path component: ${reservedComponent} (${entry})`);
    const key = entry.normalize('NFC').toLowerCase();
    if (seen.has(key)) throw new Error(`Case-insensitive path collision: ${seen.get(key)} and ${entry}`);
    seen.set(key, entry);
  }
}

async function requireDirectory(path) {
  const info = await lstat(path);
  if (info.isSymbolicLink()) throw new Error(`Symlink is not permitted: ${path}`);
  if (!info.isDirectory()) throw new Error(`Expected directory: ${path}`);
}

export async function collectSkillFiles(skillDir) {
  await requireDirectory(skillDir);
  const files = [];
  const allPaths = [];
  async function walk(directory, prefix = '') {
    const entries = await readdir(directory);
    entries.sort(compareText);
    for (const name of entries) {
      const path = prefix ? `${prefix}/${name}` : name;
      allPaths.push(path);
      assertPortableRelativePaths(allPaths);
      const absolutePath = join(directory, name);
      const info = await lstat(absolutePath);
      if (info.isSymbolicLink()) throw new Error(`Symlink is not permitted in a skill: ${absolutePath}`);
      if (info.isDirectory()) await walk(absolutePath, path);
      else if (info.isFile()) files.push({ path, absolutePath, bytes: await readFile(absolutePath) });
      else throw new Error(`Unsupported filesystem entry in skill: ${absolutePath}`);
    }
  }
  await walk(skillDir);
  files.sort((a, b) => compareText(a.path, b.path));
  return files;
}

export function hashSkillFiles(files) {
  const hash = createHash('sha256');
  for (const file of [...files].sort((a, b) => compareText(a.path, b.path))) {
    // Length prefixes make the path/content framing unambiguous.
    const pathBytes = Buffer.from(file.path, 'utf8');
    hash.update(`${pathBytes.length}:`);
    hash.update(pathBytes);
    hash.update(`${file.bytes.length}:`);
    hash.update(file.bytes);
  }
  return hash.digest('hex');
}

export function readSkillFrontmatter(text, source = 'SKILL.md') {
  const match = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(text);
  if (!match) throw new Error(`Missing YAML frontmatter: ${source}`);
  const document = parseDocument(match[1], { uniqueKeys: true });
  if (document.errors.length) throw new Error(`Invalid YAML in ${source}: ${document.errors[0].message}`);
  const data = document.toJS();
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`Frontmatter must be a mapping: ${source}`);
  if (typeof data.name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(data.name) || data.name.length > 64) {
    throw new Error(`Invalid skill name in ${source}`);
  }
  if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024) {
    throw new Error(`Invalid skill description in ${source}`);
  }
  return data;
}

export async function createCatalog(repoRoot) {
  const root = resolve(repoRoot);
  await requireDirectory(root);
  await requireDirectory(join(root, 'registry'));
  await requireDirectory(join(root, 'skills'));
  const registryPath = join(root, 'registry', 'skills.json');
  if ((await lstat(registryPath)).isSymbolicLink()) throw new Error(`Symlink is not permitted: ${registryPath}`);
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.skills)) throw new Error('Unsupported registry schema');
  const names = registry.skills.map(entry => entry.name);
  if (names.some(name => typeof name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name) || name.length > 64)) {
    throw new Error('Registry contains an unsafe skill name');
  }
  assertPortableRelativePaths(names);
  const actualNames = await readdir(join(root, 'skills'));
  assertPortableRelativePaths(actualNames);
  for (const name of actualNames) {
    await requireDirectory(join(root, 'skills', name));
    if (!names.includes(name)) {
      // Git does not retain empty directory trees. Ignore only those trees;
      // collectSkillFiles still rejects symlinks and unsupported entries.
      const files = await collectSkillFiles(join(root, 'skills', name));
      if (files.length) throw new Error(`Unregistered canonical skill directory: ${name}`);
    }
  }
  const skills = [];
  for (const entry of [...registry.skills].sort((a, b) => compareText(a.name, b.name))) {
    if (typeof entry.category !== 'string' || !entry.category.trim()) throw new Error(`Missing category: ${entry.name}`);
    if (typeof entry.license !== 'string' || !entry.license.trim()) throw new Error(`Missing license: ${entry.name}`);
    if (!entry.provenance || typeof entry.provenance !== 'object' || Array.isArray(entry.provenance) ||
        typeof entry.provenance.kind !== 'string' || !Array.isArray(entry.provenance.urls) ||
        entry.provenance.urls.some(url => typeof url !== 'string')) {
      throw new Error(`Invalid provenance: ${entry.name}`);
    }
    const path = `skills/${entry.name}`;
    const files = await collectSkillFiles(join(root, path));
    const main = files.find(file => file.path === 'SKILL.md');
    if (!main) throw new Error(`Missing root SKILL.md: ${entry.name}`);
    const metadata = readSkillFrontmatter(main.bytes.toString('utf8'), `${path}/SKILL.md`);
    if (metadata.name !== entry.name) throw new Error(`Registry/frontmatter name mismatch: ${entry.name} / ${metadata.name}`);
    skills.push({
      name: metadata.name,
      description: metadata.description,
      category: entry.category,
      license: entry.license,
      provenance: stableObject(entry.provenance),
      path,
      fileCount: files.length,
      uncompressedBytes: files.reduce((total, file) => total + file.bytes.length, 0),
      contentSha256: hashSkillFiles(files),
    });
  }
  return { schemaVersion: CATALOG_SCHEMA_VERSION, skills };
}

function markdownCell(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll('|', '\\|').replace(/[\r\n]+/gu, ' ');
}

export function renderCatalogMarkdown(catalog, { linkMode = 'source' } = {}) {
  if (!['source', 'archive'].includes(linkMode)) throw new Error(`Unknown catalog link mode: ${linkMode}`);
  const lines = [
    '# Skill catalog',
    '',
    'Generated from canonical `skills/<name>/SKILL.md` files and `registry/skills.json`. Run `npm run catalog` after source changes.',
    '',
    `This repository contains **${catalog.skills.length} skills**. Each Perplexity upload archive contains one skill with \`SKILL.md\` at its root.`,
    '',
    '| Skill | Category | License | Description |',
    '| --- | --- | --- | --- |',
  ];
  for (const skill of catalog.skills) {
    const href = linkMode === 'archive' ? `perplexity/${skill.name}.zip` : `../${skill.path}/SKILL.md`;
    lines.push(`| [${skill.name}](${href}) | ${markdownCell(skill.category)} | ${markdownCell(skill.license)} | ${markdownCell(skill.description)} |`);
  }
  lines.push('', '## Provenance', '');
  for (const skill of catalog.skills) {
    const urls = skill.provenance.urls;
    lines.push(`- **${skill.name}**: ${markdownCell(skill.provenance.kind)}${urls.length ? `; ${urls.map(url => `<${url}>`).join(', ')}` : '; user-supplied source with no independently verified URL'}.`);
  }
  return `${lines.join('\n')}\n`;
}

export function serializeCatalog(catalog) {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

export async function ensureSafeOutputDirectory(repoRoot, relativeDirectory, { create = true } = {}) {
  const root = resolve(repoRoot);
  await requireDirectory(root);
  const target = resolve(root, relativeDirectory);
  const back = relative(root, target);
  if (isAbsolute(back) || back === '..' || back.startsWith(`..${sep}`)) throw new Error(`Output escapes repository: ${relativeDirectory}`);
  let current = root;
  for (const part of back.split(sep).filter(Boolean)) {
    current = join(current, part);
    try { await requireDirectory(current); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      if (!create) break;
      await mkdir(current);
    }
  }
  return target;
}

export async function outputMatches(path, expected) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink() || !info.isFile()) throw new Error(`Generated output must be a regular file: ${path}`);
    return (await readFile(path)).equals(Buffer.from(expected));
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function writeCatalog(repoRoot, { check = false } = {}) {
  const catalog = await createCatalog(repoRoot);
  const outputs = [serializeCatalog(catalog), renderCatalogMarkdown(catalog)];
  const changed = [];
  for (const relativePath of GENERATED_CATALOG_PATHS) {
    await ensureSafeOutputDirectory(repoRoot, dirname(relativePath), { create: false });
  }
  for (let i = 0; i < GENERATED_CATALOG_PATHS.length; i += 1) {
    const relativePath = GENERATED_CATALOG_PATHS[i];
    const absolutePath = join(repoRoot, relativePath);
    if (await outputMatches(absolutePath, outputs[i])) continue;
    changed.push(relativePath);
  }
  if (check && changed.length) throw new Error(`Catalog drift: ${changed.join(', ')}. Run npm run catalog.`);
  if (!check) {
    for (let i = 0; i < GENERATED_CATALOG_PATHS.length; i += 1) {
      const relativePath = GENERATED_CATALOG_PATHS[i];
      if (!changed.includes(relativePath)) continue;
      await ensureSafeOutputDirectory(repoRoot, dirname(relativePath));
      await writeFile(join(repoRoot, relativePath), outputs[i]);
    }
  }
  return { catalog, changed };
}

export function parseToolArguments(args) {
  const options = { root: resolve(dirname(fileURLToPath(import.meta.url)), '..'), check: false, collection: true };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--check') options.check = true;
    else if (args[i] === '--no-collection') options.collection = false;
    else if (args[i] === '--root' && args[i + 1]) options.root = resolve(args[++i]);
    else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
  }
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const options = parseToolArguments(process.argv.slice(2));
    const result = await writeCatalog(options.root, options);
    console.log(`Catalog ${options.check ? 'verified' : 'generated'}: ${result.catalog.skills.length} skills.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
