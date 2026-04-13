// Layout: Hero=FULLSCREEN CINEMATIC, Features=N/A
import React from 'react';
import { Button } from '@/components/ui/button';
import type { HeroSectionData, HeroSectionSettings } from './types';

export const HeroSection: React.FC<{ data: HeroSectionData; settings: HeroSectionSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-primary-foreground': 'var(--primary-foreground)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'var(--border)',
        '--local-radius-md': 'var(--theme-radius-md)',
      } as React.CSSProperties}
      className="relative z-0 min-h-screen flex items-center justify-center bg-[var(--local-bg)] overflow-hidden"
    >
      {/* Background Image */}
      {data.heroImage?.url && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${data.heroImage.url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      )}

      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--local-accent)_15%,transparent)_35%,transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {data.label && (
          <div className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white/90 mb-6 jp-animate-in" data-jp-field="label">
            <span className="w-8 h-px bg-white/60" />
            {data.label}
            <span className="w-8 h-px bg-white/60" />
          </div>
        )}

        <h1 className="font-display font-black text-[clamp(3rem,6vw,5.5rem)] leading-[1.0] tracking-tight text-white mb-6 jp-animate-in jp-d1" data-jp-field="title">
          {data.title}
          {data.titleHighlight && (
            <>
              {' '}
              <em className="not-italic bg-gradient-to-br from-[var(--local-accent)] to-orange-300 bg-clip-text text-transparent" data-jp-field="titleHighlight">
                {data.titleHighlight}
              </em>
            </>
          )}
        </h1>

        <p className="text-xl leading-relaxed text-white/90 max-w-2xl mx-auto mb-8 jp-animate-in jp-d2" data-jp-field="description">
          {data.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center jp-animate-in jp-d3">
          <Button
            asChild
            variant="default"
            size="lg"
            className="bg-[var(--local-primary)] text-[var(--local-primary-foreground)] hover:opacity-90 px-8 py-4 text-base font-semibold rounded-[var(--local-radius-md)]"
          >
            <a href={data.primaryCta.href}>{data.primaryCta.label}</a>
          </Button>

          {data.secondaryCta && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base font-semibold rounded-[var(--local-radius-md)]"
            >
              <a href={data.secondaryCta.href}>{data.secondaryCta.label}</a>
            </Button>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70">
        <span className="text-xs uppercase tracking-widest">Scopri di più</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

