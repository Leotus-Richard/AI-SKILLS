import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectSkillFiles } from '../scripts/catalog.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('pinned installer places complete skills for Codex, Cursor and Claude in an isolated project', { timeout: 60_000 }, async t => {
  const fixture = mkdtempSync(join(tmpdir(), 'ai-skills-installer-'));
  t.after(() => {
    assert.equal(dirname(resolve(fixture)), resolve(tmpdir()));
    rmSync(fixture, { recursive: true, force: true });
  });
  const project = join(fixture, 'project');
  const profile = join(fixture, 'profile');
  mkdirSync(project);
  mkdirSync(profile);
  // Override only this child process. The contributor's profile is not an install target.
  const environment = {
    ...process.env,
    HOME: profile,
    USERPROFILE: profile,
    APPDATA: join(profile, 'appdata'),
    LOCALAPPDATA: join(profile, 'localappdata'),
    XDG_CONFIG_HOME: join(profile, 'config'),
    XDG_DATA_HOME: join(profile, 'data'),
    XDG_CACHE_HOME: join(profile, 'cache'),
    XDG_STATE_HOME: join(profile, 'state'),
    CODEX_HOME: join(profile, '.codex'),
    CLAUDE_CONFIG_DIR: join(profile, '.claude'),
    NPM_CONFIG_CACHE: join(profile, 'npm-cache'),
    DISABLE_TELEMETRY: '1',
    DO_NOT_TRACK: '1',
    NODE_DISABLE_COMPILE_CACHE: '1',
    CI: '1',
  };
  const installed = JSON.parse(readFileSync(join(repoRoot, 'node_modules', 'skills', 'package.json'), 'utf8'));
  assert.equal(installed.version, '1.7.4');
  const command = spawnSync(process.execPath, [
    join(repoRoot, 'node_modules', 'skills', 'bin', 'cli.mjs'),
    'add', join(repoRoot, 'skills'), '--skill', '*',
    '--agent', 'codex', 'claude-code', 'cursor', '--copy', '--yes',
  ], { cwd: project, env: environment, encoding: 'utf8', timeout: 45_000, maxBuffer: 4_000_000 });
  assert.equal(command.error, undefined, command.error?.message);
  assert.equal(command.status, 0, `${command.stdout}\n${command.stderr}`);

  const registry = JSON.parse(readFileSync(join(repoRoot, 'registry', 'skills.json'), 'utf8'));
  // These are the CLI1.7.4 project paths. Codex and Cursor share the canonical directory.
  for (const base of ['.agents/skills', '.claude/skills']) {
    for (const { name } of registry.skills) {
      const sourceFiles = await collectSkillFiles(join(repoRoot, 'skills', name));
      const target = join(project, base, name);
      const targetFiles = await collectSkillFiles(target);
      assert.deepEqual(targetFiles.map(f => f.path), sourceFiles.map(f => f.path));
      for (const source of sourceFiles) {
        assert.deepEqual(readFileSync(join(target, source.path)), source.bytes, `${base}/${name}/${source.path}`);
      }
    }
  }
  assert.ok(existsSync(join(project, 'skills-lock.json')), 'project installation should retain its source lock');
});
