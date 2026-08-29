# Express

Items from the core checklists that are specific to **Express**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify `helmet()` is registered, and registered before the routes.
* [ ] Verify `app.disable('x-powered-by')` or Helmet's equivalent.
* [ ] Verify `express.json({ limit })` and `express.urlencoded({ limit, extended: false })` set a body size limit — the default allows large payloads.
* [ ] Verify `cors()` is configured with an explicit origin list, never `origin: true` with credentials.
* [ ] Verify the error-handling middleware has four arguments and does not send `err.stack` to the client.
* [ ] Verify `trust proxy` is set to your actual proxy depth — `true` lets a client spoof `X-Forwarded-For` and defeat rate limiting.
* [ ] Verify a rate limiter is applied to authentication and other expensive routes.
* [ ] Verify route parameter parsing cannot cause prototype pollution — check any deep merge of `req.body` into an object.
* [ ] Verify `express.static` does not serve dotfiles (`dotfiles: 'ignore'`) or the project root.

## Sessions, Tokens & Cookies
<sub>from [`security/core/03-sessions-tokens.md`](../security/core/03-sessions-tokens.md)</sub>

* [ ] Verify `express-session` uses a real store; the default MemoryStore leaks memory and does not survive restarts.
* [ ] Verify the session cookie sets `secure`, `httpOnly`, `sameSite` and a rolling `maxAge`.
* [ ] Verify the session secret comes from the environment and is rotated independently of the code.
* [ ] Verify `cookie-parser` is not signing with a hardcoded secret.

## Database & Row-Level Security
<sub>from [`security/core/06-database.md`](../security/core/06-database.md)</sub>

* [ ] Verify parameterized queries everywhere; search for template literals inside `query(`, and for `$where`, `$function` or user-controlled operators in MongoDB queries.
* [ ] Verify user input cannot inject query operators — a JSON body of `{"$gt": ""}` is the classic NoSQL authentication bypass.

## Object Storage & File Handling
<sub>from [`security/core/07-storage-and-files.md`](../security/core/07-storage-and-files.md)</sub>

* [ ] Verify `res.sendFile` and `res.download` resolve within a base directory and reject `..`.
* [ ] Verify upload middleware (multer or similar) sets file size, file count and field count limits, and does not use the client filename on disk.

## Common Web Attack Classes
<sub>from [`security/core/09-common-web-attacks.md`](../security/core/09-common-web-attacks.md)</sub>

* [ ] Search for `eval`, `new Function`, `child_process.exec` with interpolated input, and `vm` without a sandbox.
* [ ] Verify user-supplied strings never become regular expressions (ReDoS).

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Run `npm audit --omit=dev` and confirm nothing known-vulnerable ships.
* [ ] Verify `NODE_ENV=production` is actually set — Express changes error output and caching based on it.
