// Layout: Hero=B (BENTO GRID), Features=A (BENTO)
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ExperiencesSectionData, ExperiencesSectionSettings } from './types';

export const ExperiencesSectionComponent: React.FC<{ data: ExperiencesSectionData; settings: ExperiencesSectionSettings }> = ({ data }) => (
  <section
    style={{
      '--local-bg': 'var(--card)',
      '--local-text': 'var(--foreground)',
      '--local-text-muted': 'var(--muted-foreground)',
      '--local-primary': 'var(--primary)',
      '--local-primary-foreground': 'var(--primary-foreground)',
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
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)]" data-jp-field="title">{data.title}</h2>
          <p className="mt-4 max-w-2xl text-[var(--local-text-muted)]" data-jp-field="description">{data.description}</p>
        </div>
        <Button asChild variant="default" className="bg-[var(--local-primary)] text-[var(--local-primary-foreground)] hover:opacity-90 rounded-[var(--local-radius-md)]">
          <a href={data.primaryCta.href}>{data.primaryCta.label} <ArrowRight className="h-4 w-4" /></a>
        </Button>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.items.map((item, idx) => (
          <Card
            key={item.id || 'legacy-' + idx}
            className={'border-[var(--local-border)] bg-[var(--local-surface)] rounded-[var(--local-radius-lg)] ' + (idx === 0 ? 'xl:col-span-2' : '')}
            data-jp-item-id={item.id || 'legacy-' + idx}
            data-jp-item-field="items"
          >
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-[1.2rem] text-[var(--local-text)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--local-text-muted)]">{item.body}</p>
              <p className="mt-4 text-sm text-[var(--local-text)]">{item.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

