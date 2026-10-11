# Prompt Injection & Goal Hijacking

Prompt injection is not a filtering problem. It is an authorization problem wearing a text costume — untrusted text reaching a privileged execution path.

[← all checklists](../../README.md)

---

## Prompt Injection


### Direct prompt injection

* [ ] Test "ignore previous instructions".
* [ ] Test instruction-priority manipulation.
* [ ] Test role impersonation.
* [ ] Test fake system messages.
* [ ] Test fake developer messages.
* [ ] Test hidden instructions.
* [ ] Test Unicode obfuscation.
* [ ] Verify input from users, documents and tool output is checked for Unicode tag characters (U+E0000–U+E007F), zero-width characters and bidi controls, and that they are removed or rejected before the model sees them — they carry instructions a human reviewer cannot see.
* [ ] Test homoglyph attacks.
* [ ] Test Base64/encoding tricks.
* [ ] Test whitespace manipulation.
* [ ] Test Markdown manipulation.
* [ ] Test HTML manipulation.
* [ ] Test delimiter breaking.
* [ ] Test XML/JSON delimiter attacks.
* [ ] Test multi-language injection.
* [ ] Test extremely long context attacks.
* [ ] Test instruction repetition.
* [ ] Test recursive instructions.
* [ ] Test indirect instructions embedded in user-provided files.

### Indirect prompt injection

Test hostile instructions inside:

* [ ] web pages
* [ ] PDFs
* [ ] Word documents
* [ ] images/OCR output
* [ ] emails
* [ ] Slack/Teams messages
* [ ] GitHub issues
* [ ] GitHub pull requests
* [ ] GitHub README files
* [ ] Git commits
* [ ] source code
* [ ] database records
* [ ] customer profiles
* [ ] support tickets
* [ ] CRM records
* [ ] calendar events
* [ ] search results
* [ ] vector database results
* [ ] MCP tool output
* [ ] other agent output
* [ ] third-party API responses
* [ ] browser content

OWASP emphasizes that prompt injections do not need to be human-visible and that RAG or fine-tuning should not be treated as complete protection against prompt injection.
---

## Agent Goal Hijacking


* [ ] Verify external content cannot redefine the agent's goal.
* [ ] Verify retrieved documents cannot override system/developer instructions.
* [ ] Verify webpages cannot redirect the agent's objective.
* [ ] Verify tool output cannot redefine the objective.
* [ ] Verify another agent cannot redefine the objective.
* [ ] Verify user-controlled metadata cannot redefine the objective.
* [ ] Verify agent memory cannot permanently change the objective.
* [ ] Verify instructions stored in database records are treated as untrusted data.
* [ ] Verify instructions inside files are treated as untrusted data.
* [ ] Verify "system-like" language from retrieved content has no special authority.
* [ ] Verify an agent cannot create persistent malicious instructions for a future run.
* [ ] Verify attacker-controlled content cannot alter future scheduled agent behavior.
* [ ] Verify attacker-controlled content cannot alter agent configuration.
---

## System Prompt Security


* [ ] Inventory every system prompt.
* [ ] Inventory every hidden instruction.
* [ ] Inventory every policy prompt.
* [ ] Inventory tool descriptions.
* [ ] Inventory tool authorization instructions.
* [ ] Inventory system-level secrets accidentally embedded in prompts.
* [ ] Verify credentials are never placed in prompts.
* [ ] Verify API keys are never placed in prompts.
* [ ] Verify there is exactly one place a user enters a secret — a dedicated field that posts straight to storage — and that chat, approval forms and anything a model can render never show a password or key input; a secret typed into the conversation is in the model's context, the transcript and the logs.
* [ ] Verify private business secrets are not included unnecessarily.
* [ ] Verify database schemas are not exposed unnecessarily.
* [ ] Verify internal architecture details are not exposed unnecessarily.
* [ ] Verify prompt disclosure does not automatically grant additional privileges.
* [ ] Verify security does not depend on the prompt remaining secret.
* [ ] Test prompt extraction.
* [ ] Test "repeat your instructions".
* [ ] Test "show hidden instructions".
* [ ] Test indirect extraction through tool calls.
* [ ] Test extraction via summaries.
* [ ] Test extraction via translation.
* [ ] Test extraction via encoding.
* [ ] Test extraction via error messages.
* [ ] Test extraction via agent memory.

OWASP treats system-prompt leakage as its own risk and recommends not assuming hidden prompts are a security boundary.
---

## Prompt Structure / Instruction Hierarchy


* [ ] Clearly separate system instructions from user data.
* [ ] Clearly separate developer instructions from external data.
* [ ] Clearly separate retrieved content from trusted instructions.
* [ ] Clearly separate tool output from trusted instructions.
* [ ] Clearly separate memory from trusted instructions.
* [ ] Clearly label untrusted content.
* [ ] Use structured message boundaries.
* [ ] Verify the server loads earlier conversation turns from its own store by a conversation id checked against the caller, and never accepts assistant or system turns in the request body — a client-sent history lets an attacker write the model's earlier "agreement" for it to follow through on.
* [ ] Avoid concatenating arbitrary text into privileged instructions.
* [ ] Avoid dynamically modifying system prompts with user-controlled data.
* [ ] Avoid dynamically modifying tool descriptions from untrusted content.
* [ ] Avoid dynamically modifying authorization rules using model output.
* [ ] Verify truncation cannot remove security instructions while leaving attacker instructions.
* [ ] Verify context-window overflow cannot change effective instruction priority.
* [ ] Verify prompt templating escapes attacker-controlled delimiters.
* [ ] Search every place the application builds a raw prompt string for chat-template control tokens (`<|im_start|>`, `<|eot_id|>`, `[INST]`), and verify user, retrieved and tool text has them stripped or encoded before tokenization — otherwise a user can close their own turn and open a fake system turn.
* [ ] Verify template injection defenses.
