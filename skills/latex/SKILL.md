---
name: latex
description: "Format mathematical expressions for the chosen Markdown/chat renderer while preserving formula semantics. Use for inline/display math and literal LaTeX examples; not full TeX documents, package compilation or a guarantee of every host's rendering support."
metadata:
  version: "1.0.0"
  author: "Leotus-Richard"
  tags: [design-and-formatting]
---

# LaTeX Response Formatting

## Workflow

1. Read `references/local-execution-contract.md` and identify the actual output destination. When a specific renderer's conventions matter, such as KaTeX in the GitHub Copilot app, check that renderer's documentation.
2. Follow the active host/user's delimiter rules. For this toolkit's default chat output use `\( ... \)` inline and `\[ ... \]` for display math, with display delimiters on their own lines. Do not assume Copilot, GitHub and every app/CLI use identical math rendering.
3. Preserve the expression's meaning, symbols, units and signs. Convert formatting only; do not silently simplify, correct numerical claims or alter code, citations, identifiers or shell/currency strings.
4. Keep renderable math outside ordinary code fences/inline code. Use code formatting only for literal source examples. Separate adjacent inline expressions and use `\text{...}` for prose within an expression.
5. Use only the target renderer's supported subset. Package imports, preambles and full TeX compilation are not part of this response-formatting skill. If unsupported syntax or destination ambiguity materially affects output, state the limitation or ask rather than asserting rendering success.
6. Check the written delimiters and source text. Claim an actual render check only if performed on the intended host. When editing a local work artifact, preserve its existing approved format unless the user requests conversion.

## Default output

The requested content with correctly scoped math formatting and unchanged semantics. No persistent app preference, automatic publication or invented compatibility claims.

## Reference and provenance

This hub was written for Engineering Toolkit v1.3 as a portable adaptation of a LaTeX formatting skill bundled with the GitHub Copilot app. That original is not redistributed here. The repository owner contributed this hub under Apache-2.0; see `LICENSE.txt`.
