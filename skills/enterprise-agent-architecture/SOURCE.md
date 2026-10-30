# Source and adaptation notes

Source: the Enterprise Agent Architecture text supplied by the repository owner on 29 October 2026. Contributed under the repository's Apache-2.0 license; its notice is bundled in LICENSE.txt.

Original attachment SHA-256: `f6714e19e13d7d41d8e292457c7e037f91cec71908212b4d59ee37afe47ac254`.

The source referenced a long-form architecture file that was not supplied. This standalone version removes those unavailable-resource pointers, retains the supplied architecture guidance, adds version-checking guidance for the framework selection heuristic, and includes one example request and expected result. The missing long-form document and its additional taxonomy or framework deep-dives are not represented as bundled content.

Two import clarifications preserve the design intent: observed live state does not override normative policy or authorize an action, and causal audit records use approval receipt references and redacted evidence instead of logging approval tokens or unrestricted payloads.

This import does not independently verify the source's framework capabilities or governance assertions. Check current primary documentation for version-specific implementation work. The architecture conventions are design guidance; importing this file does not authorize live operations or establish that any proposed control is enforced.
