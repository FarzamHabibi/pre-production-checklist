# Android / Kotlin

Items from the core checklists that are specific to **Android / Kotlin**. If you do not
use it, skip this file entirely — the core checklists stand on their own.

If you ship through React Native or Flutter, read
[`react-native.md`](react-native.md) or [`flutter.md`](flutter.md) as well — those cover
the cross-platform layer, this covers the platform underneath it, and both apply.

[← all checklists](../README.md)

---

## Mobile Applications
<sub>from [`core/11-mobile-apps.md`](../core/11-mobile-apps.md)</sub>

* [ ] Audit every `android:exported="true"` in the manifest — since API 31 it must be declared explicitly, which is a good moment to ask whether each one should be reachable by any app on the device.
* [ ] Verify exported activities, services and receivers either require a signature-level permission or treat their `Intent` extras as untrusted input.
* [ ] Verify no component forwards an `Intent` it received to `startActivity` without validating the target (intent redirection turns your app into a launcher for internal, non-exported components).
* [ ] Verify every `PendingIntent` sets `FLAG_IMMUTABLE`, or `FLAG_MUTABLE` with a deliberate reason — a mutable `PendingIntent` handed to another app lets it rewrite the intent and act as you.
* [ ] Verify implicit broadcasts do not carry sensitive data, and that runtime-registered receivers pass `RECEIVER_NOT_EXPORTED` where they are internal.
* [ ] Verify `ContentProvider` components set `android:exported="false"` unless sharing is intended, and that `openFile` cannot be walked out of its directory with `..`.
* [ ] Verify `grantUriPermissions` and any `FileProvider` `paths.xml` do not expose a directory broader than intended — a root of `.` shares the whole app sandbox.
* [ ] Verify `android:allowBackup` is `false`, or that `fullBackupContent` / `dataExtractionRules` exclude tokens and credentials; ADB backup and cloud backup both read what you leave in.
* [ ] Verify tokens and keys live in the Android Keystore or `EncryptedSharedPreferences`, never in plain `SharedPreferences` or a file.
* [ ] Verify Keystore keys that gate sensitive actions are created with `setUserAuthenticationRequired(true)` and are invalidated when biometrics change.
* [ ] Verify nothing sensitive is written to external or scoped storage that other apps or a connected computer can read.
* [ ] Verify `Log` calls carrying tokens, personal data or request bodies are stripped in release, not merely set to a lower level.
* [ ] Verify screens showing sensitive data set `FLAG_SECURE`, which also blanks them in the recents screenshot.
* [ ] Verify sensitive views set `filterTouchesWhenObscured="true"` so an overlay cannot harvest taps (tapjacking).
* [ ] Verify the clipboard is not used for one-time codes or credentials, and that any such copy is cleared.
* [ ] Verify `taskAffinity` and `launchMode` cannot be used for task hijacking, where a malicious app inserts itself into your back stack.

## Authentication & Authorization
<sub>from [`core/02-authorization.md`](../core/02-authorization.md)</sub>

* [ ] Verify App Links are verified — `android:autoVerify="true"` plus a reachable `assetlinks.json` — otherwise another app can claim the same link and receive your OAuth redirect.
* [ ] Verify custom URL schemes are not used for OAuth redirects without PKCE; any app can register the same scheme.
* [ ] Verify deep link handlers authenticate and authorize before acting; a link is attacker-supplied input, not a trusted navigation.
* [ ] Verify biometric prompts gate a server-side check rather than only a local boolean — `onAuthenticationSucceeded` is trivially patched out of a repackaged APK.
* [ ] Verify no authorization decision depends on a value the client computes, including role flags cached in the app.

## Web Frontend
<sub>from [`core/05-web-frontend.md`](../core/05-web-frontend.md)</sub>

* [ ] Verify `addJavascriptInterface` is not used with content you do not fully control; any exposed method is reachable from the page.
* [ ] Verify `WebSettings.setAllowFileAccess`, `setAllowFileAccessFromFileURLs` and `setAllowUniversalAccessFromFileURLs` are false unless genuinely required.
* [ ] Verify `WebViewClient.onReceivedSslError` never calls `handler.proceed()` — that single line disables TLS validation for the whole WebView.
* [ ] Verify `shouldOverrideUrlLoading` restricts navigation to an allowlist rather than loading whatever the page links to.
* [ ] Verify JavaScript is disabled in WebViews that only render static content.

## Secrets Management & Cryptography
<sub>from [`core/08-secrets-and-crypto.md`](../core/08-secrets-and-crypto.md)</sub>

* [ ] Verify no API key or secret is in `BuildConfig`, `strings.xml`, `gradle.properties` or the NDK — every one of these is recoverable from the APK with `apktool` in under a minute.
* [ ] Verify the release signing keystore and its passwords are not in the repository or in `build.gradle`.
* [ ] Verify `SecureRandom` is used for tokens and nonces, and that no key or IV is hardcoded.
* [ ] Verify the network security config disables cleartext (`cleartextTrafficPermitted="false"`) and that no debug overrides ship in release.
* [ ] Verify certificate pinning, if used, is configured in the network security config or OkHttp's `CertificatePinner`, and that a backup pin exists so rotation does not brick the app.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Verify `android:debuggable` is false and `isDebuggable` is not set in the release build type.
* [ ] Verify R8/ProGuard is enabled for release, and treat it as raising cost rather than as a security control.
* [ ] Verify `minifyEnabled` and `shrinkResources` do not accidentally keep debug-only classes through an over-broad `-keep` rule.
* [ ] Verify the app is signed with the release key and that Play App Signing is configured, so a lost upload key does not lock you out.
* [ ] Verify debug-only dependencies — LeakCanary, Chucker, Flipper, a mock interceptor — are on `debugImplementation`, not `implementation`.
* [ ] Run a dependency vulnerability scan over the Gradle dependency tree, and review any dependency that adds a manifest entry or a content provider of its own.
