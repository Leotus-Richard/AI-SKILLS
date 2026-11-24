# Wayfinder operating notes

Prerequisites, limitations, and troubleshooting for [Wayfinder](../SKILL.md). Kept outside SKILL.md so the main file stays under the 16,000-character read limit some agents apply.

## Prerequisites

- The `grill-with-docs` skill, which holds the interview method and the glossary and ADR formats. The installer adds it with Wayfinder.
- A place to keep the decision register between sessions: files, a connected tracker the user asks to use, or copies the user saves and pastes back.
- The latest register and resume packet when resuming. Do not assume another conversation's copy is current.

## Limitations

- Plans only. It does not implement, and a ticket called a task does not authorize execution.
- A text register has no locking, synchronization, or guaranteed persistence; concurrent work needs a shared register or a real tracker.
- Tracker features are used only when available and requested.

## Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| Resuming without the register | Records were not saved or shared | Ask for the latest register and resume packet; otherwise restart charting from the destination |
| Two copies of the map disagree | Concurrent edits to text registers | Reconcile the copies before selecting work, then name one authoritative register |
| A ticket keeps growing | Several questions in one ticket | Split it into precise questions and leave the remainder as fog |
| A tracker write failed or its result is unclear | Missing permission or an ambiguous response | Read the tracker back before retrying; never report an unconfirmed change |
