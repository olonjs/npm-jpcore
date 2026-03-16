# Compat Cutoff Plan (`jsonpages` -> `olonjs`)

Questo documento definisce la dismissione controllata dei residui legacy mantenuti per compatibilita durante la migrazione a `olonjs`.

Data apertura: `2026-03-16`  
Owner release: `TBD`  
Stato: `draft operativo`

## Obiettivo

Rimuovere in sicurezza i layer di compatibilita legacy (`jsonpages`) dopo una finestra ponte, senza regressioni per tenant e consumer.

## Regole cutoff

- Nessuna rimozione senza prerequisiti verificati.
- Ogni rimozione deve avere rollback esplicito.
- Le rimozioni devono avvenire in release pianificata (mai in hotfix).
- Le deprecazioni devono essere comunicate prima del cutoff.

## Tabella residui legacy

| Residuo legacy | Motivo attuale | Data target rimozione | Owner | Prerequisito di rimozione | Rischio impatto | Rollback |
|---|---|---|---|---|---|---|
| Comando CLI alias `jsonpages` (oltre a `olonjs`) | Evitare rotture negli script utente esistenti | `2026-06-30` | `TBD` | Telemetria/compliance interna conferma uso prevalente `olonjs`; comunicazione deprecazione inviata | Medio | Reintroduzione alias in `packages/cli/package.json` + release patch CLI |
| Package bridge `@jsonpages/core` | Compat install/import consumer legacy | `2026-07-15` | `TBD` | Consumer principali migrati a `@olonjs/core`; advisory pubblicata | Alto | Ripubblicare bridge aggiornato verso ultima `@olonjs/core` |
| Package bridge `@jsonpages/cli` | Compat su installazioni legacy del package CLI | `2026-07-15` | `TBD` | Migrazione completata verso `@olonjs/cli`; docs aggiornate | Alto | Ripubblicare bridge aggiornato verso ultima `@olonjs/cli` |
| Package bridge `@jsonpages/stack` | Compat per toolchain che dipende dal vecchio scope stack | `2026-07-15` | `TBD` | Nessun consumer attivo rimasto su vecchio scope | Medio | Ripubblicare bridge aggiornato verso ultima `@olonjs/stack` |
| Fallback env runtime `VITE_JSONPAGES_*` (con `VITE_OLONJS_*` primario) | Compat con deployment esistenti non ancora ruotati | `2026-08-01` | `TBD` | Inventory env completato; tutte le pipeline hanno `VITE_OLONJS_*` | Alto | Ripristinare fallback in `App.tsx` tenant + template DNA e rilasciare patch |
| Note/documentazione legacy (alias `jsonpages`) | Ridurre frizione durante transizione | `2026-08-15` | `TBD` | Fine finestra compat confermata | Basso | Ripristino note tramite docs patch |

## Milestone consigliate

1. **Freeze compat inventory** (`T+0`)  
   Validare che tutti i residui legacy siano mappati in questa tabella.

2. **Deprecation notice** (`T+14 giorni`)  
   Comunicare finestra di rimozione e date target.

3. **Pre-cutoff verification** (`T+60 giorni`)  
   Eseguire checklist tecnica completa:
   - build workspaces
   - check template
   - smoke CLI (`olonjs` + `jsonpages`)
   - smoke install (`@olonjs/*` + bridge `@jsonpages/*`)

4. **Cutoff release** (alle date target)  
   Rimuovere un residuo alla volta (o per blocchi a rischio omogeneo), con changelog esplicito.

5. **Post-cutoff watch** (`+72h`)  
   Monitorare regressioni e readiness rollback.

## Checklist pre-rimozione (per ogni riga tabella)

- [ ] Prerequisiti completati e verificati.
- [ ] Changelog e comunicazione deprecazione pubblicati.
- [ ] Test anti-rottura completati.
- [ ] Rollback testato su branch di sicurezza.
- [ ] Finestra di rilascio approvata.

## Note operative

- Se un prerequisito non e verificabile, la riga non passa in stato `ready`.
- Se emergono regressioni, rinviare cutoff e aggiornare la data target in questo file.
- Questo documento e la fonte unica per la timeline di dismissione compat.
