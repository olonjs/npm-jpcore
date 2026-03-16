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
    <meta name="description" content="JsonPages - Global Authoring. Global Governance." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
    <title>JsonPages</title>
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
    "@olonjs/core": "^1.0.69",
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
  const warmBootFromCloudCache = useRef(false);
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
    if (cached) {
      const cachedPages = toPagesRecord(cached.pages);
      const cachedSite = coerceSiteConfig(cached.siteConfig);
      if (cachedPages && Object.keys(cachedPages).length > 0) {
        setPages(cachedPages);
      }
      if (cachedSite) {
        setSiteConfig(cachedSite);
      }
      setContentMode('cloud');
      setContentFallback(null);
      warmBootFromCloudCache.current = true;
      setShowTopProgress(false);
      setHasInitialCloudResolved(true);
      logBootstrapEvent('boot.cloud.cache_hit', { ageMs: Date.now() - cached.savedAt });
    } else {
      warmBootFromCloudCache.current = false;
      setShowTopProgress(true);
      setHasInitialCloudResolved(false);
    }
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
        if (warmBootFromCloudCache.current) {
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
            type: 'page',
            data: state.page,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
        if (!res.ok) {
          throw new Error(body.error || body.code || `Hot save failed: ${res.status}`);
        }
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
# SKIP: src/App.tsx:Zone.Identifier is binary and cannot be embedded as text.
echo "Creating src/App_.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/App_.tsx"
import { useState, useEffect } from 'react';
import { JsonPagesEngine } from '@jsonpages/core';
import type { LibraryImageEntry } from '@jsonpages/core';
import { ComponentRegistry } from '@/lib/ComponentRegistry';
import { SECTION_SCHEMAS } from '@/lib/schemas';
import { addSectionConfig } from '@/lib/addSectionConfig';
import { getHydratedData } from '@/lib/draftStorage';
import type { JsonPagesConfig, ProjectState } from '@jsonpages/core';
import type { SiteConfig, ThemeConfig, MenuConfig } from '@/types';

import siteData from '@/data/config/site.json';
import themeData from '@/data/config/theme.json';
import menuData from '@/data/config/menu.json';
import { getFilePages } from '@/lib/getFilePages';

import fontsCss from './fonts.css?inline';
import tenantCss from './index.css?inline';

const themeConfig = themeData as unknown as ThemeConfig;
const menuConfig = menuData as unknown as MenuConfig;
const TENANT_ID = 'alpha';

const filePages = getFilePages();
const fileSiteConfig = siteData as unknown as SiteConfig;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

function getInitialData() {
  return getHydratedData(TENANT_ID, filePages, fileSiteConfig);
}

function App() {
  const [{ pages, siteConfig }] = useState(getInitialData);
  const [assetsManifest, setAssetsManifest] = useState<LibraryImageEntry[]>([]);

  useEffect(() => {
    fetch('/api/list-assets')
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LibraryImageEntry[]) => setAssetsManifest(Array.isArray(list) ? list : []))
      .catch(() => setAssetsManifest([]));
  }, []);

  const config: JsonPagesConfig = {
    tenantId: TENANT_ID,
    registry: ComponentRegistry as JsonPagesConfig['registry'],
    schemas:  SECTION_SCHEMAS  as unknown as JsonPagesConfig['schemas'],
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    themeCss: { tenant: fontsCss + '\n' + tenantCss },
    addSection: addSectionConfig,
    persistence: {
      async saveToFile(state: ProjectState, slug: string): Promise<void> {
        const res = await fetch('/api/save-to-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectState: state, slug }),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(body.error ?? `Save to file failed: ${res.status}`);
      },
    },
    assets: {
      assetsBaseUrl: '/assets',
      assetsManifest,
      async onAssetUpload(file: File): Promise<string> {
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

  return <JsonPagesEngine config={config} />;
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
mkdir -p "src/components/arch-layers"
echo "Creating src/components/arch-layers/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/arch-layers/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import type { ArchLayersData, ArchLayersSettings, ArchLayerLevel, SyntaxTokenType } from './types';

const layerBgStyles: Record<ArchLayerLevel, string> = {
  l0: 'bg-[#3b82f6]',
  l1: 'bg-[rgba(59,130,246,0.6)]',
  l2: 'bg-[rgba(59,130,246,0.35)]',
};

const tokenStyles: Record<SyntaxTokenType, string> = {
  plain: 'text-[#cbd5e1]',
  keyword: 'text-[#60a5fa]',
  type: 'text-[#22d3ee]',
  string: 'text-[#4ade80]',
  comment: 'text-[#64748b] italic',
  operator: 'text-[#f472b6]',
};

export const ArchLayers: React.FC<{ data: ArchLayersData; settings?: ArchLayersSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg': 'var(--card)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--color-accent, #60a5fa)',
        '--local-border': 'var(--border)',
        '--local-deep': 'var(--background)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="text-center">
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--local-accent)] mb-4" data-jp-field="label">
              <span className="w-5 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-[var(--local-text)] leading-[1.15] tracking-tight mb-4" data-jp-field="title">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-lg text-[var(--local-text-muted)] max-w-[600px] mx-auto leading-relaxed" data-jp-field="description">
              {data.description}
            </p>
          )}
        </div>
        <div className="mt-14 max-w-[740px] mx-auto">
          {data.layers.map((layer, idx) => (
            <div
              key={layer.id ?? idx}
              className="group border border-[rgba(255,255,255,0.06)] rounded-[7px] p-8 mb-4 bg-[rgba(255,255,255,0.015)] flex items-start gap-6 transition-all duration-300 hover:border-[rgba(59,130,246,0.2)] hover:translate-x-1.5"
              data-jp-item-id={layer.id ?? `legacy-${idx}`}
              data-jp-item-field="layers"
            >
              <div className={cn(
                'shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono text-[0.85rem] font-bold text-white',
                layerBgStyles[layer.layerLevel]
              )}>
                {layer.number}
              </div>
              <div>
                <h4 className="text-[1.05rem] font-bold text-[var(--local-text)] mb-1.5">
                  {layer.title}
                </h4>
                <p className="text-[0.92rem] text-[var(--local-text-muted)] leading-relaxed">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {data.codeLines && data.codeLines.length > 0 && (
          <div className="mt-12 max-w-[740px] mx-auto">
            <div className="border border-[rgba(255,255,255,0.08)] rounded-[7px] overflow-hidden bg-[var(--local-deep)]">
              <div className="flex items-center gap-2 px-5 py-3 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                {data.codeFilename && (
                  <span className="ml-3 font-mono text-[0.75rem] text-[var(--local-text-muted)] opacity-60" data-jp-field="codeFilename">
                    {data.codeFilename}
                  </span>
                )}
              </div>
              <div className="p-6 font-mono text-[0.82rem] leading-[1.7] overflow-x-auto">
                {data.codeLines.map((line, idx) => (
                  <div key={idx} data-jp-item-id={(line as { id?: string }).id ?? `legacy-${idx}`} data-jp-item-field="codeLines">
                    <span className={tokenStyles[line.tokenType]}>
                      {line.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/arch-layers/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/arch-layers/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/arch-layers/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/arch-layers/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const ArchLayerLevelSchema = z.enum(['l0', 'l1', 'l2']);
export const SyntaxTokenTypeSchema = z.enum(['plain', 'keyword', 'type', 'string', 'comment', 'operator']);

const ArchLayerItemSchema = BaseArrayItem.extend({
  number: z.string().describe('ui:text'),
  layerLevel: ArchLayerLevelSchema.describe('ui:select'),
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

const SyntaxLineSchema = z.object({
  content: z.string().describe('ui:text'),
  tokenType: SyntaxTokenTypeSchema.default('plain').describe('ui:select'),
});

export const ArchLayersSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  layers: z.array(ArchLayerItemSchema).describe('ui:list'),
  codeFilename: z.string().optional().describe('ui:text'),
  codeLines: z.array(SyntaxLineSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/arch-layers/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/arch-layers/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ArchLayersSchema, ArchLayerLevelSchema, SyntaxTokenTypeSchema } from './schema';

export type ArchLayersData = z.infer<typeof ArchLayersSchema>;
export type ArchLayersSettings = z.infer<typeof BaseSectionSettingsSchema>;
export type ArchLayerLevel = z.infer<typeof ArchLayerLevelSchema>;
export type SyntaxTokenType = z.infer<typeof SyntaxTokenTypeSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/cli-section"
echo "Creating src/components/cli-section/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cli-section/View.tsx"
import React from 'react';
import type { CliSectionData, CliSectionSettings } from './types';

export const CliSection: React.FC<{ data: CliSectionData; settings?: CliSectionSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg':         'var(--card)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     'var(--color-accent, #60a5fa)',
        '--local-border':     'var(--border)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-2 gap-24 items-center">

        {/* LEFT */}
        <div>
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-2 text-[0.68rem] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-accent)] mb-5" data-jp-field="label">
              <span className="w-6 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2
            className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-black text-[var(--local-text)] leading-[1.05] tracking-tight mb-5"
            data-jp-field="title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p className="text-[1.05rem] text-[var(--local-text-muted)] leading-[1.8] mb-8" data-jp-field="description">
              {data.description}
            </p>
          )}
          {data.steps && data.steps.length > 0 && (
            <div className="flex flex-col">
              {data.steps.map((step, idx) => (
                <div
                  key={step.id ?? idx}
                  className="grid grid-cols-[32px_1fr] gap-4 py-6 border-b border-[rgba(255,255,255,0.06)] last:border-b-0 items-start"
                  data-jp-item-id={step.id ?? `legacy-${idx}`}
                  data-jp-item-field="steps"
                >
                  <div className="font-display text-[1.25rem] font-black text-[#334155] leading-none mt-0.5">{step.num}</div>
                  <div>
                    <div className="font-display font-bold text-[1rem] text-[var(--local-text)] mb-1">{step.title}</div>
                    <p className="text-[0.85rem] text-[var(--local-text-muted)] leading-[1.6]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — terminal */}
        <div className="rounded-[12px] overflow-hidden border border-[rgba(255,255,255,0.10)] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <div className="bg-[#0d1828] px-4 py-2.5 flex items-center gap-1.5 border-b border-[rgba(255,255,255,0.05)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="mx-auto font-mono text-[0.60rem] text-[rgba(255,255,255,0.25)]">Terminal</span>
          </div>
          <div className="bg-[#020508] px-7 py-6 font-mono text-[0.78rem] leading-[2.1] overflow-x-auto">
            <div><span className="text-[#5c6370] italic"># Step 1 — install CLI globally</span></div>
            <div><span className="text-[#3b82f6]">$</span> <span className="text-white">npm install -g </span><span className="text-[#98c379]">@jsonpages/cli@latest</span></div>
            <div><span className="text-[#334155]">added 1 package in 2.3s</span></div>
            <div><span className="text-[#22c55e]">✓ @jsonpages/cli@1.2.0 installed</span></div>
            <div>&nbsp;</div>
            <div><span className="text-[#5c6370] italic"># Step 2 — scaffold a new tenant</span></div>
            <div><span className="text-[#3b82f6]">$</span> <span className="text-[#98c379]">npx @jsonpages/cli@latest</span> <span className="text-white">new my-tenant</span></div>
            <div><span className="text-[#22c55e]">  ✓ src/components/hero/</span></div>
            <div><span className="text-[#22c55e]">  ✓ src/lib/schemas.ts</span></div>
            <div><span className="text-[#22c55e]">  ✓ src/lib/ComponentRegistry.tsx</span></div>
            <div><span className="text-[#22c55e]">  ✓ src/data/pages/home.json</span></div>
            <div><span className="text-[#22c55e]">  ✓ Done in 1.8s</span></div>
            <div>&nbsp;</div>
            <div><span className="text-[#5c6370] italic"># Step 3 — start Studio</span></div>
            <div><span className="text-[#3b82f6]">$</span> <span className="text-white">cd my-tenant && npm run dev</span></div>
            <div><span className="text-[#22c55e]">  ➜ Studio ready at </span><span className="text-[#60a5fa]">http://localhost:5173</span><span className="inline-block w-2 h-[1em] bg-[#3b82f6] ml-1 align-text-bottom animate-pulse" /></div>
          </div>
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/cli-section/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cli-section/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/cli-section/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cli-section/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const CliStepSchema = BaseArrayItem.extend({
  num:         z.string().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const CliSectionSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  steps:       z.array(CliStepSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/cli-section/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cli-section/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CliSectionSchema } from './schema';

export type CliSectionData     = z.infer<typeof CliSectionSchema>;
export type CliSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/cms-ice"
echo "Creating src/components/cms-ice/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cms-ice/View.tsx"
import React from 'react';
import type { CmsIceData, CmsIceSettings } from './types';

export const CmsIce: React.FC<{ data: CmsIceData; settings?: CmsIceSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg':         'var(--background)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     'var(--color-accent, #60a5fa)',
        '--local-cyan':       'var(--color-secondary, #22d3ee)',
        '--local-border':     'var(--border)',
        '--local-surface':    'var(--card)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-8">

        {/* Header */}
        <div className="grid grid-cols-2 gap-16 items-end mb-16">
          <div>
            {data.label && (
              <div className="jp-section-label inline-flex items-center gap-2 text-[0.68rem] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-accent)] mb-5" data-jp-field="label">
                <span className="w-6 h-px bg-[var(--local-primary)]" />
                {data.label}
              </div>
            )}
            <h2
              className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-black text-[var(--local-text)] leading-[1.05] tracking-tight"
              data-jp-field="title"
            >
              {data.title}
            </h2>
          </div>
          {data.description && (
            <p
              className="text-[1.05rem] text-[var(--local-text-muted)] leading-[1.8] pb-1"
              data-jp-field="description"
            >
              {data.description}
            </p>
          )}
        </div>

        {/* ICE Mockup — product demo, decorative */}
        <div className="rounded-[16px] overflow-hidden border border-[rgba(255,255,255,0.10)] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_60px_120px_rgba(0,0,0,0.7),0_0_80px_rgba(59,130,246,0.08)] mb-16">
          {/* Browser bar */}
          <div className="bg-[#0d1828] px-4 py-2.5 flex items-center gap-1.5 border-b border-[rgba(255,255,255,0.05)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="mx-auto font-mono text-[0.62rem] text-[rgba(255,255,255,0.20)] bg-[rgba(255,255,255,0.04)] px-8 py-0.5 rounded">localhost:5173/admin — JsonPages Studio</span>
          </div>
          {/* Split */}
          <div className="grid grid-cols-[1fr_300px] h-[520px] bg-[#060d1b]">
            {/* Stage */}
            <div className="flex flex-col overflow-hidden">
              {/* Tenant nav sim */}
              <div className="bg-[rgba(6,13,27,0.96)] px-6 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] flex-shrink-0">
                <div className="flex items-center gap-2 font-display font-bold text-[0.9rem] text-white">
                  <div className="w-5 h-5 bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] rounded flex items-center justify-center font-mono text-[0.45rem] text-white font-bold">{'{}'}</div>
                  Json<span className="text-[#60a5fa]">Pages</span>
                </div>
                <div className="flex gap-6 text-[0.68rem] text-[#475569] font-sans">
                  <span>Architecture</span><span>CMS</span><span>Versioning</span><span>Developer</span>
                </div>
              </div>
              {/* Hero section — selected */}
              <div className="flex-1 relative p-8 flex flex-col justify-center bg-gradient-to-br from-[#04090f] to-[#071320] outline outline-2 outline-[#3b82f6] -outline-offset-2">
                <span className="absolute top-2.5 right-2.5 font-mono text-[0.5rem] font-bold uppercase tracking-widest bg-[#3b82f6] text-white px-2 py-0.5">HERO | LOCAL</span>
                <div className="font-display font-black text-[2.4rem] leading-none text-white mb-0.5">The Sovereign Shell.</div>
                <div className="font-display font-black text-[2.4rem] leading-none bg-gradient-to-r from-[#60a5fa] to-[#22d3ee] bg-clip-text text-transparent mb-4">Zero Runtime Overhead.</div>
                <p className="text-[0.75rem] text-[#475569] leading-[1.65] max-w-[360px] mb-5">The @jsonpages/core package is a headless, schema-driven runtime. It handles routing, hydration, and the admin interface.</p>
                <div className="flex gap-2">
                  <span className="text-[0.65rem] font-semibold bg-[#3b82f6] text-white px-3.5 py-1.5 rounded-[5px]">Read the Docs</span>
                  <span className="text-[0.65rem] border border-[rgba(255,255,255,0.15)] text-[#94a3b8] px-3.5 py-1.5 rounded-[5px]">View on NPM</span>
                </div>
              </div>
              {/* Next section visible but dimmed */}
              <div className="flex-shrink-0 px-6 py-4 bg-[#0a1628] border-t border-[rgba(255,255,255,0.05)] flex gap-3 opacity-40">
                {['The Form Factory', 'The Tenant Protocol', 'The Core Engine'].map((t) => (
                  <div key={t} className="flex-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded p-2.5">
                    <div className="w-3.5 h-3.5 rounded bg-[rgba(59,130,246,0.15)] mb-1.5" />
                    <div className="font-display font-bold text-[0.58rem] text-[#94a3b8]">{t}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Inspector */}
            <div className="bg-[#08121f] border-l border-[rgba(255,255,255,0.06)] flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.05)] flex items-start justify-between">
                <div>
                  <div className="font-display font-bold text-[0.88rem] text-white">Inspector</div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[0.56rem] text-[#3b82f6]">
                    <span className="font-bold">■ HERO</span>
                    <span className="text-[#1e3a5f]">|</span>
                    <span className="text-[#334155]">LOCAL</span>
                  </div>
                </div>
                <span className="font-mono text-[0.58rem] text-[#3b82f6]">+ Add section</span>
              </div>
              {/* Layers */}
              <div className="border-b border-[rgba(255,255,255,0.05)]">
                <div className="px-4 py-1.5 font-mono text-[0.54rem] uppercase tracking-widest text-[#1e3a5f] flex justify-between">
                  <span>Page Layers</span><span className="text-[#334155]">(8)</span>
                </div>
                {[
                  { type: 'HERO',  label: 'The Sovereign Shell.',    active: true,  opacity: '' },
                  { type: 'SOC',   label: 'Separation of Concerns',  active: false, opacity: 'opacity-55' },
                  { type: 'GIT',   label: 'Your content is code.',   active: false, opacity: 'opacity-45' },
                  { type: 'DEVEX', label: 'App.tsx is incredibly thin.', active: false, opacity: 'opacity-35' },
                ].map(({ type, label, active, opacity }) => (
                  <div key={type} className={`flex items-center gap-2 px-4 py-1.5 ${active ? 'bg-[rgba(59,130,246,0.08)]' : ''} ${opacity}`}>
                    <span className="text-[#1e3a5f] text-[0.58rem]">⠿</span>
                    <span className={`font-mono text-[0.52rem] uppercase tracking-wide w-10 flex-shrink-0 ${active ? 'text-[#3b82f6]' : 'text-[#1e3a5f]'}`}>{type}</span>
                    <span className={`font-sans text-[0.65rem] flex-1 truncate ${active ? 'text-[#e2e8f0] font-semibold' : 'text-[#475569]'}`}>{label}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#22c55e]' : 'bg-[#334155] opacity-40'}`} />
                  </div>
                ))}
              </div>
              {/* Context fields */}
              <div className="flex-1 px-4 py-3 flex flex-col gap-3 overflow-y-auto">
                {[
                  { label: 'Title',    val: 'The Sovereign Shell.',      active: true  },
                  { label: 'Subtitle', val: 'Zero Runtime Overhead.',    active: false },
                  { label: 'Badge',    val: 'Architecture v1.2',         active: false },
                ].map(({ label, val, active }) => (
                  <div key={label}>
                    <div className="font-mono text-[0.52rem] uppercase tracking-widest text-[#334155] mb-1">{label}</div>
                    <div className={`rounded px-2.5 py-1.5 font-mono text-[0.60rem] truncate ${active
                      ? 'bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.45)] text-[#e2e8f0]'
                      : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] text-[#94a3b8]'}`}
                    >{val}</div>
                  </div>
                ))}
                <div>
                  <div className="font-mono text-[0.52rem] uppercase tracking-widest text-[#334155] mb-1 flex justify-between">
                    <span>CTAs (2)</span><span className="text-[#3b82f6]">+ Add Item</span>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.05)] rounded overflow-hidden">
                    {[{ lbl: 'Read the Docs', tag: 'primary' }, { lbl: 'View on NPM', tag: 'secondary' }].map(({ lbl, tag }) => (
                      <div key={lbl} className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                        <span className="text-[#3b82f6] text-[0.52rem]">▸</span>
                        <span className="font-sans text-[0.60rem] text-[#475569] flex-1">{lbl}</span>
                        <span className="font-mono text-[0.48rem] px-1 py-0.5 rounded bg-[rgba(59,130,246,0.08)] text-[#60a5fa]">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Bottom bar */}
              <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.05)] bg-[#060e1c] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span className="font-mono text-[0.52rem] text-[#475569]">All Changes Saved</span>
                <div className="flex items-center gap-1.5 ml-1 font-mono text-[0.52rem] text-[#334155]">
                  <div className="w-5 h-2.5 bg-[#3b82f6] rounded-full relative flex-shrink-0">
                    <div className="absolute top-[1.5px] right-[1.5px] w-[9px] h-[9px] bg-white rounded-full" />
                  </div>
                  Autosave
                </div>
                <div className="ml-auto flex gap-1.5">
                  <span className="font-mono text-[0.50rem] px-1.5 py-0.5 rounded border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.12)] text-[#60a5fa] flex items-center gap-1">⬡ HTML</span>
                  <span className="font-mono text-[0.50rem] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#94a3b8] opacity-50">{'{}'} JSON</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Callouts */}
        {data.callouts && data.callouts.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {data.callouts.map((c, idx) => (
              <div
                key={c.id ?? idx}
                className="border border-[rgba(255,255,255,0.06)] rounded-[12px] p-8 bg-[rgba(255,255,255,0.015)] hover:border-[rgba(59,130,246,0.2)] hover:bg-[rgba(59,130,246,0.03)] transition-all duration-200"
                data-jp-item-id={c.id ?? `legacy-${idx}`}
                data-jp-item-field="callouts"
              >
                <div className="w-9 h-9 rounded-[8px] bg-[rgba(59,130,246,0.10)] flex items-center justify-center text-[1.1rem] mb-4">
                  {c.icon}
                </div>
                <h4 className="font-display font-bold text-[1.05rem] text-[var(--local-text)] mb-2">{c.title}</h4>
                <p className="text-[0.88rem] text-[var(--local-text-muted)] leading-[1.7]">{c.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/cms-ice/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cms-ice/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/cms-ice/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cms-ice/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const CalloutSchema = BaseArrayItem.extend({
  icon:        z.string().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
});

export const CmsIceSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  callouts:    z.array(CalloutSchema).optional().describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/cms-ice/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cms-ice/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CmsIceSchema } from './schema';

export type CmsIceData     = z.infer<typeof CmsIceSchema>;
export type CmsIceSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/code-block"
echo "Creating src/components/code-block/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/code-block/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/lib/IconResolver';
import type { CodeBlockData, CodeBlockSettings } from './types';

export const CodeBlock: React.FC<{ data: CodeBlockData; settings?: CodeBlockSettings }> = ({ data, settings }) => {
  const showLineNumbers = settings?.showLineNumbers ?? true;

  return (
    <section
      style={{
        '--local-surface': 'var(--card)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-bg': 'var(--background)',
        '--local-border': 'var(--border)',
        '--local-text': 'var(--foreground)',
        '--local-accent': 'var(--primary)',
        '--local-radius-lg': 'var(--radius)',
      } as React.CSSProperties}
      className="py-16 bg-[var(--local-surface)]"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        {data.label && (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--local-text-muted)] mb-4" data-jp-field="label">
            <Icon name="terminal" size={14} />
            <span>{data.label}</span>
          </div>
        )}
        <div className="rounded-[var(--local-radius-lg)] bg-[var(--local-bg)] border border-[var(--local-border)] overflow-hidden">
          <div className="p-6 font-mono text-sm overflow-x-auto">
            {data.lines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-4 py-1" data-jp-item-id={(line as { id?: string }).id ?? `legacy-${idx}`} data-jp-item-field="lines">
                {showLineNumbers && (
                  <span className="select-none w-6 text-right text-[var(--local-text-muted)]/50">
                    {idx + 1}
                  </span>
                )}
                <span
                  className={cn(
                    line.isComment
                      ? 'text-[var(--local-text-muted)]/60'
                      : 'text-[var(--local-text)]'
                  )}
                >
                  {!line.isComment && (
                    <span className="text-[var(--local-accent)] mr-2">$</span>
                  )}
                  {line.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/code-block/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/code-block/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/code-block/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/code-block/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const LegacyCodeLineSchema = z.object({
  content: z.string().describe('ui:text'),
  isComment: z.boolean().default(false).describe('ui:checkbox'),
});

export const CodeBlockSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  lines: z.array(LegacyCodeLineSchema).describe('ui:list'),
});

export const CodeBlockSettingsSchema = z.object({
  showLineNumbers: z.boolean().optional().describe('ui:checkbox'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/code-block/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/code-block/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { CodeBlockSchema, CodeBlockSettingsSchema } from './schema';

export type CodeBlockData = z.infer<typeof CodeBlockSchema>;
export type CodeBlockSettings = z.infer<typeof BaseSectionSettingsSchema> & z.infer<typeof CodeBlockSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/cta-banner"
echo "Creating src/components/cta-banner/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/cta-banner/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import type { CtaBannerData, CtaBannerSettings } from './types';

export const CtaBanner: React.FC<{ data: CtaBannerData; settings?: CtaBannerSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg':         'var(--card)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     'var(--color-accent, #60a5fa)',
        '--local-cyan':       'var(--color-secondary, #22d3ee)',
      } as React.CSSProperties}
      className="relative py-28 bg-[var(--local-bg)] overflow-hidden text-center"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[48px] h-[2px] bg-gradient-to-r from-[var(--local-primary)] to-[var(--local-cyan)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[960px] mx-auto px-8">
        <h2
          className="font-display text-[clamp(3rem,7vw,6.5rem)] font-black text-[var(--local-text)] leading-[1.0] tracking-tight mb-6"
          data-jp-field="title"
        >
          {data.title}
        </h2>
        {data.description && (
          <p
            className="text-[1.15rem] text-[var(--local-text-muted)] max-w-[560px] mx-auto leading-[1.75] mb-10"
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}
        {data.cliCommand && (
          <div
            className="inline-flex items-center gap-4 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.12)] rounded-[12px] px-6 py-4 font-mono text-[0.88rem] text-[var(--local-text-muted)] mb-10"
            data-jp-field="cliCommand"
          >
            <span className="text-[var(--local-primary)]">$</span>
            <span className="text-white">{data.cliCommand}</span>
          </div>
        )}
        {data.ctas && data.ctas.length > 0 && (
          <div className="flex gap-4 justify-center flex-wrap">
            {data.ctas.map((cta, idx) => (
              <a
                key={cta.id ?? idx}
                href={cta.href}
                data-jp-item-id={cta.id ?? `legacy-${idx}`}
                data-jp-item-field="ctas"
                className={cn(
                  'inline-flex items-center gap-2 px-9 py-3.5 rounded-[7px] font-semibold text-[1rem] transition-all duration-200 no-underline',
                  cta.variant === 'primary'
                    ? 'bg-[var(--local-primary)] text-white hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_32px_rgba(59,130,246,0.25)]'
                    : 'bg-transparent text-[var(--local-text)] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.04)]'
                )}
              >
                {cta.label}
              </a>
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

// The App.tsx snippet is canonical product content — not editable copy.
const APP_TSX_LINES = [
  { t: 'cm',  c: '// Your App.tsx is incredibly thin.'                 },
  { t: 'pl',  c: ''                                                     },
  { t: 'kw',  c: "import { JsonPagesEngine } from '@jsonpages/core';"  },
  { t: 'kw',  c: "import { config } from './my-config';"               },
  { t: 'pl',  c: ''                                                     },
  { t: 'kw',  c: 'export default function App() {'                     },
  { t: 'cm',  c: '  // The Engine takes over from here'                },
  { t: 'fn',  c: '  return <JsonPagesEngine config={config} />;'       },
  { t: 'pl',  c: '}'                                                    },
] as const;

const tokenClass: Record<string, string> = {
  cm: 'text-[#5c6370] italic',
  kw: 'text-[#c678dd]',
  fn: 'text-[#61afef]',
  pl: 'text-[#cbd5e1]',
};

export const Devex: React.FC<{ data: DevexData; settings?: DevexSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg':         'var(--background)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     'var(--color-accent, #60a5fa)',
        '--local-border':     'var(--border)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-2 gap-24 items-center">

        {/* LEFT */}
        <div>
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-2 text-[0.68rem] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-accent)] mb-5" data-jp-field="label">
              <span className="w-6 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2
            className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-black text-[var(--local-text)] leading-[1.05] tracking-tight mb-5"
            data-jp-field="title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p className="text-[1.05rem] text-[var(--local-text-muted)] leading-[1.75] mb-8" data-jp-field="description">
              {data.description}
            </p>
          )}
          {data.features && data.features.length > 0 && (
            <ul className="flex flex-col">
              {data.features.map((f, idx) => (
                <li
                  key={f.id ?? idx}
                  className="flex items-center gap-3.5 text-[0.9rem] text-[var(--local-text-muted)] py-3.5 border-b border-[rgba(255,255,255,0.06)] last:border-b-0 hover:text-[var(--local-text)] hover:pl-1.5 transition-all"
                  data-jp-item-id={f.id ?? `legacy-${idx}`}
                  data-jp-item-field="features"
                >
                  <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT — code window */}
        <div className="rounded-[12px] overflow-hidden border border-[rgba(255,255,255,0.10)] shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.06)]">
          <div className="bg-[#0d1828] px-4 py-2.5 flex items-center gap-1.5 border-b border-[rgba(255,255,255,0.05)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="ml-auto font-mono text-[0.62rem] text-[rgba(255,255,255,0.25)]">src/App.tsx</span>
          </div>
          <div className="bg-[#030609] px-8 py-7 font-mono text-[0.80rem] leading-[2] overflow-x-auto">
            {APP_TSX_LINES.map((ln, i) => (
              <div key={i}>
                <span className={tokenClass[ln.t]}>{ln.c || '\u00A0'}</span>
              </div>
            ))}
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

export const DevexSchema = BaseSectionData.extend({
  label:       z.string().optional().describe('ui:text'),
  title:       z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  features:    z.array(FeatureSchema).optional().describe('ui:list'),
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
echo "Creating src/components/docs-layout/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/docs-layout/View.tsx"
import React, { useEffect, useRef, useState } from 'react';
import type { DocsLayoutData, DocsLayoutSettings } from './types';

type Block = DocsLayoutData['groups'][0]['sections'][0]['blocks'][0];

/* ── inline renderer: **bold** and `code` ─────────────────── */
function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')  && part.endsWith('`'))  return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

/* ── block renderer ───────────────────────────────────────── */
function DocBlock({ block, idx }: { block: Block; idx: number }) {
  const inlineCls = '[&_strong]:text-[var(--local-text)] [&_strong]:font-semibold [&_code]:font-mono [&_code]:text-[0.84em] [&_code]:bg-[rgba(255,255,255,0.07)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-[3px] [&_code]:text-[var(--local-accent)]';

  switch (block.type) {
    case 'heading':
      return <h4 key={idx} className="font-display font-bold text-[1.05rem] text-[var(--local-text)] mt-8 mb-3 tracking-tight">{block.content}</h4>;

    case 'paragraph':
      return <p key={idx} className={`text-[0.93rem] text-[var(--local-text-muted)] leading-[1.9] mb-5 ${inlineCls}`}>{renderInline(block.content)}</p>;

    case 'code':
      return (
        <div key={idx} className="mb-6 rounded-[10px] overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {block.codeFilename && (
            <div className="bg-[#0d1828] px-4 py-2.5 flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              <span className="ml-3 font-mono text-[0.65rem] text-[rgba(255,255,255,0.28)]">{block.codeFilename}</span>
            </div>
          )}
          <pre className="bg-[#020508] px-6 py-5 font-mono text-[0.78rem] leading-[1.9] overflow-x-auto text-[#cbd5e1] m-0 whitespace-pre">
            <code>{block.content}</code>
          </pre>
        </div>
      );

    case 'list':
      return (
        <ul key={idx} className="mb-5 flex flex-col gap-2.5">
          {(block.items ?? []).map((item, i) => (
            <li key={item.id ?? i} className={`flex items-start gap-3 text-[0.93rem] text-[var(--local-text-muted)] leading-[1.8] ${inlineCls}`}>
              <span className="font-mono text-[var(--local-primary)] text-[0.72rem] flex-shrink-0 mt-[5px]">→</span>
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div key={idx} className="mb-6 overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.06)]">
          <table className="w-full text-[0.88rem]">
            <thead>
              <tr className="bg-[rgba(59,130,246,0.06)] border-b border-[rgba(255,255,255,0.06)]">
                <th className="px-5 py-3 text-left font-mono text-[0.66rem] uppercase tracking-widest text-[var(--local-accent)] w-[200px]">Cosa</th>
                <th className="px-5 py-3 text-left font-mono text-[0.66rem] uppercase tracking-widest text-[var(--local-accent)]">Azione</th>
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row, i) => (
                <tr key={row.id ?? i} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(59,130,246,0.025)] transition-colors">
                  <td className={`px-5 py-4 text-[var(--local-text)] font-semibold align-top text-[0.88rem] ${inlineCls}`}>
                    {renderInline(row.col1)}
                  </td>
                  <td className={`px-5 py-4 text-[var(--local-text-muted)] align-top leading-[1.75] text-[0.88rem] ${inlineCls}`}>
                    {renderInline(row.col2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'callout':
      return (
        <div key={idx} className={`mb-5 rounded-[10px] border border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.05)] px-5 py-4 ${inlineCls}`}>
          <div className="flex items-start gap-3">
            <span className="text-[var(--local-accent)] font-mono text-[0.9rem] flex-shrink-0 mt-0.5 leading-none">ℹ</span>
            <p className="text-[0.90rem] text-[var(--local-text-muted)] leading-[1.8] m-0">{renderInline(block.content)}</p>
          </div>
        </div>
      );

    case 'note':
      return (
        <div key={idx} className={`mb-5 rounded-[10px] border border-[rgba(239,68,68,0.20)] bg-[rgba(239,68,68,0.04)] px-5 py-4 ${inlineCls}`}>
          <div className="flex items-start gap-3">
            <span className="text-[#f87171] font-mono text-[0.9rem] flex-shrink-0 mt-0.5 leading-none">⚠</span>
            <p className="text-[0.90rem] text-[var(--local-text-muted)] leading-[1.8] m-0">{renderInline(block.content)}</p>
          </div>
        </div>
      );

    default: return null;
  }
}

/* ── main component ───────────────────────────────────────── */
export const DocsLayout: React.FC<{ data: DocsLayoutData; settings?: DocsLayoutSettings }> = ({ data }) => {
  const [activeAnchor, setActiveAnchor] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // flat list of all anchors in order
  const allAnchors = data.groups.flatMap((g) => [
    { anchor: g.anchor, level: 'group' as const,   label: g.label },
    ...(g.sections ?? []).map((s) => ({ anchor: s.anchor, level: 'section' as const, label: s.title, parent: g.anchor })),
  ]);

  useEffect(() => {
    const targets = allAnchors
      .map((a) => document.getElementById(a.anchor))
      .filter(Boolean) as HTMLElement[];
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveAnchor((top.target as HTMLElement).id);
      },
      { rootMargin: '-64px 0px -55% 0px', threshold: 0 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [data.groups]);

  const scrollTo = (anchor: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      style={{
        '--local-bg':         'var(--background)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     'var(--color-accent, #60a5fa)',
        '--local-cyan':       'var(--color-secondary, #22d3ee)',
        '--local-border':     'var(--border)',
        '--local-surface':    'var(--card)',
      } as React.CSSProperties}
      className="relative z-0 min-h-screen bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.15)] to-transparent" />

      {/* ── Page hero ──────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-8 pt-28 pb-12">
        <div
          className="inline-flex items-center gap-2 bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.18)] px-3.5 py-1 rounded-full font-mono text-[0.66rem] font-semibold text-[var(--local-accent)] mb-5 tracking-widest uppercase"
          data-jp-field="version"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          {data.version ?? 'v1.2'}
        </div>
        <h1
          className="font-display font-black text-[clamp(2.2rem,4vw,3.5rem)] text-[var(--local-text)] leading-[1.05] tracking-tight mb-4"
          data-jp-field="pageTitle"
        >
          {data.pageTitle}
        </h1>
        {data.pageSubtitle && (
          <p
            className="text-[1.02rem] text-[var(--local-text-muted)] max-w-[680px] leading-[1.85]"
            data-jp-field="pageSubtitle"
          >
            {data.pageSubtitle}
          </p>
        )}
        <div className="mt-8 h-px bg-gradient-to-r from-[rgba(59,130,246,0.3)] via-[rgba(59,130,246,0.06)] to-transparent" />
      </div>

      {/* ── Sidebar + Content ──────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-8 pb-40 flex gap-14 items-start">

        {/* SIDEBAR */}
        <aside className="w-[216px] flex-shrink-0 sticky top-[80px] self-start">
          <nav className="flex flex-col">
            {data.groups.map((group) => {
              const groupActive = activeAnchor === group.anchor ||
                (group.sections ?? []).some((s) => s.anchor === activeAnchor);
              return (
                <div key={group.anchor} className="mb-0.5">
                  {/* Group */}
                  <a
                    href={`#${group.anchor}`}
                    onClick={scrollTo(group.anchor)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-[6px] font-display font-bold text-[0.80rem]
                      transition-all duration-150 no-underline
                      ${groupActive
                        ? 'text-[var(--local-text)] bg-[rgba(255,255,255,0.04)]'
                        : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[rgba(255,255,255,0.03)]'}
                      ${activeAnchor === group.anchor ? 'border-l-2 border-[var(--local-primary)] pl-[10px] text-[var(--local-accent)]' : ''}
                    `}
                  >
                    {group.label}
                  </a>
                  {/* Sub-sections */}
                  <div className={`overflow-hidden transition-all duration-200 ${groupActive ? 'max-h-96' : 'max-h-0'}`}>
                    {(group.sections ?? []).map((s) => (
                      <a
                        key={s.anchor}
                        href={`#${s.anchor}`}
                        onClick={scrollTo(s.anchor)}
                        className={`
                          flex items-center gap-2.5 pl-[22px] pr-3 py-1.5 rounded-[5px]
                          font-sans text-[0.76rem] transition-all duration-120 no-underline ml-0.5
                          ${activeAnchor === s.anchor
                            ? 'text-[var(--local-accent)] font-semibold bg-[rgba(59,130,246,0.07)]'
                            : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[rgba(255,255,255,0.025)]'}
                        `}
                      >
                        <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 transition-colors ${activeAnchor === s.anchor ? 'bg-[var(--local-accent)]' : 'bg-[rgba(255,255,255,0.12)]'}`} />
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Divider + back to top */}
          <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.05)]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-widest text-[var(--local-text-muted)] hover:text-[var(--local-accent)] transition-colors px-3"
            >
              ↑ Back to top
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <div ref={contentRef} className="flex-1 min-w-0 pt-2">
          {data.groups.map((group, gi) => (
            <div key={group.anchor} className={gi > 0 ? 'mt-20' : ''}>

              {/* Group header */}
              <div id={group.anchor} className="scroll-mt-[88px] flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-[7px] bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.18)] flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[var(--local-accent)] text-[0.66rem] font-bold">{gi + 1}</span>
                </div>
                <h2
                  className="font-display font-black text-[1.55rem] text-[var(--local-text)] tracking-tight"
                  data-jp-item-id={group.id ?? `g-${gi}`}
                  data-jp-item-field="groups"
                >
                  {group.label}
                </h2>
              </div>
              <div className="h-px bg-[rgba(255,255,255,0.05)] mb-10 ml-10" />

              {/* Sections */}
              {(group.sections ?? []).map((section, si) => (
                <div
                  key={section.anchor}
                  id={section.anchor}
                  className="scroll-mt-[88px] mb-14"
                  data-jp-item-id={section.id ?? `s-${gi}-${si}`}
                  data-jp-item-field="sections"
                >
                  {/* Section title */}
                  <div className="flex items-center gap-2.5 mb-6">
                    {section.tag && (
                      <span className="font-mono text-[0.60rem] uppercase tracking-widest text-[var(--local-accent)] bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] px-2 py-0.5 rounded-[4px] flex-shrink-0">
                        {section.tag}
                      </span>
                    )}
                    <h3
                      className="font-display font-bold text-[1.2rem] text-[var(--local-text)] leading-tight tracking-tight"
                      data-jp-field="title"
                    >
                      {section.title}
                    </h3>
                  </div>

                  {/* Blocks */}
                  {(section.blocks ?? []).map((block, bi) => (
                    <DocBlock key={block.id ?? bi} block={block} idx={bi} />
                  ))}

                  {/* Section divider */}
                  {si < (group.sections ?? []).length - 1 && (
                    <div className="mt-12 h-px bg-[rgba(255,255,255,0.035)]" />
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* EOF marker */}
          <div className="mt-16 flex items-center gap-4 opacity-30">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
            <span className="font-mono text-[0.60rem] uppercase tracking-widest text-[var(--local-text-muted)]">End of document</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
          </div>
        </div>

      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/docs-layout/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/docs-layout/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/docs-layout/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/docs-layout/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const DocBlockSchema = BaseArrayItem.extend({
  type:         z.enum(['paragraph', 'code', 'list', 'table', 'callout', 'note', 'heading']).default('paragraph'),
  content:      z.string().describe('ui:textarea'),
  codeFilename: z.string().optional().describe('ui:text'),
  items: z.array(z.object({ id: z.string().optional(), text: z.string() })).optional().describe('ui:list'),
  rows:  z.array(z.object({ id: z.string().optional(), col1: z.string(), col2: z.string() })).optional().describe('ui:list'),
});

const DocSectionSchema = BaseArrayItem.extend({
  anchor:  z.string().describe('ui:text'),
  title:   z.string().describe('ui:text'),
  tag:     z.string().optional().describe('ui:text'),
  blocks:  z.array(DocBlockSchema).describe('ui:list'),
});

const DocGroupSchema = BaseArrayItem.extend({
  anchor:   z.string().describe('ui:text'),
  label:    z.string().describe('ui:text'),
  sections: z.array(DocSectionSchema).describe('ui:list'),
});

export const DocsLayoutSchema = BaseSectionData.extend({
  pageTitle:    z.string().describe('ui:text'),
  pageSubtitle: z.string().optional().describe('ui:textarea'),
  version:      z.string().optional().describe('ui:text'),
  groups:       z.array(DocGroupSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/docs-layout/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/docs-layout/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { DocsLayoutSchema } from './schema';

export type DocsLayoutData     = z.infer<typeof DocsLayoutSchema>;
export type DocsLayoutSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/feature-grid"
echo "Creating src/components/feature-grid/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/feature-grid/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/lib/IconResolver';
import type { FeatureGridData, FeatureGridSettings } from './types';

const columnsMap: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

export const FeatureGrid: React.FC<{ data: FeatureGridData; settings?: FeatureGridSettings }> = ({ data, settings }) => {
  const colKey = settings?.columns ?? 3;
  const cols = (colKey === 2 || colKey === 3 || colKey === 4) ? columnsMap[colKey] : columnsMap[3];
  const isBordered = settings?.cardStyle === 'bordered';

  const localStyles = {
    '--local-bg': 'var(--background)',
    '--local-text': 'var(--foreground)',
    '--local-text-muted': 'var(--muted-foreground)',
    '--local-surface': 'var(--card)',
    '--local-surface-alt': 'var(--muted)',
    '--local-border': 'var(--border)',
    '--local-radius-lg': 'var(--radius)',
    '--local-radius-md': 'calc(var(--radius) - 2px)',
  } as React.CSSProperties;

  return (
    <section style={localStyles} className="py-20 bg-[var(--local-bg)] relative z-0">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--local-text)] mb-16" data-jp-field="sectionTitle">
          {data.sectionTitle}
        </h2>
        <div className={cn('grid grid-cols-1 gap-6', cols)}>
          {data.cards.map((card, idx) => (
            <div
              key={card.id ?? idx}
              className={cn(
                'p-6 rounded-[var(--local-radius-lg)] bg-[var(--local-surface)]',
                isBordered && 'border border-[var(--local-border)]'
              )}
              data-jp-item-id={card.id ?? `legacy-${idx}`}
              data-jp-item-field="cards"
            >
              {card.icon && (
                <div className="w-10 h-10 rounded-[var(--local-radius-md)] bg-[var(--local-surface-alt)] flex items-center justify-center mb-4">
                  <Icon name={card.icon} size={20} className="text-[var(--local-text-muted)]" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-[var(--local-text)] mb-2">
                {card.emoji && <span className="mr-2">{card.emoji}</span>}
                {card.title}
              </h3>
              <p className="text-sm text-[var(--local-text-muted)] leading-relaxed">
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
  sectionTitle: z.string().describe('ui:text'),
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
import type { FooterData, FooterSettings } from './types';

export const Footer: React.FC<{ data: FooterData; settings?: FooterSettings }> = ({ data }) => {
  return (
    <footer
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-accent': 'var(--color-accent, #60a5fa)',
        '--local-border': 'rgba(255,255,255,0.05)',
      } as React.CSSProperties}
      className="py-12 border-t border-[var(--local-border)] bg-[var(--local-bg)] relative z-0"
    >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[0.9rem] text-[var(--local-text-muted)]" data-jp-field="brandText">
            {data.brandText}
            {data.brandHighlight && (
              <span className="text-[var(--local-accent)]" data-jp-field="brandHighlight">{data.brandHighlight}</span>
            )}
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
import type { GitSectionData, GitSectionSettings } from './types';

export const GitSection: React.FC<{ data: GitSectionData; settings?: GitSectionSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg':         'var(--card)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     'var(--color-accent, #60a5fa)',
        '--local-cyan':       'var(--color-secondary, #22d3ee)',
        '--local-border':     'var(--border)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-2 gap-24 items-center">

        {/* LEFT — copy */}
        <div>
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-2 text-[0.68rem] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-accent)] mb-5" data-jp-field="label">
              <span className="w-6 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] font-black text-[var(--local-text)] leading-[1.05] tracking-tight mb-4" data-jp-field="title">
            {data.title}
            {data.titleHighlight && (
              <>
                <br />
                <em className="not-italic bg-gradient-to-br from-[var(--local-accent)] to-[var(--local-cyan)] bg-clip-text text-transparent" data-jp-field="titleHighlight">
                  {data.titleHighlight}
                </em>
              </>
            )}
          </h2>
          {data.description && (
            <p className="text-[1.05rem] text-[var(--local-text-muted)] leading-[1.8] mb-8" data-jp-field="description">
              {data.description}
            </p>
          )}
          {data.points && data.points.length > 0 && (
            <ul className="flex flex-col">
              {data.points.map((p, idx) => (
                <li
                  key={p.id ?? idx}
                  className="flex items-start gap-3.5 text-[0.9rem] text-[var(--local-text-muted)] py-3.5 border-b border-[rgba(255,255,255,0.06)] last:border-b-0 hover:text-[var(--local-text)] transition-colors leading-[1.5]"
                  data-jp-item-id={p.id ?? `legacy-${idx}`}
                  data-jp-item-field="points"
                >
                  <span className="font-mono text-[var(--local-primary)] text-[0.75rem] flex-shrink-0 mt-0.5">→</span>
                  {p.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT — git diff panel (decorative, content-driven commits) */}
        <div className="rounded-[12px] overflow-hidden border border-[rgba(255,255,255,0.10)] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <div className="bg-[#0d1828] px-4 py-2.5 flex items-center gap-1.5 border-b border-[rgba(255,255,255,0.05)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="ml-auto font-mono text-[0.62rem] text-[rgba(255,255,255,0.25)]">src/data/pages/home.json</span>
          </div>
          {/* Tabs */}
          <div className="bg-[#0a1624] border-b border-[rgba(255,255,255,0.05)] flex">
            <div className="font-mono text-[0.60rem] px-4 py-2 text-white border-b-2 border-[#3b82f6]">Changes</div>
            <div className="font-mono text-[0.60rem] px-4 py-2 text-[#475569]">History</div>
            <div className="font-mono text-[0.60rem] px-4 py-2 text-[#475569]">Blame</div>
          </div>
          {/* Diff */}
          <div className="bg-[#030609] px-4 py-4 font-mono text-[0.73rem] leading-[1.9] overflow-x-auto">
            {[
              { t: 'ctx', g: '12', s: ' ', c: '  "type": "hero",'                                },
              { t: 'ctx', g: '13', s: ' ', c: '  "data": {'                                       },
              { t: 'del', g: '14', s: '-', c: '    "title": "Local Authoring.hh",'                },
              { t: 'add', g: '14', s: '+', c: '    "title": "The Sovereign Shell.",'              },
              { t: 'del', g: '15', s: '-', c: '    "titleHighlight": "Global Governance.",'       },
              { t: 'add', g: '15', s: '+', c: '    "titleHighlight": "Zero Runtime Overhead.",'   },
              { t: 'ctx', g: '16', s: ' ', c: '    "badge": "Architecture v1.2",'                },
              { t: 'ctx', g: '17', s: ' ', c: '  }'                                               },
            ].map((ln, i) => (
              <div key={i} className={`flex gap-3 px-1 rounded-[2px] ${
                ln.t === 'add' ? 'bg-[rgba(34,197,94,0.07)]' :
                ln.t === 'del' ? 'bg-[rgba(239,68,68,0.07)]' :
                'opacity-45'}`}
              >
                <span className="text-[#334155] min-w-[18px] text-right select-none">{ln.g}</span>
                <span className={`min-w-[12px] ${ln.t === 'add' ? 'text-[#22c55e]' : ln.t === 'del' ? 'text-[#ef4444]' : 'text-[#334155]'}`}>{ln.s}</span>
                <span className={`whitespace-pre ${ln.t === 'add' ? 'text-[#86efac]' : ln.t === 'del' ? 'text-[#fca5a5]' : 'text-[#cbd5e1]'}`}>{ln.c}</span>
              </div>
            ))}
          </div>
          {/* Commits */}
          <div className="bg-[#050d1c] border-t border-[rgba(255,255,255,0.05)] px-4 py-3 flex flex-col gap-2.5">
            {[
              { hash: 'a3f9c12', msg: 'feat(home): update hero headline copy',      time: '2m ago',  op: 1   },
              { hash: '8b21e04', msg: 'content(home): add 3 metrics to hero',        time: '1h ago',  op: 0.6 },
              { hash: 'cc70a91', msg: 'feat(home): initial page structure',           time: '2d ago',  op: 0.4 },
            ].map(({ hash, msg, time, op }) => (
              <div key={hash} className="flex items-center gap-3" style={{ opacity: op }}>
                <span className="font-mono text-[0.58rem] text-[#3b82f6] min-w-[52px]">{hash}</span>
                <span className="font-sans text-[0.70rem] text-[#475569] flex-1 truncate">{msg}</span>
                <span className="font-mono text-[0.56rem] text-[#334155]">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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

const PointSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:text'),
});

export const GitSectionSchema = BaseSectionData.extend({
  label:          z.string().optional().describe('ui:text'),
  title:          z.string().describe('ui:text'),
  titleHighlight: z.string().optional().describe('ui:text'),
  description:    z.string().optional().describe('ui:textarea'),
  points:         z.array(PointSchema).optional().describe('ui:list'),
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
import type { MenuItem } from '@jsonpages/core';
import type { HeaderData, HeaderSettings } from './types';

export const Header: React.FC<{
  data: HeaderData;
  settings?: HeaderSettings;
  menu: MenuItem[];
}> = ({ data, menu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        '--local-bg': 'rgba(6,13,27,0.92)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--color-accent, #60a5fa)',
        '--local-border': 'rgba(59,130,246,0.08)',
      } as React.CSSProperties}
      className={cn(
        'w-full py-4 transition-all duration-300 z-0',
        scrolled
          ? 'bg-[var(--local-bg)] backdrop-blur-[20px] border-b border-[var(--local-border)]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center gap-2.5 no-underline font-bold text-xl tracking-tight text-[var(--local-text)]"
        >
          {data.logoIconText && (
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[var(--local-primary)] to-[var(--local-accent)] flex items-center justify-center font-mono text-[0.8rem] font-bold text-[var(--background)]" data-jp-field="logoIconText">
              {data.logoIconText}
            </div>
          )}
          <span data-jp-field="logoText">
            {data.logoText}
            {data.logoHighlight && (
              <span className="text-[var(--local-accent)]" data-jp-field="logoHighlight">{data.logoHighlight}</span>
            )}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {menu.map((item, idx) => (
            <a
              key={(item as { id?: string }).id ?? idx}
              href={item.href}
              data-jp-item-id={(item as { id?: string }).id ?? `legacy-${idx}`}
              data-jp-item-field="links"
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'no-underline text-sm font-medium transition-colors',
                item.isCta
                  ? 'bg-[var(--local-primary)] text-white px-5 py-2 rounded-lg font-semibold hover:brightness-110 hover:-translate-y-px'
                  : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)]'
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-[var(--local-text-muted)] hover:text-[var(--local-text)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-[var(--local-border)] bg-[var(--local-bg)] backdrop-blur-[20px]">
          <div className="max-w-[1200px] mx-auto px-8 py-4 flex flex-col gap-4">
            {menu.map((item, idx) => (
              <a
                key={(item as { id?: string }).id ?? idx}
                href={item.href}
                className="text-base font-medium text-[var(--local-text-muted)] hover:text-[var(--local-text)] transition-colors py-2 no-underline"
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
  links: z.array(z.object({
    label: z.string().describe('ui:text'),
    href: z.string().describe('ui:text'),
    isCta: z.boolean().default(false).describe('ui:checkbox'),
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
import { cn } from '@/lib/utils';
import type { HeroData, HeroSettings } from './types';

export const Hero: React.FC<{ data: HeroData; settings?: HeroSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg':          'var(--background)',
        '--local-text':        'var(--foreground)',
        '--local-text-muted':  'var(--muted-foreground)',
        '--local-primary':     'var(--primary)',
        '--local-accent':      'var(--color-accent, #60a5fa)',
        '--local-cyan':        'var(--color-secondary, #22d3ee)',
        '--local-border':      'var(--border)',
        '--local-surface':     'var(--card)',
      } as React.CSSProperties}
      className="jp-hero relative min-h-screen flex items-center overflow-hidden pt-24 pb-0 bg-[var(--local-bg)]"
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.13),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[image:linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_50%_0%,black_25%,transparent_75%)] pointer-events-none" />

      <div className="relative z-0 max-w-[1200px] mx-auto px-8 w-full">
        <div className="grid grid-cols-2 gap-16 items-center pb-20">

          {/* LEFT — copy */}
          <div>
            {data.badge && (
              <div
                className="inline-flex items-center gap-2 bg-[rgba(59,130,246,0.10)] border border-[rgba(59,130,246,0.20)] px-4 py-1.5 rounded-full text-[0.70rem] font-mono font-semibold text-[var(--local-accent)] mb-8 tracking-widest uppercase jp-animate-in"
                data-jp-field="badge"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] jp-pulse-dot" />
                {data.badge}
              </div>
            )}

            <h1
              className="font-display font-black text-[clamp(3rem,6vw,5.5rem)] text-[var(--local-text)] leading-[1.0] tracking-tight mb-6 jp-animate-in jp-d1"
              data-jp-field="title"
            >
              {data.title}
              {data.titleHighlight && (
                <>
                  <br />
                  <em
                    className="not-italic bg-gradient-to-br from-[var(--local-accent)] to-[var(--local-cyan)] bg-clip-text text-transparent"
                    data-jp-field="titleHighlight"
                  >
                    {data.titleHighlight}
                  </em>
                </>
              )}
            </h1>

            {data.description && (
              <p
                className="text-[1.05rem] text-[var(--local-text-muted)] max-w-[500px] leading-[1.75] mb-10 jp-animate-in jp-d2"
                data-jp-field="description"
              >
                {data.description}
              </p>
            )}

            {data.ctas && data.ctas.length > 0 && (
              <div className="flex gap-4 flex-wrap jp-animate-in jp-d3">
                {data.ctas.map((cta, idx) => (
                  <a
                    key={cta.id ?? idx}
                    href={cta.href}
                    data-jp-item-id={cta.id ?? `legacy-${idx}`}
                    data-jp-item-field="ctas"
                    className={cn(
                      'inline-flex items-center gap-2 px-7 py-3 rounded-[7px] font-semibold text-[0.95rem] transition-all duration-200 no-underline',
                      cta.variant === 'primary'
                        ? 'bg-[var(--local-primary)] text-white hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_24px_rgba(59,130,246,0.25)]'
                        : 'bg-transparent text-[var(--local-text)] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.04)]'
                    )}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            )}

            {data.metrics && data.metrics.length > 0 && (
              <div className="flex gap-10 mt-14 pt-10 border-t border-[rgba(255,255,255,0.06)] flex-wrap jp-animate-in jp-d4">
                {data.metrics.map((metric, idx) => (
                  <div
                    key={(metric as { id?: string }).id ?? idx}
                    data-jp-item-id={(metric as { id?: string }).id ?? `legacy-${idx}`}
                    data-jp-item-field="metrics"
                  >
                    <div className="font-display text-[2.2rem] font-black text-[var(--local-text)] leading-none">
                      {metric.val}
                    </div>
                    <div className="text-[0.72rem] font-mono uppercase tracking-[0.1em] text-[var(--local-text-muted)] mt-1 opacity-70">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — ICE mini-mockup */}
          <div className="jp-animate-in jp-d2 rounded-[12px] overflow-hidden border border-[rgba(255,255,255,0.10)] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(59,130,246,0.08)]">
            {/* Browser bar */}
            <div className="bg-[#0f1923] px-3 py-2.5 flex items-center gap-1.5 border-b border-[rgba(255,255,255,0.05)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              <span className="mx-auto font-mono text-[0.60rem] text-[rgba(255,255,255,0.20)] bg-[rgba(255,255,255,0.04)] px-3 py-0.5 rounded">localhost:5173 · Studio</span>
            </div>
            {/* Split: canvas + inspector */}
            <div className="grid grid-cols-[1fr_260px] h-[360px] bg-[#060d1b]">
              {/* Canvas */}
              <div className="relative bg-gradient-to-br from-[#04090f] to-[#07112a] p-8 flex flex-col justify-center">
                <span className="absolute top-2 right-2 font-mono text-[0.48rem] font-bold tracking-widest uppercase bg-[#3b82f6] text-white px-1.5 py-0.5">HERO | LOCAL</span>
                <div className="absolute inset-0 border-2 border-[#3b82f6] pointer-events-none" />
                <div className="inline-flex items-center gap-1.5 bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.10)] rounded-full px-2.5 py-1 font-mono text-[0.52rem] text-[#94a3b8] mb-3 w-fit">
                  <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
                  {data.badge ?? 'Architecture v1.2'}
                </div>
                <div className="font-display font-black text-[1.5rem] leading-none text-white mb-0.5">
                  {data.title}
                </div>
                {data.titleHighlight && (
                  <div className="font-display font-black text-[1.5rem] leading-none bg-gradient-to-r from-[#60a5fa] to-[#22d3ee] bg-clip-text text-transparent mb-3">
                    {data.titleHighlight}
                  </div>
                )}
                <p className="text-[0.65rem] text-[#475569] leading-[1.6] max-w-[220px] mb-3">
                  {data.description?.slice(0, 100)}…
                </p>
                <div className="flex gap-1.5">
                  <span className="text-[0.58rem] font-semibold bg-[#3b82f6] text-white px-2.5 py-1 rounded">Read the Docs</span>
                  <span className="text-[0.58rem] border border-[rgba(255,255,255,0.15)] text-[#94a3b8] px-2.5 py-1 rounded">View on NPM</span>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                  {(data.metrics ?? []).map((m, i) => (
                    <div key={i}>
                      <div className="font-display font-black text-[1rem] text-white leading-none">{m.val}</div>
                      <div className="font-mono text-[0.44rem] uppercase tracking-widest text-[#334155] mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Inspector */}
              <div className="bg-[#08121f] border-l border-[rgba(255,255,255,0.06)] flex flex-col">
                <div className="px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.05)] flex items-start justify-between">
                  <div>
                    <div className="font-display font-bold text-[0.80rem] text-white">Inspector</div>
                    <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[0.54rem] text-[#3b82f6]">
                      <span className="font-bold">■ HERO</span>
                      <span className="text-[#1e3a5f]">|</span>
                      <span className="text-[#334155]">LOCAL</span>
                    </div>
                  </div>
                  <span className="font-mono text-[0.55rem] text-[#3b82f6]">+ Add section</span>
                </div>
                {/* Layers */}
                <div className="border-b border-[rgba(255,255,255,0.05)]">
                  <div className="px-3.5 py-1.5 font-mono text-[0.50rem] uppercase tracking-widest text-[#1e3a5f] flex justify-between">
                    <span>Page Layers</span><span className="text-[#334155]">(8)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[rgba(59,130,246,0.08)]">
                    <span className="font-mono text-[0.50rem] uppercase tracking-wide text-[#3b82f6] w-9">HERO</span>
                    <span className="font-sans text-[0.60rem] text-[#e2e8f0] font-semibold flex-1 truncate">{data.title}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 opacity-50">
                    <span className="font-mono text-[0.50rem] uppercase tracking-wide text-[#1e3a5f] w-9">SOC</span>
                    <span className="font-sans text-[0.60rem] text-[#334155] flex-1 truncate">Separation of Concerns</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 opacity-35">
                    <span className="font-mono text-[0.50rem] uppercase tracking-wide text-[#1e3a5f] w-9">CMS</span>
                    <span className="font-sans text-[0.60rem] text-[#334155] flex-1 truncate">In-Context Editing</span>
                  </div>
                </div>
                {/* Fields */}
                <div className="flex-1 px-3.5 py-3 flex flex-col gap-2.5 overflow-hidden">
                  <div>
                    <div className="font-mono text-[0.50rem] uppercase tracking-widest text-[#334155] mb-1">Title</div>
                    <div className="bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.45)] rounded px-2 py-1.5 font-mono text-[0.58rem] text-[#e2e8f0] truncate">{data.title}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[0.50rem] uppercase tracking-widest text-[#334155] mb-1">Subtitle</div>
                    <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded px-2 py-1.5 font-mono text-[0.58rem] text-[#94a3b8] truncate">{data.titleHighlight}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[0.50rem] uppercase tracking-widest text-[#334155] mb-1">Badge</div>
                    <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded px-2 py-1.5 font-mono text-[0.58rem] text-[#94a3b8] truncate">{data.badge}</div>
                  </div>
                </div>
                {/* Bottom bar */}
                <div className="px-3.5 py-2 border-t border-[rgba(255,255,255,0.05)] bg-[#060e1c] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span className="font-mono text-[0.50rem] text-[#475569]">All Changes Saved</span>
                  <div className="ml-auto flex gap-1.5">
                    <span className="font-mono text-[0.48rem] px-1.5 py-0.5 rounded border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.12)] text-[#60a5fa]">⬡ HTML</span>
                    <span className="font-mono text-[0.48rem] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#94a3b8] opacity-50">{ } JSON</span>
                  </div>
                </div>
              </div>
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
mkdir -p "src/components/image-break"
echo "Creating src/components/image-break/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/image-break/View.tsx"
import React from 'react';
import { resolveAssetUrl, useConfig } from '@jsonpages/core';
import type { ImageBreakData, ImageBreakSettings } from './types';

export const ImageBreak: React.FC<{ data: ImageBreakData; settings?: ImageBreakSettings }> = ({ data }) => {
  const { tenantId = 'default' } = useConfig();
  const imageUrl = data.image?.url ? resolveAssetUrl(data.image.url, tenantId) : '';

  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
      } as React.CSSProperties}
      className="relative z-0 bg-[var(--local-bg)]"
    >
      {imageUrl ? (
        <>
          <div className="relative w-full aspect-[21/9] min-h-[200px]">
            <img
              src={imageUrl}
              alt={data.image?.alt ?? ''}
              className="w-full h-full object-cover"
              data-jp-field="image"
            />
            {data.caption && (
              <div
                className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-6 py-4"
                data-jp-field="caption"
              >
                <p className="text-sm text-zinc-300 italic">{data.caption}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-[var(--local-text-muted)]">
          <span className="text-sm">Nessuna immagine</span>
          <span className="text-xs mt-1">Seleziona la section e usa Image Picker nell’Inspector</span>
        </div>
      )}
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/image-break/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/image-break/index.ts"
export { ImageBreak } from './View';
export { ImageBreakSchema } from './schema';
export type { ImageBreakData, ImageBreakSettings } from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/image-break/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/image-break/schema.ts"
import { z } from 'zod';
import { BaseSectionData, ImageSelectionSchema } from '@/lib/base-schemas';

export const ImageBreakSchema = BaseSectionData.extend({
  image: ImageSelectionSchema.default({ url: '', alt: '' }),
  caption: z.string().optional().describe('ui:text'),
});

export const ImageBreakSettingsSchema = z.object({
  height: z.enum(['sm', 'md', 'lg', 'full']).default('md').describe('ui:select'),
});
END_OF_FILE_CONTENT
echo "Creating src/components/image-break/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/image-break/types.ts"
import type { z } from 'zod';
import type { ImageBreakSchema } from './schema';

export type ImageBreakData = z.infer<typeof ImageBreakSchema>;
export type ImageBreakSettings = Record<string, unknown>;

END_OF_FILE_CONTENT
mkdir -p "src/components/image-test"
mkdir -p "src/components/pa-section"
echo "Creating src/components/pa-section/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pa-section/View.tsx"
import React from 'react';
import type { PaSectionData, PaSectionSettings } from './types';

export const PaSection: React.FC<{ data: PaSectionData; settings?: PaSectionSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg': 'var(--card)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--color-accent, #60a5fa)',
        '--local-deep': 'var(--background)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.1)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-8">
        {data.label && (
          <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--local-accent)] mb-4" data-jp-field="label">
            <span className="w-5 h-px bg-[var(--local-primary)]" />
            {data.label}
          </div>
        )}
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-[var(--local-text)] leading-[1.15] tracking-tight mb-4" data-jp-field="title">
          {data.title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-12">
          <div>
            <h3 className="text-2xl font-bold text-[var(--local-text)] mb-4" data-jp-field="subtitle">
              {data.subtitle}
            </h3>
            {data.paragraphs.map((p, idx) => (
              <p key={idx} className="text-[var(--local-text-muted)] mb-5 text-[1.05rem] leading-relaxed" data-jp-item-id={(p as { id?: string }).id ?? `legacy-${idx}`} data-jp-item-field="paragraphs">
                {p.text}
              </p>
            ))}
            {data.badges && data.badges.length > 0 && (
              <div className="flex gap-2.5 flex-wrap mt-4">
                {data.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] text-[#4ade80] px-3 py-1.5 rounded-md text-[0.78rem] font-semibold"
                    data-jp-item-id={(badge as { id?: string }).id ?? `legacy-${idx}`}
                    data-jp-item-field="badges"
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="border border-[rgba(255,255,255,0.06)] rounded-lg p-12 bg-[rgba(255,255,255,0.02)] text-center">
            {data.engines && data.engines.length >= 2 && (
              <div className="flex items-center justify-center gap-6 mb-8">
                {data.engines.map((engine, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <span className="text-[var(--local-text-muted)] text-2xl opacity-50">⇄</span>
                    )}
                    <div
                      className={
                        engine.variant === 'tailwind'
                          ? 'px-6 py-4 rounded-xl font-bold text-[0.95rem] border bg-[rgba(59,130,246,0.08)] border-[rgba(59,130,246,0.2)] text-[#60a5fa]'
                          : 'px-6 py-4 rounded-xl font-bold text-[0.95rem] border bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-[#4ade80]'
                      }
                      data-jp-item-id={(engine as { id?: string }).id ?? `legacy-${idx}`}
                      data-jp-item-field="engines"
                    >
                      {engine.label}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
            {data.codeSnippet && (
              <div className="font-mono text-[0.85rem] text-[var(--local-text-muted)] bg-[var(--local-deep)] p-4 rounded-lg text-left border border-[rgba(255,255,255,0.04)]" data-jp-field="codeSnippet">
                <pre className="whitespace-pre-wrap m-0">{data.codeSnippet}</pre>
                <div className="mt-4 text-[0.75rem] text-center opacity-50">
                  Same JSON. Different Render Engine.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/pa-section/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pa-section/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/pa-section/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pa-section/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

const PaBadgeSchema = z.object({
  label: z.string().describe('ui:text'),
});

const PaEngineSchema = z.object({
  label: z.string().describe('ui:text'),
  variant: z.enum(['tailwind', 'bootstrap']).describe('ui:select'),
});

export const PaSectionSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  subtitle: z.string().describe('ui:text'),
  paragraphs: z.array(z.object({ text: z.string().describe('ui:textarea') })).describe('ui:list'),
  badges: z.array(PaBadgeSchema).optional().describe('ui:list'),
  engines: z.array(PaEngineSchema).optional().describe('ui:list'),
  codeSnippet: z.string().optional().describe('ui:textarea'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/pa-section/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pa-section/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { PaSectionSchema } from './schema';

export type PaSectionData = z.infer<typeof PaSectionSchema>;
export type PaSectionSettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/philosophy"
echo "Creating src/components/philosophy/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/philosophy/View.tsx"
import React from 'react';
import type { PhilosophyData, PhilosophySettings } from './types';

export const Philosophy: React.FC<{ data: PhilosophyData; settings?: PhilosophySettings }> = ({ data }) => {
  const renderQuote = () => {
    if (!data.quoteHighlightWord) {
      return <>{data.quote}</>;
    }
    const parts = data.quote.split(data.quoteHighlightWord);
    return (
      <>
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <em className="not-italic text-[var(--local-accent)]">
                {data.quoteHighlightWord}
              </em>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-accent': 'var(--color-accent, #60a5fa)',
        '--local-primary': 'var(--primary)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="max-w-[760px] mx-auto text-center">
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--local-accent)] mb-4" data-jp-field="label">
              <span className="w-5 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-[var(--local-text)] leading-[1.15] tracking-tight mb-4" data-jp-field="title">
            {data.title}
          </h2>
          <blockquote className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--local-text)] font-bold leading-[1.35] my-8" data-jp-field="quote">
            &ldquo;{renderQuote()}&rdquo;
          </blockquote>
          {data.description && (
            <p className="text-[1.05rem] text-[var(--local-text-muted)] max-w-[560px] mx-auto leading-relaxed" data-jp-field="description">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/philosophy/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/philosophy/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/philosophy/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/philosophy/schema.ts"
import { z } from 'zod';
import { BaseSectionData } from '@/lib/base-schemas';

export const PhilosophySchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  quote: z.string().describe('ui:textarea'),
  quoteHighlightWord: z.string().optional().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/philosophy/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/philosophy/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { PhilosophySchema } from './schema';

export type PhilosophyData = z.infer<typeof PhilosophySchema>;
export type PhilosophySettings = z.infer<typeof BaseSectionSettingsSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/pillars-grid"
echo "Creating src/components/pillars-grid/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pillars-grid/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import { Icon, isIconName } from '@/lib/IconResolver';
import type { PillarsGridData, PillarsGridSettings, PillarIconVariant, PillarTagVariant } from './types';

const iconVariantStyles: Record<PillarIconVariant, string> = {
  split: 'bg-[rgba(59,130,246,0.1)] text-[#60a5fa]',
  registry: 'bg-[rgba(34,211,238,0.1)] text-[#22d3ee]',
  federation: 'bg-[rgba(168,85,247,0.1)] text-[#c084fc]',
};

const tagVariantStyles: Record<PillarTagVariant, string> = {
  core: 'bg-[rgba(59,130,246,0.1)] text-[#60a5fa]',
  pattern: 'bg-[rgba(34,211,238,0.1)] text-[#22d3ee]',
  enterprise: 'bg-[rgba(168,85,247,0.1)] text-[#c084fc]',
};

export const PillarsGrid: React.FC<{ data: PillarsGridData; settings?: PillarsGridSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--color-accent, #60a5fa)',
        '--local-border': 'var(--border)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.15)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-8">
        {data.label && (
          <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--local-accent)] mb-4" data-jp-field="label">
            <span className="w-5 h-px bg-[var(--local-primary)]" />
            {data.label}
          </div>
        )}
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-[var(--local-text)] leading-[1.15] tracking-tight mb-4" data-jp-field="title">
          {data.title}
        </h2>
        {data.description && (
          <p className="text-lg text-[var(--local-text-muted)] max-w-[600px] leading-relaxed" data-jp-field="description">
            {data.description}
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14">
          {data.pillars.map((pillar, idx) => (
            <div
              key={pillar.id ?? idx}
              className="jp-pillar-card group relative border border-[rgba(255,255,255,0.06)] rounded-lg p-10 bg-[rgba(255,255,255,0.015)] transition-all duration-300 overflow-hidden hover:border-[rgba(59,130,246,0.2)] hover:-translate-y-1 hover:bg-[rgba(59,130,246,0.03)]"
              data-jp-item-id={pillar.id ?? `legacy-${idx}`}
              data-jp-item-field="pillars"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--local-primary)] to-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-xl font-bold',
                iconVariantStyles[pillar.iconVariant]
              )}>
                {pillar.icon && isIconName(pillar.icon) ? (
                  <Icon name={pillar.icon} size={24} className="shrink-0" />
                ) : pillar.icon ? (
                  <span>{pillar.icon}</span>
                ) : null}
              </div>
              <h3 className="text-xl font-bold text-[var(--local-text)] mb-3">
                {pillar.title}
              </h3>
              <p className="text-[0.95rem] text-[var(--local-text-muted)] leading-relaxed">
                {pillar.description}
              </p>
              <span className={cn(
                'inline-block text-[0.7rem] font-semibold uppercase tracking-wide px-3 py-1 rounded mt-4',
                tagVariantStyles[pillar.tagVariant]
              )}>
                {pillar.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/pillars-grid/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pillars-grid/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/pillars-grid/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pillars-grid/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

export const PillarIconVariantSchema = z.enum(['split', 'registry', 'federation']);
export const PillarTagVariantSchema = z.enum(['core', 'pattern', 'enterprise']);

const PillarCardSchema = BaseArrayItem.extend({
  icon: z.string().describe('ui:icon-picker'),
  iconVariant: PillarIconVariantSchema.describe('ui:select'),
  title: z.string().describe('ui:text'),
  description: z.string().describe('ui:textarea'),
  tag: z.string().describe('ui:text'),
  tagVariant: PillarTagVariantSchema.describe('ui:select'),
});

export const PillarsGridSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  pillars: z.array(PillarCardSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/pillars-grid/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/pillars-grid/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { PillarsGridSchema, PillarIconVariantSchema, PillarTagVariantSchema } from './schema';

export type PillarsGridData = z.infer<typeof PillarsGridSchema>;
export type PillarsGridSettings = z.infer<typeof BaseSectionSettingsSchema>;
export type PillarIconVariant = z.infer<typeof PillarIconVariantSchema>;
export type PillarTagVariant = z.infer<typeof PillarTagVariantSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/problem-statement"
echo "Creating src/components/problem-statement/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import type { ProblemStatementData, ProblemStatementSettings, SiloBlockVariant } from './types';

const variantStyles: Record<SiloBlockVariant, string> = {
  red: 'bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.3)] text-[#f87171]',
  amber: 'bg-[rgba(245,158,11,0.08)] border-[rgba(245,158,11,0.3)] text-[#fbbf24]',
  green: 'bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.3)] text-[#4ade80]',
  blue: 'bg-[rgba(59,130,246,0.08)] border-[rgba(59,130,246,0.3)] text-[#60a5fa]',
};

export const ProblemStatement: React.FC<{ data: ProblemStatementData; settings?: ProblemStatementSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-surface': 'var(--card)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-border': 'var(--border)',
      } as React.CSSProperties}
      className="jp-problem relative z-0 py-28 bg-gradient-to-b from-[var(--local-bg)] to-[var(--local-surface)]"
    >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[360px] border border-[rgba(255,255,255,0.06)] rounded-lg bg-[rgba(255,255,255,0.02)] overflow-hidden flex items-center justify-center">
            <div className="text-center p-8">
              {data.siloGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="mb-4"
                  data-jp-item-id={(group as { id?: string }).id ?? `legacy-${gIdx}`}
                  data-jp-item-field="siloGroups"
                >
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {group.blocks.map((block, bIdx) => (
                      <span
                        key={(block as { id?: string }).id ?? bIdx}
                        className={cn(
                          'inline-block px-4 py-2 rounded-lg text-[0.8rem] font-semibold border',
                          variantStyles[block.variant]
                        )}
                        data-jp-item-id={(block as { id?: string }).id ?? `legacy-${bIdx}`}
                        data-jp-item-field="blocks"
                      >
                        {block.label}
                      </span>
                    ))}
                  </div>
                  <span className="text-[0.7rem] text-[var(--local-text-muted)] uppercase tracking-widest mt-2 block opacity-60">
                    {group.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[var(--local-text)] mb-4" data-jp-field="title">
              {data.title}
            </h3>
            {data.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-[var(--local-text-muted)] mb-5 text-[1.05rem] leading-relaxed"
                data-jp-item-id={(p as { id?: string }).id ?? `legacy-${idx}`}
                data-jp-item-field="paragraphs"
              >
                {p.isBold ? <strong className="text-[var(--local-text)]">{p.text}</strong> : p.text}
              </p>
            ))}
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

export const SiloBlockVariantSchema = z.enum(['red', 'amber', 'green', 'blue']);
const SiloBlockSchema = BaseArrayItem.extend({
  label: z.string().describe('ui:text'),
  variant: SiloBlockVariantSchema.describe('ui:select'),
});

const SiloGroupSchema = BaseArrayItem.extend({
  blocks: z.array(SiloBlockSchema).describe('ui:list'),
  label: z.string().describe('ui:text'),
});

const ProblemParagraphSchema = BaseArrayItem.extend({
  text: z.string().describe('ui:textarea'),
  isBold: z.boolean().default(false).describe('ui:checkbox'),
});

export const ProblemStatementSchema = BaseSectionData.extend({
  siloGroups: z.array(SiloGroupSchema).describe('ui:list'),
  title: z.string().describe('ui:text'),
  paragraphs: z.array(ProblemParagraphSchema).describe('ui:list'),
  highlight: z.string().optional().describe('ui:text'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/problem-statement/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/problem-statement/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ProblemStatementSchema, SiloBlockVariantSchema } from './schema';

export type ProblemStatementData = z.infer<typeof ProblemStatementSchema>;
export type ProblemStatementSettings = z.infer<typeof BaseSectionSettingsSchema>;
export type SiloBlockVariant = z.infer<typeof SiloBlockVariantSchema>;

END_OF_FILE_CONTENT
mkdir -p "src/components/product-triad"
echo "Creating src/components/product-triad/View.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/components/product-triad/View.tsx"
import React from 'react';
import { cn } from '@/lib/utils';
import type { ProductTriadData, ProductTriadSettings } from './types';

export const ProductTriad: React.FC<{ data: ProductTriadData; settings?: ProductTriadSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--color-accent, #60a5fa)',
        '--local-border': 'var(--border)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="text-center">
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--local-accent)] mb-4" data-jp-field="label">
              <span className="w-5 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold text-[var(--local-text)] leading-[1.15] tracking-tight mb-4" data-jp-field="title">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-lg text-[var(--local-text-muted)] max-w-[600px] mx-auto leading-relaxed" data-jp-field="description">
              {data.description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14">
          {data.products.map((product, idx) => (
            <div
              key={product.id ?? idx}
              className={cn(
                'relative border rounded-lg p-10 transition-all duration-300 hover:-translate-y-1',
                product.featured
                  ? 'border-[rgba(59,130,246,0.3)] bg-gradient-to-b from-[rgba(59,130,246,0.06)] to-[rgba(59,130,246,0.01)] hover:border-[rgba(59,130,246,0.4)]'
                  : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] hover:border-[rgba(59,130,246,0.2)]'
              )}
              data-jp-item-id={product.id ?? `legacy-${idx}`}
              data-jp-item-field="products"
            >
              {product.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--local-primary)] text-white text-[0.7rem] font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--local-accent)] mb-2">
                {product.tier}
              </div>
              <div className="text-2xl font-extrabold text-[var(--local-text)] mb-2">
                {product.name}
              </div>
              <div className="font-display text-[2.2rem] font-extrabold text-[var(--local-text)] mb-1">
                {product.price}
                {product.priceSuffix && (
                  <span className="text-[0.9rem] font-normal text-[var(--local-text-muted)]">
                    {product.priceSuffix}
                  </span>
                )}
              </div>
              <div className="text-[0.85rem] text-[var(--local-text-muted)] mb-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
                {product.delivery}
              </div>
              <ul className="mb-8 space-y-0">
                {product.features.map((feature, fIdx) => (
                  <li
                    key={fIdx}
                    className="text-[0.9rem] text-[#cbd5e1] py-1.5 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[var(--local-accent)] before:font-bold before:text-[0.8rem]"
                  >
                    {feature.text}
                  </li>
                ))}
              </ul>
              {product.ctaLabel && product.ctaHref && (
                <a
                  href={product.ctaHref}
                  className={cn(
                    'block text-center py-3 rounded-[5px] no-underline font-semibold text-[0.95rem] transition-all duration-200',
                    product.ctaVariant === 'primary'
                      ? 'bg-[var(--local-primary)] text-white hover:brightness-110 hover:-translate-y-px'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#e2e8f0] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
                  )}
                >
                  {product.ctaLabel}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

END_OF_FILE_CONTENT
echo "Creating src/components/product-triad/index.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/product-triad/index.ts"
export * from './View';
export * from './schema';
export * from './types';

END_OF_FILE_CONTENT
echo "Creating src/components/product-triad/schema.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/product-triad/schema.ts"
import { z } from 'zod';
import { BaseSectionData, BaseArrayItem } from '@/lib/base-schemas';

const ProductFeatureSchema = z.object({
  text: z.string().describe('ui:text'),
});

const ProductCardSchema = BaseArrayItem.extend({
  tier: z.string().describe('ui:text'),
  name: z.string().describe('ui:text'),
  price: z.string().describe('ui:text'),
  priceSuffix: z.string().optional().describe('ui:text'),
  delivery: z.string().describe('ui:text'),
  features: z.array(ProductFeatureSchema).describe('ui:list'),
  featured: z.boolean().default(false).describe('ui:checkbox'),
  ctaLabel: z.string().optional().describe('ui:text'),
  ctaHref: z.string().optional().describe('ui:text'),
  ctaVariant: z.enum(['primary', 'secondary']).default('secondary').describe('ui:select'),
});

export const ProductTriadSchema = BaseSectionData.extend({
  label: z.string().optional().describe('ui:text'),
  title: z.string().describe('ui:text'),
  description: z.string().optional().describe('ui:textarea'),
  products: z.array(ProductCardSchema).describe('ui:list'),
});

END_OF_FILE_CONTENT
echo "Creating src/components/product-triad/types.ts..."
cat << 'END_OF_FILE_CONTENT' > "src/components/product-triad/types.ts"
import { z } from 'zod';
import { BaseSectionSettingsSchema } from '@/lib/base-schemas';
import { ProductTriadSchema } from './schema';

export type ProductTriadData = z.infer<typeof ProductTriadSchema>;
export type ProductTriadSettings = z.infer<typeof BaseSectionSettingsSchema>;

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
      'inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs transition-colors',
      active
        ? 'bg-zinc-700/70 text-zinc-100'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
    ].join(' ')}
  >
    {children}
  </button>
);

const Sep: React.FC = () => (
  <span className="mx-0.5 h-5 w-px shrink-0 bg-zinc-800" aria-hidden />
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
          className="sticky top-0 z-[65] border-b border-zinc-800 bg-zinc-950"
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
            <div className="flex items-center gap-2 border-t border-zinc-700 px-2 py-1.5">
              <Link2 size={12} className="shrink-0 text-zinc-500" />
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
                className="min-w-0 flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyLink}
                className="shrink-0 rounded px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Set
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setLinkOpen(false)}
                className="shrink-0 rounded px-2 py-0.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
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

const PublicTiptapContent: React.FC<{ content: string }> = ({ content }) => (
  <article className="jp-tiptap-content" data-jp-field="content">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
      {content}
    </ReactMarkdown>
  </article>
);

// ── Export ────────────────────────────────────────────────────────────────────

export const Tiptap: React.FC<{ data: TiptapData; settings?: TiptapSettings }> = ({ data }) => {
  const { mode } = useStudio();
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-6 max-w-3xl">
        {mode === 'studio' ? (
          <StudioTiptapEditor data={data} />
        ) : (
          <PublicTiptapContent content={data.content ?? ''} />
        )}
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
      "logoText": "Json",
      "logoHighlight": "Pages",
      "logoIconText": "{ }",
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
      "brandText": "Json",
      "brandHighlight": "Pages",
      "copyright": "© 2026 JsonPages. Source-available · Free to use.",
      "links": [
        {
          "label": "Docs",
          "href": "/docs"
        },
        {
          "label": "NPM",
          "href": "#"
        },
        {
          "label": "GitHub",
          "href": "#"
        },
        {
          "label": "Changelog",
          "href": "#"
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
      "sm": "5px",
      "md": "7px",
      "lg": "8px"
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
    "title": "JsonPages Docs — Onboarding Governance",
    "description": "Percorso Governance completo: capsule, IDAC, registry, schema, overlay e checklist per integrare il CMS con governance piena."
  },
  "sections": [
    {
      "id": "docs-main",
      "type": "docs-layout",
      "data": {
        "pageTitle": "Onboarding — Percorso Governance",
        "pageSubtitle": "Per chi vuole il CMS (Studio, ICE, Form Factory): authoring in-app, tipizzazione forte, governance dei contenuti e dei componenti. Riferimento spec: JSONPAGES Architecture Specifications v1.2 + Appendix A.",
        "version": "Spec v1.2",
        "groups": [
          {
            "id": "g-1",
            "anchor": "governance",
            "label": "1. Governance",
            "sections": [
              {
                "id": "s-1-1",
                "anchor": "cosa-implica",
                "title": "Cosa implica \"governance\"",
                "blocks": [
                  {
                    "id": "b-1-1",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "i-1", "text": "**Tipi:** Ogni section type è dichiarato in `SectionDataRegistry` / `SectionSettingsRegistry` (module augmentation) e in `SectionComponentPropsMap`. Registry e config sono tipizzati." },
                      { "id": "i-2", "text": "**Schema:** Ogni section type ha uno schema Zod (data, e opzionalmente settings) usato dal Form Factory per generare l'editor nell'Inspector. Gli schema sono aggregati in `SECTION_SCHEMAS`." },
                      { "id": "i-3", "text": "**Studio/ICE:** L'editor (Inspector) si aggancia al DOM tramite `data-jp-field` e `data-jp-item-id` / `data-jp-item-field`. L'overlay di selezione in iframe richiede che il tenant fornisca il CSS (TOCC)." },
                      { "id": "i-4", "text": "**Add Section:** Il tenant espone **AddSectionConfig** (tipi addabili, label, default data) così in Studio l'utente può aggiungere section dalla libreria." },
                      { "id": "i-5", "text": "**Design tokens:** Le View usano variabili CSS (`--local-*`) e nessuna utility nuda (CIP) per coerenza e compatibilità con tema e overlay." }
                    ]
                  },
                  {
                    "id": "b-1-2",
                    "type": "callout",
                    "content": "**Perché servono (in sintesi):** Tipi e schema permettono al Core e al Form Factory di operare senza conoscere i dettagli del Tenant; IDAC permette all'Inspector di legare click in Stage e riga attiva nella sidebar; TOCC rende visibile l'overlay; AddSectionConfig definisce la libreria Aggiungi sezione; token e z-index evitano conflitti con l'UI di editing."
                  }
                ]
              },
              {
                "id": "s-1-2",
                "anchor": "tipizzazione",
                "title": "Valore della tipizzazione: governance e CMS UX",
                "tag": "§1.1",
                "blocks": [
                  {
                    "id": "b-2-1",
                    "type": "paragraph",
                    "content": "La tipizzazione (tipi TypeScript + schema Zod) serve a **due livelli**: governance (sviluppatore/architettura) e **UX del CMS** (autore che usa Studio). Spesso si menziona solo il primo."
                  },
                  {
                    "id": "b-2-2",
                    "type": "paragraph",
                    "content": "**Governance:** registry tipizzato, SectionComponentPropsMap, forma di SiteConfig/PageConfig, audit, code-generation → coerenza tra tenant, niente drift, refactor sicuro, tooling basato su spec."
                  },
                  {
                    "id": "b-2-3",
                    "type": "paragraph",
                    "content": "**CMS UX:** lo schema Zod guida il **Form Factory** (quali widget per ogni campo: text, textarea, select, list, icon-picker, **image-picker**); `data-jp-field` e `data-jp-item-id/field` legano click in Stage e form nell'Inspector; **AddSectionConfig** dà tipi addabili, label e default."
                  },
                  {
                    "id": "b-2-4",
                    "type": "callout",
                    "content": "Per la governance la tipizzazione garantisce **contratti**; per la CMS UX definisce l'**esperienza di editing** (controlli, label, default, binding). Va specificato entrambi."
                  }
                ]
              }
            ]
          },
          {
            "id": "g-2",
            "anchor": "struttura",
            "label": "2. Struttura progetto",
            "sections": [
              {
                "id": "s-2-1",
                "anchor": "file-layout",
                "title": "File e cartelle (completa)",
                "blocks": [
                  {
                    "id": "b-3-1",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "f-1",  "text": "`src/data/config/site.json` — SiteConfig (identity, pages[], header block, footer block)." },
                      { "id": "f-2",  "text": "`src/data/config/menu.json` — MenuConfig (`main: MenuItem[]`)." },
                      { "id": "f-3",  "text": "`src/data/config/theme.json` — ThemeConfig (tokens)." },
                      { "id": "f-4",  "text": "`src/data/pages/<slug>.json` — PageConfig (slug, meta, sections[])." },
                      { "id": "f-5",  "text": "`src/components/<sectionType>/` — **Capsula piena:** View.tsx, schema.ts, types.ts, index.ts." },
                      { "id": "f-6",  "text": "`src/lib/base-schemas.ts` — BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema." },
                      { "id": "f-7",  "text": "`src/lib/schemas.ts` — SECTION_SCHEMAS (aggregato degli schema data per tipo) + export SectionType." },
                      { "id": "f-8",  "text": "`src/lib/ComponentRegistry.tsx` — Registry tipizzato: `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }`." },
                      { "id": "f-9",  "text": "`src/lib/addSectionConfig.ts` — AddSectionConfig (addableSectionTypes, sectionTypeLabels, getDefaultSectionData)." },
                      { "id": "f-10", "text": "`src/types.ts` — SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **module augmentation** per SectionDataRegistry e SectionSettingsRegistry; re-export da `@jsonpages/core`." },
                      { "id": "f-11", "text": "`src/App.tsx` — Bootstrap: config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection); `<JsonPagesEngine config={config} />`." },
                      { "id": "f-12", "text": "**CSS globale** — Include i selettori TOCC per overlay (hover/selected/type label)." }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "g-3",
            "anchor": "componenti",
            "label": "3. Componenti",
            "sections": [
              {
                "id": "s-3-1",
                "anchor": "capsule-idac",
                "title": "Capsule + IDAC + token",
                "blocks": [
                  {
                    "id": "b-4-1",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "c-1", "text": "**Capsula:** Ogni section type ha View, schema (Zod), types (inferiti), index. Lo schema **data** estende BaseSectionData; gli item degli array estendono BaseArrayItem." },
                      { "id": "c-2", "text": "**View:** Riceve `data` e `settings` (e `menu` per header). Non importa Zod. Usa **solo** variabili CSS per colori/raggi (`bg-[var(--local-bg)]`), sezione root con `z-index` ≤ 1." },
                      { "id": "c-3", "text": "**IDAC (ICE):** Su ogni campo scalare editabile: `data-jp-field=\"<fieldKey>\"`. Su ogni item di array: `data-jp-item-id=\"<stableId>\"` e `data-jp-item-field=\"<arrayKey>\"`." },
                      { "id": "c-4", "text": "**Schema:** Usa il vocabolario UI (ECIP): `.describe('ui:text')`, `ui:textarea`, `ui:select`, `ui:number`, `ui:list`, `ui:icon-picker`, `ui:image-picker`. Array di oggetti editabili: ogni oggetto con `id` (BaseArrayItem)." }
                    ]
                  },
                  {
                    "id": "b-4-2",
                    "type": "callout",
                    "content": "**Perché servono:** `data-jp-field` e `data-jp-item-*` servono perché lo Stage è in un iframe e il Core deve sapere quale campo/item corrisponde al click senza conoscere il DOM del Tenant. Senza IDAC, click sul canvas non si riflette nella sidebar. Vedi spec §6 (IDAC), §5 (ECIP), §4 (CIP)."
                  }
                ]
              },
              {
                "id": "s-3-2",
                "anchor": "image-picker",
                "title": "Image Picker: uso corretto nello schema",
                "tag": "§3.1",
                "blocks": [
                  {
                    "id": "b-5-1",
                    "type": "paragraph",
                    "content": "Per i **campi immagine** il Form Factory espone il widget **Image Picker** solo se lo schema è modellato correttamente."
                  },
                  {
                    "id": "b-5-2",
                    "type": "heading",
                    "content": "Regola"
                  },
                  {
                    "id": "b-5-3",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "r-1", "text": "Il campo immagine non è una stringa (`z.string()`), ma un **oggetto** con almeno `url` e, opzionalmente, `alt`." },
                      { "id": "r-2", "text": "Lo **schema di questo oggetto** va marcato con **`.describe('ui:image-picker')`**. Il Form Factory riconosce `ui:image-picker` solo su **ZodObject**, non su campi stringa." }
                    ]
                  },
                  {
                    "id": "b-5-4",
                    "type": "heading",
                    "content": "Esempio (capsula image-break)"
                  },
                  {
                    "id": "b-5-5",
                    "type": "code",
                    "codeFilename": "src/components/image-break/schema.ts",
                    "content": "import { z } from 'zod';\nimport { BaseSectionData } from '@/lib/base-schemas';\n\nconst ImageSelectionSchema = z\n  .object({\n    url: z.string(),\n    alt: z.string().optional(),\n  })\n  .describe('ui:image-picker');\n\nexport const ImageBreakSchema = BaseSectionData.extend({\n  label:   z.string().optional().describe('ui:text'),\n  image:   ImageSelectionSchema.default({ url: '', alt: '' }),\n  caption: z.string().optional().describe('ui:textarea'),\n});"
                  },
                  {
                    "id": "b-5-6",
                    "type": "paragraph",
                    "content": "In **View.tsx**: usa `resolveAssetUrl(data.image.url, tenantId)` per il `src` dell'immagine. Aggiungi `data-jp-field=\"image\"` sul nodo corrispondente nel DOM."
                  },
                  {
                    "id": "b-5-7",
                    "type": "note",
                    "content": "**Cosa evitare:** Non usare `.describe('ui:image-picker')` su un campo stringa: il widget Image Picker si aspetta un oggetto `{ url, alt? }`. Non dimenticare `data-jp-field=\"image\"` nel DOM, altrimenti il binding Inspector ↔ Stage non funziona."
                  }
                ]
              }
            ]
          },
          {
            "id": "g-4",
            "anchor": "dati",
            "label": "4. Dati",
            "sections": [
              {
                "id": "s-4-1",
                "anchor": "forma-dati",
                "title": "Forma e responsabilità",
                "blocks": [
                  {
                    "id": "b-6-1",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "d-1", "text": "`site.json` / `menu.json` / `theme.json` / `pages/*.json` — Forma esatta come in Appendix A. Sono la source of truth quando l'utente salva da Studio." },
                      { "id": "d-2", "text": "**Studio** aggiorna il Working Draft; il sync con l'iframe e il Bake usano la stessa struttura. I dati passati a JsonPagesEngine devono essere compatibili con ciò che l'editor modifica." }
                    ]
                  },
                  {
                    "id": "b-6-2",
                    "type": "callout",
                    "content": "Se i dati arrivano da un CMS esterno tocca a te sincronizzare. In ogni caso la **forma** delle pagine (sections con id, type, data, settings) resta quella della spec."
                  }
                ]
              }
            ]
          },
          {
            "id": "g-5",
            "anchor": "registry",
            "label": "5. Registry & Types",
            "sections": [
              {
                "id": "s-5-1",
                "anchor": "registry-detail",
                "title": "Registry, schemas, types, addSection",
                "blocks": [
                  {
                    "id": "b-7-1",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "re-1", "text": "**types.ts:** Unico punto di **module augmentation** e definizione di SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig. Header: `{ data, settings?, menu: MenuItem[] }`; tutti gli altri: `{ data, settings? }`." },
                      { "id": "re-2", "text": "**ComponentRegistry:** Ogni chiave di SectionType ha il componente corrispondente; tipo: `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }`." },
                      { "id": "re-3", "text": "**SECTION_SCHEMAS:** Ogni chiave di SectionType ha lo **schema Zod della data** (stesso ordine del registry). Base schemas re-exportati da base-schemas.ts." },
                      { "id": "re-4", "text": "**addSectionConfig:** addableSectionTypes (solo i tipi che l'utente può aggiungere dalla libreria), sectionTypeLabels, getDefaultSectionData(type) che restituisce `data` valido per quello schema." }
                    ]
                  },
                  {
                    "id": "b-7-2",
                    "type": "callout",
                    "content": "Un solo punto di augmentation (types.ts) e un solo SECTION_SCHEMAS evita duplicazioni. AddSectionConfig è l'unica fonte di verità per quali section si possono aggiungere e con quali default. Vedi spec §9 (ASC), Appendix A.2–A.3."
                  }
                ]
              }
            ]
          },
          {
            "id": "g-6",
            "anchor": "overlay",
            "label": "6. Overlay CSS (TOCC)",
            "sections": [
              {
                "id": "s-6-1",
                "anchor": "tocc-detail",
                "title": "Selettori TOCC richiesti",
                "blocks": [
                  {
                    "id": "b-8-1",
                    "type": "paragraph",
                    "content": "Il Core inietta il markup dell'overlay (wrapper con `data-section-id`, sibling con `data-jp-section-overlay`). Il **tenant** deve fornire il CSS nel proprio `index.css` per renderlo visibile."
                  },
                  {
                    "id": "b-8-2",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "t-1", "text": "`[data-jp-section-overlay]` copra la section, `pointer-events: none`, z-index alto (es. 9999)." },
                      { "id": "t-2", "text": "Hover e selected siano visibili (bordo tratteggiato / pieno, eventuale tint)." },
                      { "id": "t-3", "text": "Il type label (`[data-jp-section-overlay] > .jp-section-type-label`) sia posizionato e visibile su hover/selected." }
                    ]
                  },
                  {
                    "id": "b-8-3",
                    "type": "code",
                    "codeFilename": "src/index.css — TOCC selectors",
                    "content": "/* ── TOCC — Tenant Overlay CSS Contract ── */\n[data-jp-section-overlay] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  z-index: 9999;\n  border: 1.5px dashed transparent;\n  transition: border-color 0.15s, background 0.15s;\n}\n\n[data-jp-section-wrapper]:hover > [data-jp-section-overlay] {\n  border-color: rgba(59, 130, 246, 0.5);\n  background: rgba(59, 130, 246, 0.03);\n}\n\n[data-jp-section-wrapper].jp-selected > [data-jp-section-overlay] {\n  border-color: #3b82f6;\n  border-style: solid;\n  background: rgba(59, 130, 246, 0.05);\n}\n\n[data-jp-section-overlay] > .jp-section-type-label {\n  position: absolute;\n  top: 6px;\n  right: 8px;\n  font-family: 'JetBrains Mono', monospace;\n  font-size: 0.55rem;\n  font-weight: 700;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  background: #3b82f6;\n  color: white;\n  padding: 2px 6px;\n  opacity: 0;\n  transition: opacity 0.15s;\n}\n\n[data-jp-section-wrapper]:hover > [data-jp-section-overlay] > .jp-section-type-label,\n[data-jp-section-wrapper].jp-selected > [data-jp-section-overlay] > .jp-section-type-label {\n  opacity: 1;\n}"
                  },
                  {
                    "id": "b-8-4",
                    "type": "callout",
                    "content": "**Perché servono (TOCC):** L'iframe dello Stage carica solo il CSS del Tenant; il Core inietta il markup dell'overlay ma non gli stili. Senza i selettori TOCC, bordo hover/selected e type label non sono visibili. Vedi spec §7 (TOCC)."
                  }
                ]
              }
            ]
          },
          {
            "id": "g-7",
            "anchor": "checklist",
            "label": "7. Checklist",
            "sections": [
              {
                "id": "s-7-1",
                "anchor": "checklist-table",
                "title": "Checklist rapida — sviluppo grafico e dati (con CMS)",
                "blocks": [
                  {
                    "id": "b-9-1",
                    "type": "table",
                    "content": "",
                    "rows": [
                      { "id": "r-1",  "col1": "**Layout / grafico**",   "col2": "View con variabili `--local-*`, z-index ≤ 1, nessuna utility naked." },
                      { "id": "r-2",  "col1": "**Dati (forma)**",        "col2": "SiteConfig, MenuConfig, ThemeConfig, PageConfig come in Appendix A; JSON in `data/config` e `data/pages`." },
                      { "id": "r-3",  "col1": "**Capsule**",             "col2": "View + schema (con `ui:*`) + types + index; data schema estende BaseSectionData; array item con id." },
                      { "id": "r-4",  "col1": "**IDAC**",                "col2": "`data-jp-field` su campi scalari editabili; `data-jp-item-id` e `data-jp-item-field` su item di array." },
                      { "id": "r-5",  "col1": "**Image Picker**",        "col2": "Campo immagine = oggetto `{ url, alt? }` con sub-schema `.describe('ui:image-picker')`; `resolveAssetUrl` + `data-jp-field` in View." },
                      { "id": "r-6",  "col1": "**types.ts**",            "col2": "SectionComponentPropsMap (header con menu), augmentation, PageConfig, SiteConfig, MenuConfig, ThemeConfig." },
                      { "id": "r-7",  "col1": "**Registry**",            "col2": "Tutti i tipi mappati al componente; tipo registry come in Appendix A." },
                      { "id": "r-8",  "col1": "**SECTION_SCHEMAS**",     "col2": "Un entry per tipo (schema data); re-export base schemas." },
                      { "id": "r-9",  "col1": "**addSectionConfig**",    "col2": "addableSectionTypes, sectionTypeLabels, getDefaultSectionData." },
                      { "id": "r-10", "col1": "**Config**",              "col2": "tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection." },
                      { "id": "r-11", "col1": "**TOCC**",                "col2": "CSS overlay per `[data-jp-section-overlay]`, hover, selected, type label." }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "g-8",
            "anchor": "riferimenti",
            "label": "8. Riferimenti spec",
            "sections": [
              {
                "id": "s-8-1",
                "anchor": "spec-refs",
                "title": "Documenti di riferimento",
                "blocks": [
                  {
                    "id": "b-10-1",
                    "type": "list",
                    "content": "",
                    "items": [
                      { "id": "sp-1", "text": "**Architettura e ICE:** §1–§10 (MTRP, JSP, TBP, CIP, ECIP, IDAC, TOCC, BSDS, ASC, JEB)." },
                      { "id": "sp-2", "text": "**Tipi e code-generation:** Appendix A (Core types, Tenant types, Schema contract, File paths, Integration checklist)." },
                      { "id": "sp-3", "text": "**Admin:** JAP (Studio topology, Working Draft, Bake, overlay, Green Build)." }
                    ]
                  },
                  {
                    "id": "b-10-2",
                    "type": "callout",
                    "content": "Usando questo percorso hai **governance** piena: tipi, schema, editor, Add Section e overlay allineati alle spec v1.2. Per le versioni con tutti i Perché servono usa il file **JSONPAGES_Specs_v1.2_completo.md**."
                  }
                ]
              }
            ]
          }
        ]
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
    "title": "JsonPages — The Sovereign Shell. Zero Runtime Overhead.",
    "description": "The @jsonpages/core package is a headless, schema-driven runtime. It handles routing, hydration, and the admin interface, leaving your Tenant code pure and framework-agnostic."
  },
  "sections": [
    {
      "id": "hero-main",
      "type": "hero",
      "data": {
        "badge": "Architecture v1.2",
        "title": "The Sovereign Shell.",
        "titleHighlight": "Zero Runtime Overhead.",
        "description": "The @jsonpages/core package is a headless, schema-driven runtime. It handles routing, hydration, and the admin interface, leaving your Tenant code pure and framework-agnostic.",
        "ctas": [
          {
            "id": "cta-1",
            "label": "Read the Docs",
            "href": "#devex",
            "variant": "primary"
          },
          {
            "id": "cta-2",
            "label": "View on NPM",
            "href": "#",
            "variant": "secondary"
          }
        ],
        "metrics": [
          {
            "id": "m-1",
            "val": "3KB",
            "label": "Core Overhead"
          },
          {
            "id": "m-2",
            "val": "100%",
            "label": "Type Safety"
          },
          {
            "id": "m-3",
            "val": "MIT",
            "label": "License"
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "soc-section",
      "type": "arch-layers",
      "data": {
        "anchorId": "architecture",
        "label": "Architecture",
        "title": "Separation of Concerns",
        "description": "We enforce a strict boundary between the Engine (us) and the Tenant (you). This prevents vendor lock-in.",
        "layers": [
          {
            "id": "layer-3",
            "number": "3",
            "layerLevel": "l2",
            "title": "The Form Factory",
            "description": "The Admin UI is not hardcoded. It is generated at runtime by analyzing your Zod schemas. Change the schema, change the UI."
          },
          {
            "id": "layer-2",
            "number": "2",
            "layerLevel": "l1",
            "title": "The Tenant Protocol (TBP)",
            "description": "Your components live here. They receive pure JSON data. They do not know they are being edited. They just render."
          },
          {
            "id": "layer-1",
            "number": "1",
            "layerLevel": "l0",
            "title": "The Core Engine (@jsonpages/core)",
            "description": "Handles the React rendering loop, routing, and the Studio iframe injection. It is completely agnostic of your design system."
          }
        ],
        "codeLines": []
      },
      "settings": {}
    },
    {
      "id": "cms-ice-section",
      "type": "cms-ice",
      "data": {
        "anchorId": "cms",
        "label": "In-Context Editing",
        "title": "The Inspector that only shows what you need.",
        "description": "Traditional CMS sidebars dump every field at once. ICE binds to the section you click in the live canvas and shows only the fields for that block. Zero cognitive overhead. The Form Factory generates every input widget automatically from your Zod schema — change the schema, change the UI.",
        "callouts": [
          {
            "id": "cl-1",
            "icon": "🎯",
            "title": "Context-bound Inspector",
            "description": "Click any section in the canvas. The Inspector shows exactly — and only — the fields for that block. No sidebar overload."
          },
          {
            "id": "cl-2",
            "icon": "⚡",
            "title": "Schema → UI, automatically",
            "description": "The Admin UI is not hardcoded. It is generated at runtime by analyzing your Zod schemas. Change the schema, change the UI."
          },
          {
            "id": "cl-3",
            "icon": "📤",
            "title": "Bake to Zero-Runtime HTML",
            "description": "Hit Bake. The engine exports pure HTML/CSS with no JavaScript runtime — CDN-ready, infinitely cacheable, fully portable."
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "git-section",
      "type": "git-section",
      "data": {
        "anchorId": "git",
        "label": "Versioning",
        "title": "Your content is code.",
        "titleHighlight": "Branch it. Diff it. Roll it back.",
        "description": "Because every page is a plain JSON file, your content workflow is identical to your code workflow. No database exports, no CMS snapshots, no proprietary backups. Just git.",
        "points": [
          {
            "id": "p-1",
            "text": "Content changes appear in pull requests like any code change"
          },
          {
            "id": "p-2",
            "text": "Branch a page, preview it, merge when approved"
          },
          {
            "id": "p-3",
            "text": "Full diff history on every field of every section"
          },
          {
            "id": "p-4",
            "text": "Roll back any page to any commit in seconds"
          },
          {
            "id": "p-5",
            "text": "CI/CD pipelines trigger on content changes, not just code"
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "devex-section",
      "type": "devex",
      "data": {
        "anchorId": "devex",
        "label": "Developer Experience",
        "title": "Your App.tsx is incredibly thin.",
        "description": "You don't write routing logic. You don't write admin panels. You just import the Engine and pass your configuration.",
        "features": [
          {
            "id": "f-1",
            "text": "Automatic Routing based on JSON files"
          },
          {
            "id": "f-2",
            "text": "Hot Module Replacement (HMR)"
          },
          {
            "id": "f-3",
            "text": "Full TypeScript support"
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "cli-section",
      "type": "cli-section",
      "data": {
        "anchorId": "cli",
        "label": "CLI Tool",
        "title": "A new tenant in under 5 minutes.",
        "description": "Install the CLI once. From there, scaffolding a fully-typed, production-ready tenant — with all capsules, registry, schemas, and config wired up — is a single command.",
        "steps": [
          {
            "id": "s-1",
            "num": "1",
            "title": "Install the CLI globally",
            "description": "One-time install. The CLI lives alongside your other dev tools."
          },
          {
            "id": "s-2",
            "num": "2",
            "title": "Scaffold a new tenant",
            "description": "Generates the full TBP structure: capsules, registry, schemas, config, and data files — all typed and ready."
          },
          {
            "id": "s-3",
            "num": "3",
            "title": "Start building",
            "description": "Run npm run dev and your tenant is live with Studio, HMR, and full CMS editing."
          }
        ]
      },
      "settings": {}
    },
    {
      "id": "cta-final",
      "type": "cta-banner",
      "data": {
        "anchorId": "start",
        "title": "Trust the Architecture.",
        "description": "Stop building page builders. Start building Systems.",
        "cliCommand": "npx @jsonpages/cli@latest new tenant",
        "ctas": [
          {
            "id": "cta-docs",
            "label": "Read the Docs",
            "href": "#devex",
            "variant": "primary"
          },
          {
            "id": "cta-npm",
            "label": "View on NPM",
            "href": "#",
            "variant": "secondary"
          }
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
mkdir -p "src/data/pages/servizi"
echo "Creating src/data/pages/servizi/trattamento.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/servizi/trattamento.json"
{
  "id": "servizi-trattamento-page",
  "slug": "servizi/trattamento",
  "meta": {
    "title": "Servizi - Trattamento",
    "description": "Pagina nested di smoke test per verificare routing visitor/admin/preview."
  },
  "sections": [
    {
      "id": "hero-servizi-trattamento",
      "type": "hero",
      "data": {
        "badge": "Smoke Test",
        "title": "Trattamento",
        "titleHighlight": "Pagina Nested",
        "description": "Questa pagina verifica il supporto ai nested slug su filesystem e router.",
        "ctas": [
          {
            "id": "cta-home",
            "label": "Torna Home",
            "href": "/",
            "variant": "primary"
          }
        ]
      },
      "settings": {}
    }
  ]
}

END_OF_FILE_CONTENT
echo "Creating src/data/pages/servizi_trattamento.json..."
cat << 'END_OF_FILE_CONTENT' > "src/data/pages/servizi_trattamento.json"
{
  "id": "servizi-trattamento-page",
  "slug": "servizi/trattamento",
  "meta": {
    "title": "Servizi - Trattamento",
    "description": "Pagina nested di smoke test per verificare routing visitor/admin/preview."
  },
  "sections": [
    {
      "id": "hero-servizi-trattamento",
      "type": "hero",
      "data": {
        "badge": "Smoke Test",
        "title": "Trattamentos",
        "titleHighlight": "Pagina Nested",
        "description": "Questa pagina verifica il supporto ai nested slug su filesystem e router.",
        "ctas": [
          {
            "id": "cta-home",
            "label": "Torna Home",
            "href": "/",
            "variant": "primary"
          }
        ]
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
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap');

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
  
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  --font-primary: var(--theme-font-primary);
  --font-mono: var(--theme-font-mono);

  /* 
     🔧 DISPLAY FONT — Forward-compatible workaround
     theme-manager.ts does NOT inject --theme-font-display (Skeleton v2.7 gap).
     The var() falls through to the hardcoded fallback today.
     When Skeleton v2.8 wires display into theme-manager, the var() will resolve
     automatically and the fallback becomes dead code.
  */
  --font-display: var(--theme-font-display, 'Playfair Display', Georgia, serif);
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
  --radius: 0.45rem;

  /* 
     🔧 ACCENT CHAIN — Forward-compatible workaround
     theme-manager.ts already injects --theme-accent on :root,
     but the original index.css never bridged it into the semantic layer.
     This closes the gap: --theme-accent → --accent → --color-accent.
     Falls back to --theme-primary if accent is undefined.
  */
  --accent: var(--theme-accent, var(--theme-primary));
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

.jp-tiptap-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}

.jp-tiptap-content img { max-width: 100%; height: auto; border-radius: 0.5rem; }

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
  border-radius: 0.25em;
  padding: 0.1em 0.35em;
}
.jp-simple-editor .ProseMirror pre {
  background: color-mix(in oklch, var(--background) 60%, black);
  border-radius: 0.5em;
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
  border-radius: 0.5rem;
}

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
import { CodeBlock }        from '@/components/code-block';
import { ProblemStatement } from '@/components/problem-statement';
import { PillarsGrid }      from '@/components/pillars-grid';
import { ArchLayers }       from '@/components/arch-layers';
import { ProductTriad }     from '@/components/product-triad';
import { PaSection }        from '@/components/pa-section';
import { Philosophy }       from '@/components/philosophy';
import { CtaBanner }        from '@/components/cta-banner';
import { ImageBreak }       from '@/components/image-break';
import { CmsIce }           from '@/components/cms-ice';
import { GitSection }       from '@/components/git-section';
import { Devex }            from '@/components/devex';
import { CliSection }       from '@/components/cli-section';
import { DocsLayout }       from '@/components/docs-layout';
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
  'code-block':        CodeBlock,
  'problem-statement': ProblemStatement,
  'pillars-grid':      PillarsGrid,
  'arch-layers':       ArchLayers,
  'product-triad':     ProductTriad,
  'pa-section':        PaSection,
  'philosophy':        Philosophy,
  'cta-banner':        CtaBanner,
  'image-break':       ImageBreak,
  'cms-ice':           CmsIce,
  'git-section':       GitSection,
  'devex':             Devex,
  'cli-section':       CliSection,
  'docs-layout':       DocsLayout,
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
  'hero', 'feature-grid', 'code-block', 'problem-statement',
  'pillars-grid', 'arch-layers', 'product-triad', 'pa-section',
  'philosophy', 'cta-banner', 'image-break',
  'cms-ice', 'git-section', 'devex', 'cli-section', 'docs-layout', 'tiptap',
] as const;

const sectionTypeLabels: Record<string, string> = {
  'hero':              'Hero',
  'feature-grid':      'Feature Grid',
  'code-block':        'Code Block',
  'problem-statement': 'Problem Statement',
  'pillars-grid':      'Pillars Grid',
  'arch-layers':       'Architecture Layers',
  'product-triad':     'Product Triad',
  'pa-section':        'PA Section',
  'philosophy':        'Philosophy',
  'cta-banner':        'CTA Banner',
  'image-break':       'Image Break',
  'cms-ice':           'CMS / In-Context Editing',
  'git-section':       'Git Versioning',
  'devex':             'Developer Experience',
  'cli-section':       'CLI Tool',
  'docs-layout':       'Documentation Layout',
  'tiptap':            'Tiptap Editorial',
};

function getDefaultSectionData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':              return { title: 'New Hero', description: '' };
    case 'feature-grid':      return { sectionTitle: 'Features', cards: [] };
    case 'code-block':        return { lines: [] };
    case 'problem-statement': return { title: 'Problem Statement', siloGroups: [], paragraphs: [] };
    case 'pillars-grid':      return { title: 'Pillars', pillars: [] };
    case 'arch-layers':       return { title: 'Architecture', layers: [] };
    case 'product-triad':     return { title: 'Products', products: [] };
    case 'pa-section':        return { title: 'Section', subtitle: 'Subtitle', paragraphs: [{ text: '' }] };
    case 'philosophy':        return { title: 'Philosophy', quote: 'Your quote here.' };
    case 'cta-banner':        return { title: 'Call to Action', description: '', cliCommand: '' };
    case 'image-break':       return { image: { url: '', alt: '' }, caption: '' };
    case 'cms-ice':           return { title: 'In-Context Editing', description: '', callouts: [] };
    case 'git-section':       return { title: 'Your content is code.', description: '', points: [] };
    case 'devex':             return { title: 'Developer Experience', description: '', features: [] };
    case 'cli-section':       return { title: 'CLI Tool', description: '', steps: [] };
    case 'docs-layout':       return { pageTitle: 'Documentation', pageSubtitle: '', version: 'v1.0', groups: [] };
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
import { CodeBlockSchema }        from '@/components/code-block';
import { ProblemStatementSchema } from '@/components/problem-statement';
import { PillarsGridSchema }      from '@/components/pillars-grid';
import { ArchLayersSchema }       from '@/components/arch-layers';
import { ProductTriadSchema }     from '@/components/product-triad';
import { PaSectionSchema }        from '@/components/pa-section';
import { PhilosophySchema }       from '@/components/philosophy';
import { CtaBannerSchema }        from '@/components/cta-banner';
import { ImageBreakSchema }       from '@/components/image-break';
import { CmsIceSchema }           from '@/components/cms-ice';
import { GitSectionSchema }       from '@/components/git-section';
import { DevexSchema }            from '@/components/devex';
import { CliSectionSchema }       from '@/components/cli-section';
import { DocsLayoutSchema }       from '@/components/docs-layout';
import { TiptapSchema }           from '@/components/tiptap';

export const SECTION_SCHEMAS = {
  'header':            HeaderSchema,
  'footer':            FooterSchema,
  'hero':              HeroSchema,
  'feature-grid':      FeatureGridSchema,
  'code-block':        CodeBlockSchema,
  'problem-statement': ProblemStatementSchema,
  'pillars-grid':      PillarsGridSchema,
  'arch-layers':       ArchLayersSchema,
  'product-triad':     ProductTriadSchema,
  'pa-section':        PaSectionSchema,
  'philosophy':        PhilosophySchema,
  'cta-banner':        CtaBannerSchema,
  'image-break':       ImageBreakSchema,
  'cms-ice':           CmsIceSchema,
  'git-section':       GitSectionSchema,
  'devex':             DevexSchema,
  'cli-section':       CliSectionSchema,
  'docs-layout':       DocsLayoutSchema,
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
echo "Creating src/main_.tsx..."
cat << 'END_OF_FILE_CONTENT' > "src/main_.tsx"
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
import type { CodeBlockData,        CodeBlockSettings }        from '@/components/code-block';
import type { ProblemStatementData, ProblemStatementSettings } from '@/components/problem-statement';
import type { PillarsGridData,      PillarsGridSettings }      from '@/components/pillars-grid';
import type { ArchLayersData,       ArchLayersSettings }       from '@/components/arch-layers';
import type { ProductTriadData,     ProductTriadSettings }     from '@/components/product-triad';
import type { PaSectionData,        PaSectionSettings }        from '@/components/pa-section';
import type { PhilosophyData,       PhilosophySettings }       from '@/components/philosophy';
import type { CtaBannerData,        CtaBannerSettings }        from '@/components/cta-banner';
import type { ImageBreakData,       ImageBreakSettings }       from '@/components/image-break';
import type { CmsIceData,           CmsIceSettings }           from '@/components/cms-ice';
import type { GitSectionData,       GitSectionSettings }       from '@/components/git-section';
import type { DevexData,            DevexSettings }            from '@/components/devex';
import type { CliSectionData,       CliSectionSettings }       from '@/components/cli-section';
import type { DocsLayoutData,       DocsLayoutSettings }       from '@/components/docs-layout';
import type { TiptapData,           TiptapSettings }           from '@/components/tiptap';

export type SectionComponentPropsMap = {
  'header':            { data: HeaderData;           settings?: HeaderSettings;           menu: MenuItem[] };
  'footer':            { data: FooterData;            settings?: FooterSettings            };
  'hero':              { data: HeroData;              settings?: HeroSettings              };
  'feature-grid':      { data: FeatureGridData;       settings?: FeatureGridSettings       };
  'code-block':        { data: CodeBlockData;         settings?: CodeBlockSettings         };
  'problem-statement': { data: ProblemStatementData;  settings?: ProblemStatementSettings  };
  'pillars-grid':      { data: PillarsGridData;       settings?: PillarsGridSettings       };
  'arch-layers':       { data: ArchLayersData;        settings?: ArchLayersSettings        };
  'product-triad':     { data: ProductTriadData;      settings?: ProductTriadSettings      };
  'pa-section':        { data: PaSectionData;         settings?: PaSectionSettings         };
  'philosophy':        { data: PhilosophyData;        settings?: PhilosophySettings        };
  'cta-banner':        { data: CtaBannerData;         settings?: CtaBannerSettings         };
  'image-break':       { data: ImageBreakData;        settings?: ImageBreakSettings        };
  'cms-ice':           { data: CmsIceData;            settings?: CmsIceSettings            };
  'git-section':       { data: GitSectionData;        settings?: GitSectionSettings        };
  'devex':             { data: DevexData;             settings?: DevexSettings             };
  'cli-section':       { data: CliSectionData;        settings?: CliSectionSettings        };
  'docs-layout':       { data: DocsLayoutData;        settings?: DocsLayoutSettings        };
  'tiptap':            { data: TiptapData;            settings?: TiptapSettings            };
};

declare module '@olonjs/core' {
  export interface SectionDataRegistry {
    'header':            HeaderData;
    'footer':            FooterData;
    'hero':              HeroData;
    'feature-grid':      FeatureGridData;
    'code-block':        CodeBlockData;
    'problem-statement': ProblemStatementData;
    'pillars-grid':      PillarsGridData;
    'arch-layers':       ArchLayersData;
    'product-triad':     ProductTriadData;
    'pa-section':        PaSectionData;
    'philosophy':        PhilosophyData;
    'cta-banner':        CtaBannerData;
    'image-break':       ImageBreakData;
    'cms-ice':           CmsIceData;
    'git-section':       GitSectionData;
    'devex':             DevexData;
    'cli-section':       CliSectionData;
    'docs-layout':       DocsLayoutData;
    'tiptap':            TiptapData;
  }
  export interface SectionSettingsRegistry {
    'header':            HeaderSettings;
    'footer':            FooterSettings;
    'hero':              HeroSettings;
    'feature-grid':      FeatureGridSettings;
    'code-block':        CodeBlockSettings;
    'problem-statement': ProblemStatementSettings;
    'pillars-grid':      PillarsGridSettings;
    'arch-layers':       ArchLayersSettings;
    'product-triad':     ProductTriadSettings;
    'pa-section':        PaSectionSettings;
    'philosophy':        PhilosophySettings;
    'cta-banner':        CtaBannerSettings;
    'image-break':       ImageBreakSettings;
    'cms-ice':           CmsIceSettings;
    'git-section':       GitSectionSettings;
    'devex':             DevexSettings;
    'cli-section':       CliSectionSettings;
    'docs-layout':       DocsLayoutSettings;
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
