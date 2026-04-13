// Layout: Hero=E (MAGAZINE), Features=C (TIMELINE)
import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ContactSectionData, ContactSectionSettings } from './types';

export const ContactSectionComponent: React.FC<{ data: ContactSectionData; settings: ContactSectionSettings }> = ({ data }) => (
  <section
    style={{
      '--local-bg': 'var(--background)',
      '--local-text': 'var(--foreground)',
      '--local-text-muted': 'var(--muted-foreground)',
      '--local-primary': 'var(--primary)',
      '--local-primary-foreground': 'var(--primary-foreground)',
      '--local-accent': 'var(--accent)',
      '--local-border': 'var(--border)',
      '--local-surface': 'var(--card)',
      '--local-radius-md': 'var(--theme-radius-md)',
      '--local-radius-lg': 'var(--theme-radius-lg)',
    } as React.CSSProperties}
    className="relative z-0 py-24"
  >
    <div className="max-w-[1200px] mx-auto px-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        {data.label && (
          <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase text-[var(--local-accent)] mb-4" data-jp-field="label">
            <span className="w-5 h-px bg-[var(--local-primary)]" />
            {data.label}
          </div>
        )}
        <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)]" data-jp-field="title">{data.title}</h2>
        <p className="mt-4 max-w-lg text-[var(--local-text-muted)]" data-jp-field="description">{data.description}</p>
        <Button asChild variant="default" className="mt-6 bg-[var(--local-primary)] text-[var(--local-primary-foreground)] hover:opacity-90 rounded-[var(--local-radius-md)]">
          <a href={data.primaryCta.href}>{data.primaryCta.label} <ArrowRight className="h-4 w-4" /></a>
        </Button>
      </div>
      <div className="grid gap-4">
        {data.details.map((item, idx) => (
          <Card key={item.id || 'legacy-' + idx} className="border-[var(--local-border)] bg-[var(--local-surface)] rounded-[var(--local-radius-lg)]" data-jp-item-id={item.id || 'legacy-' + idx} data-jp-item-field="details">
            <CardContent className="p-6 flex gap-4">
              <MapPin className="h-5 w-5 mt-1 text-[var(--local-accent)]" />
              <div>
                <h3 className="font-display font-bold text-[1.2rem] text-[var(--local-text)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--local-text-muted)] whitespace-pre-line">{item.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

