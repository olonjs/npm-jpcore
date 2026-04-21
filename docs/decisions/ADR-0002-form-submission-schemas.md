# ADR-0002: Declarative form submission schemas in OlonJS core

## Status

Accepted

## Date

2026-04-21

## Context

OlonJS tenants increasingly need to be operable by AI agents over MCP, not just readable. The canonical agent workflow the platform is moving toward looks like this:

> User: "Claude, book a room."
> Agent: `read-content` on the page → discovers there is a contact/availability form → asks the user for exactly the fields the form requires → submits on the user's behalf.

For this to work deterministically (i.e. without scraping or guessing), the agent must obtain a **machine-readable schema of the submission fields** as a natural byproduct of reading the page. No separate `list-forms` tool, no out-of-band registry.

The current state of the code does **not** satisfy this:

- `@olonjs/core` publishes `OlonJsPageContract` via `buildPageContract` in `packages/core/src/contract/webmcp-contracts.ts`. It already includes `sectionSchemas`, but those are the Zod schemas describing **UI configuration** of each section (title, cta label, colors), not the fields a user fills in.
- Tenant section capsules (e.g. `src/components/contact-form/` in a tenant app) express their submission fields **only as JSX in `View.tsx`**. The `schema.ts` of the same capsule describes the UI configuration, not the submission payload.
- On the platform side, `POST /api/v1/forms/submit` is schema-agnostic: it accepts an arbitrary JSON body, flattens it, and routes it to Resend and Supabase. It has no concept of a section contract.

Net result: an agent connected to a tenant via MCP cannot know which fields a form expects, cannot validate before submitting, and cannot reliably drive a conversational form-filling flow. Any solution that lives only on the platform side or only inside a tenant fails — the contract has to be carried end-to-end, from tenant section definition to the MCP payload the agent sees.

Related files that constrain the design:

- `packages/core/src/contract/webmcp-contracts.ts` — defines `OlonJsPageContract`, `buildPageContract`, and the `zodToJsonSchema` utility already used for `sectionSchemas`.
- `packages/core/src/contract/types-engine.ts` — defines `JsonPagesConfig`, the tenant's central configuration object, currently exposing a `schemas` registry for UI configuration.
- The platform-side `submit-form` MCP tool (to be introduced, tracked separately in `jsonpages-platform`) will consume the schema produced by core.

## Decision

OlonJS core gains a **parallel, opt-in registry of submission schemas** that is carried through the existing page contract pipeline. The registry is additive: no existing tenant breaks, no existing consumer of the contract breaks.

The decision has five facets:

1. **Additive, not breaking.** The new surface lives next to the existing `schemas` / `sectionSchemas`. No renames. No removals. `JsonPagesConfig.schemas` and `OlonJsPageContract.sectionSchemas` keep their current meaning (UI configuration). Tenants that do nothing keep working.

2. **Separate `submissionSchemas` registry, not nested.** Submission schemas live in a dedicated `JsonPagesConfig.submissionSchemas?: Record<string, z.ZodTypeAny>` map, keyed by section type (same key space as `schemas`). They are **not** nested inside the existing UI-config Zod objects. Nesting would mix two concerns (how the section is configured vs. what a user submits) and would force a Zod-shape change on every existing section.

3. **Reuse `zodToJsonSchema` for serialization.** The page contract emits `OlonJsPageContract.sectionSubmissionSchemas?: Record<string, Record<string, unknown>>` produced by the same `zodToJsonSchema` utility already used for `sectionSchemas`. One serializer, one JSON Schema dialect, one mental model for consumers.

4. **Page-scoped emission.** `buildPageContract` only emits keys for section types that (a) actually appear on the page **and** (b) have a registered `submissionSchema`. Agents reading the page contract therefore see submission schemas exactly for the forms that exist on that page, and nothing else. No global manifest bloat, no schemas for sections the agent cannot reach from the current page.

5. **Tenant convention documented as spec, enforced by types.** Sections that want to be agent-fillable export a single Zod object from their capsule, by convention. The convention is documented in `packages/core/README.md` and referenced from the tenant template(s). Types (`z.ZodTypeAny`) enforce that the value is a Zod schema; the registry `Record<string, z.ZodTypeAny>` enforces that entries are keyed by section type. Core does not introspect capsule folders — registration is explicit in the tenant's `JsonPagesConfig`.

### The tenant convention

A section that wants to be submittable by an agent MUST:

1. Export a `submissionSchema` from its capsule's schema module, e.g.:

   ```ts
   // src/components/contact-form/schema.ts
   import { z } from "zod";

   export const ContactFormSchema = z.object({
     // ...existing UI configuration schema (title, submitLabel, ...)
   });

   export const ContactFormSubmissionSchema = z.object({
     name: z.string().min(1).describe("Full name"),
     email: z.string().email().describe("Email address"),
     checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Check-in date (ISO 8601, YYYY-MM-DD)"),
     guests: z.number().int().min(1).max(20).describe("Number of guests"),
     notes: z.string().max(1000).optional().describe("Additional notes"),
   });
   ```

2. Use `.describe("<human-readable label>")` on every field. These descriptions become the labels the agent shows the user when asking for input. Absence of `.describe` is a tenant lint error, not a runtime error.

3. Use ISO 8601 string types for temporal fields.
   - **Calendar dates** (no time, no timezone) MUST use `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)` — the `YYYY-MM-DD` form. This is the canonical shape for check-in / check-out, birthdays, event days, etc.
   - Fields that genuinely require time MUST use `z.string().datetime()` (ISO 8601 with time and offset).
   - Rationale: ISO is why these formats exist; agents, humans, and JSON serializers all speak it unambiguously. No locale-dependent date parsing anywhere in the pipeline.

4. Register the submission schema in the tenant's `JsonPagesConfig` under `submissionSchemas`, keyed by the same section type string used in the page model:

   ```ts
   // src/lib/schemas.ts
   export const SECTION_SUBMISSION_SCHEMAS = {
     "contact-form": ContactFormSubmissionSchema,
   } as const;

   // src/lib/config.ts
   const config: JsonPagesConfig = {
     schemas: SECTION_SCHEMAS,
     submissionSchemas: SECTION_SUBMISSION_SCHEMAS,
     // ...
   };
   ```

Sections that do not opt in are ignored. There is no inheritance, no default schema.

5. Expose a `recipientEmail` field in the section's **UI-config** schema (the one registered in `SECTION_SCHEMAS`), not in the submission schema:

   ```ts
   export const ContactFormSchema = BaseSectionData.extend({
     // ...display / configuration fields...
     email:          z.string().optional().describe("ui:text"),           // optional public display email
     recipientEmail: z.string().email().optional().describe("ui:text"),   // lead destination — consumed by MCP
   });
   ```

   Rules:
   - **The path is fixed.** The MCP gateway (platform, ADR-0001) reads the lead destination from exactly one path: `section.data.recipientEmail`. No alternative names (`email`, `contactEmail`, `mailTo`, …) are inspected.
   - **It belongs in the config schema, not the submission schema.** `recipientEmail` is tenant-owned configuration that travels with the page JSON. It MUST NOT appear in the `submissionSchema` — agents are never allowed to set it, and the gateway strips any `recipientEmail` key found in the agent's payload before forwarding.
   - **Display ≠ recipient.** Sections that already expose a public-facing `email` (shown on the page) keep it. Add `recipientEmail` alongside; both fields coexist. Only `recipientEmail` is consumed by the MCP submit-form flow.
   - **Opt-in, not required.** If a tenant declares a `submissionSchema` but never sets `recipientEmail` in the page JSON, the gateway forwards the submission without a recipient override and the downstream `/api/v1/forms/submit` endpoint falls back to its default behaviour. For MCP-submittable pages in production this field SHOULD be set.

See the mirror section "Tenant Convention — `data.recipientEmail`" in jsonpages-platform ADR-0001 for the platform-side consumer.

Core does **not** ship a `defineSubmissionSchema(...)` helper. Tenants use `z.object({...})` directly. If `.describe` omissions or other convention violations turn out to be a recurring tenant mistake, a helper can be added later behind a new ADR — but the default is the smaller API surface.

## Alternatives Considered

### Option A — Nest the submission schema inside the existing UI-config Zod object

- **Pros:** Single schema per section; no second registry.
- **Cons:** Mixes two concerns (how the section is configured by the tenant author vs. what a user submits). Forces a Zod-shape change on every existing section. Makes it harder to serve the UI configuration and the submission contract to different audiences (Studio / ICE vs. MCP agents).
- **Rejected because:** the two schemas have different authors (developer vs. end user), different lifecycles (config is authored once, submissions happen continuously), and different consumers (Studio vs. agents). Collapsing them is convenient short-term and costly long-term.

### Option B — Define submission schemas on the platform side only

- **Pros:** No change to `@olonjs/core`. Platform owns the contract.
- **Cons:** The schema lives far away from the section that implements the form. Tenants can drift (rename a field in JSX, forget to update platform). The agent cannot discover the schema by reading the page — it has to call a separate platform tool that is not tenant-scoped in the same way.
- **Rejected because:** the point of the feature is exactly that the schema *emerges from `read-content`*. Keeping the schema out of the page contract defeats the discovery property.

### Option C — Make submission schemas mandatory for all sections

- **Pros:** Uniform contract; no "invisible forms".
- **Cons:** Breaks every existing tenant immediately. Most sections (hero, gallery, footer) have no meaningful submission surface. Forces tenants to write `z.never()` stubs.
- **Rejected because:** the feature is orthogonal to most sections. A section should declare a submission schema only if it actually accepts user input.

### Option D — Infer the submission schema from form markup in `View.tsx`

- **Pros:** No convention for tenants to remember.
- **Cons:** Requires build-time AST analysis of JSX; produces untyped, imprecise schemas (no constraints like `min`, no enums, no descriptions); couples the contract to presentation. An agent asking "is this field required?" gets a guess.
- **Rejected because:** the whole reason we have Zod in this stack is to avoid inferring contracts from markup.

### Option E — Publish submission schemas via a separate `list-forms` MCP tool

- **Pros:** Decouples the contract from the page contract.
- **Cons:** Forces the agent to make an extra round trip, to know that `list-forms` exists, and to reconcile results with the current page. Breaks the "contract emerges from reading the page" property that the rest of OlonJS already delivers for UI config.
- **Rejected because:** OlonJS's thesis is that the page contract is the deterministic interface. Adding a parallel discovery surface for one specific capability contradicts that thesis.

## Consequences

### Positive

- Agents reading the page contract discover submission schemas for the forms on that page, with no extra tool calls.
- Tenants express the submission contract once, in the place where the form is implemented. The contract is type-checked at tenant build time.
- The platform's `submit-form` MCP tool (owned by `jsonpages-platform`) has a typed, versioned target to validate against.
- No existing tenant or consumer of `OlonJsPageContract` breaks.

### Negative (accepted)

- Tenants that want agent-fillable forms now have two schemas per form-capable section (UI config + submission). This is the cost of separating the two concerns; Option A would have avoided it by collapsing concerns we want to keep separate.
- `buildPageContract` does marginally more work per page (one extra `zodToJsonSchema` call per form section actually present on the page). Acceptable: JSON Schema generation is cheap and cached at build time.

### Requirements imposed

- **On `@olonjs/core`:** extend `JsonPagesConfig` and `OlonJsPageContract`; update `buildPageContract` and its callers; document the convention in `packages/core/README.md`.
- **On tenants that want agent-fillable forms:** follow the convention above. Tenants that do not opt in are unaffected.
- **On `jsonpages-platform`:** the future `submit-form` MCP tool must consume `sectionSubmissionSchemas` from the page contract and validate incoming payloads against it before delegating to the existing `POST /api/v1/forms/submit` pipeline. Out of scope for this ADR; tracked separately.
- **On DNA templates (`apps/tenant-alpha`):** the reference `contact-form` section should ship with a `submissionSchema` to demonstrate the convention.

## Follow-ups

- [ ] Implement `submissionSchemas` on `JsonPagesConfig` and `OlonJsPageContract`.
- [ ] Wire `buildPageContract` emission with page-scoped filtering (facet 4 above).
- [ ] Document the tenant convention in `packages/core/README.md` with a full end-to-end example.
- [ ] Add a `submissionSchema` to the reference `contact-form` section in `apps/tenant-alpha`.
- [ ] Cross-link this ADR from `README.md` → Documentation Index once `docs/decisions/` has more than one ADR.
- [ ] Track the platform-side `submit-form` MCP tool in `jsonpages-platform` as a separate ADR in that repo.

## Decision log

All refinements to the tenant convention are recorded here in place so the ADR stays the single source of truth (no silent drift between the spec and reality).

### 2026-04-21 — ADR accepted

Initial draft of the five-facet decision and the tenant convention.

### 2026-04-21 — Date field convention resolved

**Resolved:** ISO 8601 is the mandatory format for temporal fields. Calendar dates use `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`; datetime fields use `z.string().datetime()`. See point 3 of the tenant convention.

**Rationale:** ISO 8601 is the whole reason these formats exist. Using it end-to-end eliminates locale-dependent parsing from tenants, from the page contract, and from any agent consuming the contract.

### 2026-04-21 — Helper export resolved

**Resolved:** No `defineSubmissionSchema(...)` helper is shipped by core. Tenants compose with `z.object({...})` directly.

**Rationale:** Minimal API surface. A helper can be introduced by a future ADR if tenant mistakes (missing `.describe`, wrong date shapes) become a measurable pain point in practice. Speculative DX is not a reason to expand the public surface of `@olonjs/core`.

### 2026-04-21 — Type signature aligned with existing `schemas` duck typing (Slice 1 refinement)

**Context.** Earlier drafts of this ADR (facet 2 of the Decision) specified `submissionSchemas?: Record<string, z.ZodTypeAny>`. During Slice 1 implementation we observed that the sibling field `JsonPagesConfig.schemas` is duck-typed as `Record<string, { parse: (v: unknown) => unknown; shape?: Record<string, unknown> }>`, not `Record<string, z.ZodTypeAny>`. The serializer in `webmcp-contracts.ts` casts to `z.ZodTypeAny` at its own boundary (line 386 at the time of writing). This is an intentional architectural convention: the package accepts Zod via duck typing so it does not force `zod` as a hard dependency on consumers at the type level.

**Resolved:** `JsonPagesConfig.submissionSchemas` uses the same duck-typed shape as `schemas`:

```ts
submissionSchemas?: Record<string, { parse: (v: unknown) => unknown; shape?: Record<string, unknown> }>;
```

The serializer (Slice 2) will cast to `z.ZodTypeAny` at the emission boundary, exactly as the existing `schemas`-to-JSON-Schema path does.

**Why this is a refinement, not a change of decision.** Facet 2 of the Decision is *"separate registry, not nested"*. That still holds. The literal type signature in the earlier draft was a specification detail; aligning it with the package's existing convention preserves architectural symmetry and avoids a pointlessly narrower contract for the new field than for the old one. The effective API that tenants write (pass a `z.object(...)`) is unchanged.

### 2026-04-21 — `data.recipientEmail` made explicit (mirror of ADR-0001)

**Context.** The platform-side ADR (jsonpages-platform ADR-0001) already specifies that the MCP `submit-form` gateway resolves the lead destination from `section.data.recipientEmail`. The reciprocal tenant-side convention was implicit in this ADR but not spelled out. Santamamma26 integration exposed the gap: the tenant used `data.email` as the lead destination (legacy), which is not what the gateway reads.

**Resolved:** Added point 5 to "The tenant convention" section:

- Section-config schemas (`SECTION_SCHEMAS` entries) for MCP-submittable sections MUST expose a `recipientEmail` field.
- The field lives in the UI-config schema (tenant-owned configuration), never in the submission schema (agent-provided payload).
- The gateway reads exactly `section.data.recipientEmail`; no alternative field names are recognised.
- Display emails (a public `email` field shown on the rendered page) may coexist; only `recipientEmail` drives MCP lead routing.

**Rationale.** Having one canonical path eliminates ambiguity for tenants ("where do I put the address?") and prevents agents from redirecting leads to arbitrary inboxes. The separation between display email and operational recipient email is also cleaner architecture: tenant owners who want to hide the recipient from page visitors can do so without losing MCP functionality.

## References

- Plan: *Implementation Plan: OlonJS Form Submission Schema (Core)* (in-session; to be committed under `docs/plans/` during implementation).
- Source files that change: `packages/core/src/contract/webmcp-contracts.ts`, `packages/core/src/contract/types-engine.ts`, `packages/core/README.md`, `apps/tenant-alpha/src/components/contact-form/schema.ts`.
- Platform-side counterpart (separate concern): `jsonpages-platform/src/lib/mcpGatewayHandler.ts` — future `submit-form` tool.
