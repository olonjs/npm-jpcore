import type { OlonArchitectureData } from './types';

const ICONS: Record<string, React.ReactNode> = {
  mtrp: (
    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="am" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient><linearGradient id="amc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FF"/><stop offset="1" stopColor="#84ABFF"/></linearGradient></defs>
      <rect x="25" y="30" width="130" height="140" rx="10" fill="none" stroke="url(#am)" strokeWidth="7"/>
      <line x1="25" y1="60" x2="155" y2="60" stroke="url(#am)" strokeWidth="5"/>
      <path fill="none" stroke="url(#am)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" d="M72,42 c-5,0 -8,2 -8,6v2c0,4 -3,5 -6,5 3,0 6,1 6,5v2c0,4 3,6 8,6"/>
      <path fill="none" stroke="url(#am)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" d="M108,42 c5,0 8,2 8,6v2c0,4 3,5 6,5 -3,0 -6,1 -6,5v2c0,4 -3,6 -8,6"/>
      <circle fill="url(#am)" opacity="0.35" cx="46" cy="90" r="4.5"/>
      <rect fill="url(#am)" opacity="0.35" x="59" y="86.5" width="68" height="7" rx="3.5"/>
      <circle fill="url(#amc)" cx="46" cy="117" r="6.5"/>
      <rect fill="url(#amc)" x="59" y="113" width="82" height="8" rx="4"/>
      <circle fill="url(#am)" opacity="0.55" cx="46" cy="145" r="4.5"/>
      <rect fill="url(#am)" opacity="0.55" x="59" y="141.5" width="50" height="7" rx="3.5"/>
      <path fill="none" stroke="url(#amc)" strokeLinecap="round" strokeWidth="5" d="M192,117 h-35"/>
      <path fill="none" stroke="url(#amc)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M170,108 l17,9 -17,9"/>
    </svg>
  ),
  tbp: (
    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="at" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient><linearGradient id="atc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FF"/><stop offset="1" stopColor="#84ABFF"/></linearGradient></defs>
      <rect fill="none" stroke="url(#at)" strokeWidth="5.5" strokeLinejoin="round" opacity="0.3" x="65" y="22" width="108" height="74" rx="9"/>
      <rect fill="none" stroke="url(#at)" strokeWidth="5.5" strokeLinejoin="round" opacity="0.6" x="46" y="50" width="108" height="74" rx="9"/>
      <rect fill="none" stroke="url(#at)" strokeWidth="6.5" strokeLinejoin="round" x="27" y="78" width="108" height="74" rx="9"/>
      <rect fill="url(#at)" opacity="0.6" x="42" y="101" width="52" height="6" rx="3"/>
      <rect fill="url(#atc)" x="42" y="116" width="36" height="6" rx="3"/>
      <circle fill="url(#at)" opacity="0.3" cx="162" cy="33" r="4"/>
      <circle fill="url(#at)" opacity="0.6" cx="143" cy="61" r="4"/>
      <circle fill="url(#atc)" cx="124" cy="89" r="5"/>
    </svg>
  ),
  jsp: (
    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="aj" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient><linearGradient id="ajc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FF"/><stop offset="1" stopColor="#84ABFF"/></linearGradient></defs>
      <rect fill="none" stroke="url(#aj)" strokeWidth="7" strokeLinejoin="round" x="14" y="22" width="172" height="128" rx="12"/>
      <line x1="14" y1="52" x2="186" y2="52" stroke="url(#aj)" strokeWidth="5"/>
      <circle fill="url(#aj)" opacity="0.4" cx="34" cy="37" r="5"/>
      <circle fill="url(#aj)" opacity="0.6" cx="52" cy="37" r="5"/>
      <circle fill="url(#ajc)" cx="70" cy="37" r="5"/>
      <path fill="none" stroke="url(#ajc)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M28,75 l12,11 -12,11"/>
      <rect fill="url(#ajc)" x="48" y="80" width="22" height="7" rx="3.5"/>
      <rect fill="url(#aj)" opacity="0.7" x="28" y="106" width="88" height="6" rx="3"/>
      <rect fill="url(#aj)" opacity="0.5" x="28" y="121" width="62" height="6" rx="3"/>
      <rect fill="url(#aj)" opacity="0.35" x="28" y="136" width="76" height="6" rx="3"/>
    </svg>
  ),
  idac: (
    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="ai" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient><linearGradient id="aic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FF"/><stop offset="1" stopColor="#84ABFF"/></linearGradient></defs>
      <rect fill="none" stroke="url(#ai)" strokeWidth="6.5" strokeLinejoin="round" x="8" y="36" width="72" height="128" rx="9"/>
      <rect fill="url(#ai)" opacity="0.5" x="20" y="56" width="48" height="5.5" rx="2.75"/>
      <rect fill="url(#aic)" x="20" y="75" width="48" height="8" rx="4"/>
      <rect fill="url(#ai)" opacity="0.4" x="20" y="98" width="48" height="5.5" rx="2.75"/>
      <path fill="none" stroke="url(#aic)" strokeLinecap="round" strokeWidth="5.5" d="M80,100 h40"/>
      <circle fill="url(#aic)" cx="100" cy="100" r="5.5"/>
      <path fill="none" stroke="url(#ai)" strokeLinecap="round" strokeWidth="4" opacity="0.4" d="M80,75 h40"/>
      <path fill="none" stroke="url(#ai)" strokeLinecap="round" strokeWidth="4" opacity="0.4" d="M80,125 h40"/>
      <rect fill="none" stroke="url(#ai)" strokeWidth="6.5" strokeLinejoin="round" x="120" y="36" width="72" height="128" rx="9"/>
      <rect fill="url(#ai)" opacity="0.5" x="132" y="56" width="48" height="5.5" rx="2.75"/>
      <rect fill="url(#aic)" x="132" y="75" width="48" height="8" rx="4"/>
      <rect fill="url(#ai)" opacity="0.4" x="132" y="98" width="48" height="5.5" rx="2.75"/>
    </svg>
  ),
  bsds: (
    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="ab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient><linearGradient id="abc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FF"/><stop offset="1" stopColor="#84ABFF"/></linearGradient></defs>
      <rect fill="none" stroke="url(#ab)" strokeWidth="8" strokeLinejoin="round" x="16" y="152" width="168" height="32" rx="8"/>
      <circle fill="url(#abc)" cx="100" cy="168" r="7"/>
      <path fill="none" stroke="url(#ab)" strokeLinecap="round" strokeWidth="5" opacity="0.5" d="M54,138 v14"/>
      <path fill="none" stroke="url(#ab)" strokeLinecap="round" strokeWidth="5" opacity="0.5" d="M146,138 v14"/>
      <rect fill="none" stroke="url(#ab)" strokeWidth="6" strokeLinejoin="round" x="16" y="68" width="76" height="70" rx="9"/>
      <rect fill="url(#ab)" opacity="0.55" x="28" y="84" width="42" height="6" rx="3"/>
      <rect fill="url(#abc)" x="28" y="112" width="32" height="6" rx="3"/>
      <rect fill="none" stroke="url(#ab)" strokeWidth="6" strokeLinejoin="round" x="108" y="44" width="76" height="94" rx="9"/>
      <rect fill="url(#ab)" opacity="0.55" x="120" y="60" width="42" height="6" rx="3"/>
      <rect fill="url(#abc)" x="120" y="88" width="32" height="6" rx="3"/>
    </svg>
  ),
  pss: (
    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="ap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#84ABFF"/><stop offset="1" stopColor="#0F52E0"/></linearGradient><linearGradient id="apc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3FF"/><stop offset="1" stopColor="#84ABFF"/></linearGradient></defs>
      <path fill="none" stroke="url(#apc)" strokeLinecap="round" strokeWidth="5.5" d="M100,32 L52,90"/>
      <path fill="none" stroke="url(#ap)" strokeLinecap="round" strokeWidth="5" opacity="0.3" d="M100,32 L148,90"/>
      <path fill="none" stroke="url(#ap)" strokeLinecap="round" strokeWidth="4.5" opacity="0.3" d="M52,90 L22,158"/>
      <path fill="none" stroke="url(#apc)" strokeLinecap="round" strokeWidth="5.5" d="M52,90 L90,158"/>
      <path fill="none" stroke="url(#ap)" strokeLinecap="round" strokeWidth="4" opacity="0.25" d="M148,90 L170,158"/>
      <circle fill="url(#apc)" cx="100" cy="22" r="11"/>
      <circle fill="url(#apc)" cx="52" cy="90" r="10"/>
      <circle fill="url(#ap)" opacity="0.3" cx="148" cy="90" r="8"/>
      <circle fill="url(#ap)" opacity="0.3" cx="22" cy="165" r="7"/>
      <circle fill="url(#apc)" cx="90" cy="165" r="11"/>
      <rect fill="none" stroke="url(#apc)" strokeWidth="4" strokeLinejoin="round" opacity="0.5" x="76" y="151" width="28" height="28" rx="5"/>
    </svg>
  ),
};

interface Props { data: OlonArchitectureData; }

export function OlonArchitectureView({ data }: Props) {
  return (
    <section
      style={{
        '--local-bg':    'var(--background)',
        '--local-fg':    'var(--foreground)',
        '--local-muted': 'var(--muted-foreground)',
        '--local-p400':  'var(--primary)',
        '--local-card':  'var(--card)',
        '--local-border':'var(--border)',
      } as React.CSSProperties}
      className="bg-[var(--local-bg)] text-[var(--local-fg)] py-24 border-t border-[var(--local-border)]"
      data-jp-section-id={data.id}
      data-jp-section-type="olon-architecture"
    >
      <div className="max-w-6xl mx-auto px-8">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3"
           data-jp-field="label">{data.label}</p>
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-foreground mb-3"
            data-jp-field="headline">{data.headline}</h2>
        <p className="text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-3"
           data-jp-field="body">{data.body}</p>
        {data.specHref && (
          <p className="text-sm text-[var(--local-muted)] mb-12">
            Full specification:{' '}
            <a href={data.specHref} target="_blank" rel="noopener noreferrer"
               className="text-[var(--local-p400)] hover:underline">
              olonjsSpecs_V_1_5.md ↗
            </a>
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[var(--local-border)] rounded-2xl overflow-hidden">
          {data.protocols.map((p) => (
            <div key={p.id}
                 className="bg-[var(--local-card)] p-7 flex flex-col gap-3 border-r border-b border-[var(--local-border)] hover:bg-[var(--elevated)] transition-colors"
                 data-jp-item-id={p.id}
                 data-jp-item-field="protocols">
              <div data-jp-field="icon">{ICONS[p.icon]}</div>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--local-p400)] font-mono"
                 data-jp-field="version">{p.acronym} · {p.version}</p>
              <p className="font-bold text-foreground text-base" data-jp-field="name">{p.name}</p>
              <p className="text-sm text-[var(--local-muted)] leading-relaxed flex-1"
                 data-jp-field="desc">{p.desc}</p>
              <a href={p.specHref} target="_blank" rel="noopener noreferrer"
                 className="text-xs text-[var(--local-p400)] hover:text-foreground transition-colors mt-auto"
                 data-jp-field="specHref">Read spec ↗</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
