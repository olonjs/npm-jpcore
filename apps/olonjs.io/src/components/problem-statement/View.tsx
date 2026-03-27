import React from 'react';
import type { ProblemStatementData, ProblemStatementSettings } from './types';

export const ProblemStatement: React.FC<{
  data: ProblemStatementData;
  settings?: ProblemStatementSettings;
}> = ({ data }) => {
  return (
    <section id="problem" className="jp-problem py-24">
      <div className="max-w-[1040px] mx-auto px-8">

        {data.label && (
          <div className="inline-flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-[.12em] text-muted-foreground/60 mb-5">
            <span className="w-[18px] h-px bg-border" aria-hidden />
            {data.label}
          </div>
        )}

        {/* Split grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-border"
          style={{ gap: '1px', background: 'var(--border)' }}
        >
          {/* Problem cell */}
          <div className="bg-background p-10 md:p-[40px_42px]" data-jp-field="problemTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-red-500 mb-5">
              {data.problemTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.problemTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="problemItems">
              {data.problemItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `p-${idx}`}
                  data-jp-item-field="problemItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-red-500/10 text-red-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✕
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution cell */}
          <div className="bg-card p-10 md:p-[40px_42px]" data-jp-field="solutionTitle">
            <div className="text-[10.5px] font-bold tracking-[.10em] uppercase text-emerald-500 mb-5">
              {data.solutionTag}
            </div>
            <h3 className="text-[21px] font-bold tracking-[-0.02em] leading-[1.2] text-foreground mb-6">
              {data.solutionTitle}
            </h3>
            <ul className="flex flex-col gap-3.5" data-jp-field="solutionItems">
              {data.solutionItems?.map((item, idx) => (
                <li
                  key={(item as { id?: string }).id ?? idx}
                  className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-[1.65]"
                  data-jp-item-id={(item as { id?: string }).id ?? `s-${idx}`}
                  data-jp-item-field="solutionItems"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-sm bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <span>
                    {item.text}
                    {item.code && (
                      <> <code className="font-mono text-[11px] bg-muted border border-border rounded px-1.5 py-0.5 text-primary">
                        {item.code}
                      </code></>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
