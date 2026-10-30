#!/usr/bin/env node
/**
 * Structural validation only: no tracker access, mutation, or evidence verification.
 * Usage: node scripts/validate-plan.mjs plan.json
 *        node scripts/validate-plan.mjs - < plan.json
 * Exit codes: 0 valid structure, 1 validation errors, 2 usage/read/JSON errors.
 * Import: validatePlan(plan) returns [{ code, path, message }, ...].
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KINDS = new Set(['epic', 'milestone', 'feature', 'story', 'task', 'bug']);
const STATUSES = new Set(['backlog', 'ready', 'in-progress', 'review', 'done', 'canceled']);
const GOAL_MODES = new Set(['bounded', 'ongoing']);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasText = value => typeof value === 'string' && value.trim().length > 0;

/**
 * Validate a canonical JSON plan. External references are declared evidence stubs,
 * not traversed nodes; passing cannot establish external acyclicity, acceptance
 * quality, real customer readiness, or that a user authorized an exception.
 */
export function validatePlan(plan) {
  const errors = [];
  const add = (code, path, message) => errors.push({ code, path, message });
  const text = (value, path) => {
    if (!hasText(value)) add('NONEMPTY_TEXT_REQUIRED', path, 'Expected nonempty text.');
  };
  const textList = (value, path, required = true) => {
    if (!Array.isArray(value)) {
      add('ARRAY_REQUIRED', path, 'Expected an array of nonempty strings.');
      return [];
    }
    if (required && value.length === 0) add('NONEMPTY_ARRAY_REQUIRED', path, 'At least one entry is required.');
    value.forEach((entry, index) => text(entry, `${path}[${index}]`));
    return value;
  };

  if (!isRecord(plan)) {
    add('PLAN_OBJECT_REQUIRED', '$', 'Expected a plan object.');
    return errors;
  }
  if (plan.schemaVersion !== 1) add('SCHEMA_VERSION', '$.schemaVersion', 'Expected schemaVersion 1.');
  if (!Array.isArray(plan.items)) {
    add('ITEMS_ARRAY_REQUIRED', '$.items', 'Expected an items array.');
    return errors;
  }
  if (plan.items.length === 0) add('NONEMPTY_ITEMS_REQUIRED', '$.items', 'At least one work item is required.');

  const items = new Map();
  const itemPaths = new Map();
  const records = [];
  plan.items.forEach((item, index) => {
    const path = `$.items[${index}]`;
    if (!isRecord(item)) {
      add('ITEM_OBJECT_REQUIRED', path, 'Expected a work-item object.');
      return;
    }
    records.push({ item, path });
    text(item.id, `${path}.id`);
    if (hasText(item.id)) {
      if (items.has(item.id)) add('DUPLICATE_ID', `${path}.id`, `Duplicate item ID: ${item.id}.`);
      else {
        items.set(item.id, item);
        itemPaths.set(item.id, path);
      }
    }
    if (!KINDS.has(item.kind)) add('INVALID_KIND', `${path}.kind`, 'Unknown work-item kind.');
    text(item.title, `${path}.title`);
    text(item.outcome, `${path}.outcome`);
    textList(item.acceptanceCriteria, `${path}.acceptanceCriteria`);
    textList(item.verification, `${path}.verification`);
    if (item.parentId !== undefined && item.parentId !== null && !hasText(item.parentId)) {
      add('PARENT_ID_REQUIRED', `${path}.parentId`, 'Use null for a root or a known local parent ID.');
    }
    if (item.status !== undefined && !STATUSES.has(item.status)) {
      add('INVALID_STATUS', `${path}.status`, 'Unknown canonical status.');
    }
    if ((item.kind === 'epic' || item.kind === 'milestone') && !GOAL_MODES.has(item.goalMode)) {
      add('GOAL_MODE_REQUIRED', `${path}.goalMode`, 'A goal must declare bounded or ongoing.');
    }
    if (item.customerReady !== undefined && typeof item.customerReady !== 'boolean') {
      add('CUSTOMER_READY_BOOLEAN', `${path}.customerReady`, 'Expected a boolean declaration.');
    }
    if (item.doneEvidence !== undefined || item.status === 'done') {
      textList(item.doneEvidence, `${path}.doneEvidence`, item.status === 'done');
    }
    if (item.status === 'done' && item.kind === 'feature' && item.customerReady !== true) {
      add('FEATURE_NOT_CUSTOMER_READY', `${path}.customerReady`, 'A done feature requires customerReady: true.');
    }
    if (item.status === 'done' && (item.kind === 'epic' || item.kind === 'milestone')
        && item.goalMode === 'ongoing' && !hasText(item.closureDecision)) {
      add('ONGOING_GOAL_CLOSURE_REQUIRED', `${path}.closureDecision`, 'Closing an ongoing goal requires an explicit closure decision.');
    }
  });

  const external = new Map();
  const externalInput = plan.externalReferences === undefined ? [] : plan.externalReferences;
  if (!Array.isArray(externalInput)) {
    add('EXTERNAL_ARRAY_REQUIRED', '$.externalReferences', 'Expected an array of external reference stubs.');
  } else {
    externalInput.forEach((reference, index) => {
      const path = `$.externalReferences[${index}]`;
      if (!isRecord(reference)) {
        add('EXTERNAL_OBJECT_REQUIRED', path, 'Expected an external reference object.');
        return;
      }
      text(reference.id, `${path}.id`);
      text(reference.url, `${path}.url`);
      if (hasText(reference.url)) {
        try {
          const url = new URL(reference.url);
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported reference protocol');
        } catch {
          add('INVALID_EXTERNAL_URL', `${path}.url`, 'Expected an absolute HTTP(S) reference URL.');
        }
      }
      if (hasText(reference.id)) {
        if (items.has(reference.id) || external.has(reference.id)) {
          add('DUPLICATE_ID', `${path}.id`, `Ambiguous or duplicate reference ID: ${reference.id}.`);
        } else external.set(reference.id, reference);
      }
    });
  }

  const parents = new Map([...items.keys()].map(id => [id, []]));
  const dependencies = new Map([...items.keys()].map(id => [id, []]));
  const children = new Map([...items.keys()].map(id => [id, []]));

  for (const { item, path } of records) {
    const parentId = item.parentId === undefined ? null : item.parentId;
    const parent = items.get(parentId);
    if (hasText(parentId)) {
      if (parentId === item.id) add('SELF_PARENT', `${path}.parentId`, 'An item cannot contain itself.');
      if (!parent) {
        add(external.has(parentId) ? 'EXTERNAL_PARENT_FORBIDDEN' : 'UNKNOWN_PARENT',
          `${path}.parentId`, 'A parent must identify a local work item.');
      } else if (hasText(item.id) && parentId !== item.id && items.get(item.id) === item) {
        parents.get(item.id).push(parentId);
        children.get(parentId).push(item.id);
      }
    }

    switch (item.kind) {
      case 'epic':
      case 'milestone':
        if (parentId !== null) add('GOAL_MUST_BE_ROOT', `${path}.parentId`, 'Epics and milestones are roots.');
        break;
      case 'feature':
        if (!parent || !['epic', 'milestone'].includes(parent.kind)) {
          add('FEATURE_PARENT', `${path}.parentId`, 'A feature must have an epic or milestone parent.');
        }
        break;
      case 'story':
        if (!parent || parent.kind !== 'feature') add('STORY_PARENT', `${path}.parentId`, 'A story must have a feature parent.');
        break;
      case 'task':
        if (!parent || parent.kind !== 'story') add('TASK_PARENT', `${path}.parentId`, 'A task must have a story parent.');
        break;
      case 'bug':
        if (parentId !== null) {
          if (!parent || parent.kind !== 'story') {
            add('BUG_PARENT', `${path}.parentId`, 'An explicitly parented bug may belong to a story only.');
          }
          if (!isRecord(item.bugParentException) || item.bugParentException.requestedBy !== 'user'
              || !hasText(item.bugParentException.reason)) {
            add('BUG_PARENT_EXCEPTION_REQUIRED', `${path}.bugParentException`,
              'A parented bug requires the recorded user request and a nonempty reason.');
          }
        } else if (item.bugParentException !== undefined) {
          add('BUG_EXCEPTION_WITHOUT_PARENT', `${path}.bugParentException`, 'A root bug needs no parent exception.');
        }
        break;
      default:
        break;
    }
    if (item.kind !== 'bug' && item.bugParentException !== undefined) {
      add('BUG_EXCEPTION_ON_OTHER_KIND', `${path}.bugParentException`, 'Only a parented bug uses this exception.');
    }

    for (const field of ['dependsOn', 'relatedTo']) {
      if (field === 'relatedTo' && item[field] === undefined) continue;
      const targets = textList(item[field] === undefined ? [] : item[field], `${path}.${field}`, false);
      const seen = new Set();
      targets.forEach((target, index) => {
        if (!hasText(target)) return;
        const edgePath = `${path}.${field}[${index}]`;
        const duplicate = seen.has(target);
        if (duplicate) add('DUPLICATE_EDGE', edgePath, `Repeated ${field} target: ${target}.`);
        seen.add(target);
        if (target === item.id) add('SELF_EDGE', edgePath, 'An item cannot depend on or relate to itself.');
        if (!items.has(target) && !external.has(target)) add('UNKNOWN_REFERENCE', edgePath, `Unknown target ID: ${target}.`);
        if (field === 'dependsOn' && items.has(target) && target !== item.id
            && hasText(item.id) && items.get(item.id) === item && !duplicate) {
          dependencies.get(item.id).push(target);
        }
      });
    }
  }

  let pureCycle = false;
  detectCycles(parents, cycle => {
    pureCycle = true;
    add('CONTAINMENT_CYCLE', '$.items', `Containment cycle: ${cycle.join(' -> ')}.`);
  });
  detectCycles(dependencies, cycle => {
    pureCycle = true;
    add('DEPENDENCY_CYCLE', '$.items', `Dependency cycle: ${cycle.join(' -> ')}.`);
  });

  // A dependency needs the prerequisite's completed result. A parent's Done also
  // needs every child Done. These two valid DAGs can still deadlock when combined.
  // Skip this extra diagnostic if a pure cycle has already made the plan invalid.
  if (!pureCycle) {
    const completion = new Map([...items.keys()].map(id => [id, new Set()]));
    for (const [dependent, prerequisites] of dependencies) {
      for (const prerequisite of prerequisites) completion.get(prerequisite).add(dependent);
    }
    for (const [parent, childIds] of children) {
      for (const child of childIds) completion.get(child).add(parent);
    }
    const graph = new Map([...completion].map(([id, targets]) => [id, [...targets]]));
    detectCycles(graph, cycle => add('COMPLETION_CYCLE', '$.items', `Required-completion cycle: ${cycle.join(' -> ')}.`));
  }

  for (const [id, childIds] of children) {
    if (items.get(id).status !== 'done') continue;
    for (const childId of childIds) {
      if (items.get(childId).status !== 'done') {
        add('DONE_PARENT_UNDONE_CHILD', `${itemPaths.get(id)}.status`, `Done parent still contains a child that is not done: ${childId}.`);
      }
    }
  }
  return errors;
}

// Iterative traversal avoids recursion limits on a large imported plan.
function detectCycles(graph, report) {
  const color = new Map();
  for (const start of graph.keys()) {
    if (color.has(start)) continue;
    const stack = [{ id: start, next: 0 }];
    const positions = new Map([[start, 0]]);
    color.set(start, 1);
    while (stack.length) {
      const frame = stack[stack.length - 1];
      const neighbors = graph.get(frame.id) ?? [];
      if (frame.next === neighbors.length) {
        color.set(frame.id, 2);
        positions.delete(frame.id);
        stack.pop();
        continue;
      }
      const next = neighbors[frame.next++];
      if (color.get(next) === 1) report([...stack.slice(positions.get(next)).map(entry => entry.id), next]);
      else if (!color.has(next)) {
        color.set(next, 1);
        positions.set(next, stack.length);
        stack.push({ id: next, next: 0 });
      }
    }
  }
}

function main(args) {
  const usage = 'Usage: node scripts/validate-plan.mjs <plan.json|->';
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(usage);
    console.log('Validate structure only; no tracker writes or external graph traversal.');
    return 0;
  }
  if (args.length !== 1) {
    console.error(usage);
    return 2;
  }
  let source;
  try { source = readFileSync(args[0] === '-' ? 0 : args[0], 'utf8'); }
  catch {
    console.error('Unable to read the JSON plan.');
    return 2;
  }
  let plan;
  try { plan = JSON.parse(source); }
  catch {
    console.error('Unable to parse the plan as JSON.');
    return 2;
  }
  const errors = validatePlan(plan);
  if (errors.length) {
    for (const error of errors) console.error(`${error.code} ${error.path}: ${error.message}`);
    return 1;
  }
  console.log('Valid plan structure. External graph, evidence, and user authority were not verified.');
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
