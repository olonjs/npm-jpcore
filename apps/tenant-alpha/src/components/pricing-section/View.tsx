// Layout: Hero=E (MAGAZINE), Features=C (TIMELINE)
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PricingSectionData, PricingSectionSettings } from './types';

export const PricingSectionComponent: React.FC<{ data: PricingSectionData; settings: PricingSectionSettings }> = ({ data }) => (
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
    <div className="max-w-[1200px] mx-auto px-8">
      {data.label && (
        <div className="jp-section-label inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase text-[var(--local-accent)] mb-4" data-jp-field="label">
          <span className="w-5 h-px bg-[var(--local-primary)]" />
          {data.label}
        </div>
      )}
      <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)]" data-jp-field="title">{data.title}</h2>
      <p className="mt-4 max-w-2xl text-[var(--local-text-muted)]" data-jp-field="description">{data.description}</p>

      <Card className="mt-8 border-[var(--local-border)] bg-[var(--local-surface)] rounded-[var(--local-radius-lg)]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Treatment</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((item, idx) => (
                <TableRow key={item.id || 'legacy-' + idx} data-jp-item-id={item.id || 'legacy-' + idx} data-jp-item-field="rows">
                  <TableCell className="font-medium">{item.treatment}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        {data.notes.map((item, idx) => (
          <Card key={item.id || 'legacy-' + idx} className="border-[var(--local-border)] bg-[var(--local-surface)] rounded-[var(--local-radius-md)]" data-jp-item-id={item.id || 'legacy-' + idx} data-jp-item-field="notes">
            <CardContent className="p-5">
              <h3 className="font-display font-bold text-[1.1rem] text-[var(--local-text)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--local-text-muted)]">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

