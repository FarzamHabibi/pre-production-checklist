# Object Storage & File Handling

Uploads, downloads, signed URLs, and everything that turns a file into code execution.

[← all checklists](../README.md)

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
