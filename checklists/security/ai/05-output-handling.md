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
* [ ] Verify model output written to a terminal, CLI or log viewer has ANSI and OSC escape sequences (`\x1b[`, `\x1b]`) stripped — an injected sequence can hide lines, rewrite what the operator sees or plant a clickable link.
* [ ] Never execute arbitrary model-generated shell commands.
* [ ] Never execute arbitrary model-generated JavaScript.
* [ ] Never directly render model output as trusted HTML.
* [ ] Never directly use model output as SQL.
* [ ] Never directly use model output as an HTTP destination.
* [ ] Never directly use model output as a filesystem path.
* [ ] Never directly use model output as IAM policy.
* [ ] Never directly use model output as infrastructure configuration without validation.
* [ ] Verify text a model writes for public pages is checked for specifics nobody supplied — durations, schedules, ratings, guarantees, counts, credentials — and that invented ones are removed or sent to the owner before publishing; a made-up guarantee on a live page is a claim the owner answers for.

OWASP identifies improper output handling as a distinct risk because insecure downstream use of LLM output can create traditional application vulnerabilities.
---

## Generated-Code Execution


This requires special review.

* [ ] Identify whether an agent can write code.
* [ ] Identify whether an agent can execute code.
* [ ] Never execute generated code directly on the production host.
* [ ] Sandbox execution.
* [ ] Verify the sandbox is a process or kernel boundary — a separate process under seccomp, a microVM, a container runtime with its own kernel — and not a language-level one: Node's `vm` module, `new Function`, a worker thread, or Python `exec` with a filtered namespace all share the host's engine and heap, and one engine bug is a host compromise.
* [ ] Search for `vm.runInNewContext`, `vm.runInThisContext`, `new Function(`, `eval(` and `exec(` on any path that carries model output; each one is execution on the host, whatever the surrounding code calls it.
* [ ] Verify the engine inside the sandbox is patched on the same window as the production runtime — a sandbox running last year's V8 is one published bug from the host.
* [ ] Verify the sandbox is exercised by a test that tries to read a host file, open a socket to an internal address and fetch the cloud-metadata endpoint, and that all three fail.
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
* [ ] Verify AI-written CSS values (colors, custom properties, font names) are checked against a grammar before they reach a stylesheet — a value containing `;`, `}` or `url(` ends the declaration and starts the attacker's.
* [ ] Verify AI-generated pages that run script render in an `<iframe sandbox>` without `allow-same-origin`, or on a separate origin — `allow-scripts` together with `allow-same-origin` lets the frame remove its own sandbox.
* [ ] Verify compiled output stored for a later render (a bundle in a database row) is written only by the build step, or re-validated before it is served — a row the application can write is otherwise a stored-XSS channel.
* [ ] AI output cannot inject script tags.
* [ ] AI output cannot create event-handler attributes.
* [ ] AI output cannot manipulate browser storage.
* [ ] AI output cannot produce arbitrary DOM.
* [ ] CSP remains effective.

Treat AI-generated SVG as an upload: the SVG section of [`security/core/07-storage-and-files.md`](../core/07-storage-and-files.md) applies unchanged, and a model will emit `<foreignObject>` and an `href` to an external host without being asked.
* [ ] Trusted Types are considered where appropriate.
