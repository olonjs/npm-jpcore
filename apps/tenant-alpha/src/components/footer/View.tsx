import { OlonMark } from '@/components/OlonWordmark';
import type { FooterData, FooterSettings } from './types';

interface FooterViewProps {
  data: FooterData;
  settings?: FooterSettings;
}

export function Footer({ data, settings }: FooterViewProps) {
  const showLogo = settings?.showLogo ?? true;
  const links = data.links ?? [];

  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-6xl px-6 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {showLogo && (
            <div className="flex items-center gap-2.5">
              <OlonMark size={18} />
              <span className="text-base  font-display text-foreground tracking-[-0.02em]">
                {data.brandText}
              </span>
            </div>
          )}
          {links.length > 0 && (
            <div className="flex items-center gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {data.designSystemHref && (
                <a
                  href={data.designSystemHref}
                  className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Design System
                </a>
              )}
            </div>
          )}
        </div>
        <span className="font-mono-olon text-[11px] text-muted-foreground">
          {data.copyright}
        </span>
      </div>
    </footer>
  );
}
