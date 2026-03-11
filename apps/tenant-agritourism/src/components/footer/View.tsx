import React, { useEffect, useState } from 'react';
import { resolveAssetUrl, useConfig } from '@jsonpages/core';
import type { FooterData, FooterSettings } from './types';

export const Footer: React.FC<{ data: FooterData; settings?: FooterSettings }> = ({ data }) => {
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const { tenantId = 'default' } = useConfig();
  const footerLogoPath = data.logoImageUrl?.url?.trim() ?? '';
  const footerLogoUrl = footerLogoPath ? resolveAssetUrl(footerLogoPath, tenantId) : '';
  const footerLogoAlt = data.logoImageUrl?.alt?.trim() || data.brandText || 'Logo';
  const shouldShowLogoText = data.showLogoText ?? true;
  const resolvedLogoMaxHeight = Number.isFinite(Number(data.logoMaxHeight)) ? Number(data.logoMaxHeight) : 30;
  const logoMaxHeight = Math.min(30, Math.max(10, resolvedLogoMaxHeight));
  const showFooterLogoImage = footerLogoUrl.length > 0 && !logoLoadFailed;

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [footerLogoUrl]);

  return (
    <footer
      style={{
        '--local-bg':         '#1A3009',
        '--local-surface':    '#243D11',
        '--local-text':       '#E8EDE4',
        '--local-text-muted': '#8FAF7A',
        '--local-primary':    '#8FAF3A',
        '--local-border':     'rgba(143,175,58,0.15)',
      } as React.CSSProperties}
      className="relative z-0 bg-[var(--local-bg)]"
    >
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* BRAND */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {showFooterLogoImage ? (
                <img
                  src={footerLogoUrl}
                  alt={footerLogoAlt}
                  className="block w-auto object-contain"
                  style={{ maxHeight: `${logoMaxHeight}px` }}
                  data-jp-field="logoImageUrl"
                  onError={() => setLogoLoadFailed(true)}
                />
              ) : null}
              {shouldShowLogoText ? (
                <span className="font-display text-[1.2rem] font-bold text-[var(--local-text)]" data-jp-field="brandText">
                  {data.brandText}
                  {data.brandHighlight && (
                    <span className="text-[var(--local-primary)]">{data.brandHighlight}</span>
                  )}
                </span>
              ) : null}
            </div>
            {data.tagline && (
              <p className="text-[0.875rem] text-[var(--local-text-muted)] leading-relaxed" data-jp-field="tagline">
                {data.tagline}
              </p>
            )}
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[var(--local-primary)] mb-4">
              Esplora
            </h4>
            <nav className="flex flex-col gap-2">
              {(data.links ?? []).map((link, idx) => (
                <a
                  key={link.id ?? idx}
                  href={link.href}
                  className="text-[0.875rem] text-[var(--local-text-muted)] hover:text-[var(--local-text)] transition-colors no-underline"
                  data-jp-item-id={link.id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* CONTATTI */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[var(--local-primary)] mb-4">
              Dove siamo
            </h4>
            <p className="text-[0.875rem] text-[var(--local-text-muted)] leading-relaxed">
              Masseria S. Mamma<br/>
              Via Nazionale<br/>
              98070 Acquedolci (ME)<br/>
              Sicilia, Italia
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-[var(--local-border)] flex flex-col md:flex-row items-center justify-between gap-2 text-[0.75rem] text-[var(--local-text-muted)]">
          {data.copyright && (
            <p data-jp-field="copyright">{data.copyright}</p>
          )}
          {data.vatLabel && (
            <p data-jp-field="vatLabel">{data.vatLabel}</p>
          )}
        </div>
      </div>
    </footer>
  );
};
