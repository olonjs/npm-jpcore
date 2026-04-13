// Layout: Hero=A (SPLIT 60/40), Features=A (BENTO)
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { HospitalitySectionData, HospitalitySectionSettings } from './types';

export const HospitalitySectionComponent: React.FC<{ data: HospitalitySectionData; settings: HospitalitySectionSettings }> = ({ data }) => (
  <section
    style={{
      '--local-bg': 'var(--background)',
      '--local-text': 'var(--foreground)',
      '--local-text-muted': 'var(--muted-foreground)',
      '--local-primary': 'var(--primary)',
      '--local-accent': 'var(--accent)',
      '--local-border': 'var(--border)',
      '--local-surface': 'var(--card)',
      '--local-radius-md': 'var(--theme-radius-md)',
      '--local-radius-lg': 'var(--theme-radius-lg)',
    } as React.CSSProperties}
    className="relative z-0 py-24"
  >
    <div className="max-w-[1200px] mx-auto px-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
      <img src={data.image?.url} alt={data.image?.alt || ''} className="w-full h-[520px] object-cover rounded-[var(--local-radius-lg)] border border-[var(--local-border)]" />
      <div>
        {data.label && (
          <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase text-[var(--local-accent)] mb-4" data-jp-field="label">
            <span className="w-5 h-px bg-[var(--local-primary)]" />
            {data.label}
          </div>
        )}
        <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)]" data-jp-field="title">{data.title}</h2>
        <p className="mt-5 max-w-xl text-[var(--local-text-muted)]" data-jp-field="description">{data.description}</p>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {data.items.map((item, idx) => (
            <Card
              key={item.id || 'legacy-' + idx}
              className="rounded-[var(--local-radius-md)] border-[var(--local-border)] bg-[var(--local-surface)]"
              data-jp-item-id={item.id || 'legacy-' + idx}
              data-jp-item-field="items"
            >
              <CardContent className="p-5">
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

