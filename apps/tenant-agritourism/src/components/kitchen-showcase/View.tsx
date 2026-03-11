import React from 'react';
import { useInView } from '@/lib/useInView';
import type { KitchenShowcaseData, KitchenShowcaseSettings } from './types';

export const KitchenShowcase: React.FC<{ data: KitchenShowcaseData; settings?: KitchenShowcaseSettings }> = ({ data }) => {
  const sectionRef = useInView<HTMLElement>();
  const textRef    = useInView<HTMLDivElement>(0.1);
  const imageRef   = useInView<HTMLDivElement>(0.1);
  const imgUrl     = data.imageUrl?.url || 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=80';
  const imgAlt     = data.imageUrl?.alt || data.imageAlt || data.title;

  return (
    <section
      ref={sectionRef}
      style={{
        '--local-bg':         'var(--background)',
        '--local-surface':    'var(--muted)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-accent':     '#8FAF3A',
        '--local-border':     'var(--border)',
        '--local-warm':       '#8B6A3A',
      } as React.CSSProperties}
      className="relative z-0 py-24 md:py-32 bg-[var(--local-bg)] overflow-hidden"
    >
      {/* BACKGROUND ORGANIC SHAPE */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[45%] opacity-30 pointer-events-none hidden lg:block"
        style={{ background: 'radial-gradient(ellipse at right center, rgba(45,80,22,0.07) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <div ref={textRef} className="sm-reveal sm-reveal-d1">
            {data.label && (
              <div className="jp-section-label flex items-center gap-3 text-[var(--local-primary)] mb-5" data-jp-field="label">
                <span className="w-8 h-px bg-[var(--local-primary)]" aria-hidden />
                {data.label}
              </div>
            )}
            <h2
              className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-bold text-[var(--local-text)] leading-[1.2] tracking-tight mb-4"
              data-jp-field="title"
            >
              {data.title}
            </h2>

            {data.quote && (
              <blockquote
                className="font-display text-[1.2rem] italic text-[var(--local-primary)] border-l-[3px] border-[var(--local-primary)] pl-4 py-1 mb-5"
                data-jp-field="quote"
              >
                {data.quote}
              </blockquote>
            )}

            {data.description && (
              <p className="text-[0.95rem] text-[var(--local-text-muted)] leading-[1.85] mb-8" data-jp-field="description">
                {data.description}
              </p>
            )}

            {data.features && data.features.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {data.features.map((feat, idx) => (
                  <div
                    key={feat.id ?? idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--local-surface)] border border-[var(--local-border)]"
                    data-jp-item-id={feat.id ?? `legacy-${idx}`}
                    data-jp-item-field="features"
                  >
                    {feat.icon && (
                      <span className="text-[1.3rem] flex-shrink-0">{feat.icon}</span>
                    )}
                    <span className="text-[0.8rem] font-medium text-[var(--local-text)]">{feat.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IMAGE */}
          <div ref={imageRef} className="sm-reveal sm-reveal-d2">
            <div className="relative rounded-[24px] overflow-hidden aspect-[3/4] shadow-[0_32px_80px_rgba(45,80,22,0.15)]">
              <img
                src={imgUrl}
                alt={imgAlt}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                loading="lazy"
                data-jp-field="imageUrl"
              />
              {/* OVERLAY LABEL */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[rgba(10,24,6,0.8)] to-transparent">
                <p className="font-display text-white text-[1.1rem] font-bold">
                  Dal campo alla tavola
                </p>
                <p className="text-[rgba(255,255,255,0.7)] text-[0.8rem] mt-1">
                  Prodotti freschi ogni giorno
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
