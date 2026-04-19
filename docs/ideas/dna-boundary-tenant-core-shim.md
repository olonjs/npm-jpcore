# DNA Boundary: tenant `_core/` shim + `@olonjs/core/dna` sub-export

> Status: **PARTIALLY IMPLEMENTED — Step A in progress (A.1 + A.2 shipped, A.3 pending)**
> Authors: ideated 2026-04-19 between OlonJS Core and olon-agent maintainers
> Resume guide for next session: [dna-boundary-resume-here.md](./dna-boundary-resume-here.md)
> Related: [olon-agent failure-mode analysis — empty `main.tsx` and overwritten `src/lib/`](../../../olon-agent/docs/ideas/dna-boundary-tenant-core-shim.md)

## Implementation status snapshot (2026-04-19)

| Slice | Scope | Commit | LOC delta |
|---|---|---|---|
| **A.1** ✅ | Dedupe `utils.ts` (already exported by `@olonjs/core`); 27 ui/*.tsx redirected | `a67dc83` | +27 / −33 |
| **A.2** ✅ | Promote 4 "clean" DNA libs (`base-schemas`, `cloudSaveStream`, `deploySteps`, `OlonFormsContext`) + `types/deploy.ts` to `packages/core/src/dna/`; 8 tenant files redirected | `c216174` | +33 / −15 (5 renames) |
| **A.3** 🟡 | 5 libs that need API refactor before move: `draftStorage`, `getFilePages`, `IconResolver`, `useFormSubmit`, `useOlonForms` | — | TBD |
| **B–G** ⬜ | `ThemeProvider` + `save-drawer` move; `createTenantApp` factory; `_core/` shims; `dna.manifest.json`; CLI templates; olon-agent guards | — | — |

See [`dna-boundary-spike-report.md`](./dna-boundary-spike-report.md) §"Execution Progress" for the detailed log.

## Problem Statement

How might we make the system-owned DNA boundary structurally enforced in the
filesystem of every OlonJS tenant, so that olon-agent guards collapse from a
fragile path blacklist into a single positional rule, and so that DNA stops
being duplicated by-hand across tenants?

## Recommended Direction

Promote the 9 DNA libs and the boot files (App / main / runtime / entry-ssg) from
`apps/tenant-alpha/src/` into a new `packages/core/src/dna/` subtree, exposed
as a sub-export `@olonjs/core/dna`. In each tenant, replace those files with a
small `src/_core/` folder containing one-line shim re-exports plus a factory
call for App boot. Add a `dna.manifest.json` at the tenant root declaring
`writeAllowed` / `writeForbidden` paths; olon-agent reads it from the sandbox
and derives all guards data-driven, so future DNA changes ship with the
tenant scaffold instead of patching the agent's hardcoded blacklist.

The win compounds: olon-agent gets one clean rule (`src/_core/**` is read-only),
all tenants share one canonical DNA bumped via `npm version`, and the
"FIXED TENANT DNA" section in Agent 1's prompt collapses to a single line.

### Smoking gun discovered during ideation

`packages/core/src/lib/utils.ts` (169 B) is **byte-for-byte identical** to
`apps/tenant-alpha/src/lib/utils.ts` (169 B). And none of the 9 tenant
"system-owned" libs (`cloudSaveStream`, `deploySteps`, `draftStorage`,
`getFilePages`, `IconResolver`, `OlonFormsContext`, `useFormSubmit`,
`useOlonForms`, `base-schemas`) is exported by `@olonjs/core` today —
despite being de-facto contracts every tenant must have identical.

The "_core/ folder" idea is just the surface symptom. The real debt is:
**we ship a runtime tissue (forms context, draft storage, deploy steps…)
by file-copy into every tenant, instead of by package import.** Studio and
Engine already live in `@olonjs/core`. The boot/runtime/forms tissue should
live there too.

## Key Assumptions to Validate

- [ ] `@olonjs/core` bundle size remains acceptable after absorbing ~16 KB of DNA
      → measure with `npm run build` before/after
- [ ] React hooks (`useOlonForms`, `useFormSubmit`, etc.) work correctly when
      consumed from `@olonjs/core/dna` in both Studio mode and visitor SSG
      → existing tenant-alpha smoke test must stay green
- [ ] Vite dev resolves `@olonjs/core/dna/*` via source-link AND via published
      package → test both with `npm link` and a fresh `npx @olonjs/cli new tenant`
- [ ] `App.tsx` (~42 KB / 1162 lines) decomposes cleanly into a `createTenantApp(config)`
      factory without losing tenant-specific behavior
      → spike: extract config object, see if any non-config branch survives
- [ ] olon-agent can be retrofitted to read `dna.manifest.json` from the sandbox
      with strictly less code than today's `isSystemOwnedFixPath` blacklist
      → target: net negative LOC in `sandbox/route.ts` and `usePipeline.ts`

## MVP Scope (1-2 days, focused)

**In:**
1. Create `packages/core/src/dna/` with the 9 lib files + `boot/createTenantApp.tsx` + `boot/createSsgEntry.tsx` + `boot/mountTenant.tsx`
2. Add sub-export `"./dna"` to `packages/core/package.json` exports map
3. Refactor `apps/tenant-alpha`: replace removed files with `src/_core/` shims; verify build + dev + SSG
4. Write `apps/tenant-alpha/dna.manifest.json` and bake it into `packages/cli/assets/templates/alpha/`
5. Re-run `src2Code.sh` to regenerate `src_tenant_alpha.sh` template
6. Update `olon-agent`: replace `isSystemOwnedFixPath` and the prompt blacklist with a manifest-loader → `manifest.writeForbidden.some(p => minimatch(file, p))`

**Out (V2 / future):**
- Codemod for backward compat (we agreed: break now)
- `apps/_dna-shared/` symlink experiments
- Renaming `src/lib/` → `src/_tenant/` (cosmetic, defer)
- Re-publishing `@olonjs/core` to npm (use `npm link` for dev validation first)

## Not Doing (and Why)

- **Symlink-based shared DNA** — Windows/WSL/git interaction too fragile.
- **`sync-dna` CLI command** — requires human discipline; npm version bump is the discipline.
- **Migrating santa13/gumlon/llms with codemod** — they're throwaway tenants, recreate from new template in <10 min total.
- **Underscore-prefix convention without folder split** — too weak a visual signal for LLMs.
- **Touching `src/components/` and `src/data/`** — they're already 100% tenant-authored, no boundary confusion exists there.

## Open Questions

- Should `dna.manifest.json` live at the tenant root or inside `src/_core/`?
  (Suggest: tenant root — discoverable by tooling without traversing `src/`)
- Sub-export name: `@olonjs/core/dna` or `@olonjs/core/tenant-runtime`?
  (Suggest: `/dna` — matches existing vocabulary in prompts and rules)
- Do we expose a TS type for the manifest from `@olonjs/core` itself, so
  olon-agent gets type-safe access via `import type { DnaManifest } from '@olonjs/core/dna/manifest'`?
  (Suggest: yes — it's the contract definition)
- Bump `@olonjs/core` to 1.1.0 (minor, additive) or 2.0.0 (signal "DNA promoted")?
  (Suggest: 1.1.0 — purely additive, no removed exports)
