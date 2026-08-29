# iOS / iPadOS / Swift

Items from the core checklists that are specific to **iOS / iPadOS / Swift**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---

## Mobile Applications
<sub>from [`security/core/11-mobile-apps.md`](../security/core/11-mobile-apps.md)</sub>

* [ ] Verify sensitive credentials are stored in Keychain.
* [ ] Verify universal links/app links cannot hijack authentication flows.
* [ ] Verify Keychain accessibility class.
* [ ] Verify Keychain access groups.
* [ ] Verify App Transport Security remains enabled.
* [ ] Search `Info.plist` for ATS exceptions.
* [ ] Inventory every WKWebView.
* [ ] Inventory Universal Links.
* [ ] Verify unsafe Swift/C/C++ interoperability.
* [ ] Verify secrets are not copied to the pasteboard unnecessarily.

## Desktop Applications
<sub>from [`security/core/12-desktop-apps.md`](../security/core/12-desktop-apps.md)</sub>

* [ ] Verify Keychain access groups.

## CI/CD & Supply Chain
<sub>from [`security/core/15-ci-cd-and-supply-chain.md`](../security/core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Run SCA against iOS/macOS dependencies.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Apple App Store Connect credentials

* [ ] iOS/iPadOS binary audit complete.

## AI-Generated Crypto, Dependency & Config Bugs
<sub>from [`security/ai-generated-code/04-crypto-secrets-deps.md`](../security/ai-generated-code/04-crypto-secrets-deps.md)</sub>

* [ ] Info.plist

## Review Blind Spots
<sub>from [`security/ai-generated-code/07-review-blind-spots.md`](../security/ai-generated-code/07-review-blind-spots.md)</sub>

* [ ] Verify outdated Swift security APIs are not copied.
