import React from 'react';
import { useInView } from '@/lib/useInView';
import type { PricingTableData, PricingTableSettings } from './types';

export const PricingTable: React.FC<{ data: PricingTableData; settings?: PricingTableSettings }> = ({ data }) => {
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
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">

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
            className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold text-[var(--local-text)] leading-[1.2] tracking-tight mb-4"
            data-jp-field="title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p className="text-[0.95rem] text-[var(--local-text-muted)] max-w-[520px] mx-auto leading-[1.8]" data-jp-field="description">
              {data.description}
            </p>
          )}
        </div>

        {/* PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.plans.map((plan, idx) => (
            <div
              key={plan.id ?? idx}
              className={[
                'sm-card relative rounded-[24px] p-8 flex flex-col gap-5 border transition-all',
                plan.featured
                  ? 'bg-[var(--local-primary)] border-[var(--local-primary)] shadow-[0_20px_60px_rgba(45,80,22,0.3)]'
                  : 'bg-[var(--local-surface)] border-[var(--local-border)]',
              ].join(' ')}
              data-jp-item-id={plan.id ?? `legacy-${idx}`}
              data-jp-item-field="plans"
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#8FAF3A] text-[#1A3009] text-[0.65rem] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg">
                    Più scelto
                  </span>
                </div>
              )}

              <div>
                <h3 className={`text-[0.8rem] font-black uppercase tracking-wider mb-2 ${plan.featured ? 'text-[rgba(255,255,255,0.7)]' : 'text-[var(--local-text-muted)]'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1">
                  <span className={`font-display text-[3.5rem] font-black leading-none ${plan.featured ? 'text-white' : 'text-[var(--local-text)]'}`}>
                    €{plan.price}
                  </span>
                </div>
                {plan.period && (
                  <p className={`text-[0.78rem] mt-1 ${plan.featured ? 'text-[rgba(255,255,255,0.65)]' : 'text-[var(--local-text-muted)]'}`}>
                    {plan.period}
                  </p>
                )}
              </div>

              {plan.description && (
                <p className={`text-[0.875rem] leading-relaxed border-t pt-4 ${plan.featured ? 'text-[rgba(255,255,255,0.75)] border-[rgba(255,255,255,0.15)]' : 'text-[var(--local-text-muted)] border-[var(--local-border)]'}`}>
                  {plan.description}
                </p>
              )}

              {plan.features && plan.features.length > 0 && (
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className={`flex items-start gap-2.5 text-[0.85rem] ${plan.featured ? 'text-[rgba(255,255,255,0.85)]' : 'text-[var(--local-text-muted)]'}`}>
                      <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.featured ? '#8FAF3A' : 'var(--primary)'} strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              )}

              {plan.ctaLabel && plan.ctaHref && (
                <a
                  href={plan.ctaHref}
                  className={[
                    'mt-2 block text-center py-3.5 rounded-full font-bold text-[0.9rem] transition-all no-underline',
                    plan.featured
                      ? 'bg-white text-[var(--local-primary)] hover:bg-[#F2F0E8]'
                      : 'bg-[var(--local-primary)] text-white hover:brightness-110',
                  ].join(' ')}
                >
                  {plan.ctaLabel}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
