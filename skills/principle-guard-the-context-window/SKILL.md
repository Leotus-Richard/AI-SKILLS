---
name: principle-guard-the-context-window
description: "Apply when context is filling up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents; keep summaries in the main thread, not raw payloads."
metadata:
  version: "2.0.0"
  author: "Lauren Tan (pstack)"
  tags: [engineering-principles]
---

# Guard the Context Window

Apply when context is filling up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents; keep summaries in the main thread, not raw payloads.

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress.

**Pattern:**
- **Size phases and cap scope.** Limit files per phase, set turn budgets, account for mechanism costs.

_Source: [pstack](https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/pstack/skills/principle-guard-the-context-window/SKILL.md) by Lauren Tan, MIT license (see LICENSE.txt). SOURCE.md lists the changes from the original._
