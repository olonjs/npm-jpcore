# Onboarding — Percorso Governance (con CMS) — Versione completa

**Per chi:** Sviluppo grafico e dati quando vuoi il **CMS** (Studio, ICE, Form Factory): authoring in-app, tipizzazione forte, governance dei contenuti e dei componenti.

**Riferimento spec:** JSONPAGES Architecture Specifications v1.2 (full) + Appendix A — Tenant Type & Code-Generation Annex.

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
- **`src/types.ts`** — SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **module augmentation** per SectionDataRegistry e SectionSettingsRegistry; re-export da `@jsonpages/core`.
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
