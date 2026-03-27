# 📐 OlonJS Architecture Specifications v1.5

**Status:** Mandatory Standard  
**Version:** 1.5.0 (Sovereign Core Edition — Architecture + Studio/ICE UX, Path-Deterministic Nested Editing, Deterministic Local Design Tokens, Three-Layer CSS Bridge Contract)  
**Target:** Senior Architects / AI Agents / Enterprise Governance  

**Scope v1.5:** This edition preserves the complete v1.3 architecture (MTRP, JSP, TBP, CIP, ECIP, JAP + Studio/ICE UX contract: IDAC, TOCC, BSDS, ASC, JEB + Tenant Type & Code-Generation Annex + strict path-based/nested-array behavior) as a **faithful superset**, and upgrades **Local Design Tokens** from a principle to a deterministic implementation contract.  
**Scope note (breaking):** In strict v1.3+ Studio semantics, the legacy flat protocol (`itemField` / `itemId`) is removed in favor of `itemPath` (root-to-leaf path segments).  
**Scope note (clarification):** In v1.5, `theme.json` is the tenant theme source of truth for themed tenants; runtime theme publication is mandatory for compliant themed tenants; section-local tokens (`--local-*`) are the required scoping layer for section-owned color and radius concerns.

---

## 1. 📐 Modular Type Registry Pattern (MTRP) v1.2

**Objective:** Establish a strictly typed, open-ended protocol for extending content data structures where the **Core Engine** is the orchestrator and the **Tenant** is the provider.

### 1.1 The Sovereign Dependency Inversion
The **Core** defines the empty `SectionDataRegistry`. The **Tenant** "injects" its specific definitions using **Module Augmentation**. This allows the Core to be distributed as a compiled NPM package while remaining aware of Tenant-specific types at compile-time.

### 1.2 Technical Implementation (`@olonjs/core/kernel`)
```typescript
export interface SectionDataRegistry {} // Augmented by Tenant
export interface SectionSettingsRegistry {} // Augmented by Tenant

export interface BaseSection<K extends keyof SectionDataRegistry> {
  id: string;
  type: K;
  data: SectionDataRegistry[K];
  settings?: K extends keyof SectionSettingsRegistry
    ? SectionSettingsRegistry[K]
    : BaseSectionSettings;
}

export type Section = {
  [K in keyof SectionDataRegistry]: BaseSection<K>
}[keyof SectionDataRegistry];
```

**SectionType:** Core exports (or Tenant infers) **`SectionType`** as **`keyof SectionDataRegistry`**. After Tenant module augmentation, this is the union of all section type keys (e.g. `'header' | 'footer' | 'hero' | ...`). The Tenant uses this type for the ComponentRegistry and SECTION_SCHEMAS keys.

**Perché servono:** Il Core deve poter renderizzare section senza conoscere i tipi concreti a compile-time; il Tenant deve poter aggiungere nuovi tipi senza modificare il Core. I registry vuoti + module augmentation permettono di distribuire Core come pacchetto NPM e mantenere type-safety end-to-end (Section, registry, config). Senza MTRP, ogni nuovo tipo richiederebbe cambi nel Core o tipi deboli (`any`).

---

## 2. 📐 JsonPages Site Protocol (JSP) v1.8

**Objective:** Define the deterministic file system and the **Sovereign Projection Engine** (CLI).

### 2.1 The File System Ontology (The Silo Contract)
Every site must reside in an isolated directory. Global Governance is physically separated from Local Content.
*   **`/config/site.json`** — Global Identity & Reserved System Blocks (Header/Footer). See Appendix A for typed shape.
*   **`/config/menu.json`** — Navigation Tree (SSOT for System Header). See Appendix A.
*   **`/config/theme.json`** — Theme tokens for themed tenants. See Appendix A.
*   **`/pages/[slug].json`** — Local Body Content per page. See Appendix A (PageConfig).

**Application path convention:** The runtime app typically imports these via an alias (e.g. **`@/data/config/`** and **`@/data/pages/`**). The physical silo may be `src/data/config/` and `src/data/pages/` so that `site.json`, `menu.json`, `theme.json` live under `src/data/config/`, and page JSONs under `src/data/pages/`. The CLI or projection script may use `/config/` and `/pages/` at repo root; the **contract** is that the app receives **siteConfig**, **menuConfig**, **themeConfig**, and **pages** as defined in JEB (§10) and Appendix A.

**Rule:** For a tenant that claims v1.5 design-token compliance, `theme.json` is not optional in practice. If a tenant omits a physical `theme.json`, it must still provide an equivalent `ThemeConfig` object before bootstrap; otherwise the tenant is outside full v1.5 theme compliance.

### 2.2 Deterministic Projection (CLI Workflow)
The CLI (`@olonjs/cli`) creates new tenants by:
1.  **Infra Projection:** Generating `package.json`, `tsconfig.json`, and `vite.config.ts` (The Shell).
2.  **Source Projection:** Executing a deterministic script (`src_tenant_alpha.sh`) to reconstruct the `src` folder (The DNA).
3.  **Dependency Resolution:** Enforcing specific versions of React, Radix, and Tailwind v4.

**Perché servono:** Una struttura file deterministica (config vs pages) separa governance globale (site, menu, theme) dal contenuto per pagina; il CLI può rigenerare tenant e tooling può trovare dati e schemi sempre negli stessi path. Senza JSP, ogni tenant sarebbe una struttura ad hoc e ingestione/export/Bake sarebbero fragili.

---

## 3. 🧱 Tenant Block Protocol (TBP) v1.0

**Objective:** Standardize the "Capsule" structure for components to enable automated ingestion (Pull) by the SaaS.

### 3.1 The Atomic Capsule Structure
Components are self-contained directories under **`src/components/<sectionType>/`**:
*   **`View.tsx`** — The pure React component (Dumb View). Props: see Appendix A (SectionComponentPropsMap).
*   **`schema.ts`** — Zod schema(s) for the **data** contract (and optionally **settings**). Exports at least one schema (e.g. `HeroSchema`) used as the **data** schema for that type. Must extend BaseSectionData (§8) for data; array items must extend BaseArrayItem (§8).
*   **`types.ts`** — TypeScript interfaces inferred from the schema (e.g. `HeroData`, `HeroSettings`). Export types with names **`<SectionType>Data`** and **`<SectionType>Settings`** (or equivalent) so the Tenant can aggregate them in a single types module.
*   **`index.ts`** — Public API: re-exports View, schema(s), and types.

### 3.2 Reserved System Types
*   **`type: 'header'`** — Reserved for `site.json`. Receives **`menu: MenuItem[]`** in addition to `data` and `settings`. Menu is sourced from `menu.json` (see Appendix A). The Tenant **must** type `SectionComponentPropsMap['header']` as `{ data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] }`.
*   **`type: 'footer'`** — Reserved for `site.json`. Props: `{ data: FooterData; settings?: FooterSettings }` only (no `menu`).
*   **`type: 'sectionHeader'`** — A standard local block. Must define its own `links` array in its local schema if used.

**Perché servono:** La capsula (View + schema + types + index) è l’unità di estensione: il Core e il Form Factory possono scoprire tipi e contratti per tipo senza convenzioni ad hoc. Header/footer riservati evitano conflitti tra globale e locale. Senza TBP, aggregazione di SECTION_SCHEMAS e registry sarebbe incoerente e l’ingestion da SaaS non sarebbe automatizzabile.

---

## 4. 🧱 Component Implementation Protocol (CIP) v1.6

**Objective:** Ensure system-wide stability and Admin UI integrity.

1.  **The "Sovereign View" Law:** Components receive `data` and `settings` (and `menu` for header only) and return JSX. They are metadata-blind (never import Zod schemas).
2.  **Z-Index Neutrality:** Components must not use `z-index > 1`. Layout delegation (sticky/fixed) is managed by the `SectionRenderer`.
3.  **Agnostic Asset Protocol:** Use `resolveAssetUrl(path, tenantId)` for all media. Resolved URLs are under **`/assets/...`** with no tenantId segment in the path (e.g. relative `img/hero.jpg` → `/assets/img/hero.jpg`).

### 4.4 Local Design Tokens (v1.5)
**Objective:** Standardize how a section consumes tenant theme values without leaking global styling assumptions into the section implementation.

#### 4.4.1 The Required Four-Layer Chain
For any section that controls background, text color, border color, accent color, or radii, the following chain is normative:

1. **Tenant theme source of truth** — Values are declared in `src/data/config/theme.json`.
2. **Runtime theme publication** — The Core and/or tenant bootstrap **must** publish those values as CSS custom properties.
3. **Section-local scope** — The View root **must** define `--local-*` variables mapped to the published theme variables for the concerns the section owns.
4. **Rendered classes** — Section-owned color/radius utilities **must** consume `var(--local-*)`.

**Rule:** A section may not skip layer 3 when it visually owns those concerns. Directly using global theme variables throughout the JSX is non-canonical for a fully themed section and must be treated as non-compliant unless the usage falls under an explicitly allowed exception.

#### 4.4.2 Source Of Truth: `theme.json`
`theme.json` is the tenant-level source of truth for theme values. Example:

```json
{
  "name": "JsonPages Landing",
  "tokens": {
    "colors": {
      "primary": "#3b82f6",
      "secondary": "#22d3ee",
      "accent": "#60a5fa",
      "background": "#060d1b",
      "surface": "#0b1529",
      "surfaceAlt": "#101e38",
      "text": "#e2e8f0",
      "textMuted": "#94a3b8",
      "border": "#162a4d"
    },
    "typography": {
      "fontFamily": {
        "primary": "'Instrument Sans', system-ui, sans-serif",
        "mono": "'JetBrains Mono', monospace",
        "display": "'Bricolage Grotesque', system-ui, sans-serif"
      }
    },
    "borderRadius": {
      "sm": "0px",
      "md": "0px",
      "lg": "2px"
    }
  }
}
```

**Rule:** For a themed tenant, `theme.json` must contain the canonical semantic keys defined in Appendix A. Extra brand-specific keys are allowed only as extensions to those canonical groups, not as replacements for them.

#### 4.4.3 Runtime Theme Publication
The tenant and/or Core **must** expose theme values as CSS variables before section rendering. The compliant bridge is a **three-layer chain** implemented in the tenant's `index.css`. Runtime publication is mandatory for themed tenants.

##### Layer architecture

```
theme.json  →  engine injection  →  :root bridge  →  @theme (Tailwind)  →  JSX classes
```

**Layer 0 — Engine injection (Core-provided)**
`@olonjs/core` reads `theme.json` and injects all token values as flattened CSS custom properties before section rendering. The naming convention is:

| JSON path | Injected CSS var |
|---|---|
| `tokens.colors.{name}` | `--theme-colors-{name}` |
| `tokens.typography.fontFamily.{role}` | `--theme-font-{role}` |
| `tokens.typography.scale.{step}` | `--theme-typography-scale-{step}` |
| `tokens.typography.tracking.{name}` | `--theme-typography-tracking-{name}` |
| `tokens.typography.leading.{name}` | `--theme-typography-leading-{name}` |
| `tokens.typography.wordmark.*` | `--theme-typography-wordmark-*` |
| `tokens.borderRadius.{name}` | `--theme-border-radius-{name}` |
| `tokens.spacing.{name}` | `--theme-spacing-{name}` |
| `tokens.zIndex.{name}` | `--theme-z-index-{name}` |
| `tokens.modes.{mode}.colors.{name}` | `--theme-modes-{mode}-colors-{name}` |

The engine also publishes shorthand aliases for the most common radius and font tokens (e.g. `--theme-radius-sm`, `--theme-font-primary`). Tokens not covered by the shorthand aliases must be bridged in the tenant `:root`.

**Layer 1 — `:root` semantic bridge (Tenant-provided, `index.css`)**
The tenant maps engine-injected vars to its own semantic naming. **The naming in this layer is the tenant's sovereign choice** — it is not imposed by the Core. Any naming convention is valid as long as it is consistent throughout the tenant.

```css
:root {
  /* Backgrounds */
  --background:           var(--theme-colors-background);
  --card:                 var(--theme-colors-card);
  --elevated:             var(--theme-colors-elevated);
  --overlay:              var(--theme-colors-overlay);
  --popover:              var(--theme-colors-popover);
  --popover-foreground:   var(--theme-colors-popover-foreground);

  /* Foregrounds */
  --foreground:           var(--theme-colors-foreground);
  --card-foreground:      var(--theme-colors-card-foreground);
  --muted-foreground:     var(--theme-colors-muted-foreground);
  --placeholder:          var(--theme-colors-placeholder);

  /* Brand ramp */
  --primary:              var(--theme-colors-primary);
  --primary-foreground:   var(--theme-colors-primary-foreground);
  --primary-light:        var(--theme-colors-primary-light);
  --primary-dark:         var(--theme-colors-primary-dark);
  /* ... full ramp --primary-50 through --primary-900 ... */

  /* Accent, secondary, muted, border, input, ring */
  --accent:               var(--theme-colors-accent);
  --accent-foreground:    var(--theme-colors-accent-foreground);
  --secondary:            var(--theme-colors-secondary);
  --secondary-foreground: var(--theme-colors-secondary-foreground);
  --muted:                var(--theme-colors-muted);
  --border:               var(--theme-colors-border);
  --border-strong:        var(--theme-colors-border-strong);
  --input:                var(--theme-colors-input);
  --ring:                 var(--theme-colors-ring);

  /* Feedback */
  --destructive:              var(--theme-colors-destructive);
  --destructive-foreground:   var(--theme-colors-destructive-foreground);
  --success:                  var(--theme-colors-success);
  --success-foreground:       var(--theme-colors-success-foreground);
  --warning:                  var(--theme-colors-warning);
  --warning-foreground:       var(--theme-colors-warning-foreground);
  --info:                     var(--theme-colors-info);
  --info-foreground:          var(--theme-colors-info-foreground);

  /* Typography scale, tracking, leading */
  --theme-text-xs:        var(--theme-typography-scale-xs);
  --theme-text-sm:        var(--theme-typography-scale-sm);
  /* ... full scale ... */
  --theme-tracking-tight: var(--theme-typography-tracking-tight);
  --theme-leading-normal: var(--theme-typography-leading-normal);
  /* ... */

  /* Spacing */
  --theme-container-max:  var(--theme-spacing-container-max);
  --theme-section-y:      var(--theme-spacing-section-y);
  --theme-header-h:       var(--theme-spacing-header-h);
  --theme-sidebar-w:      var(--theme-spacing-sidebar-w);

  /* Z-index */
  --z-base:     var(--theme-z-index-base);
  --z-elevated: var(--theme-z-index-elevated);
  --z-dropdown: var(--theme-z-index-dropdown);
  --z-sticky:   var(--theme-z-index-sticky);
  --z-overlay:  var(--theme-z-index-overlay);
  --z-modal:    var(--theme-z-index-modal);
  --z-toast:    var(--theme-z-index-toast);
}
```

**Layer 2 — `@theme` Tailwind v4 bridge (Tenant-provided, `index.css`)**
Every semantic variable from Layer 1 is re-exposed under the Tailwind v4 `@theme` namespace so it becomes a utility class. Pattern: `--color-{slug}: var(--{slug})`.

```css
@theme {
  --color-background:    var(--background);
  --color-card:          var(--card);
  --color-foreground:    var(--foreground);
  --color-primary:       var(--primary);
  --color-accent:        var(--accent);
  --color-border:        var(--border);
  /* ... full token set ... */

  --font-primary:        var(--theme-font-primary);
  --font-mono:           var(--theme-font-mono);
  --font-display:        var(--theme-font-display);

  --radius-sm:           var(--theme-radius-sm);
  --radius-md:           var(--theme-radius-md);
  --radius-lg:           var(--theme-radius-lg);
  --radius-xl:           var(--theme-radius-xl);
  --radius-full:         var(--theme-radius-full);
}
```

After this bridge, the full Tailwind utility vocabulary (`bg-primary`, `text-foreground`, `rounded-lg`, `font-display`, etc.) resolves to live theme values — with no hardcoded hex anywhere in the React layer.

**Light mode / additional modes** are bridged by overriding the Layer 1 semantic vars under a `[data-theme="light"]` selector (or equivalent), pointing to the engine-injected mode vars (`--theme-modes-light-colors-*`). The `@theme` layer requires no changes.

**Rule:** A tenant `index.css` must implement all three layers. Skipping Layer 2 breaks Tailwind utility resolution. Skipping Layer 1 couples sections to engine-internal naming. Hardcoding values in either layer is non-compliant.

#### 4.4.4 Section-Local Scope
If a section controls its own visual language, it **shall** establish a local token scope on the section root. Example:

```tsx
<section
  style={{
    '--local-bg': 'var(--background)',
    '--local-text': 'var(--foreground)',
    '--local-text-muted': 'var(--muted-foreground)',
    '--local-primary': 'var(--primary)',
    '--local-border': 'var(--border)',
    '--local-surface': 'var(--card)',
    '--local-radius-sm': 'var(--theme-radius-sm)',
    '--local-radius-md': 'var(--theme-radius-md)',
    '--local-radius-lg': 'var(--theme-radius-lg)',
  } as React.CSSProperties}
>
```

**Rule:** `--local-*` values must map to published theme variables. They must **not** be defined as hardcoded brand values such as `#fff`, `#111827`, `12px`, or `Inter, sans-serif` if those values belong to the tenant theme layer.

**Rule:** Local tokens are **mandatory** for section-owned color and radius concerns. They are **optional** for font-family concerns unless the section must remap or isolate font roles locally.

#### 4.4.5 Canonical Typography Rule
Typography follows a deterministic rule distinct from color/radius:

1. **Canonical font publication** — Tenant/Core must publish semantic font variables such as `--theme-font-primary`, `--theme-font-mono`, and `--theme-font-display` when those roles exist in the theme.
2. **Canonical font consumption** — Sections must consume typography through semantic tenant font utilities or variables backed by those published theme roles (for example `.font-display` backed by `--font-display`, itself backed by `--theme-font-display`).
3. **Local font tokens** — `--local-font-*` is optional and should be used only when a section needs to remap a font role locally rather than simply consume the canonical tenant font role.

Example of canonical global semantic bridge:

```css
:root {
  --font-primary: var(--theme-font-primary);
  --font-display: var(--theme-font-display);
}

.font-display {
  font-family: var(--font-display, var(--font-primary));
}
```

**Rule:** A section is compliant if it consumes themed fonts through this published semantic chain. It is **not** required to define `--local-font-display` unless the section needs local remapping. This closes the ambiguity between global semantic typography utilities and local color/radius scoping.

#### 4.4.6 View Consumption
All section-owned classes that affect color or radius must consume local variables. Font consumption must follow the typography rule above. Example:

```tsx
<section
  style={{
    '--local-bg': 'var(--background)',
    '--local-text': 'var(--foreground)',
    '--local-primary': 'var(--primary)',
    '--local-border': 'var(--border)',
    '--local-radius-md': 'var(--theme-radius-md)',
    '--local-radius-lg': 'var(--theme-radius-lg)',
  } as React.CSSProperties}
  className="bg-[var(--local-bg)]"
>
  <h1 className="font-display text-[var(--local-text)]">Build Tenant DNA</h1>

  <a className="bg-[var(--local-primary)] rounded-[var(--local-radius-md)] text-white">
    Read the Docs
  </a>

  <div className="border border-[var(--local-border)] rounded-[var(--local-radius-lg)]">
    {/* illustration / mockup / card */}
  </div>
</section>
```

#### 4.4.7 Compliance Rules
A section is compliant when all of the following are true:

1. `theme.json` is the source of truth for the theme values being used.
2. Those values are published at runtime as CSS custom properties before the section renders.
3. The section root defines a local token scope for the color/radius concerns it controls.
4. Local color/radius tokens map to published theme variables rather than hardcoded literals.
5. JSX classes use `var(--local-*)` for section-owned color/radius concerns.
6. Fonts are consumed through the published semantic font chain, and only use local font tokens when local remapping is required.
7. Hardcoded colors/radii are absent from the primary visual contract of the section.

#### 4.4.8 Allowed Exceptions
The following are acceptable if documented and intentionally limited:

*   Tiny decorative one-off values that are not part of the tenant theme contract (for example an isolated translucent pixel-grid overlay).
*   Temporary compatibility shims during migration, provided the section still exposes a clear compliant path and the literal is not the primary themed value.
*   Semantic alias bridges in tenant CSS (for example `--font-display: var(--theme-font-display)`), as long as the source remains the theme layer.

#### 4.4.9 Non-Compliant Patterns
The following are non-compliant:

*   `style={{ '--local-bg': '#060d1b' }}` when that background belongs to tenant theme.
*   Buttons using `rounded-[7px]`, `bg-blue-500`, `text-zinc-100`, or similar hardcoded utilities inside a section that claims to be theme-driven.
*   A section root that defines `--local-*`, but child elements still use raw `bg-*`, `text-*`, or `rounded-*` utilities for the same owned concerns.
*   Reading `theme.json` directly inside a View instead of consuming published runtime theme variables.
*   Treating brand-specific extension keys as a replacement for canonical semantic keys such as `primary`, `background`, `text`, `border`, or `fontFamily.primary`.

#### 4.4.10 Practical Interpretation
`--local-*` is not the source of truth. It is the **local scoping layer** between tenant theme and section implementation.

Canonical chain:

`theme.json` → published runtime theme vars → section `--local-*` → JSX classes`

Canonical font chain:

`theme.json` → published semantic font vars → tenant font utility/variable → section typography`

### 4.5 Z-Index & Overlay Governance (v1.2)
Section content root **must** stay at **`z-index` ≤ 1** (prefer `z-0`) so the Sovereign Overlay can sit above with high z-index in Tenant CSS (§7). Header/footer may use a higher z-index (e.g. 50) only as a documented exception for global chrome.

**Perché servono (CIP):** View “dumb” (solo data/settings) e senza import di Zod evita accoppiamento e permette al Form Factory di essere l’unica fonte di verità sugli schemi. Z-index basso evita che il contenuto copra l’overlay di selezione in Studio. Asset via `resolveAssetUrl`: i path relativi vengono risolti in `/assets/...` (senza segmento tenantId nel path). In v1.5 la catena `theme.json -> runtime vars -> --local-* -> JSX classes` rende i tenant temabili, riproducibili e compatibili con la Studio UX; senza questa separazione, stili “nudi” o valori hardcoded creano drift visivo, rompono il contratto del brand, e rendono ambiguo ciò che appartiene al tema contro ciò che appartiene alla section.

---

## 5. 🛠️ Editor Component Implementation Protocol (ECIP) v1.5

**Objective:** Standardize the Polymorphic ICE engine.

1.  **Recursive Form Factory:** The Admin UI builds forms by traversing the Zod ontology.
2.  **UI Metadata:** Use `.describe('ui:[widget]')` in schemas to pass instructions to the Form Factory.
3.  **Deterministic IDs:** Every object in a `ZodArray` must extend `BaseArrayItem` (containing an `id`) to ensure React reconciliation stability during reordering.

### 5.4 UI Metadata Vocabulary (v1.2)
Standard keys for the Form Factory:

| Key | Use case |
|-----|----------|
| `ui:text` | Single-line text input. |
| `ui:textarea` | Multi-line text. |
| `ui:select` | Enum / single choice. |
| `ui:number` | Numeric input. |
| `ui:list` | Array of items; list editor (add/remove/reorder). |
| `ui:icon-picker` | Icon selection. |

Unknown keys may be treated as `ui:text`. Array fields must use `BaseArrayItem` for items.

### 5.5 Path-Only Nested Selection & Expansion (v1.3, breaking)
In strict v1.3 Studio/Inspector behavior, nested editing targets are represented by **path segments from root to leaf**.

```typescript
export type SelectionPathSegment = { fieldKey: string; itemId?: string };
export type SelectionPath = SelectionPathSegment[];
```

Rules:
*   Expansion and focus for nested arrays **must** be computed from `SelectionPath` (root → leaf), not from a single flat pair.
*   Matching by `fieldKey` alone is non-compliant for nested structures.
*   Legacy flat payload fields **`itemField`** and **`itemId`** are removed in strict v1.3 selection protocol.

**Perché servono (ECIP):** Il Form Factory deve sapere quale widget usare (text, textarea, select, list, …) senza hardcodare per tipo; `.describe('ui:...')` è il contratto. BaseArrayItem con `id` su ogni item di array garantisce chiavi stabili in React e reorder/delete corretti nell’Inspector. In v1.3 la selezione/espansione path-only elimina ambiguità su array annidati: senza path completo root→leaf, la sidebar può aprire il ramo sbagliato o non aprire il target.

---

## 6. 🎯 ICE Data Attribute Contract (IDAC) v1.1

**Objective:** Mandatory data attributes so the Stage (iframe) and Inspector can bind selection and field/item editing without coupling to Tenant DOM.

### 6.1 Section-Level Markup (Core-Provided)
**SectionRenderer** (Core) wraps each section root with:
*   **`data-section-id`** — Section instance ID (e.g. UUID). On the wrapper that contains content + overlay.
*   Sibling overlay element **`data-jp-section-overlay`** — Selection ring and type label. **Tenant does not add this;** Core injects it.

Tenant Views render the **content** root only (e.g. `<section>` or `<div>`), placed **inside** the Core wrapper.

### 6.2 Field-Level Binding (Tenant-Provided)
For every **editable scalar field** the View **must** attach **`data-jp-field="<fieldKey>"`** (key matches schema path: e.g. `title`, `description`, `sectionTitle`, `label`).

### 6.3 Array-Item Binding (Tenant-Provided)
For every **editable array item** the View **must** attach:
*   **`data-jp-item-id="<stableId>"`** — Prefer `item.id`; fallback e.g. `legacy-${index}` only outside strict mode.
*   **`data-jp-item-field="<arrayKey>"`** — e.g. `cards`, `layers`, `products`, `paragraphs`.

### 6.4 Compliance
**Reserved types** (`header`, `footer`): ICE attributes optional unless Studio edits them. **All other section types** in the Stage and in `SECTION_SCHEMAS` **must** implement §6.2 and §6.3 for every editable field and array item.

### 6.5 Strict Path Extraction for Nested Arrays (v1.3, breaking)
For nested array targets, the Core/Inspector contract is path-based:
*   The runtime selection target is expressed as `itemPath: SelectionPath` (root → leaf).
*   Flat identity (`itemField` + `itemId`) is not sufficient for nested structures and is removed in strict v1.3 payloads.
*   In strict mode, index-based identity fallback is non-compliant for editable object arrays.

**Perché servono (IDAC):** Lo Stage è in un iframe e l’Inspector deve sapere **quale campo o item** corrisponde al click (o alla selezione) senza conoscere la struttura DOM del Tenant. **`data-jp-field`** associa un nodo DOM al path dello schema (es. `title`, `description`): così il Core può evidenziare la riga giusta nella sidebar, applicare opacità attivo/inattivo e aprire il form sul campo corretto. **`data-jp-item-id`** e **`data-jp-item-field`** fanno lo stesso per gli item di array (liste, reorder, delete). In v1.3, `itemPath` rende deterministico anche il caso nested (array dentro array), eliminando mismatch tra selezione canvas e ramo aperto in sidebar.

---

## 7. 🎨 Tenant Overlay CSS Contract (TOCC) v1.0

**Objective:** The Stage iframe loads only Tenant HTML/CSS. Core injects overlay **markup** but does **not** ship overlay styles. The Tenant **must** supply CSS so overlay is visible.

### 7.1 Required Selectors (Tenant global CSS)
1. **`[data-jp-section-overlay]`** — `position: absolute; inset: 0`; `pointer-events: none`; base state transparent.
2. **`[data-section-id]:hover [data-jp-section-overlay]`** — Hover: e.g. dashed border, subtle tint.
3. **`[data-section-id][data-jp-selected] [data-jp-section-overlay]`** — Selected: solid border, optional tint.
4. **`[data-jp-section-overlay] > div`** (type label) — Position and visibility (e.g. visible on hover/selected).

### 7.2 Z-Index
Overlay **z-index** high (e.g. 9999). Section content at or below CIP limit (§4.5).

### 7.3 Responsibility
**Core:** Injects wrapper and overlay DOM; sets `data-jp-selected`. **Tenant:** All overlay **visual** rules.

**Perché servono (TOCC):** L’iframe dello Stage carica solo HTML/CSS del Tenant; il Core inietta il markup dell’overlay ma non gli stili. Senza CSS Tenant per i selettori TOCC, bordo hover/selected e type label non sarebbero visibili: l’autore non vedrebbe quale section è selezionata né il label del tipo. TOCC chiarisce la responsabilità (Core = markup, Tenant = aspetto) e garantisce UX uniforme tra tenant.

---

## 8. 📦 Base Section Data & Settings (BSDS) v1.0

**Objective:** Standardize base schema fragments for anchors, array items, and section settings.

### 8.1 BaseSectionData
Every section data schema **must** extend a base with at least **`anchorId`** (optional string). Canonical Zod (Tenant `lib/base-schemas.ts` or equivalent):

```typescript
export const BaseSectionData = z.object({
  anchorId: z.string().optional().describe('ui:text'),
});
```

### 8.2 BaseArrayItem
Every array item schema editable in the Inspector **must** include **`id`** (optional string minimum). Canonical Zod:

```typescript
export const BaseArrayItem = z.object({
  id: z.string().optional(),
});
```

Recommended: required UUID for new items. Used by `data-jp-item-id` and React reconciliation.

### 8.3 BaseSectionSettings (Optional)
Common section-level settings. Canonical Zod (name **BaseSectionSettingsSchema** or as exported by Core):

```typescript
export const BaseSectionSettingsSchema = z.object({
  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),
  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),
});
```

Capsules may extend this for type-specific settings. Core may export **BaseSectionSettings** as the TypeScript type inferred from this or a superset.

**Perché servono (BSDS):** anchorId permette deep-link e navigazione in-page; id sugli array item è necessario per `data-jp-item-id`, reorder e React reconciliation. BaseSectionSettings comuni (padding, theme, container) evitano ripetizione e allineano il Form Factory tra capsule. Senza base condivisi, ogni capsule inventa convenzioni e validazione/add-section diventano fragili.

---

## 9. 📌 AddSectionConfig (ASC) v1.0

**Objective:** Formalize the "Add Section" contract used by the Studio.

**Type (Core exports `AddSectionConfig`):**
```typescript
interface AddSectionConfig {
  addableSectionTypes: readonly string[];
  sectionTypeLabels: Record<string, string>;
  getDefaultSectionData(sectionType: string): Record<string, unknown>;
}
```

**Shape:** Tenant provides one object (e.g. `addSectionConfig`) with:
*   **`addableSectionTypes`** — Readonly array of section type keys. Only these types appear in the Add Section Library. Must be a subset of (or equal to) the keys in SectionDataRegistry.
*   **`sectionTypeLabels`** — Map type key → display string (e.g. `{ hero: 'Hero', 'cta-banner': 'CTA Banner' }`).
*   **`getDefaultSectionData(sectionType: string): Record<string, unknown>`** — Returns default `data` for a new section. Must conform to the capsule’s data schema so the new section validates.

Core creates a new section with deterministic UUID, `type`, and `data` from `getDefaultSectionData(type)`.

**Perché servono (ASC):** Lo Studio deve mostrare una libreria “Aggiungi sezione” con nomi leggibili e, alla scelta, creare una section con dati iniziali validi. addableSectionTypes, sectionTypeLabels e getDefaultSectionData sono il contratto: il Tenant è l’unica fonte di verità su quali tipi sono addabili e con quali default. Senza ASC, il Core non saprebbe cosa mostrare in modal né come popolare i dati della nuova section.

---

## 10. ⚙️ JsonPagesConfig & Engine Bootstrap (JEB) v1.1

**Objective:** Bootstrap contract between Tenant app and `@olonjs/core`.

### 10.1 JsonPagesConfig (required fields)
The Tenant passes a single **config** object to **JsonPagesEngine**. Required fields:

| Field | Type | Description |
|-------|------|-------------|
| **tenantId** | string | Passed to `resolveAssetUrl(path, tenantId)`; resolved asset URLs are **`/assets/...`** with no tenantId segment in the path. |
| **registry** | `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }` | Component registry. Must match MTRP keys. See Appendix A. |
| **schemas** | `Record<SectionType, ZodType>` or equivalent | SECTION_SCHEMAS: type → **data** Zod schema. Form Factory uses this. See Appendix A. |
| **pages** | `Record<string, PageConfig>` | Slug → page config. See Appendix A. |
| **siteConfig** | SiteConfig | Global site (identity, header/footer blocks). See Appendix A. |
| **themeConfig** | ThemeConfig | Theme tokens. See Appendix A. |
| **menuConfig** | MenuConfig | Navigation tree (SSOT for header menu). See Appendix A. |
| **themeCss** | `{ tenant: string }` | At least **tenant**: string (inline CSS or URL) for Stage iframe injection. |
| **addSection** | AddSectionConfig | Add-section config (§9). |

Core may define optional fields. The Tenant must not omit required fields.

### 10.2 JsonPagesEngine
Root component: **`<JsonPagesEngine config={config} />`**. Responsibilities: route → page, SectionRenderer per section; in Studio mode Sovereign Shell (Inspector, Control Bar, postMessage); section wrappers and overlay per IDAC and JAP. Tenant does not implement the Shell.

### 10.3 Studio Selection Event Contract (v1.3, breaking)
In strict v1.3 Studio, section selection payload for nested targets is path-based:

```typescript
type SectionSelectMessage = {
  type: 'SECTION_SELECT';
  section: { id: string; type: string; scope: 'global' | 'local' };
  itemPath?: SelectionPath; // root -> leaf
};
```

Removed from strict protocol:
*   `itemField`
*   `itemId`

**Perché servono (JEB):** Un unico punto di bootstrap (config + Engine) evita che il Tenant replichi logica di routing, Shell e overlay. I campi obbligatori in JsonPagesConfig (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection) sono il minimo per far funzionare rendering, Studio e Form Factory; omissioni causano errori a runtime. In v1.3, il payload `itemPath` sincronizza in modo non ambiguo Stage e Inspector su nested arrays.

---

# 🏛️ OlonJS_ADMIN_PROTOCOL (JAP) v1.2

**Status:** Mandatory Standard  
**Version:** 1.2.0 (Sovereign Shell Edition — Path/Nested Strictness)  
**Objective:** Deterministic orchestration of the "Studio" environment (ICE Level 1).

---

## 1. The Sovereign Shell Topology
The Admin interface is a **Sovereign Shell** from `@olonjs/core`.
1.  **The Stage (Canvas):** Isolated Iframe; postMessage for data updates and selection mirroring. Section markup follows **IDAC** (§6); overlay styling follows **TOCC** (§7).
2.  **The Inspector (Sidebar):** Consumes Tenant Zod schemas to generate editors; binding via `data-jp-field` and `data-jp-item-*`.
3.  **The Control Bar:** Save, Export, Add Section.

## 2. State Orchestration & Persistence
*   **Working Draft:** Reactive local state for unsaved changes.
*   **Sync Law:** Inspector changes → Working Draft → Stage via `STUDIO_EVENTS.UPDATE_DRAFTS`.
*   **Bake Protocol:** "Bake HTML" requests snapshot from Iframe, injects `ProjectState` as JSON, triggers download.

## 3. Context Switching (Global vs. Local)
*   **Header/Footer** selection → Global Mode, `site.json`.
*   Any other section → Page Mode, current `[slug].json`.

## 4. Section Lifecycle Management
1.  **Add Section:** Modal from Tenant `SECTION_SCHEMAS`; UUID + default data via **AddSectionConfig** (§9).
2.  **Reorder:** Inspector or Stage Overlay; array mutation in Working Draft.
3.  **Delete:** Confirmation; remove from array, clear selection.

## 5. Stage Isolation & Overlay
*   **CSS Shielding:** Stage in Iframe; Tenant CSS does not leak into Admin.
*   **Sovereign Overlay:** Selection ring and type labels injected per **IDAC** (§6); Tenant styles them per **TOCC** (§7).

## 6. "Green Build" Validation
Studio enforces `tsc && vite build`. No export with TypeScript errors.

## 7. Path-Deterministic Selection & Sidebar Expansion (v1.3, breaking)
*   Section/item focus synchronization uses `itemPath` (root → leaf), not flat `itemField/itemId`.
*   Sidebar expansion state for nested arrays must be derived from all path segments.
*   Flat-only matching may open/close wrong branches and is non-compliant in strict mode.

**Perché servono (JAP):** Stage in iframe + Inspector + Control Bar separano il contesto di editing dal sito; postMessage e Working Draft permettono modifiche senza toccare subito i file. Bake ed Export richiedono uno stato coerente. Global vs Page mode evita confusione su dove si sta editando (site.json vs [slug].json). Add/Reorder/Delete sono gestiti in un solo modo (Working Draft + ASC). Green Build garantisce che ciò che si esporta compili. In v1.3, il path completo elimina ambiguità nella sincronizzazione Stage↔Sidebar su strutture annidate.

---

## Compliance: Legacy vs Full UX (v1.5)

| Dimension | Legacy / Less UX | Full UX (Core-aligned) |
|-----------|-------------------|-------------------------|
| **ICE binding** | No `data-jp-*`; Inspector cannot bind. | IDAC (§6) on every editable section/field/item. |
| **Section wrapper** | Plain `<section>`; no overlay contract. | Core wrapper + overlay; Tenant CSS per TOCC (§7). |
| **Design tokens** | Raw BEM / fixed classes, or local vars fed by literals. | `theme.json` as source of truth, mandatory runtime publication, local color/radius scope via `--local-*`, typography via canonical semantic font chain, no primary hardcoded themed values. |
| **Base schemas** | Ad hoc. | BSDS (§8): BaseSectionData, BaseArrayItem, BaseSectionSettings. |
| **Add Section** | Ad hoc defaults. | ASC (§9): addableSectionTypes, labels, getDefaultSectionData. |
| **Bootstrap** | Implicit. | JEB (§10): JsonPagesConfig + JsonPagesEngine. |
| **Selection payload** | Flat `itemField/itemId`. | Path-only `itemPath: SelectionPath` (JEB §10.3). |
| **Nested array expansion** | Single-segment or field-only heuristics. | Root-to-leaf path expansion (ECIP §5.5, JAP §7). |
| **Array item identity (strict)** | Index fallback tolerated. | Stable `id` required for editable object arrays. |

**Rule:** Every page section (non-header/footer) that appears in the Stage and in `SECTION_SCHEMAS` must comply with §6, §7, §4.4, §8, §9, §10 for full Studio UX.

---

## Summary of v1.5 Additions

| § | Title | Purpose |
|---|--------|--------|
| 4.4.3 | Three-Layer CSS Bridge | Replaces the informal "publish CSS vars" rule with the deterministic Layer 0 (engine injection) → Layer 1 (`:root` semantic bridge) → Layer 2 (`@theme` Tailwind bridge) architecture. Documents the engine's `--theme-colors-{name}` naming convention and the tenant's sovereign naming freedom in Layer 1. |
| A.2.6 | ThemeConfig (v1.5) | Replaces the incorrect `surface/surfaceAlt/text/textMuted` canonical keys with the actual schema-aligned keys (`card`, `elevated`, `foreground`, `muted-foreground`, etc.). Adds `spacing`, `zIndex`, full typography sub-interfaces (`scale`, `tracking`, `leading`, `wordmark`), and `modes`. Establishes `theme.json` as SOT with schema as the formalisation layer. |

---

## Summary of v1.5 Additions

| § | Title | Purpose |
|---|--------|--------|
| 4.4 | Local Design Tokens | Makes the `theme.json -> runtime vars -> --local-* -> JSX classes` chain explicit and normative. |
| 4.4.3 | Runtime Theme Publication | Makes runtime CSS publication mandatory for themed tenants. |
| 4.4.5 | Canonical Typography Rule | Removes ambiguity between global semantic font utilities and local token scoping. |
| 4.4.7 | Compliance Rules | Turns Local Design Tokens into a checklist-grade compliance contract. |
| 4.4.9 | Non-Compliant Patterns | Makes hardcoded token anti-patterns explicit. |
| **Appendix A.2.6** | **Deterministic ThemeConfig** | Aligns the spec-level theme contract with the core’s structured semantic keys plus extension policy. |
| **Appendix A.7** | **Local Design Tokens Implementation Addendum** | Operational checklist and implementation examples for compliant tenant sections. |

---

# Appendix A — Tenant Type & Code-Generation Annex

**Objective:** Make the specification **sufficient** to generate or audit a full tenant (new site, new components, new data) without a reference codebase. Defines TypeScript types, JSON shapes, schema contract, file paths, and integration pattern.

**Status:** Mandatory for code-generation and governance. Compliance ensures generated tenants are typed and wired like the reference implementation.

---

## A.1 Core-Provided Types (from `@olonjs/core`)

The following are assumed to be exported by Core. The Tenant augments **SectionDataRegistry** and **SectionSettingsRegistry**; all other types are consumed as-is.

| Type | Description |
|------|-------------|
| **SectionType** | `keyof SectionDataRegistry` (after Tenant augmentation). Union of all section type keys. |
| **Section** | Union of `BaseSection<K>` for all K in SectionDataRegistry. See MTRP §1.2. |
| **BaseSectionSettings** | Optional base type for section settings (may align with BSDS §8.3). |
| **MenuItem** | Navigation item. **Minimum shape:** `{ label: string; href: string }`. Core may extend (e.g. `children?: MenuItem[]`). |
| **AddSectionConfig** | See §9. |
| **JsonPagesConfig** | See §10.1. |

**Perché servono (A.1):** Il Tenant deve conoscere i tipi esportati dal Core (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig) per tipizzare registry, config e augmentation senza dipendere da implementazioni interne.

---

## A.2 Tenant-Provided Types (single source: `src/types.ts` or equivalent)

The Tenant **must** define the following in one module (e.g. **`src/types.ts`**). This module **must** perform the **module augmentation** of `@olonjs/core` for **SectionDataRegistry** and **SectionSettingsRegistry**, and **must** export **SectionComponentPropsMap** and re-export from `@olonjs/core` so that **SectionType** is available after augmentation.

### A.2.1 SectionComponentPropsMap

Maps each section type to the props of its React component. **Header** is the only type that receives **menu**.

**Option A — Explicit (recommended for clarity and tooling):** For each section type K, add one entry. Header receives **menu**.

```typescript
import type { MenuItem } from '@olonjs/core';
// Import Data/Settings from each capsule.

export type SectionComponentPropsMap = {
  'header': { data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] };
  'footer': { data: FooterData; settings?: FooterSettings };
  'hero': { data: HeroData; settings?: HeroSettings };
  // ... one entry per SectionType, e.g. 'feature-grid', 'cta-banner', etc.
};
```

**Option B — Mapped type (DRY, requires SectionDataRegistry/SectionSettingsRegistry in scope):**

```typescript
import type { MenuItem } from '@olonjs/core';

export type SectionComponentPropsMap = {
  [K in SectionType]: K extends 'header'
    ? { data: SectionDataRegistry[K]; settings?: SectionSettingsRegistry[K]; menu: MenuItem[] }
    : { data: SectionDataRegistry[K]; settings?: K extends keyof SectionSettingsRegistry ? SectionSettingsRegistry[K] : BaseSectionSettings };
};
```

SectionType is imported from Core (after Tenant augmentation). In practice Option A is the reference pattern; Option B is valid if the Tenant prefers a single derived definition.

**Perché servono (A.2):** SectionComponentPropsMap e i tipi di config (PageConfig, SiteConfig, MenuConfig, ThemeConfig) definiscono il contratto tra dati (JSON, API) e componente; l’augmentation è l’unico modo per estendere i registry del Core senza fork. Senza questi tipi, generazione tenant e refactor sarebbero senza guida e il type-check fallirebbe.

### A.2.2 ComponentRegistry type
The registry object **must** be typed as:

```typescript
import type { SectionType } from '@olonjs/core';
import type { SectionComponentPropsMap } from '@/types';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = { /* ... */ };
```

File: **`src/lib/ComponentRegistry.tsx`** (or equivalent). Imports one View per section type and assigns it to the corresponding key.

### A.2.3 PageConfig
Minimum shape for a single page (used in **pages** and in each **`[slug].json`**):

```typescript
export interface PageConfig {
  id?: string;
  slug: string;
  meta?: {
    title?: string;
    description?: string;
  };
  sections: Section[];
}
```

**Section** is the union type from MTRP (§1.2). Each element of **sections** has **id**, **type**, **data**, **settings** and conforms to the capsule schemas.

### A.2.4 SiteConfig
Minimum shape for **site.json** (and for **siteConfig** in JsonPagesConfig):

```typescript
export interface SiteConfigIdentity {
  title?: string;
  logoUrl?: string;
}

export interface SiteConfig {
  identity?: SiteConfigIdentity;
  pages?: Array<{ slug: string; label: string }>;
  header: {
    id: string;
    type: 'header';
    data: HeaderData;
    settings?: HeaderSettings;
  };
  footer: {
    id: string;
    type: 'footer';
    data: FooterData;
    settings?: FooterSettings;
  };
}
```

**HeaderData**, **FooterData**, **HeaderSettings**, **FooterSettings** are the types exported from the header and footer capsules.

### A.2.5 MenuConfig
Minimum shape for **menu.json** (and for **menuConfig** in JsonPagesConfig). Structure is tenant-defined; Core expects the header to receive **MenuItem[]**. Common pattern: an object with a key (e.g. **main**) whose value is **MenuItem[]**.

```typescript
export interface MenuConfig {
  main?: MenuItem[];
  [key: string]: MenuItem[] | undefined;
}
```

Or simply **`MenuItem[]`** if the app uses a single flat list. The Tenant must ensure that the value passed to the header component as **menu** conforms to **MenuItem[]** (e.g. `menuConfig.main` or `menuConfig` if it is the array).

### A.2.6 ThemeConfig
Minimum shape for **theme.json** (and for **themeConfig** in JsonPagesConfig). `theme.json` is the **source of truth** for the entire visual contract of the tenant. The schema (`design-system.schema.json`) is the machine-readable formalisation of this contract — if the TypeScript interfaces and the JSON Schema diverge, the JSON Schema wins.

**Naming policy:** The keys within `tokens.colors` are the tenant's sovereign choice. The engine flattens all keys to `--theme-colors-{name}` regardless of naming convention. The required keys listed below are the ones the engine's `:root` bridge and the `@theme` Tailwind bridge must be able to resolve. Extra brand-specific keys are always allowed as additive extensions.

```typescript
export interface ThemeColors {
  /* Required — backgrounds */
  background: string;
  card: string;
  elevated: string;
  overlay: string;
  popover: string;
  'popover-foreground': string;

  /* Required — foregrounds */
  foreground: string;
  'card-foreground': string;
  'muted-foreground': string;
  placeholder: string;

  /* Required — brand */
  primary: string;
  'primary-foreground': string;
  'primary-light': string;
  'primary-dark': string;

  /* Optional — brand ramp (50–900) */
  'primary-50'?: string;
  'primary-100'?: string;
  'primary-200'?: string;
  'primary-300'?: string;
  'primary-400'?: string;
  'primary-500'?: string;
  'primary-600'?: string;
  'primary-700'?: string;
  'primary-800'?: string;
  'primary-900'?: string;

  /* Required — accent, secondary, muted */
  accent: string;
  'accent-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  muted: string;

  /* Required — border, form */
  border: string;
  'border-strong': string;
  input: string;
  ring: string;

  /* Required — feedback */
  destructive: string;
  'destructive-foreground': string;
  'destructive-border': string;
  'destructive-ring': string;
  success: string;
  'success-foreground': string;
  'success-border': string;
  'success-indicator': string;
  warning: string;
  'warning-foreground': string;
  'warning-border': string;
  info: string;
  'info-foreground': string;
  'info-border': string;

  [key: string]: string | undefined;
}

export interface ThemeFontFamily {
  primary: string;
  mono: string;
  display?: string;
  [key: string]: string | undefined;
}

export interface ThemeWordmark {
  fontFamily: string;
  weight: string;
  width: string;
}

export interface ThemeTypography {
  fontFamily: ThemeFontFamily;
  wordmark?: ThemeWordmark;
  scale?: Record<string, string>;     /* xs sm base md lg xl 2xl 3xl 4xl 5xl 6xl 7xl */
  tracking?: Record<string, string>;  /* tight display normal wide label */
  leading?: Record<string, string>;   /* none tight snug normal relaxed */
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl?: string;
  full?: string;
  [key: string]: string | undefined;
}

export interface ThemeSpacing {
  'container-max'?: string;
  'section-y'?: string;
  'header-h'?: string;
  'sidebar-w'?: string;
  [key: string]: string | undefined;
}

export interface ThemeZIndex {
  base?: string;
  elevated?: string;
  dropdown?: string;
  sticky?: string;
  overlay?: string;
  modal?: string;
  toast?: string;
  [key: string]: string | undefined;
}

export interface ThemeModes {
  [mode: string]: { colors: Partial<ThemeColors> };
}

export interface ThemeTokens {
  colors: ThemeColors;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  spacing?: ThemeSpacing;
  zIndex?: ThemeZIndex;
  modes?: ThemeModes;
}

export interface ThemeConfig {
  name: string;
  tokens: ThemeTokens;
}
```

**Rule:** `theme.json` is the single source of truth. All layers downstream (engine injection, `:root` bridge, `@theme` bridge, React JSX) are read-only consumers. No layer below `theme.json` may hardcode a value that belongs to the theme contract.

**Rule:** Brand-specific extension keys (e.g. `colors.primary-50` through `primary-900`, custom spacing tokens) are always allowed as additive extensions within the canonical groups. They must not replace the required semantic keys.

---

## A.3 Schema Contract (SECTION_SCHEMAS)

**Location:** **`src/lib/schemas.ts`** (or equivalent).

**Contract:**
*   **SECTION_SCHEMAS** is a **single object** whose keys are **SectionType** and whose values are **Zod schemas for the section data** (not settings, unless the Form Factory contract expects a combined or per-type settings schema; then each value may be the data schema only, and settings may be defined per capsule and aggregated elsewhere if needed).
*   The Tenant **must** re-export **BaseSectionData**, **BaseArrayItem**, and optionally **BaseSectionSettingsSchema** from **`src/lib/base-schemas.ts`** (or equivalent). Each capsule’s data schema **must** extend BaseSectionData; each array item schema **must** extend or include BaseArrayItem.
*   **SECTION_SCHEMAS** is typed as **`Record<SectionType, ZodType>`** or **`{ [K in SectionType]: ZodType }`** so that keys match the registry and SectionDataRegistry.

**Export:** The app imports **SECTION_SCHEMAS** and passes it as **config.schemas** to JsonPagesEngine. The Form Factory traverses these schemas to build editors.

**Perché servono (A.3):** Un unico oggetto SECTION_SCHEMAS con chiavi = SectionType e valori = schema data permette al Form Factory di costruire form per tipo senza convenzioni ad hoc; i base schema garantiscono anchorId e id su item. Senza questo contratto, l’Inspector non saprebbe quali campi mostrare né come validare.

---

## A.4 File Paths & Data Layout

| Purpose | Path (conventional) | Description |
|---------|---------------------|-------------|
| Site config | **`src/data/config/site.json`** | SiteConfig (identity, header, footer, pages list). |
| Menu config | **`src/data/config/menu.json`** | MenuConfig (e.g. main nav). |
| Theme config | **`src/data/config/theme.json`** | ThemeConfig (tokens). |
| Page data | **`src/data/pages/<slug>.json`** | One file per page; content is PageConfig (slug, meta, sections). |
| Base schemas | **`src/lib/base-schemas.ts`** | BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema. |
| Schema aggregate | **`src/lib/schemas.ts`** | SECTION_SCHEMAS; re-exports base schemas. |
| Registry | **`src/lib/ComponentRegistry.tsx`** | ComponentRegistry object. |
| Add-section config | **`src/lib/addSectionConfig.ts`** | addSectionConfig (AddSectionConfig). |
| Tenant types & augmentation | **`src/types.ts`** | SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** for SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`. |
| Bootstrap | **`src/App.tsx`** | Imports config (site, theme, menu, pages), registry, schemas, addSection, themeCss; builds JsonPagesConfig; renders **<JsonPagesEngine config={config} />**. |

The app entry (e.g. **main.tsx**) renders **App**. No other bootstrap contract is specified; the Tenant may use Vite aliases (e.g. **@/**) for the paths above.

**Perché servono (A.4):** Path fissi (data/config, data/pages, lib/schemas, types.ts, App.tsx) permettono a CLI, tooling e agenti di trovare sempre gli stessi file; l’onboarding e la generazione da spec sono deterministici. Senza convenzione, ogni tenant sarebbe una struttura diversa.

---

## A.5 Integration Checklist (Code-Generation)

When generating or auditing a tenant, ensure the following in order:

1. **Capsules** — For each section type, create **`src/components/<type>/`** with View.tsx, schema.ts, types.ts, index.ts. Data schema extends BaseSectionData; array items extend BaseArrayItem; View complies with CIP and IDAC (§6.2–6.3 for non-reserved types).
2. **Base schemas** — **src/lib/base-schemas.ts** exports BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema (and optional CtaSchema or similar shared fragments).
3. **types.ts** — Define SectionComponentPropsMap (header with **menu**), PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** and augment SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`.
4. **ComponentRegistry** — Import every View; build object **{ [K in SectionType]: ViewComponent }**; type as **{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }**.
5. **schemas.ts** — Import base schemas and each capsule’s data schema; export SECTION_SCHEMAS as **{ [K in SectionType]: SchemaK }**; export SectionType as **keyof typeof SECTION_SCHEMAS** if not using Core’s SectionType.
6. **addSectionConfig** — addableSectionTypes, sectionTypeLabels, getDefaultSectionData; export as AddSectionConfig.
7. **App.tsx** — Import site, theme, menu, pages from data paths; build config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss: { tenant }, addSection); render JsonPagesEngine.
8. **Data files** — Create or update site.json, menu.json, theme.json, and one or more **<slug>.json** under the paths in A.4. Ensure JSON shapes match SiteConfig, MenuConfig, ThemeConfig, PageConfig.
9. **Runtime theme publication** — Publish the theme contract as runtime CSS custom properties before themed sections render.
10. **Tenant CSS** — Include TOCC (§7) selectors in global CSS so the Stage overlay is visible, and bridge semantic theme variables where needed.
11. **Reserved types** — Header and footer capsules receive props per SectionComponentPropsMap; menu is populated from menuConfig (e.g. menuConfig.main) when building the config or inside Core when rendering the header.

**Perché servono (A.5):** La checklist in ordine evita di dimenticare passi (es. augmentation prima del registry, TOCC dopo le View) e rende la spec sufficiente per generare o verificare un tenant senza codebase di riferimento.

---

## A.6 v1.3 Path/Nested Strictness Addendum (breaking)

This addendum extends Appendix A without removing prior v1.2 obligations:

1. **Type exports** — Core and/or shared types module should expose `SelectionPathSegment` and `SelectionPath` for Studio messaging and Inspector expansion logic.
2. **Protocol migration** — Replace flat payload fields `itemField` / `itemId` with `itemPath?: SelectionPath` in strict v1.3 channels.
3. **Nested array compliance** — For editable object arrays, item identity must be stable (`id`) and propagated to DOM attributes (`data-jp-item-id`), schema items (BaseArrayItem), and selection path segments (`itemId` when segment targets array item).
4. **Backward compatibility policy** — Legacy flat fields may exist only in transitional adapters outside strict mode; normative v1.3 contract is path-only.

---

## A.7 v1.5 Local Design Tokens Implementation Addendum

This addendum extends Appendix A without removing prior v1.3 obligations:

1. **Theme source of truth** — Tenant theme values belong in `src/data/config/theme.json`.
2. **Runtime publication** — Core and/or tenant bootstrap **must** expose those values as runtime CSS custom properties before section rendering.
3. **Local scope** — A themed section must define `--local-*` variables on its root for the color/radius concerns it owns.
4. **Class consumption** — Section-owned color/radius utilities must consume `var(--local-*)`, not raw hardcoded theme values.
5. **Typography policy** — Fonts must consume the published semantic font chain; local font tokens are optional and only for local remapping.
6. **Migration policy** — Hardcoded colors/radii may exist only as temporary compatibility shims or purely decorative exceptions, not as the primary section contract.

Canonical implementation pattern:

```text
theme.json -> published runtime theme vars -> section --local-* -> JSX classes
```

Canonical typography pattern:

```text
theme.json -> published semantic font vars -> tenant font utility/variable -> section typography
```

Minimal compliant example:

```tsx
<section
  style={{
    '--local-bg': 'var(--background)',
    '--local-text': 'var(--foreground)',
    '--local-primary': 'var(--primary)',
    '--local-radius-md': 'var(--theme-radius-md)',
  } as React.CSSProperties}
  className="bg-[var(--local-bg)]"
>
  <h2 className="font-display text-[var(--local-text)]">Title</h2>
  <a className="bg-[var(--local-primary)] rounded-[var(--local-radius-md)]">CTA</a>
</section>
```

Deterministic compliance checklist:

1. Canonical semantic theme keys exist.
2. Runtime publication exists.
3. Section-local color/radius scope exists.
4. Section-owned color/radius classes consume `var(--local-*)`.
5. Fonts consume the semantic published font chain.
6. Primary themed values are not hardcoded.

---

**Validation:** Align with current `@olonjs/core` exports (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig, and in v1.3+ path types for Studio selection), with the deterministic `ThemeConfig` contract, and with the runtime theme publication contract used by tenant CSS.  
**Distribution:** Core via `.yalc`; tenant projections via `@olonjs/cli`. This annex makes the spec **necessary and sufficient** for tenant code-generation and governance at enterprise grade.
