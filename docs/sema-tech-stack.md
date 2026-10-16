# Sema — Tech Stack Specification

**Version:** 1.0  
**Date:** 16 October 2026 (Africa/Nairobi)  
**Product:** [PRD v2.1](sema-production-prd.md)  
**Architecture:** [Technical design v1.0](sema-technical-design.md)  
**Package snapshot:** [Candidate versions](sema-stack-candidate.json)  
**Status:** Selected service architecture and delegated engineering defaults; package candidates require an application integration check before locking the app.

Sema will use **Next.js and React, Tailwind CSS and shadcn/ui, Convex, Better Auth, Workers AI, IntaSend, Resend and Netlify**. This document makes the choices explicit without changing the confirmed product. No application was installed or deployed during this stack review.

Web research for this review used the **Firecrawl plugin**, including live retrieval of official npm metadata and provider documentation. The same research preference applies to subsequent work in this project. Sema's own single-page import remains a bounded server-side fetch/extraction pipeline; adding a runtime Firecrawl service would require a separate cost/privacy decision.

## 1. Selected stack

| Layer | Selection | Purpose and boundary | Decision status |
|---|---|---|---|
| Language | TypeScript | Shared application types, strict server contracts and domain logic | Delegated default; existing schema checked with 7.0.2 |
| Runtime / packages | Node.js 24.x, pnpm 12.10.1 | pnpm workspaces, root `packageManager` pin, and committed `pnpm-lock.yaml`; use the current approved Node security patch | pnpm workspace foundation installed; full-stack integration still pending |
| Web framework | Next.js App Router + React | Dashboard, account/billing pages and isolated widget iframe route | Next.js confirmed; React/framework details delegated |
| Styling | Tailwind CSS 4 + `@tailwindcss/postcss` | Shared design tokens and small scoped styles | Delegated default |
| UI components | shadcn/ui source components | Forms, dialogs, inbox controls and accessible interaction primitives; import only components actually needed | Delegated default; record CLI/registry revisions when generating source |
| Icons | Lucide React | Consistent icons with explicit labels for important actions | Delegated default; import individual icons |
| Forms | React Hook Form + Zod + Hook Form resolvers | Form state, client validation and typed external-response parsing | Delegated default; Convex `v.*` remains the backend argument/schema boundary |
| Languages | next-intl | Reviewed English and Swahili interface catalogs, date/number formatting and explicit language selection | Both languages confirmed; library delegated |
| Backend / database | Convex Free | Canonical application documents, queries, mutations, authorized realtime subscriptions and ledger effects | Confirmed, subject to account/terms/quality/privacy/recovery gates |
| Authentication | Better Auth through `@convex-dev/better-auth` | Email/password, verified email, reset/revocation and assessed Next.js integration | Delegated integration within confirmed Convex architecture; mandatory proof |
| Search / RAG storage | Convex vector + full-text indexes | Tenant/corpus-scoped retrieval, versioned publication and provenance | Confirmed design; measured bilingual quality required |
| File storage | Convex File Storage | Quarantined originals and private expiring exports through authorization-checked HTTP routes | Confirmed design; safe upload, privacy and recovery proof required |
| Background processing | Convex scheduler and assessed Workflow component | Ingestion, generation, notifications, reconciliation and deletion; canonical jobs remain in application tables | Confirmed architecture; component details delegated |
| Generation / embeddings | Cloudflare Workers AI, direct server REST | Qwen generation and BGE-M3 embedding candidates; no financial/booking tools | Confirmed provider direction; models require evaluation and privacy review |
| Payments | IntaSend M-Pesa STK, server REST | Explicit owner-authorized Starter renewals/top-ups, authoritative verification and reconciliation | Confirmed; fees/taxes/refunds/account behavior require proof |
| Email | Resend Free, server REST | Auth, invitation, handoff, receipt and service notifications | Confirmed; sender/retention/delivery checks required |
| Frontend hosting | Netlify Free | Next.js deployment and widget assets; resource cap monitored | Confirmed pilot choice; full adapter/auth behavior to test |
| Testing | Vitest 4 + convex-test + Playwright | Pure domain tests, synthetic Convex tests and browser journeys in both languages | Delegated default; test doubles first |
| Diagnostics | Native provider tooling + minimized Sema events/rollups | Latency, failures, quotas, jobs, billing consistency and privacy operations | Delegated pilot baseline; independent uptime/recovery evidence still required |
| Code quality | ESLint, matching Next.js lint configuration, existing formatter | Explicit lint/type/test commands in local checks and future CI | Delegated default; exact lint tool versions resolved with the starter |

Use Convex subscriptions for server state and React/form state for local interactions. Backend API calls use typed Convex functions; external vendor calls use bounded server-side `fetch` with validated responses. A second API framework, application database or state-cache service is unnecessary for this baseline.

The repository uses `apps/web` (`@sema/web`) and `packages/ui` (`@sema/ui`), selected by the root `pnpm-workspace.yaml`. Run `corepack enable`, then `pnpm install` from the repository root for development; use `pnpm install --frozen-lockfile` in CI and reviewed releases. Pin pnpm through `package.json#packageManager` (`pnpm@12.10.1`) and review dependency build-script permissions in `pnpm-workspace.yaml#allowBuilds`. Do not bypass failed installs with peer overrides, lockfile-check suppression, or blanket script approval. Shared package dependencies use `workspace:*`.

The current frontend uses Next.js 16.4.1, React 19.3.0, TypeScript 5.x, and the Tailwind Turbopack loader. The candidates below remain integration inputs, not an instruction to replace installed versions or change the working CSS pipeline. Application dependencies belong in their owning workspace; the root lockfile covers all application workspaces. The standalone schema package under `docs/` remains outside that workspace and uses its own explicit checking procedure.

Tailwind documents its Next.js PostCSS integration; shadcn provides source-component installation and React Hook Form/Zod guidance; next-intl documents the App Router integration. These libraries supply building blocks, while Sema still needs manual accessibility and bilingual checks. [Tailwind](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [shadcn/ui](https://ui.shadcn.com/docs/installation/next), [forms](https://ui.shadcn.com/docs/forms/react-hook-form), [next-intl](https://next-intl.dev/docs/getting-started/app-router).

## 2. Package versions to start the integration check

These are **dated candidates**, not an installed production lockfile. Registry metadata was retrieved through Firecrawl on 16 October 2026. Select exact versions after the compatibility/security check and commit the complete resolved lockfile. Preserve the existing schema-verification bundle as its separate reproducible artifact.

| Package | Candidate pin | Selection reason |
|---|---|---|
| `next` | `16.4.2` | Observed stable registry version; Node requirement ≥20.9 |
| `react`, `react-dom` | `19.3.1` each | Matching pair within selected framework/integration peer ranges |
| `typescript` | `7.0.2` | Existing schema/contracts compiled with this version; full app build remains untested |
| `convex` | `1.47.0` | Existing physical schema checked with this SDK; satisfies selected component peers |
| `@convex-dev/better-auth` | `0.12.5` | Current observed adapter with explicit Better Auth peer range |
| `better-auth` | `1.6.33` | Observed `release-1.6` tag, satisfying adapter requirement `>=1.6.11 <1.7.0` |
| `@convex-dev/workflow` | `0.4.10` | Requires Convex `^1.46.0`; assessed with the selected 1.47 SDK |
| `tailwindcss`, `@tailwindcss/postcss` | `4.3.3` each | Matching style/compiler packages |
| `next-intl` | `4.14.9` | Declared Next.js 16 and React 19 peer support |
| `react-hook-form` | `7.90.0` | Declared React 19 peer support |
| `@hookform/resolvers` | `5.9.1` | Declared Zod 4 and React Hook Form `^7.55.0` compatibility |
| `zod` | `4.6.7` | Shared forms/external-data parsing; adapter also uses a Zod 4 dependency range |
| `lucide-react` | `1.58.0` | Declared React 19 peer support |
| `vitest` | `4.1.12` | Observed `V4` tag; within selected Better Auth's declared Vitest peer majors |
| `convex-test` | `0.0.62` | Requires Convex `^1.43.0`, satisfied by 1.47.0 |
| `@playwright/test` | `1.64.1` | Browser-test candidate; Node ≥20 |
| `pdfjs-dist` | `6.4.299` | Text-PDF extraction candidate; package requires Node ≥22.13 or ≥24 |
| `mammoth` | `1.13.0` | DOCX text-extraction candidate |
| `cheerio` | `1.2.0` | Bounded fetched-page text extraction; Node ≥20.18.1 |

The machine-readable [candidate snapshot](sema-stack-candidate.json) separates package pins, required companion ranges, service plans and unresolved evidence. It is intentionally not a ready-to-install app `package.json`: React/Node type packages, lint tools, shadcn-generated dependencies and component companions must be resolved and pinned together during bootstrap.

### 2.1 Compatibility findings

**Auth:** Better Auth's observed `latest` is 1.7.10, while the current Convex adapter declares `<1.7.0`. The published `release-1.6` tag points to 1.6.33. Use that candidate for the spike, assess applicable advisories/backports, and avoid blindly installing `better-auth@latest`. The quickstart's `~1.6.15` is an installation example, not evidence that 1.6.15 is the best current patch. Do not force the adapter onto 1.7 with a peer override. [Adapter metadata](https://registry.npmjs.org/@convex-dev%2fbetter-auth/latest), [release tags](https://registry.npmjs.org/-/package/better-auth/dist-tags), [1.6.33 metadata](https://registry.npmjs.org/better-auth/1.6.33), [integration guide](https://labs.convex.dev/better-auth/framework-guides/next).

**Tests:** Observed Vitest `latest` is 5.0.5, while selected Better Auth 1.6.33 lists Vitest peers through major 4. Start with the `V4` tag's 4.1.12; a release tag and compatible range do not establish a security audit or a passing test run. [Vitest tags](https://registry.npmjs.org/-/package/vitest/dist-tags), [Better Auth peers](https://registry.npmjs.org/better-auth/1.6.33).

**Workflow:** Its selected metadata also requires `convex-helpers ^0.1.127` and `@convex-dev/workpool ^0.4.4`. Resolve exact compatible patches and deduplicate the helpers alongside the auth adapter; these companions belong in the lockfile rather than being omitted from the runtime assessment. [Workflow metadata](https://registry.npmjs.org/@convex-dev%2fworkflow/latest).

**Compiler:** The previous check covered schema/API validators with TypeScript 7.0.2. It did not build Next.js, authenticate a request or deploy Netlify. Run the full starter build before adopting 7 for the app; if an integration still requires an older compiler API, choose a supported compatible stable compiler for that app and rerun its checks. The historical schema bundle keeps its recorded checking versions.

**Node:** Use Node 24 for local/build tooling and explicitly configure the supported function runtime where required. Netlify distinguishes its build version from deployed function runtime. Pin an approved patch and test actual adapters. [Netlify build versions](https://docs.netlify.com/build/configure-builds/available-software-at-build-time/), [function runtime](https://docs.netlify.com/build/functions/configuration/).

## 3. RAG and document processing

| Operation | Choice | Evidence still required |
|---|---|---|
| Generation | Workers AI `@cf/qwen/qwen3-30b-a3b-fp8`, direct REST | English/Swahili factual quality, supported model/data terms, actual latency and quota consumption |
| Embeddings | Workers AI `@cf/baai/bge-m3`, expected 1,024 dense dimensions | Actual API shape/dimension, cross-language retrieval and schema-version checks |
| Retrieval | Convex vector/full-text plus exact factual matching | Tenant/corpus prefilter and rechecks, recall, footprint of active/candidate indexes |
| Text PDF | PDF.js through `pdfjs-dist`, Node action | Text-only extraction, library/bundle/runtime fit and bounded CPU/memory; reject scanned/encrypted/unsafe inputs |
| DOCX | Mammoth raw-text extraction | ZIP expansion limits, external-file/link behavior, no macro/embedded execution or unsafe generated HTML |
| Webpage | Controlled Node HTTPS fetch, then Cheerio | Public-IP pinning, redirect/DNS checks, byte/time caps; one page only |
| TXT / manual FAQ | Bounded UTF-8/text parsing into versioned drafts | Encoding/size limits, public-safe review, preview and explicit owner publication |
| Malware scan / hard parser isolation | Mandatory feasibility gate within the selected hosting constraints | A supported, demonstrably isolated scanner/processing path; a MIME check is insufficient |

The parser candidates do not complete the malware-scanning/isolation requirement. Convex Node actions do not imply an available ClamAV daemon or arbitrary subprocess worker. Prove the required controls early; if the free deployment cannot support them, return the concrete infrastructure/cost/scope tradeoff before launch. Do not silently add a paid document service, send uploads to a public malware-analysis service, or drop confirmed launch formats.

Model selection remains conditional on the PRD's held-out bilingual evaluation. No general-purpose agent framework, external vector database, paid model fallback or fine-tuning service is needed for approved FAQ answers and handoff. The existing schema's 1,024-dimension contract must match the actual embedding response; a model change requires migration and re-evaluation.

## 4. Free-plan operating boundary

| Service | Verified published allowance / constraint | Sema response |
|---|---|---|
| Netlify Free | 300 credits/month with hard limit and no recharge option; commercial use documented | Budget runtime, requests, delivery and production deploys; keep an independent business contact route |
| Convex Free | 1M function calls/month, 20 GB-hours actions, 0.5 GB DB and 1 GB DB I/O; Free hard caps differ from usage-billed Starter | Meter indexes/subscriptions/files/jobs and reserve safety/recovery headroom; exact account/terms suitability still required |
| Workers AI Free | 10,000 neurons/day, reset at 00:00 UTC; limit errors stop further work | Cap preview/evaluation/live usage separately; measured reply capacity, no automatic paid fallback |
| Resend Free | 3,000 transactional emails/month, 100/day | Prioritize verification/reset/billing/handoff mail; deduplicate and retain durable requests when mail fails |
| IntaSend | Transaction account and method-specific fees/conditions | Verify the actual account contract, itemized tax/fee quoting, status lookup and refund handling |

Sources: [Netlify plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [commercial use](https://www.netlify.com/guides/netlify-vs-vercel/), [Convex limits](https://docs.convex.dev/production/state/limits), [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Resend pricing](https://resend.com/pricing).

Sema Starter is the customer offer; **Convex Starter is a different, usage-billed vendor plan**. The selected backend plan is Convex Free. No plan upgrade, credit purchase, account billing change or positive recurring vendor spend is authorized by this document. Domain ownership, transaction fees, legal review and founder labor are separate from free hosting allowances.

Public signup remains immediate self-service within transparent resource checks. Free quotas are shared capacity, not a guarantee that every new registration can consume its maximum simultaneously. Measure the existing schema's actual document/index footprint and reactive-call fanout before claiming pilot capacity.

Vendor retention still needs flow-specific review. For example, Resend's pricing currently advertises 30-day data retention; establish what data that covers and the available erasure controls before claiming the PRD's processor-propagation targets are met. A free plan or compatible dependency does not establish privacy, transfer or recovery compliance.

## 5. Foundation acceptance before app development expands

1. Resolve the complete candidate dependency tree without forced peer overrides; review applicable security advisories and commit exact package/runtime versions plus the lockfile.
2. Build a minimal Next.js dashboard with Tailwind/shadcn, both locale catalogs and the assessed Convex/Better Auth provider. Check the actual Netlify adapter path in an authorized test environment.
3. Prove verified email, password reset, session revocation, owner/agent authorization, current memberships and private file/subscription boundaries. Two separate businesses must remain isolated.
4. Check a small text PDF, DOCX, TXT and one webpage against extraction/SSRF/scanner/runtime limits. Measure actual dependency bundle and parser memory/time; preserve the explicit publication boundary.
5. Run the bilingual retrieval/answer evaluation on synthetic or approved de-identified data; verify model response shape, latency and measured free-quota use.
6. Exercise IntaSend sandbox/fake-provider verification, amount/calendar/idempotency cases; do not infer real collections/refunds or tax compliance from successful dependency installation.
7. Prove content deletion, auth/files/ledger recovery, a protected recovery journal, quotas, redacted alerts and the independent contact route. Apply the PRD's G1–G5 gates before live/paying rollout.

The next implementation slice is the **foundation/auth compatibility spike** against this snapshot. Service architecture is selected; the remaining items are engineering/vendor evidence, not another broad product-requirements interview.

## 6. Evidence and change policy

The companion JSON records the package snapshot and its limitations. Twenty comparisons between selected package versions and their declared peer ranges passed a local semver check; retrieved Node engine ranges also accept the existing 24.19.0 toolchain. Required workflow companions still need exact lock resolution. This is metadata analysis, not installed runtime behavior. Search excerpts were used for source discovery; package conclusions use direct live registry retrieval, and plan facts use official provider pages. The review did not exhaustively audit advisories, resolve every transitive dependency, create an app lockfile or run the full application.

Exact patch updates within supported ranges require the relevant checks; an auth major, model/provider switch, new external data processor or paid-plan change requires explicit review of the affected cost/privacy/scope. Keep the PRD's confirmed commercial terms unchanged. Use Firecrawl for subsequent web research and record source URLs/dates with material dependency decisions.
