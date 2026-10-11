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
* [ ] Verify the MCP client opens a server-supplied authorization URL only after parsing it and allowing `https` (or `http` on loopback in development), and opens it through a non-shell API — a `javascript:`, `file:` or shell-metacharacter URL from a hostile server becomes script or command execution on the client.
* [ ] Verify a locally run MCP server uses stdio, or over HTTP binds to loopback, checks the `Origin` header and requires a token — otherwise any web page the user opens can reach it on localhost.
* [ ] Verify adding a local MCP server shows the full launch command with every argument untruncated, requires explicit approval, and starts the server with filesystem and network access limited to what it declares — a local server runs with the client's own privileges.
* [ ] Verify authentication.
* [ ] Verify authorization.
* [ ] Verify an MCP server that fronts a third-party OAuth provider under one static client id keeps a per-user record of approved `client_id`s and shows its own consent screen (client name, upstream scopes, registered `redirect_uri`) before forwarding — otherwise a newly registered client rides the consent the upstream remembers for an earlier one.
* [ ] Verify the MCP proxy writes the OAuth `state` to the session only after the user approves its consent screen, compares it exactly at the callback, deletes it on first use and expires it within minutes — a `state` set before consent lets a crafted authorization link skip the screen.
* [ ] Verify tool permissions.
* [ ] Search the MCP server's `scopes_supported` and `WWW-Authenticate` challenges for wildcard or catch-all scopes, and confirm a first connection gets read-only scopes, with write and admin requested only when a tool first needs them — a stolen token then carries only what was used.
* [ ] Verify resource permissions.
* [ ] Verify tenant isolation.
* [ ] Verify tool schemas.
* [ ] Audit every MCP tool and parameter description for text aimed at the model — instructions, mentions of other tools, files or secrets to read, invisible Unicode — since the model reads the whole description while the person approving the tool usually sees only its name.
* [ ] Verify tool names are namespaced per MCP server and that one server's description cannot change how the agent calls another server's tools — a connected server can otherwise redirect another tool's arguments without ever being called itself.
* [ ] Verify tool output validation.
* [ ] Verify malicious MCP server scenario.
* [ ] Verify compromised MCP server scenario.
* [ ] Verify supply-chain provenance.
* [ ] Pin/verify MCP dependencies.
* [ ] Review MCP server source/dependencies.
* [ ] Review update process.
* [ ] Verify MCP cannot silently gain new capabilities.
* [ ] Verify the name, description and input schema of every approved MCP tool are stored as a hash, and that a changed hash on reconnect or after a `tools/list_changed` notification disables the tool until it is reviewed again — a server can pass review with a harmless description and swap it later.
* [ ] Verify tool additions require security review.
* [ ] Verify an MCP server cannot retrieve unrelated secrets.
* [ ] Verify an MCP server cannot invoke unrestricted shell access.
* [ ] Verify MCP tools cannot bypass application authorization.
* [ ] Verify each MCP server rejects a bearer token whose audience is not that server, and calls downstream APIs with a token it obtained for them rather than forwarding the client's — a forwarded token makes the downstream API trust a caller nobody checked and hides the real client from both audit logs.
* [ ] Verify every server-minted handle an MCP tool takes back as an argument (cart, job, workflow or session id) is random, expires, and is looked up under the user id from the verified token, so a handle sent by another principal is refused — holding a handle is not authentication.
* [ ] Verify MCP audit logging.
* [ ] Verify MCP rate limits.
* [ ] Verify MCP resource limits.
* [ ] Verify a connected MCP server's sampling requests (asking the client's model to generate) and elicitation requests (asking the user for input) are shown to the user, can be denied, and are never auto-filled with secrets — they let a server spend your model budget and ask questions that look like your app's.

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
