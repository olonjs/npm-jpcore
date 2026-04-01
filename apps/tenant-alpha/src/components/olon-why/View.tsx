import type { OlonWhyData } from './types';

const ICONS = {
  contract: (
    <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient>
      </defs>
      <rect x="20" y="20" width="160" height="160" rx="16" fill="none" stroke="url(#w1)" strokeWidth="10"/>
      <line x1="20" y1="70" x2="180" y2="70" stroke="url(#w1)" strokeWidth="7"/>
      <rect x="40" y="100" width="60" height="8" rx="4" fill="url(#w1)" opacity="0.4"/>
      <rect x="40" y="118" width="90" height="8" rx="4" fill="url(#w1)" opacity="0.7"/>
      <rect x="40" y="136" width="72" height="8" rx="4" fill="url(#w1)" opacity="0.5"/>
    </svg>
  ),
  holon: (
    <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient>
        <linearGradient id="w2a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FF"/><stop offset="1" stopColor="#84ABFF"/></linearGradient>
      </defs>
      <circle cx="100" cy="100" r="75" fill="none" stroke="url(#w2)" strokeWidth="10"/>
      <circle cx="100" cy="100" r="28" fill="url(#w2a)"/>
    </svg>
  ),
  generated: (
    <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="w3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient>
      </defs>
      <circle cx="100" cy="40" r="14" fill="url(#w3)"/>
      <circle cx="50" cy="110" r="12" fill="url(#w3)" opacity="0.6"/>
      <circle cx="150" cy="110" r="12" fill="url(#w3)" opacity="0.6"/>
      <circle cx="80" cy="175" r="10" fill="url(#w3)" opacity="0.35"/>
      <circle cx="130" cy="175" r="14" fill="url(#w3)"/>
      <line x1="100" y1="54" x2="54" y2="98" stroke="url(#w3)" strokeWidth="5" strokeLinecap="round"/>
      <line x1="100" y1="54" x2="146" y2="98" stroke="url(#w3)" strokeWidth="5" strokeLinecap="round" opacity="0.4"/>
      <line x1="54" y1="122" x2="82" y2="165" stroke="url(#w3)" strokeWidth="4" strokeLinecap="round" opacity="0.35"/>
      <line x1="146" y1="122" x2="128" y2="165" stroke="url(#w3)" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  ),
};

interface Props { data: OlonWhyData; }

export function OlonWhyView({ data }: Props) {
  return (
    <section
      style={{
        '--local-bg':    'var(--background)',
        '--local-fg':    'var(--foreground)',
        '--local-muted': 'var(--muted-foreground)',
        '--local-p300':  'var(--primary-light)',
        '--local-card':  'var(--card)',
        '--local-border':'var(--border)',
      } as React.CSSProperties}
      className="bg-[var(--local-bg)] text-[var(--local-fg)] py-24 border-t border-[var(--local-border)]"
      data-jp-section-id={data.id}
      data-jp-section-type="olon-why"
    >
      <div className="max-w-6xl mx-auto px-8">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3"
           data-jp-field="label">{data.label}</p>
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-white leading-tight"
            data-jp-field="headline">{data.headline}</h2>
        <p className="text-3xl font-semibold tracking-[-0.03em] text-[var(--local-p300)] leading-tight mb-4"
           data-jp-field="subline">{data.subline}</p>
        <p className="text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-12"
           data-jp-field="body">{data.body}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--local-border)] rounded-2xl overflow-hidden"
             data-jp-array="pillars">
          {data.pillars.map((pillar) => (
            <div key={pillar.id}
                 className="bg-[var(--local-card)] p-8 flex flex-col gap-4 border-r last:border-r-0 border-[var(--local-border)]"
                 data-jp-item-id={pillar.id}>
              <div>{ICONS[pillar.icon]}</div>
              <div className="font-bold text-white" data-jp-field="title">{pillar.title}</div>
              <div className="text-sm text-[var(--local-muted)] leading-relaxed" data-jp-field="body">{pillar.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
