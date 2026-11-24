# Skill evaluation

This library checks every skill with two NVIDIA tools, on self-hosted Ubuntu runners:

- **[SkillSpector](https://github.com/NVIDIA/SkillSpector)** is a security scanner for agent skills. It looks for prompt injection, data exfiltration, excessive agency, persistence, risky scripts and similar patterns.
- **[SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator)** grades skills in three tiers. Tier 1 covers static quality, schema, harness compatibility and security. Tier 2 finds duplicated or overlapping guidance. Tier 3 measures **Skill Lift**: real agents attempt eval cases with and without the skill, and the difference shows whether the skill actually helps.

Tier 1 and the PR scan need no model at all. Tier 2, Tier 3 and SkillSpector's LLM analysis need one. By default that's [open-weight models in LM Studio](#local-open-weight-models-with-lm-studio) on the runner host, with no cloud calls. A cloud provider key also works.

## Pipeline

| Workflow | Trigger | Runner | Gate |
| --- | --- | --- | --- |
| `validate.yml` | PR, push to `main`, manual | Linux: self-hosted. macOS and Windows: GitHub-hosted. Fork PRs: GitHub-hosted Linux | Blocking |
| `skill-checks.yml` → SkillSpector | PR, push, manual | Self-hosted | **Blocking** on any active finding not in `.skillspector-baseline.yaml` |
| `skill-checks.yml` → SkillEvaluator Tier 1 | PR (changed skills), push and manual (all) | Self-hosted, pinned Docker image | Advisory until `SKILL_TIER1_ENFORCE=true` |
| `skill-eval.yml` | Manual; weekly if `SKILL_EVAL_SCHEDULED=true` | Self-hosted, Docker sandboxes, LM Studio or a cloud provider | Advisory. Produces reports |
| `release.yml` | `v*` tag, manual | Self-hosted | Blocking |

Tool versions are pinned: SkillSpector `v2.13.6` by commit, SkillEvaluator `1.0.1` from PyPI, and the Tier 1 image by digest from SkillEvaluator's reviewed CI bundle `1.2.0`. Update them deliberately, in their own commit.

## Self-hosted runner setup

The workflows target the labels `["self-hosted","linux","x64"]`. If your runners use other labels, set the repository variable `SELF_HOSTED_RUNNER_LABELS` (a JSON array, for example `["self-hosted","linux","skills"]`) in **Settings → Secrets and variables → Actions → Variables**.

Each Ubuntu runner needs:

- `git`, `curl`, and a working `python3` (`actions/setup-python` and `actions/setup-node` download their own toolchains into the runner tool cache).
- **Docker**, usable by the runner user without `sudo` (`sudo usermod -aG docker <runner-user>`, then restart the runner service). Tier 1 runs in a container, and Tier 3 starts agent sandboxes.
- The **GitHub CLI** (`gh`), only for `release.yml` publishing.
- Outbound access to `ghcr.io`, `pypi.org`, `github.com`, and your model provider for live evaluation.
- Disk space: about 5 GB for the Tier 1 image plus Tier 3 sandbox images. Prune them now and then with `docker system prune`.

**Security.** This repository is public. Self-hosted runners execute whatever the workflow checks out, so:

- Every self-hosted job runs only for pushes, manual runs, and PRs from branches in this repository. Fork PRs get GitHub-hosted Linux validation, and a maintainer can run `skill-checks.yml` manually after reviewing the change.
- In **Settings → Actions → General**, also set *Fork pull request workflows from outside collaborators* to **Require approval for all outside collaborators**.
- Use a dedicated, non-admin runner user on a machine without other secrets. Consider ephemeral runners (`--ephemeral`) so each job starts clean.

## Repository settings

| Name | Kind | Purpose |
| --- | --- | --- |
| `SELF_HOSTED_RUNNER_LABELS` | Variable | JSON array of runner labels. Optional |
| `SKILL_TIER1_ENFORCE` | Variable | `true` makes Tier 1 failures block merges |
| `SKILL_MIN_SCORE` | Variable | Tier 1 minimum quality score. Default `70` |
| `SKILL_EVAL_PROVIDER` | Variable | Provider for scheduled live runs: `lmstudio` (default), `nv_build`, `anthropic` or `openai` |
| `SKILL_EVAL_SCHEDULED` | Variable | `true` enables the weekly live evaluation |
| `LOCAL_LLM_MODEL` | Variable | LM Studio model ID for the evaluator, judge and SkillSpector. Required for `lmstudio` |
| `LOCAL_AGENT_MODEL` | Variable | LM Studio model ID for the Tier 3 agent. Defaults to `LOCAL_LLM_MODEL` |
| `LOCAL_EMBEDDING_MODEL` | Variable | LM Studio embedding model ID. Required for Tier 2 |
| `LOCAL_LLM_BASE_URL` | Variable | Default `http://172.17.0.1:1234/v1`, the Docker bridge address of the runner host |
| `LOCAL_LLM_ALLOW_HTTP_HOSTS` | Variable | Hosts allowed over plain HTTP. Default `172.17.0.1`. Set it to the Tailscale IP when you use one |
| `LOCAL_N_CONCURRENT` / `LOCAL_TIMEOUT_MULTIPLIER` | Variable | Tier 3 parallel trials (default `1`) and timeout scaling for slower local inference (default `3`) |
| `LOCAL_LLM_API_KEY` | Secret | Only if you turned on authentication in LM Studio |
| `NVIDIA_API_KEY` / `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | Secret | Cloud providers only. Only the one matching the provider is needed. Anthropic has no embeddings API, so Tier 2 is skipped with it |

## Local open-weight models with LM Studio

Everything model-backed can run on LM Studio, on the machine that hosts the runner and its containers. Both tools treat LM Studio as an OpenAI-compatible server: SkillEvaluator uses its `openai-compatible` provider and SkillSpector its `openai_compatible` provider.

| Role | What it needs from the model | Example open-weight choices |
| --- | --- | --- |
| Tier 3 agent (OpenCode) | Reliable tool calling over Chat Completions, long context | Qwen3-Coder-30B-A3B, gpt-oss-20b/120b, GLM-4.5-Air, Devstral |
| Evaluator, judge, SkillSpector | Careful instruction following, structured output | gpt-oss-120b, Qwen3-30B-A3B-Instruct or larger |
| Tier 2 embeddings | An embedding model | nomic-embed-text v1.5 (bundled with LM Studio), Qwen3-Embedding |

Pick what fits your GPU. Copy the exact IDs from `lms ls` or the `/v1/models` list into the variables above. The workflow checks they exist before it starts.

### Setup on the runner host

1. **Load models with enough context.** LM Studio loads models with a short default context, which is too small for an agent that reads a skill and tool output. Load the agent and judge models with at least 32k context, for example `lms load <model> --context-length 32768`. You can also set it in the model's load settings, or turn on just-in-time loading with that default.
2. **Make the server reachable from containers.** Tier 3 agents run in Docker, and inside a container `localhost` means the container itself. Start the server with **Serve on Local Network** turned on, so it listens beyond `127.0.0.1`. The default URL `http://172.17.0.1:1234/v1` is the host's Docker bridge address, so the traffic never leaves the machine.
3. **Allow Docker networks through the host firewall.** A local test of this setup showed a firewall that lets the host reach the server but silently drops traffic from containers. With ufw:

   ```bash
   sudo ufw allow from 172.16.0.0/12 to any port 1234 proto tcp
   ```

   `172.16.0.0/12` covers the default bridge and the per-run networks Docker creates.
4. **Don't expose the server to your whole LAN.** Serve on Local Network listens on every interface. Allow port 1234 only from Docker networks, and from `tailscale0` if you want it on your tailnet. If your LM Studio version supports API-key authentication, turn it on and store the key as the `LOCAL_LLM_API_KEY` secret.

The workflow's preflight step checks the model IDs, and checks that a throwaway container can reach the server. It fails with a specific message when either check doesn't pass.

### Tailscale

The runner is on a tailnet, so you have two options:

- **Keep the default Docker bridge URL** while LM Studio runs on the runner host. It's the shortest path and doesn't depend on the tailnet.
- **Use the host's Tailscale IP.** Set `LOCAL_LLM_BASE_URL=http://100.x.y.z:1234/v1` and `LOCAL_LLM_ALLOW_HTTP_HOSTS=100.x.y.z`. Use this when LM Studio runs on another tailnet machine, such as a separate GPU box. SkillEvaluator refuses plain HTTP to non-loopback hosts unless they are allow-listed, and its docs name a WireGuard peer as the intended case. Tailscale is WireGuard. Use the 100.x IP, not the MagicDNS name: containers often can't resolve MagicDNS names, because Docker doesn't pass the host's Tailscale resolver into them. Restrict port 1234 to the runner in your Tailscale access controls.

### What to expect from local models

- Scores depend on the judge and the agent. Compare Skill Lift only between runs that use the same models; the run summary records them. A skill that helps a small model may matter less to a frontier model, and the reverse.
- A weak judge gives noisy verdicts. Use the strongest model you can for `LOCAL_LLM_MODEL`, even if the agent model is smaller.
- One GPU serves one request at a time, so Tier 3 runs trials one by one (`LOCAL_N_CONCURRENT=1`). Ten cases × 3 attempts × 2 arms is 60 agent runs. Start with `n-attempts` 1 on one skill to check the setup works.
- Agent containers still need internet access to install OpenCode, but no model traffic leaves your network.

## How to improve a skill with these tools

Treat each imported or new skill as a candidate, not a finished asset. Work through the tiers in order, because each answers a different question.

### 1. Make it safe (SkillSpector): blocking

Run `skillspector scan skills/<name> --no-llm`. Fix real findings in the skill text. Imported skills often carry instructions that read like agent persistence, exfiltration or over-broad tool use. Accept a false positive only by adding a narrow rule to `.skillspector-baseline.yaml` with a `reason`. Rule paths are relative to the skill folder. For a deeper pass before adopting a third-party skill, run without `--no-llm` (or run `skill-eval.yml`) to add semantic analysis.

### 2. Make it load and read well (Tier 1)

Run `skillevaluator quality-check skills/<name>` and `skillevaluator harness-check skills/<name>`. Harness Check tells you whether Claude Code, Codex, Copilot CLI, OpenCode, Hermes and OpenClaw will actually load the skill. Description length, name rules and folder conventions differ between them. The quality score highlights missing structure that agents rely on: purpose, prerequisites, examples, limitations and troubleshooting.

### 3. Remove duplication (Tier 2)

Run `skill-eval.yml` with tiers `2`. Inside a skill, repeated guidance wastes context. Across the library, overlapping skills compete for the same trigger, so the agent picks the wrong one or loads both. Sharpen the `description` of overlapping skills so each states when *not* to use it, or merge them.

### 4. Prove it helps (Tier 3): the step that matters most

A skill can score 95 on static quality and still make agents worse. Tier 3 is the only check that measures impact.

1. Write an eval dataset in `evals/<name>/evals.json` (see the [agile-work-hierarchy example](../evals/agile-work-hierarchy/evals.json)). Use at least 10 cases with at least 1 negative case (`"expected_skill": null`), and outcome-based `assertions` that an agent *without* the skill could also satisfy. Never assert that the agent "used the skill". `skillevaluator tier3 create-eval-dataset --no-llm` only produces a weak starter. Write the realistic requests your users actually send, including the mistakes the skill exists to prevent.
2. Validate it locally: `node scripts/stage-evals.mjs <name>`, then `skillevaluator tier3 validate .tmp/eval-skills/<name> --strict`.
3. Run `skill-eval.yml` for that skill. Read the lift. Positive lift on the cases you care about means keep the skill. Zero or negative lift means the skill is noise or actively misleads. Look at the failing trials and change the skill text, not the evals.
4. Re-run after each edit and compare with `skillevaluator tier3 history` / `compare-versions`. `skillevaluator tier3 feedback` explains a run's failures and suggests edits.

Eval datasets live in `evals/<skill>/`, outside `skills/`, so release ZIPs stay unchanged. `scripts/stage-evals.mjs` overlays them into a temporary copy, where SkillEvaluator expects `<skill>/evals/`.

### Adopting a skill from elsewhere

1. Copy it into `skills/<name>/` with its license and a `SOURCE.md` (see [CONTRIBUTING](../CONTRIBUTING.md)), and open a PR. SkillSpector and Tier 1 run automatically.
2. Fix or baseline security findings. Address Tier 1 structure findings.
3. Add `evals/<name>/evals.json` and run Tier 3. Adopt the skill only if it shows lift. Otherwise adapt it until it does, or drop it.
4. Run Tier 2 against the library to check that it doesn't overlap an existing skill.

## Baseline on 2026-11-23

First local run against `main` (`1ee5bc7`):

| Skill | Tier 1 quality | Harness (6 agents) | SkillSpector | Tier 1 verdict |
| --- | --- | --- | --- | --- |
| agile-work-hierarchy | 86.8 (B) | all load | 1 false positive (baselined) | INCOMPLETE |
| enterprise-agent-architecture | 88.5 (B) | all load | clean | pass |
| graph-engineering | 88.5 (B) | all load | clean | pass |
| grill-with-docs | 89.0 (B) | all load | clean | INCOMPLETE |
| wayfinder | 91.5 (A) | all load | clean | pass |

The two INCOMPLETE results are scanner coverage gaps, not vulnerabilities:

- `agile-work-hierarchy/scripts/validate-plan.mjs`: the static parser cannot fully resolve some runtime-built strings (`static_parse_limit`).
- `grill-with-docs/SKILL.md` lines 58 and 123 mention files the skill *creates* (`GLOSSARY.md`, `docs/adr/0001-slug.md`). The scanner reads these as missing bundled references.

Tier 1 stays advisory until these are resolved. After that, set `SKILL_TIER1_ENFORCE=true`.

Common quality findings across all five skills: no `metadata.author` / `metadata.tags` frontmatter, descriptions longer than the 200-character recommendation (`enterprise-agent-architecture` is 853), and no Limitations or Troubleshooting sections. No skill has a Tier 3 dataset yet apart from the starter for `agile-work-hierarchy`, so **no skill's actual lift has been measured**.
