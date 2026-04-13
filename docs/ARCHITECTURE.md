# Architecture

This document defines the current architecture of `npm-jpcore`.

## Monorepo layout

- `packages/core` -> `@olonjs/core`
- `packages/cli` -> `@olonjs/cli`
- `packages/stack` -> `@olonjs/stack`
- `apps/tenant-alpha` -> template source app (`alpha`)

Root workspace config is in `package.json` (`workspaces: ["packages/*", "apps/*"]`).

## Package responsibilities

## `@olonjs/stack`

- version manifest package
- consumed by other packages to keep dependency policy aligned

## `@olonjs/core`

- runtime engine used by tenant apps
- published package consumed by generated tenants

## `@olonjs/cli`

- scaffolds new tenants
- resolves DNA from template assets
- command surface: `olonjs new tenant <name> [--template <name>] [--script <path>]` (`jsonpages` alias supported)

## Template architecture

DNA templates are packaged under:

- `packages/cli/assets/templates/alpha/`

Each template contains:

- `src_tenant.sh`
- `manifest.json`

Backward compatibility path still exists for `alpha`:

- `packages/cli/assets/src_tenant_alpha.sh`

## Source of truth model

Template DNA must originate from source apps:

- `apps/tenant-alpha` => `alpha`

Manual edits directly in template DNA files are not the preferred workflow.

## Operational flows

## Local development

- `npm run dev` -> `tenant-alpha`

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
