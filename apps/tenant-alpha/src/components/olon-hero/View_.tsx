import type { OlonHeroData } from './types';
import { Button } from '@/components/ui/button';

interface Props {
  data: OlonHeroData;
}

export function OlonHeroView({ data }: Props) {
  return (
    <section
      style={{
        '--local-bg':      'var(--background)',
        '--local-fg':      'var(--foreground)',
        '--local-muted':   'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-p300':    'var(--primary-light)',
      } as React.CSSProperties}
      className="min-h-screen bg-[var(--local-bg)] text-[var(--local-fg)] pt-36 pb-24"
      data-jp-section-id={data.id}
      data-jp-section-type="olon-hero"
    >
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)]"
             data-jp-field="eyebrow">
            {data.eyebrow}
          </p>

          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-white"
                data-jp-field="headline">
              {data.headline}
            </h1>
            <p className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.1] text-[var(--local-p300)] italic mt-1"
               data-jp-field="subline">
              {data.subline}
            </p>
          </div>

          <p className="text-base text-[var(--local-muted)] leading-relaxed max-w-lg"
             data-jp-field="body">
            {data.body}
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <Button asChild size="lg" className="font-semibold">
              <a href={data.cta.primary.href}>{data.cta.primary.label} →</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-semibold">
              <a href={data.cta.secondary.href}>{data.cta.secondary.label}</a>
            </Button>
            <a href={data.cta.ghost.href}
               className="text-sm text-[var(--local-muted)] hover:text-[var(--local-fg)] transition-colors flex items-center gap-1.5">
              {data.cta.ghost.label}
            </a>
          </div>
        </div>

        {/* Right: SVG illustration */}
        <div className="hidden md:flex items-center justify-center">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
            <defs>
              <linearGradient id="hero-main" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#84ABFF"/>
                <stop offset="60%" stopColor="#1763FF"/>
                <stop offset="100%" stopColor="#0F52E0"/>
              </linearGradient>
              <linearGradient id="hero-accent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EEF3FF"/>
                <stop offset="100%" stopColor="#84ABFF"/>
              </linearGradient>
              <linearGradient id="hero-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1763FF" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#1763FF" stopOpacity="0"/>
              </linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="8" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
            </defs>
            <circle cx="200" cy="200" r="160" fill="url(#hero-glow)" opacity="0.4"/>
            <rect x="90" y="90" width="220" height="220" rx="28" fill="none" stroke="url(#hero-main)" strokeWidth="14"/>
            <line x1="16" y1="148" x2="90" y2="148" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="16" y1="200" x2="90" y2="200" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="16" y1="252" x2="90" y2="252" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="310" y1="148" x2="384" y2="148" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="310" y1="200" x2="384" y2="200" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="310" y1="252" x2="384" y2="252" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="148" y1="16" x2="148" y2="90" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="200" y1="16" x2="200" y2="90" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="252" y1="16" x2="252" y2="90" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="148" y1="310" x2="148" y2="384" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="200" y1="310" x2="200" y2="384" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="252" y1="310" x2="252" y2="384" stroke="url(#hero-main)" strokeWidth="10" strokeLinecap="round"/>
            <circle cx="148" cy="148" r="13" fill="url(#hero-main)"/>
            <circle cx="252" cy="148" r="13" fill="url(#hero-main)"/>
            <circle cx="148" cy="252" r="13" fill="url(#hero-main)"/>
            <circle cx="252" cy="252" r="13" fill="url(#hero-main)"/>
            <line x1="148" y1="148" x2="200" y2="200" stroke="#84ABFF" strokeWidth="2.5" opacity="0.35"/>
            <line x1="252" y1="148" x2="200" y2="200" stroke="#84ABFF" strokeWidth="2.5" opacity="0.35"/>
            <line x1="148" y1="252" x2="200" y2="200" stroke="#84ABFF" strokeWidth="2.5" opacity="0.35"/>
            <line x1="252" y1="252" x2="200" y2="200" stroke="#84ABFF" strokeWidth="2.5" opacity="0.35"/>
            <circle cx="200" cy="200" r="18" fill="url(#hero-accent)" filter="url(#glow)"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
