import type { OlonHeroData } from './types';
import { Button } from '@/components/ui/button';
import { Github, Terminal } from 'lucide-react';
import { resolveAssetUrl, useConfig } from '@olonjs/core';

interface Props {
  data: OlonHeroData;
}

const heroPlugImage = '/assets/images/plug-graded-square.jpg';

function hasRenderableCta(cta: { label?: string; href?: string } | undefined): cta is { label: string; href: string } {
  return Boolean(cta?.label?.trim() && cta?.href?.trim());
}

export function OlonHeroView({ data }: Props) {
  const { tenantId = 'default' } = useConfig();
  const imageUrl = data.image?.url ? resolveAssetUrl(data.image.url, tenantId) : heroPlugImage;

  return (
    <section
      style={{
        '--local-bg':      'var(--background)',
        '--local-fg':      'var(--foreground)',
        '--local-muted':   'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-p300':    'var(--primary-light)',
      } as React.CSSProperties}
      className="relative min-h-screen bg-[var(--local-bg)] text-[var(--local-fg)] pt-36 pb-24 overflow-hidden"
      data-jp-section-id={data.id}
      data-jp-section-type="olon-hero"
    >
      {/* Dawn background — absolute, behind content */}
    

      {/* Content — relative, above background */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <p
              className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)]"
              data-jp-field="eyebrow"
            >
              {data.eyebrow}
            </p>
            <div className="flex items-center gap-2">
              <a href="https://www.npmjs.com/package/@olonjs/core">
                <img src="https://img.shields.io/npm/v/@olonjs/core?color=blue&style=flat-square" alt="npm version"/>
              </a>
              <a href="https://github.com/olonjs/npm-jpcore/blob/main/LICENSE">
                <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license"/>
              </a>
            </div>
          </div>

          <div>
            <h1
              className="text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] text-foreground"
              data-jp-field="headline"
            >
              {data.headline}
            </h1>
            <p
              className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.1] text-[var(--local-p300)] italic mt-1"
              data-jp-field="subline"
            >
              {data.subline}
            </p>
          </div>

          <p
            className="text-base text-[var(--local-muted)] leading-relaxed max-w-lg"
            data-jp-field="body"
          >
            {data.body}
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            {hasRenderableCta(data.primaryCta) && (
              <div data-jp-field="primaryCta">
                <Button asChild size="lg" className="font-semibold">
                  <a href={data.primaryCta.href}>
                    {data.primaryCta.label} →
                  </a>
                </Button>
              </div>
            )}
            {hasRenderableCta(data.secondaryCta) && (
              <div data-jp-field="secondaryCta">
                <Button asChild variant="outline" size="lg" className="font-semibold gap-2">
                  <a href={data.secondaryCta.href}>
                    <Github className="w-4 h-4" />
                    {data.secondaryCta.label}
                  </a>
                </Button>
              </div>
            )}
            {hasRenderableCta(data.ghostCta) && (
              <div data-jp-field="ghostCta">
                <a
                  href={data.ghostCta.href}
                  className="text-sm text-[var(--local-muted)] hover:text-[var(--local-fg)] transition-colors flex items-center gap-1.5"
                >
                  {data.ghostCta.label}
                  <Terminal className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right: branded product photo */}
        <div className="hidden md:flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-lg pointer-events-auto">
            <div className="absolute inset-[-8%] bg-[radial-gradient(circle_at_50%_50%,rgba(52,109,255,0.22),rgba(12,17,22,0)_70%)] blur-2xl pointer-events-none" />
            <div className="relative aspect-[1/1.03] overflow-hidden rounded-none border border-white/14 bg-[#0d1219] shadow-[0_22px_56px_rgba(4,8,20,0.42)] pointer-events-auto">
              <img
                src={imageUrl}
                alt={data.image?.alt ?? "Olon interface port engraved into a dark stone surface"}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: '50% 50%' }}
                data-jp-field="image"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,21,0.02)_0%,rgba(7,11,21,0.14)_24%,rgba(7,11,21,0.44)_100%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_44%,rgba(122,163,255,0.18),rgba(29,78,216,0.08)_24%,rgba(12,17,22,0)_54%)] mix-blend-screen pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
