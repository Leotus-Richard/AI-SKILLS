# Eval datasets

`evals/<skill>/` holds SkillEvaluator Tier 3 data for `skills/<skill>/`. It lives outside `skills/` so release packages stay unchanged. `node scripts/stage-evals.mjs` copies it into `<skill>/evals/` in a temporary staging copy for evaluation.

Each dataset is `evals.json` in the [agentskills.io](https://agentskills.io) shape. It may also include `config.yml`, `EVAL.md` and `files/` fixtures. See [Skill evaluation](../docs/SKILL-EVALUATION.md#4-prove-it-helps-tier-3-the-step-that-matters-most) for how to write cases and run them.
