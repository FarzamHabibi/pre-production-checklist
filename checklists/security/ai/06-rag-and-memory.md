# RAG & Agent Memory

Anything retrievable is a potential instruction channel. Anything persisted is a potential permanent one.

[← all checklists](../../README.md)

---

## RAG Security


### Data ingestion

* [ ] Inventory every RAG data source.
* [ ] Identify source owners.
* [ ] Verify source authenticity.
* [ ] Verify document integrity.
* [ ] Verify document access permissions.
* [ ] Verify deleted documents are removed from retrieval.
* [ ] Verify changed permissions propagate to retrieval.
* [ ] Verify tenant isolation.
* [ ] Verify confidential documents cannot enter public indexes.
* [ ] Verify malicious documents cannot poison the corpus.
* [ ] Verify ingestion pipeline validates document type.
* [ ] Verify ingestion pipeline limits file sizes.
* [ ] Scan documents for malicious content.
* [ ] Extract metadata safely.

### Retrieval

* [ ] Apply authorization before retrieval where possible.
* [ ] Apply authorization after retrieval as defense in depth.
* [ ] Verify vector search is tenant-aware.
* [ ] Verify metadata filters cannot be removed by the model.
* [ ] Verify model cannot modify retrieval filters.
* [ ] Verify one tenant's embeddings cannot be searched by another.
* [ ] Verify deleted records are removed from indexes.
* [ ] Verify stale embeddings cannot leak old data.
* [ ] Verify search results do not include inaccessible metadata.
* [ ] Verify top-K limits.
* [ ] Verify context limits.
* [ ] Verify retrieval result sizes.
* [ ] Verify malicious documents cannot dominate retrieval.
* [ ] Test retrieval poisoning.
* [ ] Test cross-tenant retrieval.
* [ ] Test metadata-filter bypass.
* [ ] Test semantic injection.
* [ ] Test malicious instructions in documents.

OWASP's 2025 LLM Top 10 explicitly includes vector and embedding weaknesses as a dedicated category.
---

## Memory Security


For every memory mechanism:

* [ ] Identify what is stored.
* [ ] Identify who can write memory.
* [ ] Identify who can read memory.
* [ ] Identify who can delete memory.
* [ ] Verify tenant isolation.
* [ ] Verify user isolation.
* [ ] Verify memory expiration.
* [ ] Verify deletion.
* [ ] Verify account-deletion behavior.
* [ ] Verify memory cannot contain system secrets.
* [ ] Verify memory cannot override system instructions.
* [ ] Verify memory content is treated as potentially untrusted.
* [ ] Verify users cannot create persistent malicious instructions.
* [ ] Verify prompt injection cannot permanently alter agent behavior through memory.
* [ ] Verify memory poisoning.
* [ ] Verify memory replay.
* [ ] Verify stale permissions are not stored as permanent authority.
* [ ] Verify role changes invalidate relevant memories.
* [ ] Verify tenant transfer does not expose previous tenant memories.
