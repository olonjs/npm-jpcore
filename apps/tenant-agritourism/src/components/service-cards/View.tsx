import React from 'react';
import { useInView } from '@/lib/useInView';
import type { ServiceCardsData, ServiceCardsSettings } from './types';

export const ServiceCards: React.FC<{ data: ServiceCardsData; settings?: ServiceCardsSettings }> = ({ data }) => {
  const headerRef = useInView<HTMLDivElement>();
  const gridRef   = useInView<HTMLDivElement>(0.05);

  return (
    <section
      style={{
        '--local-bg':         'var(--muted)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-surface':    'var(--card)',
        '--local-primary':    'var(--primary)',
        '--local-border':     'var(--border)',
        '--local-accent':     '#8FAF3A',
      } as React.CSSProperties}
      className="relative z-0 py-24 md:py-32 bg-[var(--local-bg)]"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* HEADER */}
        <div ref={headerRef} className="sm-reveal text-center mb-16">
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-3 text-[var(--local-primary)] mb-4" data-jp-field="label">
              <span className="w-6 h-px bg-[var(--local-primary)]" aria-hidden />
              {data.label}
              <span className="w-6 h-px bg-[var(--local-primary)]" aria-hidden />
            </div>
          )}
          <h2
            className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold text-[var(--local-text)] leading-[1.2] tracking-tight mb-4"
            data-jp-field="title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p className="text-[1rem] text-[var(--local-text-muted)] max-w-[520px] mx-auto leading-[1.8]" data-jp-field="description">
              {data.description}
            </p>
          )}
        </div>

        {/* GRID */}
        <div ref={gridRef} className="sm-reveal sm-reveal-d1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.cards.map((card, idx) => {
            const delayClass = ['sm-reveal-d1','sm-reveal-d2','sm-reveal-d3','sm-reveal-d4'][idx % 4];
            return (
              <div
                key={card.id ?? idx}
                className={`sm-card group relative bg-[var(--local-surface)] border border-[var(--local-border)] rounded-[20px] p-8 flex flex-col gap-4 hover:border-[rgba(45,80,22,0.25)] ${delayClass}`}
                data-jp-item-id={card.id ?? `legacy-${idx}`}
                data-jp-item-field="cards"
              >
                {/* TOP ACCENT on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--local-primary)] to-[var(--local-accent)] rounded-t-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />

                {card.emoji && (
                  <span className="text-[2.5rem] leading-none block sm-float" style={{ animationDelay: `${idx * 0.3}s` }}>
                    {card.emoji}
                  </span>
                )}

                <h3 className="text-[1.05rem] font-bold text-[var(--local-text)] leading-snug">
                  {card.title}
                </h3>
                <p className="text-[0.875rem] text-[var(--local-text-muted)] leading-[1.75] flex-1">
                  {card.description}
                </p>

                {card.href && (
                  <a
                    href={card.href}
                    className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--local-primary)] group-hover:gap-2.5 transition-all no-underline"
                  >
                    Scopri
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
