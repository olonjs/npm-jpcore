import React from 'react';
import { useInView } from '@/lib/useInView';
import type { GalleryStripData, GalleryStripSettings } from './types';

export const GalleryStrip: React.FC<{ data: GalleryStripData; settings?: GalleryStripSettings }> = ({ data }) => {
  const sectionRef = useInView<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      style={{
        '--local-bg':         'var(--muted)',
        '--local-text':       'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary':    'var(--primary)',
        '--local-border':     'var(--border)',
      } as React.CSSProperties}
      className="sm-reveal relative z-0 py-16 md:py-20 bg-[var(--local-bg)]"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* HEADER */}
        {(data.label || data.title) && (
          <div className="mb-10">
            {data.label && (
              <div className="jp-section-label flex items-center gap-3 text-[var(--local-primary)] mb-3" data-jp-field="label">
                <span className="w-6 h-px bg-[var(--local-primary)]" aria-hidden />
                {data.label}
              </div>
            )}
            {data.title && (
              <h2
                className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-[var(--local-text)] leading-tight"
                data-jp-field="title"
              >
                {data.title}
              </h2>
            )}
          </div>
        )}

        {/* MASONRY-STYLE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {data.images.map((item, idx) => {
            // First item spans 2 rows for visual interest
            const isFeature = idx === 0;
            const imgUrl = item.image?.url || '';
            const imgAlt = item.image?.alt || item.caption || '';

            return (
              <div
                key={item.id ?? idx}
                className={[
                  'sm-gallery-item group relative overflow-hidden rounded-[16px] cursor-pointer',
                  isFeature ? 'md:row-span-2' : '',
                  isFeature ? 'aspect-[3/4] md:aspect-auto' : 'aspect-square',
                ].join(' ')}
                data-jp-item-id={item.id ?? `legacy-${idx}`}
                data-jp-item-field="images"
              >
                <img
                  src={imgUrl}
                  alt={imgAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* HOVER OVERLAY */}
                {item.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,24,6,0.75)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-[0.8rem] font-medium">
                      {item.caption}
                    </p>
                  </div>
                )}
                {/* BORDER OVERLAY ON HOVER */}
                <div className="absolute inset-0 border-2 border-[var(--local-primary)] opacity-0 group-hover:opacity-30 transition-opacity rounded-[16px] pointer-events-none" aria-hidden />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
