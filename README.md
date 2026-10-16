# Sema SaaS

Sema is a planned website-support platform for Kenyan service businesses. It
will answer routine questions in **English and Swahili** using a business's
approved knowledge, make uncertainty visible, and hand conversations to the
business's own staff. Subscription payments will use **KES and M-Pesa**.

This repository contains the Next.js/pnpm workspace foundation and the product
and engineering documentation. **It is not yet a working support platform or
a production deployment.**

## Product scope

The [production PRD](docs/sema-production-prd.md) governs product behavior and
commercial terms. The planned MVP includes:

- Public self-service setup and activation after automated readiness checks;
  optional assistance afterward, not a mandatory founder approval queue.
- Manual FAQs, TXT, text-based PDF, DOCX, and single-public-page imports.
  Owners must preview and explicitly publish knowledge before it can support
  live answers.
- A website chat widget with grounded answers, citations, human handoff, and
  optional contact capture when staff are unavailable.
- An owner/agent inbox, usage reporting, and one business/production website
  with two named staff accounts: the owner and one agent.
- Explicit owner-authorized M-Pesa renewals and top-ups, with no automatic
  debit or overage charges.

The initial pilot excludes sensitive/regulated sectors. WhatsApp, OCR,
whole-site crawling, live private-data lookup, booking execution, and AI-driven
transactions are outside the MVP.

### Confirmed offers — not yet available

| Offer | Terms |
| --- | --- |
| Initial free pilot | 30 days from verified widget go-live, with 100 substantive AI answers total per business; available only while initial pilot enrollment is open |
| Starter | KES 2,500 base per service month for 1,000 substantive AI answers, with standard assisted setup included |
| Optional top-up | KES 500 base for 100 answers, valid for 90 days and usable only during an active paid subscription |

Applicable tax and disclosed processing fees must be itemized before payment.
Previews, greetings, clarifications, fallbacks, failed attempts, retries, and
human replies are not billable answers. Monthly included answers do not roll
over; unexpired top-ups retain their original expiry. Later customers must pay
before go-live once initial free-pilot enrollment closes.

## Current implementation

- **Implemented:** Next.js App Router scaffold, TypeScript, Tailwind CSS,
  ESLint, root workspace commands, and the shared `@sema/ui` package with a
  shadcn/ui Button, utility, and theme.
- **Documented, not integrated:** Convex, authentication, knowledge ingestion,
  bilingual retrieval/AI, widget, inbox, payments, email, privacy workflows,
  hosting, and release automation.
- **Reference artifacts only:** The schema/contracts and delivery templates
  under `docs/` are not deployed backend code or an enabled CI/CD pipeline.
  Their recorded checks do not establish runtime security or launch readiness.

## Documentation

Start with the [documentation index](docs/README.md), then read the PRD,
system design, and implementation plan.

| Document | Purpose |
| --- | --- |
| [Production PRD](docs/sema-production-prd.md) | Requirements, scope, commercial policies, and release gates |
| [Engineering blueprint](docs/sema-engineering-blueprint.md) | Planning-packet overview and evidence status |
| [System design](docs/sema-system-design.md) | Runtime architecture, trust boundaries, consistency, and failure handling |
| [Data model and flows](docs/sema-data-model-and-flows.md) | Logical records, state transitions, and user journeys |
| [Technical design](docs/sema-technical-design.md) | Physical schema, contracts, authorization, and transaction boundaries |
| [Tech stack](docs/sema-tech-stack.md) | Selected services, candidate dependencies, and feasibility checks |
| [Implementation plan](docs/sema-implementation-plan.md) | Nine milestones (M0–M8), 44 tasks, and acceptance evidence |
| [CI/CD and release operations](docs/sema-ci-cd.md) | Proposed checks, controlled releases, migrations, and rollback |
| [Technical design bundle](docs/sema-technical-design/README.md) | Reference schema with 40 tables, 22 core contracts, and local verification instructions |
| [Delivery templates](docs/sema-delivery/README.md) | Future workflow, preflight, Netlify configuration, and release-record templates |
| [Candidate package snapshot](docs/sema-stack-candidate.json) | Dated dependency candidates and compatibility limitations |

### Planned service architecture

| Layer | Selection |
| --- | --- |
| Web and hosting | Next.js/React on Netlify |
| Backend | Convex for canonical data, realtime, search, private files, and jobs |
| Staff authentication | Better Auth through the Convex integration |
| AI | Cloudflare Workers AI for generation and embeddings |
| Payments | IntaSend M-Pesa STK collection and verified settlement |
| Email | Resend for account and service notifications |
| Localization | next-intl with reviewed English/Swahili catalogs |

Only the frontend foundation is installed today. The selected services still
require integration, security/privacy review, and measured free-tier capacity
and recovery evidence. No automatic paid infrastructure fallback is authorized.

**Toolchain:** This repository and its delivery documentation use **pnpm
workspaces and `pnpm-lock.yaml`**, with pnpm pinned through `packageManager`.
The app currently declares Next.js **16.4.1**, React **19.3.0**, and TypeScript
**5.x**. The dated candidate snapshot and standalone schema bundle use other
versions; they are not the application's installed dependency manifest.
Use the workspace manifests and lockfile for the current toolchain. Delivery
templates already target pnpm and workspace paths, but their required test and
release scripts still need implementation before adoption.

## Local development

### Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm 12.10.1 (`corepack enable` activates the pinned version)

### Getting started

```sh
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:3000. The current scaffold does not require provider
accounts or environment variables. This does not start a Convex backend or any
of the planned integrations.

## Structure

```text
apps/
  web/           Next.js App Router, TypeScript, Tailwind CSS, ESLint
packages/
  ui/            Shared shadcn/ui components, utilities, and Tailwind theme
docs/
  README.md      Product and engineering documentation index
  sema-technical-design/  Standalone reference schema, contracts, and checks
  sema-delivery/          Inactive CI/CD and release templates
```

The app uses the `@/*` import alias for `apps/web/src/*`.
Only `apps/*` and `packages/*` are pnpm workspaces; the reference package under
`docs/` is not included in root workspace commands.

## Commands

Run these from the repository root:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the web development server |
| `pnpm build` | Run workspace build scripts; currently builds the web app |
| `pnpm start` | Serve the production web build after `pnpm build` |
| `pnpm lint` | Lint all workspace packages |
| `pnpm typecheck` | Generate route types and check TypeScript |

The planned test suites, security checks, and release scripts in the delivery
documentation are not implemented yet. The commands above are scaffold checks,
not the full release-evidence suite.

## Shared UI

`@sema/ui` ships TypeScript source directly to the Next.js app, with no separate
build step. It uses shadcn/ui's default Base UI/Nova style and neutral theme.
The app imports the shared theme through `apps/web/src/app/globals.css`.
System fonts keep builds independent of external font services.

```tsx
import { Button } from "@sema/ui/components/button";
import { cn } from "@sema/ui/lib/utils";
```

Add components from the repository root:

```sh
pnpm dlx shadcn@latest add @shadcn/input -c packages/ui
```

Both workspaces have `components.json` configured so shared components and
their dependencies are installed into `packages/ui`, while app-specific blocks
stay in `apps/web`. Shared colors and tokens live in
`packages/ui/src/styles/globals.css`.
For app-specific blocks, run the CLI with `-c apps/web`; its aliases still
route shared UI components into `packages/ui`.

The official shadcn agent skill is installed locally in `.agents/skills/shadcn`.

Add shared packages under `packages/` with their own `package.json`, then
reference them using `workspace:*` dependencies. No task runner or shared
configuration package is required until the workspace needs one.

## Delivery priorities and launch gates

Follow the [implementation plan](docs/sema-implementation-plan.md), beginning
with M0 feasibility: prove Next.js/Convex/Better Auth/Netlify compatibility,
safe document processing, bilingual model quality, vendor/privacy terms, and
complete private recovery within the chosen resource constraints. The current
scaffold does not close those gates.

Then establish identity and tenant isolation (M1) and build a synthetic vertical
slice (M2): register → draft/preview/publish FAQ → activate a test site → answer
→ human handoff → canonical usage accounting. Knowledge, widget/inbox, billing,
and operational hardening follow in M3–M6.

Internal alpha, free pilot, controlled paid conversions, and broad paid launch
are separate evidence gates. Broad paid launch requires, among other checks,
two distinct eligible pilot businesses with verified, settled, non-refunded
Starter purchases. A passing local build, reference-schema check, or completed
backlog is not launch approval.
