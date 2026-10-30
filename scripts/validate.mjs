import { lstatSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join, dirname, relative, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { assertPortableRelativePaths } from './catalog.mjs';

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LIMIT_BYTES = 20_000_000;
const LIMIT_FILES = 100;

function readMetadata(file, issues) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) { issues.push(`${file}: missing YAML frontmatter`); return null; }
  const document = parseDocument(match[1], { uniqueKeys: true });
  if (document.errors.length) {
    issues.push(`${file}: invalid YAML: ${document.errors.map(e => e.message).join('; ')}`);
    return null;
  }
  const metadata = document.toJS();
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    issues.push(`${file}: frontmatter must be a mapping`); return null;
  }
  if (typeof metadata.name !== 'string' || !NAME.test(metadata.name) || metadata.name.length > 64) {
    issues.push(`${file}: invalid skill name`);
  }
  if (typeof metadata.description !== 'string' || !metadata.description.trim() || metadata.description.length > 1024) {
    issues.push(`${file}: description must contain 1–1024 characters`);
  }
  return { metadata, text };
}

function markdownWithoutFences(text) {
  const result = [];
  let fence = null;
  for (const line of text.split(/\r?\n/)) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (marker[1][0] === fence) fence = null;
      continue;
    }
    if (!fence) result.push(line);
  }
  return result.join('\n');
}

function collectFiles(folder, issues) {
  const files = [];
  const names = new Set();
  function visit(directory) {
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, item.name);
      const info = lstatSync(path);
      const local = relative(folder, path).replaceAll(sep, '/');
      const key = local.toLowerCase();
      if (names.has(key)) issues.push(`${folder}: case-insensitive path collision: ${local}`);
      names.add(key);
      if (info.isSymbolicLink()) { issues.push(`${path}: symlinks/junctions are not portable skill assets`); continue; }
      if (info.isDirectory()) visit(path);
      else if (info.isFile()) files.push({ path, local, size: info.size });
      else issues.push(`${path}: unsupported filesystem entry`);
    }
  }
  visit(folder);
  return files;
}

function checkLocalLinks(folder, files, issues) {
  const allowed = new Set(files.map(f => resolve(f.path)));
  let count = 0;
  for (const file of files.filter(f => f.local.endsWith('.md'))) {
    const text = markdownWithoutFences(readFileSync(file.path, 'utf8'));
    for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const raw = match[1].trim().match(/^<([^>]+)>|^(\S+)/);
      if (!raw) continue;
      const href = raw[1] || raw[2];
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#')) continue;
      let local;
      try { local = decodeURIComponent(href.split('#')[0]); }
      catch { issues.push(`${file.path}: malformed link encoding: ${href}`); continue; }
      const target = resolve(dirname(file.path), local);
      const rel = relative(resolve(folder), target);
      if (isAbsolute(local) || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
        issues.push(`${file.path}: relative reference escapes this standalone skill: ${href}`);
      } else if (!allowed.has(target)) {
        issues.push(`${file.path}: local reference does not name a bundled file: ${href}`);
      }
      count++;
    }
  }
  return count;
}

export function validateRepository(repoRoot) {
  const root = resolve(repoRoot);
  const issues = [];
  const registryFile = join(root, 'registry', 'skills.json');
  if (!existsSync(registryFile)) throw new Error(`Missing registry: ${registryFile}`);
  const registry = JSON.parse(readFileSync(registryFile, 'utf8'));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.skills)) {
    throw new Error('registry/skills.json must have schemaVersion 1 and a skills array');
  }
  const entries = new Map();
  for (const entry of registry.skills) {
    if (!entry || typeof entry.name !== 'string' || !NAME.test(entry.name) || entry.name.length > 64) {
      issues.push('Registry has an invalid skill name'); continue;
    }
    if (entries.has(entry.name)) issues.push(`Duplicate registry name: ${entry.name}`);
    entries.set(entry.name, entry);
    if (!NAME.test(entry.category || '')) issues.push(`${entry.name}: missing/invalid category`);
    if (typeof entry.license !== 'string' || !entry.license.trim()) issues.push(`${entry.name}: missing license`);
    if ('description' in entry) issues.push(`${entry.name}: description belongs in SKILL.md, not duplicated in registry`);
    if (!entry.provenance || typeof entry.provenance.kind !== 'string' || !Array.isArray(entry.provenance.urls)) {
      issues.push(`${entry.name}: provenance needs kind and urls`);
    } else {
      for (const url of entry.provenance.urls) {
        try { if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new Error(); }
        catch { issues.push(`${entry.name}: invalid provenance URL`); }
      }
    }
  }
  try { assertPortableRelativePaths([...entries.keys()]); }
  catch (error) { issues.push(`Registry: ${error.message}`); }
  const skillsDir = join(root, 'skills');
  if (!existsSync(skillsDir)) throw new Error('Missing canonical skills directory');
  const seen = new Set();
  const skills = [];
  for (const item of readdirSync(skillsDir, { withFileTypes: true })) {
    const folder = join(skillsDir, item.name);
    if (lstatSync(folder).isSymbolicLink()) { issues.push(`${folder}: skill directory cannot be a symlink/junction`); continue; }
    if (!item.isDirectory()) { issues.push(`${folder}: keep only skill directories under skills/`); continue; }
    const files = collectFiles(folder, issues);
    try { assertPortableRelativePaths(files.map(file => file.local)); }
    catch (error) { issues.push(`${folder}: ${error.message}`); }
    // Git does not track empty directories; an empty work-in-progress folder is not a skill.
    if (!files.length) continue;
    const key = item.name.toLowerCase();
    if (seen.has(key)) issues.push(`${folder}: duplicate skill name ignoring case`);
    seen.add(key);
    const main = join(folder, 'SKILL.md');
    if (!existsSync(main) || !lstatSync(main).isFile() || lstatSync(main).isSymbolicLink()) {
      issues.push(`${folder}: missing regular root SKILL.md`); continue;
    }
    const parsed = readMetadata(main, issues);
    if (parsed && parsed.metadata.name !== item.name) issues.push(`${folder}: folder and frontmatter name must match`);
    if (!entries.has(item.name)) issues.push(`${folder}: missing registry entry`);
    if (!existsSync(join(folder, 'LICENSE.txt'))) issues.push(`${folder}: missing bundled LICENSE.txt`);
    if (!existsSync(join(folder, 'SOURCE.md'))) issues.push(`${folder}: missing SOURCE.md provenance`);
    if (files.length > LIMIT_FILES) issues.push(`${folder}: exceeds ${LIMIT_FILES} upload files`);
    const uncompressedBytes = files.reduce((sum, f) => sum + f.size, 0);
    if (uncompressedBytes > LIMIT_BYTES) issues.push(`${folder}: exceeds ${LIMIT_BYTES} uncompressed bytes`);
    for (const file of files) {
      if (file.local !== 'SKILL.md' && file.local.split('/').at(-1) === 'SKILL.md') {
        issues.push(`${file.path}: nested SKILL.md would create ambiguous CLI discovery`);
      }
    }
    const localLinks = checkLocalLinks(folder, files, issues);
    skills.push({ name: item.name, fileCount: files.length, uncompressedBytes, localLinks });
  }
  for (const name of entries.keys()) if (!seen.has(name.toLowerCase())) issues.push(`${name}: registry points to a missing skill`);
  if (!skills.length) issues.push('The repository contains no canonical skills');
  if (issues.length) throw new Error(`Skill validation failed:\n${issues.map(s => `- ${s}`).join('\n')}`);
  return { skills: skills.sort((a, b) => a.name.localeCompare(b.name)), warnings: [] };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args[0] !== '--root' || args.length !== 2)) throw new Error('Usage: node scripts/validate.mjs [--root PATH]');
    const root = args.length ? args[1] : resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const result = validateRepository(root);
    console.log(`Validated ${result.skills.length} standalone skills; ${result.skills.reduce((n, s) => n + s.localLinks, 0)} local references checked.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
