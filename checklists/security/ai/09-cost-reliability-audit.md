# AI Cost, Reliability & Audit

An unmetered model call is a billing vulnerability. Availability is a security property.

[← all checklists](../../README.md)

---

## Rate Limits / Cost Security


* [ ] Per-user AI rate limit.
* [ ] Per-IP rate limit where relevant.
* [ ] Per-tenant limit.
* [ ] Per-agent limit.
* [ ] Per-tool limit.
* [ ] Maximum prompt size.
* [ ] Maximum context size.
* [ ] Maximum output tokens.
* [ ] Maximum tool calls.
* [ ] Maximum recursion depth.
* [ ] Maximum agent delegation depth.
* [ ] Maximum execution time.
* [ ] Maximum browser duration.
* [ ] Maximum downloaded data.
* [ ] Maximum generated files.
* [ ] Maximum concurrent agents.
* [ ] Maximum daily/monthly spend.
* [ ] Maximum retry count.
* [ ] Circuit breaker.
* [ ] Abuse detection.
* [ ] Budget alerts.
* [ ] Kill switch.
* [ ] Emergency agent disablement.

OWASP's 2025 list explicitly expands resource-exhaustion concerns into "Unbounded Consumption", including resource management and unexpected AI costs.
---

## Reliability as a Security Issue


* [ ] Identify security-critical model decisions.
* [ ] Identify decisions that must never rely solely on an LLM.
* [ ] Verify authorization is deterministic.
* [ ] Verify financial calculations are deterministic.
* [ ] Verify security classifications are deterministic where required.
* [ ] Verify permission assignment is deterministic.
* [ ] Verify account identity is deterministic.
* [ ] Verify destructive action eligibility is deterministic.
* [ ] Verify hallucination cannot directly trigger privileged actions.
* [ ] Verify model uncertainty can stop execution.
* [ ] Verify tool errors cannot be interpreted as successful actions.
* [ ] Verify contradictory outputs fail safely.
* [ ] Verify malformed structured outputs fail closed.
* [ ] Verify model refusal does not accidentally grant access.
* [ ] Verify model availability is not treated as an authorization control.

OWASP includes misinformation/overreliance because incorrect model output can become a security problem when downstream systems trust it.
---

## Logging / Audit


For every agent action, record as appropriate:

* [ ] authenticated user
* [ ] tenant
* [ ] agent identity
* [ ] model
* [ ] model version
* [ ] tool used
* [ ] tool arguments
* [ ] authorization decision
* [ ] approval decision
* [ ] action result
* [ ] resource affected
* [ ] timestamp
* [ ] request/correlation ID
* [ ] policy version
* [ ] prompt/version identifier

Then verify:

* [ ] Logs do not store secrets.
* [ ] Logs do not unnecessarily store PII.
* [ ] Logs cannot be modified by the agent.
* [ ] Agents cannot delete their own audit records.
* [ ] Security events are queryable.
* [ ] High-risk actions generate alerts.
* [ ] Tool invocation failures are observable.
* [ ] Prompt-injection indicators are observable.
* [ ] Excessive tool calls are observable.
* [ ] Unexpected destinations are observable.
