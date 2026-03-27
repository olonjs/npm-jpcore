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
