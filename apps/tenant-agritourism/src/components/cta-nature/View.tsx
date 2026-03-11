import React from 'react';
import { resolveAssetUrl, useConfig } from '@jsonpages/core';
import type { CtaNatureData, CtaNatureSettings } from './types';
import type { SiteConfig } from '@/types';
import type { HeaderData } from '@/components/header';
import siteData from '@/data/config/site.json';

export const CtaNature: React.FC<{ data: CtaNatureData; settings?: CtaNatureSettings }> = ({ data }) => {
  const { tenantId = 'default' } = useConfig();
  const siteConfig = siteData as unknown as SiteConfig;
  const headerData: HeaderData | undefined =
    siteConfig.header?.type === 'header'
      ? (siteConfig.header.data as HeaderData)
      : undefined;
  const headerLogoPath = headerData?.logoImageUrl?.url?.trim() ?? '';
  const logoUrl = headerLogoPath
    ? resolveAssetUrl(headerLogoPath, tenantId)
    : '';
  const logoAlt = headerData?.logoImageUrl?.alt?.trim() || 'Logo';
  const bg = data.bgImageUrl?.url
    ? resolveAssetUrl(data.bgImageUrl.url, tenantId)
    : 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80';

  return (
    <section
      style={{
        '--local-text':       '#FFFFFF',
        '--local-text-muted': 'rgba(255,255,255,0.8)',
        '--local-primary':    '#8FAF3A',
      } as React.CSSProperties}
      className="relative z-0 py-32 md:py-40 overflow-hidden text-center"
    >
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
        data-jp-field="bgImageUrl"
        aria-hidden
      />
      {/* OVERLAY */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,24,6,0.65) 0%, rgba(10,24,6,0.55) 100%)' }}
        aria-hidden
      />
      {/* TOP LEAF ACCENT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-gradient-to-r from-[var(--local-primary)] to-transparent" aria-hidden />

      <div className="relative max-w-[800px] mx-auto px-8">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={logoAlt}
            className="block w-auto mx-auto mb-6 sm-float object-contain"
            style={{ maxHeight: '30px' }}
          />
        )}

        <h2
          className="font-display text-[clamp(2.5rem,6vw,5rem)] font-black text-[var(--local-text)] leading-[1.05] tracking-tight mb-5"
          data-jp-field="title"
        >
          {data.title}
        </h2>

        {data.subtitle && (
          <p
            className="text-[1.1rem] text-[var(--local-text-muted)] max-w-[540px] mx-auto leading-[1.8] mb-10"
            data-jp-field="subtitle"
          >
            {data.subtitle}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={data.ctaHref}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-[var(--local-primary)] text-[#1A3009] font-bold text-[1rem] hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_8px_32px_rgba(143,175,58,0.4)] no-underline"
            data-jp-field="ctaLabel"
          >
            {data.ctaLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          {data.secondaryLabel && data.secondaryHref && (
            <a
              href={data.secondaryHref}
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full border border-[rgba(255,255,255,0.3)] text-[var(--local-text)] font-semibold text-[1rem] hover:bg-[rgba(255,255,255,0.1)] transition-all backdrop-blur-sm no-underline"
              data-jp-field="secondaryLabel"
            >
              {data.secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
