# Sema — CI/CD and Release Operations

Version 1.0 · 16 October 2026 · Proposed pilot delivery policy

**Decision:** automate checks on every pull request and main-branch change; use a deliberate founder-operated production deployment during the free-tier pilot. Adopt automated production deployment only after repository protection, credentials, quota and migration controls are proved. This is a continuous integration and controlled delivery plan, not a claim that a repository or pipeline is already configured.

See the [system design](sema-system-design.md), [implementation plan](sema-implementation-plan.md), [technical design](sema-technical-design.md) and [adoption-ready templates](sema-delivery/README.md). The templates target the future application repository. They deliberately fail when the application lockfile or required check scripts are absent. The current schema-only design package is not that application.

## 1. Why the pilot release path is manual

GitHub documents that required environment reviewers are available only for public repositories on Free, Pro and Team plans. GitHub Free environment secrets are also limited to public repositories. Do not claim that creating an environment name gives a private Free repository an enforced approval gate. Source: [deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).

The default is a private application repository, GitHub-hosted Linux CI without production credentials, and an explicit founder release from a clean checked-out candidate. Repository visibility has not been chosen by the user; private is an engineering default, not an instruction to create a repository. Verify available branch/ruleset protection for the actual plan. Where enforcement is unavailable, document the founder's procedural review; never describe it as a technical prevention of bypass. Do not make the code public or buy a plan to obtain controls without a separate decision.

Do not put production provider/deployment credentials into ordinary repository secrets merely to work around absent environment approvals. For the pilot, load them from the approved operator secret store only during the reviewed release. This limits accidental CI deployment; it does not make a founder workstation immune to compromise. Use a clean environment, MFA, current software and minimal account access. If enforceable separation of duties becomes required, resolve the account/plan/operating model first.

## 2. Repository, branches and environments

| Area | Default |
|---|---|
| Repository | One pnpm workspace repository: `apps/web` (`@sema/web`) owns Next.js and future Convex modules; `packages/ui` (`@sema/ui`) owns shared UI. Root scripts orchestrate checks, tests and operations. Keep the PRD/design/evidence references versioned with code or in an access-controlled linked location. |
| Branches | Short feature branches → reviewed pull request → `main`. No permanent development branch required. No automatic production deploy on merge. |
| Required checks | Stable `CI / verify` job: repository contract, lock install, format, lint, types, security, unit, Convex/domain, deterministic RAG regression, build and synthetic Chromium journey. Configure enforcement where the account permits it. |
| Review | Founder reviews changes before merge/release. Obtain qualified additional review for sensitive authorization, money, privacy and model-quality work; do not imply a second full-time employee exists. |
| Local/CI | Synthetic identities, fake provider adapters and nonproduction configuration. No customer content, production database or provider credentials. |
| Staging | Isolated backend/auth/origins, synthetic data, provider sandbox or test sink. Create only if current account permits a free configuration; quotas may be shared. No production-data copy. |
| Production | Explicitly named backend/site/provider environment, production identity configuration and gated capabilities. Pilot versus paid is a server-controlled release stage, not a separate product fork. |
| PR previews | Off by default to avoid uncontrolled deployment credits/backend creation. Trusted previews may be enabled selectively with isolated auth/data/keys and a cleanup policy after quota/plan review. Fork PRs receive no privileged preview. |

Use a committed root `pnpm-lock.yaml`, `pnpm-workspace.yaml`, exact `packageManager` pin (`pnpm@12.10.1`), runtime pin and exact candidate package versions after M0 proves the full install. The earlier stack snapshot is a dated candidate, not a permanent security guarantee. Record actual pnpm, compiler, Convex/auth/Workflow, Netlify CLI and OpenNext adapter versions. Netlify's adapter can update between builds; staging success does not prove a later rebuilt adapter is identical. Record the exact production build and run its own smoke tests. Pin an adapter only through the supported process after reviewing maintenance/security implications. See [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

All commands below run from the repository root. Enable Corepack before invoking pnpm; its shim selects the reviewed `packageManager` version. Keep Convex and its assessed auth/workflow dependencies in `apps/web`; install the reviewed Netlify CLI and Playwright tooling at the root when adopting the release/CI templates. `pnpm exec` and `pnpm --filter @sema/web exec` use installed, lockfile-resolved CLIs; do not substitute `pnpm dlx` or a floating CLI download during CI or deployment. Root check/test scripts must explicitly cover the required workspaces and fail if a required suite is missing.

## 3. Pull-request CI contract

| Check | Must prove | Execution |
|---|---|---|
| Repository contract | pnpm lockfile/workspace, package-manager/runtime pins, required root scripts and workspace manifests exist | Included `scripts/ci/verify-project.mjs`; a structural preflight, not a full YAML validator or test substitute. |
| Reproducible install | Dependency tree matches reviewed lockfile | `corepack enable`, then `pnpm install --frozen-lockfile`; review `allowBuilds` and project lifecycle scripts before running on a fresh hosted runner without production credentials. |
| Format/lint/types | Consistent source and supported compiler/framework contracts | `format:check`, `lint`, `typecheck`; do not use an obsolete framework lint shortcut if unsupported by the selected version. |
| Security | No committed secrets; dependency/advisory and relevant static checks pass | Implement `ci:security` using pinned tools, including reachable/transitive findings review. Unresolved exploitable high/critical issues block release. Network scanner failure is visible, not silently passing. |
| Unit/domain | Calendar, money, states, quotas, eligibility, reservation and idempotency rules | Fixed clocks and deterministic provider fakes. Test invariants and failure behavior rather than mirroring implementation. |
| Convex integration | Tenant/role/visitor negatives, DTO boundaries, publication/takeover/deletion/billing effects | `convex-test` and implemented handlers; include shared component/session behavior where supported. In-memory success is not proof of hosted transaction timing. |
| RAG regression | Fixed retrieval/validation fixtures, citation eligibility, abstention, prompt-injection and language routing | Deterministic local fixture suite; no paid model calls or private transcripts in PR CI. Real bilingual model quality has a separate release gate. |
| Production build | Next.js and application type/build constraints succeed against safe test configuration | No production secrets; only synthetic test URLs/configuration. An adapter/hosted staging build is still required. |
| Browser smoke | Synthetic register/FAQ/publish/chat/handoff core journey, accessibility smoke and reconnect | Local test server plus explicit test adapters, Chromium on PRs. Full supported-browser/manual accessibility evidence is a release check. |

Scripts and their assertions must be implemented in M1–M2. An empty test suite, `echo passed`, skipped test or `--if-present` does not satisfy this contract. The supplied workflow cannot prove that a future test suite is meaningful merely because a script exits zero.

Use `pull_request`, not a privileged `pull_request_target` checkout of untrusted code. Give the workflow `contents: read`, disable persisted checkout credentials, pin action commits and use ephemeral hosted runners. Never execute PR code on a founder machine with secrets. Do not interpolate PR titles, branch text or arbitrary input directly into shell commands. GitHub recommends isolating untrusted input and pinning/locking workflow dependencies: [secure use](https://docs.github.com/en/actions/reference/security/secure-use). Review newer workflow dependency-lockfile support before adoption; the supplied template pins direct actions and does not claim transitive action locking.

Cancel obsolete runs on the same branch; keep one Linux job initially to limit overhead. Record results against the exact commit. Do not trust a passing run from a previous commit or only the pull request merge-test commit when releasing a different main SHA.

## 4. Checks outside ordinary PR CI

| Trigger | Additional evidence |
|---|---|
| Candidate changes auth, tenant guards, storage or origin behavior | Real isolated staging sign-in/reset/revocation, cross-origin/cookie/CSRF checks and complete tenant-negative matrix. |
| Candidate changes model, prompt, embedding, retrieval, chunking or language handling | Approved real-provider held-out en/sw evaluation with human review, counts and versions against PRD §7.4. Use authorized bounded model budget; no automatic paid fallback. |
| Candidate changes money, quotas, access or time rules | Sandbox provider flow, callback/reconciliation/refund tests, concurrency/calendar/exhaustion cases, current tax/fee review and accounting evidence. |
| Candidate changes schema, files, erasure, jobs or component identity | Migration rehearsal, bounded backfill checks, complete erasure/export suite and relevant restore drill including later tombstones. |
| Before G3/G4/G5 | All applicable PRD release-gate evidence, provider/privacy checks, measured capacity and unresolved-risk review. |
| Before broad launch and after affected UI changes | Supported desktop/mobile browsers, keyboard/screen reader/zoom, WCAG target review, widget size and Nairobi mobile-network measurements. |

Run hosted checks only within provider-authorized testing limits and available quota. A provider outage or unavailable budget blocks the affected proof; do not relabel an omitted check as passing. Human review remains the bilingual release authority. Synthetic PR tests do not certify actual Swahili quality, M-Pesa settlement, complete recovery or production latency.

## 5. Candidate record and capability gates

Prepare a private release manifest using the [template](sema-delivery/release-manifest.template.json). Record:

- Exact main commit, lockfile SHA-256 and CI run/result for that commit.
- Staging backend/site/build IDs; production targets; package/runtime/adapter and model/prompt/embedding versions.
- Linked test/evaluation/security/privacy/billing/economics/recovery evidence, dates, reviewers and applicability to this candidate.
- Migration IDs, counts/checkpoints, readiness checks and backward-compatible rollback code.
- Current and intended server-side capability flags; pilot offer version and enrollment state.
- Explicit founder release approval, timestamp, unresolved risks and rollback owner.

The manifest is an evidence record, not a cryptographic attestation or an implemented authorization mechanism. Keep it outside public artifacts if it contains private account identifiers or evidence links. Fill it after the candidate commit exists; do not put a file's own containing commit SHA into the same commit and expect a stable hash.

| Stage | Allowed action | Prerequisite |
|---|---|---|
| G2 internal alpha | Synthetic internal use | Implemented failure paths and current internal quality/security suites. |
| G3 free pilot | Public automated activation of initial 30-day/100-answer pilots within limits | All G3 readiness/privacy/operational prerequisites. Paid live collections remain disabled. |
| G4 controlled conversions | Explicit Starter purchases by pilot owners | All G4 quality, security/privacy, payment/refund, deletion/recovery, provider, NFR and economics prerequisites; no need to already have two conversions. |
| G5 broad paid launch | Broad Starter availability after initial free enrollment policy is set | All prerequisites remain valid; two distinct eligible pilot businesses have verified settled, non-refunded Starter purchases; required audited-answer and defect gates pass. |

Keep code deployment and capability enablement separate. Client-side flags cannot enable billing, circumvent safety or reserve an expired free offer. Stage changes use an authorized operator path with an audit record. Never hardcode `paidEnabled=true` merely because a build is production.

## 6. Production release runbook

This runbook is designed for adoption during M1/M2 and rehearsal in isolated staging. It is not executed by preparing these files. Names such as `release:preflight`, `release:migrate`, `release:verify` and `release:smoke` are required future application scripts, with contracts below; they do not yet exist in the schema package.

1. **Select and freeze a candidate.** Confirm its exact main SHA has a completed passing CI run, all applicable staging/evidence reviews and the intended stage approval. Review source, dependency/lock and workflow changes. Record the target Convex deployment, Netlify site and provider environment. Avoid concurrent deployments. Check vendor quotas and a recovery point appropriate to the change. Do not deploy destructive changes while a restore point or privacy journal is unverified.
2. **Prepare a clean checkout.** Check out that exact SHA in a fresh working directory; verify a clean tree and root `pnpm-lock.yaml` hash. Run `corepack enable`, confirm `pnpm --version` matches the reviewed `packageManager` pin, and install with `pnpm install --frozen-lockfile` before loading production credentials. Run the required checks locally if the trusted CI evidence is unavailable; an infrastructure failure is not a bypass. Reconfirm no unrelated `.env.local` points at another deployment.
3. **Load scoped credentials and verify targets.** Use the approved secret store; never paste credentials into command arguments, shell history, a manifest or logs. `release:preflight` must compare the configured backend/site/provider identities with the approved manifest, inspect resource headroom and verify required control states. A mismatch aborts. Do not assume `CONVEX_DEPLOYMENT` selects the intended target when a deployment key is present.
4. **Review backend expansion.** Run the local locked Convex CLI `pnpm --filter @sema/web exec convex deploy --dry-run` against the explicitly verified target and inspect the change plan. A dry run is not proof that a real migration/backfill succeeds. No automatic `--skip-large-indexes-check`, schema-unstaging override, data import or destructive cleanup is permitted in the standard release path.
5. **Deploy compatible backend.** Run `pnpm --filter @sema/web exec convex deploy`. New functions/schema/indexes become live before the frontend update. Keep older clients/jobs supported and capabilities closed. For required backfills, `pnpm run release:migrate` runs only the approved named, idempotent, paginated migrations for this release. `pnpm run release:verify` checks counts, ledger invariants, data-generation guards and index readiness. Stop on any mismatch; never assume an index is ready because deployment began.
6. **Build the frontend for that backend.** Remove backend deploy credentials from the frontend build environment. Confirm production `NEXT_PUBLIC_CONVEX_URL`, Convex HTTP/auth site origin and other public values match the manifest. Netlify's build command must be `pnpm --filter @sema/web build`, not a second hidden backend deploy. Keep its base at the repository root so the workspace lockfile and shared UI resolve; use `apps/web/.next` as the publish directory and configure `apps/web` as the package directory in Netlify's site settings. Use the locked CLI `pnpm exec netlify build --context production` so the actual Next.js adapter processing is included. Verify these monorepo settings during M0/M2; record resolved adapter/build versions and asset checksum. Do not export server credentials into `NEXT_PUBLIC_*`.
7. **Publish the reviewed build.** Use `pnpm exec netlify deploy --prod --no-build` from that same clean repository root and verified site. Disable competing Git-triggered production builds and uncontrolled previews in Netlify before adopting this path. Verify the published deployment belongs to the selected SHA and correct backend. The CLI command is a real production mutation and is performed only by the authorized release operator.
8. **Smoke and observe.** `release:smoke` checks safe widget/bootstrap, login, isolated synthetic canary message/handoff, expected capability state and read-only payment health without initiating visitor charges or sending customer notifications. Use a marked operator test workspace excluded from pilot-conversion evidence. Observe widget/AI failures, latency, payment and ledger mismatches, job age and quotas. Proposed observation minimum: 30 minutes plus completion of affected job flows; low traffic requires synthetic checks and further observation, not an automatic success claim.
9. **Enable reviewed capabilities.** Only after the deployment is healthy, change the approved server-side flags for the intended stage, then verify their actual effects. Preserve accepted pilot periods. Record backend/frontend IDs, migrations, smoke results, flags, actor and timestamp. Retain the previous compatible code and deployment references.

Convex officially supports `deploy --dry-run` and documents that its `--cmd` build runs **before** function/schema push. We deliberately separate the operations to make backend-first compatibility and migration review explicit: [deploy reference](https://docs.convex.dev/cli/reference/deploy). Netlify documents [local build](https://cli.netlify.com/commands/build/) and [`deploy --prod --no-build`](https://cli.netlify.com/commands/deploy/). Their existence does not prove this future project's auth, adapter or environment configuration; M0/M2 must rehearse the complete path.

### Release-script contracts

| Script | Required behavior |
|---|---|
| `release:preflight` | Read-only target/manifest/config/CI/flag/quota checks; reject dirty tree, mismatched SHA/lock/backend/site/environment, expired evidence, missing approved gates or concurrent release. Never print secrets. |
| `release:migrate` | Execute only approved migration IDs with resumable cursors, limits and checkpoints; report progress/errors. Never blanket-import data, purge unrelated content or initiate provider payments. |
| `release:verify` | Check actual schema/index readiness, migration completion, application/ledger invariants and old-client compatibility. Nonzero exit on unresolved inconsistency. |
| `release:smoke` | Safe end-to-end tests on marked synthetic production canary data with bounded cleanup; no actual STK, visitor email or real customer transcript/model export. Report build/backend/version mapping. |

These scripts require implementation and review in the application. The workflow template does not invent their results. Do not automate a script that can execute arbitrary migration text supplied through a workflow input.

## 7. Schema changes and rollback

Use **expand → backfill → verify → switch → observe → contract** over separate compatible releases. Add optional fields/new indexes first, support old and new representations, run bounded resumable backfills and verify counts before requiring new fields or switching reads. Use versioned jobs and generation checks. Do not remove an old field/index/handler while retained clients, pending jobs, recovery code or the preceding frontend still need it. Index creation can block deployment while backfilling; inspect/stage changes appropriately rather than bypassing warnings. See the [Convex deploy index guidance](https://docs.convex.dev/cli/reference/deploy).

| Incident | Response |
|---|---|
| Frontend regression with compatible backend | Disable affected capability; republish the last verified compatible Netlify deployment. Verify its backend mapping and synthetic journeys. |
| Backend regression without incompatible data | Disable affected work; deploy the previous reviewed compatible backend or a forward fix; retain added fields/indexes needed for current data. Recheck frontend and pending jobs. |
| Partial migration | Stop the switch/contract phase; resume or repair from recorded checkpoints. Keep the old read path working. Do not reverse credits or delete records simply to imitate an old schema. |
| Unsafe model/prompt/corpus | Disable AI or revert only to an eligible retained evaluated configuration. Never restore an unpublished or erased source. No customer debit for rejected/stale candidates. |
| Financial mismatch | Freeze affected financial effects/checkout, preserve evidence and reconcile against authoritative provider records; use explicit correction effects. Code rollback does not refund money. |
| Data loss/corruption | Use the separate quarantine recovery runbook: latest erasure journal, identity/config/files, payment reconciliation, balance reconstruction and safe job rebuilding before traffic. Never expose raw restored snapshots. |

Do not automatically roll the database back after frontend failure. Backup restore can undo newer valid writes and revive erased content unless carefully reconciled; it is a disaster operation, not a routine deployment technique.

## 8. Secrets, supply chain and free-tier controls

| Credential | Location and restriction |
|---|---|
| Convex production deploy key | Founder release session/approved secret store; restrict target and supported deploy permission; not in PR CI or frontend build. |
| Netlify deploy token/site identity | Founder release session; use minimum account/team scope available and verify target; not in untrusted workflow code. |
| Auth/session, Workers AI, IntaSend, Resend, encryption keys | Approved backend/environment configuration; per-environment values, reviewed retention/access, rotation and incident procedure. Auth-required server configuration belongs only on the server routes that need it. |
| Public URLs, widget/site key | May be public; never treat them as authentication or put secret values behind a public name. |
| Test configuration | Synthetic identities, sandbox/fakes and sinks; production providers cannot be selected by an untrusted client input. |

Review lockfile and install-script changes; keep action commits and package pins updated through reviewed changes. Configure dependency/security updates without automatic production publishing. Review new capabilities such as workflow dependency lockfiles before relying on them. Avoid self-hosted PR runners with persistent credentials. Secret scanning, MFA, access review and rotation remain required even when no production key is stored in CI.

GitHub documents 2,000 included minutes/month and 500 MB artifact storage for private GitHub Free accounts, with different treatment for public standard runners: [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions). Verify the actual account's current allowance and spend controls. No paid overage is authorized. Prefer one Linux job, cancellation of superseded runs and no routine artifact uploads initially. Tests/screenshots/reports must use synthetic data; do not use Actions artifacts as a private production backup. Monitor shared account usage; optional CI pauses before exhausting essential capacity. Never skip required release checks to save minutes.

Production deploys and trusted previews also consume Netlify/Convex capacity. Track their verified account charges and keep enough capacity for recovery releases. Do not use every merge as a production deployment. Avoid scheduled real-model evaluation until its no-paid-spend limits are proved; run it deliberately against approved synthetic data and remaining budget.

## 9. Path to automated production delivery

After pilot evidence supports automation, introduce a manual-dispatch release workflow limited to an exact reviewed main SHA and verified current CI result. Require the actual account's supported approval/branch restrictions, narrow deployment credentials, release serialization and independent stage/migration checks. Build from the same SHA/lock, deploy compatible backend, verify approved migrations, build/deploy frontend, smoke, then enable only approved flags. Approve that workflow as a security-sensitive change.

Keep migrations and irreversible effects explicit; do not pass arbitrary commands, paths or secrets through dispatch inputs. Do not consume untrusted PR artifacts in a privileged deploy. A successful workflow run cannot itself establish legal review, real bilingual quality or two genuine paying businesses. Those remain separately recorded evidence. Fully automatic production deployment on merge is a later choice, not an MVP requirement.

## 10. Current verification limits

This delivery packet supplies Markdown specifications, a pinned-action CI template, a repository preflight script, Netlify configuration template and a release-record template. Local syntax/structure checks can validate those files. They cannot demonstrate GitHub enforcement, application test correctness, Netlify builds, Convex deployments, payment settlement or production recovery. No account, repository pipeline, provider resource or deployment is enabled by these documents.
