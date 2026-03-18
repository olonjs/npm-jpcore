#!/bin/bash
set -e

echo "Starting project reconstruction..."

mkdir -p "docs"
echo "Creating docs/01-Onboarding_Client_completo_aggiornato.md..."
cat << 'END_OF_FILE_CONTENT' > "docs/01-Onboarding_Client_completo_aggiornato.md"
# Onboarding — Percorso Client (senza CMS) — Versione completa

**Per chi:** Sviluppo grafico e dati quando **non** usi il CMS (Studio/ICE). Il sito è un **client**: i dati arrivano da JSON locali, da API o da un CMS esterno; tu ti occupi di layout, design e rendering.

**Riferimento spec:** OlonJS Architecture v1.2 (legacy alias: JSONPAGES) — solo le parti che riguardano struttura sito, componenti e dati. Ignori: Studio, ICE, Form Factory, IDAC, TOCC, AddSectionConfig, schema obbligatori per l'editor.

---

## 1. Cosa fai tu (in sintesi)

- **Grafico:** Layout e stili delle section (View + CSS / design tokens se vuoi).
- **Dati:** Da dove prendono i dati le pagine (file JSON, API, altro CMS) e come vengono passati al motore (config + pages).

Non devi: tipizzare tutto per l'editor, esporre schema Zod al Form Factory, gestire overlay Studio, Add Section, ecc. Puoi usare tipi minimi o anche `unknown`/`any` sui dati se non ti serve type-safety forte.

---

## 2. Struttura progetto (minima)

- **`src/data/config/site.json`** — Identità, header, footer (blocchi con `id`, `type`, `data`, `settings`).
- **`src/data/config/menu.json`** — Menu (es. `{ main: [{ label, href }] }`).
- **`src/data/config/theme.json`** — (Opzionale) Token tema (colori, font, radius).
- **`src/data/pages/<slug>.json`** — Una pagina = `slug`, `meta`, `sections[]` (array di blocchi `id`, `type`, `data`, `settings`). **Per creare una nuova pagina** basta aggiungere un file `<slug>.json` in `src/data/pages/`; lo slug del nome file diventa il path della pagina (es. `chi-siamo.json` → `/chi-siamo`).
- **`src/components/<sectionType>/`** — Una cartella per tipo di blocco (hero, header, footer, feature-grid, …).
- **`src/App.tsx`** — Carica site, menu, theme, pages; costruisce la config; renderizza **`<JsonPagesEngine config={config} />` *(from `@olonjs/core`, legacy alias: `@jsonpages/core`)***.

Il motore (Core) si aspetta comunque un **registry** (mappa tipo → componente) e le **pagine** nel formato previsto (slug → page con `sections`). Come popoli i JSON (a mano, da script, da altro CMS) è fuori dall'editor.

**Perché servono (struttura):** Path e forma (site, menu, theme, pages con sections) sono il contratto minimo che il Core usa per routing e rendering; rispettarli permette di cambiare in seguito fonte dati (JSON → API) senza riscrivere la logica. Vedi spec §2 (JSP), Appendix A.4.

---

## 3. Componenti (solo View)

- Ogni **section type** ha almeno una **View**: riceve `data` e, se serve, `settings`. L'header riceve anche `menu` (array di `{ label, href }`).
- **Niente obbligo di capsule "piene":** puoi avere solo `View.tsx` (e magari un `index.ts` che esporta la View). Schema Zod e types servono solo se vuoi type-safety in sviluppo o se in futuro attivi il CMS.
- **Stili:** Puoi usare classi Tailwind "libere" o un set di variabili CSS (es. `--local-bg`, `--local-text`) per coerenza. Le spec CIP (solo variabili, niente utility nude) sono per il percorso governance; qui puoi adattare alle tue convenzioni.
- **Asset:** Se il Core espone `resolveAssetUrl(path, tenantId)`, usalo per le immagini; altrimenti path relativi o URL assoluti.

**Perché servono (componenti):** Il registry deve avere un componente per ogni `type` usato nei JSON; la View deve ricevere `data` (e `settings`/`menu` dove previsto) così il Core può renderizzare senza conoscere i dettagli. Senza registry coerente con i dati, il motore non saprebbe cosa montare. Vedi spec §3 (TBP), §4 (CIP) per il percorso completo.

---

## 3.1 Image e campi immagine (se usi schema in seguito)

Se più avanti aggiungi schema Zod per type-safety o per attivare Studio, i **campi immagine** vanno modellati così:

- **Schema:** Il campo immagine è un **oggetto** (non una stringa) con almeno `url` e opzionalmente `alt`. Lo schema di questo oggetto va marcato con **`.describe('ui:image-picker')`** così il Form Factory (Inspector) mostra il widget Image Picker. Esempio: uno sub-schema `ImageSelectionSchema = z.object({ url: z.string(), alt: z.string().optional() }).describe('ui:image-picker')` usato come `image: ImageSelectionSchema.default({ url: '', alt: '' })`.
- **View:** Per il `src` dell'immagine usa **`resolveAssetUrl(data.image.url, tenantId)`**; sul nodo che rappresenta l'immagine imposta **`data-jp-field="image"`** (così l'Inspector lega correttamente il campo).

**Riferimento:** componente `image-break` in `apps/tenant-alpha/src/components/image-break/` (schema.ts, View.tsx) come esempio completo.

---

## 4. Dati: da dove arrivano

- **Solo JSON locali:** Leggi `site.json`, `menu.json`, `theme.json`, `pages/*.json` e li passi in `config` (siteConfig, menuConfig, themeConfig, pages). Nessun CMS.
- **CMS esterno / API:** Invece di importare i JSON, fai fetch (o SSR) e costruisci gli stessi oggetti (siteConfig, menuConfig, pages) e li passi a `JsonPagesEngine`. La forma delle pagine resta: `{ slug, meta?, sections[] }`; ogni section: `{ id, type, data, settings? }`.
- **Ibrido:** Header/footer da `site.json`, body da API o da altro CMS: costruisci un unico `pages[slug]` con `sections` che rispettano i tipi di blocco che hai nel registry.

Non devi registrare schema o AddSectionConfig a meno che non attivi Studio.

**Perché servono (dati):** La forma `sections[]` con `id`, `type`, `data`, `settings?` è ciò che il SectionRenderer e il Core si aspettano; mantenere quella forma anche quando i dati arrivano da API o altro CMS evita adattatori fragili e permette di attivare Studio in seguito senza rifare i dati. Vedi spec Appendix A.2 (PageConfig, SiteConfig, MenuConfig).

---

## 5. Registry e config (minimo)

- **Registry:** Un oggetto che mappa ogni `sectionType` (stringa) al componente React che renderizza quel tipo. Es.: `{ header: Header, footer: Footer, hero: Hero, ... }`. Se non usi Studio, puoi tipizzare in modo lasco (es. `Record<string, React.FC<any>>` o comunque compatibile con quanto si aspetta `JsonPagesConfig['registry']` from `@olonjs/core`).
- **Config da passare a JsonPagesEngine:**  
  `tenantId`, `registry`, `pages`, `siteConfig`, `menuConfig`, `themeConfig` (o oggetto vuoto), `themeCss: { tenant: cssString }`.  
  Se **non** usi Studio, **schemas** e **addSection** possono essere placeholder (oggetto vuoto / no-op) se il Core lo permette; altrimenti fornisci il minimo (es. schemas = `{}`, addSection = `{ addableSectionTypes: [], sectionTypeLabels: {}, getDefaultSectionData: () => ({}) }`) per non rompere l'engine.

Verifica nella doc o nel tipo `JsonPagesConfig` se `schemas` e `addSection` sono opzionali quando Studio non è in uso.

**Perché servono (registry e config):** Il Core deve risolvere ogni section a un componente (registry) e avere pagine, site, menu, theme e CSS tenant per renderizzare e, se serve, iniettare lo Stage in iframe; i campi obbligatori di config sono il minimo per far funzionare l'engine. Placeholder per schemas/addSection evitano errori quando Studio non è usato. Vedi spec §10 (JEB), Appendix A.

---

## 6. Checklist rapida (sviluppo grafico e dati, senza CMS)

| Cosa | Azione |
|------|--------|
| **Layout / grafico** | Implementare le View (una per section type) e gli stili (CSS / Tailwind / variabili). |
| **Dati** | Decidere fonte (JSON locali, API, altro CMS); costruire `siteConfig`, `menuConfig`, `pages` nella forma attesa e passarli in `config`. |
| **Registry** | Mappare ogni tipo di blocco usato nei JSON al componente corrispondente. |
| **Header / menu** | Header component riceve `data`, `settings`, `menu`; `menu` viene da `menuConfig` (es. `menuConfig.main`). |
| **Pagine** | Ogni pagina = un entry in `pages` con `sections[]`; ogni section ha `id`, `type`, `data`, `settings?`. |
| **Nuova pagina** | Aggiungere un file `<slug>.json` in `src/data/pages/` (lo slug diventa il path della pagina). |
| **Image (se schema)** | Campo immagine = oggetto `{ url, alt? }` con schema `.describe('ui:image-picker')`; View usa `resolveAssetUrl` e `data-jp-field="image"`. |
| **Studio / ICE** | Non usati: niente schema obbligatori, niente data-jp-*, niente overlay CSS, niente Add Section. |

---

## 7. Quando passi al percorso "Governance"

Se più avanti vuoi l'editor (Studio) e la governance (tipi, schema, Add Section, overlay): usa l'onboarding **02-Onboarding_Governance_completo.md** e allinea il progetto a tipi, capsule piene (View + schema + types), IDAC, TOCC, AddSectionConfig e Appendix A delle spec v1.2.

END_OF_FILE_CONTENT
echo "Creating docs/01-Onboarding_Governance_naked.md..."
cat << 'END_OF_FILE_CONTENT' > "docs/01-Onboarding_Governance_naked.md"
### 📄 File 1: Client Path (No CMS)



# Onboarding — Client Path (No CMS) — Complete Version

**Target:** Frontend Developers & Data Entry staff who **do not** use the CMS (Studio/ICE). The site acts as a **client**: data comes from local JSON, APIs, or an external CMS; you are responsible for layout, design, and rendering.

**Spec Reference:** JSONPAGES Architecture v1.2 — only the parts regarding site structure, components, and data. You ignore: Studio, ICE, Form Factory, IDAC, TOCC, AddSectionConfig, and mandatory schemas for the editor.

---

## 1. Your Role (Summary)

-   **Visuals:** Layout and styling of sections (View + CSS / design tokens).
-   **Data:** Where pages get their data (JSON files, API, external CMS) and how they are passed to the engine (config + pages).

You **do not** need to: type everything for the editor, expose Zod schemas to the Form Factory, handle Studio overlays, Add Section logic, etc. You can use minimal types or even `unknown`/`any` on data if strong type-safety is not required.

---

## 2. Project Structure (Minimal)

-   **`src/data/config/site.json`** — Identity, header, footer (blocks with `id`, `type`, `data`, `settings`).
-   **`src/data/config/menu.json`** — Menu (e.g., `{ main: [{ label, href }] }`).
-   **`src/data/config/theme.json`** — (Optional) Theme tokens (colors, fonts, radius).
-   **`src/data/pages/<slug>.json`** — One page = `slug`, `meta`, `sections[]` (array of blocks `id`, `type`, `data`, `settings`). **To create a new page**, simply add a `<slug>.json` file in `src/data/pages/`; the filename slug becomes the page path (e.g., `about-us.json` → `/about-us`).
-   **`src/components/<sectionType>/`** — One folder per block type (hero, header, footer, feature-grid, …).
-   **`src/App.tsx`** — Loads site, menu, theme, pages; builds the config; renders **`<JsonPagesEngine config={config} />`**.

The Engine (Core) still expects a **registry** (type → component map) and **pages** in the expected format (slug → page with `sections`). How you populate the JSONs (manually, via script, from another CMS) is outside the editor's scope.

**Why this matters (Structure):** Paths and shape (site, menu, theme, pages with sections) are the minimal contract the Core uses for routing and rendering; respecting them allows you to switch data sources (JSON → API) later without rewriting logic. See Spec §2 (JSP), Appendix A.4.

---

## 3. Components (View Only)

-   Every **section type** has at least one **View**: it receives `data` and, if needed, `settings`. The header also receives `menu` (array of `{ label, href }`).
-   **No "Full Capsule" requirement:** you can have just `View.tsx` (and maybe an `index.ts` exporting the View). Zod schemas and types are only needed if you want dev-time type-safety or plan to activate the CMS later.
-   **Styles:** You can use "free" Tailwind classes or a set of CSS variables (e.g., `--local-bg`, `--local-text`) for consistency. CIP specs (variables only, no naked utilities) are for the Governance path; here you can adapt to your conventions.
-   **Assets:** If the Core exposes `resolveAssetUrl(path, tenantId)`, use it for images; otherwise, use relative paths or absolute URLs.

**Why this matters (Components):** The registry must have a component for every `type` used in the JSONs; the View must receive `data` (and `settings`/`menu` where expected) so the Core can render without knowing details. Without a registry consistent with data, the engine wouldn't know what to mount. See Spec §3 (TBP), §4 (CIP) for the full path.

---

## 3.1 Images and Image Fields (If using Schema later)

If you later add Zod schemas for type-safety or to activate Studio, **image fields** must be modeled as follows:

-   **Schema:** The image field is an **object** (not a string) with at least `url` and optionally `alt`. This object's schema must be marked with **`.describe('ui:image-picker')`** so the Form Factory (Inspector) shows the Image Picker widget. Example: a sub-schema `ImageSelectionSchema = z.object({ url: z.string(), alt: z.string().optional() }).describe('ui:image-picker')` used as `image: ImageSelectionSchema.default({ url: '', alt: '' })`.
-   **View:** For the image `src`, use **`resolveAssetUrl(data.image.url, tenantId)`**; on the node representing the image, set **`data-jp-field="image"`** (so the Inspector binds the field correctly).

**Reference:** See the `image-break` component in `apps/tenant-alpha/src/components/image-break/` (schema.ts, View.tsx) for a complete example.

---

## 4. Data: Where it comes from

-   **Local JSONs only:** Read `site.json`, `menu.json`, `theme.json`, `pages/*.json` and pass them into `config` (siteConfig, menuConfig, themeConfig, pages). No CMS.
-   **External CMS / API:** Instead of importing JSONs, fetch (or SSR) and build the same objects (siteConfig, menuConfig, pages) and pass them to `JsonPagesEngine`. The page shape remains: `{ slug, meta?, sections[] }`; each section: `{ id, type, data, settings? }`.
-   **Hybrid:** Header/footer from `site.json`, body from API or another CMS: build a single `pages[slug]` with `sections` that respect the block types you have in the registry.

You do not need to register schemas or AddSectionConfig unless you activate Studio.

**Why this matters (Data):** The `sections[]` shape with `id`, `type`, `data`, `settings?` is what the SectionRenderer and Core expect; maintaining this shape even when data comes from an API or another CMS avoids fragile adapters and allows activating Studio later without redoing data. See Spec Appendix A.2 (PageConfig, SiteConfig, MenuConfig).

---

## 5. Registry and Config (Minimal)

-   **Registry:** An object mapping every `sectionType` (string) to the React component rendering that type. E.g.: `{ header: Header, footer: Footer, hero: Hero, ... }`. If not using Studio, you can type loosely (e.g., `Record<string, React.FC<any>>` or whatever is compatible with `JsonPagesConfig['registry']`).
-   **Config passed to JsonPagesEngine:**
    `tenantId`, `registry`, `pages`, `siteConfig`, `menuConfig`, `themeConfig` (or empty object), `themeCss: { tenant: cssString }`.
    If you are **not** using Studio, **schemas** and **addSection** can be placeholders (empty object / no-op) if the Core allows it; otherwise, provide the minimum (e.g., schemas = `{}`, addSection = `{ addableSectionTypes: [], sectionTypeLabels: {}, getDefaultSectionData: () => ({}) }`) to prevent engine errors.

Check docs or `JsonPagesConfig` type to see if `schemas` and `addSection` are optional when Studio is unused.

**Why this matters (Registry & Config):** The Core must resolve every section to a component (registry) and have pages, site, menu, theme, and tenant CSS to render and, if needed, inject the Stage iframe; mandatory config fields are the minimum to make the engine work. Placeholders for schemas/addSection avoid errors when Studio is not used. See Spec §10 (JEB), Appendix A.

---

## 6. Quick Checklist (Visual Dev & Data, No CMS)

| Item | Action |
|------|--------|
| **Layout / Visuals** | Implement Views (one per section type) and styles (CSS / Tailwind / variables). |
| **Data** | Decide source (Local JSON, API, other CMS); build `siteConfig`, `menuConfig`, `pages` in the expected shape and pass to `config`. |
| **Registry** | Map every block type used in JSONs to the corresponding component. |
| **Header / Menu** | Header component receives `data`, `settings`, `menu`; `menu` comes from `menuConfig` (e.g., `menuConfig.main`). |
| **Pages** | Each page = one entry in `pages` with `sections[]`; each section has `id`, `type`, `data`, `settings?`. |
| **New Page** | Add a `<slug>.json` file in `src/data/pages/` (slug becomes page path). |
| **Image (if schema)** | Image field = object `{ url, alt? }` with schema `.describe('ui:image-picker')`; View uses `resolveAssetUrl` and `data-jp-field="image"`. |
| **Studio / ICE** | Not used: no mandatory schemas, no data-jp-*, no overlay CSS, no Add Section. |

---

## 7. Switching to the "Governance" Path

If you later want the editor (Studio) and governance (types, schema, Add Section, overlay): use the onboarding guide **02-Onboarding_Governance.md** and align the project with types, full capsules (View + schema + types), IDAC, TOCC, AddSectionConfig, and Appendix A of Spec v1.2.


END_OF_FILE_CONTENT
echo "Creating docs/02-Onboarding_Governance_CMS.md..."
cat << 'END_OF_FILE_CONTENT' > "docs/02-Onboarding_Governance_CMS.md"

# Onboarding — Governance Path (With CMS) — Complete Version

**Target:** Lead Developers & Architects setting up the **CMS** (Studio, ICE, Form Factory): in-app authoring, strong typing, content and component governance.

**Spec Reference:** OlonJS Architecture Specifications v1.2 (legacy alias: JSONPAGES) + Appendix A — Tenant Type & Code-Generation Annex.

---

## 1. What "Governance" Implies

-   **Types:** Every section type is declared in `SectionDataRegistry` / `SectionSettingsRegistry` (module augmentation) and in `SectionComponentPropsMap`. Registry and config are strictly typed.
-   **Schema:** Every section type has a Zod schema (data, and optionally settings) used by the Form Factory to generate the editor in the Inspector. Schemas are aggregated in `SECTION_SCHEMAS`.
-   **Studio/ICE:** The editor (Inspector) hooks into the DOM via **data-jp-field** and **data-jp-item-id** / **data-jp-item-field**. The selection overlay in the iframe requires the **tenant** to provide the CSS (TOCC).
-   **Add Section:** The tenant exposes **AddSectionConfig** (addable types, labels, default data) so the user can add sections from the library in Studio.
-   **Design Tokens:** Views use CSS variables (`--local-*`) and no "naked" utilities (CIP) for consistency and compatibility with themes and overlays.

**Why this matters (Summary):** Types and schemas allow the Core and Form Factory to operate without knowing Tenant details; IDAC allows the Inspector to link Stage clicks to the active row in the sidebar (including active/inactive opacity); TOCC makes the overlay visible; AddSectionConfig defines the "Add Section" library; tokens and z-index avoid conflicts with the editing UI. Detailed "Whys" for each spec: see Spec v1.2 (§1–§10, JAP, Appendix A).

---

## 1.1 The Value of Typing: Governance vs. CMS UX

Typing (TypeScript types + Zod schema) serves **two levels**: Governance (Developer/Architecture) and **CMS UX** (Author using Studio).

**Governance:** Typed registry, SectionComponentPropsMap, SiteConfig/PageConfig shape, audits, code-generation → consistency across tenants, no drift, safe refactoring, spec-based tooling.

**CMS UX:** The Zod schema drives the **Form Factory** (which widget for which field: text, textarea, select, list, icon-picker, **image-picker**); **data-jp-field** and **data-jp-item-id/field** bind Stage clicks to Inspector forms; **AddSectionConfig** provides addable types, labels, and defaults. Result for the author: consistent forms, "Add Section" with sensible names and initial data, correct selection (click → right form), validation with clear errors. Without schema and typed contracts, the Inspector wouldn't know which fields to show or how to validate. Thus: for governance, typing guarantees **contracts**; for CMS UX, it defines the **editing experience**. Both must be specified.

---

## 2. Project Structure (Complete)

-   **`src/data/config/site.json`** — SiteConfig (identity, pages[], header block, footer block).
-   **`src/data/config/menu.json`** — MenuConfig (e.g., `main: MenuItem[]`).
-   **`src/data/config/theme.json`** — ThemeConfig (tokens).
-   **`src/data/pages/<slug>.json`** — PageConfig (slug, meta, sections[]). **To create a new page**, simply add a `<slug>.json` file in `src/data/pages/`; the filename slug becomes the page path (e.g., `about-us.json` → `/about-us`).
-   **`src/components/<sectionType>/`** — **Full Capsule:** View.tsx, schema.ts, types.ts, index.ts.
-   **`src/lib/base-schemas.ts`** — BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema.
-   **`src/lib/schemas.ts`** — SECTION_SCHEMAS (aggregate of data schemas per type) + export SectionType.
-   **`src/lib/ComponentRegistry.tsx`** — Typed Registry: `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }`.
-   **`src/lib/addSectionConfig.ts`** — AddSectionConfig (addableSectionTypes, sectionTypeLabels, getDefaultSectionData).
-   **`src/types.ts`** — SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **module augmentation** for SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`.
-   **`src/App.tsx`** — Bootstrap: config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection); `<JsonPagesEngine config={config} />`.
-   **Global CSS** — Includes TOCC selectors for overlay (hover/selected/type label).

---

## 3. Components (Capsules + IDAC + Tokens)

-   **Capsule:** Every section type has View, schema (Zod), types (inferred), index. The **data** schema extends BaseSectionData; array items extend BaseArrayItem.
-   **View:** Receives `data` and `settings` (and `menu` for header). Does not import Zod. Uses **only** CSS variables for colors/radii (e.g., `bg-[var(--local-bg)]`), root section with `z-index` ≤ 1.
-   **IDAC (ICE):** On every editable scalar field: **`data-jp-field="<fieldKey>"`**. On every editable array item: **`data-jp-item-id="<stableId>"`** and **`data-jp-item-field="<arrayKey>"`**. This allows the Inspector to bind selection and forms to the correct paths.
-   **Schema:** Use UI vocabulary (ECIP): `.describe('ui:text')`, `ui:textarea`, `ui:select`, `ui:number`, `ui:list`, `ui:icon-picker`, **`ui:image-picker`** (see §3.1). Editable object arrays: every object must have an `id` (BaseArrayItem).

**Why this matters (Components):** **data-jp-field** and **data-jp-item-*** are needed because the Stage is in an iframe, and the Core needs to know which field/item corresponds to a click without knowing the Tenant's DOM: this allows the sidebar to highlight the active row (even with active/inactive opacity), open the form on the right field, and handle lists (reorder, delete). Without IDAC, clicks on the canvas are not reflected in the sidebar. Schema with `ui:*` and BaseArrayItem are needed for the Form Factory to generate the right widgets and maintain stable keys (reorder/delete). Tokens and z-index prevent content from covering the overlay. See Spec §6 (IDAC), §5 (ECIP), §4 (CIP).

---

## 3.1 Image Picker: Correct Usage in Schema (Example `image-break`)

For **image fields**, the Form Factory exposes the **Image Picker** widget only if the schema is modeled correctly.

### Rule

-   The image field is not a **string** (`z.string()`), but an **object** with at least `url` and, optionally, `alt`.
-   The **schema of this object** (the sub-schema) must be marked with **`.describe('ui:image-picker')`**. The Form Factory recognizes `ui:image-picker` only on **ZodObject** (object schema), not on string fields.

### Example (`image-break` capsule)

**Schema (`schema.ts`):**

```ts
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

const ImageSelectionSchema = z
  .object({
    url: z.string(),
    alt: z.string().optional(),
  })
  .describe('ui:image-picker');

export const ImageBreakSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  image: ImageSelectionSchema.default({ url: '', alt: '' }),
  caption: z.string().optional().describe('ui:textarea'),
});
```

-   **ImageSelectionSchema** is a `z.object({ url, alt })` with **`.describe('ui:image-picker')`** on the object.
-   The **`image`** field in the section data uses that schema (with default), so the Inspector shows the Image Picker widget for `image`.

**View (`View.tsx`):**

-   For the image `src`: **`resolveAssetUrl(data.image.url, tenantId)`** (multi-tenant and relative paths).
-   On the node representing the image (e.g., the `<img>` or a wrapper): **`data-jp-field="image"`** so the Stage click binds the Inspector to the `image` field.
-   Other editable fields (caption, label) with **`data-jp-field="caption"`** and **`data-jp-field="label"`** where appropriate.

**Full Reference:** `apps/tenant-alpha/src/components/image-break/` (schema.ts, types.ts, View.tsx, index.ts).

### What to Avoid

-   **Do not** use `.describe('ui:image-picker')` on a **string** field (e.g., `imageUrl: z.string().describe('ui:image-picker')`): the Image Picker widget expects an object `{ url, alt? }`.
-   **Do not** forget `data-jp-field="image"` on the corresponding DOM node, otherwise Inspector ↔ Stage binding won't work for that field.

---

## 4. Data: Shape and Responsibility

-   **site.json / menu.json / theme.json / pages/*.json** — Exact shape as in Appendix A (SiteConfig, MenuConfig, ThemeConfig, PageConfig). These are the Source of Truth when the user saves from Studio (Working Draft → persist to these files or API generating them).
-   **Studio** updates the Working Draft; sync with the iframe and "Bake" use the same structure. Therefore, data passed to JsonPagesEngine (siteConfig, menuConfig, pages) must be compatible with what the editor modifies.

If data comes from an external CMS, you must synchronize: e.g., export from Studio → push to CMS, or CMS as source and Studio in read-only; in any case, the **shape** of pages (sections with id, type, data, settings) remains that of the spec.

---

## 5. Registry, Schemas, Types, AddSection

-   **types.ts:** Single point of **module augmentation** and definition of SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig. Header: `{ data, settings?, menu: MenuItem[] }`; all others: `{ data, settings? }`.
-   **ComponentRegistry:** Every SectionType key has the corresponding component; type: `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }`.
-   **SECTION_SCHEMAS:** Every SectionType key has the **data Zod schema** (same order as registry). Base schemas re-exported from base-schemas.ts.
-   **addSectionConfig:** addableSectionTypes (only types the user can add from the library), sectionTypeLabels, getDefaultSectionData(type) returning valid `data` for that schema.

**Why this matters (registry, schemas, types, addSection):** A single augmentation point (types.ts) and a single SECTION_SCHEMAS avoid duplication and ensure registry, Form Factory, and config use the same types. AddSectionConfig is the single source of truth for "which sections can be added" and "with what defaults"; without it, the "Add Section" modal wouldn't have valid names or initial data. See Spec §9 (ASC), Appendix A.2–A.3.

---

## 6. Overlay and CSS (TOCC)

-   The Core injects the overlay markup (wrapper with `data-section-id`, sibling with `data-jp-section-overlay`). The **tenant** must provide the CSS so that:
    -   `[data-jp-section-overlay]` covers the section, `pointer-events: none`, high z-index (e.g., 9999).
    -   Hover and selected states are visible (dashed/solid border, optional tint).
    -   The type label (e.g., `[data-jp-section-overlay] > div`) is positioned and visible on hover/selected.

Without this, the overlay is invisible in the Studio iframe.

**Why this matters (TOCC):** The Stage iframe loads only Tenant CSS; the Core injects overlay markup but not styles. Without TOCC selectors in Tenant CSS, hover/selected borders and type labels are invisible: the author cannot see which section is selected. See Spec §7 (TOCC).

---

## 7. Quick Checklist (Visual Dev & Data, With CMS)

| Item | Action |
|------|--------|
| **Layout / Visuals** | View with `--local-*` variables, z-index ≤ 1, no naked utilities. |
| **Data (Shape)** | SiteConfig, MenuConfig, ThemeConfig, PageConfig as in Appendix A; JSON in `data/config` and `data/pages`. |
| **Capsules** | View + schema (with `ui:*`) + types + index; data schema extends BaseSectionData; array item with id. |
| **IDAC** | `data-jp-field` on editable scalar fields; `data-jp-item-id` and `data-jp-item-field` on array items. |
| **types.ts** | SectionComponentPropsMap (header with menu), augmentation, PageConfig, SiteConfig, MenuConfig, ThemeConfig. |
| **Registry** | All types mapped to component; registry type as in Appendix A. |
| **SECTION_SCHEMAS** | One entry per type (data schema); re-export base schemas. |
| **addSectionConfig** | addableSectionTypes, sectionTypeLabels, getDefaultSectionData. |
| **Config** | tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection. |
| **TOCC** | CSS overlay for `[data-jp-section-overlay]`, hover, selected, type label. |

---

## 8. Spec References

-   **Architecture and ICE:** §1–§10 (MTRP, JSP, TBP, CIP, ECIP, IDAC, TOCC, BSDS, ASC, JEB).
-   **Types and Code-Generation:** Appendix A (Core types, Tenant types, Schema contract, File paths, Integration checklist).
-   **Admin:** JAP (Studio topology, Working Draft, Bake, overlay, Green Build).

Using this path gives you full **governance**: types, schema, editor, Add Section, and overlay aligned with Spec v1.2. For versions with all "Why this matters" explanations, use the file **JSONPAGES_Specs_v1.2_completo.md**.

--- END OF FILE docs/02-Onboarding_Governance.md ---
END_OF_FILE_CONTENT
echo "Creating docs/02-Onboarding_Governance_completo_aggiornato.md..."
cat << 'END_OF_FILE_CONTENT' > "docs/02-Onboarding_Governance_completo_aggiornato.md"
# Onboarding — Percorso Governance (con CMS) — Versione completa

**Per chi:** Sviluppo grafico e dati quando vuoi il **CMS** (Studio, ICE, Form Factory): authoring in-app, tipizzazione forte, governance dei contenuti e dei componenti.

**Riferimento spec:** OlonJS Architecture Specifications v1.2 (legacy alias: JSONPAGES) + Appendix A — Tenant Type & Code-Generation Annex.

---

## 1. Cosa implica "governance"

- **Tipi:** Ogni section type è dichiarato in `SectionDataRegistry` / `SectionSettingsRegistry` (module augmentation) e in `SectionComponentPropsMap`. Registry e config sono tipizzati.
- **Schema:** Ogni section type ha uno schema Zod (data, e opzionalmente settings) usato dal Form Factory per generare l'editor nell'Inspector. Gli schema sono aggregati in `SECTION_SCHEMAS`.
- **Studio/ICE:** L'editor (Inspector) si aggancia al DOM tramite **data-jp-field** e **data-jp-item-id** / **data-jp-item-field**. L'overlay di selezione in iframe richiede che il **tenant** fornisca il CSS (TOCC).
- **Add Section:** Il tenant espone **AddSectionConfig** (tipi addabili, label, default data) così in Studio l'utente può aggiungere section dalla libreria.
- **Design tokens:** Le View usano variabili CSS (`--local-*`) e nessuna utility "nuda" (CIP) per coerenza e compatibilità con tema e overlay.

**Perché servono (in sintesi):** Tipi e schema permettono al Core e al Form Factory di operare senza conoscere i dettagli del Tenant; IDAC permette all'Inspector di legare click in Stage e riga attiva nella sidebar (inclusa opacità attivo/inattivo); TOCC rende visibile l'overlay; AddSectionConfig definisce la libreria "Aggiungi sezione"; token e z-index evitano conflitti con l'UI di editing. Dettaglio sui "perché" per ogni specifica: spec v1.2 (§1–§10, JAP, Appendix A), dove ogni sezione ha un paragrafo **Perché servono**.

---

## 1.1 Valore della tipizzazione: governance e CMS UX

La tipizzazione (tipi TypeScript + schema Zod) serve a **due livelli**: governance (sviluppatore/architettura) e **UX del CMS** (autore che usa Studio). Spesso si menziona solo il primo.

**Governance:** registry tipizzato, SectionComponentPropsMap, forma di SiteConfig/PageConfig, audit, code-generation → coerenza tra tenant, niente drift, refactor sicuro, tooling basato su spec.

**CMS UX:** lo schema Zod guida il **Form Factory** (quali widget per ogni campo: text, textarea, select, list, icon-picker, **image-picker**); **data-jp-field** e **data-jp-item-id/field** legano click in Stage e form nell'Inspector; **AddSectionConfig** dà tipi addabili, label e default. Risultato per l'autore: form coerenti, "Aggiungi sezione" con nomi e dati iniziali sensati, selezione corretta (click → form giusto), validazione con errori chiari. Senza schema e contratto tipizzato l'Inspector non saprebbe quali campi mostrare né come validare. Quindi: per la governance la tipizzazione garantisce contratti; per la **CMS UX** definisce l'**esperienza di editing** (controlli, label, default, binding). Va specificato entrambi.

---

## 2. Struttura progetto (completa)

- **`src/data/config/site.json`** — SiteConfig (identity, pages[], header block, footer block).
- **`src/data/config/menu.json`** — MenuConfig (es. `main: MenuItem[]`).
- **`src/data/config/theme.json`** — ThemeConfig (tokens).
- **`src/data/pages/<slug>.json`** — PageConfig (slug, meta, sections[]). **Per creare una nuova pagina** basta aggiungere un file `<slug>.json` in `src/data/pages/`; lo slug del nome file diventa il path della pagina (es. `chi-siamo.json` → `/chi-siamo`).
- **`src/components/<sectionType>/`** — **Capsula piena:** View.tsx, schema.ts, types.ts, index.ts.
- **`src/lib/base-schemas.ts`** — BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema.
- **`src/lib/schemas.ts`** — SECTION_SCHEMAS (aggregato degli schema data per tipo) + export SectionType.
- **`src/lib/ComponentRegistry.tsx`** — Registry tipizzato: `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }`.
- **`src/lib/addSectionConfig.ts`** — AddSectionConfig (addableSectionTypes, sectionTypeLabels, getDefaultSectionData).
- **`src/types.ts`** — SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **module augmentation** per SectionDataRegistry e SectionSettingsRegistry; re-export da `@olonjs/core`.
- **`src/App.tsx`** — Bootstrap: config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection); `<JsonPagesEngine config={config} />`.
- **CSS globale** — Include i selettori TOCC per overlay (hover/selected/type label).

---

## 3. Componenti (capsule + IDAC + token)

- **Capsula:** Ogni section type ha View, schema (Zod), types (inferiti), index. Lo schema **data** estende BaseSectionData; gli item degli array estendono BaseArrayItem.
- **View:** Riceve `data` e `settings` (e `menu` per header). Non importa Zod. Usa **solo** variabili CSS per colori/raggi (es. `bg-[var(--local-bg)]`), sezione root con `z-index` ≤ 1.
- **IDAC (ICE):** Su ogni campo editabile in modo scalare: **`data-jp-field="<fieldKey>"`**. Su ogni item di array editabile: **`data-jp-item-id="<stableId>"`** e **`data-jp-item-field="<arrayKey>"`**. Così l'Inspector può legare selezione e form ai path corretti.
- **Schema:** Usa il vocabolario UI (ECIP): `.describe('ui:text')`, `ui:textarea`, `ui:select`, `ui:number`, `ui:list`, `ui:icon-picker`, **`ui:image-picker`** (vedi §3.1). Array di oggetti editabili: ogni oggetto con `id` (BaseArrayItem).

**Perché servono (componenti):** **data-jp-field** e **data-jp-item-*** servono perché lo Stage è in un iframe e il Core deve sapere quale campo/item corrisponde al click senza conoscere il DOM del Tenant: così la sidebar può evidenziare la riga attiva (anche con opacità diversa per attivo/inattivo), aprire il form sul campo giusto e gestire liste (reorder, delete). Senza IDAC, click sul canvas non si riflette nella sidebar. Schema con `ui:*` e BaseArrayItem servono al Form Factory per generare i widget giusti e mantenere chiavi stabili (reorder/delete). Token e z-index evitano che il contenuto copra l'overlay. Vedi spec §6 (IDAC), §5 (ECIP), §4 (CIP).

---

## 3.1 Image Picker: uso corretto nello schema (esempio `image-break`)

Per i **campi immagine** il Form Factory espone il widget **Image Picker** solo se lo schema è modellato correttamente.

### Regola

- Il campo immagine non è una **stringa** (`z.string()`), ma un **oggetto** con almeno `url` e, opzionalmente, `alt`.
- Lo **schema di questo oggetto** (il sub-schema) va marcato con **`.describe('ui:image-picker')`**. Il Form Factory riconosce `ui:image-picker` solo su **ZodObject** (schema oggetto), non su campi stringa.

### Esempio (capsula `image-break`)

**Schema (`schema.ts`):**

```ts
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

const ImageSelectionSchema = z
  .object({
    url: z.string(),
    alt: z.string().optional(),
  })
  .describe('ui:image-picker');

export const ImageBreakSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  image: ImageSelectionSchema.default({ url: '', alt: '' }),
  caption: z.string().optional().describe('ui:textarea'),
});
```

- **ImageSelectionSchema** è un `z.object({ url, alt })` con **`.describe('ui:image-picker')`** sull'oggetto.
- Il campo **`image`** nella section data usa quel schema (con default) così l'Inspector mostra il widget Image Picker per `image`.

**View (`View.tsx`):**

- Per il `src` dell'immagine: **`resolveAssetUrl(data.image.url, tenantId)`** (multi-tenant e path relativi).
- Sul nodo che rappresenta l'immagine (es. il `<img>` o un wrapper): **`data-jp-field="image"`** così il click in Stage lega l'Inspector al campo `image`.
- Altri campi editabili (caption, label) con **`data-jp-field="caption"`** e **`data-jp-field="label"`** dove appropriato.

**Riferimento completo:** `apps/tenant-alpha/src/components/image-break/` (schema.ts, types.ts, View.tsx, index.ts).

### Cosa evitare

- **Non** usare `.describe('ui:image-picker')` su un campo **stringa** (es. `imageUrl: z.string().describe('ui:image-picker')`): il widget Image Picker si aspetta un oggetto `{ url, alt? }`.
- **Non** dimenticare `data-jp-field="image"` sul nodo corrispondente nel DOM, altrimenti il binding Inspector ↔ Stage non funziona per quel campo.

---

## 4. Dati: forma e responsabilità

- **site.json / menu.json / theme.json / pages/*.json** — Forma esatta come in Appendix A (SiteConfig, MenuConfig, ThemeConfig, PageConfig). Sono la source of truth quando l'utente salva da Studio (Working Draft → persist su questi file o su API che li generano).
- **Studio** aggiorna il Working Draft; il sync con l'iframe e il "Bake" usano la stessa struttura. Quindi i dati che passi a JsonPagesEngine (siteConfig, menuConfig, pages) devono essere compatibili con ciò che l'editor modifica.

Se i dati arrivano da un CMS esterno, tocca a te sincronizzare: es. export da Studio → push su CMS, oppure CMS come source e Studio in read-only; in ogni caso la **forma** delle pagine (sections con id, type, data, settings) resta quella della spec.

---

## 5. Registry, schemas, types, addSection

- **types.ts:** Unico punto di **module augmentation** e definizione di SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig. Header: `{ data, settings?, menu: MenuItem[] }`; tutti gli altri: `{ data, settings? }`.
- **ComponentRegistry:** Ogni chiave di SectionType ha il componente corrispondente; tipo: `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }`.
- **SECTION_SCHEMAS:** Ogni chiave di SectionType ha lo **schema Zod della data** (stesso ordine del registry). Base schemas re-exportati da base-schemas.ts.
- **addSectionConfig:** addableSectionTypes (solo i tipi che l'utente può aggiungere dalla libreria), sectionTypeLabels, getDefaultSectionData(type) che restituisce `data` valido per quello schema.

**Perché servono (registry, schemas, types, addSection):** Un solo punto di augmentation (types.ts) e un solo SECTION_SCHEMAS evita duplicazioni e garantisce che registry, Form Factory e config usino gli stessi tipi. AddSectionConfig è l'unica fonte di verità per "quali section si possono aggiungere" e "con quali default"; senza, il modal "Aggiungi sezione" non avrebbe nomi né dati iniziali validi. Vedi spec §9 (ASC), Appendix A.2–A.3.

---

## 6. Overlay e CSS (TOCC)

- Il Core inietta il markup dell'overlay (wrapper con `data-section-id`, sibling con `data-jp-section-overlay`). Il **tenant** deve fornire il CSS in modo che:
  - `[data-jp-section-overlay]` copra la section, `pointer-events: none`, z-index alto (es. 9999).
  - Hover e selected siano visibili (bordo tratteggiato / pieno, eventuale tint).
  - Il type label (es. `[data-jp-section-overlay] > div`) sia posizionato e visibile su hover/selected.

Senza questo, in Studio l'overlay non si vede nell'iframe.

**Perché servono (TOCC):** L'iframe dello Stage carica solo il CSS del Tenant; il Core inietta il markup dell'overlay ma non gli stili. Senza i selettori TOCC nel CSS tenant, bordo hover/selected e type label non sono visibili: l'autore non vede quale section è selezionata. Vedi spec §7 (TOCC).

---

## 7. Checklist rapida (sviluppo grafico e dati, con CMS)

| Cosa | Azione |
|------|--------|
| **Layout / grafico** | View con variabili `--local-*`, z-index ≤ 1, nessuna utility naked. |
| **Dati (forma)** | SiteConfig, MenuConfig, ThemeConfig, PageConfig come in Appendix A; JSON in `data/config` e `data/pages`. |
| **Nuova pagina** | Aggiungere un file `<slug>.json` in `src/data/pages/` (lo slug diventa il path della pagina). |
| **Capsule** | View + schema (con ui:*) + types + index; data schema estende BaseSectionData; array item con id. |
| **IDAC** | data-jp-field su campi scalari editabili; data-jp-item-id e data-jp-item-field su item di array. |
| **Image Picker** | Campo immagine = oggetto `{ url, alt? }` con sub-schema `.describe('ui:image-picker')`; View con `resolveAssetUrl` e `data-jp-field="image"`. Esempio: `image-break`. |
| **types.ts** | SectionComponentPropsMap (header con menu), augmentation, PageConfig, SiteConfig, MenuConfig, ThemeConfig. |
| **Registry** | Tutti i tipi mappati al componente; tipo registry come in Appendix A. |
| **SECTION_SCHEMAS** | Un entry per tipo (schema data); re-export base schemas. |
| **addSectionConfig** | addableSectionTypes, sectionTypeLabels, getDefaultSectionData. |
| **Config** | tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection. |
| **TOCC** | CSS overlay per [data-jp-section-overlay], hover, selected, type label. |

---

## 8. Riferimenti spec

- **Architettura e ICE:** §1–§10 (MTRP, JSP, TBP, CIP, ECIP, IDAC, TOCC, BSDS, ASC, JEB).
- **Tipi e code-generation:** Appendix A (Core types, Tenant types, Schema contract, File paths, Integration checklist).
- **Admin:** JAP (Studio topology, Working Draft, Bake, overlay, Green Build).

Usando questo percorso hai **governance** piena: tipi, schema, editor, Add Section e overlay allineati alle spec v1.2. Per le versioni con tutti i "Perché servono" usa il file **JSONPAGES_Specs_v1.2_completo.md**.

END_OF_FILE_CONTENT
mkdir -p "docs/ver"
echo "Creating index.html..."
cat << 'END_OF_FILE_CONTENT' > "index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Olon — Agentic Content Infrastructure" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <title>Olon</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


END_OF_FILE_CONTENT
echo "Creating package.json..."
cat << 'END_OF_FILE_CONTENT' > "package.json"
{
  "name": "tenant-alpha",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:clean": "vite --force",
    "prebuild": "node scripts/sync-pages-to-public.mjs",
    "build": "tsc && vite build",
    "dist": "bash ./src2Code.sh --template alpha src vercel.json index.html vite.config.ts scripts docs package.json",
    "preview": "vite preview",
    "bake:email": "tsx scripts/bake-email.tsx",
    "bakemail": "npm run bake:email --",
    "dist:dna": "npm run dist"
  },
  "dependencies": {
    "@tiptap/extension-image": "^2.11.5",
    "@tiptap/extension-link": "^2.11.5",
    "@tiptap/react": "^2.11.5",
    "@tiptap/starter-kit": "^2.11.5",
    "@olonjs/core": "^1.0.75",
    "clsx": "^2.1.1",
    "lucide-react": "^0.474.0",
    "react": "^19.0.0",
    "react-markdown": "^9.0.1",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.30.3",
    "rehype-sanitize": "^6.0.0",
    "remark-gfm": "^4.0.1",
    "tailwind-merge": "^3.0.1",
    "tiptap-markdown": "^0.8.10",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.11",
    "@react-email/components": "^0.0.41",
    "@react-email/render": "^1.0.5",
    "tsx": "^4.20.5"
  }
}

END_OF_FILE_CONTENT
mkdir -p "scripts"
echo "Creating scripts/bake-email.tsx..."
cat << 'END_OF_FILE_CONTENT' > "scripts/bake-email.tsx"
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { render } from "@react-email/render";
import React from "react";

type Args = {
  entry?: string;
  out?: string;
  outDir?: string;
  exportName?: string;
  propsFile?: string;
  siteConfig?: string;
  themeConfig?: string;
};

type BakeTarget = {
  entryAbs: string;
  outAbs: string;
};

type SiteConfig = {
  identity?: {
    title?: string;
    logoUrl?: string;
  };
  header?: {
    data?: {
      logoImageUrl?: {
        url?: string;
        alt?: string;
      };
    };
  };
  footer?: {
    data?: {
      brandText?: string;
      brandHighlight?: string;
      tagline?: string;
      logoImageUrl?: {
        url?: string;
        alt?: string;
      };
    };
  };
};

type ThemeConfig = {
  tokens?: {
    colors?: Record<string, string>;
    typography?: {
      fontFamily?: Record<string, string>;
    };
    borderRadius?: Record<string, string>;
  };
};

const DEFAULT_EMAIL_DIR = "src/emails";
const DEFAULT_OUT_DIR = "email-templates";
const DEFAULT_SITE_CONFIG = "src/data/config/site.json";
const DEFAULT_THEME_CONFIG = "src/data/config/theme.json";

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];
    if (!next) continue;
    if (key === "--entry") {
      args.entry = next;
      i += 1;
      continue;
    }
    if (key === "--out") {
      args.out = next;
      i += 1;
      continue;
    }
    if (key === "--out-dir") {
      args.outDir = next;
      i += 1;
      continue;
    }
    if (key === "--export") {
      args.exportName = next;
      i += 1;
      continue;
    }
    if (key === "--props") {
      args.propsFile = next;
      i += 1;
      continue;
    }
    if (key === "--site-config") {
      args.siteConfig = next;
      i += 1;
      continue;
    }
    if (key === "--theme-config") {
      args.themeConfig = next;
      i += 1;
    }
  }
  return args;
}

function isComponentExport(value: unknown): value is React.ComponentType<any> {
  return typeof value === "function";
}

function toKebabCase(value: string): string {
  return value
    .replace(/Email$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function deriveOutAbs(entryAbs: string, outDirAbs: string): string {
  const base = path.basename(entryAbs).replace(/\.[^.]+$/, "");
  const fileName = `${toKebabCase(base)}.html`;
  return path.join(outDirAbs, fileName);
}

async function discoverEmailEntries(rootDir: string): Promise<string[]> {
  const abs = path.resolve(process.cwd(), rootDir);
  const dirEntries = await fs.readdir(abs, { withFileTypes: true }).catch(() => []);
  return dirEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(tsx|jsx)$/i.test(name))
    .map((name) => path.join(abs, name));
}

function normalizeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

async function readJsonObject<T>(filePath: string): Promise<T | null> {
  const abs = path.resolve(process.cwd(), filePath);
  const raw = await fs.readFile(abs, "utf8").catch(() => null);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  return parsed as T;
}

function buildDefaultProps(site: SiteConfig | null, theme: ThemeConfig | null): Record<string, unknown> {
  const footerBrandText = site?.footer?.data?.brandText?.trim() ?? "";
  const footerBrandHighlight = site?.footer?.data?.brandHighlight?.trim() ?? "";
  const brandName = `${footerBrandText}${footerBrandHighlight}`.trim() || "{{tenantName}}";

  const tenantName = site?.identity?.title?.trim() || brandName;
  const logoUrl =
    normalizeUrl(site?.header?.data?.logoImageUrl?.url) ||
    normalizeUrl(site?.footer?.data?.logoImageUrl?.url) ||
    normalizeUrl(site?.identity?.logoUrl) ||
    "";
  const logoAlt =
    site?.header?.data?.logoImageUrl?.alt?.trim() ||
    site?.footer?.data?.logoImageUrl?.alt?.trim() ||
    brandName;
  const tagline = site?.footer?.data?.tagline?.trim() || "";

  return {
    tenantName,
    brandName,
    logoUrl,
    logoAlt,
    tagline,
    theme: theme?.tokens ?? {},
    correlationId: "{{correlationId}}",
    replyTo: "{{replyTo}}",
    leadData: {
      name: "{{lead.name}}",
      email: "{{lead.email}}",
      phone: "{{lead.phone}}",
      checkin: "{{lead.checkin}}",
      checkout: "{{lead.checkout}}",
      guests: "{{lead.guests}}",
      notes: "{{lead.notes}}",
    },
  };
}

async function readProps(
  propsFile: string | undefined,
  siteConfigPath: string,
  themeConfigPath: string
): Promise<Record<string, unknown>> {
  if (propsFile) {
    const raw = await fs.readFile(path.resolve(process.cwd(), propsFile), "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("--props must point to a JSON object file");
    }
    return parsed as Record<string, unknown>;
  }

  const site = await readJsonObject<SiteConfig>(siteConfigPath);
  const theme = await readJsonObject<ThemeConfig>(themeConfigPath);
  return buildDefaultProps(site, theme);
}

async function buildTargets(args: Args): Promise<BakeTarget[]> {
  const outDirAbs = path.resolve(process.cwd(), args.outDir ?? DEFAULT_OUT_DIR);

  if (args.entry) {
    const entryAbs = path.resolve(process.cwd(), args.entry);
    const outAbs = args.out ? path.resolve(process.cwd(), args.out) : deriveOutAbs(entryAbs, outDirAbs);
    return [{ entryAbs, outAbs }];
  }

  const discovered = await discoverEmailEntries(DEFAULT_EMAIL_DIR);
  if (discovered.length === 0) {
    throw new Error(`No templates found in ${DEFAULT_EMAIL_DIR}`);
  }

  return discovered.map((entryAbs) => ({
    entryAbs,
    outAbs: deriveOutAbs(entryAbs, outDirAbs),
  }));
}

async function bakeTemplate(target: BakeTarget, args: Args, props: Record<string, unknown>) {
  const moduleUrl = pathToFileURL(target.entryAbs).href;
  const mod = (await import(moduleUrl)) as Record<string, unknown>;
  const picked = args.exportName ? mod[args.exportName] : mod.default;

  if (!isComponentExport(picked)) {
    const available = Object.keys(mod).join(", ") || "(none)";
    throw new Error(
      `Template export not found or not a component. Requested: ${args.exportName ?? "default"}. Available exports: ${available}. Entry: ${target.entryAbs}`
    );
  }

  const element = React.createElement(picked, props);
  const html = await render(element, { pretty: true });

  await fs.mkdir(path.dirname(target.outAbs), { recursive: true });
  await fs.writeFile(target.outAbs, html, "utf8");

  console.log(`Baked email template: ${path.relative(process.cwd(), target.outAbs)}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targets = await buildTargets(args);
  const props = await readProps(
    args.propsFile,
    args.siteConfig ?? DEFAULT_SITE_CONFIG,
    args.themeConfig ?? DEFAULT_THEME_CONFIG
  );

  for (const target of targets) {
    await bakeTemplate(target, args, props);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

END_OF_FILE_CONTENT
echo "Creating scripts/sync-pages-to-public.mjs..."
cat << 'END_OF_FILE_CONTENT' > "scripts/sync-pages-to-public.mjs"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'src', 'data', 'pages');
const targetDir = path.join(rootDir, 'public', 'pages');

if (!fs.existsSync(sourceDir)) {
  console.warn('[sync-pages-to-public] Source directory not found:', sourceDir);
  process.exit(0);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log('[sync-pages-to-public] Synced pages to public/pages');

END_OF_FILE_CONTENT
mkdir -p "src"
echo "Creating src/App.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/App.tsx"
/**
 * Thin Entry Point (Tenant).
 * Data from getHydratedData (file-backed or draft); assets from public/assets/images.
 * Supports Hybrid Persistence: Local Filesystem (Dev) or Cloud Bridge (Prod).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JsonPagesEngine } from '@olonjs/core';
import type { JsonPagesConfig, LibraryImageEntry, ProjectState } from '@olonjs/core';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import { getHydratedData } from '@/lib/draftStorage';
import type { SiteConfig, ThemeConfig, MenuConfig, PageConfig } from '@/types';
import type { DeployPhase, StepId } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import { startCloudSaveStream } from '@/lib/cloudSaveStream';
import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import { getFilePages } from '@/lib/getFilePages';
import { DopaDrawer } from '@/components/save-drawer/DopaDrawer';
import { Skeleton } from '@/components/ui/skeleton';

import tenantCss from './index.css?inline';

// Cloud Configuration (Injected by Vercel/Netlify Env Vars)
const CLOUD_API_URL =
  import.meta.env.VITE_OLONJS_CLOUD_URL ?? import.meta.env.VITE_JSONPAGES_CLOUD_URL;
const CLOUD_API_KEY =
  import.meta.env.VITE_OLONJS_API_KEY ?? import.meta.env.VITE_JSONPAGES_API_KEY;

const themeConfig = themeData as unknown as ThemeConfig;
const menuConfig = menuData as unknown as MenuConfig;
const TENANT_ID = 'alpha';

const filePages = getFilePages();
const fileSiteConfig = siteData as unknown as SiteConfig;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

interface CloudSaveUiState {
  isOpen: boolean;
  phase: DeployPhase;
  currentStepId: StepId | null;
  doneSteps: StepId[];
  progress: number;
  errorMessage?: string;
  deployUrl?: string;
}

type ContentMode = 'cloud' | 'error';
type ContentStatus = 'ok' | 'empty_namespace' | 'legacy_fallback';

type ContentResponse = {
  ok?: boolean;
  siteConfig?: unknown;
  pages?: unknown;
  items?: unknown;
  error?: string;
  code?: string;
  correlationId?: string;
  contentStatus?: ContentStatus;
  usedUnscopedFallback?: boolean;
  namespace?: string;
  namespaceMatchedKeys?: number;
};

type CachedCloudContent = {
  keyFingerprint: string;
  savedAt: number;
  siteConfig: unknown | null;
  pages: Record<string, unknown>;
};

const CLOUD_CACHE_KEY = 'jp_cloud_content_cache_v1';
const CLOUD_CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeApiBase(raw: string): string {
  return raw.trim().replace(/\/+$/, '');
}

function buildApiCandidates(raw: string): string[] {
  const base = normalizeApiBase(raw);
  const withApi = /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
  const candidates = [withApi, base];
  return Array.from(new Set(candidates.filter(Boolean)));
}

function getInitialData() {
  return getHydratedData(TENANT_ID, filePages, fileSiteConfig);
}

function getInitialCloudSaveUiState(): CloudSaveUiState {
  return {
    isOpen: false,
    phase: 'idle',
    currentStepId: null,
    doneSteps: [],
    progress: 0,
  };
}

function stepProgress(doneSteps: StepId[]): number {
  return Math.round((doneSteps.length / DEPLOY_STEPS.length) * 100);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function coercePageConfig(slug: string, value: unknown): PageConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input) || !Array.isArray(input.sections)) return null;

  const inputMeta = isObjectRecord(input.meta) ? input.meta : {};
  const normalizedSlug = asString(input.slug, slug);
  const normalizedId = asString(input.id, `${normalizedSlug}-page`);
  const title = asString(inputMeta.title, normalizedSlug);
  const description = asString(inputMeta.description, '');

  return {
    id: normalizedId,
    slug: normalizedSlug,
    meta: { title, description },
    sections: input.sections as PageConfig['sections'],
  };
}

function coerceSiteConfig(value: unknown): SiteConfig | null {
  let input = value;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }
  if (!isObjectRecord(input)) return null;
  if (!isObjectRecord(input.identity)) return null;
  if (!Array.isArray(input.pages)) return null;

  return input as unknown as SiteConfig;
}

function toPagesRecord(value: unknown): Record<string, PageConfig> | null {
  const directPage = coercePageConfig('home', value);
  if (directPage) {
    const directSlug = asString(directPage.slug, 'home')
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '') || 'home';
    return { [directSlug]: directPage };
  }

  if (!isObjectRecord(value)) return null;
  const next: Record<string, PageConfig> = {};
  for (const [rawKey, payload] of Object.entries(value)) {
    const rawKeyTrimmed = rawKey.trim();
    const slugFromNamespacedKey = rawKeyTrimmed.match(/^t_[a-z0-9-]+_page_(.+)$/i)?.[1];
    const normalizedSlug = (slugFromNamespacedKey ?? rawKeyTrimmed)
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '');
    const slug = normalizedSlug || 'home';
    const page = coercePageConfig(slug, payload);
    if (!page) continue;
    next[slug] = page;
  }
  return next;
}

function normalizePageRegistry(value: unknown): Record<string, PageConfig> {
  if (!isObjectRecord(value)) return {};
  const normalized: Record<string, PageConfig> = {};

  for (const [registrySlug, rawPageValue] of Object.entries(value)) {
    const direct = coercePageConfig(registrySlug, rawPageValue);
    if (direct) {
      normalized[direct.slug || registrySlug] = direct;
      continue;
    }

    const nested = toPagesRecord(rawPageValue);
    if (nested && Object.keys(nested).length > 0) {
      Object.assign(normalized, nested);
    }
  }

  return normalized;
}

function extractContentSources(payload: ContentResponse | Record<string, unknown>): {
  pagesSource: unknown;
  siteSource: unknown;
} {
  // Canonical contract: { pages, siteConfig }
  if (isObjectRecord(payload) && isObjectRecord(payload.pages)) {
    return { pagesSource: payload.pages, siteSource: payload.siteConfig };
  }

  // Edge public JSON contract: { digest, updatedAt, items: { ... } }
  if (isObjectRecord(payload) && isObjectRecord(payload.items)) {
    const items = payload.items;
    let siteSource: unknown = null;
    const pageEntries: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(items)) {
      if (/(_config_site|config_site|config:site)$/i.test(key)) {
        siteSource = value;
        continue;
      }
      if (/(_page_|^page_|page:)/i.test(key)) {
        pageEntries[key] = value;
      }
    }
    return { pagesSource: pageEntries, siteSource };
  }

  // Raw map fallback: treat payload object itself as page map.
  return { pagesSource: payload, siteSource: null };
}

type CloudLoadFailure = {
  reasonCode: string;
  message: string;
  correlationId?: string;
};

function isCloudLoadFailure(value: unknown): value is CloudLoadFailure {
  return (
    isObjectRecord(value) &&
    typeof value.reasonCode === 'string' &&
    typeof value.message === 'string'
  );
}

function toCloudLoadFailure(value: unknown): CloudLoadFailure {
  if (isCloudLoadFailure(value)) return value;
  if (value instanceof Error) {
    return { reasonCode: 'CLOUD_LOAD_FAILED', message: value.message };
  }
  return { reasonCode: 'CLOUD_LOAD_FAILED', message: 'Cloud content unavailable.' };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function backoffDelayMs(attempt: number): number {
  const base = 250 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 120);
  return base + jitter;
}

function logBootstrapEvent(event: string, details: Record<string, unknown>) {
  console.info('[boot]', { event, at: new Date().toISOString(), ...details });
}

function cloudFingerprint(apiBase: string, apiKey: string): string {
  return `${normalizeApiBase(apiBase)}::${apiKey.slice(-8)}`;
}

function normalizeSlugForCache(slug: string): string {
  return (
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/^\/+|\/+$/g, '') || 'home'
  );
}

function readCachedCloudContent(fingerprint: string): CachedCloudContent | null {
  try {
    const raw = localStorage.getItem(CLOUD_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCloudContent;
    if (!parsed || parsed.keyFingerprint !== fingerprint) return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > CLOUD_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedCloudContent(entry: CachedCloudContent): void {
  try {
    localStorage.setItem(CLOUD_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // non-blocking cache path
  }
}

function buildThemeFontVarsCss(input: unknown): string {
  if (!isObjectRecord(input)) return '';
  const tokens = isObjectRecord(input.tokens) ? input.tokens : null;
  const typography = tokens && isObjectRecord(tokens.typography) ? tokens.typography : null;
  const fontFamily = typography && isObjectRecord(typography.fontFamily) ? typography.fontFamily : null;
  const primary = typeof fontFamily?.primary === 'string' ? fontFamily.primary : "'Instrument Sans', system-ui, sans-serif";
  const serif = typeof fontFamily?.serif === 'string' ? fontFamily.serif : "'Instrument Serif', Georgia, serif";
  const mono = typeof fontFamily?.mono === 'string' ? fontFamily.mono : "'JetBrains Mono', monospace";
  return `:root{--theme-font-primary:${primary};--theme-font-serif:${serif};--theme-font-mono:${mono};}`;
}

function App() {
  const isCloudMode = Boolean(CLOUD_API_URL && CLOUD_API_KEY);
  const localInitialData = useMemo(() => (isCloudMode ? null : getInitialData()), [isCloudMode]);
  const localInitialPages = useMemo(() => {
    if (!localInitialData) return {};
    const normalized = normalizePageRegistry(localInitialData.pages as unknown);
    return Object.keys(normalized).length > 0 ? normalized : localInitialData.pages;
  }, [localInitialData]);
  const [pages, setPages] = useState<Record<string, PageConfig>>(localInitialPages);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(
    localInitialData?.siteConfig ?? fileSiteConfig
  );
  const [assetsManifest, setAssetsManifest] = useState<LibraryImageEntry[]>([]);
  const [cloudSaveUi, setCloudSaveUi] = useState<CloudSaveUiState>(getInitialCloudSaveUiState);
  const [contentMode, setContentMode] = useState<ContentMode>('cloud');
  const [contentFallback, setContentFallback] = useState<CloudLoadFailure | null>(null);
  const [showTopProgress, setShowTopProgress] = useState(false);
  const [hasInitialCloudResolved, setHasInitialCloudResolved] = useState(!isCloudMode);
  const [bootstrapRunId, setBootstrapRunId] = useState(0);
  const activeCloudSaveController = useRef<AbortController | null>(null);
  const contentLoadInFlight = useRef<Promise<void> | null>(null);
  const pendingCloudSave = useRef<{ state: ProjectState; slug: string } | null>(null);
  const cloudApiCandidates = useMemo(
    () => (isCloudMode && CLOUD_API_URL ? buildApiCandidates(CLOUD_API_URL) : []),
    [isCloudMode, CLOUD_API_URL]
  );

  useEffect(() => {
    // In Cloud mode, listing assets might be different or disabled for MVP
    // For now, we keep the local fetch which will fail gracefully on Vercel (404)
    fetch('/api/list-assets')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LibraryImageEntry[]) => setAssetsManifest(Array.isArray(list) ? list : []))
      .catch(() => setAssetsManifest([]));
  }, []);

  useEffect(() => {
    return () => {
      activeCloudSaveController.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
      setContentMode('cloud');
      setContentFallback(null);
      setShowTopProgress(false);
      setHasInitialCloudResolved(true);
      logBootstrapEvent('boot.local.ready', { mode: 'local' });
      return;
    }
    if (contentLoadInFlight.current) {
      return;
    }

    const controller = new AbortController();
    const maxRetryAttempts = 2;
    const startedAt = Date.now();
    const primaryApiBase = cloudApiCandidates[0] ?? normalizeApiBase(CLOUD_API_URL);
    const fingerprint = cloudFingerprint(primaryApiBase, CLOUD_API_KEY);
    const cached = readCachedCloudContent(fingerprint);
    const cachedPages = cached ? toPagesRecord(cached.pages) : null;
    const cachedSite = cached ? coerceSiteConfig(cached.siteConfig) : null;
    const hasCachedFallback = Boolean((cachedPages && Object.keys(cachedPages).length > 0) || cachedSite);
    if (cached) {
      logBootstrapEvent('boot.cloud.cache_hit', { ageMs: Date.now() - cached.savedAt });
    }
    setContentMode('cloud');
    setContentFallback(null);
    setShowTopProgress(true);
    setHasInitialCloudResolved(false);
    logBootstrapEvent('boot.start', { mode: 'cloud', apiCandidates: cloudApiCandidates.length });

    const loadCloudContent = async () => {
      try {
        let payload: ContentResponse | null = null;
        let lastFailure: CloudLoadFailure | null = null;

        for (const apiBase of cloudApiCandidates) {
          for (let attempt = 0; attempt <= maxRetryAttempts; attempt += 1) {
            try {
              const res = await fetch(`${apiBase}/content`, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                  Authorization: `Bearer ${CLOUD_API_KEY}`,
                },
                signal: controller.signal,
              });

              const contentType = (res.headers.get('content-type') || '').toLowerCase();
              if (!contentType.includes('application/json')) {
                lastFailure = {
                  reasonCode: 'NON_JSON_RESPONSE',
                  message: `Non-JSON response from ${apiBase}/content`,
                };
                break;
              }

              const parsed = (await res.json().catch(() => ({}))) as ContentResponse;
              if (!res.ok) {
                lastFailure = {
                  reasonCode: parsed.code || `HTTP_${res.status}`,
                  message: parsed.error || `Cloud content read failed: ${res.status} (${apiBase}/content)`,
                  correlationId: parsed.correlationId,
                };
                if (isRetryableStatus(res.status) && attempt < maxRetryAttempts) {
                  await sleep(backoffDelayMs(attempt));
                  continue;
                }
                break;
              }

              payload = parsed;
              break;
            } catch (error: unknown) {
              if (controller.signal.aborted) throw error;
              const message = error instanceof Error ? error.message : 'Network error';
              lastFailure = {
                reasonCode: 'NETWORK_TRANSIENT',
                message: `${message} (${apiBase}/content)`,
              };
              if (attempt < maxRetryAttempts) {
                await sleep(backoffDelayMs(attempt));
                continue;
              }
            }
          }
          if (payload) {
            break;
          }
        }

        if (!payload) {
          throw (
            lastFailure || {
              reasonCode: 'CLOUD_ENDPOINT_UNREACHABLE',
              message: 'Cloud content endpoint not reachable as JSON.',
            }
          );
        }

        const { pagesSource, siteSource } = extractContentSources(payload);
        const remotePages = toPagesRecord(pagesSource);
        const remoteSite = coerceSiteConfig(siteSource);
        const remotePageCount = remotePages ? Object.keys(remotePages).length : 0;
        if (remotePageCount === 0 && !remoteSite) {
          throw {
            reasonCode: payload.contentStatus === 'empty_namespace' ? 'EMPTY_NAMESPACE' : 'EMPTY_PAYLOAD',
            message: 'Cloud payload is empty for this tenant namespace.',
            correlationId: payload.correlationId,
          } satisfies CloudLoadFailure;
        }
        if (import.meta.env.DEV) {
          console.info('[content] cloud diagnostics', {
            contentStatus: payload.contentStatus ?? 'ok',
            namespace: payload.namespace,
            namespaceMatchedKeys: payload.namespaceMatchedKeys,
            usedUnscopedFallback: payload.usedUnscopedFallback,
            correlationId: payload.correlationId,
          });
        }
        if (remotePages && remotePageCount > 0) {
          setPages(remotePages);
        }
        if (remoteSite) {
          setSiteConfig(remoteSite);
        }
        writeCachedCloudContent({
          keyFingerprint: fingerprint,
          savedAt: Date.now(),
          siteConfig: remoteSite ?? null,
          pages: (remotePages ?? {}) as Record<string, unknown>,
        });
        setContentMode('cloud');
        setContentFallback(null);
        setHasInitialCloudResolved(true);
        logBootstrapEvent('boot.cloud.success', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          contentStatus: payload.contentStatus ?? 'ok',
          correlationId: payload.correlationId ?? null,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const failure = toCloudLoadFailure(error);
        if (hasCachedFallback) {
          if (cachedPages && Object.keys(cachedPages).length > 0) {
            setPages(cachedPages);
          }
          if (cachedSite) {
            setSiteConfig(cachedSite);
          }
          setContentMode('cloud');
          setContentFallback({
            reasonCode: 'CLOUD_REFRESH_FAILED',
            message: failure.message,
            correlationId: failure.correlationId,
          });
          setHasInitialCloudResolved(true);
        } else {
          setContentMode('error');
          setContentFallback(failure);
          setHasInitialCloudResolved(true);
        }
        logBootstrapEvent('boot.cloud.error', {
          mode: 'cloud',
          elapsedMs: Date.now() - startedAt,
          reasonCode: failure.reasonCode,
          correlationId: failure.correlationId ?? null,
        });
      }
    };

    let inFlight: Promise<void> | null = null;
    inFlight = loadCloudContent().finally(() => {
      setShowTopProgress(false);
      if (contentLoadInFlight.current === inFlight) {
        contentLoadInFlight.current = null;
      }
    });
    contentLoadInFlight.current = inFlight;
    return () => controller.abort();
  }, [isCloudMode, CLOUD_API_KEY, CLOUD_API_URL, cloudApiCandidates, bootstrapRunId]);

  const runCloudSave = useCallback(
    async (
      payload: { state: ProjectState; slug: string },
      rejectOnError: boolean
    ): Promise<void> => {
      if (!CLOUD_API_URL || !CLOUD_API_KEY) {
        const noCloudError = new Error('Cloud mode is not configured.');
        if (rejectOnError) throw noCloudError;
        return;
      }

      pendingCloudSave.current = payload;
      activeCloudSaveController.current?.abort();
      const controller = new AbortController();
      activeCloudSaveController.current = controller;

      setCloudSaveUi({
        isOpen: true,
        phase: 'running',
        currentStepId: null,
        doneSteps: [],
        progress: 0,
      });

      try {
        await startCloudSaveStream({
          apiBaseUrl: CLOUD_API_URL,
          apiKey: CLOUD_API_KEY,
          path: `src/data/pages/${payload.slug}.json`,
          content: payload.state.page,
          message: `Content update for ${payload.slug} via Visual Editor`,
          signal: controller.signal,
          onStep: (event) => {
            setCloudSaveUi((prev) => {
              if (event.status === 'running') {
                return {
                  ...prev,
                  isOpen: true,
                  phase: 'running',
                  currentStepId: event.id,
                  errorMessage: undefined,
                };
              }

              if (prev.doneSteps.includes(event.id)) {
                return prev;
              }

              const nextDone = [...prev.doneSteps, event.id];
              return {
                ...prev,
                isOpen: true,
                phase: 'running',
                currentStepId: event.id,
                doneSteps: nextDone,
                progress: stepProgress(nextDone),
              };
            });
          },
          onDone: (event) => {
            const completed = DEPLOY_STEPS.map((step) => step.id);
            setCloudSaveUi({
              isOpen: true,
              phase: 'done',
              currentStepId: 'live',
              doneSteps: completed,
              progress: 100,
              deployUrl: event.deployUrl,
            });
          },
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Cloud save failed.';
        setCloudSaveUi((prev) => ({
          ...prev,
          isOpen: true,
          phase: 'error',
          errorMessage: message,
        }));
        if (rejectOnError) throw new Error(message);
      } finally {
        if (activeCloudSaveController.current === controller) {
          activeCloudSaveController.current = null;
        }
      }
    },
    []
  );

  const closeCloudDrawer = useCallback(() => {
    setCloudSaveUi(getInitialCloudSaveUiState());
  }, []);

  const retryCloudSave = useCallback(() => {
    if (!pendingCloudSave.current) return;
    void runCloudSave(pendingCloudSave.current, false);
  }, [runCloudSave]);

  const config: JsonPagesConfig = {
    tenantId: TENANT_ID,
    registry: ComponentRegistry as JsonPagesConfig['registry'],
    schemas: SECTION_SCHEMAS as unknown as JsonPagesConfig['schemas'],
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    themeCss: { tenant: `${buildThemeFontVarsCss(themeConfig)}\n${tenantCss}` },
    addSection: addSectionConfig,
    persistence: {
      async saveToFile(state: ProjectState, slug: string): Promise<void> {
        // 💻 LOCAL FILESYSTEM (Development / legacy fallback)
        console.log(`💻 Saving ${slug} to Local Filesystem...`);
        const res = await fetch('/api/save-to-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectState: state, slug }),
        });
        
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(body.error ?? `Save to file failed: ${res.status}`);
      },
      async hotSave(state: ProjectState, slug: string): Promise<void> {
        if (!isCloudMode || !CLOUD_API_URL || !CLOUD_API_KEY) {
          throw new Error('Cloud mode is not configured for hot save.');
        }
        const apiBase = CLOUD_API_URL.replace(/\/$/, '');
        const res = await fetch(`${apiBase}/hotSave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CLOUD_API_KEY}`,
          },
          body: JSON.stringify({
            slug,
            page: state.page,
            siteConfig: state.site,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        if (!res.ok) {
          throw new Error(body.error || body.code || `Hot save failed: ${res.status}`);
        }
        const keyFingerprint = cloudFingerprint(apiBase, CLOUD_API_KEY);
        const normalizedSlug = normalizeSlugForCache(slug);
        const existing = readCachedCloudContent(keyFingerprint);
        writeCachedCloudContent({
          keyFingerprint,
          savedAt: Date.now(),
          siteConfig: state.site ?? null,
          pages: {
            ...(existing?.pages ?? {}),
            [normalizedSlug]: state.page,
          },
        });
      },
      showLegacySave: !isCloudMode,
      showHotSave: isCloudMode,
    },
    assets: {
      assetsBaseUrl: '/assets',
      assetsManifest,
      async onAssetUpload(file: File): Promise<string> {
        // Note: Asset upload in Cloud Mode requires the R2 Bridge (Next Step in Roadmap)
        // For now, this works in Local Mode.
        if (!file.type.startsWith('image/')) throw new Error('Invalid file type.');
        if (file.size > MAX_UPLOAD_SIZE_BYTES) throw new Error(`File too large. Max ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`);
        
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = () => resolve((reader.result as string).split(',')[1] ?? '');
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, mimeType: file.type || undefined, data: base64 }),
        });
        
        const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok) throw new Error(body.error || `Upload failed: ${res.status}`);
        if (typeof body.url !== 'string') throw new Error('Invalid server response: missing url');
        return body.url;
      },
    },
  };

  const shouldRenderEngine = !isCloudMode || hasInitialCloudResolved;

  return (
    <>
      {isCloudMode && showTopProgress ? (
        <>
          <style>
            {`@keyframes jp-top-progress-slide { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }`}
          </style>
          <div
            role="status"
            aria-live="polite"
            aria-label="Cloud loading progress"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              zIndex: 1300,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '32%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(88,166,255,0.15) 0%, rgba(88,166,255,0.85) 50%, rgba(88,166,255,0.15) 100%)',
                animation: 'jp-top-progress-slide 1.15s ease-in-out infinite',
                willChange: 'transform',
              }}
            />
          </div>
        </>
      ) : null}
      {isCloudMode && !hasInitialCloudResolved ? (
        <div className="fixed inset-0 z-[1290] bg-background/80 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[1600px] p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {shouldRenderEngine ? <JsonPagesEngine config={config} /> : null}
      {isCloudMode && (contentMode === 'error' || contentFallback?.reasonCode === 'CLOUD_REFRESH_FAILED') ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 1200,
            background: 'rgba(179, 65, 24, 0.92)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 12,
            maxWidth: 360,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          {contentMode === 'error' ? 'Cloud content unavailable.' : 'Cloud refresh failed, showing cached content.'}
          {contentFallback ? (
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              <div>{contentFallback.message}</div>
              <div style={{ marginTop: 2 }}>
                Reason: {contentFallback.reasonCode}
                {contentFallback.correlationId ? ` | Correlation: ${contentFallback.correlationId}` : ''}
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    contentLoadInFlight.current = null;
                    setContentMode('cloud');
                    setContentFallback(null);
                    setHasInitialCloudResolved(false);
                    setShowTopProgress(true);
                    setBootstrapRunId((prev) => prev + 1);
                  }}
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <DopaDrawer
        isOpen={cloudSaveUi.isOpen}
        phase={cloudSaveUi.phase}
        currentStepId={cloudSaveUi.currentStepId}
        doneSteps={cloudSaveUi.doneSteps}
        progress={cloudSaveUi.progress}
        errorMessage={cloudSaveUi.errorMessage}
        deployUrl={cloudSaveUi.deployUrl}
        onClose={closeCloudDrawer}
        onRetry={retryCloudSave}
      />
    </>
  );
}

export default App;


END_OF_FILE_CONTENT
mkdir -p "src/components"
echo "Creating src/components/NotFound.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/NotFound.tsx"
import React from 'react';
import { Icon } from '@/lib/IconResolver';

export const NotFound: React.FC = () => {
  return (
    <div 
      style={{
        '--local-bg': 'var(--color-background)',
        '--local-text': 'var(--color-text)',
        '--local-text-muted': 'var(--color-text-muted)',
        '--local-primary': 'var(--color-primary)',
        '--local-radius-md': 'var(--radius-md)',
      } as React.CSSProperties}
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--local-bg)] px-6"
    >
      <h1 className="text-6xl font-bold text-[var(--local-text)] mb-4">404</h1>
      <p className="text-xl text-[var(--local-text-muted)] mb-8">Page not found</p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--local-radius-md)] bg-[var(--local-primary)] text-[var(--local-bg)] font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <span>Back to Home</span>
        <Icon name="arrow-right" size={16} />
      </a>
    </div>
  );
};





END_OF_FILE_CONTENT
mkdir -p "src/components/cta-banner"
echo "Creating src/components/cta-banner/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OlonMark } from '@/components/ui/OlonMark';
import type { CtaBannerData, CtaBannerSettings } from './types';

export const CtaBanner: React.FC<{
  data: CtaBannerData;
  settings?: CtaBannerSettings;
}> = ({ data }) => {
  return (
    <section
      id="get-started"
      className="jp-cta-banner py-32 text-center relative overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(23,99,255,.07) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-[1040px] mx-auto px-8">

        {/* Spinning OlonMark */}
        <div
          className="w-[72px] h-[72px] mx-auto mb-9"
          style={{ animation: 'spin 22s linear infinite' }}
          aria-hidden
        >
          <OlonMark size={72} />
        </div>

        <h2
          className="font-display font-bold tracking-[-0.038em] leading-[1.1] text-foreground mx-auto mb-5"
          style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', maxWidth: '620px' }}
          data-jp-field="title"
        >
          {data.title}
        </h2>

        {data.description && (
          <p
            className="text-[16px] text-muted-foreground leading-[1.65] mx-auto mb-10"
            style={{ maxWidth: '460px' }}
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {data.ctas && data.ctas.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap">
            {data.ctas.map((cta, idx) => (
              <Button
                key={cta.id ?? idx}
                asChild
                variant={cta.variant === 'primary' ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  'gap-2 px-7',
                  cta.variant === 'primary' && 'shadow-[0_0_32px_rgba(23,99,255,.38)]'
                )}
              >
                <a
                  href={cta.href}
                  data-jp-item-id={cta.id ?? `cta-${idx}`}
                  data-jp-item-field="ctas"
                  target={cta.href?.startsWith('http') ? '_blank' : undefined}
                  rel={cta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {cta.variant === 'primary' ? (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
                      <rect x="2.5" y="2" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
                      <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2.01 5.71 4.79 6.63.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 8 5.17c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.2 3.47.25.22.48.65.48 1.31v1.94c0 .19.12.4.48.34C12.99 13.71 15 11.09 15 8c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                    </svg>
                  )}
                  {cta.label}
                </a>
              </Button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/schema.ts"
import { z } from 'zod';
import { BaseSectionData, CtaSchema } from '@/lib/base-schemas';

export const CtaBannerSchema = BaseSectionData.extend({
  label:      z.string().optional().describe('ui:text'),
  title:      z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  cliCommand: z.string().optional().describe('ui:text'),
  ctas:       z.array(CtaSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/cta-banner/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CtaBannerSchema } from './schema';

export type CtaBannerData     = z.infer<typeof CtaBannerSchema>;
export type CtaBannerSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/devex"
echo "Creating src/components/devex/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/View.tsx"
import React from 'react';
import type { DevexData, DevexSettings } from './types';

const ENDPOINTS = [
  '/homepage.json',
  '/products/shoes.json',
  '/blog/ai-agents.json',
  '/contact.json',
] as const;

export const Devex: React.FC<{ data: DevexData; settings?: DevexSettings }> = ({ data }) => {
  return (
    <section id="developer-velocity" className="jp-devex py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-[1040px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* LEFT */}
        <div>
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
              <span className="w-[18px] h-px bg-border" aria-hidden />
              {data.label}
            </div>
          )}
          <h2
            className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-foreground mb-5"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
            data-jp-field="title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p
              className="text-[14px] text-muted-foreground leading-[1.78] mb-6"
              data-jp-field="description"
            >
              {data.description}
            </p>
          )}

          {data.features && data.features.length > 0 && (
            <ul className="flex flex-col mb-8" data-jp-field="features">
              {data.features.map((f, idx) => (
                <li
                  key={(f as { id?: string }).id ?? idx}
                  className="flex items-start gap-2.5 text-[13.5px] text-muted-foreground py-3 border-b border-border last:border-b-0 hover:text-foreground hover:pl-1 transition-all"
                  data-jp-item-id={(f as { id?: string }).id ?? `f-${idx}`}
                  data-jp-item-field="features"
                >
                  <span className="flex-shrink-0 w-[18px] h-[18px] rounded-sm bg-primary/10 flex items-center justify-center mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                    </svg>
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
          )}

          {data.stats && data.stats.length > 0 && (
            <div className="flex gap-7 flex-wrap" data-jp-field="stats">
              {data.stats.map((stat, idx) => (
                <div
                  key={(stat as { id?: string }).id ?? idx}
                  className="flex flex-col gap-0.5"
                  data-jp-item-id={(stat as { id?: string }).id ?? `st-${idx}`}
                  data-jp-item-field="stats"
                >
                  <span
                    className="text-[28px] font-bold tracking-[-0.03em] leading-none bg-gradient-to-br from-[#84ABFF] to-[#1763FF] bg-clip-text text-transparent"
                    data-jp-item-field="value"
                  >
                    {stat.value}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground/60 font-medium" data-jp-item-field="label">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Endpoint display window */}
        <div
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: '#060d14', boxShadow: '0 24px 56px rgba(0,0,0,.35)' }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3 bg-card border-b border-border">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="flex-1 text-center font-mono text-[11px] text-muted-foreground/60">
              canonical endpoints
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
              GET
            </span>
          </div>
          <div className="px-4 py-4">
            {ENDPOINTS.map((ep, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg mb-0.5 hover:bg-muted/20 transition-colors"
              >
                <span className="font-mono text-[12.5px] text-[#84ABFF] flex-1">{ep}</span>
                <span className="text-[11px] text-muted-foreground/40">→</span>
                <span className="font-mono text-[10.5px] text-emerald-500">200 OK</span>
              </div>
            ))}
            <div className="mt-3.5 mx-2.5 p-3.5 bg-muted/20 rounded-lg border border-border">
              <div className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[.08em] mb-2">
                Contract
              </div>
              <div className="font-mono text-[11.5px] text-muted-foreground leading-[1.8]">
                <span className="text-[#84ABFF]">slug</span>
                {' · '}
                <span className="text-[#84ABFF]">meta</span>
                {' · '}
                <span className="text-[#84ABFF]">sections[]</span>
                <br />
                <span className="text-emerald-500">type-safe</span>
                {' · '}
                <span className="text-emerald-500">versioned</span>
                {' · '}
                <span className="text-emerald-500">schema-validated</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/devex/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/devex/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const FeatureSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
});

const StatSchema = BaseArrayItem.extend({
  value: z.string().describe('ui:text'),
  label: z.string().describe('ui:text'),
});

export const DevexSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  features:    z.array(FeatureSchema).optional().describe('ui:list'),
  stats:       z.array(StatSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/devex/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/devex/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { DevexSchema } from './schema';

export type DevexData     = z.infer<typeof DevexSchema>;
export type DevexSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/docs-layout"
mkdir -p "src/components/feature-grid"
echo "Creating src/components/feature-grid/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import type { FeatureGridData, FeatureGridSettings } from './types';

export const FeatureGrid: React.FC<{
  data: FeatureGridData;
  settings?: FeatureGridSettings;
}> = ({ data }) => {
  return (
    <section id="architecture" className="jp-feature-grid py-24">
      <div className="max-w-[1040px] mx-auto px-8">

        {/* Section header */}
        <header className="text-center mb-14">
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
              <span className="w-[18px] h-px bg-border" aria-hidden />
              {data.label}
            </div>
          )}
          <h2
            className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-foreground mb-4"
            style={{ fontSize: 'clamp(26px, 3.8vw, 40px)' }}
            data-jp-field="sectionTitle"
          >
            {data.sectionTitle}
          </h2>
          {data.sectionLead && (
            <p
              className="text-[15.5px] text-muted-foreground leading-[1.7] mx-auto"
              style={{ maxWidth: '500px' }}
              data-jp-field="sectionLead"
            >
              {data.sectionLead}
            </p>
          )}
        </header>

        {/* 3-col feature grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-xl overflow-hidden border border-border"
          style={{ gap: '1px', background: 'var(--border)' }}
          data-jp-field="cards"
        >
          {data.cards.map((card, idx) => (
            <div
              key={card.id ?? idx}
              className={cn(
                'p-8 transition-colors hover:bg-muted/60',
                idx % 2 === 0 ? 'bg-background' : 'bg-card'
              )}
              data-jp-item-id={card.id ?? `legacy-${idx}`}
              data-jp-item-field="cards"
            >
              {card.emoji && (
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/18 flex items-center justify-center text-[18px] mb-5">
                  {card.emoji}
                </div>
              )}
              <h3 className="text-[14px] font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-[1.7]">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const FeatureCardSchema = BaseArrayItem.extend({
  icon: z.string().optional().describe('ui:icon-picker'),
  emoji: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const FeatureGridSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  sectionTitle: z.string().describe('ui:text'),
  sectionLead: z.string().optional().describe('ui:textarea'),
  cards: z.array(FeatureCardSchema).describe('ui:list'),
});

export const FeatureGridSettingsSchema = z.object({
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional().describe('ui:number'),
  cardStyle: z.enum(['plain', 'bordered']).optional().describe('ui:select'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/feature-grid/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { FeatureGridSchema, FeatureGridSettingsSchema } from './schema';

export type FeatureGridData = z.infer<typeof FeatureGridSchema>;
export type FeatureGridSettings = z.infer<typeof BaseSectionSettingsSchema> & z.infer<typeof FeatureGridSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/footer"
echo "Creating src/components/footer/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/View.tsx"
import React from 'react';
import { OlonMark } from '@/components/ui/OlonMark';
import type { FooterData, FooterSettings } from './types';

export const Footer: React.FC<{ data: FooterData; settings?: FooterSettings }> = ({ data }) => {
  return (
    <footer
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'color-mix(in oklch, var(--foreground) 8%, transparent)',
      } as React.CSSProperties}
      className="py-12 border-t border-[var(--local-border)] bg-[var(--local-bg)] relative z-0"
    >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-bold text-[0.9rem] text-[var(--local-text-muted)]">
            <OlonMark size={20} />
            <span data-jp-field="brandText">{data.brandText}{data.brandHighlight && <span className="text-[var(--local-accent)]" data-jp-field="brandHighlight">{data.brandHighlight}</span>}</span>
          </div>
          {data.links && data.links.length > 0 && (
            <nav className="flex gap-6">
              {data.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-[0.82rem] text-[var(--local-text-muted)] hover:text-[var(--local-accent)] transition-colors no-underline"
                  data-jp-item-id={(link as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
          <div className="text-[0.8rem] text-[var(--local-text-muted)] opacity-60" data-jp-field="copyright">
            {data.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/footer/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/footer/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/schema.ts"
import { z } from 'zod';

export const FooterSchema = z.object({
  brandText: z.string().describe('ui:text'),
  brandHighlight: z.string().optional().describe('ui:text'),
  copyright: z.string().describe('ui:text'),
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href: z.string().describe('ui:text'),
  })).optional().describe('ui:list'),
});

export const FooterSettingsSchema = z.object({
  showLogo: z.boolean().optional().describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/footer/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/footer/types.ts"
import { z } from 'zod';
import { FooterSchema, FooterSettingsSchema } from './schema';

export type FooterData = z.infer<typeof FooterSchema>;
export type FooterSettings = z.infer<typeof FooterSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/git-section"
echo "Creating src/components/git-section/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/View.tsx"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { GitSectionData, GitSectionSettings } from './types';

export const GitSection: React.FC<{
  data: GitSectionData;
  settings?: GitSectionSettings;
}> = ({ data }) => {
  return (
    <div
      id="why"
      className="jp-git-section border-y border-border bg-card py-20"
    >
      <div className="max-w-[1040px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 items-center">

          {/* Left: title */}
          <div>
            {data.label && (
              <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-4">
                <span className="w-[18px] h-px bg-border" aria-hidden />
                {data.label}
              </div>
            )}
            <h2
              className="font-display font-bold tracking-[-0.03em] leading-[1.2] text-foreground"
              style={{ fontSize: 'clamp(26px, 3.5vw, 34px)' }}
              data-jp-field="title"
            >
              {data.title}
              {data.titleAccent && (
                <>
                  <br />
                  <span
                    className="bg-gradient-to-br from-[#84ABFF] to-[#1763FF] bg-clip-text text-transparent"
                    data-jp-field="titleAccent"
                  >
                    {data.titleAccent}
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Right: 2×2 card grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-jp-field="cards"
          >
            {data.cards?.map((card, idx) => (
              <Card
                key={(card as { id?: string }).id ?? idx}
                className="bg-background border-border p-5"
                data-jp-item-id={(card as { id?: string }).id ?? `wc-${idx}`}
                data-jp-item-field="cards"
              >
                <CardContent className="p-0">
                  <div className="text-[13px] font-semibold text-foreground mb-1.5">
                    {card.title}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground leading-[1.6]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const WhyCardSchema = BaseArrayItem.extend({
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const GitSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  titleAccent: z.string().optional().describe('ui:text'),
  cards: z.array(WhyCardSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/git-section/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/git-section/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { GitSectionSchema } from './schema';

export type GitSectionData     = z.infer<typeof GitSectionSchema>;
export type GitSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/header"
echo "Creating src/components/header/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/View.tsx"
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { OlonMark } from '@/components/ui/OlonMark';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@olonjs/core';
import type { HeaderData, HeaderSettings } from './types';

export const Header: React.FC<{
  data: HeaderData;
  settings?: HeaderSettings;
  menu: MenuItem[];
}> = ({ data, menu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div style={{ height: '56px' }} aria-hidden />
      <header
        className={cn(
          'fixed top-0 left-0 right-0 w-full h-14 z-50 transition-all duration-300',
          'flex items-center',
          scrolled
            ? 'bg-background/88 backdrop-blur-[16px] border-b border-border/60'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-[1040px] w-full mx-auto px-8 flex items-center gap-3">

          <a
            href="/"
            className="flex items-center gap-2 no-underline shrink-0"
            aria-label="OlonJS home"
          >
            <OlonMark size={26} />
            <span
              className="text-lg font-bold tracking-tight text-foreground"
              data-jp-field="logoText"
            >
              {data.logoText}
              {data.logoHighlight && (
                <span className="text-primary" data-jp-field="logoHighlight">
                  {data.logoHighlight}
                </span>
              )}
            </span>
          </a>

          {data.badge && (
            <>
              <span className="w-px h-4 bg-border" aria-hidden />
              <Badge variant="brand" data-jp-field="badge">
                {data.badge}
              </Badge>
            </>
          )}

          <div className="flex-1" />

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Site">
            {menu.map((item, idx) => (
              <Button
                key={(item as { id?: string }).id ?? idx}
                asChild
                variant={item.isCta ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'text-[13px]',
                  !item.isCta && 'text-muted-foreground hover:text-foreground'
                )}
              >
                <a
                  href={item.href}
                  data-jp-item-id={(item as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              </Button>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            className="absolute top-14 left-0 right-0 md:hidden border-b border-border bg-background/95 backdrop-blur-[16px]"
            aria-label="Mobile menu"
          >
            <div className="max-w-[1040px] mx-auto px-8 py-4 flex flex-col gap-1">
              {menu.map((item, idx) => (
                <a
                  key={(item as { id?: string }).id ?? idx}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                  data-jp-item-id={(item as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/header/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/index.ts"
export * from './View';
export * from './schema';
export * from './types';
END_OF_FILE_CONTENT
echo "Creating src/components/header/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/schema.ts"
import { z } from 'zod';

/**
 * 📝 HEADER SCHEMA (Contract)
 * Definisce la struttura dati che l'Admin userà per generare la form.
 */
export const HeaderSchema = z.object({
  logoText: z.string().describe('ui:text'),
  logoHighlight: z.string().optional().describe('ui:text'),
  logoIconText: z.string().optional().describe('ui:text'),
  badge: z.string().optional().describe('ui:text'),
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href: z.string().describe('ui:text'),
    isCta: z.boolean().default(false).describe('ui:checkbox'),
    external: z.boolean().default(false).optional().describe('ui:checkbox'),
  })).describe('ui:list'),
});

/**
 * ⚙️ HEADER SETTINGS
 * Definisce i parametri tecnici (non di contenuto).
 */
export const HeaderSettingsSchema = z.object({
  sticky: z.boolean().default(true).describe('ui:checkbox'),
});
END_OF_FILE_CONTENT
echo "Creating src/components/header/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/header/types.ts"
import { z } from 'zod';
import { HeaderSchema, HeaderSettingsSchema } from './schema';

/**
 * 🧩 HEADER DATA
 * Tipo inferito dallo schema Zod del contenuto.
 * Utilizzato dalla View per renderizzare logo e links.
 */
export type HeaderData = z.infer<typeof HeaderSchema>;

/**
 * ⚙️ HEADER SETTINGS
 * Tipo inferito dallo schema Zod dei settings.
 * Gestisce comportamenti tecnici come lo 'sticky'.
 */
export type HeaderSettings = z.infer<typeof HeaderSettingsSchema>;
END_OF_FILE_CONTENT
mkdir -p "src/components/hero"
echo "Creating src/components/hero/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/View.tsx"
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { HeroData, HeroSettings } from './types';

const CODE_LINES = [
  { type: 'p', text: '{' },
  { type: 'k', text: '  "slug"',   after: ': ', val: '"homepage"', comma: ',' },
  { type: 'k', text: '  "meta"',   after: ': ', val: '{ "title": "Acme Corp" }', comma: ',' },
  { type: 'k', text: '  "sections"', after: ': [' },
  { type: 'p', text: '    {' },
  { type: 'k', text: '      "type"', after: ':  ', val: '"hero"', comma: ',' },
  { type: 'k', text: '      "data"', after: ': {' },
  { type: 'k', text: '        "title"', after: ': ', val: '"Ship faster with agents"', comma: ',' },
  { type: 'k', text: '        "cta"',   after: ':   ', val: '"Get started"' },
  { type: 'p', text: '      }' },
  { type: 'p', text: '    },' },
  { type: 'c', text: '    { "type": "features" /* ... */ }' },
  { type: 'p', text: '  ]' },
  { type: 'p', text: '}' },
] as const;

const tokenColor: Record<string, string> = {
  k: 'text-[#84ABFF]',
  s: 'text-[#86efac]',
  c: 'text-[#4b5563]',
  p: 'text-[#9ca3af]',
};

export const Hero: React.FC<{ data: HeroData; settings?: HeroSettings }> = ({ data }) => {
  const primaryCta = data.ctas?.find(c => c.variant === 'primary') ?? data.ctas?.[0];
  const secondaryCta = data.ctas?.find(c => c.variant === 'secondary') ?? data.ctas?.[1];

  return (
    <section className="jp-hero relative pt-[156px] pb-28 text-center overflow-hidden">

      {/* Background glow — absolute, scoped to hero section */}
      <div
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          width: '900px',
          height: '700px',
          background: 'radial-gradient(ellipse at center, rgba(23,99,255,.10) 0%, transparent 68%)',
          top: '-160px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        aria-hidden
      />
      {/* Grid background — absolute, scoped to hero section */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[1040px] mx-auto px-8">

        {/* Eyebrow badge */}
        {data.badge && (
          <div className="inline-flex items-center gap-2 mb-8">
            <Badge
              variant="brand"
              className="gap-2 py-1.5 px-4 text-[12px] tracking-[.05em] font-mono"
              data-jp-field="badge"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                aria-hidden
              />
              {data.badge}
            </Badge>
          </div>
        )}

        {/* Headline */}
        <h1
          className="font-display font-bold tracking-[-0.038em] leading-[1.06] text-foreground mb-2 mx-auto"
          style={{ fontSize: 'clamp(44px, 6.5vw, 74px)', maxWidth: '840px' }}
          data-jp-field="title"
        >
          {data.title}
          {data.titleHighlight && (
            <>
              {' '}
              <span
                className="bg-gradient-to-br from-[#84ABFF] via-[#1763FF] to-[#0F52E0] bg-clip-text text-transparent"
                data-jp-field="titleHighlight"
              >
                {data.titleHighlight}
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        {data.description && (
          <p
            className="text-muted-foreground leading-[1.7] mx-auto mt-6 mb-12"
            style={{ fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: '560px' }}
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="flex items-center justify-center gap-3 flex-wrap mb-0">
            {primaryCta && (
              <Button asChild variant="default" size="lg" className="gap-2 px-7 shadow-[0_0_32px_rgba(23,99,255,.38)]">
                <a
                  href={primaryCta.href}
                  data-jp-item-id={primaryCta.id}
                  data-jp-item-field="ctas"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
                    <rect x="2.5" y="2" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {primaryCta.label}
                </a>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild variant="outline" size="lg" className="gap-2 px-7">
                <a
                  href={secondaryCta.href}
                  data-jp-item-id={secondaryCta.id}
                  data-jp-item-field="ctas"
                  target={secondaryCta.href?.startsWith('http') ? '_blank' : undefined}
                  rel={secondaryCta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
                    <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2.01 5.71 4.79 6.63.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 8 5.17c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.2 3.47.25.22.48.65.48 1.31v1.94c0 .19.12.4.48.34C12.99 13.71 15 11.09 15 8c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                  </svg>
                  {secondaryCta.label}
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Code window */}
        <div className="mt-[68px] mx-auto" style={{ maxWidth: '540px' }}>
          <div
            className="rounded-xl border border-border text-left overflow-hidden"
            style={{ background: '#060d14', boxShadow: '0 32px 64px rgba(0,0,0,.44), 0 0 0 1px rgba(255,255,255,.04)' }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-card border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="flex-1 text-center font-mono text-[11px] text-muted-foreground/60">
                GET /homepage.json
              </span>
            </div>
            <div className="px-6 py-5 font-mono text-[12.5px] leading-[1.8] overflow-x-auto">
              {CODE_LINES.map((ln, i) => (
                <div key={i}>
                  {ln.type === 'k' ? (
                    <span>
                      <span className={tokenColor.k}>{ln.text}</span>
                      {'after' in ln && <span className={tokenColor.p}>{ln.after}</span>}
                      {'val' in ln && <span className="text-[#86efac]">{ln.val}</span>}
                      {'comma' in ln && <span className={tokenColor.p}>{ln.comma}</span>}
                    </span>
                  ) : ln.type === 'c' ? (
                    <span className={tokenColor.c}>{ln.text}</span>
                  ) : (
                    <span className={tokenColor.p}>{ln.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/hero/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/hero/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/schema.ts"
import { z } from 'zod';
import { BaseSectionData, CtaSchema } from '@/lib/base-schemas';

const HeroMetricSchema = z.object({
  val: z.string().describe('ui:text'),
  label: z.string().describe('ui:text'),
});

export const HeroSchema = BaseSectionData.extend({
  badge: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  titleHighlight: z.string().optional().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  ctas: z.array(CtaSchema).optional().describe('ui:list'),
  metrics: z.array(HeroMetricSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/hero/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/hero/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { HeroSchema } from './schema';

export type HeroData = z.infer<typeof HeroSchema>;
export type HeroSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/problem-statement"
echo "Creating src/components/problem-statement/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/View.tsx"
import React from 'react';
import type { ProblemStatementData, ProblemStatementSettings } from './types';

export const ProblemStatement: React.FC<{
  data: ProblemStatementData;
  settings?: ProblemStatementSettings;
}> = ({ data }) => {
  return (
    <section id="problem" className="jp-problem py-24">
      <div className="max-w-[1040px] mx-auto px-8">

        {data.label && (
          <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
            <span className="w-[18px] h-px bg-border" aria-hidden />
            {data.label}
          </div>
        )}

        {/* Split grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-border"
          style={{ gap: '1px', background: 'var(--border)' }}
        >
          {/* Problem cell */}
          <div className="bg-background p-10 md:p-[40px_42px]" data-jp-field="problemTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-red-500 mb-5">
              {data.problemTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.problemTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="problemItems">
              {data.problemItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `p-${idx}`}
                  data-jp-item-field="problemItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-red-500/10 text-red-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✕
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution cell */}
          <div className="bg-card p-10 md:p-[40px_42px]" data-jp-field="solutionTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-emerald-500 mb-5">
              {data.solutionTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.solutionTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="solutionItems">
              {data.solutionItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `s-${idx}`}
                  data-jp-item-field="solutionItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <span>
                    {item.text}
                    {item.code && (
                      <> <code className="font-mono text-[11px] bg-muted border border-border rounded px-1.5 py-0.5 text-primary">
                        {item.code}
                      </code></>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const ProblemItemSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
  code: z.string().optional().describe('ui:text'),
});

export const ProblemStatementSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  problemTag: z.string().describe('ui:text'),
  problemTitle: z.string().describe('ui:text'),
  problemItems: z.array(ProblemItemSchema).describe('ui:list'),
  solutionTag: z.string().describe('ui:text'),
  solutionTitle: z.string().describe('ui:text'),
  solutionItems: z.array(ProblemItemSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ProblemStatementSchema } from './schema';

export type ProblemStatementData = z.infer<typeof ProblemStatementSchema>;
export type ProblemStatementSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/save-drawer"
echo "Creating src/components/save-drawer/DeployConnector.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DeployConnector.tsx"
import type { StepState } from '@/types/deploy';

interface DeployConnectorProps {
  fromState: StepState;
  toState: StepState;
  color: string;
}

export function DeployConnector({ fromState, toState, color }: DeployConnectorProps) {
  const filled = fromState === 'done' && toState === 'done';
  const filling = fromState === 'done' && toState === 'active';
  const lit = filled || filling;

  return (
    <div className="jp-drawer-connector">
      <div className="jp-drawer-connector-base" />

      <div
        className="jp-drawer-connector-fill"
        style={{
          background: `linear-gradient(90deg, ${color}cc, ${color}66)`,
          width: filled ? '100%' : filling ? '100%' : '0%',
          transition: filling ? 'width 2s cubic-bezier(0.4,0,0.2,1)' : 'none',
          boxShadow: lit ? `0 0 8px ${color}77` : 'none',
        }}
      />

      {filling && (
        <div
          className="jp-drawer-connector-orb"
          style={{
            background: color,
            boxShadow: `0 0 14px ${color}, 0 0 28px ${color}88`,
            animation: 'orb-travel 2s cubic-bezier(0.4,0,0.6,1) forwards',
          }}
        />
      )}
    </div>
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/DeployNode.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DeployNode.tsx"
import type { CSSProperties } from 'react';
import type { DeployStep, StepState } from '@/types/deploy';

interface DeployNodeProps {
  step: DeployStep;
  state: StepState;
}

export function DeployNode({ step, state }: DeployNodeProps) {
  const isActive = state === 'active';
  const isDone = state === 'done';
  const isPending = state === 'pending';

  return (
    <div className="jp-drawer-node-wrap">
      <div
        className={`jp-drawer-node ${isPending ? 'jp-drawer-node-pending' : ''}`}
        style={
          {
            background: isDone ? step.color : isActive ? 'rgba(0,0,0,0.5)' : undefined,
            borderWidth: isDone ? 0 : 1,
            borderColor: isActive ? `${step.color}80` : undefined,
            boxShadow: isDone
              ? `0 0 20px ${step.color}55, 0 0 40px ${step.color}22`
              : isActive
                ? `0 0 14px ${step.color}33`
                : undefined,
            animation: isActive ? 'node-glow 2s ease infinite' : undefined,
            ['--glow-color' as string]: step.color,
          } as CSSProperties
        }
      >
        {isDone && (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-label="Done">
            <path
              className="stroke-dash-30 animate-check-draw"
              d="M5 13l4 4L19 7"
              stroke="#0a0f1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {isActive && (
          <span
            className="jp-drawer-node-glyph jp-drawer-node-glyph-active"
            style={{ color: step.color, animation: 'glyph-rotate 9s linear infinite' }}
            aria-hidden
          >
            {step.glyph}
          </span>
        )}

        {isPending && (
          <span className="jp-drawer-node-glyph jp-drawer-node-glyph-pending" aria-hidden>
            {step.glyph}
          </span>
        )}

        {isActive && (
          <span
            className="jp-drawer-node-ring"
            style={{
              inset: -7,
              borderColor: `${step.color}50`,
              animation: 'ring-expand 2s ease-out infinite',
            }}
          />
        )}
      </div>

      <span
        className="jp-drawer-node-label"
        style={{ color: isDone ? step.color : isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)' }}
      >
        {step.label}
      </span>
    </div>
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/DopaDrawer.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/DopaDrawer.tsx"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { StepId, StepState } from '@/types/deploy';
import { DEPLOY_STEPS } from '@/lib/deploySteps';
import fontsCss from '@/fonts.css?inline';
import saverStyleCss from './saverStyle.css?inline';
import { DeployNode } from './DeployNode';
import { DeployConnector } from './DeployConnector';
import { BuildBars, ElapsedTimer, Particles, SuccessBurst } from './Visuals';

interface DopaDrawerProps {
  isOpen: boolean;
  phase: 'idle' | 'running' | 'done' | 'error';
  currentStepId: StepId | null;
  doneSteps: StepId[];
  progress: number;
  errorMessage?: string;
  deployUrl?: string;
  onClose: () => void;
  onRetry: () => void;
}

export function DopaDrawer({
  isOpen,
  phase,
  currentStepId,
  doneSteps,
  progress,
  errorMessage,
  deployUrl,
  onClose,
  onRetry,
}: DopaDrawerProps) {
  const [shadowMount, setShadowMount] = useState<HTMLElement | null>(null);
  const [burst, setBurst] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const isRunning = phase === 'running';
  const isDone = phase === 'done';
  const isError = phase === 'error';

  useEffect(() => {
    const host = document.createElement('div');
    host.setAttribute('data-jp-drawer-shadow-host', '');

    const shadowRoot = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `${fontsCss}\n${saverStyleCss}`;

    const mount = document.createElement('div');
    shadowRoot.append(style, mount);

    document.body.appendChild(host);
    setShadowMount(mount);

    return () => {
      setShadowMount(null);
      host.remove();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setBurst(false);
      setCountdown(3);
      return;
    }
    if (isDone) setBurst(true);
  }, [isDone, isOpen]);

  useEffect(() => {
    if (!isOpen || !isDone) return;
    setCountdown(3);
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isDone, isOpen, onClose]);

  const currentStep = useMemo(
    () => DEPLOY_STEPS.find((step) => step.id === currentStepId) ?? null,
    [currentStepId]
  );

  const activeColor = isDone ? '#34d399' : isError ? '#f87171' : (currentStep?.color ?? '#60a5fa');
  const particleCount = isDone ? 40 : doneSteps.length === 3 ? 28 : doneSteps.length === 2 ? 16 : doneSteps.length === 1 ? 8 : 4;

  const stepState = (index: number): StepState => {
    const step = DEPLOY_STEPS[index];
    if (doneSteps.includes(step.id)) return 'done';
    if (phase === 'running' && currentStepId === step.id) return 'active';
    return 'pending';
  };

  if (!shadowMount || !isOpen || phase === 'idle') return null;

  return createPortal(
    <div className="jp-drawer-root">
      <div
        className="jp-drawer-overlay animate-fade-in"
        onClick={isDone || isError ? onClose : undefined}
        aria-hidden
      />

      <div
        role="status"
        aria-live="polite"
        aria-label={isDone ? 'Deploy completed' : isError ? 'Deploy failed' : 'Deploying'}
        className="jp-drawer-shell animate-drawer-up"
        style={{ bottom: 'max(2.25rem, env(safe-area-inset-bottom))' }}
      >
        <div
          className="jp-drawer-card"
          style={{
            backgroundColor: 'hsl(222 18% 7%)',
            boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 -20px 60px rgba(0,0,0,0.6), 0 0 80px ${activeColor}0d`,
            transition: 'box-shadow 1.2s ease',
          }}
        >
          <div
            className="jp-drawer-ambient"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 110%, ${activeColor}12 0%, transparent 65%)`,
              transition: 'background 1.5s ease',
              animation: 'ambient-pulse 3.5s ease infinite',
            }}
            aria-hidden
          />

          {isDone && (
            <div className="jp-drawer-shimmer" aria-hidden>
              <div
                className="jp-drawer-shimmer-bar"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                  animation: 'shimmer-sweep 1.4s 0.1s ease forwards',
                }}
              />
            </div>
          )}

          <Particles count={particleCount} color={activeColor} />
          {burst && <SuccessBurst />}

          <div className="jp-drawer-content">
            <div className="jp-drawer-header">
              <div className="jp-drawer-header-left">
                <div className="jp-drawer-status" style={{ color: activeColor }}>
                  <span
                    className="jp-drawer-status-dot"
                    style={{
                      background: activeColor,
                      boxShadow: `0 0 6px ${activeColor}`,
                      animation: isRunning ? 'ambient-pulse 1.5s ease infinite' : 'none',
                    }}
                    aria-hidden
                  />
                  {isDone ? 'Live' : isError ? 'Build failed' : currentStep?.verb ?? 'Saving'}
                </div>

                <div key={currentStep?.id ?? phase} className="jp-drawer-copy animate-text-in">
                  {isDone ? (
                    <div className="animate-success-pop">
                      <p className="jp-drawer-copy-title jp-drawer-copy-title-lg">Your content is live.</p>
                      <p className="jp-drawer-copy-sub">Deployed to production successfully</p>
                    </div>
                  ) : isError ? (
                    <>
                      <p className="jp-drawer-copy-title jp-drawer-copy-title-md">Deploy failed at build.</p>
                      <p className="jp-drawer-copy-sub jp-drawer-copy-sub-error">{errorMessage ?? 'Check your Vercel logs or retry below'}</p>
                    </>
                  ) : currentStep ? (
                    <>
                      <p className="jp-drawer-poem-line jp-drawer-poem-line-1">{currentStep.poem[0]}</p>
                      <p className="jp-drawer-poem-line jp-drawer-poem-line-2">{currentStep.poem[1]}</p>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="jp-drawer-right">
                {isDone ? (
                  <div className="jp-drawer-countdown-wrap animate-fade-up">
                    <span className="jp-drawer-countdown-text" aria-live="polite">
                      Chiusura in {countdown}s
                    </span>
                    <div className="jp-drawer-countdown-track">
                      <div className="jp-drawer-countdown-bar countdown-bar" style={{ boxShadow: '0 0 6px #34d39988' }} />
                    </div>
                  </div>
                ) : (
                  <ElapsedTimer running={isRunning} />
                )}
              </div>
            </div>

            <div className="jp-drawer-track-row">
              {DEPLOY_STEPS.map((step, i) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: i < DEPLOY_STEPS.length - 1 ? 1 : 'none' }}>
                  <DeployNode step={step} state={stepState(i)} />
                  {i < DEPLOY_STEPS.length - 1 && (
                    <DeployConnector fromState={stepState(i)} toState={stepState(i + 1)} color={DEPLOY_STEPS[i + 1].color} />
                  )}
                </div>
              ))}
            </div>

            <div className="jp-drawer-bars-wrap">
              <BuildBars active={stepState(2) === 'active'} />
            </div>

            <div className="jp-drawer-separator" />

            <div className="jp-drawer-footer">
              <div className="jp-drawer-progress">
                <div
                  className="jp-drawer-progress-indicator"
                  style={{
                    width: `${Math.max(0, Math.min(100, progress))}%`,
                    background: `linear-gradient(90deg, ${DEPLOY_STEPS[0].color}, ${activeColor})`,
                  }}
                />
              </div>

              <div className="jp-drawer-cta">
                {isDone && (
                  <div className="jp-drawer-btn-row animate-fade-up">
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-secondary" onClick={onClose}>
                      Chiudi
                    </button>
                    <button
                      type="button"
                      className="jp-drawer-btn jp-drawer-btn-emerald"
                      onClick={() => {
                        if (deployUrl) window.open(deployUrl, '_blank', 'noopener,noreferrer');
                      }}
                      disabled={!deployUrl}
                    >
                      <span aria-hidden>↗</span> Open site
                    </button>
                  </div>
                )}

                {isError && (
                  <div className="jp-drawer-btn-row animate-fade-up">
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-ghost" onClick={onClose}>
                      Annulla
                    </button>
                    <button type="button" className="jp-drawer-btn jp-drawer-btn-destructive" onClick={onRetry}>
                      Retry
                    </button>
                  </div>
                )}

                {isRunning && (
                  <span className="jp-drawer-running-step" aria-hidden>
                    {doneSteps.length + 1} / {DEPLOY_STEPS.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    shadowMount
  );
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/Visuals.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/Visuals.tsx"
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
}

const PARTICLE_POOL: Particle[] = Array.from({ length: 44 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  y: 15 + Math.random() * 70,
  size: 1.5 + Math.random() * 2.5,
  dur: 2.8 + Math.random() * 3.5,
  delay: Math.random() * 4,
}));

interface ParticlesProps {
  count: number;
  color: string;
}

export function Particles({ count, color }: ParticlesProps) {
  return (
    <div className="jp-drawer-particles" aria-hidden>
      {PARTICLE_POOL.slice(0, count).map((particle) => (
        <div
          key={particle.id}
          className="jp-drawer-particle"
          style={{
            left: `${particle.x}%`,
            bottom: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: color,
            boxShadow: `0 0 ${particle.size * 3}px ${color}`,
            opacity: 0,
            animation: `particle-float ${particle.dur}s ${particle.delay}s ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

const BAR_H = [0.45, 0.75, 0.55, 0.9, 0.65, 0.8, 0.5, 0.72, 0.6, 0.85, 0.42, 0.7];

interface BuildBarsProps {
  active: boolean;
}

export function BuildBars({ active }: BuildBarsProps) {
  if (!active) return <div className="jp-drawer-bars-placeholder" />;

  return (
    <div className="jp-drawer-bars" aria-hidden>
      {BAR_H.map((height, i) => (
        <div
          key={i}
          className="jp-drawer-bar"
          style={{
            height: `${height * 100}%`,
            animation: `bar-eq ${0.42 + i * 0.06}s ${i * 0.04}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

const BURST_COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#f472b6'];

export function SuccessBurst() {
  return (
    <div className="jp-drawer-burst" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="jp-drawer-burst-dot"
          style={
            {
              background: BURST_COLORS[i % BURST_COLORS.length],
              ['--r' as string]: `${i * 22.5}deg`,
              animation: `burst-ray 0.85s ${i * 0.03}s cubic-bezier(0,0.6,0.5,1) forwards`,
              transform: `rotate(${i * 22.5}deg)`,
              transformOrigin: '50% 50%',
              opacity: 0,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

interface ElapsedTimerProps {
  running: boolean;
}

export function ElapsedTimer({ running }: ElapsedTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    if (!startRef.current) startRef.current = performance.now();

    const tick = () => {
      if (!startRef.current) return;
      setElapsed(Math.floor((performance.now() - startRef.current) / 1000));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const sec = String(elapsed % 60).padStart(2, '0');
  const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
  return <span className="jp-drawer-elapsed" aria-live="off">{min}:{sec}</span>;
}


END_OF_FILE_CONTENT
echo "Creating src/components/save-drawer/saverStyle.css..."
cat << 'END_OF_FILE_CONTENT' > "src/components/save-drawer/saverStyle.css"
/* Save Drawer strict_full isolated stylesheet */

.jp-drawer-root {
  --background: 222 18% 6%;
  --foreground: 210 20% 96%;
  --card: 222 16% 8%;
  --card-foreground: 210 20% 96%;
  --primary: 0 0% 95%;
  --primary-foreground: 222 18% 6%;
  --secondary: 220 14% 13%;
  --secondary-foreground: 210 20% 96%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;
  --border: 220 14% 13%;
  --radius: 0.6rem;
  font-family: 'Geist', system-ui, sans-serif;
}

.jp-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483600;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}

.jp-drawer-shell {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2147483601;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.jp-drawer-card {
  position: relative;
  width: 100%;
  max-width: 31rem;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgb(255 255 255 / 0.07);
}

.jp-drawer-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.jp-drawer-shimmer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.jp-drawer-shimmer-bar {
  position: absolute;
  inset-block: 0;
  width: 35%;
}

.jp-drawer-content {
  position: relative;
  z-index: 10;
  padding: 2rem 2rem 1.75rem;
}

.jp-drawer-header {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.jp-drawer-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.jp-drawer-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.5s;
}

.jp-drawer-status-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  display: inline-block;
}

.jp-drawer-copy {
  min-height: 52px;
}

.jp-drawer-copy-title {
  margin: 0;
  color: white;
  line-height: 1.25;
  font-weight: 600;
}

.jp-drawer-copy-title-lg {
  font-size: 1.125rem;
}

.jp-drawer-copy-title-md {
  font-size: 1rem;
}

.jp-drawer-copy-sub {
  margin: 0.125rem 0 0;
  color: rgb(255 255 255 / 0.4);
  font-size: 0.875rem;
}

.jp-drawer-copy-sub-error {
  color: rgb(255 255 255 / 0.35);
}

.jp-drawer-poem-line {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.5;
}

.jp-drawer-poem-line-1 {
  color: rgb(255 255 255 / 0.55);
}

.jp-drawer-poem-line-2 {
  color: rgb(255 255 255 / 0.3);
}

.jp-drawer-right {
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

.jp-drawer-countdown-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.jp-drawer-countdown-text {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #34d399;
}

.jp-drawer-countdown-track {
  width: 6rem;
  height: 0.125rem;
  border-radius: 9999px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.1);
}

.jp-drawer-countdown-bar {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: #34d399;
}

.jp-drawer-track-row {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.jp-drawer-bars-wrap {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.jp-drawer-separator {
  margin-bottom: 1rem;
  height: 1px;
  width: 100%;
  border: 0;
  background: rgb(255 255 255 / 0.06);
}

.jp-drawer-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.jp-drawer-progress {
  flex: 1;
  height: 2px;
  border-radius: 9999px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.06);
}

.jp-drawer-progress-indicator {
  height: 100%;
}

.jp-drawer-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.jp-drawer-running-step {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: rgb(255 255 255 / 0.2);
}

.jp-drawer-btn-row {
  display: flex;
  gap: 0.5rem;
}

.jp-drawer-btn {
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
  height: 2.25rem;
  padding: 0 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.jp-drawer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.jp-drawer-btn-secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.jp-drawer-btn-secondary:hover {
  filter: brightness(1.08);
}

.jp-drawer-btn-emerald {
  background: #34d399;
  color: #18181b;
  font-weight: 600;
}

.jp-drawer-btn-emerald:hover {
  background: #6ee7b7;
}

.jp-drawer-btn-ghost {
  background: transparent;
  color: rgb(255 255 255 / 0.9);
}

.jp-drawer-btn-ghost:hover {
  background: rgb(255 255 255 / 0.08);
}

.jp-drawer-btn-destructive {
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.jp-drawer-btn-destructive:hover {
  filter: brightness(1.06);
}

.jp-drawer-node-wrap {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.jp-drawer-node {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
}

.jp-drawer-node-pending {
  border-color: rgb(255 255 255 / 0.08);
  background: rgb(255 255 255 / 0.02);
}

.jp-drawer-node-glyph {
  font-size: 1.125rem;
  line-height: 1;
}

.jp-drawer-node-glyph-active {
  display: inline-block;
}

.jp-drawer-node-glyph-pending {
  color: rgb(255 255 255 / 0.15);
}

.jp-drawer-node-ring {
  position: absolute;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.jp-drawer-node-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.5s;
}

.jp-drawer-connector {
  position: relative;
  z-index: 0;
  flex: 1;
  height: 2px;
  margin-top: -24px;
}

.jp-drawer-connector-base {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.08);
}

.jp-drawer-connector-fill {
  position: absolute;
  left: 0;
  right: auto;
  top: 0;
  bottom: 0;
  border-radius: 9999px;
}

.jp-drawer-connector-orb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 9999px;
}

.jp-drawer-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.jp-drawer-particle {
  position: absolute;
  border-radius: 9999px;
}

.jp-drawer-bars {
  height: 1.75rem;
  display: flex;
  align-items: flex-end;
  gap: 3px;
}

.jp-drawer-bars-placeholder {
  height: 1.75rem;
}

.jp-drawer-bar {
  width: 3px;
  border-radius: 2px;
  background: #f59e0b;
  transform-origin: bottom;
}

.jp-drawer-burst {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.jp-drawer-burst-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
}

.jp-drawer-elapsed {
  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgb(255 255 255 / 0.25);
}

/* Animation helper classes */
.animate-drawer-up { animation: drawer-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.animate-fade-in { animation: fade-in 0.25s ease forwards; }
.animate-fade-up { animation: fade-up 0.35s ease forwards; }
.animate-text-in { animation: text-in 0.3s ease forwards; }
.animate-success-pop { animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.countdown-bar { animation: countdown-drain 3s linear forwards; }

.stroke-dash-30 {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
}

.animate-check-draw {
  animation: check-draw 0.4s 0.05s ease forwards;
}

@keyframes check-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes drawer-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes text-in {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes success-pop {
  0% { transform: scale(0.88); opacity: 0; }
  60% { transform: scale(1.04); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes ambient-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.65; }
}

@keyframes shimmer-sweep {
  from { transform: translateX(-100%); }
  to { transform: translateX(250%); }
}

@keyframes node-glow {
  0%, 100% { box-shadow: 0 0 12px var(--glow-color,#60a5fa55); }
  50% { box-shadow: 0 0 28px var(--glow-color,#60a5fa88), 0 0 48px var(--glow-color,#60a5fa22); }
}

@keyframes glyph-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ring-expand {
  from { transform: scale(1); opacity: 0.7; }
  to { transform: scale(2.1); opacity: 0; }
}

@keyframes orb-travel {
  from { left: 0%; }
  to { left: calc(100% - 10px); }
}

@keyframes particle-float {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(-90px) scale(0.3); opacity: 0; }
}

@keyframes bar-eq {
  from { transform: scaleY(0.4); }
  to { transform: scaleY(1); }
}

@keyframes burst-ray {
  0% { transform: rotate(var(--r, 0deg)) translateX(0); opacity: 1; }
  100% { transform: rotate(var(--r, 0deg)) translateX(56px); opacity: 0; }
}

@keyframes countdown-drain {
  from { width: 100%; }
  to { width: 0%; }
}


END_OF_FILE_CONTENT
mkdir -p "src/components/tiptap"
echo "Creating src/components/tiptap/INTEGRATION.md..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/INTEGRATION.md"
# Tiptap Editorial — Integration Guide

How to add the `tiptap` section to a new tenant.

---

## 1. Copy the component

Copy the entire folder into the new tenant:

```
src/components/tiptap/
  index.ts
  types.ts
  View.tsx
```

---

## 2. Install npm dependencies

Add to the tenant's `package.json` and run `npm install`:

```json
"@tiptap/extension-image": "^2.11.5",
"@tiptap/extension-link": "^2.11.5",
"@tiptap/react": "^2.11.5",
"@tiptap/starter-kit": "^2.11.5",
"react-markdown": "^9.0.1",
"rehype-sanitize": "^6.0.0",
"remark-gfm": "^4.0.1",
"tiptap-markdown": "^0.8.10"
```

---

## 3. Add CSS to `src/index.css`

Two blocks are required — one for the public (visitor) view, one for the editor (studio) view.

```css
/* ==========================================================================
   TIPTAP — Public content typography (visitor view)
   ========================================================================== */
.jp-tiptap-content > * + * { margin-top: 0.75em; }

.jp-tiptap-content h1 { font-size: 2em;    font-weight: 700; line-height: 1.2; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h2 { font-size: 1.5em;  font-weight: 700; line-height: 1.3; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h4 { font-size: 1em;    font-weight: 600; line-height: 1.5; margin-top: 1em;    margin-bottom: 0.25em; }

.jp-tiptap-content p  { line-height: 1.7; }
.jp-tiptap-content strong { font-weight: 700; }
.jp-tiptap-content em     { font-style: italic; }
.jp-tiptap-content s      { text-decoration: line-through; }

.jp-tiptap-content a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
.jp-tiptap-content a:hover { opacity: 0.8; }

.jp-tiptap-content code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
  border-radius: 0.25em;
  padding: 0.1em 0.35em;
}
.jp-tiptap-content pre {
  background: color-mix(in oklch, var(--background) 60%, black);
  border-radius: 0.5em;
  padding: 1em 1.25em;
  overflow-x: auto;
}
.jp-tiptap-content pre code { background: none; padding: 0; }

.jp-tiptap-content ul { list-style-type: disc;    padding-left: 1.625em; }
.jp-tiptap-content ol { list-style-type: decimal; padding-left: 1.625em; }
.jp-tiptap-content li { line-height: 1.7; margin-top: 0.25em; }
.jp-tiptap-content li + li { margin-top: 0.25em; }

.jp-tiptap-content blockquote {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  color: var(--muted-foreground);
  font-style: italic;
}
.jp-tiptap-content hr { border: none; border-top: 1px solid var(--border); margin: 1.5em 0; }
.jp-tiptap-content img { max-width: 100%; height: auto; border-radius: 0.5rem; }

/* ==========================================================================
   TIPTAP / PROSEMIRROR — Editor typography (studio view)
   ========================================================================== */
.jp-simple-editor .ProseMirror { outline: none; word-break: break-word; }
.jp-simple-editor .ProseMirror > * + * { margin-top: 0.75em; }

.jp-simple-editor .ProseMirror h1 { font-size: 2em;    font-weight: 700; line-height: 1.2; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h2 { font-size: 1.5em;  font-weight: 700; line-height: 1.3; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h4 { font-size: 1em;    font-weight: 600; line-height: 1.5; margin-top: 1em;    margin-bottom: 0.25em; }

.jp-simple-editor .ProseMirror p  { line-height: 1.7; }
.jp-simple-editor .ProseMirror strong { font-weight: 700; }
.jp-simple-editor .ProseMirror em     { font-style: italic; }
.jp-simple-editor .ProseMirror s      { text-decoration: line-through; }

.jp-simple-editor .ProseMirror a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
.jp-simple-editor .ProseMirror a:hover { opacity: 0.8; }

.jp-simple-editor .ProseMirror code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
  border-radius: 0.25em;
  padding: 0.1em 0.35em;
}
.jp-simple-editor .ProseMirror pre {
  background: color-mix(in oklch, var(--background) 60%, black);
  border-radius: 0.5em;
  padding: 1em 1.25em;
  overflow-x: auto;
}
.jp-simple-editor .ProseMirror pre code { background: none; padding: 0; }

.jp-simple-editor .ProseMirror ul { list-style-type: disc;    padding-left: 1.625em; }
.jp-simple-editor .ProseMirror ol { list-style-type: decimal; padding-left: 1.625em; }
.jp-simple-editor .ProseMirror li { line-height: 1.7; margin-top: 0.25em; }
.jp-simple-editor .ProseMirror li + li { margin-top: 0.25em; }

.jp-simple-editor .ProseMirror blockquote {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  color: var(--muted-foreground);
  font-style: italic;
}
.jp-simple-editor .ProseMirror hr { border: none; border-top: 1px solid var(--border); margin: 1.5em 0; }

.jp-simple-editor .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; }
.jp-simple-editor .ProseMirror img[data-uploading="true"] {
  opacity: 0.6;
  filter: grayscale(0.25);
  outline: 2px dashed rgb(59 130 246 / 0.7);
  outline-offset: 2px;
}
.jp-simple-editor .ProseMirror img[data-upload-error="true"] {
  outline: 2px solid rgb(239 68 68 / 0.8);
  outline-offset: 2px;
}
.jp-simple-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--muted-foreground);
  opacity: 0.5;
  pointer-events: none;
  float: left;
  height: 0;
}
```

---

## 4. Register in `src/lib/schemas.ts`

```ts
import { TiptapSchema } from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  // ... existing schemas
  'tiptap': TiptapSchema,
} as const;
```

---

## 5. Register in `src/lib/addSectionConfig.ts`

```ts
const addableSectionTypes = [
  // ... existing types
  'tiptap',
] as const;

const sectionTypeLabels = {
  // ... existing labels
  'tiptap': 'Tiptap Editorial',
};

function getDefaultSectionData(type: string) {
  switch (type) {
    // ... existing cases
    case 'tiptap': return { content: '# Post title\n\nStart writing in Markdown...' };
  }
}
```

---

## 6. Register in `src/lib/ComponentRegistry.tsx`

```tsx
import { Tiptap } from '@/components/tiptap';

export const ComponentRegistry = {
  // ... existing components
  'tiptap': Tiptap,
};
```

---

## 7. Register in `src/types.ts`

```ts
import type { TiptapData, TiptapSettings } from '@/components/tiptap';

export type SectionComponentPropsMap = {
  // ... existing entries
  'tiptap': { data: TiptapData; settings?: TiptapSettings };
};

declare module '@jsonpages/core' {
  export interface SectionDataRegistry {
    // ... existing entries
    'tiptap': TiptapData;
  }
  export interface SectionSettingsRegistry {
    // ... existing entries
    'tiptap': TiptapSettings;
  }
}
```

---

## Notes

- Typography uses tenant CSS variables (`--primary`, `--border`, `--muted-foreground`, `--font-mono`) — no hardcoded colors.
- `@tailwindcss/typography` is **not** required; the CSS blocks above replace it.
- The toolbar is admin-only (studio mode). In visitor mode, content is rendered via `ReactMarkdown`.
- Underline is intentionally excluded: `tiptap-markdown` with `html: false` cannot round-trip `<u>` tags.

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/View.tsx"
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Components, ExtraProps } from 'react-markdown';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import {
  Undo2, Redo2,
  List, ListOrdered,
  Bold, Italic, Strikethrough,
  Code2, Quote, SquareCode,
  Link2, Unlink2, ImagePlus, Eraser,
} from 'lucide-react';
import { STUDIO_EVENTS, useConfig, useStudio } from '@olonjs/core';
import type { TiptapData, TiptapSettings } from './types';

// ── TOC helpers ───────────────────────────────────────────────────────────────

type TocEntry = { id: string; text: string; level: 2 | 3 };

function slugify(raw: string): string {
  return raw
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[*_`#[\]()]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s.-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split('\n')) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].replace(/[*_`#[\]]/g, '').replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim();
      entries.push({ id: slugify(h2[1]), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/[*_`#[\]]/g, '').trim();
      entries.push({ id: slugify(h3[1]), text, level: 3 });
    }
  }
  return entries;
}

// ── Sidebar (always rendered, both in Studio and Public) ──────────────────────

const DocsSidebar: React.FC<{
  toc: TocEntry[];
  activeId: string;
  onNav: (id: string) => void;
}> = ({ toc, activeId, onNav }) => (
  <aside className="w-[200px] flex-shrink-0 sticky top-[72px] self-start hidden lg:block">
    <div className="text-[9px] font-mono font-bold uppercase tracking-[.14em] text-[var(--local-toolbar-text)] mb-3 px-3">
      On this page
    </div>
    <nav className="flex flex-col">
      {toc.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onNav(entry.id)}
          className={[
            'text-left rounded-[var(--local-radius-sm)] transition-all duration-150 no-underline',
            entry.level === 3
              ? 'pl-[22px] pr-3 py-1.5 text-[0.72rem] ml-0.5'
              : 'px-3 py-2 font-bold text-[0.76rem]',
            activeId === entry.id
              ? entry.level === 2
                ? 'text-[var(--local-primary)] bg-[var(--local-toolbar-hover-bg)] border-l-2 border-[var(--local-primary)] pl-[10px]'
                : 'text-[var(--local-primary)] font-semibold bg-[var(--local-toolbar-active-bg)]'
              : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[var(--local-toolbar-hover-bg)]',
          ].join(' ')}
        >
          {entry.level === 3 && (
            <span
              className={`inline-block w-[5px] h-[5px] rounded-full mr-2 align-middle mb-px flex-shrink-0 ${
                activeId === entry.id ? 'bg-[var(--local-primary)]' : 'bg-[var(--local-border)]'
              }`}
            />
          )}
          {entry.text}
        </button>
      ))}
    </nav>
    <div className="mt-5 pt-4 border-t border-[var(--local-border)]">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--local-text-muted)] hover:text-[var(--local-primary)] transition-colors px-3"
      >
        ↑ Back to top
      </button>
    </div>
  </aside>
);

// ── UI primitives ─────────────────────────────────────────────────────────────

const Btn: React.FC<{
  active?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active = false, title, onClick, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={[
      'inline-flex h-7 min-w-7 items-center justify-center rounded-[var(--local-radius-sm)] px-2 text-xs transition-colors',
      active
        ? 'bg-[var(--local-toolbar-active-bg)] text-[var(--local-text)]'
        : 'text-[var(--local-toolbar-text)] hover:bg-[var(--local-toolbar-hover-bg)] hover:text-[var(--local-text)]',
    ].join(' ')}
  >
    {children}
  </button>
);

const Sep: React.FC = () => (
  <span className="mx-0.5 h-5 w-px shrink-0 bg-[var(--local-toolbar-border)]" aria-hidden />
);

// ── Image extension with upload metadata ──────────────────────────────────────

const UploadableImage = Image.extend({
  addAttributes() {
    const bool = (attr: string) => ({
      default: false,
      parseHTML: (el: HTMLElement) => el.getAttribute(attr) === 'true',
      renderHTML: (attrs: Record<string, unknown>) =>
        attrs[attr.replace('data-', '').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())]
          ? { [attr]: 'true' }
          : {},
    });
    return {
      ...this.parent?.(),
      uploadId: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-upload-id'),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.uploadId ? { 'data-upload-id': String(attrs.uploadId) } : {},
      },
      uploading: bool('data-uploading'),
      uploadError: bool('data-upload-error'),
      awaitingUpload: bool('data-awaiting-upload'),
    };
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const getMarkdown = (ed: Editor | null | undefined): string =>
  (ed?.storage as { markdown?: { getMarkdown?: () => string } } | undefined)
    ?.markdown?.getMarkdown?.() ?? '';

const svg = (body: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>${body}</svg>`
  );

const RECT = `<rect width='1200' height='420' fill='#090B14' stroke='#3F3F46' stroke-width='3' stroke-dasharray='10 10' rx='12'/>`;

const UPLOADING_SRC = svg(
  RECT +
  `<text x='600' y='215' font-family='Inter,Arial,sans-serif' font-size='28' font-weight='700' fill='#A1A1AA' text-anchor='middle'>Uploading image…</text>`
);

const PICKER_SRC = svg(
  RECT +
  `<text x='600' y='200' font-family='Inter,Arial,sans-serif' font-size='32' font-weight='700' fill='#E4E4E7' text-anchor='middle'>Click to upload or drag &amp; drop</text>` +
  `<text x='600' y='248' font-family='Inter,Arial,sans-serif' font-size='22' fill='#A1A1AA' text-anchor='middle'>Max 5 MB per file</text>`
);

const patchImage = (
  ed: Editor,
  uploadId: string,
  patch: Record<string, unknown>
): boolean => {
  let pos: number | null = null;
  ed.state.doc.descendants(
    (node: { type: { name: string }; attrs?: Record<string, unknown> }, p: number) => {
      if (node.type.name === 'image' && node.attrs?.uploadId === uploadId) {
        pos = p;
        return false;
      }
      return true;
    }
  );
  if (pos == null) return false;
  const cur = ed.state.doc.nodeAt(pos);
  if (!cur) return false;
  ed.view.dispatch(ed.state.tr.setNodeMarkup(pos, undefined, { ...cur.attrs, ...patch }));
  return true;
};

// Extensions defined outside component — stable reference, no re-creation on render
const EXTENSIONS = [
  StarterKit,
  Link.configure({ openOnClick: false, autolink: true }),
  UploadableImage,
  // NOTE: Underline is intentionally excluded.
  // tiptap-markdown with html:false cannot round-trip <u> tags, so underline
  // would be silently dropped on save. Use bold/italic instead.
  Markdown.configure({ html: false }),
];

const EDITOR_CLASSES =
  'min-h-[220px] p-4 outline-none';

// ── Studio editor component ───────────────────────────────────────────────────

const StudioTiptapEditor: React.FC<{ data: TiptapData }> = ({ data }) => {
  const { assets } = useConfig();

  // DOM refs
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Editor & upload state
  const editorRef = React.useRef<Editor | null>(null);
  const pendingUploads = React.useRef<Map<string, Promise<void>>>(new Map());
  const pendingPickerId = React.useRef<string | null>(null);

  // Markdown sync refs
  const latestMd = React.useRef<string>(data.content ?? '');
  const emittedMd = React.useRef<string>(data.content ?? '');

  // Link popover state
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const linkInputRef = React.useRef<HTMLInputElement | null>(null);

  // ── Core helpers ────────────────────────────────────────────────────────

  const getSectionId = React.useCallback((): string | null => {
    const el =
      sectionRef.current ??
      (hostRef.current?.closest('[data-section-id]') as HTMLElement | null);
    sectionRef.current = el;
    return el?.getAttribute('data-section-id') ?? null;
  }, []);

  const emit = React.useCallback(
    (markdown: string) => {
      latestMd.current = markdown;
      const sectionId = getSectionId();
      if (!sectionId) return;
      window.parent.postMessage(
        {
          type: STUDIO_EVENTS.INLINE_FIELD_UPDATE,
          sectionId,
          fieldKey: 'content',
          value: markdown,
        },
        window.location.origin
      );
      emittedMd.current = markdown;
    },
    [getSectionId]
  );

  const setFocusLock = React.useCallback((on: boolean) => {
    sectionRef.current?.classList.toggle('jp-editorial-focus', on);
  }, []);

  // ── Image upload ─────────────────────────────────────────────────────────

  const insertPlaceholder = React.useCallback(
    (uploadId: string, src: string, awaitingUpload: boolean) => {
      const ed = editorRef.current;
      if (!ed) return;
      ed.chain()
        .focus()
        .setImage({
          src,
          alt: 'upload-placeholder',
          title: awaitingUpload ? 'Click to upload' : 'Uploading…',
          uploadId,
          uploading: !awaitingUpload,
          awaitingUpload,
          uploadError: false,
        } as any)
        .run();
      emit(getMarkdown(ed));
    },
    [emit]
  );

  const doUpload = React.useCallback(
    async (uploadId: string, file: File) => {
      const uploadFn = assets?.onAssetUpload;
      if (!uploadFn) return;
      const ed = editorRef.current;
      if (!ed) return;
      patchImage(ed, uploadId, {
        src: UPLOADING_SRC,
        alt: file.name,
        title: file.name,
        uploading: true,
        awaitingUpload: false,
        uploadError: false,
      });
      const task = (async () => {
        try {
          const url = await uploadFn(file);
          const cur = editorRef.current;
          if (cur) {
            patchImage(cur, uploadId, {
              src: url,
              alt: file.name,
              title: file.name,
              uploadId: null,
              uploading: false,
              awaitingUpload: false,
              uploadError: false,
            });
            emit(getMarkdown(cur));
          }
        } catch (err) {
          console.error('[tiptap] upload failed', err);
          const cur = editorRef.current;
          if (cur)
            patchImage(cur, uploadId, {
              uploading: false,
              awaitingUpload: false,
              uploadError: true,
            });
        } finally {
          pendingUploads.current.delete(uploadId);
        }
      })();
      pendingUploads.current.set(uploadId, task);
      await task;
    },
    [assets, emit]
  );

  const uploadFile = React.useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();
      insertPlaceholder(id, UPLOADING_SRC, false);
      await doUpload(id, file);
    },
    [insertPlaceholder, doUpload]
  );

  // ── Stable editorProps via refs (avoids stale closures in useEditor) ─────
  // Reads refs at call-time so useEditor never needs to rebuild the editor.

  const uploadFileRef = React.useRef(uploadFile);
  uploadFileRef.current = uploadFile;
  const assetsRef = React.useRef(assets);
  assetsRef.current = assets;

  const editorProps = React.useMemo(
    () => ({
      attributes: { class: EDITOR_CLASSES },
      handleDrop: (_v: unknown, event: DragEvent) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file?.type.startsWith('image/') || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] drop upload failed', e)
        );
        return true;
      },
      handlePaste: (_v: unknown, event: ClipboardEvent) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((f: File) =>
          f.type.startsWith('image/')
        );
        if (!file || !assetsRef.current?.onAssetUpload) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch((e) =>
          console.error('[tiptap] paste upload failed', e)
        );
        return true;
      },
      handleClickOn: (
        _v: unknown,
        _p: number,
        node: { type: { name: string }; attrs?: Record<string, unknown> }
      ) => {
        if (node.type.name !== 'image' || node.attrs?.awaitingUpload !== true) return false;
        const uploadId =
          typeof node.attrs?.uploadId === 'string' ? node.attrs.uploadId : null;
        if (!uploadId) return false;
        pendingPickerId.current = uploadId;
        fileInputRef.current?.click();
        return true;
      },
    }),
    [] // intentionally empty — reads refs at call-time
  );

  // ── useEditor ─────────────────────────────────────────────────────────────

  const emitRef = React.useRef(emit);
  emitRef.current = emit;

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: data.content ?? '',
    autofocus: false,
    editorProps,
    onUpdate: ({ editor: e }: { editor: Editor }) => emitRef.current(getMarkdown(e)),
    onFocus: () => setFocusLock(true),
    onBlur: ({ editor: e }: { editor: Editor }) => {
      const md = getMarkdown(e);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
  });

  // ── Effects ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    sectionRef.current =
      hostRef.current?.closest('[data-section-id]') as HTMLElement | null;
  }, []);

  React.useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);

  // Sync external content changes into editor (e.g. engine-level undo)
  React.useEffect(() => {
    if (!editor) return;
    const next = data.content ?? '';
    if (next === latestMd.current) return;
    editor.commands.setContent(next);
    latestMd.current = next;
  }, [data.content, editor]);

  // PreviewEntry receives REQUEST_INLINE_FLUSH via postMessage and re-dispatches
  // it as a DOM CustomEvent. Listen to the DOM event — do NOT send INLINE_FLUSHED
  // back (PreviewEntry already handles that acknowledgement).
  React.useEffect(() => {
    const handler = () => {
      void (async () => {
        if (pendingUploads.current.size > 0) {
          await Promise.allSettled(Array.from(pendingUploads.current.values()));
        }
        emitRef.current(getMarkdown(editorRef.current));
      })();
    };
    window.addEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
    return () => window.removeEventListener(STUDIO_EVENTS.REQUEST_INLINE_FLUSH, handler);
  }, []);

  // File input cancel: modern browsers fire a 'cancel' event when user
  // closes the picker without selecting a file.
  React.useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;
    const onCancel = () => {
      const pickId = pendingPickerId.current;
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
    };
    input.addEventListener('cancel', onCancel);
    return () => input.removeEventListener('cancel', onCancel);
  }, []);

  // Emit on unmount (safety flush)
  React.useEffect(
    () => () => {
      const md = getMarkdown(editorRef.current);
      if (md !== emittedMd.current) emitRef.current(md);
      setFocusLock(false);
    },
    [setFocusLock]
  );

  // Focus link input when popover opens
  React.useEffect(() => {
    if (linkOpen) {
      const t = setTimeout(() => linkInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [linkOpen]);

  // ── Toolbar actions ───────────────────────────────────────────────────────

  const openLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    setLinkUrl(prev ?? 'https://');
    setLinkOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (href === '' || href === 'https://') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const pickId = pendingPickerId.current;
    e.target.value = '';

    if (!file?.type.startsWith('image/') || !assets?.onAssetUpload) {
      // File picker opened but no valid file selected — clean up placeholder
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true,
        });
      }
      pendingPickerId.current = null;
      return;
    }

    void (async () => {
      try {
        if (pickId) {
          await doUpload(pickId, file);
          pendingPickerId.current = null;
        } else {
          await uploadFile(file);
        }
      } catch (err) {
        console.error('[tiptap] picker upload failed', err);
        pendingPickerId.current = null;
      }
    })();
  };

  const onPickImage = () => {
    if (pendingPickerId.current) return;
    const id = crypto.randomUUID();
    pendingPickerId.current = id;
    insertPlaceholder(id, PICKER_SRC, true);
  };

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor?.isActive(name, attrs) ?? false;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={hostRef} data-jp-field="content" className="space-y-2">
      {editor && (
        <div
          data-jp-ignore-select="true"
          className="sticky top-0 z-[65] border-b border-[var(--local-toolbar-border)] bg-[var(--local-toolbar-bg)]"
        >
          {/* ── Main toolbar ── */}
          <div className="flex flex-wrap items-center justify-center gap-1 p-2">
            {/* History */}
            <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 size={13} />
            </Btn>
            <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 size={13} />
            </Btn>
            <Sep />

            {/* Block type */}
            <Btn
              active={isActive('paragraph')}
              title="Paragraph"
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </Btn>
            <Btn
              active={isActive('heading', { level: 1 })}
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </Btn>
            <Btn
              active={isActive('heading', { level: 2 })}
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </Btn>
            <Btn
              active={isActive('heading', { level: 3 })}
              title="Heading 3"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </Btn>
            <Sep />

            {/* Inline marks */}
            <Btn
              active={isActive('bold')}
              title="Bold (Ctrl+B)"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={13} />
            </Btn>
            <Btn
              active={isActive('italic')}
              title="Italic (Ctrl+I)"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={13} />
            </Btn>
            <Btn
              active={isActive('strike')}
              title="Strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={13} />
            </Btn>
            <Btn
              active={isActive('code')}
              title="Inline code"
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code2 size={13} />
            </Btn>
            <Sep />

            {/* Lists & block nodes */}
            <Btn
              active={isActive('bulletList')}
              title="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={13} />
            </Btn>
            <Btn
              active={isActive('orderedList')}
              title="Ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={13} />
            </Btn>
            <Btn
              active={isActive('blockquote')}
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={13} />
            </Btn>
            <Btn
              active={isActive('codeBlock')}
              title="Code block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <SquareCode size={13} />
            </Btn>
            <Sep />

            {/* Link / image / clear */}
            <Btn
              active={isActive('link') || linkOpen}
              title="Set link"
              onClick={openLink}
            >
              <Link2 size={13} />
            </Btn>
            <Btn
              title="Remove link"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Unlink2 size={13} />
            </Btn>
            <Btn title="Insert image" onClick={onPickImage}>
              <ImagePlus size={13} />
            </Btn>
            <Btn
              title="Clear formatting"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            >
              <Eraser size={13} />
            </Btn>
          </div>

          {/* ── Link popover row (replaces window.prompt) ── */}
          {linkOpen && (
            <div className="flex items-center gap-2 border-t border-[var(--local-toolbar-border)] px-2 py-1.5">
              <Link2 size={12} className="shrink-0 text-[var(--local-toolbar-text)]" />
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === 'Escape') setLinkOpen(false);
                }}
                placeholder="https://example.com"
                className="min-w-0 flex-1 bg-transparent text-xs text-[var(--local-text)] placeholder:text-[var(--local-toolbar-text)] outline-none"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyLink}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-primary)] hover:brightness-110 text-white transition-colors"
              >
                Set
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLinkOpen(false)}
                className="shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-toolbar-active-bg)] hover:bg-[var(--local-toolbar-hover-bg)] text-[var(--local-text)] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <EditorContent editor={editor} className="jp-simple-editor" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />
    </div>
  );
};

// ── Public view ───────────────────────────────────────────────────────────────

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & ExtraProps;

const mdHeading =
  (level: 2 | 3) =>
  ({ children, node: _node, ...rest }: HeadingProps) => {
    const text = String(children ?? '');
    const id = slugify(text);
    const Tag = `h${level}` as 'h2' | 'h3';
    return <Tag id={id} {...rest}>{children}</Tag>;
  };

const MD_COMPONENTS: Components = {
  h2: mdHeading(2),
  h3: mdHeading(3),
};

const PublicTiptapContent: React.FC<{ content: string }> = ({ content }) => (
  <article className="jp-tiptap-content" data-jp-field="content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={MD_COMPONENTS}
    >
      {content}
    </ReactMarkdown>
  </article>
);

// ── Export ────────────────────────────────────────────────────────────────────

export const Tiptap: React.FC<{ data: TiptapData; settings?: TiptapSettings }> = ({ data, settings: _settings }) => {
  const { mode } = useStudio();
  const isStudio = mode === 'studio';

  const toc = React.useMemo(() => extractToc(data.content ?? ''), [data.content]);
  const [activeId, setActiveId] = React.useState<string>('');
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // IntersectionObserver to track active heading (public mode and studio mode)
  React.useEffect(() => {
    if (toc.length === 0) return;
    const ids = toc.map((e) => e.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute('id') ?? '';
          if (id) setActiveId(id);
        }
      },
      { rootMargin: '-60px 0px -60% 0px', threshold: 0 }
    );
    const scan = () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };
    // Delay slightly so the DOM is ready (especially in Studio with Tiptap rendering)
    const t = setTimeout(scan, 300);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [toc, isStudio]);

  const handleNav = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      return;
    }
    // Studio mode: headings are in ProseMirror, no IDs — find by text in editor DOM
    if (contentRef.current) {
      const headings = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      );
      const target = headings.find((h) => slugify(h.textContent ?? '') === id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
      }
    }
  }, []);

  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'var(--border)',
        '--local-radius-sm': 'var(--theme-radius-sm)',
        '--local-radius-md': 'var(--theme-radius-md)',
        '--local-radius-lg': 'var(--theme-radius-lg)',
        '--local-toolbar-bg': 'var(--demo-surface-strong)',
        '--local-toolbar-hover-bg': 'var(--demo-surface)',
        '--local-toolbar-active-bg': 'var(--demo-accent-soft)',
        '--local-toolbar-border': 'var(--demo-border-soft)',
        '--local-toolbar-text': 'var(--demo-text-faint)',
      } as React.CSSProperties}
      className="w-full py-12 bg-[var(--local-bg)]"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex gap-8">
          {toc.length > 0 && (
            <DocsSidebar toc={toc} activeId={activeId} onNav={handleNav} />
          )}
          <div ref={contentRef} className="flex-1 min-w-0">
            {isStudio ? (
              <StudioTiptapEditor data={data} />
            ) : (
              <PublicTiptapContent content={data.content ?? ''} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const TiptapSchema = BaseSectionData.extend({
  content: z.string().default('').describe('ui:editorial-markdown'),
});

export const TiptapSettingsSchema = z.object({});

END_OF_FILE_CONTENT
echo "Creating src/components/tiptap/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/tiptap/types.ts"
import { z } from 'zod';
import { TiptapSchema, TiptapSettingsSchema } from './schema';

export type TiptapData = z.infer<typeof TiptapSchema>;
export type TiptapSettings = z.infer<typeof TiptapSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/ui"
echo "Creating src/components/ui/OlonMark.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/OlonMark.tsx"
import { cn } from '@/lib/utils'

interface OlonMarkProps {
  size?: number
  /** mono: uses currentColor — for single-colour print/emboss contexts */
  variant?: 'default' | 'mono'
  className?: string
}

export function OlonMark({ size = 32, variant = 'default', className }: OlonMarkProps) {
  const gid = `olon-ring-${size}`

  if (variant === 'mono') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        aria-label="Olon mark"
        className={cn('flex-shrink-0', className)}
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="20"/>
        <circle cx="50" cy="50" r="15" fill="currentColor"/>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      aria-label="Olon mark"
      className={cn('flex-shrink-0', className)}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--olon-ring-top)"/>
          <stop offset="100%" stopColor="var(--olon-ring-bottom)"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" stroke={`url(#${gid})`} strokeWidth="20"/>
      <circle cx="50" cy="50" r="15" fill="var(--olon-nucleus)"/>
    </svg>
  )
}

interface OlonLogoProps {
  markSize?: number
  fontSize?: number
  variant?: 'default' | 'mono'
  className?: string
}

export function OlonLogo({
  markSize = 32,
  fontSize = 24,
  variant = 'default',
  className,
}: OlonLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <OlonMark size={markSize} variant={variant}/>
      <span
        style={{
          fontFamily: "'Instrument Sans', Helvetica, Arial, sans-serif",
          fontWeight: 700,
          fontSize,
          letterSpacing: '-0.02em',
          color: 'hsl(var(--foreground))',
          lineHeight: 1,
        }}
      >
        Olon
      </span>
    </div>
  )
}

END_OF_FILE_CONTENT
echo "Creating src/components/ui/badge.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/badge.tsx"
import * as React from "react"
import { cn } from "@/lib/utils"

export type BadgeVariant = "default" | "secondary" | "outline" | "brand"

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-primary/10 border border-primary/30 text-primary",
  secondary:
    "bg-muted border border-border text-muted-foreground",
  outline:
    "bg-transparent border border-border text-muted-foreground",
  brand:
    "bg-primary/10 border border-primary/30 text-primary font-mono",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant ?? "default"],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/button.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/button.tsx"
import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

export type ButtonVariant = "default" | "outline" | "ghost" | "secondary"
export type ButtonSize = "default" | "sm" | "lg" | "icon"

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow hover:brightness-110 active:scale-[0.98]",
  outline:
    "border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
}

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-5 py-2.5 text-sm",
  sm: "h-8 px-3 py-1.5 text-xs rounded-md",
  lg: "h-11 px-7 py-3 text-base",
  icon: "h-9 w-9",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : "button"
    return (
      <Comp
        data-slot="button"
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          variantClasses[variant ?? "default"],
          sizeClasses[size ?? "default"],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/card.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/card.tsx"
import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-base font-semibold leading-snug text-foreground", className)}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

END_OF_FILE_CONTENT
echo "Creating src/components/ui/checkbox.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/checkbox.tsx"
"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-[4px] border transition-colors group-has-disabled/field:opacity-50 focus-visible:ring-3 aria-invalid:ring-3 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }





END_OF_FILE_CONTENT
echo "Creating src/components/ui/input.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/input.tsx"
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }





END_OF_FILE_CONTENT
echo "Creating src/components/ui/label.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/label.tsx"
import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Label }





END_OF_FILE_CONTENT
echo "Creating src/components/ui/select.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/select.tsx"
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-full items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative z-[110] max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", 
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", 
          className 
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}




END_OF_FILE_CONTENT
echo "Creating src/components/ui/select.txt..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/select.txt"
import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-full items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative z-[110] max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none", 
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", 
          className 
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-1",
            position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}




END_OF_FILE_CONTENT
echo "Creating src/components/ui/separator.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/separator.tsx"
"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }





END_OF_FILE_CONTENT
echo "Creating src/components/ui/skeleton.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/skeleton.tsx"
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };

END_OF_FILE_CONTENT
echo "Creating src/components/ui/textarea.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/ui/textarea.tsx"
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-3 aria-invalid:ring-3 md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }





END_OF_FILE_CONTENT
mkdir -p "src/data"
mkdir -p "src/data/config"
echo "Creating src/data/config/menu.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/menu.json"
{
  "main": [
    {
      "label": "Architecture",
      "href": "#architecture"
    },
    {
      "label": "CMS",
      "href": "#cms"
    },
    {
      "label": "Versioning",
      "href": "#git"
    },
    {
      "label": "Developer",
      "href": "#devex"
    }
  ]
}
END_OF_FILE_CONTENT
echo "Creating src/data/config/site.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/site.json"
{
  "identity": {
    "title": "JsonPages",
    "logoUrl": "/logo.svg"
  },
  "pages": [
    {
      "slug": "home",
      "label": "Home"
    },
    {
      "slug": "docs",
      "label": "Docs"
    },
    {
      "slug": "architecture",
      "label": "Architecture"
    },
    {
      "slug": "usage",
      "label": "Usage"
    }
  ],
  "header": {
    "id": "global-header",
    "type": "header",
    "data": {
      "logoText": "Olon",
      "logoHighlight": "JS",
      "logoIconText": "",
      "badge": "v1.4.0",
      "links": [
        {
          "label": "Architecture",
          "href": "#architecture"
        },
        {
          "label": "CMS",
          "href": "#cms"
        },
        {
          "label": "Versioning",
          "href": "#git"
        },
        {
          "label": "Developer",
          "href": "#devex"
        }
      ]
    },
    "settings": {
      "sticky": true
    }
  },
  "footer": {
    "id": "global-footer",
    "type": "footer",
    "data": {
      "brandText": "Olon",
      "brandHighlight": "JS",
      "copyright": "© 2026 OlonJS · Guido Serio",
      "links": [
        {
          "label": "Docs",
          "href": "/docs"
        },
        {
          "label": "GitHub",
          "href": "https://github.com/olonjs/npm-jpcore"
        },
        {
          "label": "MIT License",
          "href": "https://github.com/olonjs/npm-jpcore/blob/main/LICENSE"
        }
      ]
    },
    "settings": {
      "showLogo": true
    }
  }
}
END_OF_FILE_CONTENT
echo "Creating src/data/config/theme.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/config/theme.json"
{
  "name": "Olon",
  "tokens": {
    "colors": {
      "primary": "#1763FF",
      "secondary": "#0F52E0",
      "accent": "#84ABFF",
      "background": "#0d1117",
      "surface": "#0d1421",
      "surfaceAlt": "#141b24",
      "text": "#c8d6e8",
      "textMuted": "#8fa3c4",
      "border": "#253044"
    },
    "typography": {
      "fontFamily": {
        "primary": "'Instrument Sans', Helvetica, Arial, sans-serif",
        "mono": "'JetBrains Mono', 'Fira Code', monospace",
        "display": "'Instrument Sans', Helvetica, Arial, sans-serif"
      }
    },
    "borderRadius": {
      "sm": "0.25rem",
      "md": "0.5rem",
      "lg": "0.75rem"
    }
  }
}
END_OF_FILE_CONTENT
mkdir -p "src/data/pages"
echo "Creating src/data/pages/docs.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/docs.json"
{
  "id": "docs-page",
  "slug": "docs",
  "meta": {
    "title": "OlonJS Architecture Specifications v1.3",
    "description": "Mandatory Standard — Sovereign Core Edition. Architecture, Studio/ICE UX, Path-Deterministic Nested Editing."
  },
  "sections": [
    {
      "id": "docs-main",
      "type": "tiptap",
      "data": {
        "content": "# 📐 OlonJS Architecture Specifications v1.3\n\n**Status:** Mandatory Standard\\\n**Version:** 1.3.0 (Sovereign Core Edition — Architecture + Studio/ICE UX, Path-Deterministic Nested Editing)\\\n**Target:** Senior Architects / AI Agents / Enterprise Governance\n\n**Scope v1.3:** This edition preserves the complete v1.2 architecture (MTRP, JSP, TBP, CIP, ECIP, JAP + Studio/ICE UX contract: IDAC, TOCC, BSDS, ASC, JEB + Tenant Type & Code-Generation Annex) as a **faithful superset**, and adds strict path-based/nested-array behavior for Studio selection and Inspector expansion.\\\n**Scope note (breaking):** In strict v1.3 Studio semantics, the legacy flat protocol (`itemField` / `itemId`) is removed in favor of `itemPath` (root-to-leaf path segments).\n\n---\n\n## 1. 📐 Modular Type Registry Pattern (MTRP) v1.2\n\n**Objective:** Establish a strictly typed, open-ended protocol for extending content data structures where the **Core Engine** is the orchestrator and the **Tenant** is the provider.\n\n### 1.1 The Sovereign Dependency Inversion\n\nThe **Core** defines the empty `SectionDataRegistry`. The **Tenant** \"injects\" its specific definitions using **Module Augmentation**. This allows the Core to be distributed as a compiled NPM package while remaining aware of Tenant-specific types at compile-time.\n\n### 1.2 Technical Implementation (`@olonjs/core/kernel`)\n\n```typescript\nexport interface SectionDataRegistry {} // Augmented by Tenant\nexport interface SectionSettingsRegistry {} // Augmented by Tenant\n\nexport interface BaseSection<K extends keyof SectionDataRegistry> {\n  id: string;\n  type: K;\n  data: SectionDataRegistry[K];\n  settings?: K extends keyof SectionSettingsRegistry\n    ? SectionSettingsRegistry[K]\n    : BaseSectionSettings;\n}\n\nexport type Section = {\n  [K in keyof SectionDataRegistry]: BaseSection<K>\n}[keyof SectionDataRegistry];\n```\n\n**SectionType:** Core exports (or Tenant infers) `SectionType` as `keyof SectionDataRegistry`. After Tenant module augmentation, this is the union of all section type keys (e.g. `'header' | 'footer' | 'hero' | ...`). The Tenant uses this type for the ComponentRegistry and SECTION_SCHEMAS keys.\n\n**Perché servono:** Il Core deve poter renderizzare section senza conoscere i tipi concreti a compile-time; il Tenant deve poter aggiungere nuovi tipi senza modificare il Core. I registry vuoti + module augmentation permettono di distribuire Core come pacchetto NPM e mantenere type-safety end-to-end (Section, registry, config). Senza MTRP, ogni nuovo tipo richiederebbe cambi nel Core o tipi deboli (`any`).\n\n---\n\n## 2. 📐 JsonPages Site Protocol (JSP) v1.8\n\n**Objective:** Define the deterministic file system and the **Sovereign Projection Engine** (CLI).\n\n### 2.1 The File System Ontology (The Silo Contract)\n\nEvery site must reside in an isolated directory. Global Governance is physically separated from Local Content.\n\n- `/config/site.json` — Global Identity & Reserved System Blocks (Header/Footer). See Appendix A for typed shape.\n- `/config/menu.json` — Navigation Tree (SSOT for System Header). See Appendix A.\n- `/config/theme.json` — Theme tokens (optional but recommended). See Appendix A.\n- `/pages/[slug].json` — Local Body Content per page. See Appendix A (PageConfig).\n\n**Application path convention:** The runtime app typically imports these via an alias (e.g. `@/data/config/` and `@/data/pages/`). The physical silo may be `src/data/config/` and `src/data/pages/` so that `site.json`, `menu.json`, `theme.json` live under `src/data/config/`, and page JSONs under `src/data/pages/`. The CLI or projection script may use `/config/` and `/pages/` at repo root; the **contract** is that the app receives **siteConfig**, **menuConfig**, **themeConfig**, and **pages** as defined in JEB (§10) and Appendix A.\n\n### 2.2 Deterministic Projection (CLI Workflow)\n\nThe CLI (`@olonjs/cli`) creates new tenants by:\n\n1. **Infra Projection:** Generating `package.json`, `tsconfig.json`, and `vite.config.ts` (The Shell).\n2. **Source Projection:** Executing a deterministic script (`src_tenant_alpha.sh`) to reconstruct the `src` folder (The DNA).\n3. **Dependency Resolution:** Enforcing specific versions of React, Radix, and Tailwind v4.\n\n**Perché servono:** Una struttura file deterministica (config vs pages) separa governance globale (site, menu, theme) dal contenuto per pagina; il CLI può rigenerare tenant e tooling può trovare dati e schemi sempre negli stessi path. Senza JSP, ogni tenant sarebbe una struttura ad hoc e ingestione/export/Bake sarebbero fragili.\n\n---\n\n## 3. 🧱 Tenant Block Protocol (TBP) v1.0\n\n**Objective:** Standardize the \"Capsule\" structure for components to enable automated ingestion (Pull) by the SaaS.\n\n### 3.1 The Atomic Capsule Structure\n\nComponents are self-contained directories under `src/components/<sectionType>/`:\n\n- `View.tsx` — The pure React component (Dumb View). Props: see Appendix A (SectionComponentPropsMap).\n- `schema.ts` — Zod schema(s) for the **data** contract (and optionally **settings**). Exports at least one schema (e.g. `HeroSchema`) used as the **data** schema for that type. Must extend BaseSectionData (§8) for data; array items must extend BaseArrayItem (§8).\n- `types.ts` — TypeScript interfaces inferred from the schema (e.g. `HeroData`, `HeroSettings`). Export types with names `<SectionType>Data` and `<SectionType>Settings` (or equivalent) so the Tenant can aggregate them in a single types module.\n- `index.ts` — Public API: re-exports View, schema(s), and types.\n\n### 3.2 Reserved System Types\n\n- `type: 'header'` — Reserved for `site.json`. Receives `menu: MenuItem[]` in addition to `data` and `settings`. Menu is sourced from `menu.json` (see Appendix A). The Tenant **must** type `SectionComponentPropsMap['header']` as `{ data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] }`.\n- `type: 'footer'` — Reserved for `site.json`. Props: `{ data: FooterData; settings?: FooterSettings }` only (no `menu`).\n- `type: 'sectionHeader'` — A standard local block. Must define its own `links` array in its local schema if used.\n\n**Perché servono:** La capsula (View + schema + types + index) è l’unità di estensione: il Core e il Form Factory possono scoprire tipi e contratti per tipo senza convenzioni ad hoc. Header/footer riservati evitano conflitti tra globale e locale. Senza TBP, aggregazione di SECTION_SCHEMAS e registry sarebbe incoerente e l’ingestion da SaaS non sarebbe automatizzabile.\n\n---\n\n## 4. 🧱 Component Implementation Protocol (CIP) v1.5\n\n**Objective:** Ensure system-wide stability and Admin UI integrity.\n\n1. **The \"Sovereign View\" Law:** Components receive `data` and `settings` (and `menu` for header only) and return JSX. They are metadata-blind (never import Zod schemas).\n2. **Z-Index Neutrality:** Components must not use `z-index > 1`. Layout delegation (sticky/fixed) is managed by the `SectionRenderer`.\n3. **Agnostic Asset Protocol:** Use `resolveAssetUrl(path, tenantId)` for all media. Resolved URLs are under `/assets/...` with no tenantId segment in the path (e.g. relative `img/hero.jpg` → `/assets/img/hero.jpg`).\n\n### 4.4 Local Design Tokens (v1.2)\n\nSection Views that control their own background, text, borders, or radii **shall** define a **local scope** via an inline `style` object on the section root: e.g. `--local-bg`, `--local-text`, `--local-text-muted`, `--local-surface`, `--local-border`, `--local-radius-lg`, `--local-accent`, mapped to theme variables. All Tailwind classes that affect color or radius in that section **must** use these variables (e.g. `bg-[var(--local-bg)]`, `text-[var(--local-text)]`). No naked utilities (e.g. `bg-blue-500`). An optional `label` in section data may be rendered with class `jp-section-label` for overlay type labels.\n\n### 4.5 Z-Index & Overlay Governance (v1.2)\n\nSection content root **must** stay at `z-index` **≤ 1** (prefer `z-0`) so the Sovereign Overlay can sit above with high z-index in Tenant CSS (§7). Header/footer may use a higher z-index (e.g. 50) only as a documented exception for global chrome.\n\n**Perché servono (CIP):** View “dumb” (solo data/settings) e senza import di Zod evita accoppiamento e permette al Form Factory di essere l’unica fonte di verità sugli schemi. Z-index basso evita che il contenuto copra l’overlay di selezione in Studio. Asset via `resolveAssetUrl`: i path relativi vengono risolti in `/assets/...` (senza segmento tenantId nel path). Token locali (`--local-*`) rendono le section temabili e coerenti con overlay e tema; senza, stili “nudi” creano drift visivo e conflitti con l’UI di editing.\n\n---\n\n## 5. 🛠️ Editor Component Implementation Protocol (ECIP) v1.5\n\n**Objective:** Standardize the Polymorphic ICE engine.\n\n1. **Recursive Form Factory:** The Admin UI builds forms by traversing the Zod ontology.\n2. **UI Metadata:** Use `.describe('ui:[widget]')` in schemas to pass instructions to the Form Factory.\n3. **Deterministic IDs:** Every object in a `ZodArray` must extend `BaseArrayItem` (containing an `id`) to ensure React reconciliation stability during reordering.\n\n### 5.4 UI Metadata Vocabulary (v1.2)\n\nStandard keys for the Form Factory:\n\nKey Use case `ui:text` Single-line text input. `ui:textarea` Multi-line text. `ui:select` Enum / single choice. `ui:number` Numeric input. `ui:list` Array of items; list editor (add/remove/reorder). `ui:icon-picker` Icon selection.\n\nUnknown keys may be treated as `ui:text`. Array fields must use `BaseArrayItem` for items.\n\n### 5.5 Path-Only Nested Selection & Expansion (v1.3, breaking)\n\nIn strict v1.3 Studio/Inspector behavior, nested editing targets are represented by **path segments from root to leaf**.\n\n```typescript\nexport type SelectionPathSegment = { fieldKey: string; itemId?: string };\nexport type SelectionPath = SelectionPathSegment[];\n```\n\nRules:\n\n- Expansion and focus for nested arrays **must** be computed from `SelectionPath` (root → leaf), not from a single flat pair.\n- Matching by `fieldKey` alone is non-compliant for nested structures.\n- Legacy flat payload fields `itemField` and `itemId` are removed from strict v1.3 selection protocol.\n\n**Perché servono (ECIP):** Il Form Factory deve sapere quale widget usare (text, textarea, select, list, …) senza hardcodare per tipo; `.describe('ui:...')` è il contratto. BaseArrayItem con `id` su ogni item di array garantisce chiavi stabili in React e reorder/delete corretti nell’Inspector. In v1.3 la selezione/espansione path-only elimina ambiguità su array annidati: senza path completo root→leaf, la sidebar può aprire il ramo sbagliato o non aprire il target.\n\n---\n\n## 6. 🎯 ICE Data Attribute Contract (IDAC) v1.1\n\n**Objective:** Mandatory data attributes so the Stage (iframe) and Inspector can bind selection and field/item editing without coupling to Tenant DOM.\n\n### 6.1 Section-Level Markup (Core-Provided)\n\n**SectionRenderer** (Core) wraps each section root with:\n\n- `data-section-id` — Section instance ID (e.g. UUID). On the wrapper that contains content + overlay.\n- Sibling overlay element `data-jp-section-overlay` — Selection ring and type label. **Tenant does not add this;** Core injects it.\n\nTenant Views render the **content** root only (e.g. `<section>` or `<div>`), placed **inside** the Core wrapper.\n\n### 6.2 Field-Level Binding (Tenant-Provided)\n\nFor every **editable scalar field** the View **must** attach `data-jp-field=\"<fieldKey>\"` (key matches schema path: e.g. `title`, `description`, `sectionTitle`, `label`).\n\n### 6.3 Array-Item Binding (Tenant-Provided)\n\nFor every **editable array item** the View **must** attach:\n\n- `data-jp-item-id=\"<stableId>\"` — Prefer `item.id`; fallback e.g. `legacy-${index}` only outside strict mode.\n- `data-jp-item-field=\"<arrayKey>\"` — e.g. `cards`, `layers`, `products`, `paragraphs`.\n\n### 6.4 Compliance\n\n**Reserved types** (`header`, `footer`): ICE attributes optional unless Studio edits them. **All other section types** in the Stage and in `SECTION_SCHEMAS` **must** implement §6.2 and §6.3 for every editable field and array item.\n\n### 6.5 Strict Path Extraction for Nested Arrays (v1.3, breaking)\n\nFor nested array targets, the Core/Inspector contract is path-based:\n\n- The runtime selection target is expressed as `itemPath: SelectionPath` (root → leaf).\n- Flat identity (`itemField` + `itemId`) is not sufficient for nested structures and is removed in strict v1.3 payloads.\n- In strict mode, index-based identity fallback is non-compliant for editable object arrays.\n\n**Perché servono (IDAC):** Lo Stage è in un iframe e l’Inspector deve sapere **quale campo o item** corrisponde al click (o alla selezione) senza conoscere la struttura DOM del Tenant. `data-jp-field` associa un nodo DOM al path dello schema (es. `title`, `description`): così il Core può evidenziare la riga giusta nella sidebar, applicare opacità attivo/inattivo e aprire il form sul campo corretto. `data-jp-item-id` e `data-jp-item-field` fanno lo stesso per gli item di array (liste, reorder, delete). In v1.3, `itemPath` rende deterministico anche il caso nested (array dentro array), eliminando mismatch tra selezione canvas e ramo aperto in sidebar.\n\n---\n\n## 7. 🎨 Tenant Overlay CSS Contract (TOCC) v1.0\n\n**Objective:** The Stage iframe loads only Tenant HTML/CSS. Core injects overlay **markup** but does **not** ship overlay styles. The Tenant **must** supply CSS so overlay is visible.\n\n### 7.1 Required Selectors (Tenant global CSS)\n\n1. `[data-jp-section-overlay]` — `position: absolute; inset: 0`; `pointer-events: none`; base state transparent.\n2. `[data-section-id]:hover [data-jp-section-overlay]` — Hover: e.g. dashed border, subtle tint.\n3. `[data-section-id][data-jp-selected] [data-jp-section-overlay]` — Selected: solid border, optional tint.\n4. `[data-jp-section-overlay] > div` (type label) — Position and visibility (e.g. visible on hover/selected).\n\n### 7.2 Z-Index\n\nOverlay **z-index** high (e.g. 9999). Section content at or below CIP limit (§4.5).\n\n### 7.3 Responsibility\n\n**Core:** Injects wrapper and overlay DOM; sets `data-jp-selected`. **Tenant:** All overlay **visual** rules.\n\n**Perché servono (TOCC):** L’iframe dello Stage carica solo HTML/CSS del Tenant; il Core inietta il markup dell’overlay ma non gli stili. Senza CSS Tenant per i selettori TOCC, bordo hover/selected e type label non sarebbero visibili: l’autore non vedrebbe quale section è selezionata né il label del tipo. TOCC chiarisce la responsabilità (Core = markup, Tenant = aspetto) e garantisce UX uniforme tra tenant.\n\n---\n\n## 8. 📦 Base Section Data & Settings (BSDS) v1.0\n\n**Objective:** Standardize base schema fragments for anchors, array items, and section settings.\n\n### 8.1 BaseSectionData\n\nEvery section data schema **must** extend a base with at least `anchorId` (optional string). Canonical Zod (Tenant `lib/base-schemas.ts` or equivalent):\n\n```typescript\nexport const BaseSectionData = z.object({\n  anchorId: z.string().optional().describe('ui:text'),\n});\n```\n\n### 8.2 BaseArrayItem\n\nEvery array item schema editable in the Inspector **must** include `id` (optional string minimum). Canonical Zod:\n\n```typescript\nexport const BaseArrayItem = z.object({\n  id: z.string().optional(),\n});\n```\n\nRecommended: required UUID for new items. Used by `data-jp-item-id` and React reconciliation.\n\n### 8.3 BaseSectionSettings (Optional)\n\nCommon section-level settings. Canonical Zod (name **BaseSectionSettingsSchema** or as exported by Core):\n\n```typescript\nexport const BaseSectionSettingsSchema = z.object({\n  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),\n  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),\n  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),\n  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),\n});\n```\n\nCapsules may extend this for type-specific settings. Core may export **BaseSectionSettings** as the TypeScript type inferred from this or a superset.\n\n**Perché servono (BSDS):** anchorId permette deep-link e navigazione in-page; id sugli array item è necessario per `data-jp-item-id`, reorder e React reconciliation. BaseSectionSettings comuni (padding, theme, container) evitano ripetizione e allineano il Form Factory tra capsule. Senza base condivisi, ogni capsule inventa convenzioni e validazione/add-section diventano fragili.\n\n---\n\n## 9. 📌 AddSectionConfig (ASC) v1.0\n\n**Objective:** Formalize the \"Add Section\" contract used by the Studio.\n\n**Type (Core exports** `AddSectionConfig`**):**\n\n```typescript\ninterface AddSectionConfig {\n  addableSectionTypes: readonly string[];\n  sectionTypeLabels: Record<string, string>;\n  getDefaultSectionData(sectionType: string): Record<string, unknown>;\n}\n```\n\n**Shape:** Tenant provides one object (e.g. `addSectionConfig`) with:\n\n- `addableSectionTypes` — Readonly array of section type keys. Only these types appear in the Add Section Library. Must be a subset of (or equal to) the keys in SectionDataRegistry.\n- `sectionTypeLabels` — Map type key → display string (e.g. `{ hero: 'Hero', 'cta-banner': 'CTA Banner' }`).\n- `getDefaultSectionData(sectionType: string): Record<string, unknown>` — Returns default `data` for a new section. Must conform to the capsule’s data schema so the new section validates.\n\nCore creates a new section with deterministic UUID, `type`, and `data` from `getDefaultSectionData(type)`.\n\n**Perché servono (ASC):** Lo Studio deve mostrare una libreria “Aggiungi sezione” con nomi leggibili e, alla scelta, creare una section con dati iniziali validi. addableSectionTypes, sectionTypeLabels e getDefaultSectionData sono il contratto: il Tenant è l’unica fonte di verità su quali tipi sono addabili e con quali default. Senza ASC, il Core non saprebbe cosa mostrare in modal né come popolare i dati della nuova section.\n\n---\n\n## 10. ⚙️ JsonPagesConfig & Engine Bootstrap (JEB) v1.1\n\n**Objective:** Bootstrap contract between Tenant app and `@olonjs/core`.\n\n### 10.1 JsonPagesConfig (required fields)\n\nThe Tenant passes a single **config** object to **JsonPagesEngine**. Required fields:\n\nField Type Description **tenantId** string Passed to `resolveAssetUrl(path, tenantId)`; resolved asset URLs are `/assets/...` with no tenantId segment in the path. **registry** `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }` Component registry. Must match MTRP keys. See Appendix A. **schemas** `Record<SectionType, ZodType>` or equivalent SECTION_SCHEMAS: type → **data** Zod schema. Form Factory uses this. See Appendix A. **pages** `Record<string, PageConfig>` Slug → page config. See Appendix A. **siteConfig** SiteConfig Global site (identity, header/footer blocks). See Appendix A. **themeConfig** ThemeConfig Theme tokens. See Appendix A. **menuConfig** MenuConfig Navigation tree (SSOT for header menu). See Appendix A. **themeCss** `{ tenant: string }` At least **tenant**: string (inline CSS or URL) for Stage iframe injection. **addSection** AddSectionConfig Add-section config (§9).\n\nCore may define optional fields. The Tenant must not omit required fields.\n\n### 10.2 JsonPagesEngine\n\nRoot component: `<JsonPagesEngine config={config} />`. Responsibilities: route → page, SectionRenderer per section; in Studio mode Sovereign Shell (Inspector, Control Bar, postMessage); section wrappers and overlay per IDAC and JAP. Tenant does not implement the Shell.\n\n### 10.3 Studio Selection Event Contract (v1.3, breaking)\n\nIn strict v1.3 Studio, section selection payload for nested targets is path-based:\n\n```typescript\ntype SectionSelectMessage = {\n  type: 'SECTION_SELECT';\n  section: { id: string; type: string; scope: 'global' | 'local' };\n  itemPath?: SelectionPath; // root -> leaf\n};\n```\n\nRemoved from strict protocol:\n\n- `itemField`\n- `itemId`\n\n**Perché servono (JEB):** Un unico punto di bootstrap (config + Engine) evita che il Tenant replichi logica di routing, Shell e overlay. I campi obbligatori in JsonPagesConfig (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection) sono il minimo per far funzionare rendering, Studio e Form Factory; omissioni causano errori a runtime. In v1.3, il payload `itemPath` sincronizza in modo non ambiguo Stage e Inspector su nested arrays.\n\n---\n\n# 🏛️ OlonJS_ADMIN_PROTOCOL (JAP) v1.2\n\n**Status:** Mandatory Standard\\\n**Version:** 1.2.0 (Sovereign Shell Edition — Path/Nested Strictness)\\\n**Objective:** Deterministic orchestration of the \"Studio\" environment (ICE Level 1).\n\n---\n\n## 1. The Sovereign Shell Topology\n\nThe Admin interface is a **Sovereign Shell** from `@olonjs/core`.\n\n1. **The Stage (Canvas):** Isolated Iframe; postMessage for data updates and selection mirroring. Section markup follows **IDAC** (§6); overlay styling follows **TOCC** (§7).\n2. **The Inspector (Sidebar):** Consumes Tenant Zod schemas to generate editors; binding via `data-jp-field` and `data-jp-item-*`.\n3. **The Control Bar:** Save, Export, Add Section.\n\n## 2. State Orchestration & Persistence\n\n- **Working Draft:** Reactive local state for unsaved changes.\n- **Sync Law:** Inspector changes → Working Draft → Stage via `STUDIO_EVENTS.UPDATE_DRAFTS`.\n- **Bake Protocol:** \"Bake HTML\" requests snapshot from Iframe, injects `ProjectState` as JSON, triggers download.\n\n## 3. Context Switching (Global vs. Local)\n\n- **Header/Footer** selection → Global Mode, `site.json`.\n- Any other section → Page Mode, current `[slug].json`.\n\n## 4. Section Lifecycle Management\n\n1. **Add Section:** Modal from Tenant `SECTION_SCHEMAS`; UUID + default data via **AddSectionConfig** (§9).\n2. **Reorder:** Inspector or Stage Overlay; array mutation in Working Draft.\n3. **Delete:** Confirmation; remove from array, clear selection.\n\n## 5. Stage Isolation & Overlay\n\n- **CSS Shielding:** Stage in Iframe; Tenant CSS does not leak into Admin.\n- **Sovereign Overlay:** Selection ring and type labels injected per **IDAC** (§6); Tenant styles them per **TOCC** (§7).\n\n## 6. \"Green Build\" Validation\n\nStudio enforces `tsc && vite build`. No export with TypeScript errors.\n\n## 7. Path-Deterministic Selection & Sidebar Expansion (v1.3, breaking)\n\n- Section/item focus synchronization uses `itemPath` (root → leaf), not flat `itemField/itemId`.\n- Sidebar expansion state for nested arrays must be derived from all path segments.\n- Flat-only matching may open/close wrong branches and is non-compliant in strict mode.\n\n**Perché servono (JAP):** Stage in iframe + Inspector + Control Bar separano il contesto di editing dal sito; postMessage e Working Draft permettono modifiche senza toccare subito i file. Bake ed Export richiedono uno stato coerente. Global vs Page mode evita confusione su dove si sta editando (site.json vs \\[slug\\].json). Add/Reorder/Delete sono gestiti in un solo modo (Working Draft + ASC). Green Build garantisce che ciò che si esporta compili. In v1.3, il path completo elimina ambiguità nella sincronizzazione Stage↔Sidebar su strutture annidate.\n\n---\n\n## Compliance: Legacy vs Full UX (v1.3)\n\nDimension Legacy / Less UX Full UX (Core-aligned) **ICE binding** No `data-jp-*`; Inspector cannot bind. IDAC (§6) on every editable section/field/item. **Section wrapper** Plain `<section>`; no overlay contract. Core wrapper + overlay; Tenant CSS per TOCC (§7). **Design tokens** Raw BEM / fixed classes. Local tokens (§4.4); `var(--local-*)` only. **Base schemas** Ad hoc. BSDS (§8): BaseSectionData, BaseArrayItem, BaseSectionSettings. **Add Section** Ad hoc defaults. ASC (§9): addableSectionTypes, labels, getDefaultSectionData. **Bootstrap** Implicit. JEB (§10): JsonPagesConfig + JsonPagesEngine. **Selection payload** Flat `itemField/itemId`. Path-only `itemPath: SelectionPath` (JEB §10.3). **Nested array expansion** Single-segment or field-only heuristics. Root-to-leaf path expansion (ECIP §5.5, JAP §7). **Array item identity (strict)** Index fallback tolerated. Stable `id` required for editable object arrays.\n\n**Rule:** Every page section (non-header/footer) that appears in the Stage and in `SECTION_SCHEMAS` must comply with §6, §7, §4.4, §8, §9, §10 for full Studio UX.\n\n---\n\n## Summary of v1.3 Additions\n\n§ Title Purpose 5.5 Path-Only Nested Selection & Expansion ECIP: root→leaf `SelectionPath`; remove flat matching in strict mode. 6.5 Strict Path Extraction for Nested Arrays IDAC: path-based nested targeting; no strict flat fallback. 10.3 Studio Selection Event Contract JEB: `SECTION_SELECT` uses `itemPath`; remove `itemField/itemId`. JAP §7 Path-Deterministic Selection & Sidebar Expansion Studio state synchronization for nested arrays. Compliance Legacy vs Full UX (v1.3) Explicit breaking delta for flat protocol removal and strict IDs. **Appendix A.6** **v1.3 Path/Nested Strictness Addendum** Type/export and migration checklist for path-only protocol.\n\n---\n\n# Appendix A — Tenant Type & Code-Generation Annex\n\n**Objective:** Make the specification **sufficient** to generate or audit a full tenant (new site, new components, new data) without a reference codebase. Defines TypeScript types, JSON shapes, schema contract, file paths, and integration pattern.\n\n**Status:** Mandatory for code-generation and governance. Compliance ensures generated tenants are typed and wired like the reference implementation.\n\n---\n\n## A.1 Core-Provided Types (from `@olonjs/core`)\n\nThe following are assumed to be exported by Core. The Tenant augments **SectionDataRegistry** and **SectionSettingsRegistry**; all other types are consumed as-is.\n\nType Description **SectionType** `keyof SectionDataRegistry` (after Tenant augmentation). Union of all section type keys. **Section** Union of `BaseSection<K>` for all K in SectionDataRegistry. See MTRP §1.2. **BaseSectionSettings** Optional base type for section settings (may align with BSDS §8.3). **MenuItem** Navigation item. **Minimum shape:** `{ label: string; href: string }`. Core may extend (e.g. `children?: MenuItem[]`). **AddSectionConfig** See §9. **JsonPagesConfig** See §10.1.\n\n**Perché servono (A.1):** Il Tenant deve conoscere i tipi esportati dal Core (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig) per tipizzare registry, config e augmentation senza dipendere da implementazioni interne.\n\n---\n\n## A.2 Tenant-Provided Types (single source: `src/types.ts` or equivalent)\n\nThe Tenant **must** define the following in one module (e.g. `src/types.ts`). This module **must** perform the **module augmentation** of `@olonjs/core` for **SectionDataRegistry** and **SectionSettingsRegistry**, and **must** export **SectionComponentPropsMap** and re-export from `@olonjs/core` so that **SectionType** is available after augmentation.\n\n### A.2.1 SectionComponentPropsMap\n\nMaps each section type to the props of its React component. **Header** is the only type that receives **menu**.\n\n**Option A — Explicit (recommended for clarity and tooling):** For each section type K, add one entry. Header receives **menu**.\n\n```typescript\nimport type { MenuItem } from '@olonjs/core';\n// Import Data/Settings from each capsule.\n\nexport type SectionComponentPropsMap = {\n  'header': { data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] };\n  'footer': { data: FooterData; settings?: FooterSettings };\n  'hero': { data: HeroData; settings?: HeroSettings };\n  // ... one entry per SectionType, e.g. 'feature-grid', 'cta-banner', etc.\n};\n```\n\n**Option B — Mapped type (DRY, requires SectionDataRegistry/SectionSettingsRegistry in scope):**\n\n```typescript\nimport type { MenuItem } from '@olonjs/core';\n\nexport type SectionComponentPropsMap = {\n  [K in SectionType]: K extends 'header'\n    ? { data: SectionDataRegistry[K]; settings?: SectionSettingsRegistry[K]; menu: MenuItem[] }\n    : { data: SectionDataRegistry[K]; settings?: K extends keyof SectionSettingsRegistry ? SectionSettingsRegistry[K] : BaseSectionSettings };\n};\n```\n\nSectionType is imported from Core (after Tenant augmentation). In practice Option A is the reference pattern; Option B is valid if the Tenant prefers a single derived definition.\n\n**Perché servono (A.2):** SectionComponentPropsMap e i tipi di config (PageConfig, SiteConfig, MenuConfig, ThemeConfig) definiscono il contratto tra dati (JSON, API) e componente; l’augmentation è l’unico modo per estendere i registry del Core senza fork. Senza questi tipi, generazione tenant e refactor sarebbero senza guida e il type-check fallirebbe.\n\n### A.2.2 ComponentRegistry type\n\nThe registry object **must** be typed as:\n\n```typescript\nimport type { SectionType } from '@olonjs/core';\nimport type { SectionComponentPropsMap } from '@/types';\n\nexport const ComponentRegistry: {\n  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;\n} = { /* ... */ };\n```\n\nFile: `src/lib/ComponentRegistry.tsx` (or equivalent). Imports one View per section type and assigns it to the corresponding key.\n\n### A.2.3 PageConfig\n\nMinimum shape for a single page (used in **pages** and in each `[slug].json`):\n\n```typescript\nexport interface PageConfig {\n  id?: string;\n  slug: string;\n  meta?: {\n    title?: string;\n    description?: string;\n  };\n  sections: Section[];\n}\n```\n\n**Section** is the union type from MTRP (§1.2). Each element of **sections** has **id**, **type**, **data**, **settings** and conforms to the capsule schemas.\n\n### A.2.4 SiteConfig\n\nMinimum shape for **site.json** (and for **siteConfig** in JsonPagesConfig):\n\n```typescript\nexport interface SiteConfigIdentity {\n  title?: string;\n  logoUrl?: string;\n}\n\nexport interface SiteConfig {\n  identity?: SiteConfigIdentity;\n  pages?: Array<{ slug: string; label: string }>;\n  header: {\n    id: string;\n    type: 'header';\n    data: HeaderData;\n    settings?: HeaderSettings;\n  };\n  footer: {\n    id: string;\n    type: 'footer';\n    data: FooterData;\n    settings?: FooterSettings;\n  };\n}\n```\n\n**HeaderData**, **FooterData**, **HeaderSettings**, **FooterSettings** are the types exported from the header and footer capsules.\n\n### A.2.5 MenuConfig\n\nMinimum shape for **menu.json** (and for **menuConfig** in JsonPagesConfig). Structure is tenant-defined; Core expects the header to receive **MenuItem\\[\\]**. Common pattern: an object with a key (e.g. **main**) whose value is **MenuItem\\[\\]**.\n\n```typescript\nexport interface MenuConfig {\n  main?: MenuItem[];\n  [key: string]: MenuItem[] | undefined;\n}\n```\n\nOr simply `MenuItem[]` if the app uses a single flat list. The Tenant must ensure that the value passed to the header component as **menu** conforms to **MenuItem\\[\\]** (e.g. `menuConfig.main` or `menuConfig` if it is the array).\n\n### A.2.6 ThemeConfig\n\nMinimum shape for **theme.json** (and for **themeConfig** in JsonPagesConfig). Tenant-defined; typically tokens for colors, typography, radius.\n\n```typescript\nexport interface ThemeConfig {\n  name?: string;\n  tokens?: {\n    colors?: Record<string, string>;\n    typography?: Record<string, string | Record<string, string>>;\n    borderRadius?: Record<string, string>;\n  };\n  [key: string]: unknown;\n}\n```\n\n---\n\n## A.3 Schema Contract (SECTION_SCHEMAS)\n\n**Location:** `src/lib/schemas.ts` (or equivalent).\n\n**Contract:**\n\n- **SECTION_SCHEMAS** is a **single object** whose keys are **SectionType** and whose values are **Zod schemas for the section data** (not settings, unless the Form Factory contract expects a combined or per-type settings schema; then each value may be the data schema only, and settings may be defined per capsule and aggregated elsewhere if needed).\n- The Tenant **must** re-export **BaseSectionData**, **BaseArrayItem**, and optionally **BaseSectionSettingsSchema** from `src/lib/base-schemas.ts` (or equivalent). Each capsule’s data schema **must** extend BaseSectionData; each array item schema **must** extend or include BaseArrayItem.\n- **SECTION_SCHEMAS** is typed as `Record<SectionType, ZodType>` or `{ [K in SectionType]: ZodType }` so that keys match the registry and SectionDataRegistry.\n\n**Export:** The app imports **SECTION_SCHEMAS** and passes it as **config.schemas** to JsonPagesEngine. The Form Factory traverses these schemas to build editors.\n\n**Perché servono (A.3):** Un unico oggetto SECTION_SCHEMAS con chiavi = SectionType e valori = schema data permette al Form Factory di costruire form per tipo senza convenzioni ad hoc; i base schema garantiscono anchorId e id su item. Senza questo contratto, l’Inspector non saprebbe quali campi mostrare né come validare.\n\n---\n\n## A.4 File Paths & Data Layout\n\nPurpose Path (conventional) Description Site config `src/data/config/site.json` SiteConfig (identity, header, footer, pages list). Menu config `src/data/config/menu.json` MenuConfig (e.g. main nav). Theme config `src/data/config/theme.json` ThemeConfig (tokens). Page data `src/data/pages/<slug>.json` One file per page; content is PageConfig (slug, meta, sections). Base schemas `src/lib/base-schemas.ts` BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema. Schema aggregate `src/lib/schemas.ts` SECTION_SCHEMAS; re-exports base schemas. Registry `src/lib/ComponentRegistry.tsx` ComponentRegistry object. Add-section config `src/lib/addSectionConfig.ts` addSectionConfig (AddSectionConfig). Tenant types & augmentation `src/types.ts` SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** for SectionDataRegistry and SectionSettingsRegistry; re-export from Core. Bootstrap `src/App.tsx` Imports config (site, theme, menu, pages), registry, schemas, addSection, themeCss; builds JsonPagesConfig; renders .\n\nThe app entry (e.g. **main.tsx**) renders **App**. No other bootstrap contract is specified; the Tenant may use Vite aliases (e.g. **@/**) for the paths above.\n\n**Perché servono (A.4):** Path fissi (data/config, data/pages, lib/schemas, types.ts, App.tsx) permettono a CLI, tooling e agenti di trovare sempre gli stessi file; l’onboarding e la generazione da spec sono deterministici. Senza convenzione, ogni tenant sarebbe una struttura diversa.\n\n---\n\n## A.5 Integration Checklist (Code-Generation)\n\nWhen generating or auditing a tenant, ensure the following in order:\n\n 1. **Capsules** — For each section type, create `src/components/<type>/` with View.tsx, schema.ts, types.ts, index.ts. Data schema extends BaseSectionData; array items extend BaseArrayItem; View complies with CIP and IDAC (§6.2–6.3 for non-reserved types).\n 2. **Base schemas** — **src/lib/base-schemas.ts** exports BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema (and optional CtaSchema or similar shared fragments).\n 3. **types.ts** — Define SectionComponentPropsMap (header with **menu**), PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** and augment SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`.\n 4. **ComponentRegistry** — Import every View; build object **{ \\[K in SectionType\\]: ViewComponent }**; type as **{ \\[K in SectionType\\]: React.FC&lt;SectionComponentPropsMap\\[K\\]&gt; }**.\n 5. **schemas.ts** — Import base schemas and each capsule’s data schema; export SECTION_SCHEMAS as **{ \\[K in SectionType\\]: SchemaK }**; export SectionType as **keyof typeof SECTION_SCHEMAS** if not using Core’s SectionType.\n 6. **addSectionConfig** — addableSectionTypes, sectionTypeLabels, getDefaultSectionData; export as AddSectionConfig.\n 7. **App.tsx** — Import site, theme, menu, pages from data paths; build config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss: { tenant }, addSection); render JsonPagesEngine.\n 8. **Data files** — Create or update site.json, menu.json, theme.json, and one or more **.json** under the paths in A.4. Ensure JSON shapes match SiteConfig, MenuConfig, ThemeConfig, PageConfig.\n 9. **Tenant CSS** — Include TOCC (§7) selectors in global CSS so the Stage overlay is visible.\n10. **Reserved types** — Header and footer capsules receive props per SectionComponentPropsMap; menu is populated from menuConfig (e.g. menuConfig.main) when building the config or inside Core when rendering the header.\n\n**Perché servono (A.5):** La checklist in ordine evita di dimenticare passi (es. augmentation prima del registry, TOCC dopo le View) e rende la spec sufficiente per generare o verificare un tenant senza codebase di riferimento.\n\n---\n\n## A.6 v1.3 Path/Nested Strictness Addendum (breaking)\n\nThis addendum extends Appendix A without removing prior v1.2 obligations:\n\n1. **Type exports** — Core and/or shared types module should expose `SelectionPathSegment` and `SelectionPath` for Studio messaging and Inspector expansion logic.\n2. **Protocol migration** — Replace flat payload fields `itemField` / `itemId` with `itemPath?: SelectionPath` in strict v1.3 channels.\n3. **Nested array compliance** — For editable object arrays, item identity must be stable (`id`) and propagated to DOM attributes (`data-jp-item-id`), schema items (BaseArrayItem), and selection path segments (`itemId` when segment targets array item).\n4. **Backward compatibility policy** — Legacy flat fields may exist only in transitional adapters outside strict mode; normative v1.3 contract is path-only.\n\n---\n\n**Validation:** Align with current `@olonjs/core` exports (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig, and in v1.3 path types for Studio selection).\\\n**Distribution:** Core via `.yalc`; tenant projections via `@olonjs/cli`. This annex makes the spec **necessary and sufficient** for tenant code-generation and governance at enterprise grade."
      },
      "settings": {}
    }
  ]
}
END_OF_FILE_CONTENT
echo "Creating src/data/pages/home.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/home.json"
{
  "id": "home-page",
  "slug": "home",
  "meta": {
    "title": "OlonJS — The Contract Layer for the Agentic Web",
    "description": "A deterministic machine contract for websites: typed, schema-driven content endpoints that make any site reliably readable and operable by AI agents."
  },
  "sections": [
    {
      "id": "hero-main",
      "type": "hero",
      "data": {
        "badge": "Open source · MIT License",
        "title": "The Contract Layer\nfor the",
        "titleHighlight": "Agentic Web",
        "description": "AI agents are becoming operational actors in commerce, marketing, and support. OlonJS introduces a deterministic machine contract for websites — so agents can reliably read and operate any site, without custom glue.",
        "ctas": [
          { "id": "cta-1", "label": "Read the Spec",    "href": "/docs",                                          "variant": "primary"    },
          { "id": "cta-2", "label": "View on GitHub",   "href": "https://github.com/olonjs/npm-jpcore",           "variant": "secondary"  }
        ],
        "metrics": []
      },
      "settings": {}
    },
    {
      "id": "problem-section",
      "type": "problem-statement",
      "data": {
        "anchorId": "problem",
        "label": "The challenge",
        "problemTag": "The problem",
        "problemTitle": "Websites aren't built for agents",
        "problemItems": [
          { "id": "pi-1", "text": "Agentic workflows are growing, but integration is mostly custom glue — rebuilt tenant by tenant" },
          { "id": "pi-2", "text": "Every site has a different content structure, routing assumptions, and edge cases" },
          { "id": "pi-3", "text": "HTML-heavy, CMS-fragmented, inconsistent across properties — slow, brittle, expensive" }
        ],
        "solutionTag": "Our solution",
        "solutionTitle": "A standard machine contract across tenants",
        "solutionItems": [
          { "id": "si-1", "text": "Predictable page endpoints for agents —", "code": "/{slug}.json" },
          { "id": "si-2", "text": "Typed, schema-driven content contracts — validated, versioned, auditable" },
          { "id": "si-3", "text": "Repeatable governance and deployment patterns across every tenant" }
        ]
      },
      "settings": {}
    },
    {
      "id": "architecture-section",
      "type": "feature-grid",
      "data": {
        "anchorId": "architecture",
        "label": "Architecture",
        "sectionTitle": "Built for enterprise scale",
        "sectionLead": "Every layer is designed for determinism — from file system layout to component contracts to Studio UX.",
        "cards": [
          { "id": "fc-1", "emoji": "📐", "title": "Modular Type Registry",      "description": "Core defines empty registries; tenants inject types via module augmentation. Full TypeScript safety, zero Core changes." },
          { "id": "fc-2", "emoji": "🧱", "title": "Tenant Block Protocol",      "description": "Self-contained capsules (View + schema + types) enable automated ingestion and consistent editor generation." },
          { "id": "fc-3", "emoji": "⚙️", "title": "Deterministic CLI",          "description": "@olonjs/cli projects new tenants from a canonical script — reproducible across every environment." },
          { "id": "fc-4", "emoji": "🎯", "title": "ICE Data Contract",          "description": "Mandatory DOM attributes bind the Studio canvas to Inspector fields without coupling to tenant DOM structure." },
          { "id": "fc-5", "emoji": "📦", "title": "Base Schema Fragments",      "description": "Shared BaseSectionData and BaseArrayItem enforce anchor IDs and stable React keys across all capsules." },
          { "id": "fc-6", "emoji": "🔗", "title": "Path-Based Selection",       "description": "v1.4 strict path semantics eliminate nested array ambiguity. Studio selection is root-to-leaf, always deterministic." }
        ]
      },
      "settings": { "columns": 3 }
    },
    {
      "id": "why-now",
      "type": "git-section",
      "data": {
        "anchorId": "why",
        "label": "Timing",
        "title": "Why this matters",
        "titleAccent": "now",
        "cards": [
          { "id": "wc-1", "title": "Agentic commerce is live",      "description": "Operational standards are missing. Without a contract layer, teams face high integration cost and low reliability." },
          { "id": "wc-2", "title": "Enterprises need governance",   "description": "A contract layer you can audit, version, and scale — not a one-off adapter for every new agent workflow." },
          { "id": "wc-3", "title": "AI tooling is ready",           "description": "Deterministic structure means AI can scaffold, validate, and evolve tenants with less prompt ambiguity." },
          { "id": "wc-4", "title": "Speed compounds",               "description": "Teams that standardize now ship new experiences in hours while others rebuild integration logic repeatedly." }
        ]
      },
      "settings": {}
    },
    {
      "id": "dx-section",
      "type": "devex",
      "data": {
        "anchorId": "developer-velocity",
        "label": "Developer Velocity",
        "title": "AI-native advantage,\nfrom day one",
        "description": "OlonJS dramatically increases AI-assisted development speed. Because structure is deterministic, agents scaffold and evolve tenants faster — with lower regression risk.",
        "features": [
          { "id": "df-1", "text": "AI scaffolds and evolves tenants faster because structure is deterministic" },
          { "id": "df-2", "text": "Shared conventions reduce prompt ambiguity and implementation drift" },
          { "id": "df-3", "text": "Ship new tenant experiences in hours, not weeks" }
        ],
        "stats": [
          { "id": "ds-1", "value": "10×",  "label": "Faster scaffolding" },
          { "id": "ds-2", "value": "∅",    "label": "Glue per tenant"    },
          { "id": "ds-3", "value": "100%", "label": "Type-safe contracts" }
        ]
      },
      "settings": {}
    },
    {
      "id": "cta-final",
      "type": "cta-banner",
      "data": {
        "anchorId": "get-started",
        "title": "Ready to give your site\na machine contract?",
        "description": "Read the full specification or explore the source on GitHub. Zero dependencies to start — one JSON endpoint per page.",
        "cliCommand": "npx @olonjs/cli@latest new tenant",
        "ctas": [
          { "id": "cta-docs", "label": "Read the Specification", "href": "/docs",                                     "variant": "primary"   },
          { "id": "cta-gh",   "label": "View on GitHub",         "href": "https://github.com/olonjs/npm-jpcore",      "variant": "secondary" }
        ]
      },
      "settings": {}
    }
  ]
}

END_OF_FILE_CONTENT
echo "Creating src/data/pages/post.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/post.json"
{
  "id": "post-page",
  "slug": "post",
  "meta": {
    "title": "Post",
    "description": "Smoke test page for header + tiptap + footer flow."
  },
  "sections": [
    {
      "id": "post-editorial-main",
      "type": "tiptap",
      "data": {
        "content": "# JsonPages Cloud – Terms of Service & EULA\n\n---\n\n### **Last Updated:** March 2026\n\n### 1. THE SERVICE\n\nJsonPages provides a hybrid content management infrastructure consisting of:\n\n- **The Core:** An open-source library (@jsonpages/core) governed by the **MIT License**.\n- **The Cloud:** A proprietary SaaS platform (`cloud.jsonpages.io`) that provides the \"Git Bridge,\" Asset Pipeline, and Managed Infrastructure.\n\nBy using the Cloud Service, you agree to these terms.\n\n### 2. DATA SOVEREIGNTY & OWNERSHIP\n\n- **Your Content:** All data (JSON files), code, and assets managed through JsonPages remain your exclusive property. JsonPages acts only as an **orchestrator**.\n- **The Bridge:** You grant JsonPages the necessary permissions to perform Git operations (commits/pushes) on your behalf to your designated repositories (GitHub/GitLab).\n- **Portability:** Since your content is stored as flat JSON files in your own repository, you retain the right to migrate away from the Cloud Service at any time without data lock-in.\n- \n\n### 3. SUBSCRIPTIONS & ENTITLEMENTS\n\n- **Billing:** The Cloud Service is billed on a subscription basis (**Monthly Recurring Revenue**).\n- **Entitlements:** Each \"Project\" or \"Tenant\" consumes one entitlement. Active entitlements grant access to the Visual Studio (ICE) and the Cloud Save API.\n- **Third-Party Costs:** You are solely responsible for any costs incurred on third-party platforms (e.g., **Vercel** hosting, **GitHub** storage, **Cloudflare** workers).\n\n### 4. ACCEPTABLE USE\n\nYou may not use JsonPages Cloud to:\n\n- Host or manage illegal, harmful, or offensive content.\n- Attempt to reverse-engineer the proprietary Cloud Bridge or bypass entitlement checks.\n- Interfere with the stability of the API for other users.\n- \n\n### 5. LIMITATION OF LIABILITY\n\n- **\"As-Is\" Basis:** The service is provided \"as-is.\" While we strive for 99.9% uptime, JsonPages is not liable for data loss resulting from Git conflicts, third-party outages (Vercel/GitHub), or user error.\n- **No Warranty:** We do not warrant that the service will be error-free or uninterrupted.\n- \n\n### 6. TERMINATION\n\n- **By You:** You can cancel your subscription at any time. Your Studio access will remain active until the end of the current billing cycle.\n- \n- **By Us:** We reserve the right to suspend accounts that violate these terms or fail to settle outstanding invoices.\n\n### 7. GOVERNING LAW\n\nThese terms are governed by the laws of **Italy/European Union**, without regard to conflict of law principles."
      },
      "settings": {}
    }
  ]
}
END_OF_FILE_CONTENT
mkdir -p "src/emails"
echo "Creating src/emails/LeadNotificationEmail.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/emails/LeadNotificationEmail.tsx"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadData = Record<string, unknown>;

type EmailTheme = {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  typography?: {
    fontFamily?: {
      primary?: string;
      display?: string;
      mono?: string;
    };
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
};

export type LeadNotificationEmailProps = {
  tenantName: string;
  correlationId: string;
  replyTo?: string | null;
  leadData: LeadData;
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
  theme?: EmailTheme;
};

function safeString(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "-";
  }
  return JSON.stringify(value);
}

function flattenLeadData(data: LeadData) {
  return Object.entries(data)
    .filter(([key]) => !key.startsWith("_"))
    .slice(0, 20)
    .map(([key, value]) => ({ label: key, value: safeString(value) }));
}

export function LeadNotificationEmail({
  tenantName,
  correlationId,
  replyTo,
  leadData,
  brandName,
  logoUrl,
  logoAlt,
  tagline,
  theme,
}: LeadNotificationEmailProps) {
  const fields = flattenLeadData(leadData);
  const brandLabel = brandName || tenantName;

  const colors = {
    primary: theme?.colors?.primary || "#2D5016",
    background: theme?.colors?.background || "#FAFAF5",
    surface: theme?.colors?.surface || "#FFFFFF",
    text: theme?.colors?.text || "#1C1C14",
    textMuted: theme?.colors?.textMuted || "#5A5A4A",
    border: theme?.colors?.border || "#D8D5C5",
  };

  const fonts = {
    primary: theme?.typography?.fontFamily?.primary || "Inter, Arial, sans-serif",
    display: theme?.typography?.fontFamily?.display || "Georgia, serif",
  };

  const radius = {
    md: theme?.borderRadius?.md || "10px",
    lg: theme?.borderRadius?.lg || "16px",
  };

  return (
    <Html>
      <Head />
      <Preview>Nuovo lead ricevuto da {brandLabel}</Preview>
      <Body style={{ backgroundColor: colors.background, color: colors.text, fontFamily: fonts.primary, padding: "24px" }}>
        <Container style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: "24px" }}>
          <Section>
            {logoUrl ? <Img src={logoUrl} alt={logoAlt || brandLabel} height="44" style={{ marginBottom: "8px" }} /> : null}
            <Text style={{ color: colors.text, fontSize: "18px", fontWeight: 700, margin: "0 0 6px 0" }}>{brandLabel}</Text>
            <Text style={{ color: colors.textMuted, marginTop: "0", marginBottom: "0" }}>{tagline || "Notifica automatica lead"}</Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

          <Heading as="h2" style={{ color: colors.text, margin: "0 0 12px 0", fontSize: "22px", fontFamily: fonts.display }}>
            Nuovo lead da {tenantName}
          </Heading>
          <Text style={{ color: colors.textMuted, marginTop: "0", marginBottom: "16px" }}>Correlation ID: {correlationId}</Text>

          <Section style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "12px" }}>
            {fields.length === 0 ? (
              <Text style={{ color: colors.textMuted, margin: 0 }}>Nessun campo lead disponibile.</Text>
            ) : (
              fields.map((field) => (
                <Text key={field.label} style={{ margin: "0 0 8px 0", color: colors.text, fontSize: "14px", wordBreak: "break-word" }}>
                  <strong>{field.label}:</strong> {field.value}
                </Text>
              ))
            )}
          </Section>

          <Section style={{ marginTop: "18px" }}>
            <Button
              href={replyTo ? `mailto:${replyTo}` : "mailto:"}
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
                borderRadius: radius.md,
                textDecoration: "none",
                padding: "12px 18px",
                fontWeight: 600,
              }}
            >
              Rispondi ora
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadNotificationEmail;

END_OF_FILE_CONTENT
echo "Creating src/emails/LeadSenderConfirmationEmail.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/emails/LeadSenderConfirmationEmail.tsx"
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadData = Record<string, unknown>;

type EmailTheme = {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  typography?: {
    fontFamily?: {
      primary?: string;
      display?: string;
      mono?: string;
    };
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
};

export type LeadSenderConfirmationEmailProps = {
  tenantName: string;
  correlationId: string;
  leadData: LeadData;
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
  theme?: EmailTheme;
};

function safeString(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "-";
  }
  return JSON.stringify(value);
}

function flattenLeadData(data: LeadData) {
  const skipKeys = new Set(["recipientEmail", "tenant", "source", "submittedAt", "email_confirm"]);
  return Object.entries(data)
    .filter(([key]) => !key.startsWith("_") && !skipKeys.has(key))
    .slice(0, 12)
    .map(([key, value]) => ({ label: key, value: safeString(value) }));
}

export function LeadSenderConfirmationEmail({
  tenantName,
  correlationId,
  leadData,
  brandName,
  logoUrl,
  logoAlt,
  tagline,
  theme,
}: LeadSenderConfirmationEmailProps) {
  const fields = flattenLeadData(leadData);
  const brandLabel = brandName || tenantName;

  const colors = {
    primary: theme?.colors?.primary || "#2D5016",
    background: theme?.colors?.background || "#FAFAF5",
    surface: theme?.colors?.surface || "#FFFFFF",
    text: theme?.colors?.text || "#1C1C14",
    textMuted: theme?.colors?.textMuted || "#5A5A4A",
    border: theme?.colors?.border || "#D8D5C5",
  };

  const fonts = {
    primary: theme?.typography?.fontFamily?.primary || "Inter, Arial, sans-serif",
    display: theme?.typography?.fontFamily?.display || "Georgia, serif",
  };

  const radius = {
    md: theme?.borderRadius?.md || "10px",
    lg: theme?.borderRadius?.lg || "16px",
  };

  return (
    <Html>
      <Head />
      <Preview>Conferma invio richiesta - {brandLabel}</Preview>
      <Body style={{ backgroundColor: colors.background, color: colors.background, fontFamily: fonts.primary, padding: "24px" }}>
        <Container style={{ backgroundColor: colors.primary, color: colors.background, border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: "24px" }}>
          <Section>
            {logoUrl ? <Img src={logoUrl} alt={logoAlt || brandLabel} height="44" style={{ marginBottom: "8px" }} /> : null}
            <Text style={{ color: colors.background, fontSize: "18px", fontWeight: 700, margin: "0 0 6px 0" }}>{brandLabel}</Text>
            <Text style={{ color: colors.background, marginTop: "0", marginBottom: "0" }}>{tagline || "Conferma automatica di ricezione"}</Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

          <Heading as="h2" style={{ color: colors.background, margin: "0 0 12px 0", fontSize: "22px", fontFamily: fonts.display }}>
            Richiesta ricevuta
          </Heading>
          <Text style={{ color: colors.background, marginTop: "0", marginBottom: "16px" }}>
            Grazie, abbiamo ricevuto la tua richiesta per {tenantName}. Ti risponderemo il prima possibile.
          </Text>

          <Section style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "12px" }}>
            <Text style={{ margin: "0 0 8px 0", color: colors.background, fontWeight: 600 }}>Riepilogo inviato</Text>
            {fields.length === 0 ? (
              <Text style={{ color: colors.background, margin: 0 }}>Nessun dettaglio disponibile.</Text>
            ) : (
              fields.map((field) => (
                <Text key={field.label} style={{ margin: "0 0 8px 0", color: colors.background, fontSize: "14px", wordBreak: "break-word" }}>
                  <strong>{field.label}:</strong> {field.value}
                </Text>
              ))
            )}
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0 12px 0" }} />
          <Text style={{ color: colors.background, fontSize: "12px", margin: 0 }}>Riferimento richiesta: {correlationId}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadSenderConfirmationEmail;

END_OF_FILE_CONTENT
echo "Creating src/fonts.css..."
cat << 'END_OF_FILE_CONTENT' > "src/fonts.css"
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

END_OF_FILE_CONTENT
mkdir -p "src/hooks"
echo "Creating src/hooks/useDocumentMeta.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/hooks/useDocumentMeta.ts"
import { useEffect } from 'react';
import type { PageMeta } from '@/types';

export const useDocumentMeta = (meta: PageMeta): void => {
  useEffect(() => {
    // Set document title
    document.title = meta.title;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', meta.description);
  }, [meta.title, meta.description]);
};





END_OF_FILE_CONTENT
echo "Creating src/index.css..."
cat << 'END_OF_FILE_CONTENT' > "src/index.css"
@import "tailwindcss";

@source "./**/*.tsx";

@theme {
  /* 
     🎯 MASTER MAPPING (V2.7 Landing) 
  */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-accent: var(--accent);
  --color-border: var(--border);
  
  --radius-lg: var(--theme-radius-lg);
  --radius-md: var(--theme-radius-md);
  --radius-sm: var(--theme-radius-sm);

  --font-primary: var(--theme-font-primary);
  --font-mono: var(--theme-font-mono);

  /*
     DISPLAY FONT bridge
     The core now emits --theme-font-display from theme.json, so this keeps
     the tenant on the stable semantic alias rather than depending on the
     flattened internal variable path.
  */
  --font-display: var(--theme-font-display);
}

/* 
   🌍 TENANT BRAND TOKENS (JSP 1.5)
*/
:root {
  --background: var(--theme-background);
  --foreground: var(--theme-text);
  --card: var(--theme-surface);
  --card-foreground: var(--theme-text);
  --primary: var(--theme-primary);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: var(--theme-secondary);
  --secondary-foreground: var(--theme-text);
  --muted: var(--theme-surface-alt);
  --muted-foreground: var(--theme-text-muted);
  --border: var(--theme-border);
  --radius: var(--theme-radius-lg);

  /* 
     🔧 ACCENT CHAIN — Forward-compatible workaround
     theme-manager.ts already injects --theme-accent on :root,
     but the original index.css never bridged it into the semantic layer.
     This closes the gap: --theme-accent → --accent → --color-accent.
     Falls back to --theme-primary if accent is undefined.
  */
  --accent: var(--theme-accent, var(--theme-primary));

  /* Olon brand primitives — consumed by OlonMark SVG gradients */
  --olon-ring-top:    #84ABFF;
  --olon-ring-bottom: #0F52E0;
  --olon-ground:      #080808;
  --olon-figure:      #e8f0f8;
  --olon-nucleus:     var(--olon-figure);

  /*
     Shared demo/mockup helpers
     These are still theme-derived, but give the tenant a stable semantic
     palette for browser/terminal/inspector style surfaces.
  */
  --demo-surface: color-mix(in oklch, var(--card) 86%, var(--background));
  --demo-surface-soft: color-mix(in oklch, var(--card) 72%, var(--background));
  --demo-surface-strong: color-mix(in oklch, var(--background) 82%, black);
  --demo-surface-deep: color-mix(in oklch, var(--background) 70%, black);
  --demo-border-soft: color-mix(in oklch, var(--foreground) 8%, transparent);
  --demo-border-strong: color-mix(in oklch, var(--primary) 24%, transparent);
  --demo-accent-soft: color-mix(in oklch, var(--primary) 10%, transparent);
  --demo-accent-strong: color-mix(in oklch, var(--primary) 18%, transparent);
  --demo-text-soft: color-mix(in oklch, var(--foreground) 88%, var(--muted-foreground));
  --demo-text-faint: color-mix(in oklch, var(--muted-foreground) 72%, transparent);
}

@layer base {
  * { border-color: var(--border); }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-primary);
    line-height: 1.7;
    overflow-x: hidden;
    @apply antialiased;
  }
}

/* ==========================================================================
   FONT DISPLAY UTILITY
   Maps .font-display class to the display font family (Playfair Display)
   ========================================================================== */
.font-display {
  font-family: var(--font-display, var(--font-primary));
}

/* ==========================================================================
   LANDING ANIMATIONS
   ========================================================================== */
@keyframes jp-fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes jp-pulseDot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.jp-animate-in {
  opacity: 0;
  animation: jp-fadeUp 0.7s ease forwards;
}
.jp-d1 { animation-delay: 0.1s; }
.jp-d2 { animation-delay: 0.2s; }
.jp-d3 { animation-delay: 0.3s; }
.jp-d4 { animation-delay: 0.4s; }
.jp-d5 { animation-delay: 0.5s; }

.jp-pulse-dot {
  animation: jp-pulseDot 2s ease infinite;
}

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */
html {
  scroll-behavior: smooth;
}

/* ==========================================================================
   ICE ADMIN — Section highlight in preview iframe
   The preview iframe only receives tenant CSS; core's overlay classes
   (z-[50], absolute, etc.) are not in this build. Define them here so
   the section highlight is always visible in /admin.
   ========================================================================== */
[data-jp-section-overlay] {
  position: absolute;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  transition: border-color 0.2s, background-color 0.2s;
  border: 2px solid transparent;
}

[data-section-id]:hover [data-jp-section-overlay] {
  border-color: rgba(96, 165, 250, 0.5);
  border-style: dashed;
}

[data-section-id][data-jp-selected] [data-jp-section-overlay] {
  border-color: rgb(37, 99, 235);
  border-style: solid;
  background-color: rgba(59, 130, 246, 0.05);
}

[data-jp-section-overlay] > div {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgb(37, 99, 235);
  color: white;
  transition: opacity 0.2s;
}

[data-section-id]:hover [data-jp-section-overlay] > div,
[data-section-id][data-jp-selected] [data-jp-section-overlay] > div {
  opacity: 1;
}

[data-section-id] [data-jp-section-overlay] > div {
  opacity: 0;
}

/* Editorial focus lock: avoid section reselection while selecting text in inline editor. */
[data-section-id].jp-editorial-focus [data-jp-section-overlay] {
  border-color: transparent !important;
  background: transparent !important;
}

[data-section-id].jp-editorial-focus [data-jp-section-overlay] > div {
  opacity: 0 !important;
  pointer-events: none;
}

/* ==========================================================================
   TIPTAP — Public content typography (visitor view)
   ReactMarkdown renders plain HTML; preflight resets it. Re-apply here.
   ========================================================================== */
.jp-tiptap-content > * + * { margin-top: 0.75em; }

.jp-tiptap-content h1 { font-size: 2em;    font-weight: 700; line-height: 1.2; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h2 { font-size: 1.5em;  font-weight: 700; line-height: 1.3; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-tiptap-content h4 { font-size: 1em;    font-weight: 600; line-height: 1.5; margin-top: 1em;    margin-bottom: 0.25em; }

.jp-tiptap-content p  { line-height: 1.7; }

.jp-tiptap-content strong { font-weight: 700; }
.jp-tiptap-content em     { font-style: italic; }
.jp-tiptap-content s      { text-decoration: line-through; }

.jp-tiptap-content a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
.jp-tiptap-content a:hover { opacity: 0.8; }

.jp-tiptap-content code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
  border-radius: var(--theme-radius-sm);
  padding: 0.1em 0.35em;
}
.jp-tiptap-content pre {
  background: color-mix(in oklch, var(--background) 60%, black);
  border-radius: var(--theme-radius-lg);
  padding: 1em 1.25em;
  overflow-x: auto;
}
.jp-tiptap-content pre code { background: none; padding: 0; }

.jp-tiptap-content ul { list-style-type: disc;    padding-left: 1.625em; }
.jp-tiptap-content ol { list-style-type: decimal; padding-left: 1.625em; }
.jp-tiptap-content li { line-height: 1.7; margin-top: 0.25em; }
.jp-tiptap-content li + li { margin-top: 0.25em; }

.jp-tiptap-content blockquote {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  color: var(--muted-foreground);
  font-style: italic;
}

.jp-tiptap-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}

.jp-tiptap-content img { max-width: 100%; height: auto; border-radius: var(--theme-radius-lg); }

/* ==========================================================================
   TIPTAP / PROSEMIRROR — Editor typography
   Tailwind preflight resets all heading/list styles. Re-apply here using
   tenant theme tokens so the editor is WYSIWYG.
   ========================================================================== */
.jp-simple-editor .ProseMirror {
  outline: none;
  word-break: break-word;
}
.jp-simple-editor .ProseMirror > * + * { margin-top: 0.75em; }

.jp-simple-editor .ProseMirror h1 { font-size: 2em;    font-weight: 700; line-height: 1.2; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h2 { font-size: 1.5em;  font-weight: 700; line-height: 1.3; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin-top: 1.25em; margin-bottom: 0.25em; }
.jp-simple-editor .ProseMirror h4 { font-size: 1em;    font-weight: 600; line-height: 1.5; margin-top: 1em;    margin-bottom: 0.25em; }

.jp-simple-editor .ProseMirror p  { line-height: 1.7; }

.jp-simple-editor .ProseMirror strong { font-weight: 700; }
.jp-simple-editor .ProseMirror em     { font-style: italic; }
.jp-simple-editor .ProseMirror s      { text-decoration: line-through; }

.jp-simple-editor .ProseMirror a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
.jp-simple-editor .ProseMirror a:hover { opacity: 0.8; }

.jp-simple-editor .ProseMirror code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background: color-mix(in oklch, var(--foreground) 8%, transparent);
  border-radius: var(--theme-radius-sm);
  padding: 0.1em 0.35em;
}
.jp-simple-editor .ProseMirror pre {
  background: color-mix(in oklch, var(--background) 60%, black);
  border-radius: var(--theme-radius-lg);
  padding: 1em 1.25em;
  overflow-x: auto;
}
.jp-simple-editor .ProseMirror pre code {
  background: none;
  padding: 0;
}

.jp-simple-editor .ProseMirror ul { list-style-type: disc;    padding-left: 1.625em; }
.jp-simple-editor .ProseMirror ol { list-style-type: decimal; padding-left: 1.625em; }
.jp-simple-editor .ProseMirror li { line-height: 1.7; margin-top: 0.25em; }
.jp-simple-editor .ProseMirror li + li { margin-top: 0.25em; }

.jp-simple-editor .ProseMirror blockquote {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  color: var(--muted-foreground);
  font-style: italic;
}

.jp-simple-editor .ProseMirror hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}

.jp-simple-editor .ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: var(--theme-radius-lg);
}

.jp-simple-editor .ProseMirror img[data-uploading="true"] {
  opacity: 0.6;
  filter: grayscale(0.25);
  outline: 2px dashed color-mix(in oklch, var(--primary) 70%, transparent);
  outline-offset: 2px;
}

.jp-simple-editor .ProseMirror img[data-upload-error="true"] {
  outline: 2px solid color-mix(in oklch, var(--accent) 70%, transparent);
  outline-offset: 2px;
}

/* Placeholder when editor is empty */
.jp-simple-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--muted-foreground);
  opacity: 0.5;
  pointer-events: none;
  float: left;
  height: 0;
}



END_OF_FILE_CONTENT
mkdir -p "src/lib"
echo "Creating src/lib/ComponentRegistry.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/ComponentRegistry.tsx"
import React from 'react';
import { Header }           from '@/components/header';
import { Footer }           from '@/components/footer';
import { Hero }             from '@/components/hero';
import { FeatureGrid }      from '@/components/feature-grid';
import { ProblemStatement } from '@/components/problem-statement';
import { CtaBanner }        from '@/components/cta-banner';
import { GitSection }       from '@/components/git-section';
import { Devex }            from '@/components/devex';
import { Tiptap }           from '@/components/tiptap';

import type { SectionType }              from '@olonjs/core';
import type { SectionComponentPropsMap } from '@/types';

export const ComponentRegistry: {
  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;
} = {
  'header':            Header,
  'footer':            Footer,
  'hero':              Hero,
  'feature-grid':      FeatureGrid,
  'problem-statement': ProblemStatement,
  'cta-banner':        CtaBanner,
  'git-section':       GitSection,
  'devex':             Devex,
  'tiptap':            Tiptap,
};

END_OF_FILE_CONTENT
echo "Creating src/lib/IconResolver.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/IconResolver.tsx"
import React from 'react';
import {
  Layers,
  Github,
  ArrowRight,
  Box,
  Terminal,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Zap,
  type LucideIcon
} from 'lucide-react';

const iconMap = {
  'layers': Layers,
  'github': Github,
  'arrow-right': ArrowRight,
  'box': Box,
  'terminal': Terminal,
  'chevron-right': ChevronRight,
  'menu': Menu,
  'x': X,
  'sparkles': Sparkles,
  'zap': Zap,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export function isIconName(s: string): s is IconName {
  return s in iconMap;
}

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className }) => {
  const IconComponent = isIconName(name) ? iconMap[name] : undefined;

  if (!IconComponent) {
    if (import.meta.env.DEV) {
      console.warn(`[IconResolver] Unknown icon: "${name}". Add it to iconMap.`);
    }
    return null;
  }

  return <IconComponent size={size} className={className} />;
};



END_OF_FILE_CONTENT
echo "Creating src/lib/addSectionConfig.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/addSectionConfig.ts"
import type { AddSectionConfig } from '@olonjs/core';

const addableSectionTypes = [
  'hero', 'feature-grid', 'problem-statement',
  'cta-banner', 'git-section', 'devex', 'tiptap',
] as const;

const sectionTypeLabels: Record<string, string> = {
  'hero':              'Hero',
  'feature-grid':      'Feature Grid',
  'problem-statement': 'Problem Statement',
  'cta-banner':        'CTA Banner',
  'git-section':       'Git Versioning',
  'devex':             'Developer Experience',
  'tiptap':            'Tiptap Editorial',
};

function getDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':              return { title: 'New Hero', description: '' };
    case 'feature-grid':      return { sectionTitle: 'Features', cards: [] };
    case 'problem-statement': return { problemTag: 'Problem', problemTitle: '', problemItems: [], solutionTag: 'Solution', solutionTitle: '', solutionItems: [] };
    case 'cta-banner':        return { title: 'Call to Action', description: '', cliCommand: '' };
    case 'git-section':       return { title: 'Your content is code.', cards: [] };
    case 'devex':             return { title: 'Developer Experience', description: '', features: [] };
    case 'tiptap':            return { content: '# Post title\n\nStart writing in Markdown...' };
    default:                  return {};
  }
}

export const addSectionConfig: AddSectionConfig = {
  addableSectionTypes: [...addableSectionTypes],
  sectionTypeLabels,
  getDefaultSectionData,
};

END_OF_FILE_CONTENT
echo "Creating src/lib/base-schemas.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/base-schemas.ts"
import { z } from 'zod';

/**
 * Image picker field: object { url, alt? } with ui:image-picker for Form Factory.
 * Use in section data and resolve with resolveAssetUrl(url, tenantId) in View.
 */
export const ImageSelectionSchema = z
  .object({
    url: z.string(),
    alt: z.string().optional(),
  }) 
  .describe('ui:image-picker');

/**
 * Base schemas shared by section capsules (CIP governance).
 * Capsules extend these for consistent anchorId, array items, and settings.
 */
export const BaseSectionData = z.object({
  anchorId: z.string().optional().describe('ui:text'),
});

export const BaseArrayItem = z.object({
  id: z.string().optional(),
});

export const BaseSectionSettingsSchema = z.object({
  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),
  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),
  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),
});

export const CtaSchema = z.object({
  id: z.string().optional(),
  label: z.string().describe('ui:text'),
  href: z.string().describe('ui:text'),
  variant: z.enum(['primary', 'secondary']).default('primary').describe('ui:select'),
});

END_OF_FILE_CONTENT
echo "Creating src/lib/cloudSaveStream.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/cloudSaveStream.ts"
import type { StepId } from '@/types/deploy';

interface SaveStreamStepEvent {
  id: StepId;
  status: 'running' | 'done';
  label?: string;
}

interface SaveStreamLogEvent {
  stepId: StepId;
  message: string;
}

interface SaveStreamDoneEvent {
  deployUrl?: string;
  commitSha?: string;
}

interface SaveStreamErrorEvent {
  message?: string;
}

interface StartCloudSaveStreamInput {
  apiBaseUrl: string;
  apiKey: string;
  path: string;
  content: unknown;
  message?: string;
  signal?: AbortSignal;
  onStep: (event: SaveStreamStepEvent) => void;
  onLog?: (event: SaveStreamLogEvent) => void;
  onDone: (event: SaveStreamDoneEvent) => void;
}

function parseSseEventBlock(rawBlock: string): { event: string; data: string } | null {
  const lines = rawBlock
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return null;

  let eventName = 'message';
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
      continue;
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }
  return { event: eventName, data: dataLines.join('\n') };
}

export async function startCloudSaveStream(input: StartCloudSaveStreamInput): Promise<void> {
  const response = await fetch(`${input.apiBaseUrl}/save-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      path: input.path,
      content: input.content,
      message: input.message,
    }),
    signal: input.signal,
  });

  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => ({}))) as SaveStreamErrorEvent;
    throw new Error(body.message ?? `Cloud save stream failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let receivedDone = false;

  while (true) {
    const { value, done } = await reader.read();
    if (!done) {
      buffer += decoder.decode(value, { stream: true });
    } else {
      buffer += decoder.decode();
    }

    const chunks = buffer.split('\n\n');
    buffer = done ? '' : (chunks.pop() ?? '');

    for (const chunk of chunks) {
      const parsed = parseSseEventBlock(chunk);
      if (!parsed) continue;
      if (!parsed.data) continue;

      if (parsed.event === 'step') {
        const payload = JSON.parse(parsed.data) as SaveStreamStepEvent;
        input.onStep(payload);
      } else if (parsed.event === 'log') {
        const payload = JSON.parse(parsed.data) as SaveStreamLogEvent;
        input.onLog?.(payload);
      } else if (parsed.event === 'error') {
        const payload = JSON.parse(parsed.data) as SaveStreamErrorEvent;
        throw new Error(payload.message ?? 'Cloud save failed.');
      } else if (parsed.event === 'done') {
        const payload = JSON.parse(parsed.data) as SaveStreamDoneEvent;
        input.onDone(payload);
        receivedDone = true;
      }
    }

    if (done) break;
  }

  if (!receivedDone) {
    throw new Error('Cloud save stream ended before completion.');
  }
}


END_OF_FILE_CONTENT
echo "Creating src/lib/deploySteps.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/deploySteps.ts"
import type { DeployStep } from '@/types/deploy';

export const DEPLOY_STEPS: readonly DeployStep[] = [
  {
    id: 'commit',
    label: 'Commit',
    verb: 'Committing',
    poem: ['Crystallizing your edit', 'into permanent history.'],
    color: '#60a5fa',
    glyph: '◈',
    duration: 2200,
  },
  {
    id: 'push',
    label: 'Push',
    verb: 'Pushing',
    poem: ['Sending your vision', 'across the wire.'],
    color: '#a78bfa',
    glyph: '◎',
    duration: 2800,
  },
  {
    id: 'build',
    label: 'Build',
    verb: 'Building',
    poem: ['Assembling the pieces,', 'brick by digital brick.'],
    color: '#f59e0b',
    glyph: '⬡',
    duration: 7500,
  },
  {
    id: 'live',
    label: 'Live',
    verb: 'Going live',
    poem: ['Your content', 'is now breathing.'],
    color: '#34d399',
    glyph: '✦',
    duration: 1600,
  },
] as const;


END_OF_FILE_CONTENT
echo "Creating src/lib/draftStorage.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/draftStorage.ts"
/**
 * Tenant initial data — file-backed only (no localStorage).
 */

import type { PageConfig, SiteConfig } from '@/types';

export interface HydratedData {
  pages: Record<string, PageConfig>;
  siteConfig: SiteConfig;
}

/**
 * Return pages and siteConfig from file-backed data only.
 */
export function getHydratedData(
  _tenantId: string,
  filePages: Record<string, PageConfig>,
  fileSiteConfig: SiteConfig
): HydratedData {
  return {
    pages: { ...filePages },
    siteConfig: fileSiteConfig,
  };
}

END_OF_FILE_CONTENT
echo "Creating src/lib/getFilePages.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/getFilePages.ts"
/**
 * Page registry loaded from nested JSON files under src/data/pages.
 * Add a JSON file in that directory tree to register a page; no manual list in App.tsx.
 */
import type { PageConfig } from '@/types';

function slugFromPath(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/\/data\/pages\/(.+)\.json$/i);
  const rawSlug = match?.[1] ?? normalizedPath.split('/').pop()?.replace(/\.json$/i, '') ?? '';
  const canonical = rawSlug
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
  return canonical || 'home';
}

export function getFilePages(): Record<string, PageConfig> {
  const glob = import.meta.glob<{ default: unknown }>('@/data/pages/**/*.json', { eager: true });
  const bySlug = new Map<string, PageConfig>();
  const entries = Object.entries(glob).sort(([a], [b]) => a.localeCompare(b));
  for (const [path, mod] of entries) {
    const slug = slugFromPath(path);
    const raw = mod?.default;
    if (raw == null || typeof raw !== 'object') {
      console.warn(`[tenant-alpha:getFilePages] Ignoring invalid page module at "${path}".`);
      continue;
    }
    if (bySlug.has(slug)) {
      console.warn(`[tenant-alpha:getFilePages] Duplicate slug "${slug}" at "${path}". Keeping latest match.`);
    }
    bySlug.set(slug, raw as PageConfig);
  }
  const slugs = Array.from(bySlug.keys()).sort((a, b) =>
    a === 'home' ? -1 : b === 'home' ? 1 : a.localeCompare(b)
  );
  const record: Record<string, PageConfig> = {};
  for (const slug of slugs) {
    const config = bySlug.get(slug);
    if (config) record[slug] = config;
  }
  return record;
}

END_OF_FILE_CONTENT
echo "Creating src/lib/schemas.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/schemas.ts"
export { BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema, CtaSchema } from './base-schemas';

import { HeaderSchema }           from '@/components/header';
import { FooterSchema }           from '@/components/footer';
import { HeroSchema }             from '@/components/hero';
import { FeatureGridSchema }      from '@/components/feature-grid';
import { ProblemStatementSchema } from '@/components/problem-statement';
import { CtaBannerSchema }        from '@/components/cta-banner';
import { GitSectionSchema }       from '@/components/git-section';
import { DevexSchema }            from '@/components/devex';
import { TiptapSchema }           from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  'header':            HeaderSchema,
  'footer':            FooterSchema,
  'hero':              HeroSchema,
  'feature-grid':      FeatureGridSchema,
  'problem-statement': ProblemStatementSchema,
  'cta-banner':        CtaBannerSchema,
  'git-section':       GitSectionSchema,
  'devex':             DevexSchema,
  'tiptap':            TiptapSchema,
} as const;

export type SectionType = keyof typeof SECTION_SCHEMAS;

END_OF_FILE_CONTENT
echo "Creating src/lib/useFormSubmit.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/useFormSubmit.ts"
import { useState, useCallback } from 'react';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseFormSubmitOptions {
  source: string;
  tenantId: string;
}

export function useFormSubmit({ source, tenantId }: UseFormSubmitOptions) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const submit = useCallback(async (
    formData: FormData, 
    recipientEmail: string, 
    pageSlug: string, 
    sectionId: string
  ) => {
    const cloudApiUrl = import.meta.env.VITE_JSONPAGES_CLOUD_URL as string | undefined;
    const cloudApiKey = import.meta.env.VITE_JSONPAGES_API_KEY as string | undefined;

    if (!cloudApiUrl || !cloudApiKey) {
      setStatus('error');
      setMessage('Configurazione API non disponibile. Riprova tra poco.');
      return false;
    }

    // Trasformiamo FormData in un oggetto piatto per il payload JSON
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = String(value).trim();
    });

    const payload = {
      ...data,
      recipientEmail,
      page: pageSlug,
      section: sectionId,
      tenant: tenantId,
      source: source,
      submittedAt: new Date().toISOString(),
    };

    // Idempotency Key per evitare doppi invii accidentali
    const idempotencyKey = `form-${sectionId}-${Date.now()}`;

    setStatus('submitting');
    setMessage('Invio in corso...');

    try {
      const apiBase = cloudApiUrl.replace(/\/$/, '');
      const response = await fetch(`${apiBase}/forms/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cloudApiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => ({}))) as { error?: string; code?: string };

      if (!response.ok) {
        throw new Error(body.error || body.code || `Submit failed (${response.status})`);
      }

      setStatus('success');
      setMessage('Richiesta inviata con successo. Ti risponderemo al più presto.');
      return true;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Invio non riuscito. Riprova tra poco.';
      setStatus('error');
      setMessage(errorMsg);
      return false;
    }
  }, [source, tenantId]);

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage('');
  }, []);

  return { submit, status, message, reset };
}
END_OF_FILE_CONTENT
echo "Creating src/lib/utils.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/lib/utils.ts"
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

END_OF_FILE_CONTENT
echo "Creating src/main.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/main.tsx"
import '@/types'; // TBP: load type augmentation from capsule-driven types
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// ... resto del file

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




END_OF_FILE_CONTENT
# SKIP: src/registry-types.ts is binary and cannot be embedded as text.
mkdir -p "src/server"
mkdir -p "src/types"
echo "Creating src/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/types.ts"
import type { MenuItem } from '@olonjs/core';
import type { HeaderData,           HeaderSettings }           from '@/components/header';
import type { FooterData,           FooterSettings }           from '@/components/footer';
import type { HeroData,             HeroSettings }             from '@/components/hero';
import type { FeatureGridData,      FeatureGridSettings }      from '@/components/feature-grid';
import type { ProblemStatementData, ProblemStatementSettings } from '@/components/problem-statement';
import type { CtaBannerData,        CtaBannerSettings }        from '@/components/cta-banner';
import type { GitSectionData,       GitSectionSettings }       from '@/components/git-section';
import type { DevexData,            DevexSettings }            from '@/components/devex';
import type { TiptapData,           TiptapSettings }           from '@/components/tiptap';

export type SectionComponentPropsMap = {
  'header':            { data: HeaderData;           settings?: HeaderSettings;           menu: MenuItem[] };
  'footer':            { data: FooterData;            settings?: FooterSettings            };
  'hero':              { data: HeroData;              settings?: HeroSettings              };
  'feature-grid':      { data: FeatureGridData;       settings?: FeatureGridSettings       };
  'problem-statement': { data: ProblemStatementData;  settings?: ProblemStatementSettings  };
  'cta-banner':        { data: CtaBannerData;         settings?: CtaBannerSettings         };
  'git-section':       { data: GitSectionData;        settings?: GitSectionSettings        };
  'devex':             { data: DevexData;             settings?: DevexSettings             };
  'tiptap':            { data: TiptapData;            settings?: TiptapSettings            };
};

declare module '@olonjs/core' {
  export interface SectionDataRegistry {
    'header':            HeaderData;
    'footer':            FooterData;
    'hero':              HeroData;
    'feature-grid':      FeatureGridData;
    'problem-statement': ProblemStatementData;
    'cta-banner':        CtaBannerData;
    'git-section':       GitSectionData;
    'devex':             DevexData;
    'tiptap':            TiptapData;
  }
  export interface SectionSettingsRegistry {
    'header':            HeaderSettings;
    'footer':            FooterSettings;
    'hero':              HeroSettings;
    'feature-grid':      FeatureGridSettings;
    'problem-statement': ProblemStatementSettings;
    'cta-banner':        CtaBannerSettings;
    'git-section':       GitSectionSettings;
    'devex':             DevexSettings;
    'tiptap':            TiptapSettings;
  }
}

export * from '@olonjs/core';

END_OF_FILE_CONTENT
echo "Creating src/types/deploy.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/types/deploy.ts"
export type StepId = 'commit' | 'push' | 'build' | 'live';

export type StepState = 'pending' | 'active' | 'done';

export type DeployPhase = 'idle' | 'running' | 'done' | 'error';

export interface DeployStep {
  id: StepId;
  label: string;
  verb: string;
  poem: [string, string];
  color: string;
  glyph: string;
  duration: number;
}


END_OF_FILE_CONTENT
echo "Creating src/vite-env.d.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/vite-env.d.ts"
/// <reference types="vite/client" />

declare module '*?inline' {
  const content: string;
  export default content;
}



END_OF_FILE_CONTENT
echo "Creating vercel.json..."
cat << 'END_OF_FILE_CONTENT' > "vercel.json"
{
    "rewrites":  [
                     {
                         "source":  "/:pagePath*.json",
                         "destination":  "/pages/:pagePath*.json"
                     },
                     {
                         "source":  "/(.*)",
                         "destination":  "/index.html"
                     }
                 ],
    "headers":  [
                    {
                        "source":  "/assets/(.*)",
                        "headers":  [
                                        {
                                            "key":  "Cache-Control",
                                            "value":  "public, max-age=31536000, immutable"
                                        }
                                    ]
                    }
                ]
}

END_OF_FILE_CONTENT
echo "Creating vite.config.ts..."
cat << 'END_OF_FILE_CONTENT' > "vite.config.ts"
/**
 * Generated by @olonjs/cli. Dev server API: /api/save-to-file, /api/upload-asset, /api/list-assets.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ASSETS_IMAGES_DIR = path.resolve(__dirname, 'public', 'assets', 'images');
const DATA_CONFIG_DIR = path.resolve(__dirname, 'src', 'data', 'config');
const DATA_PAGES_DIR = path.resolve(__dirname, 'src', 'data', 'pages');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);
const IMAGE_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function safeFilename(original, mimeType) {
  const base = (original.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 128)) || 'image';
  const ext = original.includes('.') ? path.extname(original).toLowerCase() : (mimeType?.startsWith('image/') ? `.${(mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg')}` : '.png');
  return `${Date.now()}-${base}${IMAGE_EXT.has(ext) ? ext : '.png'}`;
}

function listImagesInDir(dir, urlPrefix) {
  const list = [];
  if (!fs.existsSync(dir)) return list;
  for (const name of fs.readdirSync(dir)) {
    if (IMAGE_EXT.has(path.extname(name).toLowerCase())) list.push({ id: name, url: `${urlPrefix}/${name}`, alt: name, tags: [] });
  }
  return list;
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function sendJsonFile(res, filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(content);
  } catch (e) {
    sendJson(res, 500, { error: e?.message || 'Read failed' });
  }
}

function isTenantPageJsonRequest(req, pathname) {
  if (req.method !== 'GET' || !pathname.endsWith('.json')) return false;
  const viteOrStaticPrefixes = ['/api/', '/assets/', '/src/', '/node_modules/', '/public/', '/@'];
  return !viteOrStaticPrefixes.some((prefix) => pathname.startsWith(prefix));
}
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'upload-asset-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || '').split('?')[0];
          const isPageJsonRequest = isTenantPageJsonRequest(req, pathname);

          if (isPageJsonRequest) {
            const normalizedPath = decodeURIComponent(pathname).replace(/\\/g, '/');
            const slug = normalizedPath.replace(/^\/+/, '').replace(/\.json$/i, '').replace(/^\/+|\/+$/g, '');
            const candidate = path.resolve(DATA_PAGES_DIR, `${slug}.json`);
            const isInsidePagesDir = candidate.startsWith(`${DATA_PAGES_DIR}${path.sep}`) || candidate === DATA_PAGES_DIR;
            if (!slug || !isInsidePagesDir || !fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
              sendJson(res, 404, { error: 'Page JSON not found' });
              return;
            }
            sendJsonFile(res, candidate);
            return;
          }
          if (req.method === 'GET' && req.url === '/api/list-assets') {
            try { sendJson(res, 200, listImagesInDir(ASSETS_IMAGES_DIR, '/assets/images')); } catch (e) { sendJson(res, 500, { error: e?.message || 'List failed' }); }
            return;
          }
          if (req.method === 'POST' && pathname === '/api/save-to-file') {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => {
              try {
                const raw = Buffer.concat(chunks).toString('utf8');
                if (!raw.trim()) { sendJson(res, 400, { error: 'Empty body' }); return; }
                const body = JSON.parse(raw);
                const { projectState, slug } = body;
                if (!projectState || typeof slug !== 'string') { sendJson(res, 400, { error: 'Missing projectState or slug' }); return; }
                if (!fs.existsSync(DATA_CONFIG_DIR)) fs.mkdirSync(DATA_CONFIG_DIR, { recursive: true });
                if (!fs.existsSync(DATA_PAGES_DIR)) fs.mkdirSync(DATA_PAGES_DIR, { recursive: true });
                if (projectState.site != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'site.json'), JSON.stringify(projectState.site, null, 2), 'utf8');
                if (projectState.theme != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'theme.json'), JSON.stringify(projectState.theme, null, 2), 'utf8');
                if (projectState.menu != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'menu.json'), JSON.stringify(projectState.menu, null, 2), 'utf8');
                if (projectState.page != null) {
                  const safeSlug = (slug.replace(/[^a-zA-Z0-9-_]/g, '_') || 'page');
                  fs.writeFileSync(path.join(DATA_PAGES_DIR, `${safeSlug}.json`), JSON.stringify(projectState.page, null, 2), 'utf8');
                }
                sendJson(res, 200, { ok: true });
              } catch (e) { sendJson(res, 500, { error: e?.message || 'Save to file failed' }); }
            });
            req.on('error', () => sendJson(res, 500, { error: 'Request error' }));
            return;
          }
          if (req.method !== 'POST' || req.url !== '/api/upload-asset') return next();
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
              const { filename, mimeType, data } = body;
              if (!filename || typeof data !== 'string') { sendJson(res, 400, { error: 'Missing filename or data' }); return; }
              const buf = Buffer.from(data, 'base64');
              if (buf.length > MAX_FILE_SIZE_BYTES) { sendJson(res, 413, { error: 'File too large. Max 5MB.' }); return; }
              if (mimeType && !IMAGE_MIMES.has(mimeType)) { sendJson(res, 400, { error: 'Invalid file type' }); return; }
              const name = safeFilename(filename, mimeType);
              if (!fs.existsSync(ASSETS_IMAGES_DIR)) fs.mkdirSync(ASSETS_IMAGES_DIR, { recursive: true });
              fs.writeFileSync(path.join(ASSETS_IMAGES_DIR, name), buf);
              sendJson(res, 200, { url: `/assets/images/${name}` });
            } catch (e) { sendJson(res, 500, { error: e?.message || 'Upload failed' }); }
          });
          req.on('error', () => sendJson(res, 500, { error: 'Request error' }));
        });
      },
    },
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});





END_OF_FILE_CONTENT
