import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { OlonMark } from '@/components/ui/OlonMark';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@olonjs/core';
import type { HeaderData, HeaderSettings } from './types';

export const Header: React.FC<{
  data: HeaderData;
  settings?: HeaderSettings;
  menu: MenuItem[];
}> = ({ data, menu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div style={{ height: '56px' }} aria-hidden />
      <header
        className={cn(
          'fixed top-0 left-0 right-0 w-full h-14 z-50 transition-all duration-300',
          'flex items-center',
          'bg-background/88 backdrop-blur-[16px] border-b border-border/60'
        )}
      >
        <div className="max-w-[1040px] w-full mx-auto px-8 flex items-center gap-3">

          <a
            href="/"
            className="flex items-center gap-2 no-underline shrink-0"
            aria-label="OlonJS home"
          >
            <OlonMark size={22} />
            <span
              className="text-lg font-bold tracking-tight text-foreground"
              data-jp-field="logoText"
            >
              {data.logoText}
              {data.logoHighlight && (
                <span className="text-primary" data-jp-field="logoHighlight">
                  {data.logoHighlight}
                </span>
              )}
            </span>
          </a>

          {data.badge && (
            <>
              <span className="w-px h-4 bg-border" aria-hidden />
              <Badge variant="pill" data-jp-field="badge">
                {data.badge}
              </Badge>
            </>
          )}

          <div className="flex-1" />

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Site">
            {menu.map((item, idx) => (
              <Button
                key={(item as { id?: string }).id ?? idx}
                asChild
                variant={item.isCta ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'text-[13px]',
                  !item.isCta && 'text-muted-foreground hover:text-foreground'
                )}
              >
                <a
                  href={item.href}
                  data-jp-item-id={(item as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              </Button>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            className="absolute top-14 left-0 right-0 md:hidden border-b border-border bg-background/95 backdrop-blur-[16px]"
            aria-label="Mobile menu"
          >
            <div className="max-w-[1040px] mx-auto px-8 py-4 flex flex-col gap-1">
              {menu.map((item, idx) => (
                <a
                  key={(item as { id?: string }).id ?? idx}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                  data-jp-item-id={(item as { id?: string }).id ?? `legacy-${idx}`}
                  data-jp-item-field="links"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};
