import React from 'react';
import { cn } from '@/lib/utils';
import type { FeatureGridData, FeatureGridSettings } from './types';

export const FeatureGrid: React.FC<{
  data: FeatureGridData;
  settings?: FeatureGridSettings;
}> = ({ data }) => {
  return (
    <section id="architecture" className="jp-feature-grid py-24">
      <div className="max-w-[1040px] mx-auto px-8">

        {/* Section header */}
        <header className="text-center mb-14">
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
              <span className="w-[18px] h-px bg-border" aria-hidden />
              {data.label}
            </div>
          )}
          <h2
            className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-foreground mb-4"
            style={{ fontSize: 'clamp(26px, 3.8vw, 40px)' }}
            data-jp-field="sectionTitle"
          >
            {data.sectionTitle}
          </h2>
          {data.sectionLead && (
            <p
              className="text-[15.5px] text-muted-foreground leading-[1.7] mx-auto"
              style={{ maxWidth: '500px' }}
              data-jp-field="sectionLead"
            >
              {data.sectionLead}
            </p>
          )}
        </header>

        {/* 3-col feature grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-xl overflow-hidden border border-border"
          style={{ gap: '1px', background: 'var(--border)' }}
          data-jp-field="cards"
        >
          {data.cards.map((card, idx) => (
            <div
              key={card.id ?? idx}
              className={cn(
                'p-8 transition-colors hover:bg-muted/60',
                idx % 2 === 0 ? 'bg-background' : 'bg-card'
              )}
              data-jp-item-id={card.id ?? `legacy-${idx}`}
              data-jp-item-field="cards"
            >
              {card.emoji && (
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/18 flex items-center justify-center text-[18px] mb-5">
                  {card.emoji}
                </div>
              )}
              <h3 className="text-[14px] font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-[1.7]">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
