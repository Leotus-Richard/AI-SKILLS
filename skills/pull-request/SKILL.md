---
name: pull-request
description: "Use when opening, drafting or updating a pull request (PR) or merge request: write its title and description from the actual change, with what changed and why, the type of change, how to test it, how to validate the outcome, a checklist ticked only for what was done, and what is left for a future change."
metadata:
  version: "1.0.0"
  author: "Leotus-Richard"
  tags: [pull-request, code-review, git, documentation]
---

# Pull Request

Write a pull request a reviewer can understand, run and trust: what changed and why, how to test it, how to confirm it did its job, a checklist that is true, and what it leaves for later.

## When to use

- The user asks to open, draft, write or update a pull request or merge request.
- A change is finished and needs a description before review.
- An existing description is thin, out of date, or has no test steps.

Not for writing commit messages, reviewing someone else's pull request, or deciding what to build.

## Workflow

1. **Read the change before writing about it.** Read the full diff against the base branch and the list of commits. Describe what the diff does, not what the task was meant to do.
2. **Check that the change is one thing.** If the diff mixes unrelated changes, say so and propose splitting it before you describe it.
3. **Choose the template.** Use the repository's own pull request template when it has one, such as `.github/pull_request_template.md`. Otherwise use `assets/pull-request-template.md`. Keep every heading, in order.
4. **Title.** One imperative line of about 70 characters or fewer that names the outcome: "Reject empty discount codes at checkout", not "Fix bug".
5. **Description.** Two to five sentences on what changed and why, starting with the effect a user or caller will notice. Name anything deliberately left out. Do not list files; the diff does that.
6. **Type of Change.** Mark each box that applies with `[x]` and leave the others. If none fits, add a line saying what the change is.
7. **How to Test.** Numbered steps a reviewer can run as written: the exact commands, in code formatting, and the result each should give. These steps exercise the change: the automated tests, a reproduction, a script.
8. **How to Validate.** Numbered steps that confirm the outcome the change was for. Each step ends with what the reviewer should see: a screen, a response, a log line, a value in the data. Testing shows the code runs; validating shows it does the job. For a change with nothing new to observe, such as a refactor, say what must stay the same and how to check that.
9. **Checklist.** Tick an item only when it is true and you saw it. Leave the others unticked and give the reason after each, for example `- [ ] Tests pass locally (not run: this package has no test suite)`.
   "Documentation updated" is only about documentation kept outside the repository, such as a wiki, a runbook or an external docs site. Tick it when that was updated, and name the page. Documentation inside the repository is part of the diff: it belongs in the Description and under Type of Change, and does not tick this box.
10. **Other Notes.** Say what these changes did not address but a future change should: a known gap, a case left unhandled, a follow-up found along the way, a clean-up put off. For each, say why it is not in this change, and link the issue when one exists. When nothing is left, write "None".
11. **Open it or hand it over.** Open or update the pull request only when the user asked for that. Otherwise return the title and description as text. After opening one, give its link.

## Examples

### A filled-in description

```markdown
## Description
Checkout accepted an empty discount code and charged full price without telling the customer. The API now rejects an empty or whitespace-only code with a 400 and a message the form shows inline. Codes that are well formed but unknown behave as before.

## Type of Change
- [x] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation update

## How to Test
1. Run `npm test -- checkout/discount`. All 14 tests pass, including the 3 new ones for empty codes.
2. Run `npm run lint`. It reports no errors.

## How to Validate
1. Start the app with `npm run dev` and add any item to the cart.
2. At checkout, leave the discount field empty and press Apply. The field shows "Enter a discount code" and the total does not change.
3. Enter `SAVE10` and press Apply. The total drops by 10%, as it did before this change.

## Checklist
- [x] I have performed a self-review of my code
- [x] Tests pass locally
- [ ] Documentation updated (not needed: no wiki page or outside documentation covers discount codes)

## Other Notes
- An expired code is still accepted here and fails later, at payment. Checking expiry needs a change to the discount service, so it is left for a separate pull request.
```

### Example request and expected result

Request: "Write the PR for this branch. I haven't run the tests yet."

Expected result: a specific title and a description with every template heading. "Tests pass locally" is left unticked with the reason "not run", How to Test still names the command a reviewer should run, and Other Notes lists what is left for later or says "None".

## Gotchas

- A ticked box is a claim. An unticked box with a reason helps the reviewer; a ticked box that is untrue misleads them.
- A README or `docs/` change does not tick "Documentation updated". That box is for the wiki and other documentation outside the repository, which a reviewer cannot see in the diff.
- "Run the tests" is not a step. Name the command and the result.
- The commit log is not a description. Write for someone who has not seen the commits.
- Other Notes is for what comes next. A known problem with what is being merged now belongs in the Description, where the reviewer reads it first.
- A pull request is widely readable. Keep credentials, internal hostnames and customer data out of it.
- When the repository's template has more sections than you can fill, write "Not applicable" and why. Do not delete a heading.

## Prerequisites

- The diff and the base branch it will merge into.
- To open a pull request: the hosting service's own tool, such as its command-line client, and the user's request to open one.
- Optional: the `commit-workflow` skill, when it is installed, for preparing the commits. This skill starts once the commits exist.

## Limitations

- It describes and packages a change. It does not review the change for correctness.
- It reports only what it saw. Steps it could not run are written for the reviewer and marked as not run.
- It grants no authority to push a branch or to open, merge or close a pull request.

## Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| The description restates the task, not the change | It was written before reading the diff | Read the diff against the base branch, then rewrite from what it does |
| How to Test and How to Validate say the same thing | Validation was treated as more testing | Keep commands and tests under How to Test; under How to Validate, say what to look at and what should be seen |
| Reviewers ask what the change is for | The description lists files or commits | Lead with the effect on a user or caller, then the reason |
| A box is ticked for something that did not happen | The checklist was filled in from habit | Untick it and give the reason, or do the step and then tick it |
| Other Notes is blank or the heading is gone | Nothing was put off, so the section was skipped | Write "None" under it, so the reviewer knows it was considered |
| One pull request needs two descriptions | It holds unrelated changes | Split it, or name each part and say why they travel together |
| "Documentation updated" is ticked for a README change | In-repository docs were taken for outside documentation | Untick it unless a wiki or other outside page was updated, and name that page when it was |
| The template in use is not the repository's | The repository's template was not looked for | Check `.github/`, the repository root and `docs/` for a pull request template first |
