# Spike Report: `createTenantApp(config)` factory feasibility

> Partner doc to [`dna-boundary-tenant-core-shim.md`](./dna-boundary-tenant-core-shim.md)
> Validates **Assumption #4**: `App.tsx` (~42 KB / 1162 lines) decomposes cleanly into a `createTenantApp(config)` factory without losing tenant-specific behavior.
> Date: 2026-04-19
> Outcome: **FEASIBLE — HIGH CONFIDENCE**
> Status: **In execution — Step A split into A.1/A.2/A.3, A.1 + A.2 landed.** See §"Execution Progress" below.
> ⚠️ Amended 2026-04-19 — see §"Amendment 2026-04-19" for the revised Step B and factory shape. Sections marked **SUPERSEDED** are kept for history but no longer reflect the plan.

## TL;DR

- `apps/tenant-alpha/src/App.tsx` is **≈ 97% DNA**. Only **8 symbols** are truly tenant-specific.
- Proposed tenant `src/_core/App.tsx` collapses from **1162 lines → ~28 lines**.
- Two real edge cases that need explicit handling in the factory API:
  1. `import.meta.env.*` reads (Vite inlines env at the module where the literal appears — MUST stay in tenant code, passed in explicitly).
  2. `DopaDrawer` imports `@/fonts.css?inline` — after promotion this coupling needs to flow through factory config.
- Decisions taken in this spike (confirmed by user):
  - `ThemeProvider` → **DNA, tenant-local** (revised 2026-04-19 — see Amendment; was originally "promote to core")
  - `EmptyTenantView` → **DNA, tenant-local** (revised 2026-04-19 — was originally "tenant-customizable"; user clarified it's the equivalent of a 404/empty-state page and must stay editable without core round-trips)
  - `DopaDrawer` (full `save-drawer/` chain) → **DNA, tenant-local** (revised 2026-04-19 — was originally "promote to core"; tight coupling to `@/fonts.css?inline` and the rest of the chain made local placement strictly simpler)
  - All three live under `apps/tenant-alpha/src/components/dna/` and are wired into `createTenantApp` as required props from the tenant shim.

## Line-by-line classification of `App.tsx`

### Pure DNA (becomes part of `createTenantApp`)

| Lines | Content | Destination |
|---|---|---|
| 6-9 | React + `JsonPagesEngine` + helpers from `@olonjs/core` | factory internal |
| 13 | `getHydratedData` from `@/lib/draftStorage` | factory internal (uses promoted DNA lib) |
| 15-17 | `DeployPhase`/`StepId`/`DEPLOY_STEPS`/`startCloudSaveStream` | factory internal |
| 21 | `getFilePages` | factory internal |
| 25 | `ThemeProvider` | factory internal (promoted to DNA) |
| 26-28 | `useOlonForms`, `OlonFormsContext`, `iconMap` | factory internal |
| 32-46 | env reads + refDocuments derivation | factory internal, BUT env values passed IN |
| 52-55 | upload constants, MIME allowlist | factory internal |
| 57-92 | types (`CloudSaveUiState`, `ContentResponse`, etc.) | factory internal |
| 94-420 | 23 helper functions (cloud fetch, coerce, cache, CSS parse) | factory internal |
| 422-1030 | `function App() { ... }` component body | factory body |
| 1032-1157 | JSX render (ThemeProvider, loading, JsonPagesEngine, DopaDrawer) | factory body |

### Tenant-specific (becomes factory input)

These are the **only** 8 values the factory needs from the tenant:

| # | Symbol | Source | Type |
|---|---|---|---|
| 1 | `TENANT_ID = 'alpha'` | hardcoded string literal | `string` |
| 2 | `ComponentRegistry` | `@/lib/ComponentRegistry` | `JsonPagesConfig['registry']` |
| 3 | `SECTION_SCHEMAS` | `@/lib/schemas` | `JsonPagesConfig['schemas']` |
| 4 | `addSectionConfig` | `@/lib/addSectionConfig` | `JsonPagesConfig['addSection']` |
| 5 | `siteData` | `@/data/config/site.json` | `SiteConfig` (raw) |
| 6 | `themeData` | `@/data/config/theme.json` | `ThemeConfig` (raw) |
| 7 | `menuData` | `@/data/config/menu.json` | `MenuConfig` (raw) |
| 8 | `tenantCss` | `@/index.css?inline` | `string` |

Plus **1 render-time dependency** that stays tenant-authored but is just a capsule component:
- `EmptyTenantView` from `@/components/empty-tenant` — factory accepts it as optional prop, defaults to nothing / generic fallback.

Plus **env values** (see edge case §1):
- `VITE_OLONJS_CLOUD_URL`, `VITE_OLONJS_API_KEY`, `VITE_SAVE2REPO`, `BASE_URL`

## Proposed factory API

Location: `packages/core/src/dna/boot/createTenantApp.tsx`

```tsx
import type { ComponentType } from 'react';
import type {
  JsonPagesConfig,
  SiteConfig,
  ThemeConfig,
  MenuConfig,
} from '@olonjs/core';

export interface TenantAppEnv {
  /** `import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL` */
  cloudUrl?: string;
  /** `import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY` */
  apiKey?: string;
  /** `import.meta.env.VITE_SAVE2REPO === 'true'` */
  save2repoEnabled: boolean;
  /** `import.meta.env.BASE_URL || '/'` */
  basePath: string;
  /** `import.meta.env.DEV` */
  isDev: boolean;
}

export interface CreateTenantAppConfig {
  /** Namespace identifier. Flows to JsonPagesConfig.tenantId and to cloud scoping. */
  tenantId: string;

  /** Component registry produced by tenant code. */
  registry: JsonPagesConfig['registry'];

  /** Zod schemas for section payloads. */
  schemas: JsonPagesConfig['schemas'];

  /** Studio "Add Section" configuration. */
  addSection: JsonPagesConfig['addSection'];

  /** Raw JSON imports — factory handles coercion. */
  siteData: unknown;
  themeData: unknown;
  menuData: unknown;

  /** `?inline` imported tenant stylesheet content. */
  tenantCss: string;

  /** `?inline` imported tenant fonts stylesheet (consumed by DopaDrawer shadow root). */
  fontsCss: string;

  /** Vite env values — MUST be passed from tenant module so Vite inlines them in tenant build, not core build. */
  env: TenantAppEnv;

  /** Optional tenant-branded empty state. Defaults to a neutral placeholder. */
  EmptyTenantView?: ComponentType;
}

export function createTenantApp(cfg: CreateTenantAppConfig): ComponentType;
```

## Proposed tenant shim (`apps/tenant-alpha/src/_core/App.tsx`)

```tsx
import { createTenantApp } from '@olonjs/core/dna';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import tenantCss from '@/index.css?inline';
import fontsCss from '@/fonts.css?inline';
import { EmptyTenantView } from '@/components/empty-tenant';

export default createTenantApp({
  tenantId: 'alpha',
  registry: ComponentRegistry,
  schemas: SECTION_SCHEMAS,
  addSection: addSectionConfig,
  siteData,
  themeData,
  menuData,
  tenantCss,
  fontsCss,
  env: {
    cloudUrl: import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL,
    apiKey: import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY,
    save2repoEnabled: import.meta.env.VITE_SAVE2REPO === 'true',
    basePath: import.meta.env.BASE_URL || '/',
    isDev: import.meta.env.DEV,
  },
  EmptyTenantView,
});
```

**From 1162 lines to 28.** The shim contains **zero logic** — only binding.

## Edge cases surfaced by the spike

### §1. `import.meta.env` must be read in tenant code, not DNA code

**Problem.** Vite inlines `import.meta.env.VITE_X` **at the module location of the literal text**. If `createTenantApp.tsx` lives in `@olonjs/core` and reads `import.meta.env.VITE_OLONJS_CLOUD_URL` directly, Vite inlines the value from `@olonjs/core`'s build (which has no `.env` in prod), not from the tenant app. Result: `undefined` in production tenants.

**Fix in proposed API.** Config field `env: TenantAppEnv` — tenant shim reads `import.meta.env.*` literals and passes them in. DNA code sees plain values. Vite resolves all env at tenant build time as intended.

**Cost.** 6 lines in tenant shim. Explicit and type-safe — arguably better than implicit inlining.

### §2. `DopaDrawer` reaches into `@/fonts.css` via `?inline`

> **RESOLVED 2026-04-19 — see "Amendment 2026-04-19" below.** DopaDrawer no longer moves to core; it stays under `apps/tenant-alpha/src/components/dna/save-drawer/`. The `@/fonts.css?inline` import resolves locally as before. No factory config field, no React Context required.

**Original problem.** `DopaDrawer.tsx:5` does `import fontsCss from '@/fonts.css?inline'`. When DopaDrawer is promoted to `@olonjs/core/dna/components/save-drawer/`, the `@/fonts.css` path resolves inside the core package, not the tenant. Tenant-specific fonts would be lost inside the save-drawer Shadow DOM.

**Original proposed fix (now obsolete).** Config field `fontsCss: string` — tenant shim does the `?inline` import and passes it in. Factory forwards it to DopaDrawer via props or a React context (`TenantFontsContext`).

### §3. `?inline` CSS query is Vite-specific

**Not actually a problem** — the `?inline` import lives in tenant shim code (where Vite processes it), not in core package source. Core just receives strings.

### §4. `types.ts` module augmentation

The tenant declares `declare module '@olonjs/core' { interface Registry { ... } }` in `src/types.ts`. This must stay in the tenant (TS module augmentation is lexically scoped to the consuming project). Factory does not need to know. No change required.

### §5. `EmptyTenantView` prop nullability

Current `App.tsx:1088` always renders `<EmptyTenantView />` when pages are empty. If tenant doesn't pass one, DNA should still render *something*. Proposed: DNA ships a neutral fallback component used when `cfg.EmptyTenantView` is undefined. Tenant can override by providing their capsule.

## Files that move during promotion

### Into `packages/core/src/dna/`

```
dna/
├── boot/
│   ├── createTenantApp.tsx        ← NEW factory, contains the 1130 DNA lines
│   ├── createSsgEntry.tsx         ← factory from current apps/tenant-alpha/src/entry-ssg.tsx
│   └── mountTenant.tsx            ← factory from current apps/tenant-alpha/src/main.tsx
├── components/
│   ├── ThemeProvider.tsx          ← moved from apps/tenant-alpha/src/components/ThemeProvider.tsx
│   └── save-drawer/
│       ├── DopaDrawer.tsx
│       ├── DeployNode.tsx
│       ├── DeployConnector.tsx
│       ├── Visuals.tsx
│       └── saverStyle.css
├── lib/
│   ├── base-schemas.ts
│   ├── cloudSaveStream.ts
│   ├── deploySteps.ts
│   ├── draftStorage.ts
│   ├── getFilePages.ts
│   ├── IconResolver.tsx
│   ├── OlonFormsContext.ts
│   ├── useFormSubmit.ts
│   ├── useOlonForms.ts
│   └── utils.ts                   ← replace core's duplicate at packages/core/src/lib/utils.ts
├── types/
│   └── deploy.ts                  ← DeployPhase, StepId, StepState
└── manifest.ts                    ← TS types for dna.manifest.json
```

### Stay in `apps/tenant-alpha/src/`

```
src/
├── _core/
│   ├── App.tsx                    ← shim (28 lines)
│   ├── main.tsx                   ← shim (3 lines)
│   ├── runtime.ts                 ← shim (3 lines re-export)
│   ├── entry-ssg.tsx              ← shim (10-ish lines, calls createSsgEntry)
│   └── vite-env.d.ts              ← shim (re-export)
├── components/                    ← ALL TENANT (including empty-tenant/)
├── data/                          ← ALL TENANT
├── lib/
│   ├── ComponentRegistry.tsx      ← TENANT
│   ├── schemas.ts                 ← TENANT
│   └── addSectionConfig.ts        ← TENANT
├── types.ts                       ← TENANT (module augmentation)
├── index.css                      ← TENANT (theme)
└── fonts.css                      ← TENANT
```

### Deleted from tenant

```
apps/tenant-alpha/src/
├── App.tsx                       ← 1162 lines DELETED, logic moved to core
├── main.tsx                      ← moved to _core/ as shim
├── runtime.ts                    ← moved to _core/ as shim
├── entry-ssg.tsx                 ← moved to _core/ as shim
├── components/ThemeProvider.tsx  ← moved to core
├── components/save-drawer/       ← whole folder moved to core
└── lib/
    ├── base-schemas.ts           ← moved to core
    ├── cloudSaveStream.ts        ← moved to core
    ├── deploySteps.ts            ← moved to core
    ├── draftStorage.ts           ← moved to core
    ├── getFilePages.ts           ← moved to core
    ├── IconResolver.tsx          ← moved to core
    ├── OlonFormsContext.ts       ← moved to core
    ├── useFormSubmit.ts          ← moved to core
    ├── useOlonForms.ts           ← moved to core
    └── utils.ts                  ← moved to core (deduping existing copy)
```

## Estimated LOC delta

| Location | Current | After | Delta |
|---|---|---|---|
| `apps/tenant-alpha/src/App.tsx` | 1162 | 0 (deleted) | −1162 |
| `apps/tenant-alpha/src/_core/App.tsx` | — | 28 | +28 |
| `apps/tenant-alpha/src/_core/*` shims | — | ~40 | +40 |
| `apps/tenant-alpha/src/main.tsx` + 3 other root | ~60 | 0 | −60 |
| `apps/tenant-alpha/src/components/ThemeProvider.tsx` | 60 | 0 | −60 |
| `apps/tenant-alpha/src/components/save-drawer/*` | ~800 | 0 | −800 |
| `apps/tenant-alpha/src/lib/{9 DNA files}` | ~270 total | 0 | −270 |
| `packages/core/src/dna/boot/createTenantApp.tsx` | — | ~1100 | +1100 |
| `packages/core/src/dna/components/*` | — | ~860 | +860 |
| `packages/core/src/dna/lib/*` | — | ~270 | +270 |
| **Net per tenant** | — | — | **−2280 LOC** |
| **Net monorepo (first tenant)** | — | — | ~0 |
| **Net monorepo per additional tenant** | — | — | **−2280 LOC** |

With 2+ tenants this is a massive de-duplication. santa13/gumlon/llms/future tenants all stop carrying this weight.

## Feasibility verdict

**HIGH CONFIDENCE GO.** The App.tsx body is essentially pure runtime logic. The 8 tenant-specific symbols are clean. The 2 edge cases (env vars, fonts.css coupling) have clean, type-safe answers in the factory API. The refactor is mechanical, not architectural — we're not redesigning behavior, we're relocating modules.

### Risks ranked

1. **Low** — `EmptyTenantView` prop default: need to ship a neutral fallback in DNA to avoid `undefined` render on tenants that forget to pass one. *Mitigation: just default to `() => null` or a minimal "Tenant is empty" card.*
2. **Low** — DopaDrawer + tenant fonts coupling: adds one prop, one context. Trivial.
3. **Low** — Module augmentation in `types.ts` must keep working. It will (TS resolves module augmentation per-project).
4. **Low** — Tree-shaking: `@olonjs/core/dna` pulls ~1100 lines of JSX + ~800 lines of DopaDrawer into visitor SSG bundle. *Mitigation: factor `createSsgEntry` to import only SSG-relevant pieces; DopaDrawer should be dynamic-imported inside `createTenantApp` render path, not top-level.* → Flag for implementation phase.
5. **Zero** — Breaking changes for Agent 1's prompt: section "FIXED TENANT DNA" collapses from enumeration to "don't write in `src/_core/**`". This is strictly a simplification.

## Recommended next steps

1. **Green-light the full plan.** Nothing in the spike suggests we should abort or redesign.
2. **Implement in this order** (each step individually shippable):
   - [x] **Step A.1** — Dedupe `utils.ts`: `cn` was already exported by `@olonjs/core` (no work in core needed); 27 `ui/*.tsx` consumers redirected; tenant duplicate deleted. *Done — commit `a67dc83`.*
   - [x] **Step A.2** — Promote 4 "clean" DNA libs (`base-schemas`, `cloudSaveStream`, `deploySteps`, `OlonFormsContext`) and `types/deploy.ts` to `packages/core/src/dna/`; new barrel `packages/core/src/dna/index.ts`; one-line addition to `packages/core/src/index.ts`. 8 tenant consumers redirected. *Done — commit `c216174`.*
   - [ ] **Step A.3** — 5 libs that need an API refactor before they can move (see §"Step A.3 detailed plan" below): `draftStorage`, `getFilePages`, `IconResolver`, `useFormSubmit`, `useOlonForms`. Group into 3 sub-slices.
   - [ ] Step B — Move `ThemeProvider` and `save-drawer` to `packages/core/src/dna/components/`. Tenant re-imports via `@olonjs/core` (or `@olonjs/core/dna` once a sub-export is added).
   - [ ] Step C — Extract `createTenantApp` factory in `packages/core/src/dna/boot/`. Tenant `src/App.tsx` becomes the 28-line shim. Verify build + dev mode + SSG.
   - [ ] Step D — Ditto `main.tsx`, `runtime.ts`, `entry-ssg.tsx` into `src/_core/` shims.
   - [ ] Step E — Emit `dna.manifest.json` at tenant root. Bake into CLI template via `src2Code.sh`.
   - [ ] Step F — Re-scaffold santa13/gumlon/llms from new template. Smoke-test each.
   - [ ] Step G — Patch `olon-agent` to read manifest and collapse blacklists.
3. **Dogfood Step G last.** Don't touch olon-agent until the manifest actually exists in tenants from Step E.

## Execution Progress

### 2026-04-19 — Slice A.1 (commit `a67dc83`)

- **Trigger discovery:** during ground-truth read of `apps/tenant-alpha/src/lib/`, found that `cn()` in `utils.ts` is byte-for-byte identical to `packages/core/src/lib/utils.ts`, AND that `@olonjs/core` already re-exports it (`dist/index.d.ts:179`). Dedupe was therefore zero-risk and immediate.
- **Change:** 27 `apps/tenant-alpha/src/components/ui/*.tsx` files switched `from '@/lib/utils'` → `from '@olonjs/core'`; tenant `src/lib/utils.ts` deleted.
- **Verify:** `tsc --noEmit` clean; `vite build` clean (1630 modules, 770.75 kB bundle).
- **LOC:** +27 / −33 across 28 files.

### 2026-04-19 — Slice A.2 (commit `c216174`)

- **Move:** 5 framework-owned files (4 libs + `types/deploy.ts`) renamed from `apps/tenant-alpha/src/{lib,types}/` to `packages/core/src/dna/{lib,types}/`. Internal `@/types/deploy` path inside `cloudSaveStream` and `deploySteps` rewritten to `../types/deploy` (sibling). New barrel `packages/core/src/dna/index.ts` aggregates the 14 exported symbols. `packages/core/src/index.ts` gets one additive line: `export * from './dna';`.
- **Tenant redirect:** 8 consumers redirected from `@/lib/{...}` and `@/types/deploy` → `@olonjs/core`. 5 originals deleted; empty `apps/tenant-alpha/src/types/` directory removed.
- **Bug caught by `tsc`:** `useOlonForms.ts:2` (out of A.2 scope) had a relative import `from './OlonFormsContext'` not matched by the alias-only sed pattern. Fixed in place with a 1-line type-only redirect to `@olonjs/core`. **Lesson for future move slices:** also pattern-match relative `./Foo`/`../foo` imports inside the folder being emptied.
- **Verify:** core `vite build` OK (1710 modules, 520.77 kB, +15.97 kB ≈ +3% — coherent with ~16 kB of DNA absorbed); 14 new symbols verified present in `dist/index.d.ts`. Tenant `tsc --noEmit` clean; tenant `vite build` clean (1626 modules, −4 from previous; bundle 770.76 kB unchanged because the same code still lands in the tenant bundle, just sourced from `@olonjs/core`).
- **Git:** detected as 5 renames (94–100% similarity) — history preserved.
- **LOC:** +33 / −15 across 16 files (excluding renames).

### Step A bookkeeping at the end of session 2026-04-19

```
apps/tenant-alpha/src/lib/      ← what is left
├── ComponentRegistry.tsx        TENANT-AUTHORED (stays)
├── schemas.ts                   TENANT-AUTHORED (stays)
├── addSectionConfig.ts          TENANT-AUTHORED (stays)
├── draftStorage.ts              A.3 — needs generic types
├── getFilePages.ts              A.3 — needs Vite glob factory
├── IconResolver.tsx             A.3 — needs customMap factory (or accept-as-is)
├── useFormSubmit.ts             A.3 — needs env injection
└── useOlonForms.ts              A.3 — needs env injection

packages/core/src/dna/           ← what is now there
├── index.ts                     barrel
├── lib/
│   ├── base-schemas.ts
│   ├── cloudSaveStream.ts
│   ├── deploySteps.ts
│   └── OlonFormsContext.ts
└── types/
    └── deploy.ts
```

## Step A.3 detailed plan

The 5 remaining libs cannot be promoted by a pure copy + import-redirect because each one touches a Vite-specific resolution context that must stay in the tenant module, OR a tenant-side type. The pattern is the same one identified in this report's §"Edge cases surfaced by the spike" (§1 env, §2 fonts.css): **inject from tenant, never read inside the DNA module**.

Recommended grouping into 3 sub-slices, each independently shippable:

### A.3.1 — Form hooks env injection (≈ 60 LOC change, ~30 min)

Two hooks share the same env shape; ship them together.

- `useFormSubmit.ts` reads `import.meta.env.VITE_JSONPAGES_CLOUD_URL` / `VITE_JSONPAGES_API_KEY` directly inside the hook body.
- `useOlonForms.ts` reads `VITE_OLONJS_CLOUD_URL ?? VITE_JSONPAGES_CLOUD_URL` and the same for `API_KEY` at module top-level.

**Refactor:** both hooks accept an `options: { apiBaseUrl: string; apiKey: string; endpoint?: string }` argument. Tenant code reads `import.meta.env.*` and passes values in. Move both files to `packages/core/src/dna/lib/`. Update tenant call sites in `App.tsx` (`useOlonForms({ apiBaseUrl, apiKey })`) and any `form-demo` consumer of `useFormSubmit`.

Bundle delta: same ~5 KB moved to core.

### A.3.2 — `draftStorage` generic types (≈ 20 LOC, ~15 min)

`getHydratedData(tenantId, filePages, fileSiteConfig): HydratedData` types its arguments via tenant-side `PageConfig` / `SiteConfig` from `@/types`. The implementation just spreads — generic.

**Refactor:** `getHydratedData<P, S>(tenantId: string, filePages: Record<string, P>, fileSiteConfig: S): HydratedData<P, S>`. Tenant call site supplies `<PageConfig, SiteConfig>` either explicitly or via inference. Move to `packages/core/src/dna/lib/`.

### A.3.3 — `getFilePages` Vite glob factory (≈ 40 LOC, ~25 min)

`getFilePages()` calls `import.meta.glob('@/data/pages/**/*.json', { eager: true })`. Vite resolves `@/...` against the **module** that contains the literal text, so this glob MUST be evaluated in tenant code. Only the post-glob normalization (`slugFromPath`, dedup, sort) is DNA.

**Refactor:** split into:
- `packages/core/src/dna/lib/normalizePages.ts` exports `normalizePages(globResult: Record<string, { default: unknown }>): Record<string, PageConfig>`. Pure, no Vite knowledge.
- `apps/tenant-alpha/src/lib/getFilePages.ts` shrinks to a 3-liner that calls `import.meta.glob` and forwards to `normalizePages`. Stays tenant-side. (Consider deleting the wrapper entirely and inlining the call into `App.tsx` once Step C lands.)

### A.3.4 — `IconResolver` (decision: defer or factory)

The current `iconMap` hardcodes 11 lucide icons. If every tenant uses the same set, the file is pure DNA — promote as-is. If tenants need to add icons, we need a factory `createIconResolver(extraMap?)`.

**Recommendation:** ship as-is in `packages/core/src/dna/lib/IconResolver.tsx` (pure DNA), and revisit when the second tenant actually needs a custom icon. YAGNI.

This is ~10 LOC of sed-style replacements + one extra symbol exported by the dna barrel.

### Order suggestion

1. A.3.4 first (smallest, no API change, builds momentum).
2. A.3.2 (generics — pure type-level change).
3. A.3.1 (form hooks together — most LOC but mechanical).
4. A.3.3 last (touches `App.tsx` directly, which feeds into Step C).

After A.3 completes, `apps/tenant-alpha/src/lib/` contains only 3 tenant-authored files and Step A is closed.

---

## Amendment 2026-04-19 — Tenant-side DNA components

> Supersedes: §"Files that move during promotion" (component portion only — lib/types portion is unchanged), §"Proposed factory API" (adds 3 component props), §"Proposed tenant shim" (imports DNA components locally), §"Edge cases §2" (now N/A), §"Estimated LOC delta" (revised below).
> Lib promotion plan (Step A.1 → A.3) is **NOT affected** by this amendment.

### What changed

The user revised the disposition of the three component-level DNA candidates. Instead of promoting them to `@olonjs/core/dna/components/`, all three live tenant-side under a dedicated `apps/tenant-alpha/src/components/dna/` subdirectory. They remain DNA in the conceptual sense (framework-shaped, not brand-shaped), but are kept locally so the tenant author can iterate on them without an `@olonjs/core` publish round-trip.

### Why

1. **`empty-tenant`** is "the 404 of empty pages" — the tenant author wants to keep editing it (copy, illustration, CTA) without touching core. Treating it as immutable-in-core would make iteration painful.
2. **`DopaDrawer`** has tight coupling to `@/fonts.css?inline` (Shadow DOM stylesheet injection). Promoting it to core forced a `fontsCss: string` factory prop + a React Context — clever, but extra surface area for zero real benefit. Keeping the file tenant-side makes the Vite alias resolve naturally and removes the edge case entirely.
3. **`ThemeProvider`** is genuinely identical across tenants today, but lives next to the other two in the rendering tree. Splitting one into core and two into tenant would create an asymmetric mental model. Better to keep all three together under one `components/dna/` umbrella with a shared "tenant-local DNA" status.

The `dna/` folder name signals immutability-by-convention: agents and tenant authors know "these files are framework-shaped, modify with care, never freely refactor". The CLI scaffold and `dna.manifest.json` (Step E) will mark this folder as `writeAllowed: false` for `olon-agent`, same protection level we'd have given the core-promoted versions.

### Revised classification

| Component | Original spike disposition | Final disposition (this amendment) | Rationale |
|---|---|---|---|
| `ThemeProvider.tsx` | Promote to `@olonjs/core/dna/components/` | Move to `apps/tenant-alpha/src/components/dna/` | Lives next to the other two; uniformity |
| `empty-tenant/` | Stay tenant, brand-customizable | Move to `apps/tenant-alpha/src/components/dna/empty-tenant/` | DNA-shaped, but author iterates frequently |
| `save-drawer/` (incl. `DopaDrawer`) | Promote to `@olonjs/core/dna/components/save-drawer/` | Move to `apps/tenant-alpha/src/components/dna/save-drawer/` | Removes `@/fonts.css?inline` edge case; entire chain stays coupled |

### Revised factory API (Step C)

The factory accepts the three components as **required props**. The tenant shim imports them from local `components/dna/` and passes them in.

```tsx
// packages/core/src/dna/boot/createTenantApp.tsx
import type { ComponentType, ReactNode } from 'react';
import type { JsonPagesConfig, CloudSaveUiState } from '@olonjs/core';

export interface TenantAppEnv {
  cloudUrl?: string;
  apiKey?: string;
  save2repoEnabled: boolean;
  basePath: string;
  isDev: boolean;
}

/** Contract for the tenant-supplied save-drawer component. */
export interface DopaDrawerProps {
  state: CloudSaveUiState;
  onClose: () => void;
  onRetry: () => void;
}

export interface CreateTenantAppConfig {
  tenantId: string;
  registry: JsonPagesConfig['registry'];
  schemas: JsonPagesConfig['schemas'];
  addSection: JsonPagesConfig['addSection'];
  siteData: unknown;
  themeData: unknown;
  menuData: unknown;
  tenantCss: string;
  env: TenantAppEnv;

  /** Tenant-local DNA components — supplied by the tenant scaffold. */
  ThemeProvider: ComponentType<{ children: ReactNode }>;
  EmptyTenantView: ComponentType;
  DopaDrawer: ComponentType<DopaDrawerProps>;
}

export function createTenantApp(cfg: CreateTenantAppConfig): ComponentType;
```

Notes:
- `fontsCss: string` and the `TenantFontsContext` from edge case §2 are **gone**.
- `EmptyTenantView` is now required (not optional) — the tenant always has one.
- `DopaDrawerProps` is exported from `@olonjs/core/dna` so the tenant component can satisfy the contract by import-typing.

### Revised tenant shim (`apps/tenant-alpha/src/_core/App.tsx`)

```tsx
import { createTenantApp } from '@olonjs/core/dna';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import tenantCss from '@/index.css?inline';
import { ThemeProvider } from '@/components/dna/ThemeProvider';
import { EmptyTenantView } from '@/components/dna/empty-tenant';
import { DopaDrawer } from '@/components/dna/save-drawer/DopaDrawer';

export default createTenantApp({
  tenantId: 'alpha',
  registry: ComponentRegistry,
  schemas: SECTION_SCHEMAS,
  addSection: addSectionConfig,
  siteData,
  themeData,
  menuData,
  tenantCss,
  env: {
    cloudUrl: import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL,
    apiKey: import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY,
    save2repoEnabled: import.meta.env.VITE_SAVE2REPO === 'true',
    basePath: import.meta.env.BASE_URL || '/',
    isDev: import.meta.env.DEV,
  },
  ThemeProvider,
  EmptyTenantView,
  DopaDrawer,
});
```

**~35 lines instead of the original 28** — slightly more verbose, dramatically simpler architecture (no `fontsCss` plumbing, no React Context, no Shadow-DOM-aware factory code).

### Revised "files that move" diagram

#### Into `packages/core/src/dna/` (unchanged from original plan, just no `components/`)

```
packages/core/src/dna/
├── boot/
│   ├── createTenantApp.tsx        ← NEW factory (Step C)
│   ├── createSsgEntry.tsx         ← NEW (Step D)
│   └── mountTenant.tsx            ← NEW (Step D)
├── lib/
│   ├── base-schemas.ts                ✅ A.2 done
│   ├── cloudSaveStream.ts             ✅ A.2 done
│   ├── deploySteps.ts                 ✅ A.2 done
│   ├── OlonFormsContext.ts            ✅ A.2 done
│   ├── draftStorage.ts                pending A.3.2
│   ├── normalizePages.ts (new)        pending A.3.3
│   ├── IconResolver.tsx               pending A.3.4
│   ├── useFormSubmit.ts               pending A.3.1
│   └── useOlonForms.ts                pending A.3.1
├── types/
│   └── deploy.ts                      ✅ A.2 done
└── manifest.ts                        Step E
```

#### Stay tenant-side under `apps/tenant-alpha/src/components/dna/` (Step B)

```
apps/tenant-alpha/src/components/dna/
├── ThemeProvider.tsx          ← moved from src/components/ThemeProvider.tsx
├── empty-tenant/              ← moved from src/components/empty-tenant/
│   ├── View.tsx
│   ├── schema.ts
│   ├── types.ts
│   └── index.ts
└── save-drawer/               ← moved from src/components/save-drawer/
    ├── DopaDrawer.tsx
    ├── DeployNode.tsx
    ├── DeployConnector.tsx
    ├── Visuals.tsx
    └── saverStyle.css
```

The `dna.manifest.json` (Step E) will list `src/components/dna/**` in `writeAllowed: false` so `olon-agent` cannot edit these files.

### Revised LOC delta (more honest)

| Location | Before | After | Delta |
|---|---|---|---|
| `apps/tenant-alpha/src/App.tsx` | 1162 | 0 (deleted) | −1162 |
| `apps/tenant-alpha/src/_core/App.tsx` shim | — | ~35 | +35 |
| `apps/tenant-alpha/src/_core/*` other shims (main, runtime, entry-ssg) | — | ~40 | +40 |
| `apps/tenant-alpha/src/{main,runtime,entry-ssg}.tsx` | ~60 | 0 | −60 |
| `apps/tenant-alpha/src/components/{ThemeProvider, empty-tenant, save-drawer}` | ~860 | ~860 (relocated under `components/dna/`) | 0 |
| `apps/tenant-alpha/src/lib/{9 DNA libs}` | ~270 | 0 | −270 |
| `packages/core/src/dna/boot/createTenantApp.tsx` | — | ~1100 | +1100 |
| `packages/core/src/dna/lib/*` (A.1–A.3 total) | — | ~270 | +270 |
| **Net per tenant after A.3 + B + C + D** | — | — | **≈ −150 LOC per tenant + 1 huge file gone** |
| **Net monorepo per additional tenant** | — | — | **≈ −1450 LOC** (no longer ships own `App.tsx` or DNA libs; still ships own `components/dna/` chain) |

The headline number is smaller than the original spike's "−2280 per tenant" because `ThemeProvider` + `empty-tenant` + `save-drawer` (~860 LOC) are no longer deduplicated across tenants. **This is intentional** — the user weighed editability against deduplication and chose editability for these three. The big win remains: every tenant stops carrying a 1162-line `App.tsx` and ~270 lines of DNA libs.

### What this amendment does NOT change

- **Step A.1, A.2 ✅, A.3 plan** — entirely unchanged. The 9 DNA libs still go to `@olonjs/core/dna/lib/`.
- **Step C (createTenantApp factory)** — still happens, just with the revised props shape above.
- **Step D (`_core/` shims)** — unchanged.
- **Step E (`dna.manifest.json`)** — unchanged in mechanism, but `writeAllowed: false` paths now include `src/components/dna/**` in addition to `src/_core/**`.
- **Step F (re-scaffold santa13/gumlon/llms)** — unchanged.
- **Step G (olon-agent manifest reader)** — unchanged.

### Migration cost

Step B (the only changed step) is now strictly cheaper than the original plan: it's a `git mv` of three folders inside the tenant, zero changes to `@olonjs/core`, zero new exports to publish, and no edge-case factory props. Estimated: **~15 min including verify**, vs the original ~45 min that included a core publish cycle.
