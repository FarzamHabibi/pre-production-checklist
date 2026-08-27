# GitHub (repository & Actions)

Items from the core checklists that are specific to **GitHub (repository & Actions)**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## CI/CD & Supply Chain
<sub>from [`core/15-ci-cd-and-supply-chain.md`](../core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Review branch protection.
* [ ] Require CODEOWNERS.

* [ ] Review `pull_request_target`.
* [ ] Enable Dependabot updates for actions.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] GitHub repository audit complete.
* [ ] GitHub Actions audit complete.

## AI Output Handling
<sub>from [`ai/05-output-handling.md`](../ai/05-output-handling.md)</sub>

* [ ] Never directly use model output as a GitHub Actions workflow.

## AI Integrations (email, browser, repos, cloud)
<sub>from [`ai/08-integrations.md`](../ai/08-integrations.md)</sub>

* [ ] Agent cannot modify branch protection.
* [ ] Agent cannot modify GitHub Actions permissions.
* [ ] Agent cannot modify CODEOWNERS without review.

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`vibe-coding/04-crypto-secrets-deps.md`](../vibe-coding/04-crypto-secrets-deps.md)</sub>

* [ ] GitHub Actions
* [ ] disable branch protection
* [ ] give GitHub Actions write-all permissions

## AI-Generated Infrastructure & Pipeline Bugs
<sub>from [`vibe-coding/06-infra-ci-cd.md`](../vibe-coding/06-infra-ci-cd.md)</sub>

* [ ] Review `GITHUB_TOKEN`.
* [ ] Review `pull_request_target`.

## Review Blind Spots
<sub>from [`vibe-coding/07-review-blind-spots.md`](../vibe-coding/07-review-blind-spots.md)</sub>

* [ ] Verify old GitHub Actions security patterns are not copied.

* [ ] Compare GitHub Actions permissions.

## Agent Prompts & PR Review
<sub>from [`vibe-coding/08-prompts-and-pr-review.md`](../vibe-coding/08-prompts-and-pr-review.md)</sub>

* [ ] Agent is prohibited from bypassing branch protection.

* [ ] "use `pull_request_target`"

## Vibe-Coding Release Gate
<sub>from [`vibe-coding/09-release-gate.md`](../vibe-coding/09-release-gate.md)</sub>

* [ ] AI changed GitHub Actions.
