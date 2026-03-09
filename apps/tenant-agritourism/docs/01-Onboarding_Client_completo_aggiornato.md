# Onboarding — Percorso Client (senza CMS) — Versione completa

**Per chi:** Sviluppo grafico e dati quando **non** usi il CMS (Studio/ICE). Il sito è un **client**: i dati arrivano da JSON locali, da API o da un CMS esterno; tu ti occupi di layout, design e rendering.

**Riferimento spec:** JSONPAGES Architecture v1.2 — solo le parti che riguardano struttura sito, componenti e dati. Ignori: Studio, ICE, Form Factory, IDAC, TOCC, AddSectionConfig, schema obbligatori per l'editor.

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
- **`src/App.tsx`** — Carica site, menu, theme, pages; costruisce la config; renderizza **`<JsonPagesEngine config={config} />`**.

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

- **Registry:** Un oggetto che mappa ogni `sectionType` (stringa) al componente React che renderizza quel tipo. Es.: `{ header: Header, footer: Footer, hero: Hero, ... }`. Se non usi Studio, puoi tipizzare in modo lasco (es. `Record<string, React.FC<any>>` o comunque compatibile con quanto si aspetta `JsonPagesConfig['registry']`).
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
