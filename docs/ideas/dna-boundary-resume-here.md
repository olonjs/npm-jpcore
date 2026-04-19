# DNA Boundary Refactor — Resume Here

> One-page bootstrap for the next session. Read this first, then dive into details only if needed.
> Last updated: 2026-04-19 (end of session that landed A.1 + A.2)

## TL;DR for the next session

We are mid-way through **Step A** of the plan in [`dna-boundary-tenant-core-shim.md`](./dna-boundary-tenant-core-shim.md) /
[`dna-boundary-spike-report.md`](./dna-boundary-spike-report.md). Two slices have shipped to `main`. One
slice (A.3) remains before Step A is closed. Steps B–G (component move, factory, shims, manifest, CLI,
agent guards) have not started.

## Verify state in 30 seconds

```bash
cd /home/dev/npm-jpcore
git log --oneline -3
# expect:
#   c216174 core: promote 4 DNA libs + deploy types into @olonjs/core/dna
#   a67dc83 tenant-alpha: redirect cn util imports to @olonjs/core
#   6ec79f6 0.0.61

ls packages/core/src/dna/
# expect:  index.ts  lib/  types/

ls apps/tenant-alpha/src/lib/
# expect 8 files, of which:
#   ComponentRegistry.tsx, schemas.ts, addSectionConfig.ts   ← TENANT-AUTHORED, stay
#   draftStorage.ts, getFilePages.ts, IconResolver.tsx,      ← A.3 to-do
#   useFormSubmit.ts, useOlonForms.ts                         ← A.3 to-do
```

If the above matches, you are at the correct resume point.

## What's done

| Slice | Commit | What landed |
|---|---|---|
| **A.1** | `a67dc83` | `cn` util dedupe — `@olonjs/core` already exported it; 27 `ui/*.tsx` redirected; tenant `lib/utils.ts` deleted. |
| **A.2** | `c216174` | 4 "clean" DNA libs (`base-schemas`, `cloudSaveStream`, `deploySteps`, `OlonFormsContext`) + `types/deploy.ts` promoted to `packages/core/src/dna/`; new barrel; tenant consumers redirected; 5 originals deleted. |

Total impact: **−42 files of duplicated/orphan tenant code, +6 files of canonical core DNA.** Tenant build size unchanged (same code, different origin). Core dist +15.97 kB (+3%).

## What's next — Step A.3 (5 libs, 4 sub-slices)

The remaining 5 libs in `apps/tenant-alpha/src/lib/` cannot be moved by pure copy because each one
depends on something Vite must resolve in the tenant module (`import.meta.env`, `import.meta.glob`)
or on tenant-side types. Each needs a small API refactor first.

| Sub-slice | Files | Refactor needed | Est. |
|---|---|---|---|
| **A.3.4** *(start here)* | `IconResolver.tsx` | None — pure DNA, ship as-is. YAGNI on customMap factory until 2nd tenant needs it. | ~15 min |
| **A.3.2** | `draftStorage.ts` | Generic types `<P, S>`; tenant supplies `PageConfig` / `SiteConfig` at call site. | ~15 min |
| **A.3.1** | `useFormSubmit.ts`, `useOlonForms.ts` | Both accept `options: { apiBaseUrl, apiKey, endpoint? }`; tenant reads `import.meta.env.VITE_*` and passes in. Move both together (shared env shape). | ~30 min |
| **A.3.3** *(last, touches App.tsx)* | `getFilePages.ts` | Split: `normalizePages(globResult)` is DNA, `import.meta.glob(...)` call stays in tenant as 3-line wrapper. | ~25 min |

Detailed plan in [`dna-boundary-spike-report.md`](./dna-boundary-spike-report.md) §"Step A.3 detailed plan".

## Recipe per sub-slice (proven on A.1 and A.2)

1. **Ground truth:** read all consumers of the lib (`Grep "from '@/lib/<name>'"` and **also** for relative imports `from './<name>'` — see lesson below).
2. **Refactor in tenant first** if the API needs to change (so the tenant still compiles before you move).
3. **Copy file** to `packages/core/src/dna/lib/`.
4. **Fix internal `@/` aliases** to relative paths inside the moved file.
5. **Add to `packages/core/src/dna/index.ts` barrel** (one `export *` line).
6. **Build core:** `cd packages/core && ../../node_modules/.bin/vite build`. Verify symbols in `dist/index.d.ts`.
7. **Redirect tenant imports** (sed pattern `from ['"]@/lib/<name>['"]` → `from "@olonjs/core"`).
8. **Delete tenant original.**
9. **Verify tenant:** `tsc --noEmit` then `vite build` from `apps/tenant-alpha/`. Both must be clean.
10. **Five-axis review** (correctness, readability, architecture, security, performance).
11. **Commit** atomic with descriptive message that explains *why*, not just *what*.

### Hard-learned lesson (from A.2)

When you are emptying a folder, your sed pattern must catch **both** alias imports
(`from '@/lib/Foo'`) and **relative imports** between files inside that same folder
(`from './Foo'`). On A.2 we missed `useOlonForms.ts:2 from './OlonFormsContext'` and
`tsc` caught it after delete. One-line fix, but next time pre-empt it with a broader grep.

## Running the WSL toolchain

The repo lives at `/home/dev/npm-jpcore` inside WSL Ubuntu. PowerShell shells inherit Windows `npm`,
which fails on this monorepo. Do every tooling call inside WSL with the nvm-managed Node 24:

```bash
export NVM_DIR=/home/dev/.nvm
. "$NVM_DIR/nvm.sh"
nvm use 24

# core build
cd packages/core && ../../node_modules/.bin/vite build

# tenant typecheck + build
cd apps/tenant-alpha
../../node_modules/.bin/tsc --noEmit
../../node_modules/.bin/vite build
```

PowerShell→WSL quoting is brittle. For anything more complex than one command, write a tiny script
in `scripts/_tmp_*.sh`, strip CRLF (`sed -i 's/\r$//'`), then `bash` it. Delete after use.

## Out-of-scope working-tree noise

The following pre-existing, untracked, or modified files are NOT part of this refactor and should
not be staged in any A.3 commit:

- `apps/tenant-alpha/package.json` — pre-existing version bump `^1.0.117` → `^1.0.120`
- `npm-jpcore.code-workspace`, `package-lock.json`, `.gitignore`
- `packages/cli/**` modifications
- `packages/core/.yalc/**`, `packages/core/yalc.lock` deletions
- `nul` stray Windows file at repo root

When you reach the commit step, stage explicitly by file (do not use `git add -A`).

## After Step A: a deliberate pause

Once A.3 is done, **stop and decide direction** before jumping to Step B/C. Three questions to
answer before continuing:

1. Should `@olonjs/core` add a real sub-export `"./dna"` in `package.json`, or keep re-exporting
   from the main barrel? (Decision deferred from A.2 — current approach works, sub-export is
   additive.)
2. Should `@olonjs/core` be bumped to `1.1.0` (additive, current state) or wait until Step C
   (createTenantApp factory) to bump as `1.2.0` together? (Spike suggested `1.1.0`.)
3. Is olon-agent the next priority (Step G — manifest-driven guards) or do we first finish the
   tenant refactor end-to-end (Steps C–F)?

Don't decide these inside Step A. Decide them at the A→B boundary with fresh context.
