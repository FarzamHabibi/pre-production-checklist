# Mobile Applications

Written against iOS/Swift; most controls map directly to Android (Keystore instead of Keychain, App Links instead of Universal Links, WebView instead of WKWebView).

[← all checklists](../README.md)

---

## Mobile Application Security


Treat the mobile application according to OWASP MASVS areas: storage, cryptography, authentication, network, platform, code, resilience, and privacy.

### Authentication / sessions

* [ ] Verify login flow uses TLS.
* [ ] Verify authentication tokens are not stored in plain `UserDefaults`.
* [ ] Verify refresh-token storage.
* [ ] Verify session expiration.
* [ ] Verify logout clears the appropriate local credentials.
* [ ] Verify account switching clears prior-user state.
* [ ] Verify biometric authentication does not replace server authorization.
* [ ] Verify Face ID/Touch ID gates only local secrets where intended.
* [ ] Verify device passcode requirements are respected.
* [ ] Verify MFA flows.
* [ ] Verify account-recovery flows.
* [ ] Verify deep-link authentication flows.
* [ ] Verify OAuth redirect handling.
* [ ] Verify PKCE.
* [ ] Verify state/nonce validation.

### Keychain / local storage

* [ ] Inventory every sensitive item stored locally.
* [ ] Verify unnecessary sharing between apps is disabled.
* [ ] Verify secrets are not duplicated into logs.
* [ ] Verify secrets are not included in crash reports.
* [ ] Verify secrets are not included in analytics events.
* [ ] Verify secrets are not included in screenshots.
* [ ] Verify sensitive application state is protected.
* [ ] Verify local database encryption where needed.
* [ ] Verify database keys are protected.
* [ ] Verify backups do not expose protected data.
* [ ] Verify sensitive data deletion on logout/account deletion.

Apple's Keychain is intended for securely storing sensitive small data; Secure Enclave can provide stronger isolation for supported private keys.

### Network security

* [ ] Review every ATS exception individually.
* [ ] Verify no unnecessary HTTP endpoints.
* [ ] Verify certificate validation is not disabled.
* [ ] Search for custom trust managers.
* [ ] Search for disabled hostname verification.
* [ ] Search for insecure URLSession delegates.
* [ ] Search for certificate-pinning implementations.
* [ ] Verify pinning failure handling if pinning is used.
* [ ] Verify TLS minimum versions.
* [ ] Verify redirects cannot downgrade security.
* [ ] Verify authentication headers are not logged.
* [ ] Verify tokens are not sent to unintended hosts.
* [ ] Verify API endpoints are environment-specific.
* [ ] Verify development/staging endpoints cannot ship in production.

Apple identifies App Transport Security as the mechanism for enforcing secure network connections.

### WebViews

* [ ] Verify navigation allowlists.
* [ ] Verify JavaScript is enabled only where needed.
* [ ] Verify JavaScript bridges.
* [ ] Verify `WKScriptMessageHandler`.
* [ ] Verify message origins.
* [ ] Verify custom URL schemes.
* [ ] Verify local file access.
* [ ] Verify user-controlled HTML.
* [ ] Verify external URL handling.
* [ ] Verify cookies/session sharing.
* [ ] Verify OAuth WebView behavior.
* [ ] Verify WebView cannot access privileged native actions without validation.
* [ ] Verify native bridge methods validate all input.

### Deep links / Universal Links

* [ ] Inventory custom URL schemes.
* [ ] Verify associated-domain configuration.
* [ ] Verify domain ownership.
* [ ] Verify deep-link path allowlists.
* [ ] Verify deep links cannot perform privileged actions without authentication.
* [ ] Verify attackers cannot inject arbitrary parameters into privileged actions.
* [ ] Verify URL contents are validated before processing.
* [ ] Verify sensitive tokens are not embedded in URLs.

### Swift / native security

* [ ] Search for hard-coded secrets.
* [ ] Search for API keys that should not be public.
* [ ] Search for private keys.
* [ ] Search for embedded certificates.
* [ ] Search for test credentials.
* [ ] Search for debug endpoints.
* [ ] Search for debug flags.
* [ ] Search for insecure random number generation.
* [ ] Search for deprecated cryptography.
* [ ] Search for custom cryptographic primitives.
* [ ] Verify cryptographic keys are generated securely.
* [ ] Verify nonce/IV generation is secure.
* [ ] Verify encryption modes are authenticated where appropriate.
* [ ] Verify sensitive comparisons are safe where timing matters.
* [ ] Verify random identifiers use cryptographically secure randomness.
* [ ] Verify native code boundaries validate memory/input safely.
* [ ] Review use of `UnsafePointer`, `UnsafeMutablePointer`, C APIs, and manual memory handling.
* [ ] Review SQLite queries for injection.
* [ ] Review file path handling.
* [ ] Review archive extraction.
* [ ] Review image/document parsers.

### Pasteboard / screenshots / multitasking

* [ ] Verify sensitive content is not exposed through application snapshots where appropriate.
* [ ] Verify sensitive screens are handled appropriately during backgrounding.
* [ ] Verify notifications do not expose sensitive information.
* [ ] Verify lock-screen notification content.
* [ ] Verify share sheets do not expose protected documents.
* [ ] Verify document providers cannot bypass authorization.
* [ ] Verify Files app integration.
* [ ] Verify external keyboard/clipboard considerations.

### Permissions / privacy

* [ ] Inventory all entitlements.
* [ ] Inventory all privacy-sensitive capabilities.
* [ ] Verify camera permission use.
* [ ] Verify microphone permission use.
* [ ] Verify location permission use.
* [ ] Verify contacts permission use.
* [ ] Verify photo-library permissions.
* [ ] Verify Bluetooth permissions.
* [ ] Verify tracking permissions.
* [ ] Verify background capabilities.
* [ ] Verify push-notification data.
* [ ] Verify minimum necessary entitlements.
* [ ] Verify privacy manifests and required declarations.
* [ ] Verify third-party SDK privacy behavior.
* [ ] Verify analytics SDK data collection.
* [ ] Verify sensitive data is not sent to third parties.
