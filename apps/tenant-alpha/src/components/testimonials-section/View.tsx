// Layout: Hero=B (BENTO GRID), Features=B (HORIZONTAL SCROLL)
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import type { TestimonialsSectionData, TestimonialsSectionSettings } from './types';

export const TestimonialsSectionComponent: React.FC<{ data: TestimonialsSectionData; settings: TestimonialsSectionSettings }> = ({ data }) => (
  <section
    style={{
      '--local-bg': 'var(--card)',
      '--local-text': 'var(--foreground)',
      '--local-text-muted': 'var(--muted-foreground)',
      '--local-primary': 'var(--primary)',
      '--local-accent': 'var(--accent)',
      '--local-border': 'var(--border)',
      '--local-surface': 'var(--background)',
      '--local-radius-md': 'var(--theme-radius-md)',
      '--local-radius-lg': 'var(--theme-radius-lg)',
    } as React.CSSProperties}
    className="relative z-0 py-24 bg-[var(--local-bg)]"
  >
    <div className="max-w-[1200px] mx-auto px-8">
      {data.label && (
        <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase text-[var(--local-accent)] mb-4" data-jp-field="label">
          <span className="w-5 h-px bg-[var(--local-primary)]" />
          {data.label}
        </div>
      )}
      <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)]" data-jp-field="title">{data.title}</h2>
      <ScrollArea className="w-full mt-8">
        <div className="flex gap-5 pb-4">
          {data.items.map((item, idx) => (
            <Card
              key={item.id || 'legacy-' + idx}
              className="min-w-[320px] max-w-[360px] border-[var(--local-border)] bg-[var(--local-surface)] rounded-[var(--local-radius-lg)]"
              data-jp-item-id={item.id || 'legacy-' + idx}
              data-jp-item-field="items"
            >
              <CardContent className="p-6">
                <p className="text-[var(--local-text)] leading-relaxed">“{item.quote}”</p>
                <div className="mt-5 font-display text-xl text-[var(--local-text)]">{item.name}</div>
                <div className="text-sm text-[var(--local-text-muted)]">{item.meta}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  </section>
);

