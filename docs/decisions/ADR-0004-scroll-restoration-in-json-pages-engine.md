# ADR-0004: Scroll restoration in `JsonPagesEngine` via React Router `ScrollRestoration`

**Status:** Deprecated — implementation reverted (2026-05-04). `ScrollRestoration` was removed from `JsonPagesEngine` after it caused regressions across routes/admin behavior; do not re-add without a scoped fix.

**Date:** 2026-05-04  
**Scope:** `packages/core` — `JsonPagesEngine` (`BrowserRouter` shell)

---

## Context

The visitor shell is rendered by `@olonjs/core` inside `BrowserRouter` (`JsonPagesEngine.tsx`). Tenant apps compose pages with `Link` / client-side navigation (`react-router-dom`). Unlike a full document load, **SPA navigations do not reset the viewport scroll position** by default. Users who follow a link from deep in a long page arrive on the next route **still scrolled to the previous offset**, which feels broken compared to traditional multi-page navigation.

Scroll behavior must live **inside the same React Router tree** as `Routes`. Tenants mount only `<JsonPagesEngine />` from `App.tsx`; they cannot render router-aware scroll helpers outside the engine without duplicating the router or forking the shell.

## Decision

The core engine **renders `<ScrollRestoration />`** from `react-router-dom` as an immediate child of `<BrowserRouter>` in `JsonPagesEngine`, **before** `<Routes>`.

This delegates scroll semantics to React Router’s supported primitive: **emulate browser-like scroll restoration on location changes**, including sensible interaction with the history stack (e.g. **restoring position on back/forward** where applicable), rather than a naive always–scroll-to-top effect implemented ad hoc in tenants.

Implementation reference: `packages/core/src/runtime/engine/JsonPagesEngine.tsx` — import `ScrollRestoration` alongside `BrowserRouter`, `Route`, `Routes`; mount `<ScrollRestoration />` once per shell.

## Alternatives Considered

### A — Tenant-only `useEffect` + `window.scrollTo(0, 0)` on pathname change

- **Pros:** No core change; tenant controls behavior.
- **Cons:** Fails structurally: tenant `App` is **outside** `BrowserRouter`; hooks like `useLocation` are invalid there. Duplicating `BrowserRouter` in the tenant is not acceptable.
- **Rejected.**

### B — Core adds a custom `useLayoutEffect` that always scrolls to `(0, 0)` on every navigation

- **Pros:** Predictable “new page starts at top” for push navigations.
- **Cons:** Loses **history-aligned** scroll restoration on pop navigations unless reimplemented; duplicates logic React Router already exposes.
- **Rejected** in favor of `ScrollRestoration`.

### C — Do nothing; accept broken scroll UX

- **Rejected:** harms all tenants and contradicts visitor-quality expectations for a production shell.

## Consequences

- **Consumers:** Any tenant on a `@olonjs/core` release that includes this change gets corrected scroll behavior **without** tenant code changes.
- **Release:** The behavior ships with **core**; tenants must upgrade `@olonjs/core` (or use a linked local build) to pick it up.
- **Admin / preview routes:** `ScrollRestoration` is mounted once under the same `BrowserRouter` that serves `/`, `/admin`, and `/admin/preview`; navigations within those areas follow the same restoration rules. If a future route needs **opt-out** (e.g. preserve scroll in a specific studio panel), use React Router’s documented escape hatches (`preventScrollReset` on `Link`, etc.) rather than removing global restoration.
- **Testing:** Verify in real browsers: long page → in-app link → new page starts at top; back button returns with scroll position restored where the router model allows it.

## References

- React Router: [`ScrollRestoration`](https://reactrouter.com/en/main/components/scroll-restoration) (react-router-dom ≥ 6.4 API surface).
- OlonJS tenant shell: `JsonPagesEngine` is the composition root for visitor routing (see package `packages/core`).
