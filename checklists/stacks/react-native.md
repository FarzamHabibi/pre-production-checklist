# React Native

Items from the core checklists that are specific to **React Native**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Mobile Applications
<sub>from [`security/core/11-mobile-apps.md`](../security/core/11-mobile-apps.md)</sub>

* [ ] Verify `AsyncStorage` holds nothing sensitive — it is unencrypted plain text on both platforms.
* [ ] Verify tokens and credentials use Keychain (iOS) and Keystore/EncryptedSharedPreferences (Android) via a vetted library.
* [ ] Verify no secret is embedded in the JavaScript bundle; `react-native-config` and `.env` values are compiled into the binary and are trivially extractable.
* [ ] Verify the release build ships Hermes bytecode rather than readable JavaScript, and understand that this is obfuscation, not protection.
* [ ] Verify `__DEV__`-only code — debug menus, mock logins, verbose logging — cannot execute in release.
* [ ] Verify Flipper and any remote debugging bridge are excluded from release builds.
* [ ] Verify certificate pinning is implemented if the threat model requires it, and that it fails closed.
* [ ] Verify Android `usesCleartextTraffic` is false and iOS App Transport Security has no blanket exception.

## Web Frontend
<sub>from [`security/core/05-web-frontend.md`](../security/core/05-web-frontend.md)</sub>

* [ ] Verify `WebView` sets `originWhitelist` narrowly and does not default to `['*']`.
* [ ] Verify `injectedJavaScript` and `postMessage` handlers never evaluate content received from the page.
* [ ] Verify `WebView` does not enable `allowFileAccess` or `allowUniversalAccessFromFileURLs` unless required.

## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify deep link and universal link handlers authenticate and authorize before acting — a link is attacker-supplied input.
* [ ] Verify the app does not treat any client-side role or feature flag as an authorization decision.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Verify over-the-air update channels (CodePush, Expo Updates) are signed and that the signing key is not in the repository.
* [ ] Verify the OTA channel cannot be pointed at an attacker-controlled endpoint by a deep link or debug setting.
* [ ] Run `npm audit` against the JS dependency tree and review native dependencies separately.
