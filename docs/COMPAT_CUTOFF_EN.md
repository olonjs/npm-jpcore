# Compatibility Cutoff Plan (`jsonpages` -> `olonjs`)

This document defines the controlled decommissioning of legacy compatibility residues kept during the migration to `olonjs`.

Start date: `2026-03-16`  
Release owner: `TBD`  
Status: `operational draft`

## Objective

Safely remove legacy compatibility layers (`jsonpages`) after a transition window, without regressions for tenants and consumers.

## Cutoff Rules

- No removals without verified prerequisites.
- Every removal must include an explicit rollback path.
- Removals must happen in planned releases (never in hotfixes).
- Deprecations must be communicated before cutoff.

## Legacy Residue Table

| Legacy residue | Current reason | Target removal date | Owner | Removal prerequisite | Impact risk | Rollback |
|---|---|---|---|---|---|---|
| CLI command alias `jsonpages` (alongside `olonjs`) | Prevent breakage in existing user scripts | `2026-06-30` | `TBD` | Internal telemetry/compliance confirms primary `olonjs` usage; deprecation communication sent | Medium | Reintroduce alias in `packages/cli/package.json` + patch CLI release |
| Bridge package `@jsonpages/core` | Backward compatibility for legacy install/import consumers | `2026-07-15` | `TBD` | Main consumers migrated to `@olonjs/core`; advisory published | High | Republish bridge package updated to latest `@olonjs/core` |
| Bridge package `@jsonpages/cli` | Backward compatibility for legacy CLI package installs | `2026-07-15` | `TBD` | Migration to `@olonjs/cli` completed; docs updated | High | Republish bridge package updated to latest `@olonjs/cli` |
| Bridge package `@jsonpages/stack` | Backward compatibility for toolchains still using old stack scope | `2026-07-15` | `TBD` | No active consumers left on old scope | Medium | Republish bridge package updated to latest `@olonjs/stack` |
| Runtime env fallback `VITE_JSONPAGES_*` (with primary `VITE_OLONJS_*`) | Backward compatibility for deployments not yet rotated | `2026-08-01` | `TBD` | Environment inventory completed; all pipelines have `VITE_OLONJS_*` | High | Restore fallback in tenant `App.tsx` + template DNA and release patch |
| Legacy notes/documentation (`jsonpages` alias) | Reduce transition friction | `2026-08-15` | `TBD` | Compatibility window officially closed | Low | Restore notes via docs patch |

## Recommended Milestones

1. **Freeze compatibility inventory** (`T+0`)  
   Validate that all legacy residues are mapped in this table.

2. **Deprecation notice** (`T+14 days`)  
   Communicate removal window and target dates.

3. **Pre-cutoff verification** (`T+60 days`)  
   Execute complete technical checklist:
   - workspace builds
   - template check
   - CLI smoke tests (`olonjs` + `jsonpages`)
   - install smoke tests (`@olonjs/*` + `@jsonpages/*` bridges)

4. **Cutoff release** (on target dates)  
   Remove one residue at a time (or homogeneous risk blocks), with explicit changelog.

5. **Post-cutoff watch** (`+72h`)  
   Monitor regressions and rollback readiness.

## Pre-removal Checklist (for each table row)

- [ ] Prerequisites completed and verified.
- [ ] Changelog and deprecation communication published.
- [ ] Anti-regression tests completed.
- [ ] Rollback tested on a safety branch.
- [ ] Release window approved.

## Operational Notes

- If a prerequisite is not verifiable, the row cannot move to `ready`.
- If regressions emerge, postpone cutoff and update the target date in this file.
- This document is the single source of truth for the compatibility decommission timeline.
