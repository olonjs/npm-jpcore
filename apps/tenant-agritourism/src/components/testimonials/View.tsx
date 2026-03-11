import React from 'react';
import { useInView } from '@/lib/useInView';
import type { TestimonialsData, TestimonialsSettings } from './types';

const Stars: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="text-[var(--local-accent)]">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round"/>
      </svg>
    ))}
  </div>
);

export const Testimonials: React.FC<{ data: TestimonialsData; settings?: TestimonialsSettings }> = ({ data }) => {
  const sectionRef = useInView<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      style={{
        '--local-bg':         'var(--background)',
        '--local-surface':    'var(--card)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     '#8FAF3A',
        '--local-border':     'var(--border)',
      } as React.CSSProperties}
      className="sm-reveal relative z-0 py-24 md:py-32 bg-[var(--local-bg)]"
    >
      {/* ORGANIC SHAPE TOP */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--local-border)] to-transparent" aria-hidden />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* HEADER */}
        <div className="text-center mb-14">
          {data.label && (
            <div className="jp-section-label inline-flex items-center gap-3 text-[var(--local-primary)] mb-4" data-jp-field="label">
              <span className="w-6 h-px bg-[var(--local-primary)]" aria-hidden />
              {data.label}
              <span className="w-6 h-px bg-[var(--local-primary)]" aria-hidden />
            </div>
          )}
          <h2
            className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold text-[var(--local-text)] leading-[1.2] tracking-tight"
            data-jp-field="title"
          >
            {data.title}
          </h2>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((item, idx) => {
            const delayClass = ['sm-reveal-d1','sm-reveal-d2','sm-reveal-d3'][idx % 3];
            return (
              <div
                key={item.id ?? idx}
                className={`sm-card ${delayClass} bg-[var(--local-surface)] border border-[var(--local-border)] rounded-[20px] p-8 flex flex-col gap-5`}
                data-jp-item-id={item.id ?? `legacy-${idx}`}
                data-jp-item-field="items"
              >
                <Stars count={item.rating} />

                {/* QUOTE MARK */}
                <div className="font-display text-[3rem] leading-none text-[var(--local-primary)] opacity-20 select-none" aria-hidden>
                  "
                </div>

                <blockquote className="text-[0.95rem] text-[var(--local-text-muted)] leading-[1.8] italic flex-1 -mt-4">
                  {item.quote}
                </blockquote>

                <div className="border-t border-[var(--local-border)] pt-5 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[0.8rem] font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, var(--primary) 0%, #4A7A22 100%)` }}
                    aria-hidden
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-[var(--local-text)]">{item.name}</p>
                    {item.location && (
                      <p className="text-[0.75rem] text-[var(--local-text-muted)]">{item.location}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
