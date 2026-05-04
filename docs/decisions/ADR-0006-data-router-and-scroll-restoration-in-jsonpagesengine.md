# ADR-0006: Migrate `JsonPagesEngine` to a React Router data router with `ScrollRestoration`

## Status

Proposed — pending implementation, QA matrix, and maintainer acceptance (2026-05-04)

## Date

2026-05-04

## Scope

`@olonjs/core` — `JsonPagesEngine` (`packages/core/src/runtime/engine/JsonPagesEngine.tsx`), React Router (`react-router-dom`), shell routing for visitor + `/admin` + `/admin/preview`.

## Context

Users expect **browser-like scroll semantics** on an SPA: navigating forward opens content **from the top**; **Back** / **Forward** returns to the **same scroll offset** as before. React Router’s `<ScrollRestoration />` implements that model when used with a **data router** (`createBrowserRouter`, `<RouterProvider />`). It is **not** supported under `<BrowserRouter />`; mounting `<ScrollRestoration />` there caused runtime failures and was reverted ([ADR-0004](./ADR-0004-scroll-restoration-in-json-pages-engine.md)).

[ADR-0005](./ADR-0005-optional-inside-router-slot-for-tenant-scroll-ux.md) commits to an **additive**, tenant-opt-in `ReactNode` slot inside the router for custom scroll helpers. That avoids breaking defaults but **does not**, by itself, deliver full history-aligned restoration unless the tenant reimplements it.

We still need a **first-class** core solution that matches normal browsing expectations **without** requiring every tenant to pass extra configuration for baseline UX.

**Tenant impact constraint:** Downstream repos typically render `<JsonPagesEngine config={…} />` only. Any routing change should remain an **implementation detail** of `@olonjs/core` as long as the **public** `JsonPagesEngine` / `JsonPagesConfig` contract and URL surface stay equivalent.

## Decision

1. **Refactor the engine shell** from `<BrowserRouter>` + `<Routes>` to a **data router** created with `createBrowserRouter` (or equivalent supported API in the locked `react-router-dom` major), and render it via `<RouterProvider />` **inside** the same provider tree the engine already uses today (`EngineErrorBoundary`, `IconRegistryContext`, `ConfigProvider`, etc. — order and boundaries to be verified in implementation).

2. **Mount `<ScrollRestoration />`** in the **supported** position for that router (sibling to the route tree as per React Router docs for the data-router model), so **forward navigation** and **history back/forward** get **restoration behavior** consistent with the framework, without reintroducing the ADR-0004 mistake.

3. **Preserve the public integration surface:** consumers that only import `JsonPagesEngine` and pass a valid `JsonPagesConfig` require **no code changes** to adopt the release. `basename` and the set of logical routes (`/`, catch-all visitor, `/admin`, `/admin/*`, `/admin/preview`, `*`) must behave the same at the URL level.

4. **Engineering cost is accepted in core:** this is a **larger** change than the ADR-0005 slot; it is justified by product-quality scroll/history UX and by using supported APIs.

## Alternatives Considered

### A — Rely only on [ADR-0005](./ADR-0005-optional-inside-router-slot-for-tenant-scroll-ux.md) (tenant passes `ScrollToTop` or custom node)

- **Pros:** Smallest API change; zero default behavior change.
- **Cons:** “Normal” scroll + back/forward restoration is not the default; every tenant that wants parity must wire custom logic.
- **Rejected** as the **sole** long-term answer to browser-like scroll, not as an optional extension (see below).

### B — `useLayoutEffect` + `scrollTo(0,0)` on pathname only inside `BrowserRouter`

- **Pros:** Simple; no router migration.
- **Cons:** Does **not** restore offset on **Back**; diverges from expected browser semantics.
- **Rejected** as the complete solution (may still be useful for narrow cases).

### C — Status quo (`BrowserRouter` only, no restoration)

- **Rejected:** Leaves known UX debt for all tenants.

## Consequences

- **Tenants (typical):** **No mandatory source changes** if they only use the published `JsonPagesEngine` API; they upgrade `@olonjs/core` and re-verify behavior.
- **Semver:** Likely a **minor** (internal routing refactor + behavior improvement) unless unintended breaking surface is discovered — evaluate during implementation.
- **Risk areas:** Subtle differences in data-router vs `BrowserRouter` (error boundaries, future flags, timing), `/admin` and preview routes, `basename`, and any code that assumed the old tree shape. Mitigation: explicit QA checklist and regression passes on at least one reference tenant.
- **Relationship to ADR-0005:** If this ADR is **Accepted** and shipped, the optional `JsonPagesConfig` slot from ADR-0005 may remain useful for **non-scroll** extensions or be **superseded** for scroll-only use cases — decide in implementation (do not maintain two competing scroll mechanisms without clear docs).

## Follow-ups

- [ ] Spike: reproduce current route table as `createBrowserRouter` routes with identical elements and props drilling.
- [ ] Confirm provider order: `ConfigProvider` / router context available everywhere current code expects.
- [ ] Manual QA: visitor long page → link → top; **Back** → prior offset; `/admin` navigations; preview route.
- [ ] Decide whether ADR-0005’s optional field still ships, ships trimmed, or is withdrawn if redundant.

## Open Points

- Exact React Router version capabilities and any `future` flags already in use.
- Whether scroll restoration should be **disabled** or customized for specific branches (e.g. studio only) via React Router escape hatches (`preventScrollReset`, etc.).

## References

- [ADR-0004 — Scroll restoration in `JsonPagesEngine` (Deprecated)](./ADR-0004-scroll-restoration-in-json-pages-engine.md)
- [ADR-0005 — Optional inside-router slot](./ADR-0005-optional-inside-router-slot-for-tenant-scroll-ux.md)
- React Router: [Picking a router](https://reactrouter.com/v6/routers/picking-a-router), [`ScrollRestoration`](https://reactrouter.com/en/main/components/scroll-restoration)
- `packages/core/src/runtime/engine/JsonPagesEngine.tsx`
