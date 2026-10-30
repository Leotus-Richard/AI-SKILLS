---
name: enterprise-agent-architecture
description: Design, review, or document governed enterprise AI agents using the Two-Plane blueprint (Domain Knowledge Plane + Agent Capability Plane), eight design pillars, T0–T5 source authority tiers, five-mechanism hybrid retrieval, intent-scoped tool gateways, risk-tiered governance (Low/Medium/High with HITL), OpenTelemetry auditability, and nine-dimension evaluation. Use this whenever the user is architecting a domain-specific knowledge agent, ops/diagnostic agent, or multi-agent system; choosing between Microsoft Agent Framework, Google ADK/Gemini Enterprise, OpenAI Agents SDK, CrewAI or LangGraph; defining agent guardrails, approval gates, tool permissions or blast radius; or writing an agent design doc, ADR, capability contract or governance baseline — even if they just say "build an agent for our platform" or "how should we govern our agents".
---

# Enterprise Agent Architecture

A domain agent is not a chatbot with documents attached. It is a **governed reasoning system** that establishes facts from ranked evidence, models domain semantics explicitly, and takes bounded actions under identity and policy. Use this skill to drive design conversations, produce design docs, and review existing agent architectures against that bar.

This is a self-contained design and review guide. For framework-specific APIs and platform support, consult the current official documentation for the selected framework before making implementation recommendations.

## How to work

1. **Start at the boundary, not the tech.** Before models, RAG, MCP, or vector DBs, pin down who the agent serves, what domain it owns, what it refuses, and which of the three modes it covers. Ask the user if this isn't clear — everything downstream depends on it.
2. **Walk the eight pillars in order.** Each pillar constrains the next; skipping ahead (e.g., designing retrieval before the knowledge model) is the most common failure.
3. **Make governance explicit.** Map every tool to a risk tier and operation class. Unclassified tools are the main source of production incidents.
4. **Keep it domain-neutral unless the user supplies specifics.** Use generic examples (e.g., "a GPU compute platform", `PLAT-1042`) rather than inventing project names.
5. **Deliver traceable outputs.** Design docs should cite which pillar each decision serves and end with open questions drawn from the 30-question checklist.
## The three operating modes

| Mode | Purpose | Example |
| --- | --- | --- |
| Knowledge | Explain concepts, policies, how things work | "How does fair-share scheduling work?" |
| Diagnostic | Investigate live state and root causes | "Why isn't this pod getting a GPU?" |
| Action | Mutate external state | "Cordon these nodes", "Open an incident" |

Conflating modes in one undifferentiated prompt loop lets diagnostic reasoning prematurely trigger mutations. Deliverable: a written **capability contract** stating what the agent owns and does not.

## The eight pillars

1. **Domain boundary & jobs-to-be-done** — capability contract; top 20 user questions/jobs.
2. **Knowledge model** — an ontology, not a bag of chunks: entities, relationships (typed triples like `Workload submitted_to Queue`), vocabulary, aliases, identifiers, states, lifecycle, ownership, policies, invariants.
3. **Sources & authority** — classify every source by tier (below) and freshness.
4. **Retrieval & grounding** — hybrid retrieval planned per question type; every important assertion traceable to evidence.
5. **Reasoning** — evidence-first (retrieve → establish facts → identify conflicts → reason → answer), never "reason from model knowledge, then search for support". Label claims as **Confirmed / Inferred / Unknown / Conflicting**.
6. **Tools & actions** — layers stay separate (Knowledge → Reasoning → Tools → Actions); tools mounted per intent through a gateway.
7. **Security & governance** — identity, data authorization, action authorization, tenant isolation, tool security, auditability, human approval.
8. **Evaluation & feedback** — regression suite across nine dimensions; failures feed back into docs, retrieval, prompts, or tools.
## Source authority tiers

| Tier | Source | Meaning |
| --- | --- | --- |
| T0 | Live system / API | Current truth |
| T1 | Policy / specification / approved config | Normative truth |
| T2 | Maintained engineering docs | Authoritative explanation |
| T3 | Runbooks / wiki | Operational guidance |
| T4 | Work items / incidents | Historical evidence |
| T5 | Chat / email / meetings | Discussion and context |

Precedence: **live state > approved configuration > docs > history > discussion.** Similarity search alone will happily surface a T5 "we might raise it to 16" over the T0 value of 12 because chat phrasing resembles user questions — so retrieval must be authority-aware.

Use these tiers to establish observed state and evidence precedence. A live observation that conflicts with approved policy is a discrepancy to diagnose; it does not override normative policy or grant action authorization.

## Five retrieval mechanisms

| Mechanism | Good for | Backed by |
| --- | --- | --- |
| Semantic | Conceptual "how does X work" | Vector search |
| Exact | Error codes, identifiers (`PLAT-1042`) | Keyword / BM25 |
| Structured | Current config, quotas | Live APIs, databases, metrics |
| Relationship | Ownership, dependency, blast radius | Knowledge graph |
| Temporal | "What changed recently?" | Git, incidents, deployments, work items |

Pipeline: question → intent & entity recognition → retrieval planner → fan-out (search/vector/graph/APIs) → authority-weighted evidence ranking → reasoning → grounded answer.

## Risk-tiered governance baseline

Map risk tiers to operation classes, blast radius, mutability, and approval requirements:

| Risk Tier | Operation Classes | Blast Radius & Impact | Autonomy & Gating | Required Controls | Examples |
| --- | --- | --- | --- | --- | --- |
| **Low** | `READ`, `ANALYZE` | Zero mutation; read-only, idempotent | Fully autonomous | Read-only credentials; tenant ACL filters at retrieval; write tools locked out at the gateway | `search_docs`, `query_kubernetes` get/list, metrics, logs |
| **Medium** | `RECOMMEND`, scoped/reversible `CHANGE` | Bounded; single tenant/namespace, non-destructive, reversible | Policy-gated autonomy; escalate if quota/RBAC/schema checks fail | Strict JSON/Pydantic schemas; workload identity (e.g., SPIFFE) + IAM; gateway inspection | `create_incident`, draft PR, scale non-critical replicas within quota, tagging |
| **High** | `HIGH-RISK CHANGE` | Critical; irreversible, destructive, financial, or infra-wide | Mandatory human-in-the-loop; agent may only plan | Durable workflow checkpoints; multi-factor human approval; end-to-end OpenTelemetry audit trail | `cordon_node`/drain, delete namespaces or prod DBs, firewall/security policy changes, money movement |

**Invariants**

- **Intent-scoped tool gateways (Pillar 6).** Never expose the full tool catalog. Mount only the minimal toolset for the classified intent, so a diagnostic question physically cannot reach mutation tools — this neutralizes many prompt-injection and hallucination paths.
- **Plan vs. execute (Pillars 5 & 7).** High-risk work splits into Stage 1 (gather evidence, dependency and cascade analysis, structured change plan) and Stage 2 (workflow pauses at a persistent checkpoint; human reviews plan + evidence; action tool loads only after role-validated approval).
- **Causal auditability (Pillars 7 & 8).** Every Medium/High execution emits a correlated trace: user identity + agent identity; access-controlled evidence references with tiers and freshness; intent classification; policy rules evaluated and approval receipt references; operation identity, outcome, and redacted tool input/output evidence. Keep credentials, bearer tokens, secrets, and unnecessary private payloads out of telemetry.
## Two planes, not one massive agent

- **Domain Knowledge Plane** — ontology, source registry, retrieval, authority, citations, freshness, ACLs. Reusable infrastructure, governed independently of models and runtimes.
- **Agent Capability Plane** — reasoning, skills, workflows, tools, approvals, memory.
One knowledge plane can serve several agents (read-only Q&A agent, read+action operations agent, copilot). `Agent = Model + Domain instructions + Knowledge model + Retrieval + Tools + Policy + Memory + Evaluation.` The knowledge base is not the agent.

## Framework selection cheat-sheet

| Need | Lean toward |
| --- | --- |
| Polyglot (.NET/Python/Go), graph workflows, checkpointing, time-travel, durable execution on Azure | Microsoft Agent Framework |
| Per-agent cryptographic identity, registry, gateway inspection, managed memory, GCP runtime | Google ADK / Gemini Enterprise Agent Platform |
| Minimal primitives, explicit handoffs, guardrails, Python-first | OpenAI Agents SDK |
| Role-based crews, quick multi-agent prototypes | CrewAI |
| Explicit cyclic state machines with conditional edges | LangGraph |

Treat this table as a selection heuristic. Verify language support, state and durability, security, and observability against current primary documentation for the selected framework and version.

## Evaluation: nine dimensions

Retrieval quality · Groundedness · Correctness · Completeness · Authority selection · Freshness · Tool selection · Safety · Abstention ("I don't know" when evidence is thin). Build as a regression suite: domain questions → agent build N → compare against expected evidence, answer traits, expected tools, and forbidden behaviors → score. Gate CI/CD on it.

## The 30 design questions

Use these to structure a design doc or to find gaps in an existing one.

- **Domain (1–4):** What is the domain? What's explicitly out? Who are the users? Their top 20 questions/jobs?
- **Knowledge (5–10):** Entities? Relationships? Terminology and aliases? Sources? Which source wins on conflict? How stale can each source get?
- **Retrieval (11–14):** Which questions need semantic, exact, structured/live, historical retrieval?
- **Reasoning (15–18):** What may be inferred? What must be evidenced? How is uncertainty shown? How are conflicts handled?
- **Actions (19–22):** What may the agent inspect? Modify? What needs approval? Which tools per intent?
- **Security (23–26):** How is identity propagated? Does retrieval honor source ACLs? How is tool authorization enforced? What is logged and audited?
- **Quality (27–30):** What does "correct" mean? What does "good" mean? What are the golden questions? How do failures feed back?
## Output templates

**Design doc** — Capability contract → Knowledge model (entities + triples) → Source registry with tiers → Retrieval plan per question class → Reasoning & uncertainty rules → Tool inventory with risk tier and operation class → Governance controls & approval flow → Observability/audit trace schema → Evaluation suite → Open questions (from the 30).

**Architecture review** — For each pillar: current state, gap, risk (Low/Medium/High), recommendation. Lead with any High-risk tool that lacks a HITL gate or any retrieval path that ignores authority tiers.

## Example use and acceptance

Example request: "Design a governed diagnostic agent for our platform, with a separate path for proposed changes."

Expected result: the capability contract and design document above, with evidence sources and freshness, intent-scoped tools, the risk and approval model, evaluation criteria, and unresolved design questions. State which decisions are proposed and which controls are implemented or measured; a design document does not prove that enforcement exists.
