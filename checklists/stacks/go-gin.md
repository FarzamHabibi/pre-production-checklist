# Go / Gin

Items from the core checklists that are specific to **Go / Gin**. If you do not use it, skip this file entirely — the core checklists stand on their own.

[← all checklists](../README.md)

---


## Backend Application & API
<sub>from [`core/04-backend-api.md`](../core/04-backend-api.md)</sub>

* [ ] Verify `gin.SetMode(gin.ReleaseMode)` in production — debug mode prints routes and full request detail.
* [ ] Verify `http.Server` sets `ReadTimeout`, `WriteTimeout`, `IdleTimeout` and `ReadHeaderTimeout`; Go's defaults are unlimited and a slow client can hold connections open indefinitely.
* [ ] Verify `MaxHeaderBytes` and a body size limit (`http.MaxBytesReader`) are set.
* [ ] Verify `net/http/pprof` is not registered on a public router — it is enabled by a blank import that is easy to miss.
* [ ] Verify `c.ShouldBindJSON` is used rather than `c.Bind`, which writes a 400 and continues in ways callers forget to check.
* [ ] Verify bound structs use `binding:"required"` where a missing field must be rejected, and that ownership fields are not bindable at all.
* [ ] Verify the CORS middleware does not reflect arbitrary origins alongside credentials.
* [ ] Verify panics are recovered and that the recovery handler does not return the stack trace to the client.

## Web Frontend
<sub>from [`core/05-web-frontend.md`](../core/05-web-frontend.md)</sub>

* [ ] Verify `html/template` is used for anything rendered into HTML — `text/template` does not escape and is the single most common Go XSS cause.
* [ ] Verify template names and paths are not chosen by user input.

## Database & Row-Level Security
<sub>from [`core/06-database.md`](../core/06-database.md)</sub>

* [ ] Verify every query uses placeholders; search for `fmt.Sprintf` and `+` inside `db.Query`, `db.Exec` and any ORM raw call.
* [ ] Verify `sql.DB` connection pool limits are set so a slow query cannot exhaust connections.

## Object Storage & File Handling
<sub>from [`core/07-storage-and-files.md`](../core/07-storage-and-files.md)</sub>

* [ ] Verify `c.File`, `c.FileAttachment` and `http.ServeFile` paths are cleaned and confined to a base directory — `filepath.Join` alone does not prevent traversal.
* [ ] Verify `gin.Static` is not serving the repository root or dotfiles.

## Secrets Management & Cryptography
<sub>from [`core/08-secrets-and-crypto.md`](../core/08-secrets-and-crypto.md)</sub>

* [ ] Verify `crypto/rand` is used for tokens, session ids and nonces — search for `math/rand`.
* [ ] Verify `subtle.ConstantTimeCompare` is used for secret comparison rather than `==`.

## Pre-Release Gates
<sub>from [`core/17-release-gates.md`](../core/17-release-gates.md)</sub>

* [ ] Run `govulncheck ./...` and confirm no reachable known vulnerability.
* [ ] Verify build flags strip debug info for release binaries if the binary is distributed.
* [ ] Verify goroutines started per request take a `context.Context` and exit when it is cancelled.
