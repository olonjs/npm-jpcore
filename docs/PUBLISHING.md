# Publishing and Release

This document is the operational source of truth for publishing `@olonjs/stack`, `@olonjs/core`, and `@olonjs/cli` from this monorepo, plus compatibility bridge packages under `@jsonpages/*`.

## Scope

- Standard flow: `npm run release`
- Enterprise-gated flow: `npm run release:enterprise`
- DNA governance (`alpha`)

## Prerequisites

- npm account with publish rights on `@olonjs`
- `NPM_TOKEN` available in environment or root `.env`
- root `.npmrc` configured for npm registry auth
- dependencies installed from monorepo root

Example `.env`:

```bash
NPM_TOKEN=npm_xxx
```

## Package publish order

Always publish in this order:

1. `@olonjs/stack`
2. `@olonjs/core`
3. `@olonjs/cli`
4. compatibility bridges (`@jsonpages/stack`, `@jsonpages/core`, `@jsonpages/cli`)

Reason:

- `core` aligns dependency contracts using stack manifest
- `cli` must package DNA generated from tenant source apps using the new `core` version
- compatibility bridges must point to freshly published `@olonjs/*` versions

## Release scripts

### `npm run release`

Executes legacy release pipeline in `scripts/release.js`.

Current behavior includes:

- build all workspaces
- patch version + publish `stack`
- build, patch version + publish `core`
- update tenant app to new `@olonjs/core`
- build and `dist` `tenant-alpha`
- build, patch version + publish `cli`
- sync bridge dependencies and publish `@jsonpages/*` compatibility packages

### `npm run release:enterprise`

Executes `scripts/release-enterprise.js`:

1. `npm run check:templates`
2. `npm run dist:dna:all`
3. delegates to `node scripts/release.js`

Use this for gated releases when template governance must be enforced before publish.

## DNA governance

### Source of truth

- `apps/tenant-alpha` is SoT for template `alpha`

### Dist command

Root DNA generation:

```bash
npm run dist:dna:all
```

This runs:

- `npm run dist -w tenant-alpha`

### Template conformance

Validate required template assets:

```bash
npm run check:templates
```

Validation checks:

- required template directories exist
- `src_tenant.sh` exists per required template
- `manifest.json` exists and is consistent
- DNA script contains baseline safety/content markers

## Recommended release procedure

Run from repository root.

1. Validate workspace state

```bash
npm install
npm run build:all
```

2. Validate templates and regenerate DNA

```bash
npm run check:templates
npm run dist:dna:all
```

3. Dry-run release

```bash
npm run release -- --dry-run
```

4. Execute enterprise release

```bash
npm run release:enterprise
```

## Windows note

If npm commands fail under UNC paths (`\\wsl.localhost\...`), use WSL shell to run release commands.

## Troubleshooting

- `Error: Unknown template ...` in CLI
  - Check `packages/cli/assets/templates/<template>/src_tenant.sh`
  - Run `npm run dist:dna:all`
- Template conformance failure
  - Run `npm run check:templates` and fix missing assets/manifests
- npm auth errors during publish
  - Verify `NPM_TOKEN`, `.npmrc`, and npm org permissions
- Release succeeds but new tenants are stale
- Ensure `dist:dna:all` ran before publishing `@olonjs/cli`

## Related docs

- `docs/ARCHITECTURE.md`
- `docs/CLI.md`
- `docs/TEMPLATES.md`
- `docs/README.md`
