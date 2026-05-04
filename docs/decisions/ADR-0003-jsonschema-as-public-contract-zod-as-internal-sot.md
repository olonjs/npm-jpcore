# ADR-0003: JSON Schema as public contract, Zod as internal source of truth

**Status:** Accepted
**Date:** 2026-05-03
**Deciders:** Guido Filippo Serio
**Related:** ADR-0001 (remove siteConfig.pages), ADR-0002 (form submission schemas)

---

## Context

Olon is positioned as "the contract layer for the agentic web". The promise to consumers — AI agents, third-party integrators, multi-language tenants — is that any Olon site exposes a typed, deterministic contract that is **language-agnostic, versioned, and citable**.

Today, the source of truth (SOT) for all section contracts and page-level schemas inside `@olonjs/core` is Zod. JSON Schema artifacts are **emitted at build time** via `zodToJsonSchema` and are surfaced inside page contracts (`sectionSchemas`, `sectionSubmissionSchemas`) and the published manifests.

A first standalone JSON Schema has been published as a public artifact at:

```
https://olon.js.org/schemas/v1/design.schema.json
```

This file is hand-authored and reviewed: it is the canonical declaration of the Olon design system contract. It is referenced by tooling, by the Olon AI tenant generation pipeline, and (in roadmap) by integrators in any language.

The architectural question this ADR resolves: **what is the source of truth for the rest of the Olon contracts (page, menu, site, tenant, section-submission), and how do we publish them?**

Three approaches were considered:

### Option A — Zod is SOT, JSON Schema is a build-time derivative

- Zod schemas in `@olonjs/core` remain the only place contracts are authored.
- A build script emits JSON Schema files from Zod via `zodToJsonSchema`.
- Published JSON Schemas at `olon.js.org/schemas/v1/` are derivatives of the Zod source and are regenerated on every release.

### Option B — JSON Schema is SOT, Zod is generated authoring layer

- Hand-authored JSON Schema files in `olon.js.org/schemas/v1/` are the canonical contract.
- Zod (and any other authoring layer — Pydantic, Go structs, etc.) is generated from JSON Schema via tooling like `json-schema-to-zod`.
- Multi-language is first-class: each language gets a generated authoring layer from the same source.

### Option C — JSON Schema is SOT + cross-language conformance test suite

- Same as B, plus an enforced conformance test suite that validates every authoring layer (Zod for TS, Pydantic for Python, gojsonschema for Go) against the same canonical JSON Schema and the same set of example fixtures.
- All authoring layers must produce **bit-identical** validation results on the same input.
- This is the form mature open standards take (W3C HTML test suite, WebAssembly conformance suite, TC39 test262).

## Decision

**Adopt Option A for v1.x: Zod remains the internal source of truth. JSON Schema artifacts are derived at build time via `zodToJsonSchema`, manually reviewed for clarity, and published as the public contract surface at `https://olon.js.org/schemas/v1/<name>.schema.json`.**

Once published, a JSON Schema artifact is the public contract — it is what external consumers read, validate against, and cite via `$id` and `$ref`. Internally, Zod remains how Olon authors and evolves the schema. The two stay aligned because the JSON Schema is regenerated and verified on every build.

**Roadmap to Option C (multi-language with conformance):**

- v1.x — current. Zod SOT, JSON Schema published as derivative. Reviewed manually. Single authoring layer (TypeScript).
- v1.x.+ — second authoring layer added (Python via Pydantic, generated from `olon.js.org/schemas/v1/`). Single source of truth still Zod; Pydantic is derived from JSON Schema, which is derived from Zod. Acceptable indirection for early proof of multi-language.
- v2.0 — flip the source of truth. JSON Schema becomes hand-authored canonical. Zod becomes a generated authoring layer alongside Pydantic, Go, etc. Conformance test suite enforces bit-identical behavior across all authoring layers on a shared corpus of example fixtures.

The trigger for shipping the v2.0 conformance suite is **the first enterprise customer requirement that explicitly demands cross-language behavioral guarantees**. Until then, the v1.x approach with manual review is sufficient.

## Architecture decisions

### AD-1: Published JSON Schema artifacts are the public contract

The contract Olon promises to the world is JSON Schema, not Zod. Once an artifact is published at `olon.js.org/schemas/v1/<name>.schema.json`, it is the citable, versioned, language-agnostic contract. All public claims about Olon (positioning, marketing, technical docs) refer to JSON Schema as the contract layer.

### AD-2: Zod is the v1.x source of truth

For v1.x, Zod schemas in `@olonjs/core` are the single place contracts are authored and modified. Changes flow Zod → `zodToJsonSchema` → published `.schema.json` files. This preserves TypeScript ergonomics for the dominant authoring path.

### AD-3: Build-time emission with manual review gate

JSON Schema files are regenerated on every `npm run build:schemas`. Before any schema is published or version-bumped, the output is **manually reviewed**. If the auto-generated JSON Schema is verbose, semantically off, or harder to read than necessary, the **Zod source is fixed**, not the JSON output. This keeps the two layers consistent and ensures the public artifact stays clean.

### AD-4: Versioning is in the URL path, not the file name

Schemas are versioned by URL path segment (`v1`, `v2`), not by filename suffix. Once a schema is published under `v1`, it is **frozen** within `v1`. Breaking changes increment the path segment. Backward-compatible additions can be made within `v1`. This matches the pattern already established by `design.schema.json` and is the same convention used by every major versioned web spec.

### AD-5: Five canonical schemas in v1

The v1 contract surface consists of:

- `design.schema.json` — design system tokens (already published, hand-authored)
- `page.schema.json` — page contract with sections and submission schemas
- `menu.schema.json` — navigation menu structure
- `site.schema.json` — site-wide configuration (header, footer, identity)
- `tenant.schema.json` — top-level tenant manifest referencing the four above

These five schemas are the complete declaration of an Olon tenant. Any additional schema (e.g., `section-submission.schema.json` as a standalone artifact) is a refinement, not a new layer.

### AD-6: Roadmap to JSON Schema as SOT is dictated by enterprise requirement, not by technical preference

Flipping the source of truth from Zod to JSON Schema is a meaningful refactor and only adds value when **multiple authoring layers exist and consistency between them must be guaranteed**. Until that need is real and named by a customer, v1.x with Zod SOT remains the operational mode.

## Alternatives considered

### Alternative — Skip publishing public schemas, stay Zod-only

Rejected. Olon is positioned publicly as a contract layer. Without published, citable JSON Schema artifacts, the claim is not verifiable by external integrators, and the moat against TypeScript-bound competitors disappears.

### Alternative — Hand-author all JSON Schemas from day one (Option B immediately)

Rejected for v1.x. The cost of maintaining hand-authored JSON Schema for page/menu/site/tenant in parallel with Zod, without yet having a second authoring layer to justify the rigor, is too high relative to the value. v1.x ships faster with Zod SOT.

### Alternative — Skip Zod entirely, author everything in JSON Schema

Rejected. TypeScript ergonomics from Zod inference are too valuable for solo founder velocity and for third-party developer adoption inside the JS/TS ecosystem. The JS/TS ecosystem is the wedge audience and Zod is the established authoring tool there.

### Alternative — Replace Zod with an alternative TS validator (Valibot, ArkType)

Considered and deferred. None of the alternatives offer enough advantage today to justify migration cost. If the broader TS ecosystem shifts decisively to one of them, this can be revisited as a separate ADR. The contract layer (JSON Schema) is unaffected by which TS authoring tool is chosen internally.

### Alternative — Ship conformance test suite (Option C) immediately

Rejected for v1.x. Conformance suite has high infrastructure cost (4–6 weeks) and provides no value until at least two authoring layers exist. Roadmap entry, not v1.x scope.

## Consequences

### Positive

- Public contract surface becomes citable and language-agnostic. External integrators can validate JSON conforming to Olon contracts in any language using standard JSON Schema tooling.
- The architectural distinction between **contract** (JSON Schema, public, versioned) and **authoring** (Zod, internal, evolving) is established. This distinction is the foundation for multi-language expansion.
- Marketing and positioning claims about "contract layer for the agentic web" become technically grounded, not aspirational.
- DESIGN.md by Google Labs, which uses markdown + YAML as its authoring/contract format, sits at one level. Olon at another level: JSON Schema as canonical, Zod as one of N authoring layers. The architectural separation differentiates the projects without overlapping.

### Negative

- Two layers must stay in sync. Build pipeline must regenerate JSON Schema on every Zod change. Drift is possible if review gate is skipped.
- `zodToJsonSchema` output is sometimes verbose or semantically off. Manual review and Zod source fixes are required, adding work to each schema modification.
- Switching SOT direction in v2.0 will be a breaking internal refactor.

### Neutral

- Publishing the schemas requires a deployment path from `@olonjs/core/dist/schemas/v1/` to the `olon.js.org` host. Mechanism is to be implemented by the deployment pipeline maintaining `olon.js.org`.

## Implementation outline

1. Create `packages/core/src/contract/zod-schemas.ts` exporting top-level Zod schemas (`PageContractSchema`, `MenuConfigSchema`, `SiteConfigSchema`, `TenantManifestSchema`) as standalone reusable objects.
2. Add `packages/core/scripts/build-public-schemas.mjs` that converts each Zod schema to JSON Schema with canonical metadata (`$id`, `$schema`, `title`, `description`, `examples`).
3. Add `npm run build:schemas` script and wire it into `npm run build`.
4. First run produces draft JSON Schemas. Manually review each output, fix Zod source where necessary, regenerate.
5. Deploy generated `.schema.json` files to `olon.js.org/schemas/v1/`.
6. Update `olon.it` resources page and footer to link the four new schemas alongside the existing design schema.
7. Document the contract surface (JSON Schema) and authoring path (Zod) on `olon.it/resources` and in `@olonjs/core/README.md`.

## Follow-ups

- ADR-0004 (future): second authoring layer in Python via Pydantic, generated from `olon.js.org/schemas/v1/` artifacts.
- ADR-0005 (future, v2.0): flip source of truth from Zod to JSON Schema, introduce conformance test suite across authoring layers. Trigger: first enterprise customer requirement for cross-language strict consistency.
- Versioning policy document: define what counts as a breaking change requiring `v2`, vs. an additive change permitted within `v1`.
- Deprecation policy document: when, how, and for how long old schema versions remain published after a `vN+1` release.

## References

- `olon.js.org/schemas/v1/design.schema.json` — first canonical Olon JSON Schema, hand-authored, published.
- ADR-0001 in `@olonjs/core/docs/decisions/` — remove siteConfig.pages.
- ADR-0002 in `@olonjs/core/docs/decisions/` — form submission schemas.
- `@olonjs/core/src/contract/webmcp-contracts.ts` — current emission point for `sectionSchemas` and `sectionSubmissionSchemas`.
- JSON Schema draft-07 specification — the standard the Olon contract layer adopts.
- `zod-to-json-schema` library — current conversion path from Zod to JSON Schema.
