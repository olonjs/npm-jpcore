# CLI

This document defines the current `@jsonpages/cli` behavior and contract.

## Package location

- `packages/cli/src/index.js`

## Binary

- command name: `jsonpages`
- entrypoint: `./src/index.js`

## Primary command

```bash
jsonpages new tenant <name>
```

Supported options:

- `--template <name>`: choose template profile (default `alpha`)
- `--agritourism`: alias for `--template agritourism`
- `--script <path>`: override template DNA path directly

Examples:

```bash
jsonpages new tenant my-site
jsonpages new tenant my-site --template agritourism
jsonpages new tenant my-site --agritourism
```

## Template resolution

Default resolution path:

- `packages/cli/assets/templates/<template>/src_tenant.sh`

Fallback compatibility for `alpha`:

- `packages/cli/assets/src_tenant_alpha.sh`

If template is unknown and `--script` is not provided, CLI exits with a template list.

## Generation pipeline

When running `jsonpages new tenant <name>`:

1. scaffold Vite React TS app
2. remove boilerplate files
3. inject minimal infra files (`package.json`, `tsconfig.json`, `components.json`)
4. project DNA by interpreting shell script (`mkdir -p` and heredoc file blocks)
5. install dependencies

## Notes

- Template assets are packaged through `packages/cli/package.json` (`files` includes `assets/templates`).
- Template conformance check exists at `npm run check:templates`.

## CLI maintenance checklist

Before publishing CLI:

1. `npm run check:templates`
2. `npm run dist:dna:all`
3. `node --check packages/cli/src/index.js`
4. run release flow (`release` or `release:enterprise`)
