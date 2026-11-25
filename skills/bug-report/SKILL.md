---
name: bug-report
description: "Use when filing, drafting or tidying a bug report or issue for a defect: write a summary of the bug, steps to reproduce it, the expected behavior, the environment, screenshots and additional notes, from what was actually observed."
metadata:
  version: "1.0.0"
  author: "Leotus-Richard"
  tags: [bug-report, issues, debugging, documentation]
---

# Bug Report

Write a bug report that someone else can reproduce from the report alone: what is wrong, how to make it happen, what should happen, and where it was seen.

## When to use

- The user asks to file, draft or write up a bug, defect or issue.
- A vague complaint such as "export is broken" needs turning into a report someone can act on.
- An existing report is missing steps, versions or the expected result.

Not for requesting a feature, fixing the bug, or writing a pull request.

## Workflow

1. **Check that it is a bug.** A bug is behavior that differs from what the documentation, the specification or an earlier version promises. If it is a feature request or a question, say so and do not file it as a bug.
2. **Reproduce it if you can.** Say in the report whether you reproduced it yourself or are passing on what someone told you.
3. **Choose the template.** Use the repository's own issue template when it has one, usually under `.github/ISSUE_TEMPLATE/`. Otherwise use `assets/bug-report-template.md`. Keep every heading, in order.
4. **Title.** One line naming what fails and where: "CSV export drops rows after the first 1,000", not "Export broken".
5. **Describe the Bug.** One to three sentences: what happens, how often, and who or what it affects. Quote an error message exactly, in code formatting.
6. **Steps to Reproduce.** Numbered steps from a known starting point, with the exact input, command or click at each one. Use the fewest steps that still show the problem, and end with what happens. If it does not happen every time, say how often, such as "3 runs in 10".
7. **Expected Behavior.** What should happen at the last step, and why you expect it: the documentation, the specification, or how a named earlier version behaved.
8. **Environment.** The operating system and its version, the runtime, and the versions of the packages involved. Add the browser, device or settings when they matter. Read versions from the system with a command such as `node --version`. Write "unknown" for anything you could not find out.
9. **Screenshots.** Attach one when the problem is something you see. Paste an error as text, not as a picture of text. If you cannot take a screenshot, write "None" or say what to capture.
10. **Additional Notes.** A workaround, when it started, the last version that worked, related reports, a trimmed log. Label a suspected cause as a guess. When there is nothing, write "None".
11. **File it or hand it over.** Look for an existing report of the same bug first. File the report only when the user asked for that. Otherwise return the title and the report as text.

## Examples

### A filled-in report

```markdown
## Describe the Bug
Exporting a report with more than 1,000 rows produces a CSV that holds only the first 1,000. No error is shown, so the missing rows are easy to miss. It happens on every export.

## Steps to Reproduce
1. Sign in and open Reports, then the "Q3 ledger" report (2,418 rows).
2. Press Export and choose CSV.
3. Open the downloaded file and count the rows: `wc -l q3-ledger.csv` prints `1001`, the header plus 1,000 rows.

## Expected Behavior
The file holds all 2,418 rows. The export page says "Exports include every row in the report", and version 4.1.0 exported this report in full.

## Environment
- OS: macOS 15.1
- Browser: Firefox 143
- App version: 4.2.0 (worked in 4.1.0)
- Package versions: `csv-writer` 1.6.0

## Screenshots
None. The problem is in the downloaded file, not on screen.

## Additional Notes
- Workaround: filter the report into parts of under 1,000 rows and export each.
- A guess, not confirmed: the export may reuse the page size of the on-screen table, which is 1,000.
```

### Example request and expected result

Request: "Users say the export is broken. Write it up as a bug."

Expected result: a report with every template heading. Where the request gave no detail, such as the steps or the versions, the report says "unknown" and lists what to ask the reporter. It does not invent steps or version numbers.

## Gotchas

- An invented version number or step sends the reader to the wrong place. "Unknown" is a useful answer.
- One bug per report. Two problems found together get two reports that link to each other.
- A report describes a problem. A proposed fix belongs under Additional Notes, marked as a suggestion.
- Logs and screenshots travel further than you expect. Take out passwords, access keys, tokens and personal data before attaching them.
- A weakness that could be used against users is not for a public tracker. Follow the project's security policy for reporting it privately.

## Prerequisites

- What was observed: the behavior, the steps and where it happened, or access to the system to find out.
- To file a report: the tracker's own tool and the user's request to file one.

## Limitations

- It records and organizes what is known. It does not find the cause or fix the bug.
- A report written from someone else's account is only as accurate as that account, and says so.
- It cannot take screenshots unless the host provides a way to.

## Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| The maintainer cannot reproduce it | Steps start from an unstated state or skip an input | Start from a known state and give the exact input at each step |
| The report is closed as "works for me" | The environment is missing or too vague | Give the operating system, runtime and package versions, read from the system |
| It is unclear what was wrong | Expected Behavior restates the bug | Say what should happen and what makes you expect it |
| It is closed as a duplicate | Existing reports were not searched | Search the tracker by error message and feature before filing |
| A secret appears in the tracker | A log or screenshot was attached as it came | Remove it at once, rotate the secret, and attach a cleaned copy |
| The report mixes two problems | They were found in the same session | Split it into one report each and link them |
