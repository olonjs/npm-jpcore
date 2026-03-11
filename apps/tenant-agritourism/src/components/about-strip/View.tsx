import React from 'react';
import { useInView } from '@/lib/useInView';
import type { AboutStripData, AboutStripSettings } from './types';

export const AboutStrip: React.FC<{ data: AboutStripData; settings?: AboutStripSettings }> = ({ data }) => {
  const sectionRef  = useInView<HTMLElement>();
  const textRef     = useInView<HTMLDivElement>(0.1);
  const imageRef    = useInView<HTMLDivElement>(0.1);
  const isImgLeft   = data.imagePosition === 'left';
  const imgUrl      = data.imageUrl?.url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80';
  const imgAlt      = data.imageUrl?.alt || data.imageAlt || data.title;

  return (
    <section
      ref={sectionRef}
      style={{
        '--local-bg':         'var(--background)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-surface':    'var(--muted)',
        '--local-border':     'var(--border)',
        '--local-accent':     '#8FAF3A',
      } as React.CSSProperties}
      className="relative z-0 py-24 md:py-32 bg-[var(--local-bg)]"
    >
      {/* TOP DIVIDER */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-px bg-gradient-to-r from-transparent via-[var(--local-border)] to-transparent" aria-hidden />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isImgLeft ? '' : ''}`}>

          {/* IMAGE */}
          <div
            ref={imageRef}
            className={`sm-reveal sm-reveal-d1 relative ${isImgLeft ? 'order-first lg:order-first' : 'order-first lg:order-last'}`}
          >
            <div className="relative rounded-[24px] overflow-hidden aspect-[4/3] shadow-[0_24px_80px_rgba(45,80,22,0.15)]">
              <img
                src={imgUrl}
                alt={imgAlt}
                className="w-full h-full object-cover sm-gallery-item"
                loading="lazy"
                data-jp-field="imageUrl"
              />
              {/* ACCENT BLOCK */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--local-primary)] to-[var(--local-accent)]"
                aria-hidden
              />
            </div>
            {/* DECORATIVE DOT PATTERN */}
            <div
              className="absolute -bottom-6 -right-6 w-24 h-24 opacity-20 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', backgroundSize: '8px 8px' }}
              aria-hidden
            />
          </div>

          {/* TEXT */}
          <div
            ref={textRef}
            className={`sm-reveal sm-reveal-d2 ${isImgLeft ? 'order-last lg:order-last' : 'order-last lg:order-first'}`}
          >
            {data.label && (
              <div className="jp-section-label flex items-center gap-3 text-[var(--local-primary)] mb-5" data-jp-field="label">
                <span className="w-8 h-px bg-[var(--local-primary)]" aria-hidden />
                {data.label}
              </div>
            )}
            <h2
              className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-bold text-[var(--local-text)] leading-[1.2] tracking-tight mb-5"
              data-jp-field="title"
            >
              {data.title}
            </h2>
            {data.description && (
              <p className="text-[1.05rem] text-[var(--local-text-muted)] leading-[1.8] mb-8" data-jp-field="description">
                {data.description}
              </p>
            )}
            {data.bullets && data.bullets.length > 0 && (
              <ul className="flex flex-col gap-3">
                {data.bullets.map((b, idx) => (
                  <li
                    key={b.id ?? idx}
                    className="flex items-start gap-3 text-[0.95rem] text-[var(--local-text-muted)]"
                    data-jp-item-id={b.id ?? `legacy-${idx}`}
                    data-jp-item-field="bullets"
                  >
                    <span className="mt-1.5 w-5 h-5 flex-shrink-0 rounded-full bg-[rgba(45,80,22,0.1)] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
