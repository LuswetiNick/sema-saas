# Sema documentation

The current product and engineering documents are collected here. Start with the production PRD, then follow the system design and implementation plan.

The application uses pnpm 12.10.1 with `apps/web` and `packages/ui` workspaces and a root `pnpm-lock.yaml`. Delivery templates use root pnpm commands but remain inactive until their required checks and integrations are implemented. The reference schema bundle is excluded from the application workspace; follow its standalone pnpm instructions rather than adding it to the root install.

| Document | Contents |
|---|---|
| [Engineering blueprint](sema-engineering-blueprint.md) | Overview of the complete planning packet and evidence status. |
| [Production PRD](sema-production-prd.md) | Confirmed requirements, commercial policies, assumptions and release gates. |
| [Data model and flows](sema-data-model-and-flows.md) | Logical records, state transitions and user journeys. |
| [Technical design](sema-technical-design.md) | Physical schema, contracts, algorithms and implementation boundaries. |
| [Tech stack](sema-tech-stack.md) | Selected services, candidate versions and feasibility checks. |
| [System design](sema-system-design.md) | Runtime architecture, trust boundaries, consistency and failure handling. |
| [Implementation plan](sema-implementation-plan.md) | Nine milestones and 44 tasks with acceptance evidence. |
| [CI/CD and release operations](sema-ci-cd.md) | Automated checks, controlled releases, migrations and rollback. |
| [Technical design package](sema-technical-design/README.md) | Checked Convex schema, public contracts, mappings and verification tools. |
| [Delivery templates](sema-delivery/README.md) | GitHub Actions workflow, preflight script, Netlify configuration and release record. |
| [Candidate package snapshot](sema-stack-candidate.json) | Dated dependency choices and compatibility evidence. |
| [Downloadable blueprint](sema-engineering-blueprint-v1.zip) | Snapshot of the combined documents and source templates. |
| [Historical material](archive/README.md) | Superseded documents and earlier bundles retained for reference. |

Sema is the current product name. Historical material does not override the current PRD. This folder collects the documents previously delivered in `outputs/`; those original artifacts remain available. Templates are documentation assets and are not an enabled application pipeline.

Security/privacy records, customer terms and notices, actual validation reports and rehearsed operational runbooks remain implementation and launch deliverables. They are described in the plans; this collection does not claim those reviews or proofs are complete.
