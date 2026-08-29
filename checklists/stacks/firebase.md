# Firebase

Items from the domain checklists that are specific to **Firebase**. If you do not use it, skip this file entirely — the domain checklists stand on their own.

[← all checklists](../README.md)

---


## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify Firestore and Realtime Database rules do not end in a catch-all `allow read, write: if true` — the default template does, with a date-based expiry that people forget.
* [ ] Verify rules check ownership on the document, not merely that the caller is signed in; `request.auth != null` is authentication, not authorization.
* [ ] Verify rules are tested with the emulator suite, since they are code with no type checking and no review by default.
* [ ] Verify a query cannot return documents the caller may not read — rules filter documents, they do not rewrite queries, so an unscoped query fails rather than filtering.
* [ ] Verify custom claims are set only from a trusted server context, never from the client.
* [ ] Verify a client re-fetches its ID token after a role change, or the old claims stay valid until the token expires.
* [ ] Verify Storage rules are as tight as database rules; they are separate and are commonly left open.
* [ ] Verify the web API key is understood: it identifies the project, it is not a secret, and it is not what protects your data — the rules are.

## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify Cloud Functions that should not be public are not deployed with unauthenticated invocation.
* [ ] Verify callable functions check `context.auth` rather than assuming the SDK enforced it.
* [ ] Verify the Admin SDK is used only server-side; it bypasses all security rules by design.
* [ ] Verify function environment configuration holds no secret that should be in Secret Manager.

## Abuse & Availability
<sub>from [`security/core/18-abuse-and-availability.md`](../security/core/18-abuse-and-availability.md)</sub>

* [ ] Verify App Check is enabled if the client is the only thing calling your backend, and that enforcement is on rather than monitoring.
* [ ] Verify email enumeration protection is enabled in Authentication settings.
* [ ] Verify anonymous sign-in, if enabled, cannot accumulate unbounded documents or storage.
* [ ] Verify a per-user quota exists on anything that costs money, since a Firestore read loop from a client is billed to you.

## Cost at Scale
<sub>from [`scale/07-cost-at-scale.md`](../scale/07-cost-at-scale.md)</sub>

* [ ] Verify a budget alert exists; Firestore bills per document read and a missing `limit()` in a listener is expensive rather than slow.
* [ ] Verify listeners are detached when a component unmounts, or reads accumulate for the session's lifetime.
