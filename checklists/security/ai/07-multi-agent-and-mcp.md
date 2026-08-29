# Multi-Agent Systems & MCP

[← all checklists](../../README.md)

---

## Multi-Agent Security


If multiple agents communicate:

* [ ] Inventory every agent.
* [ ] Identify trust level of each agent.
* [ ] Identify privileges of each agent.
* [ ] Verify agent identity.
* [ ] Verify message authentication.
* [ ] Verify sender authorization.
* [ ] Verify receiver authorization.
* [ ] Verify message integrity.
* [ ] Verify replay protection.
* [ ] Verify sequence/order handling.
* [ ] Verify message size.
* [ ] Verify tool-call authorization.
* [ ] Verify one agent cannot impersonate another.
* [ ] Verify a lower-trust agent cannot command a higher-trust agent without authorization.
* [ ] Verify agent output is treated as untrusted input.
* [ ] Verify agent-to-agent prompt injection.
* [ ] Verify malicious agent/tool behavior.
* [ ] Verify compromised-agent containment.
* [ ] Verify circular delegation.
* [ ] Verify recursive agent spawning.
* [ ] Verify runaway agent chains.
* [ ] Verify budget/time limits.
* [ ] Verify maximum delegation depth.
* [ ] Verify maximum number of agent calls.
* [ ] Verify cross-tenant agent communication.
---

## MCP Security


If Model Context Protocol is used:

* [ ] Inventory every MCP server.
* [ ] Inventory every MCP tool.
* [ ] Inventory every MCP resource.
* [ ] Verify server authenticity.
* [ ] Verify transport security.
* [ ] Verify authentication.
* [ ] Verify authorization.
* [ ] Verify tool permissions.
* [ ] Verify resource permissions.
* [ ] Verify tenant isolation.
* [ ] Verify tool schemas.
* [ ] Verify tool output validation.
* [ ] Verify malicious MCP server scenario.
* [ ] Verify compromised MCP server scenario.
* [ ] Verify supply-chain provenance.
* [ ] Pin/verify MCP dependencies.
* [ ] Review MCP server source/dependencies.
* [ ] Review update process.
* [ ] Verify MCP cannot silently gain new capabilities.
* [ ] Verify tool additions require security review.
* [ ] Verify an MCP server cannot retrieve unrelated secrets.
* [ ] Verify an MCP server cannot invoke unrestricted shell access.
* [ ] Verify MCP tools cannot bypass application authorization.
* [ ] Verify MCP audit logging.
* [ ] Verify MCP rate limits.
* [ ] Verify MCP resource limits.

OWASP's Agentic Top 10 specifically calls out agentic supply-chain vulnerabilities and dynamic tool ecosystems as a new attack surface.
---

## AI Supply Chain


* [ ] Verify model provider.
* [ ] Verify model version.
* [ ] Avoid untracked model changes.
* [ ] Pin model versions where practical.
* [ ] Monitor provider model changes.
* [ ] Verify third-party AI SDKs.
* [ ] Verify AI gateway.
* [ ] Verify vector DB.
* [ ] Verify embedding provider.
* [ ] Verify reranking provider.
* [ ] Verify MCP dependencies.
* [ ] Verify agent frameworks.
* [ ] Verify tool libraries.
* [ ] Verify model files.
* [ ] Verify model provenance.
* [ ] Verify downloaded model integrity.
* [ ] Scan dependencies.
* [ ] Monitor security advisories.
* [ ] Review model/plugin/tool updates before production.
* [ ] Verify rollback capability.
* [ ] Verify third-party data sharing.
* [ ] Verify data retention terms.
* [ ] Verify provider logging behavior.
* [ ] Verify provider training/data-use settings.

OWASP lists supply-chain vulnerabilities as a core GenAI risk covering models, data, libraries, and deployment components.
