# AWS

Items from the domain checklists that are specific to **AWS**. If you do not use it, skip this file entirely — the domain checklists stand on their own.

[← all checklists](../README.md)

---


## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify no IAM policy combines a wildcard action with a wildcard resource; search for `"Action": "*"` and `"Resource": "*"` in the same statement.
* [ ] Verify no policy grants `iam:PassRole` with `Resource: "*"` — that is privilege escalation to any role in the account.
* [ ] Verify role trust policies name a specific principal, and that any `sts:AssumeRole` from another account has an `ExternalId` condition.
* [ ] Verify no human uses long-lived access keys where a role would do, and that any remaining key has a rotation date.
* [ ] Verify the root account has MFA, no access keys, and is not used for anything.
* [ ] Verify permissions were derived from what the workload actually calls — Access Analyzer generates a policy from CloudTrail rather than from guesswork.

## Runtime, Containers & Hosting
<sub>from [`security/core/13-runtime-and-containers.md`](../security/core/13-runtime-and-containers.md)</sub>

* [ ] Verify IMDSv2 is required (`HttpTokens: required`) on every instance; with IMDSv1 any SSRF becomes credential theft.
* [ ] Verify Lambda environment variables hold no secrets — they are visible to anyone with `lambda:GetFunction`; use Secrets Manager or Parameter Store.
* [ ] Verify each Lambda has its own execution role rather than sharing one across functions.
* [ ] Verify security groups do not allow `0.0.0.0/0` on anything except the ports that must be public.
* [ ] Verify databases and caches are in private subnets with no public accessibility flag set.
* [ ] Verify VPC flow logs are on for the subnets that matter.

## Object Storage & File Handling
<sub>from [`security/core/07-storage-and-files.md`](../security/core/07-storage-and-files.md)</sub>

* [ ] Verify S3 Block Public Access is enabled at the account level, not only per bucket.
* [ ] Verify no bucket policy or ACL grants `AllUsers` or `AuthenticatedUsers`.
* [ ] Verify default encryption is on and that a bucket policy denies unencrypted uploads.
* [ ] Verify presigned URLs have a short expiry and are scoped to one object and one method.
* [ ] Verify versioning and MFA delete are considered for buckets whose loss would matter.
* [ ] Verify bucket names are not guessable in a way that reveals customers or environments.

## Backend Application & API
<sub>from [`security/core/04-backend-api.md`](../security/core/04-backend-api.md)</sub>

* [ ] Verify API Gateway routes have an authorizer, and that a route added later does not default to open.
* [ ] Verify a resource policy or WAF sits in front of a public API, and that throttling is configured per stage.
* [ ] Verify stage variables carry no secrets.

## CI/CD & Supply Chain
<sub>from [`security/core/15-ci-cd-and-supply-chain.md`](../security/core/15-ci-cd-and-supply-chain.md)</sub>

* [ ] Verify GitHub Actions authenticates through OIDC rather than stored AWS keys, and that the trust policy pins the repository and branch.
* [ ] Verify CloudTrail is on in every region with log file validation, and that its bucket cannot be written by the accounts it audits.
* [ ] Verify GuardDuty or an equivalent is on and its findings reach a human.

## Cost at Scale
<sub>from [`scale/07-cost-at-scale.md`](../scale/07-cost-at-scale.md)</sub>

* [ ] Verify a budget alarm exists on rate of change, not only on the monthly total.
* [ ] Verify NAT gateway and cross-AZ data transfer are understood; both are common surprises at scale.
* [ ] Verify S3 lifecycle rules move or expire objects rather than letting storage grow indefinitely.
