# Sema delivery templates

Prepared 16 October 2026. These files are for the future Sema application repository; they are not an installed pipeline. Read the [CI/CD policy](../sema-ci-cd.md) before adoption.

The templates now target this repository's pnpm workspace layout: `apps/web` (`@sema/web`), `packages/ui` (`@sema/ui`), a root `pnpm-workspace.yaml` and a single application `pnpm-lock.yaml`. Pin pnpm in the root `package.json#packageManager` (`pnpm@12.10.1`). All CI/release commands run from the repository root; the standalone schema bundle under `docs/` is excluded.

## Contents and adoption

| File | Adoption |
|---|---|
| `.github/workflows/ci.yml` | Copy to the repository root's `.github/workflows/ci.yml` only after implementing the required root scripts and synthetic test configuration. Enables pinned pnpm through Corepack and runs a frozen workspace install. Contains no deployment job. |
| `scripts/ci/verify-project.mjs` | Copy to the same path at the repository root. Checks pnpm/workspace pins, lockfile headers/importers, root scripts, workspace manifests and runtime. It checks structure, not full YAML validity, dependency resolution or semantic test coverage; the frozen install remains required. |
| `.node-version` | Candidate Node runtime observed in this session; verify supported runtime and security updates in M0 before adoption. |
| `netlify.toml.example` | Adopt as root `netlify.toml` after the Next.js/adapter spike. Builds `@sema/web` from the repository root and publishes `apps/web/.next`. Set `apps/web` as the site's package directory, verify adapter detection, and configure actual site/auth/backend origins outside source. It does not disable provider dashboard auto-deploy settings for you. |
| `release-manifest.template.json` | Copy to a private candidate evidence folder after the candidate SHA exists; replace null/UNSET values with reviewed evidence. It is not an executable approval gate. |

Do not copy the schema-only package's `package.json` as the full application manifest. The application needs its own reviewed workspace lock including all framework, auth, component, test and deployment tools. Install a verified exact Netlify CLI version and Playwright tooling in the root development dependencies during adoption; the stack snapshot did not select a Netlify CLI version. Keep Convex and its assessed auth/workflow dependencies in `apps/web`. All executable deployment commands use installed, lockfile-resolved CLIs through `pnpm exec` or `pnpm --filter @sema/web exec`, never floating `pnpm dlx` downloads.

Review `pnpm-workspace.yaml#allowBuilds` and project lifecycle scripts before running `pnpm install --frozen-lockfile`. Approve only required dependency scripts after review; do not blanket-enable builds or suppress lockfile/peer failures. The existing scaffold has not implemented all scripts below, and adopting the preflight is expected to reject it until that work is complete.

## Required application scripts

| Script | Implementation contract |
|---|---|
| `format:check` | Nonmutating formatter verification. |
| `lint` | Direct supported linter configuration; checks application and backend code. |
| `typecheck` | Framework/backend/generated-contract types; no production access. |
| `ci:security` | Reviewed pinned secret/dependency/static security tooling; explicit review and blocking behavior for findings or scanner failure. |
| `test:unit` | Meaningful pure domain/calendar/state/failure tests, fixed clocks and synthetic data. |
| `test:convex` | Implemented handlers tested for tenant/role/DTO/ledger/publication/lifecycle invariants with `convex-test`. |
| `test:rag:fixtures` | Deterministic retrieval/validation and abstention fixtures. No real model credentials or network calls. |
| `build` | Production Next.js build with safe CI configuration and validated environment handling. |
| `test:e2e` | Local synthetic test-server journey against the built application, including safe fakes and cleanup. Chromium for PR CI. Must fail for an empty or unavailable test suite. |
| `release:preflight`, `release:migrate`, `release:verify`, `release:smoke` | Implement the contracts in the CI/CD policy before any production release. Not called by ordinary PR CI. |

`SEMA_TEST_MODE=synthetic` in the template is a proposed test-server contract, not a feature the application currently implements. The production deployment must reject test-provider mode or omit its implementation entirely. Do not create production bypass routes to make tests easier. If a browser journey needs a real backend/auth integration, execute it in isolated staging with controlled credentials and record it separately; a fake local journey is not equivalent proof.

The adopted preflight can be invoked with `node scripts/ci/verify-project.mjs` from the repository root, not from `apps/web`. To inspect the unadopted template against the current repository, use `node docs/sema-delivery/scripts/ci/verify-project.mjs`; it must still fail for missing release prerequisites. Running it in this template directory or the schema-only package is also expected to fail. Do not weaken the guard simply to make the design packet green.

## Action pin provenance

Official tag references retrieved with Firecrawl on 16 October 2026:

- [`actions/checkout` v6 tag](https://api.github.com/repos/actions/checkout/git/ref/tags/v6): `d23441a48e516b6c34aea4fa41551a30e30af803`.
- [`actions/setup-node` v6 tag](https://api.github.com/repos/actions/setup-node/git/ref/tags/v6): `249970729cb0ef3589644e2896645e5dc5ba9c38`.

These are dated direct-action pins, not proof of no vulnerabilities or locked transitive action dependencies. Use GitHub-hosted compatible runners; review updates and runtime support before adoption. Do not replace hashes with floating tags for convenience.
