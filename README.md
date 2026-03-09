# JSONPages Monorepo

This repository contains the JsonPages stack:

- `packages/core`: runtime engine (`@jsonpages/core`)
- `packages/cli`: tenant generator (`@jsonpages/cli`)
- `packages/stack`: dependency manifest (`@jsonpages/stack`)
- `apps/tenant-alpha`: reference DNA template source
- `apps/tenant-agritourism`: second DNA template source

Use this file as entrypoint. Canonical docs are under `docs/`.

## Requirements

- Node.js 20+
- npm 10+
- On Windows: prefer WSL shell for workspace commands (UNC path + npm/cmd can fail)

## Install

```bash
npm install
```

## Root scripts

- `npm run dev`: run `tenant-alpha` in dev mode
- `npm run dev2`: run `tenant-agritourism` in dev mode
- `npm run build`: build `tenant-alpha`
- `npm run build:all`: run `build` for all workspaces (if script exists)
- `npm run check:templates`: validate CLI template assets (`alpha`, `agritourism`)
- `npm run dist:dna:all`: regenerate DNA via tenants SOT (`tenant-alpha` + `tenant-agritourism`)
- `npm run release`: legacy release flow (`scripts/release.js`)
- `npm run release:enterprise`: gated release flow (`check:templates` + `dist:dna:all` + `release`)

## Quick start (maintainer)

```bash
npm install
npm run build:all
npm run check:templates
npm run dev
```

## CLI usage

Generate a tenant from default template (`alpha`):

```bash
npx @jsonpages/cli new tenant my-tenant
```

Generate from explicit template:

```bash
npx @jsonpages/cli new tenant my-tenant --template agritourism
```

Template alias:

```bash
npx @jsonpages/cli new tenant my-tenant --agritourism
```

## DNA source of truth

DNA is generated from tenant apps, not edited manually:

- `apps/tenant-alpha` -> template `alpha`
- `apps/tenant-agritourism` -> template `agritourism`

Each source app owns its own `dist` script.
Root `dist:dna:all` delegates to those `dist` scripts.

## Documentation map

- `docs/README.md`: documentation index
- `docs/ARCHITECTURE.md`: monorepo architecture and flows
- `docs/CLI.md`: CLI behavior and template resolution
- `docs/TEMPLATES.md`: template governance and DNA generation
- `docs/PUBLISHING.md`: publish/release operations
