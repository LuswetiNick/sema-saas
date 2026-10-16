# Sema — Engineering Blueprint

Prepared 16 October 2026. This index brings together the current product and engineering baseline. Start with the system design, then use the implementation plan to sequence the build and the CI/CD specification to deliver it safely.

| Document | Purpose |
|---|---|
| [Production PRD](sema-production-prd.md) | Confirmed product decisions, assumptions, commercial policies, requirements and launch evidence gates. |
| [Data model and flows](sema-data-model-and-flows.md) | Logical records, state machines, ownership, core journeys and DM validation scenarios. |
| [Technical design](sema-technical-design.md) | Physical Convex schema, contracts, algorithms, transaction boundaries and implementation constraints. |
| [Tech stack](sema-tech-stack.md) | Selected services, candidate dependencies, compatibility evidence and unresolved provider proofs. |
| [System design](sema-system-design.md) | Runtime topology, trust boundaries, consistency, critical flows, failure behavior and deployment/recovery architecture. |
| [Implementation plan](sema-implementation-plan.md) | Nine milestones, 44 tasks, dependencies, acceptance evidence and pilot/paid-launch sequence. |
| [CI/CD specification](sema-ci-cd.md) | Automatic PR checks, controlled production release, migrations, rollback, secrets and free-tier controls. |
| [Delivery templates](sema-delivery/README.md) | Pinned GitHub Actions workflow, application preflight, Netlify configuration and release-record template. |
| [Checked schema package](sema-technical-design/README.md) | Existing physical validators/contracts and reproducible local structural checks. |
| [Candidate package snapshot](sema-stack-candidate.json) | Dated package choices; requires a real application lockfile and full-stack proof. |
| [Delivery verification](sema-delivery/verification.json) | Exact scope and limits of local document/template checks. |

The [downloadable archive](sema-engineering-blueprint-v1.zip) includes these documents and source templates. It supersedes the older technical-design archive as the combined planning packet; the older archive remains historical. The new archive excludes itself and historical Jenga drafts.

Product policies remain those confirmed for Sema: immediate public self-service with optional assistance, approved English/Swahili FAQ answers and human handoff, the initial 30-day/100-answer pilot, Starter and optional top-ups. Technical implementation does not introduce a mandatory founder activation queue or automatic infrastructure spend.

Current evidence is limited to design review, the previously checked schema/contracts and local template validation. Application handlers, actual bilingual/provider quality, hosted capacity, account controls, deployments, settlement and complete recovery remain implementation/evidence work. Preparing these files has not created an application repository or activated a pipeline.

The next implementation task is M0: prove the exact Next.js/Convex/auth/Netlify integration, safe document processing, bilingual model behavior and complete private recovery within the chosen free-tier constraints.
