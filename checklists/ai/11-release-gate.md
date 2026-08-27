# AI Release Gate

[← all checklists](../README.md)

---

## The "Do Not Trust" List


The security architecture should explicitly treat all of these as untrusted unless independently verified:

* [ ] user prompts
* [ ] uploaded files
* [ ] webpages
* [ ] emails
* [ ] documents
* [ ] database text
* [ ] Storage metadata
* [ ] search results
* [ ] vector results
* [ ] retrieved documents
* [ ] model output
* [ ] tool output
* [ ] agent output
* [ ] MCP output
* [ ] A2A messages
* [ ] generated SQL
* [ ] generated code
* [ ] generated URLs
* [ ] generated shell commands
* [ ] generated API parameters
* [ ] generated authorization claims
* [ ] generated role names
* [ ] model-generated policy decisions
---

## Production Release Gate


Do not release an autonomous/high-privilege AI feature until:

* [ ] Agent threat model is complete.
* [ ] Tool inventory is complete.
* [ ] Agent identity model is complete.
* [ ] Tool authorization matrix is complete.
* [ ] Prompt injection testing is complete.
* [ ] Indirect prompt injection testing is complete.
* [ ] RAG security testing is complete.
* [ ] Memory security testing is complete.
* [ ] Cross-tenant testing is complete.
* [ ] Tool authorization tests pass.
* [ ] Output-validation tests pass.
* [ ] SSRF tests pass.
* [ ] Code-execution sandbox is verified where applicable.
* [ ] Cost/rate controls are verified.
* [ ] Human approval controls are verified.
* [ ] Audit logging is verified.
* [ ] Incident kill switch is verified.
* [ ] Production credentials are least privilege.
* [ ] Agent cannot disable its own security controls.
* [ ] Agent cannot obtain unrestricted production credentials.
* [ ] Agent cannot silently expand its tool permissions.
* [ ] Agent cannot approve its own privileged actions.
* [ ] Adversarial regression suite passes.
* [ ] Security reviewer approves the release.
---

## Golden Rule


**Never let the model be the final authority for authentication, authorization, privilege, tenant isolation, secret access, or security policy.**

The model can propose an action.

The application must decide whether that action is allowed.

The tool must independently enforce what the application authorized.

The underlying database/infrastructure must provide another security boundary where practical.

That gives the intended chain:

**User → Authentication → Deterministic Authorization → Agent → Validated Tool Request → Tool Authorization → Database/Infrastructure Authorization → Action**

rather than:

**User → Prompt → LLM → Whatever the LLM decides to do**

NIST similarly describes modern agents as systems where models are combined with software scaffolding that allows them to manipulate tools and take actions, making tool capabilities and limitations central security considerations.
