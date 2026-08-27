# AI Security Architecture & Identity

Before any prompt hardening: what is the agent allowed to be, and whose authority does it act under?

[← all checklists](../README.md)

---

## AI Security Architecture


* [ ] Inventory every AI model/provider.
* [ ] Inventory every AI agent.
* [ ] Inventory every AI workflow/orchestrator.
* [ ] Inventory every system prompt.
* [ ] Inventory every developer prompt.
* [ ] Inventory every user prompt.
* [ ] Inventory every tool/function available to AI.
* [ ] Inventory every MCP server/tool if MCP is used.
* [ ] Inventory every A2A/agent-to-agent integration.
* [ ] Inventory every RAG pipeline.
* [ ] Inventory every vector database.
* [ ] Inventory every embedding model.
* [ ] Inventory every retrieval source.
* [ ] Inventory every AI memory mechanism.
* [ ] Inventory every conversation/session store.
* [ ] Inventory every model output used by application code.
* [ ] Inventory every automated action an agent can perform.
* [ ] Inventory every external API the agent can call.
* [ ] Inventory every database operation the agent can perform.
* [ ] Inventory every filesystem operation.
* [ ] Inventory every shell/code execution capability.
* [ ] Inventory every email/message capability.
* [ ] Inventory every browser/web access capability.
* [ ] Inventory every URL-fetching capability.
* [ ] Inventory every deployment/infrastructure capability.
* [ ] Inventory every privileged AI service account.
* [ ] Inventory every AI-specific secret.
* [ ] Document which actions require human approval.
* [ ] Document which actions are fully autonomous.
* [ ] Document maximum blast radius of each agent.
* [ ] Document the maximum privileges available to each tool.
* [ ] Document what data each agent may read.
* [ ] Document what data each agent may modify.
* [ ] Document what data each agent may delete.
* [ ] Document what external systems each agent can affect.
* [ ] Document all trust boundaries between user → model → tools → systems.
* [ ] Define an explicit threat model for direct and indirect prompt injection.

OWASP's 2025 material treats prompt injection and excessive agency as distinct but closely related risks; agents can be manipulated through direct user input, retrieved content, tools, or other agents.
---

## AI Identity & Authorization


This is one of the most important sections.

* [ ] AI does not receive unrestricted application-admin credentials.
* [ ] AI does not receive unrestricted database credentials.
* [ ] AI does not receive GitHub organization-owner credentials.
* [ ] AI does not receive production deployment credentials unnecessarily.
* [ ] AI does not share one unrestricted credential across all tools.
* [ ] Each sensitive tool has its own identity/permission boundary.
* [ ] Each tool has least-privilege permissions.
* [ ] Tool permissions are scoped to the current user/tenant.
* [ ] Tool authorization occurs outside the model.
* [ ] The model cannot invent or modify its own permissions.
* [ ] The model cannot choose another user's identity.
* [ ] The model cannot alter `user_id`.
* [ ] The model cannot alter `tenant_id`.
* [ ] The model cannot alter `organization_id`.
* [ ] The model cannot alter `role`.
* [ ] The model cannot alter `permissions`.
* [ ] The model cannot select arbitrary database tables.
* [ ] The model cannot select arbitrary storage buckets.
* [ ] The model cannot select arbitrary filesystem paths.
* [ ] The model cannot select arbitrary cloud projects.
* [ ] The model cannot select arbitrary deployment environments.
* [ ] Tool calls are authorized using the real authenticated principal.
* [ ] Tool authorization cannot be satisfied by model-generated claims.
* [ ] Privileged operations require stronger authorization.
* [ ] High-risk actions require explicit user confirmation where appropriate.
* [ ] Highly destructive operations require a second control/human approval.
* [ ] AI cannot approve its own sensitive action.
* [ ] Agent-to-agent calls preserve identity and authorization context.
* [ ] One agent cannot impersonate another agent.
* [ ] Background agents use dedicated identities.
* [ ] Scheduled agents use dedicated identities.
* [ ] Development agents cannot access production systems.
* [ ] Test agents cannot access production secrets.

OWASP's agentic-security work explicitly identifies identity and privilege abuse as a major agent threat.
