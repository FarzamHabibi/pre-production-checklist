# AI-Assisted Development Process

How the code got written changes what you should look for. These sections are organized by the *class of bug*, not by which assistant produced it.

[← all checklists](../../README.md)

---

## Development Process


This section applies to code generated, modified, reviewed, refactored, or configured with AI coding assistants, coding agents, autocomplete tools, autonomous agents, or LLM-generated patches.

### 73.1 Development Process

* [ ] Inventory all AI coding tools used by developers.
* [ ] Inventory all autonomous coding agents.
* [ ] Identify which repositories each AI tool can access.
* [ ] Identify which branches each AI tool can modify.
* [ ] Identify whether AI tools can execute commands.
* [ ] Identify whether AI tools can access terminals.
* [ ] Identify whether AI tools can access local files.
* [ ] Identify whether AI tools can access cloud credentials.
* [ ] Identify whether AI tools can access production systems.
* [ ] Identify whether AI tools can access secrets.
* [ ] Identify whether AI tools can create pull requests.
* [ ] Identify whether AI tools can merge pull requests.
* [ ] Identify whether AI tools can modify CI/CD.
* [ ] Identify whether AI tools can modify infrastructure.
* [ ] Identify whether AI tools can install dependencies.
* [ ] Identify whether AI tools can modify lockfiles.
* [ ] Identify whether AI tools can modify security configuration.
* [ ] Identify whether AI-generated code requires human review.
* [ ] Require security-sensitive changes to receive human review.
* [ ] Require AI-generated authentication/authorization changes to receive security review.
* [ ] Require AI-generated infrastructure changes to receive security review.
* [ ] Require AI-generated CI/CD changes to receive security review.
* [ ] Verify concurrent agent sessions each work in their own worktree or clone, or that every commit stages explicit paths — `git commit -a` in a shared tree ships another session's half-finished change past your green gate.
* [ ] Verify agents know which scripts rewrite files (`--fix`, `--write`, formatters, codemods) and run only read-only commands to inspect — a lint run with `--fix` to read the errors rewrites files another session is editing.
* [ ] Verify no command an agent runs can reinstall or purge a dependency directory shared with other checkouts, such as a symlinked `node_modules` or a shared virtualenv.
* [ ] Verify an agent takes its type-check and test baseline at the start of its session, so failures it caused are told apart from failures it inherited.
