import React from 'react';
import { useInView } from '@/lib/useInView';
import type { ActivitiesGridData, ActivitiesGridSettings } from './types';

export const ActivitiesGrid: React.FC<{ data: ActivitiesGridData; settings?: ActivitiesGridSettings }> = ({ data }) => {
  const sectionRef = useInView<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      style={{
        '--local-bg':         'var(--muted)',
        '--local-surface':    'var(--card)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     '#8FAF3A',
        '--local-border':     'var(--border)',
      } as React.CSSProperties}
      className="sm-reveal relative z-0 py-24 md:py-32 bg-[var(--local-bg)]"
    >
      {/* DECORATIVE BG LEAVES */}
      <div className="absolute top-12 right-8 text-[8rem] opacity-[0.04] select-none pointer-events-none" aria-hidden>
        🌿
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* HEADER */}
        <div className="mb-14">
          {data.label && (
            <div className="jp-section-label flex items-center gap-3 text-[var(--local-primary)] mb-4" data-jp-field="label">
              <span className="w-8 h-px bg-[var(--local-primary)]" aria-hidden />
              {data.label}
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold text-[var(--local-text)] leading-[1.2] tracking-tight max-w-[500px]"
              data-jp-field="title"
            >
              {data.title}
            </h2>
            {data.description && (
              <p className="text-[0.95rem] text-[var(--local-text-muted)] max-w-[420px] leading-[1.8] md:text-right" data-jp-field="description">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.items.map((item, idx) => {
            const delayClass = ['sm-reveal-d1','sm-reveal-d2','sm-reveal-d3','sm-reveal-d4'][idx % 4];
            return (
              <div
                key={item.id ?? idx}
                className={`sm-card ${delayClass} group bg-[var(--local-surface)] border border-[var(--local-border)] rounded-[20px] p-7 flex flex-col gap-3`}
                data-jp-item-id={item.id ?? `legacy-${idx}`}
                data-jp-item-field="items"
              >
                {item.icon && (
                  <div className="w-12 h-12 rounded-xl bg-[rgba(45,80,22,0.07)] flex items-center justify-center text-[1.6rem] mb-1 group-hover:bg-[rgba(45,80,22,0.12)] transition-colors">
                    {item.icon}
                  </div>
                )}
                <h3 className="text-[0.95rem] font-bold text-[var(--local-text)] leading-snug">
                  {item.title}
                </h3>
                <p className="text-[0.85rem] text-[var(--local-text-muted)] leading-[1.7]">
                  {item.description}
                </p>
                {/* BOTTOM ACCENT LINE */}
                <div className="mt-auto pt-4 border-t border-[var(--local-border)]">
                  <div className="w-8 h-0.5 bg-[var(--local-primary)] opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" aria-hidden />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
