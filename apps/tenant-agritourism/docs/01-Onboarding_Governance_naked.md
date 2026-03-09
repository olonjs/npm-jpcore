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

