// Layout: Hero=B (BENTO GRID), Features=A (BENTO)
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { CuisineSectionData, CuisineSectionSettings } from './types';

export const CuisineSectionComponent: React.FC<{ data: CuisineSectionData; settings: CuisineSectionSettings }> = ({ data }) => (
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
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
        <div>
          <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)]" data-jp-field="title">{data.title}</h2>
          <p className="mt-5 text-[var(--local-text-muted)] max-w-lg" data-jp-field="description">{data.description}</p>
          <img src={data.image?.url} alt={data.image?.alt || ''} className="mt-8 w-full h-[360px] object-cover rounded-[var(--local-radius-lg)] border border-[var(--local-border)]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {data.products.map((item, idx) => (
            <Card
              key={item.id || 'legacy-' + idx}
              className={'border-[var(--local-border)] bg-[var(--local-surface)] rounded-[var(--local-radius-lg)] ' + (idx === 0 ? 'md:col-span-2' : '')}
              data-jp-item-id={item.id || 'legacy-' + idx}
              data-jp-item-field="products"
            >
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-[1.2rem] text-[var(--local-text)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--local-text-muted)]">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
);

