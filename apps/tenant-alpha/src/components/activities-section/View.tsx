// Layout: Hero=F (MINIMAL HERO), Features=D (ACCORDION)
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ActivitiesSectionData, ActivitiesSectionSettings } from './types';

export const ActivitiesSectionComponent: React.FC<{ data: ActivitiesSectionData; settings: ActivitiesSectionSettings }> = ({ data }) => (
  <section
    style={{
      '--local-bg': 'var(--background)',
      '--local-text': 'var(--foreground)',
      '--local-text-muted': 'var(--muted-foreground)',
      '--local-primary': 'var(--primary)',
      '--local-accent': 'var(--accent)',
      '--local-border': 'var(--border)',
      '--local-surface': 'var(--card)',
      '--local-radius-lg': 'var(--theme-radius-lg)',
    } as React.CSSProperties}
    className="relative z-0 py-24"
  >
    <div className="max-w-[900px] mx-auto px-8">
      {data.label && (
        <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase text-[var(--local-accent)] mb-4" data-jp-field="label">
          <span className="w-5 h-px bg-[var(--local-primary)]" />
          {data.label}
        </div>
      )}
      <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)]" data-jp-field="title">{data.title}</h2>
      <p className="mt-5 text-[var(--local-text-muted)] max-w-2xl" data-jp-field="description">{data.description}</p>
      <Accordion type="single" collapsible className="mt-8 rounded-[var(--local-radius-lg)] border border-[var(--local-border)] bg-[var(--local-surface)] px-6">
        {data.items.map((item, idx) => (
          <AccordionItem
            key={item.id || 'legacy-' + idx}
            value={item.id || 'legacy-' + idx}
            data-jp-item-id={item.id || 'legacy-' + idx}
            data-jp-item-field="items"
          >
            <AccordionTrigger className="font-display text-left text-[var(--local-text)]">{item.title}</AccordionTrigger>
            <AccordionContent className="text-[var(--local-text-muted)]">{item.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

