import React, { useState, useEffect } from 'react';
import { resolveAssetUrl, useConfig } from '@jsonpages/core';
import type { HeaderData, HeaderSettings } from './types';
import type { MenuItem } from '@jsonpages/core';

interface HeaderProps {
  data: HeaderData;
  settings?: HeaderSettings;
  menu: MenuItem[];
}

export const Header: React.FC<HeaderProps> = ({ data, menu }) => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [topLogoLoadFailed, setTopLogoLoadFailed] = useState(false);
  const [scrolledLogoLoadFailed, setScrolledLogoLoadFailed] = useState(false);
  const { tenantId = 'default' } = useConfig();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = menu.length > 0 ? menu : (data.links ?? []);
  const logoTopPath = data.logoImageUrl?.url?.trim() ?? '';
  const logoScrolledPath = data.logoImageScrolled?.url?.trim() ?? '';
  const topLogoUrl = logoTopPath ? resolveAssetUrl(logoTopPath, tenantId) : '';
  const scrolledLogoUrl = logoScrolledPath ? resolveAssetUrl(logoScrolledPath, tenantId) : '';
  const shouldShowLogoText = data.showLogoText ?? true;
  const resolvedLogoMaxHeight = Number.isFinite(Number(data.logoMaxHeight)) ? Number(data.logoMaxHeight) : 30;
  const logoMaxHeight = Math.min(30, Math.max(10, resolvedLogoMaxHeight));
  const fallbackAlt = `${data.logoText}${data.logoHighlight ?? ''}`.trim() || 'Logo';
  const topLogoAlt = data.logoImageUrl?.alt?.trim() || fallbackAlt;
  const scrolledLogoAlt = data.logoImageScrolled?.alt?.trim() || topLogoAlt;
  const showTopLogoImage = topLogoUrl.length > 0 && !topLogoLoadFailed;
  const showScrolledLogoImage = scrolledLogoUrl.length > 0 && !scrolledLogoLoadFailed;
  const canAnimateLogoSwap = showTopLogoImage && showScrolledLogoImage;
  const activeLogoUrl = scrolled ? (showScrolledLogoImage ? scrolledLogoUrl : '') : (showTopLogoImage ? topLogoUrl : '');
  const showActiveLogoImage = activeLogoUrl.length > 0;
  const shouldRenderLogoText = shouldShowLogoText;
  const activeLogoField = scrolled ? 'logoImageScrolled' : 'logoImageUrl';

  useEffect(() => {
    setTopLogoLoadFailed(false);
  }, [topLogoUrl]);

  useEffect(() => {
    setScrolledLogoLoadFailed(false);
  }, [scrolledLogoUrl]);

  return (
    <header
      style={{
        '--local-bg':         'rgba(250,250,245,0)',
        '--local-bg-scrolled':'rgba(250,250,245,0.96)',
        '--local-text':       scrolled ? 'var(--foreground)' : '#FFFFFF',
        '--local-text-muted': scrolled ? 'var(--muted-foreground)' : 'rgba(255,255,255,0.82)',
        '--local-primary':    scrolled ? 'var(--primary)' : '#A8C84A',
        '--local-border':     scrolled ? 'var(--border)' : 'rgba(255,255,255,0.22)',
        opacity: 1,
        transform: 'none',
      } as React.CSSProperties}
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[var(--local-bg-scrolled)] backdrop-blur-md shadow-[0_1px_24px_rgba(45,80,22,0.08)] border-b border-[var(--local-border)]'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* LOGO */}
        <a href="/" className="flex items-center gap-2 no-underline flex-shrink-0" aria-label="Home">
          {canAnimateLogoSwap ? (
            <span className="grid items-center">
              <img
                src={topLogoUrl}
                alt={topLogoAlt}
                className="[grid-area:1/1] block w-auto object-contain"
                style={{
                  maxHeight: `${logoMaxHeight}px`,
                  transform: scrolled ? 'translateX(-18px)' : 'translateX(0)',
                  opacity: scrolled ? 0 : 1,
                  transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1), opacity 240ms ease',
                }}
                data-jp-field="logoImageUrl"
                onError={() => setTopLogoLoadFailed(true)}
              />
              <img
                src={scrolledLogoUrl}
                alt={scrolledLogoAlt}
                className="[grid-area:1/1] block w-auto object-contain"
                style={{
                  maxHeight: `${logoMaxHeight}px`,
                  transform: scrolled ? 'translateX(0)' : 'translateX(12px)',
                  opacity: scrolled ? 1 : 0,
                  transition: 'transform 320ms cubic-bezier(0.4,0,0.2,1), opacity 240ms ease',
                }}
                data-jp-field="logoImageScrolled"
                onError={() => setScrolledLogoLoadFailed(true)}
              />
            </span>
          ) : showActiveLogoImage ? (
            <img
              src={activeLogoUrl}
              alt={scrolled ? scrolledLogoAlt : topLogoAlt}
              className="block w-auto object-contain"
              style={{ maxHeight: `${logoMaxHeight}px` }}
              data-jp-field={activeLogoField}
              onError={scrolled ? () => setScrolledLogoLoadFailed(true) : () => setTopLogoLoadFailed(true)}
            />
          ) : null}
          {shouldRenderLogoText ? (
            <span
              className="font-display text-[1.2rem] font-bold tracking-tight text-[var(--local-text)]"
              data-jp-field="logoText"
            >
              {data.logoText}
              {data.logoHighlight && (
                <span className="text-[var(--local-primary)]">{data.logoHighlight}</span>
              )}
            </span>
          ) : null}
        </a>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              data-jp-item-id={(link as { id?: string }).id ?? `legacy-${idx}`}
              data-jp-item-field="links"
              className={[
                'px-3.5 py-2 text-[0.875rem] font-medium transition-colors rounded-lg no-underline',
                scrolled
                  ? 'text-[var(--local-text-muted)] hover:text-[var(--local-primary)] hover:bg-[rgba(45,80,22,0.06)]'
                  : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[rgba(255,255,255,0.12)]',
              ].join(' ')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + LANG */}
        <div className="hidden md:flex items-center gap-3">
          {data.showLangToggle && (
            <a
              href="/en/"
              className={[
                'text-[0.75rem] font-bold uppercase tracking-wider transition-colors no-underline',
                scrolled
                  ? 'text-[var(--local-text-muted)] hover:text-[var(--local-primary)]'
                  : 'text-[var(--local-text-muted)] hover:text-[var(--local-text)]',
              ].join(' ')}
            >
              EN
            </a>
          )}
          {data.ctaLabel && data.ctaHref && (
            <a
              href={data.ctaHref}
              className="px-5 py-2 rounded-full bg-[var(--local-primary)] text-white text-[0.875rem] font-semibold hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_2px_16px_rgba(45,80,22,0.25)] no-underline"
              data-jp-field="ctaLabel"
            >
              {data.ctaLabel}
            </a>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[rgba(45,80,22,0.06)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-[var(--local-text)] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[var(--local-text)] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[var(--local-text)] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-[var(--local-bg-scrolled)] backdrop-blur-md border-t border-[var(--local-border)] ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              data-jp-item-id={(link as { id?: string }).id ?? `legacy-${idx}`}
              data-jp-item-field="links"
              className="py-3 text-[0.9rem] font-medium text-[var(--local-text)] hover:text-[var(--local-primary)] border-b border-[var(--local-border)] last:border-0 no-underline"
            >
              {link.label}
            </a>
          ))}
          {data.ctaLabel && data.ctaHref && (
            <a
              href={data.ctaHref}
              className="mt-3 py-3 text-center rounded-full bg-[var(--local-primary)] text-white text-[0.875rem] font-semibold no-underline"
            >
              {data.ctaLabel}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};
