# Security policy

This repository publishes a security checklist. It would be a poor one if there were
nowhere to report a problem with it.

## Reporting a vulnerability

Use **[GitHub private vulnerability reporting](https://github.com/FarzamHabibi/pre-production-checklist/security/advisories/new)**.
It is enabled on this repository, the report stays private until a fix is out, and it
reaches the maintainer directly.

Please do not open a public issue for something exploitable.

Expect an acknowledgement within **72 hours** and an assessment within **7 days**. This is
maintained by a small team, not a security organisation — if you need a faster commitment
than that, say so in the report and it will be prioritised.

## What counts

Three different things live here, and a report can be about any of them.

### The published package

`prodcheck` on npm ships a CLI and an MCP server. Both read untrusted input — command
line arguments, and JSON-RPC over stdin — and the MCP server is designed to be run by an
AI agent, which makes its input less predictable than a human's.

In scope: anything that lets input reach the filesystem, the network, or a shell.
Path traversal through `--out`. A parser bug in the MCP transport. Prototype pollution.
A dependency confusion or typosquat opportunity in how it is installed.

The package has **zero runtime dependencies** and is meant to keep it that way; a report
that a dependency has appeared is a valid report.

### The website

`prodcheck.pages.dev` is static, but it is not inert: it serves a Content-Security-Policy,
pins its one inline script by hash, and fetches from `api.npmjs.org`. A CSP bypass, a way
to get script execution, or a header that is weaker than it looks are all in scope.

### The checklist content itself

This is the category unique to this project, and the most valuable.

**An item that is wrong in a way that would make a reader less safe is a security bug**,
not a documentation typo. Examples of what we want to hear about:

* An item that recommends a control which is broken, deprecated, or actively harmful.
* An item that implies something is sufficient when it is not — the failure mode the
  checklist itself warns about most.
* A release-gate item that would pass while the underlying problem remains.
* Guidance that was correct when written and has since become dangerous, because a
  framework default changed underneath it.

These can be filed publicly as ordinary issues; nothing about them is exploitable in
itself. They are still treated as the highest-priority class of report, because a
checklist that gives false confidence is worse than no checklist.

## What does not count

* A finding in **your** application that this checklist helped you discover. That is the
  checklist working. Report it to whoever owns that application.
* Missing coverage — an item that should exist but does not. That is a very welcome
  [issue or pull request](CONTRIBUTING.md), just not a vulnerability report.
* The absence of a security header on a site you do not control that happens to link here.

## Scope of the maintainer's control

For transparency about where a report can actually be acted on:

| | |
| --- | --- |
| The repository, the npm package, the site content | maintained here |
| `prodcheck.pages.dev` hosting | Cloudflare Pages |
| The npm registry itself | npm / GitHub |

A vulnerability in the platforms above should go to those vendors. If you are not sure
which, report it here and it will be routed.

## Disclosure

Coordinated. A fix ships, the advisory is published with credit unless anonymity is
requested, and the release notes say what changed and why. There is no bounty programme.
