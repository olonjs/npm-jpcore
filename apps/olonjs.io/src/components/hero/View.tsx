import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { HeroData, HeroSettings } from './types';

const CODE_LINES = [
  { type: 'p', text: '{' },
  { type: 'k', text: '  "slug"',   after: ': ', val: '"homepage"', comma: ',' },
  { type: 'k', text: '  "meta"',   after: ': ', val: '{ "title": "Acme Corp" }', comma: ',' },
  { type: 'k', text: '  "sections"', after: ': [' },
  { type: 'p', text: '    {' },
  { type: 'k', text: '      "type"', after: ':  ', val: '"hero"', comma: ',' },
  { type: 'k', text: '      "data"', after: ': {' },
  { type: 'k', text: '        "title"', after: ': ', val: '"Ship faster with agents"', comma: ',' },
  { type: 'k', text: '        "cta"',   after: ':   ', val: '"Get started"' },
  { type: 'p', text: '      }' },
  { type: 'p', text: '    },' },
  { type: 'c', text: '    { "type": "features" /* ... */ }' },
  { type: 'p', text: '  ]' },
  { type: 'p', text: '}' },
] as const;

const tokenColor: Record<string, string> = {
  k: 'text-[#84ABFF]',
  s: 'text-[#86efac]',
  c: 'text-[#4b5563]',
  p: 'text-[#9ca3af]',
};

export const Hero: React.FC<{ data: HeroData; settings?: HeroSettings }> = ({ data }) => {
  const primaryCta = data.ctas?.find(c => c.variant === 'primary') ?? data.ctas?.[0];
  const secondaryCta = data.ctas?.find(c => c.variant === 'secondary') ?? data.ctas?.[1];

  return (
    <section className="jp-hero relative pt-[156px] pb-28 text-center overflow-hidden">

      {/* Background glow — absolute, scoped to hero section */}
      <div
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          width: '900px',
          height: '700px',
          background: 'radial-gradient(ellipse at center, rgba(23,99,255,.10) 0%, transparent 68%)',
          top: '-160px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        aria-hidden
      />
      {/* Grid background — absolute, scoped to hero section */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[1040px] mx-auto px-8">

        {/* Eyebrow badge */}
        {data.badge && (
          <div className="inline-flex items-center gap-2 mb-8">
            <Badge
              variant="pill"
              className="gap-2 py-1.5 px-4 text-[12px] tracking-[.05em] font-mono"
              data-jp-field="badge"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                aria-hidden
              />
              {data.badge}
            </Badge>
          </div>
        )}

        {/* Headline */}
        <h1
          className="font-display font-bold tracking-[-0.038em] leading-[1.06] text-foreground mb-2 mx-auto"
          style={{ fontSize: 'clamp(44px, 6.5vw, 74px)', maxWidth: '840px' }}
          data-jp-field="title"
        >
          {data.title}
          {data.titleHighlight && (
            <>
              {' '}
              <span
                className="bg-gradient-to-br from-[#84ABFF] via-[#1763FF] to-[#0F52E0] bg-clip-text text-transparent"
                data-jp-field="titleHighlight"
              >
                {data.titleHighlight}
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        {data.description && (
          <p
            className="text-muted-foreground leading-[1.7] mx-auto mt-6 mb-12"
            style={{ fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: '560px' }}
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="flex items-center justify-center gap-3 flex-wrap mb-0">
            {primaryCta && (
              <Button asChild variant="default" size="lg" className="gap-2 px-7 shadow-[0_0_32px_rgba(23,99,255,.38)]">
                <a
                  href={primaryCta.href}
                  data-jp-item-id={primaryCta.id}
                  data-jp-item-field="ctas"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
                    <rect x="2.5" y="2" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  {primaryCta.label}
                </a>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild variant="outline" size="lg" className="gap-2 px-7">
                <a
                  href={secondaryCta.href}
                  data-jp-item-id={secondaryCta.id}
                  data-jp-item-field="ctas"
                  target={secondaryCta.href?.startsWith('http') ? '_blank' : undefined}
                  rel={secondaryCta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
                    <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2.01 5.71 4.79 6.63.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 8 5.17c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.2 3.47.25.22.48.65.48 1.31v1.94c0 .19.12.4.48.34C12.99 13.71 15 11.09 15 8c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                  </svg>
                  {secondaryCta.label}
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Code window */}
        <div className="mt-[68px] mx-auto" style={{ maxWidth: '540px' }}>
          <div
            className="rounded-xl border border-border text-left overflow-hidden"
            style={{ background: '#060d14', boxShadow: '0 32px 64px rgba(0,0,0,.44), 0 0 0 1px rgba(255,255,255,.04)' }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-card border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="flex-1 text-center font-mono text-[11px] text-muted-foreground/60">
                GET /homepage.json
              </span>
            </div>
            <div className="px-6 py-5 font-mono text-[12.5px] leading-[1.8] overflow-x-auto">
              {CODE_LINES.map((ln, i) => (
                <div key={i}>
                  {ln.type === 'k' ? (
                    <span>
                      <span className={tokenColor.k}>{ln.text}</span>
                      {'after' in ln && <span className={tokenColor.p}>{ln.after}</span>}
                      {'val' in ln && <span className="text-[#86efac]">{ln.val}</span>}
                      {'comma' in ln && <span className={tokenColor.p}>{ln.comma}</span>}
                    </span>
                  ) : ln.type === 'c' ? (
                    <span className={tokenColor.c}>{ln.text}</span>
                  ) : (
                    <span className={tokenColor.p}>{ln.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
