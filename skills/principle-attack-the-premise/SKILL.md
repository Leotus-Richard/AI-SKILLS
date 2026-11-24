---
name: principle-attack-the-premise
description: "Apply when two or more fixes that share one premise have failed the same gate. Take a census of which actors hold the imbalance before the next fix, then question the premise instead of writing another fix that assumes it."
metadata:
  version: "2.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-principles]
---

# Attack the Premise

When two or more fixes that share one premise have failed the same gate, suspect the premise, not the fixes.

**Why:** Each failure under a shared premise is evidence about the premise.

**Pattern:**
- **Write the premise down.** The premise is the one sentence that every failed fix assumed.
- **Take a census before the next fix.** Count the imbalance per actor. The census shows which actors hold the imbalance, not how large it is. Write the census as a rerunnable script per Build the Lever (the **principle-build-the-lever** skill).
- **Read the skew.** If the same few actors hold most of the imbalance on every run, something assigns them that role. Find what assigns the role. That assignment is the next "why" per Fix Root Causes (the **principle-fix-root-causes** skill).
- **Remove the asymmetry instead of compensating for it**, per the Laziness Protocol (the **principle-laziness-protocol** skill). Rotate the role between actors, randomize the assignment, or move the role, so that no actor holds it on every run. A return path, a shared pool, a batched hand-off, or a periodic rebalance leaves the assignment in place and adds work on every run.

**Stop:**
- Do not start the next fix before the premise is written down and the census exists.
- If the census is even across actors, the premise is not the cause. Look for the cause elsewhere and keep the census as evidence.

This principle is distinct from Redesign from First Principles (the **principle-redesign-from-first-principles** skill), which rebuilds a design around a new requirement. It questions a fact the current design assumes.

Skills named here are optional. Apply this principle without them when they are not installed.

_Source: [pstack](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-attack-the-premise/SKILL.md) by Lauren Tan, MIT license (see LICENSE.txt). SOURCE.md lists the changes from the original._
