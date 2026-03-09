# Architecture

This document defines the current architecture of `npm-jpcore`.

## Monorepo layout

- `packages/core` -> `@jsonpages/core`
- `packages/cli` -> `@jsonpages/cli`
- `packages/stack` -> `@jsonpages/stack`
- `apps/tenant-alpha` -> template source app (`alpha`)
- `apps/tenant-agritourism` -> template source app (`agritourism`)

Root workspace config is in `package.json` (`workspaces: ["packages/*", "apps/*"]`).

## Package responsibilities

## `@jsonpages/stack`

- version manifest package
- consumed by other packages to keep dependency policy aligned

## `@jsonpages/core`

- runtime engine used by tenant apps
- published package consumed by generated tenants

## `@jsonpages/cli`

- scaffolds new tenants
- resolves DNA from template assets
- command surface: `jsonpages new tenant <name> [--template <name>] [--agritourism] [--script <path>]`

## Template architecture

DNA templates are packaged under:

- `packages/cli/assets/templates/alpha/`
- `packages/cli/assets/templates/agritourism/`

Each template contains:

- `src_tenant.sh`
- `manifest.json`

Backward compatibility path still exists for `alpha`:

- `packages/cli/assets/src_tenant_alpha.sh`

## Source of truth model

Template DNA must originate from source apps:

- `apps/tenant-alpha` => `alpha`
- `apps/tenant-agritourism` => `agritourism`

Manual edits directly in template DNA files are not the preferred workflow.

## Operational flows

## Local development

- `npm run dev` -> `tenant-alpha`
- `npm run dev2` -> `tenant-agritourism`

## DNA regeneration

- `npm run dist:dna:all`
- delegates to each source app `dist` script

## Template conformance

- `npm run check:templates`
- validates template presence and manifest consistency

## Release

- `npm run release` -> legacy release flow
- `npm run release:enterprise` -> gated flow (`check:templates`, `dist:dna:all`, then legacy release)

## Constraints and caveats

- On Windows UNC paths (`\\wsl.localhost\...`), npm/cmd invocation may fail; prefer WSL shell for release operations.
- `scripts/release.js` currently updates only `tenant-alpha` dependency pin during publish flow.
- `scripts/release-enterprise.js` adds pre-flight template governance but delegates to legacy release script.
