# Source and contribution notes

Written for Engineering Toolkit v1.3 (archive SHA-256 `7f405a52796e66437fd04795b4ae14cff4b8a1f633437e17313c3c5f03c5e967`), where it was labelled version 1.2.0. The toolkit's manifest records its source as `authored-local-commit-policy`: it was written for the toolkit and adapts no third-party skill. The archive does not record who wrote it.

The repository owner contributed it here under Apache-2.0 (`LICENSE.txt`).

It was added when the toolkit's shared contract file was removed from the other toolkit skills. That file repeated these commit rules in every skill. They now live here once, and the skills that can commit name this skill as an optional companion.

## The gate script is not bundled

The toolkit shipped a helper, `scripts/commit-gate.mjs`, with its own test suite, a reference for it and a policy template. It ran a project's configured check commands and verified identity, message and commit contents. It is left out because this repository's security scan cannot fully analyse a script whose commands are decided at run time, and an incomplete scan fails the blocking skill check. The helper was read before this decision: it used argument arrays without a shell, made no network calls and never committed or pushed, and its 25 test cases passed. Steps 5, 6 and 8 of the workflow now describe the same checks for the agent to do by hand.

Changes at import:

- Steps 5, 6 and 8, the failure boundary and the resources paragraph no longer call the helper. Step 1 no longer mentions its policy template.
- `references/identity.md` and `references/policy.md` have the same substance, with the sentences about the helper and its receipts reworded.
- The toolkit's copy of its shared contract file is not bundled, and Scope no longer tells the agent to read it.
- Scope gains one sentence taken from `references/identity.md`: when a repository's own convention conflicts with the no-credit rule, stop and ask.
- The closing paragraph named the toolkit's `tdd`, `regression-tdd` and `work-tracking` skills, which are not in this library. It now describes them by purpose.
- "under the shared bounds" is dropped from the failure boundary. The two-round limit stays.
- Toolkit metadata (`profile`, `invocation`) is replaced with `version`, `author` and `tags`, and the compatibility line no longer asks for Node.js. This repository starts the skill at 1.0.0.

SHA-256 of each file in the toolkit archive:

- `SKILL.md`: `8c70186e6fe904b35192fc9cf4f3afb6e457bc19281476eb3b0902fa46e6fce9` (changed as above)
- `references/identity.md`: `183686e91c9d51d42dd6c71b964e906adcba798aefb6e525a3e48b3fad1f8012` (changed as above)
- `references/policy.md`: `f1e587b821c7ba348f04dabba4ab52d4376a0dc810b794a12d42bb28961659ee` (changed as above)
- `assets/message.txt`: `00c13d6a46c7d18e094f4f3bd335c2f39e6c37dc82b1ae0fb8695152e4dc04fb` (unchanged)
