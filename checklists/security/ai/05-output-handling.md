# AI Output Handling

Model output is untrusted input to whatever consumes it next — a browser, a shell, a database, another agent.

[← all checklists](../../README.md)

---

## Output Security


Never trust model output merely because it came from the model.

* [ ] Validate structured JSON against a strict schema.
* [ ] Reject unknown fields where appropriate.
* [ ] Validate enum values.
* [ ] Validate URLs.
* [ ] Validate emails.
* [ ] Validate IDs.
* [ ] Validate file paths.
* [ ] Validate commands.
* [ ] Validate SQL.
* [ ] Validate API parameters.
* [ ] Validate HTML.
* [ ] Sanitize Markdown/HTML.
* [ ] Escape output in the correct rendering context.
* [ ] Never execute arbitrary model-generated shell commands.
* [ ] Never execute arbitrary model-generated JavaScript.
* [ ] Never directly render model output as trusted HTML.
* [ ] Never directly use model output as SQL.
* [ ] Never directly use model output as an HTTP destination.
* [ ] Never directly use model output as a filesystem path.
* [ ] Never directly use model output as IAM policy.
* [ ] Never directly use model output as infrastructure configuration without validation.

OWASP identifies improper output handling as a distinct risk because insecure downstream use of LLM output can create traditional application vulnerabilities.
---

## Generated-Code Execution


This requires special review.

* [ ] Identify whether an agent can write code.
* [ ] Identify whether an agent can execute code.
* [ ] Never execute generated code directly on the production host.
* [ ] Sandbox execution.
* [ ] Run generated code as an unprivileged user.
* [ ] Restrict filesystem access.
* [ ] Restrict network access.
* [ ] Restrict CPU.
* [ ] Restrict memory.
* [ ] Restrict execution time.
* [ ] Restrict process count.
* [ ] Restrict system calls where practical.
* [ ] Prevent secret access.
* [ ] Prevent cloud metadata access.
* [ ] Prevent access to host filesystem.
* [ ] Prevent access to production credentials.
* [ ] Prevent access to CI tokens.
* [ ] Prevent access to GitHub tokens.
* [ ] Prevent access to SSH keys.
* [ ] Prevent persistence between executions.
* [ ] Destroy sandbox after execution.
* [ ] Log execution.
* [ ] Require approval for high-risk actions.

OWASP's newer Agentic Top 10 explicitly identifies unexpected code execution as an agent-specific threat.
---

## Output → Browser Security


* [ ] AI-generated HTML is sanitized.
* [ ] AI-generated Markdown is sanitized.
* [ ] AI-generated URLs are validated.
* [ ] AI-generated links cannot use `javascript:`.
* [ ] AI-generated links cannot access arbitrary internal resources.
* [ ] AI-generated SVG is handled safely.
* [ ] AI-generated iframe URLs are allowlisted.
* [ ] AI-generated CSS cannot break containment.
* [ ] AI output cannot inject script tags.
* [ ] AI output cannot create event-handler attributes.
* [ ] AI output cannot manipulate browser storage.
* [ ] AI output cannot produce arbitrary DOM.
* [ ] CSP remains effective.
* [ ] Trusted Types are considered where appropriate.
