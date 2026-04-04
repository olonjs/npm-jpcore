import type { OlonGetStartedData } from './types';
import { Button } from '@/components/ui/button';

const BADGE_STYLES: Record<string, string> = {
  oss:    'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  cli:    'bg-primary/10 text-primary border border-primary/20',
  deploy: 'bg-muted text-muted-foreground border border-border',
};

interface Props { data: OlonGetStartedData; }

export function OlonGetStartedView({ data }: Props) {
  return (
    <section
      style={{
        '--local-bg':    'var(--background)',
        '--local-fg':    'var(--foreground)',
        '--local-muted': 'var(--muted-foreground)',
        '--local-p400':  'var(--primary)',
        '--local-p300':  'var(--primary-light)',
        '--local-card':  'var(--card)',
        '--local-border':'var(--border)',
      } as React.CSSProperties}
      className="bg-[var(--local-bg)] text-[var(--local-fg)] py-24 border-t border-[var(--local-border)]"
      data-jp-section-id={data.id}
      data-jp-section-type="olon-getstarted"
    >
      <div className="max-w-6xl mx-auto px-8">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3"
           data-jp-field="label">{data.label}</p>
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-foreground mb-3"
            data-jp-field="headline">{data.headline}</h2>
        <p className="text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-12"
           data-jp-field="body">{data.body}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--local-border)] rounded-2xl overflow-hidden">
          {data.cards.map((card) => (
            <div key={card.id}
                 className="bg-[var(--local-card)] p-8 flex flex-col gap-4 border-r last:border-r-0 border-[var(--local-border)] hover:bg-[var(--elevated)] transition-colors"
                 data-jp-item-id={card.id}
                 data-jp-item-field="cards">
              <span className={`text-[11px] font-bold tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full w-fit ${BADGE_STYLES[card.badgeStyle]}`}
                    data-jp-field="badge">
                {card.badge}
              </span>
              <p className="font-bold text-foreground text-base" data-jp-field="title">{card.title}</p>
              <p className="text-sm text-[var(--local-muted)] leading-relaxed flex-1"
                 data-jp-field="body">{card.body}</p>
              {card.code && (
                <code className="font-mono text-xs bg-[#080E14] border border-[var(--local-border)] rounded-lg px-4 py-3 text-[var(--local-p300)] block"
                      data-jp-field="code">
                  {card.code}
                </code>
              )}
              {card.deployHref && card.deployLabel && (
                <Button asChild variant="outline" size="sm" className="w-fit" data-jp-field="deployLabel">
                  <a href={card.deployHref} target="_blank" rel="noopener noreferrer">
                    {card.deployLabel}
                  </a>
                </Button>
              )}
              <a href={card.linkHref} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-[var(--local-p400)] hover:text-[var(--local-p300)] transition-colors flex items-center gap-1 mt-auto"
                 data-jp-field="linkLabel">
                {card.linkLabel} ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
