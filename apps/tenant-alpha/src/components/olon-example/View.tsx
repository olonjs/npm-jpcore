import type { OlonExampleData } from './types';

interface Props { data: OlonExampleData; }

export function OlonExampleView({ data }: Props) {
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
      data-jp-section-type="olon-example"
    >
      <div className="max-w-6xl mx-auto px-8">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3"
           data-jp-field="label">{data.label}</p>
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-foreground mb-3"
            data-jp-field="headline">{data.headline}</h2>
        <p className="text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-12"
           data-jp-field="body">{data.body}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.steps.map((step) => (
            <div key={step.number}
                 className="bg-[var(--local-card)] border border-[var(--local-border)] rounded-2xl overflow-hidden">
              {/* Step header */}
              <div className="px-6 py-4 border-b border-[var(--local-border)] flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--local-p400)] text-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {step.number}
                </span>
                <span className="font-semibold text-foreground text-sm">{step.title}</span>
                <span className="ml-auto text-xs text-[var(--local-muted)]">{step.meta}</span>
              </div>
              {/* Code block */}
              <pre className="p-6 font-mono text-xs leading-relaxed bg-[#080E14] text-gray-300 overflow-x-auto whitespace-pre-wrap min-h-[200px]">
                {step.code}
              </pre>
            </div>
          ))}
        </div>

        {/* MCP manifest note */}
        {data.note && (
          <div className="mt-6 px-6 py-4 bg-[var(--local-card)] border border-[var(--local-border)] rounded-xl flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                 className="text-[var(--local-p400)] mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-sm text-[var(--local-muted)]" data-jp-field="note">
              {data.note}{' '}
              {data.noteHref && (
                <code className="font-mono text-[var(--local-p300)] text-xs">{data.noteHref}</code>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
