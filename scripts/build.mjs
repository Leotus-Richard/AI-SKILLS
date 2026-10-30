import { createHash } from 'node:crypto';
import { lstat, readdir, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { zipSync } from 'fflate';
import {
  collectSkillFiles, createCatalog, ensureSafeOutputDirectory, hashSkillFiles,
  outputMatches, parseToolArguments, readSkillFrontmatter, renderCatalogMarkdown, serializeCatalog,
} from './catalog.mjs';

export const PERPLEXITY_LIMITS = Object.freeze({ maxFiles: 100, maxArchiveBytes: 20_000_000, maxUncompressedBytes: 20_000_000 });
export const ZIP_EPOCH = new Date(1980, 0, 1, 0, 0, 0);

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function deterministicZip(files) {
  const entries = Object.create(null);
  for (const file of [...files].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)) {
    entries[file.path] = [new Uint8Array(file.bytes), { mtime: ZIP_EPOCH }];
  }
  return Buffer.from(zipSync(entries, { level: 9, mtime: ZIP_EPOCH }));
}

export async function createPerplexityArchive(skillDir, { limits = PERPLEXITY_LIMITS } = {}) {
  const files = await collectSkillFiles(skillDir);
  const main = files.find(file => file.path === 'SKILL.md');
  if (!main) throw new Error(`Missing root SKILL.md: ${skillDir}`);
  const metadata = readSkillFrontmatter(main.bytes.toString('utf8'), `${skillDir}/SKILL.md`);
  const uncompressedBytes = files.reduce((total, file) => total + file.bytes.length, 0);
  if (files.length > limits.maxFiles) throw new Error(`Perplexity file limit exceeded for ${metadata.name}: ${files.length} > ${limits.maxFiles}`);
  if (uncompressedBytes > limits.maxUncompressedBytes) throw new Error(`Perplexity extracted size limit exceeded for ${metadata.name}`);
  const archive = deterministicZip(files);
  if (archive.length > limits.maxArchiveBytes) throw new Error(`Perplexity archive size limit exceeded for ${metadata.name}`);
  return {
    name: metadata.name,
    archive,
    receipt: {
      name: metadata.name,
      file: `${metadata.name}.zip`,
      sha256: digest(archive),
      archiveBytes: archive.length,
      uncompressedBytes,
      fileCount: files.length,
      contentSha256: hashSkillFiles(files),
      files: files.map(file => ({ path: file.path, bytes: file.bytes.length, sha256: digest(file.bytes) })),
    },
  };
}

export function renderCollectionReadme(count) {
  return [
    '# Perplexity skill collection', '',
    `This download contains ${count} separate skill ZIP files in perplexity/.`, '',
    'Extract this collection first, then upload each desired ZIP separately through Perplexity Computer: Plugins > Add custom > Upload plugin or skill.', '',
    'This collection ZIP is a transport bundle, not a single uploadable skill: it intentionally has no root SKILL.md. Each nested skill ZIP has its own root SKILL.md and local support files.', '',
    'manifest.json records SHA-256 checksums for the individual ZIP files and every source file. catalog.json and CATALOG.md describe the skills. The source repository is the canonical editable copy.', '',
  ].join('\n');
}

async function inspectExistingOutputs(repoRoot, expectedNames) {
  const directory = join(repoRoot, 'dist', 'perplexity');
  try {
    const info = await lstat(directory);
    if (info.isSymbolicLink() || !info.isDirectory()) throw new Error(`Build output must be a regular directory: ${directory}`);
    for (const name of await readdir(directory)) {
      const path = join(directory, name);
      const entry = await lstat(path);
      if (entry.isSymbolicLink() || !entry.isFile()) throw new Error(`Unexpected build output entry: ${path}`);
      if (!expectedNames.has(name)) {
        throw new Error(`Unexpected or stale build output: dist/perplexity/${name}. Reconcile this file explicitly; the build does not delete it.`);
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

export async function buildPerplexity(repoRoot, { check = false, collection = true } = {}) {
  const root = resolve(repoRoot);
  const catalog = await createCatalog(root);
  const expected = new Set(['manifest.json', ...catalog.skills.map(skill => `${skill.name}.zip`)]);
  // Verify ancestor directories before inspecting or creating generated files.
  // Check mode never creates directories or files.
  for (const directory of ['dist', 'dist/perplexity']) {
    try {
      const info = await lstat(join(root, directory));
      if (info.isSymbolicLink() || !info.isDirectory()) throw new Error(`Unsafe build directory: ${directory}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  try {
    const allowed = new Set(['perplexity', 'SHA256SUMS', ...(collection ? ['ai-skills-perplexity-collection.zip'] : [])]);
    for (const name of await readdir(join(root, 'dist'))) {
      if (!allowed.has(name)) throw new Error(`Unexpected or stale build output: dist/${name}. Reconcile this file explicitly; the build does not delete it.`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await inspectExistingOutputs(root, expected);
  const artifacts = [];
  const outputs = [];
  for (const skill of catalog.skills) {
    const built = await createPerplexityArchive(join(root, skill.path));
    artifacts.push(built.receipt);
    outputs.push({ path: `dist/perplexity/${built.receipt.file}`, bytes: built.archive });
  }
  const manifest = {
    schemaVersion: 1,
    format: 'perplexity-skill-zip',
    packagingVersion: 1,
    zipTimestamp: '1980-01-01T00:00:00-local',
    limits: PERPLEXITY_LIMITS,
    artifacts,
  };
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  outputs.push({ path: 'dist/perplexity/manifest.json', bytes: manifestBytes });
  if (collection) {
    const collectionFiles = artifacts.map((artifact, i) => ({ path: `perplexity/${artifact.file}`, bytes: outputs[i].bytes }));
    collectionFiles.push(
      { path: 'README.md', bytes: Buffer.from(renderCollectionReadme(artifacts.length)) },
      { path: 'manifest.json', bytes: manifestBytes },
      { path: 'catalog.json', bytes: Buffer.from(serializeCatalog(catalog)) },
      { path: 'CATALOG.md', bytes: Buffer.from(renderCatalogMarkdown(catalog, { linkMode: 'archive' })) },
    );
    outputs.push({ path: 'dist/ai-skills-perplexity-collection.zip', bytes: deterministicZip(collectionFiles) });
  }
  const releaseNames = outputs.map(output => basename(output.path));
  if (new Set(releaseNames).size !== releaseNames.length) throw new Error('Release artifact basenames must be unique');
  const checksumText = [...outputs]
    .sort((a, b) => basename(a.path) < basename(b.path) ? -1 : basename(a.path) > basename(b.path) ? 1 : 0)
    .map(output => `${digest(output.bytes)}  ${basename(output.path)}`)
    .join('\n') + '\n';
  // Basenames match flattened GitHub release downloads; the checksum file excludes itself.
  outputs.push({ path: 'dist/SHA256SUMS', bytes: Buffer.from(checksumText) });
  const changed = [];
  // Inspect every target before writing any; a symlink or stale file never causes partial replacement.
  for (const output of outputs) {
    if (!(await outputMatches(join(root, output.path), output.bytes))) changed.push(output.path);
  }
  if (check && changed.length) throw new Error(`Build drift: ${changed.join(', ')}. Run npm run build.`);
  if (!check) {
    await ensureSafeOutputDirectory(root, 'dist/perplexity');
    for (const output of outputs) {
      if (changed.includes(output.path)) await writeFile(join(root, output.path), output.bytes);
    }
  }
  return { catalog, manifest, changed, collectionPath: collection ? 'dist/ai-skills-perplexity-collection.zip' : null };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const options = parseToolArguments(process.argv.slice(2));
    const { validateRepository } = await import('./validate.mjs');
    await validateRepository(options.root);
    const result = await buildPerplexity(options.root, options);
    console.log(`Perplexity archives ${options.check ? 'verified' : 'built'}: ${result.manifest.artifacts.length} skills.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
