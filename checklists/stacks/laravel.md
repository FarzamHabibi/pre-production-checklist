# Laravel

Items from the core checklists that are specific to **Laravel**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify `APP_DEBUG=false` and `APP_ENV=production`; Laravel's debug page prints environment variables including credentials.
* [ ] Verify `APP_KEY` is set, unique per environment, and never committed.
* [ ] Verify `.env` is not reachable over HTTP and that the web root is `public/`, not the project root.
* [ ] Audit `VerifyCsrfToken::$except`; confirm each excluded route authenticates by a mechanism CSRF cannot forge.
* [ ] Verify `TrustProxies` is configured for your actual proxy rather than trusting all.
* [ ] Verify Telescope, Debugbar, Horizon and Ignition are absent or authenticated in production.
* [ ] Verify route model binding is scoped (`->scopeBindings()` or explicit `where`) so a nested route cannot fetch another tenant's child record.

## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify every Eloquent model sets `$fillable` (not `$guarded = []`), and search for `Model::unguard()` and `forceFill`.
* [ ] Verify a Policy or Gate exists for every model with per-user access, and that controllers call `authorize()`.
* [ ] Verify `Gate::before` does not silently grant everything to a role you did not intend.
* [ ] Verify API resources do not serialize hidden attributes; check `$hidden` covers tokens and password hashes.

## Database & Row-Level Security
<sub>from [`security/core/06-database.md`](../security/core/06-database.md)</sub>

* [ ] Search for `DB::raw`, `whereRaw`, `orderByRaw`, `havingRaw` and `selectRaw` with interpolated input.
* [ ] Verify `orderBy(request('sort'))` is allowlisted.

## Web Frontend
<sub>from [`security/core/05-web-frontend.md`](../security/core/05-web-frontend.md)</sub>

* [ ] Search Blade templates for `{!! !!}` — unescaped output.
* [ ] Verify `@json` is used to pass data into JavaScript rather than raw interpolation.

## Sessions, Tokens & Cookies
<sub>from [`security/core/03-sessions-tokens.md`](../security/core/03-sessions-tokens.md)</sub>

* [ ] Verify the session driver is not `cookie` if session data is sensitive.
* [ ] Verify `SESSION_SECURE_COOKIE=true` and `SESSION_SAME_SITE` are set in production.
* [ ] Verify `Hash::make` is used for passwords — search for `md5(`, `sha1(` and `crypt(` on credentials.

## Object Storage & File Handling
<sub>from [`security/core/07-storage-and-files.md`](../security/core/07-storage-and-files.md)</sub>

* [ ] Verify `store()`/`storeAs()` never uses a client-supplied filename directly.
* [ ] Verify the `storage:link` public disk contains only files intended to be world-readable.
* [ ] Verify uploads are validated with `mimes:`/`mimetypes:` rules and a size limit.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Verify `php artisan config:cache` and `route:cache` are run at deploy so no `.env` read happens at request time.
* [ ] Verify `composer audit` runs in CI.
