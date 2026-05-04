# Opt-in “inside router” slot — zero default impact on tenants

> Idea refinement (idea-refine). **Normative decision:** [ADR-0005 — Optional inside-router slot](../decisions/ADR-0005-optional-inside-router-slot-for-tenant-scroll-ux.md). This note stays as background; do not contradict the ADR.

Addresses SPA scroll UX **without** repeating the `ScrollRestoration` + `BrowserRouter` failure mode documented in [ADR-0004](../decisions/ADR-0004-scroll-restoration-in-json-pages-engine.md) (deprecated).

## Problem Statement

**How might we** let a single tenant improve post-navigation UX (e.g. scroll to top on route change) **without** changing runtime behavior for every other site that depends on `@olonjs/core`?

**Constraint:** “Zero impact on existing tenants” means **no observable change** unless a tenant **explicitly opts in** — same defaults, no forced upgrade semantics.

## Recommended Direction

Introduce **one optional extension point** on `JsonPagesConfig`, for example:

- `insideRouterSlot?: React.ReactNode` — rendered **inside** `BrowserRouter`, adjacent to `Routes`, default **`undefined`**.

Tenants that omit it behave **exactly** as today (no new nodes, no new effects).

Tenants that want scroll-to-top mount a **small component in their own repo** that uses `useLocation` + `useLayoutEffect` + `window.scrollTo(0, 0)` (and optional hash handling). **Do not** use React Router’s `<ScrollRestoration />` under `BrowserRouter`: it relies on **data router** context (`RouterProvider` / `createBrowserRouter`) and throws at runtime (`useScrollRestoration must be used within a data router`).

This is **additive-only** core API (semver **minor**), with blast radius limited to tenants that pass the slot.

## Key Assumptions to Validate

- [ ] Maintainers accept a **minor** `@olonjs/core` release for an additive config field.
- [ ] Single insertion point does not break `/admin`, `/admin/preview`, or focus management — placement and docs matter.
- [ ] Slot content is **lightweight** (scroll manager, analytics beacon); discourage heavy trees without profiling.

## MVP Scope

- Types + one conditional render in `JsonPagesEngine`: `{config.insideRouterSlot ?? null}` inside `BrowserRouter`.
- Reference tenant implementation: ~15-line `ScrollToTopOnRoute` component (tenant package, not core).
- Manual QA matrix: **without** slot = parity with current release; **with** slot = scroll resets on in-app navigation.

## Not Doing (and Why)

| Item | Why |
|------|-----|
| Global `<ScrollRestoration />` in core | Incompatible with current `BrowserRouter` shell; broke production ([ADR-0004](../decisions/ADR-0004-scroll-restoration-in-json-pages-engine.md)). |
| Migrating the whole shell to `createBrowserRouter` **just** for scroll | Huge refactor; affects every tenant and release cadence. |
| Default-on scroll behavior | Violates zero-impact requirement for existing deployments. |
| Tenant-only `useEffect` in `App.tsx` outside the router | Cannot access `useLocation`; structurally insufficient for SPA scroll fixes. |

## Open Questions

- Public name for the API (`insideRouterSlot` vs `routerShellExtras` vs `navigationSlot`).
- Whether to document this next to other shell extension points in `ARCHITECTURE.md`.
- Follow-up ADR: formalize **extension-point governance** so shell changes default to opt-in patterns.

## References

- [ADR-0004 — Scroll restoration in JsonPagesEngine (Deprecated)](../decisions/ADR-0004-scroll-restoration-in-json-pages-engine.md)
- React Router: [Picking a router](https://reactrouter.com/v6/routers/picking-a-router) — `ScrollRestoration` vs data routers.
