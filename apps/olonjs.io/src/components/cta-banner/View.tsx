import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OlonMark } from '@/components/ui/OlonMark';
import type { CtaBannerData, CtaBannerSettings } from './types';

export const CtaBanner: React.FC<{
  data: CtaBannerData;
  settings?: CtaBannerSettings;
}> = ({ data }) => {
  return (
    <section
      id="get-started"
      className="jp-cta-banner py-32 text-center relative overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(23,99,255,.07) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-[1040px] mx-auto px-8">

        {/* Spinning OlonMark */}
        <div
          className="w-[72px] h-[72px] mx-auto mb-9"
          style={{ animation: 'spin 22s linear infinite' }}
          aria-hidden
        >
          <OlonMark size={72} />
        </div>

        <h2
          className="font-display font-bold tracking-[-0.038em] leading-[1.1] text-foreground mx-auto mb-5"
          style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', maxWidth: '620px' }}
          data-jp-field="title"
        >
          {data.title}
        </h2>

        {data.description && (
          <p
            className="text-[16px] text-muted-foreground leading-[1.65] mx-auto mb-10"
            style={{ maxWidth: '460px' }}
            data-jp-field="description"
          >
            {data.description}
          </p>
        )}

        {data.ctas && data.ctas.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap">
            {data.ctas.map((cta, idx) => (
              <Button
                key={cta.id ?? idx}
                asChild
                variant={cta.variant === 'primary' ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  'gap-2 px-7',
                  cta.variant === 'primary' && 'shadow-[0_0_32px_rgba(23,99,255,.38)]'
                )}
              >
                <a
                  href={cta.href}
                  data-jp-item-id={cta.id ?? `cta-${idx}`}
                  data-jp-item-field="ctas"
                  target={cta.href?.startsWith('http') ? '_blank' : undefined}
                  rel={cta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {cta.variant === 'primary' ? (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
                      <rect x="2.5" y="2" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5.5 6h5M5.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
                      <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2.01 5.71 4.79 6.63.35.06.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.4.72-1.89-.07-.18-.31-.9.07-1.87 0 0 .59-.19 1.93.72A6.7 6.7 0 0 1 8 5.17c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.69.07 1.87.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.2 3.47.25.22.48.65.48 1.31v1.94c0 .19.12.4.48.34C12.99 13.71 15 11.09 15 8c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                    </svg>
                  )}
                  {cta.label}
                </a>
              </Button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
