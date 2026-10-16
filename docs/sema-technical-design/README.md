# Sema technical design bundle

Read the parent [technical design](../sema-technical-design.md), [PRD](../sema-production-prd.md) and [logical model](../sema-data-model-and-flows.md) first. The ZIP download includes those documents with their relative links intact.

This folder provides a concrete schema with 40 application tables, constants, 22 core argument/result contract descriptors, the 54-to-physical-record mapping and local verification evidence. Auth/workflow component tables are intentionally excluded. There are no endpoint handlers, migrations, production credentials or deploy scripts.

## Review order

1. `physical-model.json`: mapping and intended access paths.
2. `convex/schema.ts`: actual field validators, references and indexes.
3. `convex/constants.ts`: confirmed commercial terms versus engineering limits.
4. `contracts/public.ts`: core operation shapes and required actor classifications.
5. `verification.json`: precise checks performed and checks still outstanding.

The contract descriptors do not enforce authentication or register endpoints. `v.number()` does not enforce an integer/range, arrays are not length-bounded by these validators, indexes are not unique constraints, and schema references do not authorize joins. Implement the technical design's domain checks and authorization helpers before exposing any function.

## Reproduce local checks

In this folder, with Node.js 24 and the pinned pnpm 12.10.1 toolchain:

```sh
corepack enable
pnpm install --ignore-workspace --ignore-scripts
pnpm --ignore-workspace run check
```

This is a standalone reference package, not a member of the application workspace. `--ignore-workspace` prevents the parent workspace from receiving its dependencies or lockfile changes. The first install creates a local `pnpm-lock.yaml`; retain and review it, then use `pnpm install --ignore-workspace --ignore-scripts --frozen-lockfile` for repeatable subsequent installs. Root application commands do not run these checks.

The package pins Convex 1.47.0 and TypeScript 7.0.2, the versions checked for this artifact. Installation needs package-registry access. `pnpm --ignore-workspace run check` type-checks the files, transpiles inspection copies into `.verification/`, instantiates the real SDK schema and checks references, indexes, search configuration, mapping and DTO boundaries. It updates `verification.json`. It never connects to a Convex deployment or calls a payment/model/email provider. The recorded SDK/compiler evidence predates this package-manager update; switching commands is not a new schema or full-stack verification result.

Local checks cannot prove tenant isolation, concurrent mutation behavior, provider correctness, upload/parser safety, bilingual quality, deletion or complete recovery. Implement and execute the PRD/logical-model acceptance scenarios in the staged backlog.

## Adoption

Copy the schema/constants into `apps/web/convex/` only after the foundation integration review. Install assessed backend dependencies in `@sema/web` and update the root application lockfile; do not add this reference package to the workspace. Add supported auth/workflow component configuration, generated Convex types, explicit handlers, pure domain guards, adapters and synthetic tests. Revalidate exact patched dependency versions and actual runtime/region/account terms. Public signup and assistance policies are unchanged; enrollment/checkout flags stay closed until their documented release gates pass.

The optional `.env.example` is an empty inventory of scopes and configuration names, not a working deployment configuration. Set real secrets in the correct backend/CI stores and real public URLs only after approved accounts exist. This bundle contains no credentials and authorizes no spend.
