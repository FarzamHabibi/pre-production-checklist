# Desktop Applications

Written against macOS; the signing, update and local-storage controls generalize to Windows and Linux desktop builds.

[← all checklists](../README.md)

---

## Desktop Application Security


* [ ] Enable and review App Sandbox.
* [ ] Review every sandbox entitlement.
* [ ] Remove unnecessary entitlements.
* [ ] Remove unnecessary runtime exceptions.
* [ ] Verify code signing.
* [ ] Verify update mechanism authenticity.
* [ ] Verify auto-update packages are signed.
* [ ] Verify updater cannot be hijacked.
* [ ] Verify privileged helper tools.
* [ ] Verify XPC services.
* [ ] Verify XPC authorization.
* [ ] Verify IPC endpoints.
* [ ] Verify URL schemes.
* [ ] Verify custom protocols.
* [ ] Verify file-open handlers.
* [ ] Verify drag-and-drop input.
* [ ] Verify Finder/Quick Look integrations.
* [ ] Verify Apple Events permissions.
* [ ] Verify Accessibility permissions.
* [ ] Verify Full Disk Access assumptions.
* [ ] Verify secret storage.
* [ ] Verify local socket permissions.
* [ ] Verify Unix-domain socket authorization.
* [ ] Verify temporary files.
* [ ] Verify symbolic-link attacks.
* [ ] Verify path traversal.
* [ ] Verify privilege escalation through helper processes.
* [ ] Verify LaunchAgents.
* [ ] Verify LaunchDaemons.
* [ ] Verify installer scripts.
* [ ] Verify package scripts.
* [ ] Verify application bundle permissions.
* [ ] Verify embedded frameworks are signed.
* [ ] Verify dynamic library loading restrictions.
* [ ] Verify library search paths cannot be attacker-controlled.
* [ ] Verify environment-variable injection into privileged processes.
* [ ] Verify shell command invocation.
* [ ] Verify AppleScript execution.
* [ ] Verify shell escaping.
* [ ] Verify command injection.
* [ ] Verify update rollback protection where relevant.

Apple's Hardened Runtime restricts sensitive runtime behavior and Apple notes that macOS apps must enable Hardened Runtime for notarization.
