import { useState, useEffect, useRef } from 'react';
import { OlonMark, OlonWordmark } from '@/components/OlonWordmark';
import { cn } from '@/lib/utils';
import type { DesignSystemData, DesignSystemSettings } from './types';

interface DesignSystemViewProps {
  data: DesignSystemData;
  settings?: DesignSystemSettings;
}

const nav = [
  {
    group: 'Foundation',
    links: [
      { id: 'tokens',     label: 'Tokens' },
      { id: 'colors',     label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing & Radius' },
    ],
  },
  {
    group: 'Identity',
    links: [
      { id: 'mark', label: 'Mark & Logo' },
    ],
  },
  {
    group: 'Components',
    links: [
      { id: 'buttons', label: 'Button' },
      { id: 'badges',  label: 'Badge' },
      { id: 'inputs',  label: 'Input' },
      { id: 'cards',   label: 'Card' },
      { id: 'code',    label: 'Code Block' },
    ],
  },
];

const tokenRows: { group: string; rows: { name: string; varName: string; tw: string; swatch?: boolean }[] }[] = [
  {
    group: 'Backgrounds',
    rows: [
      { name: 'background', varName: '--background', tw: 'bg-background', swatch: true },
      { name: 'card', varName: '--card', tw: 'bg-card', swatch: true },
      { name: 'elevated', varName: '--elevated', tw: 'bg-elevated', swatch: true },
    ],
  },
  {
    group: 'Text',
    rows: [
      { name: 'foreground', varName: '--foreground', tw: 'text-foreground', swatch: true },
      { name: 'muted-foreground', varName: '--muted-foreground', tw: 'text-muted-foreground', swatch: true },
    ],
  },
  {
    group: 'Brand',
    rows: [
      { name: 'primary', varName: '--primary', tw: 'bg-primary / text-primary', swatch: true },
      { name: 'primary-foreground', varName: '--primary-foreground', tw: 'text-primary-foreground', swatch: true },
    ],
  },
  {
    group: 'Accent',
    rows: [
      { name: 'accent', varName: '--accent', tw: 'bg-accent / text-accent', swatch: true },
    ],
  },
  {
    group: 'Border',
    rows: [
      { name: 'border', varName: '--border', tw: 'border-border', swatch: true },
      { name: 'border-strong', varName: '--border-strong', tw: 'border-border-strong', swatch: true },
    ],
  },
  {
    group: 'Feedback',
    rows: [
      { name: 'destructive', varName: '--destructive', tw: 'bg-destructive', swatch: true },
      { name: 'success', varName: '--success', tw: 'bg-success', swatch: true },
      { name: 'warning', varName: '--warning', tw: 'bg-warning', swatch: true },
      { name: 'info', varName: '--info', tw: 'bg-info', swatch: true },
    ],
  },
  {
    group: 'Typography',
    rows: [
      { name: 'font-primary', varName: '--theme-font-primary', tw: 'font-primary' },
      { name: 'font-display', varName: '--theme-font-display', tw: 'font-display' },
      { name: 'font-mono', varName: '--theme-font-mono', tw: 'font-mono' },
    ],
  },
];

const ramp = [
  { stop: '50', varName: '--primary-50', dark: false },
  { stop: '100', varName: '--primary-100', dark: false },
  { stop: '200', varName: '--primary-200', dark: false },
  { stop: '300', varName: '--primary-300', dark: false },
  { stop: '400', varName: '--primary-400', dark: true },
  { stop: '500', varName: '--primary-500', dark: true },
  { stop: '600', varName: '--primary-600', dark: true, brand: true },
  { stop: '700', varName: '--primary-700', dark: true },
  { stop: '800', varName: '--primary-800', dark: true },
  { stop: '900', varName: '--primary-900', dark: true },
] as { stop: string; varName: string; dark: boolean; brand?: boolean }[];

const backgroundSwatches = [
  { label: 'Base', varName: '--background', tw: 'bg-background' },
  { label: 'Surface', varName: '--card', tw: 'bg-card' },
  { label: 'Elevated', varName: '--elevated', tw: 'bg-elevated' },
  { label: 'Border', varName: '--border', tw: 'border-border' },
] as const;

const feedbackSwatches = [
  { label: 'Destructive', bgVarName: '--destructive', fgVarName: '--destructive-foreground' },
  { label: 'Success', bgVarName: '--success', fgVarName: '--success-foreground' },
  { label: 'Warning', bgVarName: '--warning', fgVarName: '--warning-foreground' },
  { label: 'Info', bgVarName: '--info', fgVarName: '--info-foreground' },
] as const;

function readCssVar(varName: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || 'n/a';
}

export function DesignSystemView({ data, settings }: DesignSystemViewProps) {
  const [activeId, setActiveId] = useState('tokens');
  const [cssVars, setCssVars] = useState<Record<string, string>>(settings?.initialCssVars ?? {});
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const allVars = new Set<string>();
    tokenRows.forEach((group) => group.rows.forEach((row) => allVars.add(row.varName)));
    ramp.forEach((item) => allVars.add(item.varName));
    backgroundSwatches.forEach((item) => allVars.add(item.varName));
    allVars.add('--accent');
    feedbackSwatches.forEach((item) => {
      allVars.add(item.bgVarName);
      allVars.add(item.fgVarName);
    });

    const syncVars = () => {
      const next: Record<string, string> = {};
      for (const varName of allVars) next[varName] = readCssVar(varName);
      setCssVars(next);
    };

    syncVars();
    const observer = new MutationObserver(syncVars);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[data-ds-id]');
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.getAttribute('data-ds-id') ?? '');
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border bg-background z-40 overflow-y-auto">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="OlonJS home">
            <OlonMark size={22} />
            <span className="text-lg font-display text-accent tracking-[-0.04em] leading-none">
              {data.title ?? 'Olon'}
            </span>
          </a>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-5">
          {nav.map((section) => (
            <div key={section.group}>
              <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground px-3 mb-2">
                {section.group}
              </div>
              {section.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={cn('nav-link w-full text-left', activeId === link.id && 'active')}
                >
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-border">
          <div className="font-mono-olon text-[11px] text-muted-foreground">
            v1.4 · Labradorite · Merriweather Variable
          </div>
        </div>
      </aside>

      {/* Main */}
      <main ref={mainRef} className="flex-1 lg:ml-60 px-6 lg:px-12 py-12 max-w-4xl">

        {/* Page header */}
        <div className="mb-16">
          <div className="inline-flex items-center text-[11px] font-medium tracking-[0.1em] uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-6">
            Design System
          </div>
          <div className="mb-3">
            <OlonWordmark markSize={64} />
          </div>
          <p className="font-display text-2xl font-normal text-primary-light tracking-[-0.01em] mb-3">
            Design Language
          </p>
          <p className="text-muted-foreground text-[15px] max-w-lg leading-relaxed">
            A contract layer for the agentic web — and a design system built to communicate it.
            Every token, component, and decision is grounded in the concept of the holon:
            whole in itself, part of something greater.
          </p>
        </div>

        <hr className="ds-divider mb-16" />

        {/* TOKENS */}
        <section id="tokens" data-ds-id="tokens" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Token Reference</h2>
            <p className="text-sm text-muted-foreground">
              All tokens defined in{' '}
              <code className="code-inline">theme.json</code>
              {' '}and bridged via{' '}
              <code className="code-inline">index.css</code>.
            </p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-elevated border-b border-border">
                  {['Token', 'CSS var', 'Value', 'Tailwind class'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokenRows.map((group) => (
                  <>
                    <tr key={group.group} className="border-b border-border">
                      <td colSpan={4} className="px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground bg-card">
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.name} className="border-b border-border hover:bg-elevated transition-colors">
                        <td className="px-4 py-3 text-foreground font-medium text-sm">{row.name}</td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-primary-light">{row.varName}</td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-muted-foreground">
                          <span className="flex items-center gap-2">
                            {row.swatch && (
                              <span className="inline-block w-3 h-3 rounded-sm border border-border-strong shrink-0" style={{ background: `var(${row.varName})` }} />
                            )}
                            {cssVars[row.varName] ?? 'n/a'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono-olon text-xs text-accent">{row.tw}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* COLORS */}
        <section id="colors" data-ds-id="colors" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Color System</h2>
            <p className="text-sm text-muted-foreground">Labradorite brand ramp + semantic layer. Dark-first. Every stop has a role.</p>
          </div>
          <div className="mb-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Backgrounds</div>
            <div className="grid grid-cols-4 gap-2">
              {backgroundSwatches.map((s) => (
                <div key={s.label}>
                  <div className="h-14 rounded-md border border-border-strong" style={{ background: `var(${s.varName})` }} />
                  <div className="mt-2">
                    <div className="text-xs font-medium text-foreground">{s.label}</div>
                    <div className="font-mono-olon text-[11px] text-muted-foreground">{cssVars[s.varName] ?? 'n/a'}</div>
                    <div className="font-mono-olon text-[10px] text-primary-light">{s.tw}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Brand Ramp — Labradorite</div>
            <div className="flex rounded-lg overflow-hidden h-16 border border-border">
              {ramp.map((s) => (
                <div key={s.stop} className="flex-1 flex flex-col justify-end p-1.5 relative" style={{ background: `var(${s.varName})` }}>
                  <span className="font-mono-olon text-[9px] font-medium" style={{ color: s.dark ? '#EDE8F8' : '#3D2770' }}>
                    {s.stop}
                  </span>
                  {s.brand && (
                    <span className="absolute top-1 right-1 text-[8px] font-medium text-primary-200 font-mono-olon">brand</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Accent — Parchment</div>
              <div className="h-14 rounded-md border border-border" style={{ background: 'var(--accent)' }} />
              <div className="mt-2">
                <div className="text-xs font-medium text-foreground">Accent</div>
                <div className="font-mono-olon text-[11px] text-muted-foreground">{cssVars['--accent'] ?? 'n/a'}</div>
                <div className="font-mono-olon text-[10px] text-primary-light">text-accent</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">Feedback</div>
              <div className="space-y-2">
                {feedbackSwatches.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 px-3 py-2 rounded-md" style={{ background: `var(${f.bgVarName})` }}>
                    <span className="text-[12px] font-medium" style={{ color: `var(${f.fgVarName})` }}>{f.label}</span>
                    <span className="font-mono-olon text-[10px] ml-auto" style={{ color: `var(${f.fgVarName})` }}>
                      {cssVars[f.bgVarName] ?? 'n/a'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* TYPOGRAPHY */}
        <section id="typography" data-ds-id="typography" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Typography</h2>
            <p className="text-sm text-muted-foreground">Three typefaces, three voices. Built on contrast.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">Display · font-display</div>
                <div className="text-sm font-medium text-foreground">Merriweather Variable</div>
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm">Google Fonts</span>
            </div>
            <div className="space-y-4 border-t border-border pt-5">
              <div className="font-display text-5xl font-normal text-foreground leading-none">The contract layer</div>
              <div className="font-display text-3xl font-normal text-primary-light leading-tight italic">for the agentic web.</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">UI · font-primary</div>
                <div className="text-sm font-medium text-foreground">Geist</div>
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm">400 · 500</span>
            </div>
            <div className="border-t border-border pt-5">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><div className="text-[10px] text-muted-foreground mb-2">15px / 400</div><div className="text-foreground">Machine-readable endpoints.</div></div>
                <div><div className="text-[10px] text-muted-foreground mb-2">13px / 500</div><div className="text-[13px] font-medium text-foreground">Schema contracts.</div></div>
                <div><div className="text-[10px] text-muted-foreground mb-2">11px / 400 · muted</div><div className="text-[11px] text-muted-foreground">Governance, audit.</div></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1">Code · font-mono</div>
                <div className="text-sm font-medium text-foreground">Geist Mono</div>
              </div>
            </div>
            <div className="border-t border-border pt-5 space-y-1.5">
              <div className="font-mono-olon text-sm"><span className="syntax-keyword">import</span> <span className="text-accent">Olon</span> <span className="syntax-keyword">from</span> <span className="syntax-string">'olonjs'</span></div>
              <div className="font-mono-olon text-sm text-muted-foreground"><span className="syntax-keyword">const</span> <span className="text-foreground">page</span> = <span className="text-accent">Olon</span>.<span className="text-primary-light">contract</span>(<span className="syntax-string">'/about.json'</span>)</div>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* SPACING & RADIUS */}
        <section id="spacing" data-ds-id="spacing" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Spacing & Radius</h2>
            <p className="text-sm text-muted-foreground">Radius scale is deliberate — corners communicate hierarchy.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { token: 'radius-sm · 4px',  r: 4,  desc: 'Badges, tags, chips.' },
              { token: 'radius-md · 8px',  r: 8,  desc: 'Inputs, buttons, inline.' },
              { token: 'radius-lg · 12px', r: 12, desc: 'Cards, panels, modals.' },
            ].map((item) => (
              <div key={item.r} className="rounded-lg border border-border bg-card p-5">
                <div className="w-full h-14 border border-primary bg-primary-900 mb-4" style={{ borderRadius: item.r }} />
                <div className="font-mono-olon text-xs text-primary-light mb-1">{item.token}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* MARK & LOGO */}
        <section id="mark" data-ds-id="mark" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Mark & Logo</h2>
            <p className="text-sm text-muted-foreground">The mark is a holon: a nucleus held inside a ring. Two circles, one concept.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Mark · Dark</div>
              <OlonMark size={64} />
            </div>
            <div className="rounded-lg border border-border bg-elevated p-8 flex flex-col items-center gap-4">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Mark · Mono</div>
              <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="38" stroke="#F2EDE6" strokeWidth="20" />
                <circle cx="50" cy="50" r="15" fill="#F2EDE6" />
              </svg>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground">Logo Lockups</div>
            <div>
              <div className="text-xs text-muted-foreground mb-3">Standard (nav, sidebar ≥ 18px)</div>
              <OlonWordmark markSize={36} />
            </div>
            <div className="border-t border-border pt-5">
              <div className="text-xs text-muted-foreground mb-3">Hero display (marketing · ≥ 48px)</div>
              <OlonWordmark markSize={64} />
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* BUTTON */}
        <section id="buttons" data-ds-id="buttons" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Button</h2>
            <p className="text-sm text-muted-foreground">Five variants. All use semantic tokens — no hardcoded colors.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            {[
              {
                label: 'Default (primary)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">Get started</button>,
                ],
              },
              {
                label: 'Accent (CTA)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity">Get started →</button>,
                ],
              },
              {
                label: 'Secondary (outline)',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-primary-light border border-primary rounded-md hover:bg-primary-900 transition-colors">Documentation</button>,
                  <button key="2" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-foreground border border-border rounded-md hover:bg-elevated transition-colors">View on GitHub</button>,
                ],
              },
              {
                label: 'Ghost',
                buttons: [
                  <button key="1" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors">Cancel</button>,
                ],
              },
            ].map((group, i, arr) => (
              <div key={group.label} className={i < arr.length - 1 ? 'border-b border-border pb-6' : ''}>
                <div className="text-xs text-muted-foreground mb-4">{group.label}</div>
                <div className="flex flex-wrap gap-3">{group.buttons}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* BADGE */}
        <section id="badges" data-ds-id="badges" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Badge</h2>
            <p className="text-sm text-muted-foreground">Status, versioning, feature flags. Small but precise.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm">Stable</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-200 border border-primary-800 rounded-sm">OSS</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-sm">v1.4</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary text-primary-foreground rounded-sm">New</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success-indicator inline-block" />
                Deployed
              </span>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* INPUT */}
        <section id="inputs" data-ds-id="inputs" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Input</h2>
            <p className="text-sm text-muted-foreground">Form elements. Precision over decoration.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Tenant slug</label>
              <input type="text" placeholder="my-tenant" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Schema version <span className="text-destructive-foreground ml-1">Invalid format</span>
              </label>
              <input type="text" defaultValue="1.x.x" className="w-full px-3 py-2 text-sm bg-background border border-destructive-border rounded-md text-foreground focus:outline-none focus:border-destructive-ring focus:ring-1 focus:ring-destructive-ring transition-colors" />
              <p className="mt-1.5 text-xs text-destructive-foreground">Must follow semver (e.g. 1.4.0)</p>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* CARD */}
        <section id="cards" data-ds-id="cards" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Card</h2>
            <p className="text-sm text-muted-foreground">The primary container primitive. Three elevation levels.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">Default · bg-card</div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">JsonPages contract</div>
                  <div className="text-xs text-muted-foreground">Tenant: acme-corp · 4 routes · Last sync 2m ago</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm">Active</span>
              </div>
            </div>
            <div className="rounded-lg border border-border-strong bg-elevated p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">Elevated · bg-elevated</div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-primary-900 border border-primary flex items-center justify-center shrink-0">
                  <OlonMark size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">OlonJS Enterprise</div>
                  <div className="text-xs text-muted-foreground mt-0.5">NX monorepo · Private cloud · SOC2 ready</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-primary bg-primary-900 p-5">
              <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-primary-light mb-4">Accent · border-primary bg-primary-900</div>
              <div className="font-display text-lg font-normal text-foreground mb-2">
                Ship your first tenant in hours,<br />
                <em className="not-italic text-accent">not weeks.</em>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Start building →
              </button>
            </div>
          </div>
        </section>

        <hr className="ds-divider mb-16" />

        {/* CODE BLOCK */}
        <section id="code" data-ds-id="code" className="section-anchor mb-16">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-foreground mb-1">Code Block</h2>
            <p className="text-sm text-muted-foreground">Developer-first. Syntax highlighting uses brand ramp stops only.</p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-elevated border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              </div>
              <span className="font-mono-olon text-[11px] text-muted-foreground">olon.config.ts</span>
              <button className="font-mono-olon text-[11px] text-muted-foreground hover:text-foreground transition-colors">Copy</button>
            </div>
            <div className="bg-card px-5 py-5 overflow-x-auto">
              <pre className="font-mono-olon text-sm leading-relaxed">
                <code>
                  <span className="syntax-keyword">import</span>{' '}
                  <span className="text-foreground">{'{ defineConfig }'}</span>{' '}
                  <span className="syntax-keyword">from</span>{' '}
                  <span className="syntax-string">'olonjs'</span>
                  {'\n\n'}
                  <span className="syntax-keyword">export default</span>{' '}
                  <span className="syntax-value">defineConfig</span>
                  <span className="text-foreground">{'({'}</span>
                  {'\n  '}
                  <span className="syntax-property">tenants</span>
                  <span className="text-foreground">{': [{'}</span>
                  {'\n    '}
                  <span className="syntax-property">slug</span>
                  <span className="text-foreground">{': '}</span>
                  <span className="syntax-string">'olon-ds'</span>
                  {'\n  '}
                  <span className="text-foreground">{'}]'}</span>
                  {'\n'}
                  <span className="text-foreground">{'}'}</span>
                </code>
              </pre>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
