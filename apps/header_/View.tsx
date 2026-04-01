import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { OlonMark } from '@/components/OlonWordmark';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import type { HeaderData, HeaderSettings } from './types';
import type { MenuItem } from '@olonjs/core';

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  variant?: string;
  children?: NavChild[];
}

interface HeaderViewProps {
  data: HeaderData;
  settings?: HeaderSettings;
  menu: MenuItem[];
}

function isMenuRef(value: unknown): value is { $ref: string } {
  if (!value || typeof value !== 'object') return false;
  const rec = value as Record<string, unknown>;
  return typeof rec.$ref === 'string' && rec.$ref.trim().length > 0;
}

function toNavItem(raw: unknown): NavItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Record<string, unknown>;
  if (typeof rec.label !== 'string' || typeof rec.href !== 'string') return null;
  const children = Array.isArray(rec.children)
    ? (rec.children as unknown[])
        .map((c) => toNavItem(c))
        .filter((c): c is NavChild => c !== null)
    : undefined;
  const variant = typeof rec.variant === 'string' ? rec.variant : undefined;
  return { label: rec.label, href: rec.href, ...(variant ? { variant } : {}), ...(children && children.length > 0 ? { children } : {}) };
}

export function Header({ data, settings, menu }: HeaderViewProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const isSticky = settings?.sticky ?? true;
  const navRef = useRef<HTMLElement>(null);

  const linksField = data.links as unknown;
  const rawLinks = Array.isArray(linksField) ? linksField : [];
  const menuItems = Array.isArray(menu) ? (menu as unknown[]) : [];
  // If tenant explicitly uses a JSON ref for links, resolve from menu config.
  const source =
    isMenuRef(linksField)
      ? menuItems
      : (rawLinks.length > 0 ? rawLinks : menuItems);
  const navItems: NavItem[] = source.map(toNavItem).filter((i): i is NavItem => i !== null);

  useEffect(() => {
    if (!openDropdown) return;
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  return (
    <header
      className={cn(
        'top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md',
        isSticky ? 'fixed' : 'relative'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center gap-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0" aria-label="OlonJS home">
          <OlonMark size={26} className="mb-0.5" />
          <div className="flex items-center gap-1"><span
            className="text-2xl text-foreground leading-none"
            style={{
              fontFamily:           'var(--wordmark-font)',
              letterSpacing:        'var(--wordmark-tracking)',
              fontWeight:           'var(--wordmark-weight)',
              fontVariationSettings: '"wdth" var(--wordmark-width)',
            }}
          >
            {data.logoText}
            </span> 
            <span className="text-primary-light font-mono">{data.badge}</span>
            </div>
        </a>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden md:flex items-center gap-0.5 flex-1">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.label;
            const isSecondary = item.variant === 'secondary';

            if (isSecondary) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-md border border-border bg-elevated hover:bg-elevated/70 transition-colors duration-150"
                >
                  {item.label}
                </a>
              );
            }

            if (!hasChildren) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-md transition-colors duration-150 hover:bg-elevated"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-md transition-colors duration-150',
                    isOpen ? 'text-foreground bg-elevated' : 'text-muted-foreground hover:text-foreground hover:bg-elevated'
                  )}
                  aria-expanded={hasChildren ? isOpen : undefined}
                >
                  {item.label}
                  {hasChildren && (
                    <ChevronDown
                      size={11}
                      className={cn('opacity-40 mt-px transition-transform duration-150', isOpen && 'rotate-180 opacity-70')}
                    />
                  )}
                </button>

                {hasChildren && (
                  <div
                    className={cn(
                      'absolute left-0 top-[calc(100%+8px)] min-w-[220px] rounded-lg border border-border bg-card shadow-lg shadow-black/20 overflow-hidden',
                      'transition-all duration-150 origin-top-left',
                      isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    )}
                  >
                    <div className="p-1.5">
                      {item.children!.map((child, i) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors duration-100 group',
                            i < item.children!.length - 1 && ''
                          )}
                        >
                          <span className="w-6 h-6 rounded-md bg-primary-900 border border-primary-800 flex items-center justify-center shrink-0 text-[10px] font-medium font-mono-olon text-primary-light group-hover:border-primary transition-colors">
                            {child.label.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-medium">{child.label}</span>
                        </a>
                      ))}
                    </div>
                    <div className="px-3 py-2 border-t border-border bg-elevated/50">
                      <a
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        View all {item.label.toLowerCase()} →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-1 ml-auto shrink-0">
          <ThemeToggle />
          {data.signinHref && (
            <a
              href={data.signinHref}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-1.5 rounded-md hover:bg-elevated"
            >
              Sign in
            </a>
          )}
          {data.ctaHref && (
            <Button variant="accent" size="sm" className="h-8 px-4 text-[13px] font-medium" asChild>
              <a href={data.ctaHref}>{data.ctaLabel ?? 'Get started →'}</a>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={cn(
        'md:hidden border-t border-border bg-card overflow-hidden transition-all duration-200',
        mobileOpen ? 'max-h-[32rem]' : 'max-h-0'
      )}>
        <nav className="px-4 py-3 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = mobileExpanded === item.label;
            const isSecondary = item.variant === 'secondary';

            if (isSecondary) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 flex items-center px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground border border-border bg-elevated hover:bg-elevated/70 rounded-md transition-colors"
                >
                  {item.label}
                </a>
              );
            }

            if (!hasChildren) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      setMobileExpanded(isExpanded ? null : item.label);
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors text-left"
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      size={13}
                      className={cn('opacity-40 transition-transform duration-150', isExpanded && 'rotate-180 opacity-70')}
                    />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="ml-3 pl-3 border-l border-border mt-0.5 mb-1 flex flex-col gap-0.5">
                    {item.children!.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                        className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors"
                      >
                        <span className="w-5 h-5 rounded bg-primary-900 border border-primary-800 flex items-center justify-center shrink-0 text-[9px] font-medium font-mono-olon text-primary-light">
                          {child.label.slice(0, 2).toUpperCase()}
                        </span>
                        {child.label}
                      </a>
                    ))}
                    <a
                      href={item.href}
                      onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                      className="px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View all →
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex gap-2 pt-3 mt-2 border-t border-border">
            {data.signinHref && (
              <Button variant="outline" size="sm" className="flex-1 text-[13px]" asChild>
                <a href={data.signinHref}>Sign in</a>
              </Button>
            )}
            {data.ctaHref && (
              <Button variant="accent" size="sm" className="flex-1 text-[13px]" asChild>
                <a href={data.ctaHref}>{data.ctaLabel ?? 'Get started'}</a>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
