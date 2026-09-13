# Object Storage & File Handling

Uploads, downloads, signed URLs, and everything that turns a file into code execution.

[← all checklists](../../README.md)

---

## Object Storage


* [ ] Inventory every storage bucket.
* [ ] Classify every bucket as public/private.
* [ ] Verify buckets that should be private are not public.
* [ ] Review `storage.objects` RLS policies.
* [ ] Verify SELECT policies.
* [ ] Verify INSERT policies.
* [ ] Verify UPDATE policies.
* [ ] Verify DELETE policies.
* [ ] Verify object ownership checks.
* [ ] Verify folder/path ownership checks.
* [ ] Verify tenant isolation by object path.
* [ ] Verify users cannot upload into another user's path.
* [ ] Verify users cannot overwrite another user's file.
* [ ] Verify users cannot delete another user's file.
* [ ] Verify users cannot enumerate other users' objects.
* [ ] Verify object listing permissions separately from object download permissions.
* [ ] Verify signed URL issuance requires authorization.
* [ ] Verify signed URL lifetime is minimal.
* [ ] Verify signed URLs are not unnecessarily logged.
* [ ] Verify signed URLs cannot be generated for unauthorized objects.
* [ ] Verify public bucket URLs are intentional.
* [ ] Verify file replacement cannot change the security classification of a file.
* [ ] Verify upload MIME type is validated.
* [ ] Verify filename/path traversal protections.
* [ ] Verify file extension allowlists.
* [ ] Verify maximum object size.
* [ ] Verify potentially dangerous file types.
* [ ] Verify HTML/SVG upload behavior.
* [ ] Verify browser content-disposition behavior for downloads.
* [ ] Verify `Content-Type` cannot cause untrusted files to execute as active content.
* [ ] Verify image/document processing is isolated.
* [ ] Verify file scanning where required.
* [ ] Verify deletion/revocation behavior.
* [ ] Verify stale signed URLs after deletion are acceptable or explicitly mitigated.
* [ ] Verify storage policies continue to protect data when called directly from clients.

Supabase Storage uses Postgres RLS for access control on `storage.objects`; listing, reading, uploading, updating, and deleting should all be reviewed explicitly.
---

## File / Document / Image Security


* [ ] Identify all parsers.
* [ ] Identify all image libraries.
* [ ] Identify all PDF/document libraries.
* [ ] Identify all archive libraries.
* [ ] Scan vulnerable library versions.
* [ ] Enforce size limits.
* [ ] Enforce decompression limits.
* [ ] Isolate parsing.
* [ ] Verify uploaded media is decoded in a separate worker or service holding no production credentials, not in the API process — the parsers are C and C++ and their bug class is memory corruption, so a crafted file that escapes should lose a worker, not the database.
* [ ] Verify the media worker has no route to internal services and no cloud-metadata access.
* [ ] Verify decoding runs under a wall-clock and memory limit and a job that exceeds them is killed and quarantined, not retried — a file that hangs a decoder is the cheap version of the exploit.
* [ ] Verify the format allow-list is enforced at the decoder, not only at the MIME check — ImageMagick's delegates and FFmpeg's demuxers cover far more formats than you accept, and every extra decoder is attack surface.
* [ ] Verify each native parser's version moves on the runtime patch window in Runtime & containers, not only when its npm or pip wrapper happens to bump.
* [ ] Disable active content where unnecessary.
* [ ] Verify path traversal defenses.
* [ ] Verify symlink handling.
* [ ] Verify temporary-file handling.
* [ ] Verify cleanup.
* [ ] Verify authorization before download.
* [ ] Verify authorization after processing.
* [ ] Verify metadata exposure.
* [ ] Verify EXIF stripping where appropriate.
* [ ] Verify malicious file test cases.
* [ ] Verify content-disposition.
* [ ] Verify browser execution behavior.

### SVG

An SVG is an XML document the browser executes, not an image it decodes. It can carry
`<script>`, event handlers, external references and the whole XML parser's attack
surface, and every MIME allow-list that says `image/svg+xml` lets it in as a picture.

* [ ] Inventory every way an SVG can enter: upload, avatar-from-URL, icon import, design-tool export, AI-generated markup, and every `image/svg+xml` in a MIME allow-list.
* [ ] Verify SVG is rasterized to PNG or WebP wherever a bitmap would do — avatars, thumbnails, previews — so the document the attacker wrote is never delivered to a browser.
* [ ] Verify SVG that must stay vector goes through a sanitizer with its SVG profile enabled, and that the output has no `<script>`, no `on*` attribute, no `<foreignObject>`, no `<set>` or `<animate>` targeting `href`, and no `javascript:` or `data:` URL.
* [ ] Verify `<use>`, `<image>`, `href` and `xlink:href` cannot point at an external or cross-origin URL — depending on where the file is rendered that is a tracking beacon or an SSRF.
* [ ] Verify the XML parser that reads SVG has DTD loading and external entities disabled; SVG is XML, so XXE applies before any sanitizer sees the file.
* [ ] Verify user-supplied SVG is served from a separate origin, with `Content-Security-Policy: sandbox` or `Content-Disposition: attachment`, and never inlined into your own pages — a payload that survives sanitization then runs with no cookies and no DOM.
* [ ] Verify your own pages embed user SVG only through `<img>` or as a CSS background, never `<object>`, `<embed>`, `<iframe>` or inline markup; `<img>` runs no script, the others do.
* [ ] Verify server-side SVG rendering runs in the media worker above, with dimension, element-count and nesting caps — a few nested `<use>` elements expand exponentially and need no XML entities to do it.
