---
name: negative-space-programming
description: "Use when code relies on optional values, loose data, state transitions, or implicit assumptions: enforce internal invariants with assertions that fail fast. Not for expected user or network errors."
metadata:
  version: "1.0.0"
  author: "Leotus-Richard"
  tags: [assertions, invariants, fail-fast, code-review]
---

# Negative Space Programming

Define what must be true for a code path to be valid, then enforce those conditions at the first point where the code relies on them.

## When to use

- A function relies on an optional field being present.
- Loosely typed data crosses into code with a stricter internal contract.
- State passes through several layers and invalid transitions could corrupt downstream work.
- A review finds silent coercion, unchecked null values, or hidden assumptions.
- The user asks for contract assertions, invariant checks, or negative space programming.

## Workflow

1. Identify the invariant.
   - Inspect parameters, intermediate values, external responses, and state.
   - State the function's worldview: what must be true for this path to work?
2. Assert it where it becomes required.
   - Prefer the language's runtime assertion library.
   - Place the guard before mutation or other side effects.
   - Make the process fail immediately when the invariant is false.
3. Explain the failed contract.
   - Name the value and expected condition in the message.
   - Make the failure point to an upstream bug or invalid internal state.
4. Keep operational errors separate.
   - Validate expected user or network errors through normal error handling.
   - Do not catch or downgrade invariant failures.

## Examples

### TypeScript

```ts
import { strict as assert } from "node:assert";

type Foo = {
    bar?: number;
};

function morphFoo(foo: Foo): number {
    assert(foo.bar !== undefined, "foo.bar must be defined before morphFoo");
    return foo.bar * 5;
}
```

The same example is bundled as an asset, [assets/morph-foo.ts](assets/morph-foo.ts), which loads as a module under Node.js type stripping.

### Example request and expected result

Request: "This function multiplies `foo.bar`, which is optional. Callers always set it first. Make that assumption explicit."

Expected result: an assertion on `foo.bar` before it is used, with a message that names the value and the condition. No default value is substituted for a missing `bar`.

## Gotchas

- Do not use assertions for expected user-input failures. Return the normal user-facing error instead.
- Do not use `console.assert` for invariants. It logs instead of reliably stopping execution.
- Some runtimes can strip assertions from optimized builds. Throw an explicit error when production correctness depends on the check.
- Never mutate state or perform side effects inside an assertion condition.

## Assertions and other guards

- Validation of user input and other external data belongs at the system boundary and uses normal error handling. Assertions cover what internal code relies on after that.
- A fail-fast assertion states an invariant and stops when it is false. That differs from a defensive guard that silently substitutes a default or skips work. When a review removes redundant guards, keep the assertions that enforce a stated invariant.

## Prerequisites

- Nothing to install. Use the assertion facility of the language at hand, such as `node:assert` in Node.js.
- Access to the code being written or reviewed, including its callers when an invariant depends on them.

## Limitations

- It enforces the invariants you state, at the points you choose. It does not discover every assumption in a codebase.
- A runtime assertion reports a violation only when that path runs. It is not a compile-time guarantee.

## Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| An assertion fires on ordinary user input | An expected failure was treated as an invariant | Validate that input at the boundary and return the normal user-facing error |
| The check logs a message but execution continues | A logging assertion such as `console.assert` | Use an assertion that throws |
| The check has no effect in a production build | The runtime stripped assertions | Throw an explicit error for checks that production correctness depends on |
| Behavior changes when assertions are turned off | A side effect inside the assertion condition | Compute the value first, then assert on it |
| An invariant failure is logged and work continues | A broad handler caught and downgraded it | Let invariant failures propagate; handle only operational errors there |
