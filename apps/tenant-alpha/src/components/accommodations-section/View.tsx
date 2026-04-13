// Layout: Hero=N/A, Features=HORIZONTAL SCROLL (cards in scrollable row)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check } from 'lucide-react';
import type { AccommodationsSectionData, AccommodationsSectionSettings } from './types';

export const AccommodationsSection: React.FC<{ data: AccommodationsSectionData; settings: AccommodationsSectionSettings }> = ({ data }) => {
  return (
    <section
      style={{
        '--local-bg': 'var(--elevated)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'var(--border)',
        '--local-surface': 'var(--card)',
        '--local-radius-lg': 'var(--theme-radius-lg)',
        '--local-radius-md': 'var(--theme-radius-md)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="max-w-[var(--theme-spacing-container-max)] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--local-accent)] mb-4" data-jp-field="label">
              <span className="w-5 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)] mb-4" data-jp-field="title">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-lg text-[var(--local-text-muted)] max-w-2xl mx-auto" data-jp-field="subtitle">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Horizontal Scrolling Cards */}
        <ScrollArea className="w-full">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {data.accommodations.map((accommodation, idx) => (
              <Card
                key={accommodation.id || `legacy-${idx}`}
                className="w-80 flex-shrink-0 bg-[var(--local-surface)] border-[var(--local-border)] rounded-[var(--local-radius-lg)] overflow-hidden group hover:shadow-lg transition-all duration-300"
                data-jp-item-id={accommodation.id || `legacy-${idx}`}
                data-jp-item-field="accommodations"
              >
                {accommodation.image?.url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={accommodation.image.url}
                      alt={accommodation.image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-xl text-[var(--local-text)]">
                    {accommodation.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-[var(--local-text-muted)] leading-relaxed">
                    {accommodation.description}
                  </p>

                  {accommodation.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-[var(--local-text)]">Caratteristiche:</h4>
                      <div className="space-y-1">
                        {accommodation.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[var(--local-primary)] flex-shrink-0" />
                            <span className="text-sm text-[var(--local-text-muted)]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {data.accommodations.length > 3 && (
          <div className="text-center mt-6">
            <p className="text-sm text-[var(--local-text-muted)]">
              Scorri orizzontalmente per vedere tutte le sistemazioni
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
