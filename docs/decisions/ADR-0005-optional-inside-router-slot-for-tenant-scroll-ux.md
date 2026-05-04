# ADR-0005: Optional “inside router” slot on `JsonPagesConfig` for tenant-controlled SPA scroll UX

## Status

Accepted — pending implementation and verification (2026-05-04)

## Date

2026-05-04

## Scope

`@olonjs/core` — `JsonPagesEngine` shell (`BrowserRouter`), public config type `JsonPagesConfig` in `packages/core/src/contract/types-engine.ts`.

## Context

The visitor shell is rendered by `@olonjs/core` inside `BrowserRouter` (`JsonPagesEngine`). **SPA navigations do not reset the viewport** by default; users can land on a new route still scrolled to the previous page’s offset. Improving that UX requires a component that can call router hooks (e.g. `useLocation`) and run effects on location changes—**only valid inside the same router tree** as `Routes`. Tenant `App` is outside that tree when it only mounts `<JsonPagesEngine />`, so a tenant cannot fix scroll behavior without either forking the shell or getting an **extension point** from core.

A prior attempt to solve this globally is recorded in [ADR-0004](./ADR-0004-scroll-restoration-in-json-pages-engine.md): render `<ScrollRestoration />` from `react-router-dom` under `BrowserRouter`. That approach was **reverted**. React Router’s `ScrollRestoration` is built for **data routers** (`RouterProvider` / `createBrowserRouter`). Under `BrowserRouter` it throws at runtime (`useScrollRestoration must be used within a data router`). Shipping it in core therefore broke production shells.

We need a direction that:

1. **Does not** rely on `ScrollRestoration` while the shell remains `BrowserRouter`-based.
2. **Defaults to today’s behavior** so existing tenants see **no bundle or runtime change** unless they opt in (additive API only).
3. Allows tenants who care about scroll UX to mount a small, tenant-owned component **inside** the router.

## Decision

**Direction B — optional additive extension in core, default “off”.**

1. **Extend `JsonPagesConfig`** with an optional property (exact **public name still to be finalized**), for example `insideRouterSlot?: React.ReactNode`, typed and documented on `JsonPagesConfig` alongside existing fields.

2. **`JsonPagesEngine`** renders this node **inside** `<BrowserRouter>` **before** `<Routes>` when the value is **not** `undefined`. When `undefined` (the default for all existing call sites), **no extra node is mounted**; behavior and effective tree match the pre-slot implementation.

3. **Core does not** ship a default `ScrollToTop` or reintroduce **global** `<ScrollRestoration />`. Tenants that want “scroll to top on navigation” pass their own component, e.g. `<ScrollToTop />`, implemented in the **tenant** repo using `useLocation` (or equivalent) and `window.scrollTo` / `scrollTo` in a layout effect, with any hash or preserve-scroll policy the tenant chooses.

4. **Explicit non-goal:** migrating the whole engine to a React Router **data router** **only** for scroll. That remains a separate, large decision if ever pursued; this ADR does not adopt it.

## Alternatives Considered

### A — Global `<ScrollRestoration />` in core under `BrowserRouter`

- **Pros:** One-line integration; delegates to React Router.
- **Cons:** Invalid with the current `BrowserRouter` shell; caused production failures. Documented and deprecated in [ADR-0004](./ADR-0004-scroll-restoration-in-json-pages-engine.md).
- **Rejected.**

### B — Migrate `JsonPagesEngine` to `createBrowserRouter` / `RouterProvider`

- **Pros:** Unlocks first-party `ScrollRestoration` and data-router APIs.
- **Cons:** Large refactor, high blast radius across all tenants and releases; unrelated to “optional scroll UX” for one tenant.
- **Rejected** for this goal (may be reconsidered as its own ADR later).

### C — Core ships built-in “always scroll to top” via internal `useLayoutEffect`

- **Pros:** No tenant code for the common case.
- **Cons:** Changes **default** behavior for **every** tenant (violates zero-impact requirement); back/forward and hash semantics must be reimplemented or accepted as regressions.
- **Rejected** until product agrees default-on behavior.

### D — Do nothing; accept broken scroll UX for everyone

- **Rejected:** we already know tenants need an escape hatch; optional slot delivers capability without forcing behavior.

## Consequences

- **Semver:** Additive field on `JsonPagesConfig` implies a **minor** `@olonjs/core` release when implemented.
- **Existing tenants:** With no config change, **no** new behavior; **no** required code changes to stay on the upgrade.
- **Opt-in tenants:** Maintain a small `ScrollToTop` (or similar) in their app and pass it via the new field. They own behavior (top vs preserve, hash, exceptions).
- **Documentation:** Idea-level notes live in [`docs/ideas/opt-in-router-slot-zero-impact.md`](../ideas/opt-in-router-slot-zero-impact.md); this ADR is the **normative** decision record.
- **Testing:** Matrix “without slot” = parity with current release; “with slot” = scroll helper runs only inside router; admin/preview routes verified for no regressions.

## Follow-ups

- [ ] Finalize the **public property name** on `JsonPagesConfig` and add JSDoc (stable contract).
- [ ] Implement render path in `JsonPagesEngine` and export types from `@olonjs/core`.
- [ ] Add a short “tenant recipe” (ScrollToTop snippet) to core or tenant template docs after implementation.
- [ ] Changelog entry for the minor release.

## Open Points

- Exact identifier: `insideRouterSlot` vs alternatives (`routerShellChildren`, `navigationSlot`, etc.).
- Relationship to [ADR-0006](./ADR-0006-data-router-and-scroll-restoration-in-jsonpagesengine.md): if the engine adopts a **data router + `ScrollRestoration`** internally, this optional slot may remain for **custom** behavior only, or be narrowed/superseded — decide when ADR-0006 is implemented.

## References

- [ADR-0006 — Data router + `ScrollRestoration` in `JsonPagesEngine` (Proposed)](./ADR-0006-data-router-and-scroll-restoration-in-jsonpagesengine.md) — primary path to browser-like scroll without tenant-only wiring.
- [ADR-0004 — Scroll restoration in `JsonPagesEngine` (Deprecated)](./ADR-0004-scroll-restoration-in-json-pages-engine.md)
- [`docs/ideas/opt-in-router-slot-zero-impact.md`](../ideas/opt-in-router-slot-zero-impact.md)
- React Router: [Picking a router](https://reactrouter.com/v6/routers/picking-a-router) — data router vs `BrowserRouter`.
- `packages/core/src/runtime/engine/JsonPagesEngine.tsx`
- `packages/core/src/contract/types-engine.ts` — `JsonPagesConfig`
