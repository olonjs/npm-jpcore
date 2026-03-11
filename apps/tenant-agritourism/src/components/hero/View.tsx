import React from 'react';
import type { HeroData, HeroSettings } from './types';

export const Hero: React.FC<{ data: HeroData; settings?: HeroSettings }> = ({ data }) => {
  const bg = data.bgImageUrl?.url || 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80';

  return (
    <section
      style={{
        '--local-text':       '#FFFFFF',
        '--local-text-muted': 'rgba(255,255,255,0.75)',
        '--local-primary':    '#8FAF3A',
        '--local-accent':     '#2D5016',
      } as React.CSSProperties}
      className="relative z-0 min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* BG IMAGE */}
      <div
        className="absolute inset-0 sm-hero-bg bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
        data-jp-field="bgImageUrl"
        aria-hidden
      />
      {/* GRADIENT OVERLAY */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,24,6,0.55) 0%, rgba(10,24,6,0.35) 40%, rgba(10,24,6,0.65) 100%)' }}
        aria-hidden
      />
      {/* NOISE */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        aria-hidden
      />

      {/* CONTENT */}
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 pt-28 pb-24 flex flex-col items-start">

        {data.badge && (
          <div
            className="sm-hero-t1 inline-flex items-center gap-2 bg-[rgba(255,255,255,0.12)] backdrop-blur-sm border border-[rgba(255,255,255,0.2)] rounded-full px-4 py-1.5 mb-6"
            data-jp-field="badge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--local-primary)] sm-pulse-dot" />
            <span className="text-[0.75rem] font-semibold text-[var(--local-text)] uppercase tracking-wider">
              {data.badge}
            </span>
          </div>
        )}

        <h1
          className="sm-hero-t2 font-display text-[clamp(3rem,8vw,7rem)] font-black text-[var(--local-text)] leading-[1.0] tracking-tight mb-2"
          data-jp-field="title"
        >
          {data.title}
        </h1>
        {data.titleHighlight && (
          <h1
            className="sm-hero-t3 font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[1.0] tracking-tight mb-6"
            style={{ color: 'var(--local-primary)', WebkitTextStroke: '1px rgba(143,175,58,0.4)' }}
            data-jp-field="titleHighlight"
          >
            {data.titleHighlight}
          </h1>
        )}

        {data.description && (
          <p
            className="sm-hero-t3 text-[1.1rem] text-[var(--local-text-muted)] max-w-[560px] leading-[1.8] mb-10"
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {data.ctas && data.ctas.length > 0 && (
          <div className="sm-hero-t4 flex flex-wrap gap-4">
            {data.ctas.map((cta, idx) => (
              <a
                key={cta.id ?? idx}
                href={cta.href}
                data-jp-item-id={cta.id ?? `legacy-${idx}`}
                data-jp-item-field="ctas"
                className={[
                  'inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[0.95rem] transition-all duration-300 no-underline',
                  cta.variant === 'primary'
                    ? 'bg-[var(--local-primary)] text-[#1A3009] hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(143,175,58,0.35)]'
                    : 'bg-[rgba(255,255,255,0.12)] text-[var(--local-text)] border border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.2)] backdrop-blur-sm',
                ].join(' ')}
              >
                {cta.label}
                {cta.variant === 'primary' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* SCROLL INDICATOR */}
      {data.scrollLabel && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm-hero-t4">
          <span className="text-[0.7rem] font-medium text-[var(--local-text-muted)] uppercase tracking-[0.15em]">
            {data.scrollLabel}
          </span>
          <div className="sm-scroll-bounce text-[var(--local-text-muted)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
    </section>
  );
};
