# Source and contribution notes

Original skill by the repository owner, written in their private Notion Skills database (page last edited 11 November 2026) and contributed here under Apache-2.0 (`LICENSE.txt`). No third-party source is involved.

Changes at import on 24 November 2026:

- Converted from Notion to Markdown. The opening sentence, "When to use", "Workflow", the TypeScript example and "Gotchas" are the author's text. One word changed: the third gotcha used the verb "remove" for what optimized builds do to assertions, and SkillSpector reports that wording as a HIGH self-modification finding (rule RA1). It now says "strip". A baseline rule was not used, because rule paths are relative to each skill and it would have applied to every skill's `SKILL.md`.
- The description now starts with its "Use when" trigger and says what the skill is not for, so agents can tell it apart from boundary-validation and guard-cleanup skills. The original read: "Enforce internal invariants with explicit assertions that fail fast. Use when writing, reviewing, refactoring, or debugging code with optional values, loose data, state transitions, or implicit assumptions."
- The attached `morph-foo.ts` is bundled as `assets/morph-foo.ts` with one fix: its last line exported the type `Foo` as a value (`export { morphFoo, Foo }`), which fails to load under Node.js type stripping and TypeScript's `isolatedModules`. It now reads `export { morphFoo, type Foo }`.
- Added, from the skill's own guidance: an example request with its expected result, "Assertions and other guards", Prerequisites, Limitations and Troubleshooting.

Checked at import: `assets/morph-foo.ts` was loaded with Node.js 26.13.1 (built-in type stripping). `morphFoo({ bar: 2 })` returned 10, and `morphFoo({})` threw an `AssertionError` with the message "foo.bar must be defined before morphFoo". It was not type-checked with `tsc`.
