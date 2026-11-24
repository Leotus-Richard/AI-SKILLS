import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MARKER, buildComment, loadSpector, loadTier1 } from '../scripts/skill-checks-comment.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'skill-checks-comment-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const spector = join(root, 'spector');
  const tier1 = join(root, 'tier1');
  mkdirSync(spector);
  mkdirSync(join(tier1, 'alpha'), { recursive: true });
  writeFileSync(join(spector, 'alpha.json'), JSON.stringify({
    risk_assessment: { recommendation: 'CAUTION' },
    issues: [{ id: 'RA2', severity: 'MEDIUM', category: 'Rogue Agent', pattern: 'Persistence',
      location: { file: 'references/x.md', start_line: 3 }, remediation: 'Remove it.' }],
    suppressed_count: 1,
    analysis_completeness: { status: 'complete' },
  }));
  writeFileSync(join(tier1, 'alpha', 'skillevaluator-tier1.json'), JSON.stringify({
    overall_status: 'incomplete',
    quality_summary: [{ overall_score: 86.8, grade: 'B', dimensions: { correctness: { score: 80 }, reliability: { score: 85 } } }],
    results: [{ validator: 'Security Scan', status: 'incomplete', legacy: { errors: ['parser limit'] } }],
    finding_groups: [
      { severity: 'info', check_name: 'OC-RELOAD', message: 'restart needed' },
      { severity: 'low', check_name: 'quality_reliability', message: 'No limitations | documented' },
      { severity: 'medium', check_name: 'quality_correctness', message: 'metadata.tags missing' },
    ],
  }));
  return { spector, tier1 };
}

test('comment reports SkillSpector findings and Tier 1 results in severity order', t => {
  const dirs = fixture(t);
  const body = buildComment({
    spector: loadSpector(dirs.spector),
    tier1: loadTier1(dirs.tier1),
    runUrl: 'https://example.test/run/1',
    commit: '0123456789abcdef',
  });
  assert.ok(body.startsWith(MARKER), 'marker lets the workflow update its own comment');
  assert.match(body, /\| alpha \| ❌ CAUTION \| 1 \| 1 \| complete \|/);
  assert.match(body, /`RA2` MEDIUM Rogue Agent\/Persistence at `references\/x.md:3`/);
  assert.match(body, /SkillEvaluator Tier 1 · advisory/);
  assert.match(body, /\| alpha \| ⚠️ incomplete \| 86.8 \(B\) \| 80 \| \? \| 85 \| \? \|/);
  assert.match(body, /Security Scan\*\* incomplete: parser limit/);
  assert.ok(body.indexOf('**medium**') < body.indexOf('**low**'), 'medium findings come before low');
  assert.ok(body.indexOf('**low**') < body.indexOf('OC-RELOAD'), 'info notes come last');
  assert.match(body, /updated for 0123456/);
});

test('missing reports are never presented as passing', () => {
  const body = buildComment({ spector: null, tier1: null, enforced: true });
  assert.match(body, /SkillSpector security scan · blocking\n\nDid not run or produced no report/);
  assert.match(body, /SkillEvaluator Tier 1 · blocking\n\nNo skill changed in this pull request/);
  assert.doesNotMatch(body, /✅/);
});
