# WebMCP Studio Bridge Core Diff

## Functional Changes

- Added Studio-side WebMCP bridge hooks in `packages/core/src/lib/JsonPagesEngine.tsx`.
- Added deterministic tool registration helpers in `packages/core/src/lib/webmcp-bridge.ts`.
- Extended `JsonPagesConfig` with optional `webmcp` enablement in `packages/core/src/lib/types-engine.ts`.
- Added explicit WebMCP message event names in `packages/core/src/lib/events.ts`.
- Exported the bridge helpers from `packages/core/src/index.ts`.

## Behavior

- When `config.webmcp.enabled` is true and the user is inside `/admin`, the engine now registers one update tool per section type currently available in Studio.
- Each tool targets a concrete section instance through `sectionId` and can mutate either:
  - the full `data` payload, or
  - a specific field through `fieldKey` / `itemPath`.
- Every mutation is validated against the existing tenant Zod schema before being applied.
- On successful mutation, the bridge persists immediately through `saveToFile`.

## Build-Time Contract Support

- Added `packages/core/src/lib/webmcp-contracts.mjs` for page contract, page manifest, and site manifest-index generation.
- `apps/tenant-alpha/scripts/bake.mjs` now writes:
  - `public/schemas/<slug>.schema.json`
  - `dist/schemas/<slug>.schema.json`
  - `public/mcp-manifests/<slug>.json`
  - `dist/mcp-manifests/<slug>.json`
  - `public/mcp-manifest.json`
  - `dist/mcp-manifest.json`
- Baked HTML now injects:
  - page-scoped `rel=\"mcp-manifest\"`
  - `rel=\"olon-contract\"`
  - base `WebPage` JSON-LD
- Page contracts/manifests now include both local page sections and applicable global `header` / `footer` sections so discovery matches runtime tool registration.

## Validation Notes

- TypeScript checks passed for `packages/core` and `apps/tenant-alpha`.
- Focused Vitest checks passed for `webmcp-contracts` and `webmcp-bridge`.
- Playwright tenant-wide verification passed against the live Studio runtime using auto-selected page/section targets derived from the manifest/contract surface.
