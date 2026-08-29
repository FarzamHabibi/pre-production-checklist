# Kubernetes

Items from the domain checklists that are specific to **Kubernetes**. If you do not use it, skip this file entirely — the domain checklists stand on their own.

[← all checklists](../README.md)

---


## Runtime, Containers & Hosting
<sub>from [`security/core/13-runtime-and-containers.md`](../security/core/13-runtime-and-containers.md)</sub>

* [ ] Verify pods set `runAsNonRoot`, a non-zero `runAsUser`, `readOnlyRootFilesystem` and drop all capabilities except those genuinely needed.
* [ ] Verify `allowPrivilegeEscalation: false` and that no pod runs `privileged: true`.
* [ ] Verify no pod mounts the host filesystem, the host network, the host PID namespace, or the container runtime socket.
* [ ] Verify Pod Security Admission is enforcing a baseline or restricted profile on application namespaces, not just warning.
* [ ] Verify every container sets both requests and limits for CPU and memory; without them one pod can starve a node.
* [ ] Verify image tags are digests or immutable, and that `imagePullPolicy` does not silently pull a changed `latest`.
* [ ] Verify images come from a registry you control or trust, and that admission rejects the ones that do not.

## Authentication & Authorization
<sub>from [`security/core/02-authorization.md`](../security/core/02-authorization.md)</sub>

* [ ] Verify `automountServiceAccountToken: false` on pods that never call the API server — the default mounts a usable token into every container.
* [ ] Verify no ClusterRoleBinding grants `cluster-admin` to a service account or to `system:authenticated`.
* [ ] Verify RBAC rules avoid wildcard verbs and resources, and that `create pods/exec` and `secrets get` are treated as the escalations they are.
* [ ] Verify a workload cannot read secrets belonging to another namespace.
* [ ] Verify cloud identity is bound per service account (Workload Identity, IRSA) rather than inherited from the node.

## Secrets Management & Cryptography
<sub>from [`security/core/08-secrets-and-crypto.md`](../security/core/08-secrets-and-crypto.md)</sub>

* [ ] Verify etcd encryption at rest is enabled; a Kubernetes Secret is base64, not encryption.
* [ ] Verify secrets are mounted as files rather than injected as environment variables where the workload allows it.
* [ ] Verify secrets are not committed in manifests, Helm values, or a Kustomize overlay.

## Common Web Attack Classes
<sub>from [`security/core/09-common-web-attacks.md`](../security/core/09-common-web-attacks.md)</sub>

* [ ] Verify a default-deny NetworkPolicy exists per namespace; without one every pod can reach every other pod and the metadata endpoint.
* [ ] Verify egress is restricted for workloads that have no reason to reach the internet.
* [ ] Verify access to the cloud metadata endpoint is blocked from pods that do not need it.

## Capacity Model
<sub>from [`scale/01-capacity-model.md`](../scale/01-capacity-model.md)</sub>

* [ ] Verify PodDisruptionBudgets exist so a node drain does not take a service to zero replicas.
* [ ] Verify readiness and liveness probes are distinct and that liveness is not so aggressive it restart-loops under load.
* [ ] Verify the cluster autoscaler's ceiling is known, and what happens when a pod cannot be scheduled.
* [ ] Verify resource quotas per namespace prevent one team's workload from consuming the cluster.

## Pre-Release Gates
<sub>from [`security/core/17-release-gates.md`](../security/core/17-release-gates.md)</sub>

* [ ] Verify the API server is not publicly reachable, or is restricted by authorised networks.
* [ ] Verify audit logging is on and shipped somewhere outside the cluster.
* [ ] Verify the Kubernetes version is supported and that node images are patched on a schedule.
