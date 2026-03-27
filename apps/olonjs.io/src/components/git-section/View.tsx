import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { GitSectionData, GitSectionSettings } from './types';

export const GitSection: React.FC<{
  data: GitSectionData;
  settings?: GitSectionSettings;
}> = ({ data }) => {
  return (
    <div
      id="why"
      className="jp-git-section border-y border-border bg-card py-20"
    >
      <div className="max-w-[1040px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 items-center">

          {/* Left: title */}
          <div>
            {data.label && (
              <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-4">
                <span className="w-[18px] h-px bg-border" aria-hidden />
                {data.label}
              </div>
            )}
            <h2
              className="font-display font-bold tracking-[-0.03em] leading-[1.2] text-foreground"
              style={{ fontSize: 'clamp(26px, 3.5vw, 34px)' }}
              data-jp-field="title"
            >
              {data.title}
              {data.titleAccent && (
                <>
                  <br />
                  <span
                    className="bg-gradient-to-br from-[#84ABFF] to-[#1763FF] bg-clip-text text-transparent"
                    data-jp-field="titleAccent"
                  >
                    {data.titleAccent}
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Right: 2×2 card grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-jp-field="cards"
          >
            {data.cards?.map((card, idx) => (
              <Card
                key={(card as { id?: string }).id ?? idx}
                className="bg-background border-border p-5"
                data-jp-item-id={(card as { id?: string }).id ?? `wc-${idx}`}
                data-jp-item-field="cards"
              >
                <CardContent className="p-0">
                  <div className="text-[13px] font-semibold text-foreground mb-1.5">
                    {card.title}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground leading-[1.6]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
