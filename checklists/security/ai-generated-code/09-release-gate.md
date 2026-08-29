# Vibe-Coding Release Gate

[← all checklists](../../README.md)

---

## Release Gate


Do not consider AI-generated functionality production-ready until:

* [ ] Human reviewed the security architecture.
* [ ] Human reviewed authentication.
* [ ] Human reviewed authorization.
* [ ] Human reviewed tenant isolation.
* [ ] Human reviewed database/RLS changes.
* [ ] Human reviewed Storage changes.
* [ ] Human reviewed secrets.
* [ ] Human reviewed dependencies.
* [ ] Human reviewed CI/CD changes.
* [ ] Human reviewed infrastructure changes.
* [ ] Human reviewed mobile security changes where applicable.
* [ ] Automated security scanning passes.
* [ ] Authorization regression tests pass.
* [ ] Negative security tests pass.
* [ ] No production secret was introduced.
* [ ] No permission was unintentionally widened.
* [ ] No security control was silently removed.
* [ ] No new public endpoint was unintentionally exposed.
* [ ] AI-generated tool/agent permissions remain least privilege.
* [ ] Security-sensitive generated code has a human owner.
---

## Red Flags


Any of these should trigger manual security review:

* [ ] AI added an authentication library.
* [ ] AI changed authentication/session code.
* [ ] AI changed authorization/roles.
* [ ] AI introduced a new admin endpoint.
* [ ] AI introduced a "temporary" bypass.
* [ ] AI disabled a failing security test.
* [ ] AI changed CORS.
* [ ] AI changed CSP.
* [ ] AI changed cookies.
* [ ] AI changed TLS.
* [ ] AI added external dependencies.
* [ ] AI added shell execution.
* [ ] AI added file processing.
* [ ] AI added URL fetching.
* [ ] AI added SQL.
* [ ] AI added a WebView.
* [ ] AI added native entitlements.
* [ ] AI changed IAM.
* [ ] AI changed DNS.
* [ ] AI changed production deployment.
* [ ] AI added an AI agent/tool.
* [ ] AI added RAG/memory.
* [ ] AI gave another AI agent additional privileges.
---

## Core Principle


**AI-generated code is untrusted code until independently verified.**

Do not change the project's trust model simply because an AI assistant generated the implementation.

The preferred development chain is:

**AI proposes → human reviews → automated security checks → deterministic authorization → integration/security tests → controlled deployment**

Not:

**Prompt → AI writes code → tests pass → production**

Passing functional tests is not evidence that:

* authorization is correct,
* tenant isolation is correct,
* secrets are protected,
* RLS is correct,
* CI/CD is safe,
* IAM is least privilege,
* AI tools are safe,
* or the application is resistant to adversarial input.
---

## Final Rule


For this project, treat **AI-generated code, AI-generated configuration, AI-generated prompts, AI-generated tests, AI-generated infrastructure, and AI-generated security decisions as separate attack surfaces**.

The most important review question is:

> **"What security boundary did the AI assume existed, and where is that boundary actually enforced?"**

If the answer is "the prompt says so", "the frontend prevents it", "the user won't know the ID", "the JWT says they are admin", "the AI was instructed not to do it", or "the tests pass", the security review is not finished.
