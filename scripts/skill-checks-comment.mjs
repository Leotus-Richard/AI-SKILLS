#!/usr/bin/env node
// Build the pull request comment for the "Skill checks" workflow from the
// SkillSpector and SkillEvaluator Tier 1 JSON reports. Prints Markdown.
//
// Usage: node scripts/skill-checks-comment.mjs --spector DIR --tier1 DIR
//          [--enforced true|false] [--run-url URL] [--commit SHA]
// --spector holds <skill>.json from `skillspector scan --format json`.
// --tier1 holds <skill>/skillevaluator-tier1.json from `skillevaluator tier1`.
// Missing directories are reported as "did not run", never as passing.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MARKER = '<!-- skill-checks-report -->';
const MAX_LENGTH = 60000; // GitHub rejects comment bodies over 65,536 characters.
const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'info'];

const escapeCell = value => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const listDir = dir => (dir && existsSync(dir) ? readdirSync(dir).sort() : null);

export function loadSpector(dir) {
  const names = listDir(dir);
  if (names === null) return null;
  return names.filter(name => name.endsWith('.json')).map(name => {
    const data = readJson(join(dir, name));
    return {
      skill: name.slice(0, -'.json'.length),
      recommendation: data.risk_assessment?.recommendation ?? '?',
      issues: data.issues ?? [],
      suppressed: data.suppressed_count ?? 0,
      coverage: data.analysis_completeness?.status ?? '?',
    };
  });
}

export function loadTier1(dir) {
  const names = listDir(dir);
  if (names === null) return null;
  return names.filter(name => existsSync(join(dir, name, 'skillevaluator-tier1.json'))).map(name => {
    const data = readJson(join(dir, name, 'skillevaluator-tier1.json'));
    const quality = (data.quality_summary ?? [])[0] ?? {};
    const results = data.results ?? [];
    const withStatus = status => results.filter(r => String(r.status).toLowerCase() === status);
    return {
      skill: name,
      status: data.overall_status ?? '?',
      score: quality.overall_score,
      grade: quality.grade,
      dimensions: Object.fromEntries(Object.entries(quality.dimensions ?? {}).map(([k, v]) => [k, v?.score])),
      failed: withStatus('failed').map(r => r.validator),
      incomplete: withStatus('incomplete').map(r => ({
        check: r.validator,
        reasons: r.legacy?.errors ?? [],
      })),
      findings: (data.finding_groups ?? []).map(g => ({
        severity: String(g.severity ?? 'info').toLowerCase(),
        check: g.check_name ?? '?',
        message: g.message ?? '',
      })),
    };
  });
}

const statusIcon = status => ({ passed: '✅', failed: '❌', incomplete: '⚠️' })[String(status).toLowerCase()] ?? '❔';

function spectorSection(spector) {
  const lines = ['### SkillSpector security scan · blocking', ''];
  if (spector === null) return [...lines, 'Did not run or produced no report. Check the job log.', ''];
  if (!spector.length) return [...lines, 'No skills were scanned.', ''];
  lines.push('| Skill | Result | Active findings | Suppressed | Coverage |', '| --- | --- | --- | --- | --- |');
  for (const s of spector) {
    const icon = s.issues.length ? '❌' : '✅';
    lines.push(`| ${escapeCell(s.skill)} | ${icon} ${escapeCell(s.recommendation)} | ${s.issues.length} | ${s.suppressed} | ${escapeCell(s.coverage)} |`);
  }
  const active = spector.flatMap(s => s.issues.map(issue => ({ skill: s.skill, issue })));
  if (active.length) {
    lines.push('', '**Active findings.** Fix them, or accept a reviewed false positive in `.skillspector-baseline.yaml` with a reason:', '');
    for (const { skill, issue } of active) {
      const loc = issue.location ?? {};
      lines.push(`- **${skill}** \`${issue.id}\` ${issue.severity} ${issue.category}/${issue.pattern} at \`${loc.file}:${loc.start_line}\`: ${issue.remediation ?? ''}`);
    }
  }
  return [...lines, ''];
}

function tier1Section(tier1, enforced) {
  const mode = enforced ? 'blocking' : 'advisory';
  const lines = [`### SkillEvaluator Tier 1 · ${mode}`, ''];
  if (tier1 === null || !tier1.length) {
    return [...lines,
      'No skill changed in this pull request, so Tier 1 did not evaluate any. ' +
      'For a full report, run **Skill checks** manually with `scan-mode: all`.', ''];
  }
  lines.push(
    '| Skill | Status | Quality | Correctness | Discoverability | Reliability | Efficiency |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  );
  for (const t of tier1) {
    const d = t.dimensions;
    const score = t.score === undefined ? '?' : `${t.score}${t.grade ? ` (${t.grade})` : ''}`;
    lines.push(`| ${escapeCell(t.skill)} | ${statusIcon(t.status)} ${escapeCell(t.status)} | ${score} | ${d.correctness ?? '?'} | ${d.discoverability ?? '?'} | ${d.reliability ?? '?'} | ${d.efficiency ?? '?'} |`);
  }
  lines.push('');
  for (const t of tier1) {
    const counts = SEVERITY_ORDER
      .map(sev => [sev, t.findings.filter(f => f.severity === sev).length])
      .filter(([, n]) => n)
      .map(([sev, n]) => `${n} ${sev}`)
      .join(', ');
    lines.push(`<details><summary><b>${escapeCell(t.skill)}</b>: ${escapeCell(t.status)}${counts ? `, ${counts}` : ''}</summary>`, '');
    for (const c of t.failed) lines.push(`- ❌ **${c}** failed.`);
    for (const c of t.incomplete) {
      lines.push(`- ⚠️ **${c.check}** incomplete${c.reasons.length ? `: ${c.reasons.join(' ')}` : '.'}`);
    }
    const sorted = [...t.findings].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
    for (const f of sorted.filter(f => f.severity !== 'info')) lines.push(`- **${f.severity}** ${f.check}: ${f.message}`);
    const notes = sorted.filter(f => f.severity === 'info');
    if (notes.length) {
      lines.push('', '_Agent compatibility notes:_');
      for (const f of notes) lines.push(`- ${f.check}: ${f.message}`);
    }
    lines.push('', '</details>', '');
  }
  return lines;
}

export function buildComment({ spector, tier1, enforced = false, runUrl = '', commit = '' }) {
  const footer = [
    runUrl ? `[Full reports and logs](${runUrl})` : '',
    commit ? `updated for ${commit.slice(0, 7)}` : '',
  ].filter(Boolean).join(' · ');
  let body = [
    MARKER,
    '## Skill checks',
    '',
    ...spectorSection(spector),
    ...tier1Section(tier1, enforced),
    'The quality score measures structure, not whether a skill helps an agent; use a Tier 3 run (`skill-eval.yml`) for that.',
    footer ? `\n${footer}` : '',
  ].join('\n');
  if (body.length > MAX_LENGTH) {
    body = `${body.slice(0, MAX_LENGTH)}\n\n_Truncated. See the full reports in the workflow run._`;
  }
  return `${body.trimEnd()}\n`;
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith('--') || value === undefined) throw new Error(`Bad argument near ${key ?? '(end)'}`);
    options[key.slice(2)] = value;
  }
  return options;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  process.stdout.write(buildComment({
    spector: loadSpector(options.spector),
    tier1: loadTier1(options.tier1),
    enforced: options.enforced === 'true',
    runUrl: options['run-url'] ?? '',
    commit: options.commit ?? '',
  }));
}
