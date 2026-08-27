# GitHub (repository & Actions)

Items from the core checklists that are specific to **GitHub (repository & Actions)**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

### Source Repository Security
<sub>from [`core/15-ci-cd-and-supply-chain.md`](../core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Review branch protection.
* [ ] Require CODEOWNERS.

### CI/CD Pipeline Security
<sub>from [`core/15-ci-cd-and-supply-chain.md`](../core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Review `pull_request_target`.
* [ ] Enable Dependabot updates for actions.

### Final Security Sign-Off
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] GitHub repository audit complete.
* [ ] GitHub Actions audit complete.

### Output Security
<sub>from [`ai/05-output-handling.md`](../ai/05-output-handling.md)</sub>

* [ ] Never directly use model output as a GitHub Actions workflow.

### AI + Software Engineering Agents
<sub>from [`ai/08-integrations.md`](../ai/08-integrations.md)</sub>

* [ ] Agent cannot modify branch protection.
* [ ] Agent cannot modify GitHub Actions permissions.
* [ ] Agent cannot modify CODEOWNERS without review.

### Configuration Bugs
<sub>from [`vibe-coding/04-crypto-secrets-deps.md`](../vibe-coding/04-crypto-secrets-deps.md)</sub>

* [ ] GitHub Actions
* [ ] disable branch protection
* [ ] give GitHub Actions write-all permissions

### CI/CD Pipeline Bugs
<sub>from [`vibe-coding/06-infra-ci-cd.md`](../vibe-coding/06-infra-ci-cd.md)</sub>

* [ ] Review `GITHUB_TOKEN`.
* [ ] Review `pull_request_target`.

### Copy-Paste Security Bugs
<sub>from [`vibe-coding/07-review-blind-spots.md`](../vibe-coding/07-review-blind-spots.md)</sub>

* [ ] Verify old GitHub Actions security patterns are not copied.

### Refactoring Regressions
<sub>from [`vibe-coding/07-review-blind-spots.md`](../vibe-coding/07-review-blind-spots.md)</sub>

* [ ] Compare GitHub Actions permissions.

### Prompt Security for Coding Agents
<sub>from [`vibe-coding/08-prompts-and-pr-review.md`](../vibe-coding/08-prompts-and-pr-review.md)</sub>

* [ ] Agent is prohibited from bypassing branch protection.

### "One-Line Fix" Review
<sub>from [`vibe-coding/08-prompts-and-pr-review.md`](../vibe-coding/08-prompts-and-pr-review.md)</sub>

* [ ] "use `pull_request_target`"

### Red Flags
<sub>from [`vibe-coding/09-release-gate.md`](../vibe-coding/09-release-gate.md)</sub>

* [ ] AI changed GitHub Actions.
