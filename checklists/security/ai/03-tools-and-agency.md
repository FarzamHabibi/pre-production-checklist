# Tool Calling & Excessive Agency

Treat every tool as a privileged API endpoint, because that is exactly what it is.

[← all checklists](../../README.md)

---

## Tool / Function Calling Security


Treat every tool as a privileged API endpoint.

For every tool:

* [ ] Authentication exists.
* [ ] Authorization exists.
* [ ] Input validation exists.
* [ ] Output validation exists.
* [ ] Rate limiting exists.
* [ ] Audit logging exists.
* [ ] Least privilege exists.
* [ ] Tenant isolation exists.
* [ ] Resource-level authorization exists.
* [ ] Destructive-operation protection exists.
* [ ] Timeout exists.
* [ ] Size limits exist.
* [ ] Error handling is safe.

Then verify:

* [ ] Model cannot invoke undeclared tools.
* [ ] Model cannot modify tool arguments after authorization.
* [ ] Tool arguments are independently validated.
* [ ] Tool names cannot be attacker-controlled.
* [ ] Tool routing cannot be manipulated.
* [ ] Tool selection cannot bypass authorization.
* [ ] Tool output is treated as untrusted.
* [ ] Tool errors cannot expose credentials.
* [ ] Tool return data cannot inject arbitrary instructions.
* [ ] Tool retries cannot duplicate destructive actions.
* [ ] Tool calls are idempotent where necessary.
* [ ] Tool invocation has per-user/per-tenant limits.
* [ ] High-risk tools have approval gates.
* [ ] Tools are disabled when not required.
* [ ] Tools cannot dynamically grant themselves additional permissions.
* [ ] Tool chains cannot escalate privilege.

OWASP's "Excessive Agency" category specifically recommends limiting excessive functionality, permissions, and autonomy.
---

## Dangerous Tools


Pay special attention to agents with:

* [ ] shell
* [ ] terminal
* [ ] arbitrary code execution
* [ ] filesystem access
* [ ] database SQL execution
* [ ] arbitrary HTTP requests
* [ ] browser automation
* [ ] email sending
* [ ] SMS sending
* [ ] payment operations
* [ ] user deletion
* [ ] account modification
* [ ] password reset
* [ ] role modification
* [ ] GitHub write access
* [ ] repository administration
* [ ] deployment
* [ ] infrastructure changes
* [ ] secret retrieval
* [ ] database migrations

For each:

* [ ] Tool has minimal permissions.
* [ ] Tool has strict input schema.
* [ ] Tool validates destination/resource.
* [ ] Tool validates current user authorization.
* [ ] Tool validates tenant.
* [ ] Tool validates environment.
* [ ] Tool prevents arbitrary command execution.
* [ ] Tool prevents arbitrary URLs.
* [ ] Tool prevents arbitrary SQL.
* [ ] Tool prevents arbitrary filesystem paths.
* [ ] Tool prevents arbitrary cloud resources.
* [ ] Tool prevents arbitrary recipients.
* [ ] Tool prevents arbitrary repository/branch modification.
* [ ] Tool prevents production access when not required.
* [ ] Tool supports dry-run.
* [ ] Tool supports approval workflow.
* [ ] Tool logs complete security-relevant context.
