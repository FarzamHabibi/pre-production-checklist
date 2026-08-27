# Flutter

Items from the core checklists that are specific to **Flutter**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Mobile Applications
<sub>from [`core/11-mobile-apps.md`](../core/11-mobile-apps.md)</sub>

* [ ] Verify secrets are not in Dart source or `--dart-define` values — both end up in the compiled binary and are recoverable from an APK or IPA.
* [ ] Verify sensitive values use `flutter_secure_storage` (Keychain / Keystore) rather than `shared_preferences`, which is plain text.
* [ ] Verify release builds use `--obfuscate --split-debug-info`, and treat that as raising cost, not as a security boundary.
* [ ] Verify `kDebugMode` code paths — developer menus, bypass logins, verbose logging — cannot run in release.
* [ ] Verify `debugPrint` and `print` do not emit tokens or personal data; they reach the device log in release.
* [ ] Verify certificate pinning if required, implemented via `SecurityContext` or the HTTP client's `badCertificateCallback`, and confirm the callback never returns `true` unconditionally.
* [ ] Verify Android `usesCleartextTraffic` is false and iOS ATS has no blanket exception.
* [ ] Verify screenshot and app-switcher protection (`FLAG_SECURE` on Android, an overlay on iOS) if the app displays sensitive data.

## Web Frontend
<sub>from [`core/05-web-frontend.md`](../core/05-web-frontend.md)</sub>

* [ ] Verify `webview_flutter` restricts navigation with a delegate rather than allowing arbitrary URLs.
* [ ] Verify JavaScript channels do not evaluate page-supplied content or expose native capability to the page.

## Authentication & Authorization
<sub>from [`core/02-authorization.md`](../core/02-authorization.md)</sub>

* [ ] Verify deep link routes authenticate and authorize before performing an action.
* [ ] Verify biometric authentication gates a server-side check and is not the sole authorization decision.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Verify platform channel handlers validate arguments — they are a trust boundary between Dart and native code.
* [ ] Run `dart pub outdated` and review transitive package sources; pub.dev packages run code at build time.
* [ ] Verify the release build does not ship with a debug signing configuration.
