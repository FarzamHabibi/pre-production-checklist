# GitHub (repository & Actions)

Items from the core checklists that are specific to **GitHub (repository & Actions)**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## CI/CD & Supply Chain
<sub>from [`security/core/15-ci-cd-and-supply-chain.md`](../security/core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Review branch protection.
* [ ] Require CODEOWNERS.

* [ ] Review `pull_request_target`.
* [ ] Enable Dependabot updates for actions.
* [ ] Verify the repository and organisation Actions settings give `GITHUB_TOKEN` read-only access by default and have "Allow GitHub Actions to create and approve pull requests" off — otherwise a workflow can open a PR and supply its own required approval.
* [ ] Search every workflow for `actions/checkout` without `persist-credentials: false` — by default the job token is written into `.git/config`, so any later step, or an artifact that uploads the workspace, carries a usable `GITHUB_TOKEN`.
* [ ] Search for workflows triggered by `pull_request_target` or `workflow_run` that check out `github.event.pull_request.head.sha` or `head.ref`, or download the triggering run's artifacts — these run with the base repository's secrets and write token, so building PR-controlled code there hands both to the PR author.
* [ ] Search workflows for writes of untrusted values to `$GITHUB_ENV`, `$GITHUB_OUTPUT` or `$GITHUB_PATH` — a newline in the value adds variables such as `NODE_OPTIONS` or `LD_PRELOAD` that execute in every later step.
* [ ] Search workflows for `ACTIONS_ALLOW_UNSECURE_COMMANDS: true` — it re-enables the deprecated `set-env` and `add-path` log commands, so any log line an attacker controls can set environment variables.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] GitHub repository audit complete.
* [ ] GitHub Actions audit complete.

## AI Output Handling
<sub>from [`security/ai/05-output-handling.md`](../security/ai/05-output-handling.md)</sub>

* [ ] Never directly use model output as a GitHub Actions workflow.

## AI Integrations (email, browser, repos, cloud)
<sub>from [`security/ai/08-integrations.md`](../security/ai/08-integrations.md)</sub>

* [ ] Agent cannot modify branch protection.
* [ ] Agent cannot modify GitHub Actions permissions.
* [ ] Agent cannot modify CODEOWNERS without review.

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`security/ai-generated-code/04-crypto-secrets-deps.md`](../security/ai-generated-code/04-crypto-secrets-deps.md)</sub>

Review every AI-generated:

* [ ] GitHub Actions

Verify AI did not:

* [ ] disable branch protection
* [ ] give GitHub Actions write-all permissions

## AI-Generated Infrastructure & Pipeline Bugs
<sub>from [`security/ai-generated-code/06-infra-ci-cd.md`](../security/ai-generated-code/06-infra-ci-cd.md)</sub>

* [ ] Review `GITHUB_TOKEN`.
* [ ] Review `pull_request_target`.

## Review Blind Spots
<sub>from [`security/ai-generated-code/07-review-blind-spots.md`](../security/ai-generated-code/07-review-blind-spots.md)</sub>

* [ ] Verify old GitHub Actions security patterns are not copied.

* [ ] Compare GitHub Actions permissions.

## Agent Prompts & PR Review
<sub>from [`security/ai-generated-code/08-prompts-and-pr-review.md`](../security/ai-generated-code/08-prompts-and-pr-review.md)</sub>

* [ ] Agent is prohibited from bypassing branch protection.

Treat AI suggestions such as these as security-sensitive:

* [ ] "use `pull_request_target`"

## Vibe-Coding Release Gate
<sub>from [`security/ai-generated-code/09-release-gate.md`](../security/ai-generated-code/09-release-gate.md)</sub>

* [ ] AI changed GitHub Actions.
