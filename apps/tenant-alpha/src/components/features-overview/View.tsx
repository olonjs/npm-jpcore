// Layout: Hero=N/A, Features=BENTO (irregular grid)
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Mountain, Utensils } from 'lucide-react';
import type { FeaturesOverviewData, FeaturesOverviewSettings } from './types';

export const FeaturesOverview: React.FC<{ data: FeaturesOverviewData; settings: FeaturesOverviewSettings }> = ({ data }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'leaf': return <Leaf className="w-6 h-6" />;
      case 'mountain': return <Mountain className="w-6 h-6" />;
      case 'utensils': return <Utensils className="w-6 h-6" />;
      default: return <Leaf className="w-6 h-6" />;
    }
  };

  return (
    <section
      style={{
        '--local-bg': 'var(--background)',
        '--local-text': 'var(--foreground)',
        '--local-text-muted': 'var(--muted-foreground)',
        '--local-primary': 'var(--primary)',
        '--local-accent': 'var(--accent)',
        '--local-border': 'var(--border)',
        '--local-surface': 'var(--card)',
        '--local-radius-lg': 'var(--theme-radius-lg)',
        '--local-radius-md': 'var(--theme-radius-md)',
      } as React.CSSProperties}
      className="relative z-0 py-28 bg-[var(--local-bg)]"
    >
      <div className="max-w-[var(--theme-spacing-container-max)] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {data.label && (
            <div className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--local-accent)] mb-4" data-jp-field="label">
              <span className="w-5 h-px bg-[var(--local-primary)]" />
              {data.label}
            </div>
          )}
          <h2 className="font-display font-black text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight text-[var(--local-text)] mb-4" data-jp-field="title">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-lg text-[var(--local-text-muted)] max-w-2xl mx-auto" data-jp-field="description">
              {data.description}
            </p>
          )}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {data.features.map((feature, idx) => (
            <Card
              key={feature.id || `legacy-${idx}`}
              className={`
                bg-[var(--local-surface)] border-[var(--local-border)] rounded-[var(--local-radius-lg)]
                overflow-hidden group hover:shadow-lg transition-all duration-300
                ${idx === 0 ? 'lg:col-span-2' : ''}
                ${idx === 1 ? 'lg:row-span-2' : ''}
              `}
              data-jp-item-id={feature.id || `legacy-${idx}`}
              data-jp-item-field="features"
            >
              {feature.image?.url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image.url}
                    alt={feature.image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {feature.icon && (
                    <div className="absolute top-4 left-4 p-3 bg-[var(--local-primary)] rounded-[var(--local-radius-md)] text-white">
                      {getIcon(feature.icon)}
                    </div>
                  )}
                </div>
              )}
              
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-xl text-[var(--local-text)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--local-text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

