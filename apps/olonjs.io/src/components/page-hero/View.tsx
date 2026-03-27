import React from 'react';
import type { PageHeroData, PageHeroSettings } from './types';

interface PageHeroViewProps {
  data: PageHeroData;
  settings?: PageHeroSettings;
}

export function PageHero({ data }: PageHeroViewProps) {
  const crumbs = data.breadcrumb ?? [];

  return (
    <section
      className="py-14 px-6 border-b border-[var(--local-border)] bg-[var(--local-bg)]"
      style={{
        '--local-bg':        'var(--card)',
        '--local-text':      'var(--foreground)',
        '--local-text-muted':'var(--muted-foreground)',
        '--local-border':    'var(--border)',
      } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-2 font-mono-olon text-xs tracking-label uppercase text-muted-foreground mb-6">
            {crumbs.map((item, idx) => (
              <React.Fragment key={item.id ?? `crumb-${idx}`}>
                {idx > 0 && <span className="text-border-strong select-none">/</span>}
                <a
                  href={item.href}
                  data-jp-item-id={item.id ?? `crumb-${idx}`}
                  data-jp-item-field="breadcrumb"
                  className="hover:text-[var(--local-text)] transition-colors"
                >
                  {item.label}
                </a>
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Badge */}
        {data.badge && (
          <div
            className="inline-flex items-center font-mono-olon text-xs font-medium tracking-label uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-5"
            data-jp-field="badge"
          >
            {data.badge}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-display font-normal text-4xl md:text-5xl leading-tight tracking-display text-[var(--local-text)] mb-1"
          data-jp-field="title"
        >
          {data.title}
        </h1>

        {/* Title italic accent line */}
        {data.titleItalic && (
          <p
            className="font-display font-normal italic text-4xl md:text-5xl leading-tight tracking-display text-primary-light mb-0"
            data-jp-field="titleItalic"
          >
            {data.titleItalic}
          </p>
        )}

        {/* Description */}
        {data.description && (
          <p
            className="text-base text-[var(--local-text-muted)] leading-relaxed max-w-xl mt-5"
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

      </div>
    </section>
  );
}
