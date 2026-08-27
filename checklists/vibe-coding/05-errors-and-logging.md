# AI-Generated Error Handling & Logging Bugs

[← all checklists](../README.md)

---

## Error Handling


* [ ] Verify generated error handlers do not expose stack traces.
* [ ] Verify generated errors do not expose SQL.
* [ ] Verify generated errors do not expose secrets.
* [ ] Verify generated errors do not expose internal paths.
* [ ] Verify generated errors do not expose cloud infrastructure.
* [ ] Verify generated errors do not reveal whether an account exists.
* [ ] Verify generated errors do not disclose authorization details unnecessarily.
* [ ] Verify generated catch blocks do not swallow security failures.
* [ ] Verify generated retries do not duplicate sensitive operations.
* [ ] Verify generated fallbacks fail closed.
* [ ] Verify AI did not convert an exception into a privileged default behavior.
---

## Logging Bugs


* [ ] Search new code for `console.log`.
* [ ] Search for request/response logging.
* [ ] Search for Authorization header logging.
* [ ] Search for cookies.
* [ ] Search for JWTs.
* [ ] Search for refresh tokens.
* [ ] Search for passwords.
* [ ] Search for API keys.
* [ ] Search for request bodies containing PII.
* [ ] Search for full AI prompts.
* [ ] Search for AI tool arguments.
* [ ] Search for AI tool output.
* [ ] Search for signed URLs.
* [ ] Search for database connection strings.
* [ ] Search for cloud credentials.
* [ ] Search for filesystem paths.
* [ ] Verify production log level is intentional.
